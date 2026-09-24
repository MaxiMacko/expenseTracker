-- Create users and sessions before attaching existing operational data.
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

INSERT INTO "User" ("id", "username", "passwordHash", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'baboolzeen', 'legacy-expense-tracker:657bdb085de5c7e42e4f3641ba2eec91034d03e0f80c081a12bd765a7ccc35b76a9754f89bc68180f0aa0c0caf5c89bcd5c502c40fe6664197ec0535c35798e7', CURRENT_TIMESTAMP);

ALTER TABLE "Expense" ADD COLUMN "userId" TEXT;
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;
UPDATE "Expense" SET "userId" = '00000000-0000-0000-0000-000000000001';
UPDATE "Category" SET "userId" = '00000000-0000-0000-0000-000000000001';
ALTER TABLE "Expense" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

DROP INDEX "Category_name_key";
CREATE INDEX "Expense_userId_date_idx" ON "Expense"("userId", "date");
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
