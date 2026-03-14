-- AlterTable
ALTER TABLE `budget_categories` ADD COLUMN `color` VARCHAR(20) NOT NULL DEFAULT '#8B7355';

-- AlterTable
ALTER TABLE `checklist_items` ADD COLUMN `period` VARCHAR(100) NOT NULL DEFAULT '';
