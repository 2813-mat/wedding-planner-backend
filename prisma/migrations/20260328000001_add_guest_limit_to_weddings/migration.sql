-- AlterTable: add guest_limit column (nullable, no default — preserves all existing rows)
ALTER TABLE `weddings` ADD COLUMN `guest_limit` INT NULL;
