const input = $('Build App Pipeline Query').first().json;
const httpResp = $input.first().json;

// Ensure prevItems is always an array
let prevItems = [];
try {
  const parsed = JSON.parse(input.allItems || '[]');
  prevItems = Array.isArray(parsed) ? parsed : [];
} catch {
  prevItems = [];
}

// Extract page items and cursor safely
const data = httpResp.data;
const pageItems = data?.boards?.[0]?.items_page?.items
                || data?.next_items_page?.items
                || [];
const newCursor = data?.boards?.[0]?.items_page?.cursor
                || data?.next_items_page?.cursor
                || null;

// Merge items and increment page index
const allItems = [...prevItems, ...pageItems];
const pageIndex = (input.pageIndex || 0) + 1;

return [{
  json: {
    cursor: newCursor || "",
    pageIndex,
    hasMore: !!newCursor,
    allItems: JSON.stringify(allItems),
  }
}];
