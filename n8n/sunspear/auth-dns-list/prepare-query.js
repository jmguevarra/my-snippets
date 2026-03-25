let brand = $input.first().json.query?.brand; 
let graphqlQuery;

if (brand) {
  // Option A: Filtering by brand name
  graphqlQuery = `{ 
    boards(ids: 8707940198) { 
      items_page(limit: 200, query_params: { 
        rules: [{ 
          column_id: "name", 
          compare_value: ["${brand}"], 
          operator: contains_text 
        }] 
      }) { 
        items { 
          id 
          name 
          state 
          column_values(ids: ["boolean_mm16wr1g", "boolean_mm16vrs2"]) { 
            id 
            text 
            value 
          } 
        } 
      } 
    } 
  }`;
} else {
  // Option B: No filter
  graphqlQuery = `{ 
    boards(ids: 8707940198) { 
      items_page(limit: 200) { 
        items { 
          id 
          name 
          state 
          column_values(ids: ["boolean_mm16wr1g", "boolean_mm16vrs2"]) { 
            id 
            text 
            value 
          } 
        } 
      } 
    } 
  }`;
}

// Wrap it in the expected Monday.com JSON structure
return [{ 
  json: { 
    queryBody: { query: graphqlQuery } 
  } 
}];
