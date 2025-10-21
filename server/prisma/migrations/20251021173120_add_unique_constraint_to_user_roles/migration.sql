/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_roles" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_name_key" ON "user_roles"("name");
