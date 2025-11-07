declare
  result jsonb;
begin
  select jsonb_agg(row_to_json(f)) into result
  from (
  ---proposal_id : UUID
  
  
  -- System design related files
    SELECT f.*
    FROM proposal_versions pv
    CROSS JOIN LATERAL (
      SELECT DISTINCT elem->>'system_version_id' AS system_version_id
      FROM unnest(pv.designs) elem
    ) uniq
    JOIN system_design_components sdc 
      ON sdc.system_design_id::TEXT = uniq.system_version_id
    JOIN fm_files_components fc 
      ON fc.associate_with = sdc.component_library_id
    JOIN fm_files f
      ON f.id = fc.file_id
    WHERE pv.id::UUID = proposal_id

    UNION

    -- Adder related files
    SELECT f.*
    FROM proposal_versions pv
    CROSS JOIN LATERAL (
      SELECT DISTINCT elem->>'adder_set_id' AS adder_set_id
      FROM unnest(pv.designs) elem
    ) uniq
    JOIN adder_sets ads 
      ON ads.id::TEXT = uniq.adder_set_id
    JOIN adder_set_items adsi
      ON adsi.adder_set_id = ads.id
    JOIN fm_files_adders fa 
      ON fa.associate_with = adsi.adder_library_id
    JOIN fm_files f
      ON f.id = fa.file_id
    WHERE pv.id::UUID  = proposal_id
  ) f;

  return coalesce(result, '[]'::jsonb);
end;
