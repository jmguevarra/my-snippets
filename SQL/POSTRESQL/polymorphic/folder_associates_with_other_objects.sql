DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', FA.id,
      'folder_id', FA.folder_id,
      'associate_id', FA.associate_id,
      'associate_type', FA.associate_type,
      'created_at', FA.created_at,
      'project', CASE WHEN P.id IS NOT NULL THEN
      jsonb_build_object(
        'id', P.id,
        'name', P.name,
        'address_line_1', P.address_line_1,
        'address_line_2', P.address_line_2,
        'city', P.city,
        'state', P.state,
        'zip', P.zip,
        'island', P.island
      ) ELSE NULL END,
      'component', CASE WHEN C.id IS NOT NULL THEN
      jsonb_build_object(
        'id', C.id,
        'code', C.code,
        'type', C.type
      ) ELSE NULL END,
      'adder_library', CASE WHEN AL.id IS NOT NULL THEN
      jsonb_build_object(
        'id', AL.id,
        'code', AL.code,
        'type', AL.type
      ) ELSE NULL END,
      'payment', CASE WHEN PO.id IS NOT NULL THEN
      jsonb_build_object(
        'id', PO.id,
        'type', PO.type,
        'title', PO.title,
        'description', PO.description
      ) ELSE NULL END
    )
  )
  INTO result
  FROM folder_associates AS FA
  LEFT JOIN projects AS P 
         ON P.id = FA.associate_id AND FA.associate_type = 'project'
  LEFT JOIN components AS C 
         ON C.id = FA.associate_id AND FA.associate_type = 'component'
  LEFT JOIN adders_library AS AL 
         ON AL.id = FA.associate_id AND FA.associate_type = 'adder'
  LEFT JOIN payment_options AS PO 
         ON PO.id = FA.associate_id AND FA.associate_type = 'payment'
  WHERE 
    (
      (_id IS NOT NULL AND FA.id = _id)
      OR (_id IS NULL AND _associate_id IS NOT NULL AND FA.associate_id = _associate_id)
      OR (_id IS NULL AND _associate_id IS NULL AND _folder_id IS NOT NULL AND FA.folder_id = _folder_id)
    )
    AND FA.associate_type = _type::file_folder_associate_type;

  RETURN result;
END;
