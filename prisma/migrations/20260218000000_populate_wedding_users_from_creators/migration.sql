-- Popula wedding_users com os criadores dos casamentos existentes
-- para que casamentos antigos continuem visíveis aos seus criadores
INSERT INTO wedding_users (wedding_id, user_id, is_owner, can_edit)
SELECT id, created_by, 1, 1
FROM weddings w
WHERE NOT EXISTS (
  SELECT 1 FROM wedding_users wu
  WHERE wu.wedding_id = w.id AND wu.user_id = w.created_by
);
