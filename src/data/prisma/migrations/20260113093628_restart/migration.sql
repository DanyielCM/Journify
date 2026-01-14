/*
  Warnings:

  - You are about to drop the column `emoji` on the `Mood` table. All the data in the column will be lost.
  - Added the required column `emoji_key` to the `Mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mood" DROP COLUMN "emoji",
ADD COLUMN     "emoji_key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
