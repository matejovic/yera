/*
  Warnings:

  - You are about to drop the column `md_content` on the `Bookmark` table. All the data in the column will be lost.
  - Added the required column `content_html` to the `Bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_md` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content_md" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "published_at" DATETIME NOT NULL
);
INSERT INTO "new_Bookmark" ("description", "id", "published_at", "title", "url") SELECT "description", "id", "published_at", "title", "url" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_url_key" ON "Bookmark"("url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
