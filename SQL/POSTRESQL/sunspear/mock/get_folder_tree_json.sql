--folder_id : UUID


DECLARE
  result jsonb;
BEGIN
  WITH RECURSIVE subfolders AS (
    SELECT 
      f.*,
      ARRAY[f.name] AS path
    FROM fm_folders f
    WHERE f.id = folder_id

    UNION ALL

    SELECT 
      f.*,
      sf.path || f.name
    FROM fm_folders f
    INNER JOIN subfolders sf ON f.parent_id = sf.id
  )
  SELECT jsonb_agg(
    to_jsonb(s) || jsonb_build_object('path', s.path)
  )
  INTO result
  FROM subfolders s;

  RETURN COALESCE(result, '[]'::jsonb);
END;
