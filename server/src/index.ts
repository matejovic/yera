import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client"
import { swagger } from "@elysiajs/swagger"
import { cors } from '@elysiajs/cors'
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'
import { parseArticle } from "../parse";

const BASE_URL = process.env.BASE_URL || ""



let corsConfig = {
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}

if (process.env.NODE_ENV === 'development') {
  corsConfig.origin = 'localhost:5173'
}

const db = new PrismaClient()
const app = new Elysia({ prefix: BASE_URL })
.use(cookie())
.use(
  jwt({
    name: 'jwt',
    // This should be Environment Variable
    secret: 'MY_SECRETS',
    exp: "7d"
  })
)
.use(swagger())
.use(cors(
  corsConfig
)) // TODO: fix before production
.get("/auth/check", async ({ cookie: { token }, jwt }) => {
  // check if the user is authenticated
  const token_data = await jwt.verify(token);

  if (!token_data) {
    return { message: "Unauthorized" };
  }

  return {
    id: token_data.id
  };

})
.post("/auth/logout", async ({ cookie, setCookie }) => {
  // invalidate the JWT token
  setCookie('token', '', { httpOnly: true });
  return { message: "Logged out" };
})
.post("/auth/login", async ({ jwt, cookie, setCookie, params }) => {
  // return a JWT token
  const token = await jwt.sign({ id: 1 });
  setCookie('token', token, { httpOnly: true });
  // return a cookie
  return { token: token }
})
.post("/auth/register", async ({ body, jwt, cookie, setCookie }) => {

})
.get("/bookmarks", async ({ cookie: { token }, jwt }) => {

  const token_data = await jwt.verify(token);

  if (!token_data) {
    // show only public bookmarks
    return { message: "Unauthorized" };
  }

  const bookmarks = await db.userBookmark.findMany({
    where: {
      user_id: token_data.id,
    },
    select: {
      bookmark: {
        select: {
          id: true,
          url: true,
          title: true,
          published_at: true,
        },
      },
      created_at: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  });
  return bookmarks;
})
.get("/bookmark/:id", async ({ params }) => {
  const { id } = params;
  const bookmark = await db.bookmark.findUnique({
    where: { id: Number(id) },
  });
  return bookmark;
})
.post("/bookmark", async ({ body }) => {
  // TODO: check if the user is authenticated
  const { url } = body;

  // TODO: check if the bookmark already exists
  // if yes, check if UserBookmark exists (for id=1), if yes, return it
  // if UserBookmark does not exist, create it and return it

  // we can do this in a separate worker thread
  const articleData = await parseArticle(url);
  
  // store data in the database
  const bookmarkData = {
    url: url,
    title: articleData.title,
    content_md: articleData.content_md,
    content_html: articleData.content_html
  }
  
  // we need to return prisma Promise, not the data
  return db.userBookmark.create({
    data: {
      user: { connect: { id: 1 }},
      bookmark: { create: bookmarkData },
      annotations: 'fixme',
    },
    include: { bookmark: true }
  })

}, {
  body: t.Object({
    url: t.String(),
  })
})

.listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


export type App = typeof app;