-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "extra" TEXT NOT NULL,
    "published_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "type" TEXT NOT NULL,
    CONSTRAINT "Entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Entry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("content", "created_at", "extra", "id", "published_at", "title", "type", "url", "user_id") SELECT "content", "created_at", "extra", "id", "published_at", "title", "type", "url", "user_id" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE UNIQUE INDEX "Entry_parent_id_key" ON "Entry"("parent_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
