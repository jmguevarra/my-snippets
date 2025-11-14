-- Function to get JSON representation of folder children
-- @param _parent_id UUID: The ID of the parent folder to fetch children for
-- @param _parent_path TEXT: The current path of the parent folder to construct full paths for child folders
-- @instruction: Recursively fetch all child folders of the given parent folder and return as JSONB

DECLARE
    -- Variable to store the resulting JSON array of child folders
    result jsonb;
BEGIN
    -- Aggregate all child folders of the given parent_id into a JSON array
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', f.id,  -- Folder ID
                'parent_id', f.parent_id,  -- Parent folder ID
                'owner_id', f.owner_id,  -- Folder owner ID
                'name', f.name,  -- Folder name
                'path', _parent_path || ',' || f.name,  -- Construct full path
                'children', get_folder_children_json(f.id, _parent_path || ',' || f.name)  -- Recursively fetch children
            )
        ),
        '[]'::jsonb  -- Default to empty array if no children found
    )
    INTO result
    FROM fm_folders f
    WHERE f.parent_id = _parent_id;  -- Filter folders by parent ID

    -- Return the aggregated JSONB result
    RETURN result;
END;
