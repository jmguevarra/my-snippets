-- Folder associates lookup
CREATE INDEX idx_folder_associates_type_id
  ON folder_associates (associate_type, associate_id);

-- Components lookup
CREATE INDEX idx_sdc_design_id
  ON system_design_components (system_design_id);

-- Adder items lookup
CREATE INDEX idx_asi_set_id
  ON adder_set_items (adder_set_id);

-- JSONB indexing (optional)
CREATE INDEX idx_pv_designs_gin
  ON proposal_versions USING gin (designs);
