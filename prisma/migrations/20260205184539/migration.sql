-- AddForeignKey
ALTER TABLE `honeymoon` ADD CONSTRAINT `honeymoon_wedding_id_fkey` FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
