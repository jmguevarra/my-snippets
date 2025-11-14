-- Function to get a complete folder tree as JSON
-- @param _folder_id UUID: The ID of the root folder to start building the tree from
-- @instruction: Recursively fetch the folder and all its descendants, constructing a JSONB object with nested children

DECLARE
    -- Variable to store the resulting JSON tree
    result jsonb;
BEGIN
    -- Recursive CTE to get the folder and all its descendants
    WITH RECURSIVE folder_tree AS (
        -- Base case: start with the root folder
        SELECT
            f.id,           -- Folder ID
            f.parent_id,    -- Parent folder ID
            f.owner_id,     -- Folder owner ID
            f.name,         -- Folder name
            f.name AS path  -- Initial path starts with folder name
        FROM fm_folders f
        WHERE f.id = _folder_id

        UNION ALL

        -- Recursive case: get children of folders already in the tree
        SELECT
            f.id,
            f.parent_id,
            f.owner_id,
            f.name,
            ft.path || ',' || f.name AS path  -- Append child folder name to path
        FROM fm_folders f
        INNER JOIN folder_tree ft ON f.parent_id = ft.id
    )
    -- Build nested JSON for the root folder including its children
    SELECT jsonb_build_object(
        'id', root.id,
        'parent_id', root.parent_id,
        'owner_id', root.owner_id,
        'name', root.name,
        'path', root.path, 
        'children', get_folder_children_json(root.id, root.path)  -- Recursively fetch children JSON
    )
    INTO result
    FROM folder_tree root
    WHERE root.id = _folder_id;

    -- Return the final JSON tree
    RETURN result;
END;
