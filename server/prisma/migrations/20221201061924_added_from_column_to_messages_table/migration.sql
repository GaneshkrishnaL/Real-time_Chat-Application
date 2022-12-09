/*
  Warnings:

  - Added the required column `from` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `from` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_from_fkey` FOREIGN KEY (`from`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
