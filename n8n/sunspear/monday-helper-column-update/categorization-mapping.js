// Helper functions
function colText(item, colId) {
  const col = (item.column_values || []).find(c => c.id === colId);
  return col ? (col.text || '') : '';
}

function colLinkedItems(item, colId) {
  const col = (item.column_values || []).find(c => c.id === colId);
  return col && col.linked_items ? col.linked_items : [];
}

// Get input
const input = $input.first().json;

// Ensure allItems is an array
let allItems = [];
try {
  allItems = typeof input.allItems === 'string' ? JSON.parse(input.allItems) : input.allItems;
  if (!Array.isArray(allItems)) allItems = [];
} catch {
  allItems = [];
}

const result = [];

// Loop using for…of
for (const item of allItems) {
  const itemId = item.id;

  const linkedItems = colLinkedItems(item, "board_relation_mkpk7nj7");
  for (const linkedItem of linkedItems) {
    const linkedItemId = linkedItem.id;
    const sentDate = colText(linkedItem, "date_mkpkc1ad");

    result.push({
      item_id: itemId,
      linked_item_id: linkedItemId,
      sent_date: sentDate
    });
  }
}

// Return in n8n format
return result.map(r => ({ json: {items: r} }));
