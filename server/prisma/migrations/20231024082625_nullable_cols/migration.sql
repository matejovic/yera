-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserBookmark" (
    "user_id" INTEGER NOT NULL,
    "bookmark_id" INTEGER NOT NULL,
    "annotations" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user_id", "bookmark_id"),
    CONSTRAINT "UserBookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserBookmark_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "Bookmark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserBookmark" ("annotations", "bookmark_id", "created_at", "user_id") SELECT "annotations", "bookmark_id", "created_at", "user_id" FROM "UserBookmark";
DROP TABLE "UserBookmark";
ALTER TABLE "new_UserBookmark" RENAME TO "UserBookmark";
CREATE TABLE "new_Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_md" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "published_at" DATETIME
);
INSERT INTO "new_Bookmark" ("content_html", "content_md", "description", "id", "published_at", "title", "url") SELECT "content_html", "content_md", "description", "id", "published_at", "title", "url" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_url_key" ON "Bookmark"("url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
