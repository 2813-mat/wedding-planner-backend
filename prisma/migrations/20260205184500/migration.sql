-- DropForeignKey
ALTER TABLE
    `gifts` DROP FOREIGN KEY `gifts_wedding_id_fkey`;

-- DropForeignKey
ALTER TABLE
    `honeymoon` DROP FOREIGN KEY `honeymoon_wedding_id_fkey`;

-- DropIndex
DROP INDEX `honeymoon_wedding_id_key` ON `honeymoon`;

-- AlterTable
ALTER TABLE
    `honeymoon`
ADD
    COLUMN `status` ENUM(
        'planejando',
        'cotando',
        'escolhida',
        'descartada'
    ) NOT NULL DEFAULT 'planejando';

-- CreateIndex
CREATE INDEX `honeymoon_wedding_id_idx` ON `honeymoon`(`wedding_id`);

-- AddForeignKey
ALTER TABLE
    `gifts`
ADD
    CONSTRAINT `fk_gifts_wedding_unique` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;