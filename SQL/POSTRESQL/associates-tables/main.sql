-- ============================================================
-- TITLE: Fetch All Folder Records Associated With a Proposal
--
-- DESCRIPTION:
-- This query retrieves all folders connected to a specific 
-- proposal version. Associations come from:
--   • Project-level folder
--   • Payment-level folder
--   • Component-level folders (from JSONB `designs`)
--   • Adder-level folders (also from JSONB `designs`)
--
-- The query parses JSONB fields, joins to system components 
-- and adder sets, then maps all associations to fm_folders.
-- ============================================================

SELECT DISTINCT FMF.*
FROM proposal_versions AS PV

-- ------------------------------------------------------------
-- 1) Extract System Version IDs from the JSONB `designs` array
--    Each JSON element may contain "system_version_id"
-- ------------------------------------------------------------
CROSS JOIN LATERAL (
  SELECT DISTINCT elem->>'system_version_id' AS system_version_id
  FROM unnest(PV.designs) elem
) SYSPC

-- Join system version IDs to component records
LEFT JOIN system_design_components SDC
    ON SDC.system_design_id::TEXT = SYSPC.system_version_id

-- Map system components to folder associations
LEFT JOIN folder_associates AS FA_component
    ON FA_component.associate_type = 'component'
    AND FA_component.associate_id = SDC.component_id


-- ------------------------------------------------------------
-- 2) Extract Adder Set IDs from the JSONB `designs` array
--    Each JSON element may contain "adder_set_id"
-- ------------------------------------------------------------
CROSS JOIN LATERAL (
  SELECT DISTINCT elem->>'adder_set_id' AS adder_set_id
  FROM unnest(PV.designs) elem
) SYSPA

-- Join adder set IDs to adder items
LEFT JOIN adder_set_items AS ASI
      ON ASI.adder_set_id = SYSPA.adder_set_id::UUID

-- Map adders to folder associations
LEFT JOIN folder_associates AS FA_adder
    ON FA_adder.associate_type = 'adder'
    AND FA_adder.associate_id = ASI.adder_library_id


-- ------------------------------------------------------------
-- 3) Project Folder Association
-- ------------------------------------------------------------
LEFT JOIN folder_associates AS FA_project
    ON FA_project.associate_type = 'project'
    AND (FA_project.associate_id = PV.project_id OR FA_project.associate_id IS NULL)

-- ------------------------------------------------------------
-- 4) Payment Folder Association
-- ------------------------------------------------------------
LEFT JOIN folder_associates AS FA_payment
    ON FA_payment.associate_type = 'payment'
    AND FA_payment.associate_id = PV.payment_id 


-- ------------------------------------------------------------
-- 5) Final Join: Retrieve All Matching Folder Records
-- ------------------------------------------------------------
LEFT JOIN fm_folders AS FMF
    ON FMF.id IN (
        FA_project.folder_id,
        FA_payment.folder_id,
        FA_component.folder_id,
        FA_adder.folder_id
    )

-- ------------------------------------------------------------
-- Target Proposal Version
-- ------------------------------------------------------------
WHERE PV.id = 'd1f632b1-0692-4634-a0e2-ebd422fe8611';
