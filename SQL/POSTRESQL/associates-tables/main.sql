/* 
===============================================
Query: Get All Folders Linked to a Proposal Version
Description:
    This query returns BOTH project-related and 
    payment-related folders associated with a 
    specific proposal version. It handles:
      - Direct project folder associations
      - Direct payment folder associations
      - Global project folders (associate_id = NULL)
    The result is a distinct list of fm_folders rows.
===============================================
*/

SELECT DISTINCT FMF.*
FROM proposal_versions AS VS

-- Project folder association
-- Matches folders linked to the proposal's project_id,
-- including global project folders where associate_id is NULL.
LEFT JOIN folder_associates AS FA_project
    ON FA_project.associate_type = 'project'
    AND (FA_project.associate_id = VS.project_id OR FA_project.associate_id IS NULL)

-- Payment folder association
-- Matches folders linked to the proposal's payment_id.
LEFT JOIN folder_associates AS FA_payment
    ON FA_payment.associate_type = 'payment'
    AND FA_payment.associate_id = VS.payment_id

-- Join matching folder IDs from either project or payment associations
LEFT JOIN fm_folders AS FMF
    ON FMF.id IN (
        FA_project.folder_id,
        FA_payment.folder_id
    )

-- Filter by the target proposal version
WHERE VS.id = 'd1f632b1-0692-4634-a0e2-ebd422fe8611';
