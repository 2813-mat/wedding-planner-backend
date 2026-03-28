-- CreateTable
CREATE TABLE `budget_payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `wedding_id` BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `date` DATE NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

  PRIMARY KEY (`id`),
  INDEX `budget_payments_wedding_id_idx` (`wedding_id`),
  INDEX `budget_payments_category_id_idx` (`category_id`),
  CONSTRAINT `budget_payments_wedding_id_fkey`
    FOREIGN KEY (`wedding_id`) REFERENCES `weddings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `budget_payments_category_id_fkey`
    FOREIGN KEY (`category_id`) REFERENCES `budget_categories` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
