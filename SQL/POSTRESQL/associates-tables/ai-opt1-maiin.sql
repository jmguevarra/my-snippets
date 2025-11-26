-- ============================================================
-- TITLE: Fetch All Related Folders for a Proposal Version
-- Optimized Query
-- ============================================================

WITH
-- Extract unique system_version_ids from JSONB array
system_versions AS (
    SELECT DISTINCT elem->>'system_version_id' AS system_version_id
    FROM proposal_versions,
         jsonb_array_elements(designs) elem
    WHERE id = $1
),

-- Extract unique adder_set_ids from JSONB array
adder_sets AS (
    SELECT DISTINCT elem->>'adder_set_id' AS adder_set_id
    FROM proposal_versions,
         jsonb_array_elements(designs) elem
    WHERE id = $1
)

SELECT DISTINCT FMF.*
FROM proposal_versions PV

-- Components
LEFT JOIN system_versions SV
       ON TRUE
LEFT JOIN system_design_components SDC
       ON SDC.system_design_id::TEXT = SV.system_version_id
LEFT JOIN folder_associates FA_component
       ON FA_component.associate_type = 'component'
      AND FA_component.associate_id = SDC.component_id

-- Adders
LEFT JOIN adder_sets AS AT
       ON TRUE
LEFT JOIN adder_set_items AS ASI
       ON ASI.adder_set_id::TEXT = AT.adder_set_id
LEFT JOIN folder_associates FA_adder
       ON FA_adder.associate_type = 'adder'
      AND FA_adder.associate_id = ASI.adder_library_id

-- Project
LEFT JOIN folder_associates FA_project
       ON FA_project.associate_type = 'project'
      AND (FA_project.associate_id = PV.project_id 
        OR FA_project.associate_id IS NULL)

-- Payment
LEFT JOIN folder_associates FA_payment
       ON FA_payment.associate_type = 'payment'
      AND FA_payment.associate_id = PV.payment_id

-- Join folders
LEFT JOIN fm_folders FMF
       ON FMF.id IN (
            FA_project.folder_id,
            FA_payment.folder_id,
            FA_component.folder_id,
            FA_adder.folder_id
       )

WHERE PV.id = $1;
