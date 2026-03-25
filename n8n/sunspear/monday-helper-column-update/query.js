const input = $input.first().json;


let queryBody;
if (!input.cursor || input.cursor === '') {
  const query = `{boards(ids:8707938312){items_page(limit:500 query_params: {rules: [{column_id: "status",compare_value: [3]}]}){cursor items{id name column_values(ids: ["board_relation_mkpk7nj7", "status"]){id text value ... on BoardRelationValue{display_value linked_items{id name column_values {id text value}}}}}}}}`;
  queryBody = JSON.stringify({ query });
} else {
  const query = `{next_items_page(limit:500 cursor:"${input.cursor}"){cursor items{id name column_values(ids: ["board_relation_mkpk7nj7", "status"]){id text value ... on BoardRelationValue{display_value linked_items{id name column_values {id text value}}}}}}}`;
  queryBody = JSON.stringify({ query });
}

return [{
  json: {
    allItems: input.allItems,
    pageIndex: input.pageIndex,
    queryBody
  }
}];
