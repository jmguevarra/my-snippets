--folder_id : TEXT


DECLARE
  path jsonb;
BEGIN
  WITH RECURSIVE folder_path AS (
    SELECT id, parent_id, name
    FROM fm_folders
    WHERE id = folder_id::UUID
    UNION ALL
    SELECT f.id, f.parent_id, f.name
    FROM fm_folders f
    INNER JOIN folder_path fp ON fp.parent_id = f.id
  )
  SELECT jsonb_agg(
           jsonb_build_object(
             'id', id,
             'name', name
           )
           ORDER BY id
         )
  INTO path
  FROM folder_path;

  RETURN path;
END;
