-- ============================================================
-- FUNCTION: fetch_proposal_folders(proposal_uuid UUID)
-- DESCRIPTION: Fetch all folder records associated with a given proposal version
-- ============================================================
CREATE OR REPLACE FUNCTION fetch_proposal_folders(proposal_uuid UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT FMF.*
    FROM proposal_versions AS PV

    -- 1) Extract System Version IDs from JSONB `designs`
    CROSS JOIN LATERAL (
        SELECT DISTINCT elem->>'system_version_id' AS system_version_id
        FROM unnest(PV.designs) elem
    ) SYSPC

    LEFT JOIN system_design_components SDC
        ON SDC.system_design_id::TEXT = SYSPC.system_version_id

    LEFT JOIN folder_associates AS FA_component
        ON FA_component.associate_type = 'component'
        AND FA_component.associate_id = SDC.component_id

    -- 2) Extract Adder Set IDs from JSONB `designs`
    CROSS JOIN LATERAL (
        SELECT DISTINCT elem->>'adder_set_id' AS adder_set_id
        FROM unnest(PV.designs) elem
    ) SYSPA

    LEFT JOIN adder_set_items AS ASI
        ON ASI.adder_set_id = SYSPA.adder_set_id::UUID

    LEFT JOIN folder_associates AS FA_adder
        ON FA_adder.associate_type = 'adder'
        AND FA_adder.associate_id = ASI.adder_library_id

    -- 3) Project Folder Association
    LEFT JOIN folder_associates AS FA_project
        ON FA_project.associate_type = 'project'
        AND (FA_project.associate_id = PV.project_id OR FA_project.associate_id IS NULL)

    -- 4) Payment Folder Association
    LEFT JOIN folder_associates AS FA_payment
        ON FA_payment.associate_type = 'payment'
        AND FA_payment.associate_id = PV.payment_id 

    -- 5) Final Join: Retrieve All Matching Folder Records
    LEFT JOIN fm_folders AS FMF
        ON FMF.id IN (
            FA_project.folder_id,
            FA_payment.folder_id,
            FA_component.folder_id,
            FA_adder.folder_id
        )

    -- Filter by provided proposal ID
    WHERE PV.id = proposal_uuid;
END;
$$ LANGUAGE plpgsql STABLE;
