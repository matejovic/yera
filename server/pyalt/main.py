import os
from datetime import datetime, timedelta
from typing import List, Optional

import requests
from readability import Document
import html2text
from fastapi import FastAPI, HTTPException, Depends, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import (Column, Integer, String, DateTime, Text,
                        ForeignKey, create_engine)
from sqlalchemy.orm import sessionmaker, relationship, declarative_base, Session

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "MY_SECRETS")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://fedora:atinfinity@localhost:5432/research-r"
)

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    bio = Column(String, nullable=True)
    entries = relationship("Entry", back_populates="user")

class Entry(Base):
    __tablename__ = "entry"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    content = Column(Text)
    extra = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    type = Column(String)
    user_id = Column(Integer, ForeignKey("user.id"))
    tags = relationship("Tag", back_populates="entry")
    user = relationship("User", back_populates="entries")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    color = Column(String, nullable=True)
    entry_id = Column(Integer, ForeignKey("entry.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    entry = relationship("Entry", back_populates="tags")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic schemas
class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class EntryCreate(BaseModel):
    url: str
    type: str

class TagOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class EntryOut(BaseModel):
    id: int
    url: str
    title: str
    content: str
    extra: str
    created_at: datetime
    type: str
    tags: List[TagOut] = []

    class Config:
        orm_mode = True

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Optional[str] = Cookie(None), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=UserOut)
def register(user_in: UserCreate, response: Response, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(user_in.password)
    user = User(email=user_in.email, password=hashed)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    token = create_access_token({"id": user.id})
    response.set_cookie(key="token", value=token, httponly=True)
    return user

@app.post("/auth/login")
def login(user_in: UserCreate, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not pwd_context.verify(user_in.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"id": user.id})
    response.set_cookie(key="token", value=token, httponly=True)
    return {"id": user.id}

@app.get("/auth/check")
def auth_check(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id}

@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}

@app.get("/entries", response_model=List[EntryOut])
def read_entries(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Entry).filter(Entry.user_id == current_user.id).order_by(Entry.created_at.asc()).all()

@app.get("/entry/{entry_id}", response_model=EntryOut)
def read_entry(entry_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@app.post("/entry", response_model=EntryOut)
def create_entry(entry_in: EntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    html = requests.get(entry_in.url).text
    doc = Document(html)
    extra = doc.summary()
    title = doc.title()
    content_md = html2text.html2text(extra)
    entry = Entry(
        url=entry_in.url,
        type=entry_in.type,
        title=title,
        content=content_md,
        extra=extra,
        user_id=current_user.id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@app.put("/entry/{entry_id}", response_model=EntryOut)
def update_entry(entry_id: int, tags: List[str], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    # sync tags
    existing = {t.name for t in entry.tags}
    # delete removed
    db.query(Tag).filter(Tag.entry_id == entry_id, ~Tag.name.in_(tags)).delete(synchronize_session=False)
    # add new
    for name in tags:
        if name not in existing:
            db.add(Tag(name=name, entry_id=entry_id))
    db.commit()
    db.refresh(entry)
    return entry