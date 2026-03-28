-- DropForeignKey
ALTER TABLE `budget_payments` DROP FOREIGN KEY `budget_payments_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `budget_payments` DROP FOREIGN KEY `budget_payments_wedding_id_fkey`;

-- AddForeignKey
ALTER TABLE `budget_payments` ADD CONSTRAINT `budget_payments_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_payments` ADD CONSTRAINT `budget_payments_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `budget_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
