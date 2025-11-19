/**
 * Recursively filters a folder tree by folder name.
 * 
 * @param {Array} tree - The folder tree (array of folder objects). 
 *                       Each folder can have a 'children' array for nested folders.
 * @param {string} searchTerm - The term to search for in folder names.
 * @returns {Array} - Array of folder objects whose names include the search term,
 *                    including matches from nested children.
 */
const filterFoldersByName = (tree, searchTerm) => {
    const result = []; // Array to store matching folders

    // Loop through each folder in the current level of the tree
    tree.forEach(folder => {
        // Check if the folder's name includes the search term (case-insensitive)
        if (folder.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            result.push(folder); // Add matching folder to the result
        }

        // If this folder has children, search recursively in the children
        if (folder.children && folder.children.length > 0) {
            const childResults = filterFoldersByName(folder.children, searchTerm);
            // Add any matching children to the result array
            result.push(...childResults);
        }
    });

    return result; // Return all matches found at this level and in children
};

// Example usage:
// 'searchText' is the string to search for in folder names
const searchTerm = searchText;

// 'folder' is the root folder tree (can contain nested children)
const filtered = filterFoldersByName(folder, searchTerm);

// Return or use the filtered results
return filtered;
