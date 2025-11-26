CREATE VIEW proposal_related_folders AS
WITH
system_versions AS (
    SELECT PV.id AS proposal_id, elem->>'system_version_id' AS system_version_id
    FROM proposal_versions PV,
         jsonb_array_elements(PV.designs) elem
),
adder_sets AS (
    SELECT PV.id AS proposal_id, elem->>'adder_set_id' AS adder_set_id
    FROM proposal_versions PV,
         jsonb_array_elements(PV.designs) elem
)
SELECT DISTINCT
    PV.id AS proposal_id,
    FMF.*
FROM proposal_versions PV

LEFT JOIN system_versions SV
       ON SV.proposal_id = PV.id
LEFT JOIN system_design_components SDC
       ON SDC.system_design_id::TEXT = SV.system_version_id
LEFT JOIN folder_associates FA_component
       ON FA_component.associate_type = 'component'
      AND FA_component.associate_id = SDC.component_id

LEFT JOIN adder_sets AS AT
       ON AT.proposal_id = PV.id
LEFT JOIN adder_set_items AS ASI
       ON ASI.adder_set_id::TEXT = AT.adder_set_id
LEFT JOIN folder_associates FA_adder
       ON FA_adder.associate_type = 'adder'
      AND FA_adder.associate_id = ASI.adder_library_id

LEFT JOIN folder_associates FA_project
       ON FA_project.associate_type = 'project'
      AND (FA_project.associate_id = PV.project_id 
        OR FA_project.associate_id IS NULL)

LEFT JOIN folder_associates FA_payment
       ON FA_payment.associate_type = 'payment'
      AND FA_payment.associate_id = PV.payment_id 

LEFT JOIN fm_folders FMF
       ON FMF.id IN (
            FA_project.folder_id,
            FA_payment.folder_id,
            FA_component.folder_id,
            FA_adder.folder_id
       );
