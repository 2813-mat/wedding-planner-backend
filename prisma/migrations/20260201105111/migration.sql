/*
  Warnings:

  - You are about to drop the column `contract_date` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `service_date` on the `vendors` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `vendors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `vendors` DROP COLUMN `contract_date`,
    DROP COLUMN `paid`,
    DROP COLUMN `service_date`,
    DROP COLUMN `website`;
