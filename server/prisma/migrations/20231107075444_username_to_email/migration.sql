
ALTER TABLE "User" RENAME COLUMN "username" TO "email";

-- RedefineIndex
DROP INDEX "User_username_key";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
