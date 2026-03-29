-- Normalize guests.relation to standard frontend values
UPDATE `guests` SET `relation` = 'Família' WHERE LOWER(`relation`) IN ('familia', 'família', 'family');
UPDATE `guests` SET `relation` = 'Amigo'   WHERE LOWER(`relation`) IN ('amigo', 'amiga', 'friend', 'amigos');
UPDATE `guests` SET `relation` = 'Trabalho' WHERE LOWER(`relation`) IN ('trabalho', 'work', 'colega', 'colega de trabalho');

-- Normalize guests.group_name to standard frontend values
UPDATE `guests` SET `group_name` = 'Família Noiva' WHERE LOWER(`group_name`) IN ('familia_noiva', 'familia noiva', 'família noiva', 'family_bride', 'family bride');
UPDATE `guests` SET `group_name` = 'Família Noivo' WHERE LOWER(`group_name`) IN ('familia_noivo', 'familia noivo', 'família noivo', 'family_groom', 'family groom');
UPDATE `guests` SET `group_name` = 'Amigos'         WHERE LOWER(`group_name`) IN ('amigos', 'friends', 'amigo');
UPDATE `guests` SET `group_name` = 'Trabalho'       WHERE LOWER(`group_name`) IN ('trabalho', 'work', 'colegas', 'colegas de trabalho');
