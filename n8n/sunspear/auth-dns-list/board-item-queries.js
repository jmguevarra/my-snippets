const input = $input.first().json;


let queryBody;
if (!input.cursor || input.cursor === '') {
  const query = `{boards(ids:8707938312){items_page(limit:500 query_params:{rules:[{column_id:"board_relation_mkp5t11a" compare_value:[${input.brandId}]}]}){cursor items{id name group {id title} column_values{id text value ... on BoardRelationValue{display_value linked_items{id}}}}}}}`;
  queryBody = JSON.stringify({ query });
} else {
  const query = `{next_items_page(limit:500 cursor:"${input.cursor}"){cursor items{id name group {id title} column_values{id text value ... on BoardRelationValue{display_value linked_items{id}}}}}}`;
  queryBody = JSON.stringify({ query });
}

return [{
  json: {
    allItems: input.allItems,
    pageIndex: input.pageIndex,
    queryBody
  }
}];
