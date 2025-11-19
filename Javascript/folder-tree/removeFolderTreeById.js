/**
 * Recursively removes a folder (and its nested children) from a folder tree by ID.
 * 
 * @param {Array} tree - The folder tree (array of folder objects).
 *                       Each folder can have a 'children' array for nested folders.
 * @param {string|number} idToRemove - The ID of the folder to remove.
 * @returns {Array} - A new folder tree with the specified folder removed.
 */
const removeFolderById = (tree, idToRemove) => {
  return tree
    // Filter out the folder at the current level that matches the ID
    .filter(folder => folder.id !== idToRemove)
    .map(folder => {
      // If the folder has children, recursively remove the folder from them
      if (folder.children && folder.children.length > 0) {
        return {
          ...folder, // Keep current folder properties
          children: removeFolderById(folder.children, idToRemove) // Process children recursively
        };
      }
      // If no children, return the folder as is
      return folder;
    });
};

// Usage example:
// 'folders' is the root folder tree
// 'idToRemove' is the ID of the folder you want to delete
const updatedTree = removeFolderById(folders, idToRemove);

// Return or use the updated tree
return updatedTree;
