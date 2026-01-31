-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NULL,
    `role` ENUM('noivo', 'convidado', 'admin') NOT NULL DEFAULT 'noivo',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weddings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `wedding_date` DATE NOT NULL,
    `location` VARCHAR(255) NULL,
    `budget_total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `couple_name_1` VARCHAR(100) NULL,
    `couple_name_2` VARCHAR(100) NULL,
    `created_by` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wedding_users` (
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `is_owner` BOOLEAN NOT NULL DEFAULT false,
    `can_edit` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`wedding_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(30) NULL,
    `relation` VARCHAR(50) NULL,
    `group_name` VARCHAR(100) NULL,
    `plus_one` BOOLEAN NOT NULL DEFAULT false,
    `confirmed` TINYINT NULL,
    `adults` INTEGER NOT NULL DEFAULT 1,
    `children` INTEGER NOT NULL DEFAULT 0,
    `invitation_sent_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `category` ENUM('buffet', 'cerimonia', 'decoracao', 'fotografia', 'musica', 'bolo', 'outros') NOT NULL,
    `contact_name` VARCHAR(100) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('cotando', 'contratado', 'pago', 'cancelado') NOT NULL DEFAULT 'cotando',
    `notes` TEXT NULL,
    `contract_date` DATE NULL,
    `service_date` DATE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `allocated` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `spent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `allocated` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `spent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `vendor_id` BIGINT UNSIGNED NULL,
    `notes` TEXT NULL,
    `due_date` DATE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NULL,
    `due_offset` INTEGER NOT NULL DEFAULT 0,
    `priority` ENUM('alta', 'media', 'baixa') NOT NULL DEFAULT 'media',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `template_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NULL,
    `due_date` DATE NULL,
    `completed_at` TIMESTAMP(0) NULL,
    `priority` ENUM('alta', 'media', 'baixa') NOT NULL DEFAULT 'media',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gifts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(12, 2) NULL,
    `link` VARCHAR(500) NULL,
    `image_url` VARCHAR(500) NULL,
    `reserved_by` BIGINT UNSIGNED NULL,
    `purchased` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gift_contributions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `guest_id` BIGINT UNSIGNED NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `method` ENUM('pix', 'cartao', 'dinheiro', 'outro') NOT NULL DEFAULT 'pix',
    `receipt_url` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `contributed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `honeymoon` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `destination` VARCHAR(150) NULL,
    `departure_date` DATE NULL,
    `return_date` DATE NULL,
    `budget` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `honeymoon_wedding_id_key`(`wedding_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_files` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `wedding_id` BIGINT UNSIGNED NOT NULL,
    `entity_type` ENUM('wedding', 'vendor', 'gift', 'budget_item', 'checklist_item', 'honeymoon') NOT NULL,
    `entity_id` BIGINT UNSIGNED NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_type` ENUM('image', 'pdf', 'doc', 'other') NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `description` TEXT NULL,
    `uploaded_by` BIGINT UNSIGNED NOT NULL,
    `uploaded_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_entity`(`entity_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `weddings` ADD CONSTRAINT `weddings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedding_users` ADD CONSTRAINT `wedding_users_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wedding_users` ADD CONSTRAINT `wedding_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guests` ADD CONSTRAINT `guests_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guests` ADD CONSTRAINT `guests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendors` ADD CONSTRAINT `vendors_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_categories` ADD CONSTRAINT `budget_categories_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_items` ADD CONSTRAINT `budget_items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `budget_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budget_items` ADD CONSTRAINT `budget_items_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `checklist_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifts` ADD CONSTRAINT `gifts_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gifts` ADD CONSTRAINT `gifts_reserved_by_fkey` FOREIGN KEY (`reserved_by`) REFERENCES `guests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gift_contributions` ADD CONSTRAINT `gift_contributions_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gift_contributions` ADD CONSTRAINT `gift_contributions_guest_id_fkey` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `honeymoon` ADD CONSTRAINT `honeymoon_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_files` ADD CONSTRAINT `media_files_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_files` ADD CONSTRAINT `media_files_uploaded_by_fkey` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
