const metaResp = $('Get DNS Sheet Metadata').item.json;
const colAResp = $input.first().json;

const sheets = metaResp.sheets || [];
const dnsSheet = sheets.find(s => s.properties && s.properties.title === 'DNS List');
const sheetId = dnsSheet ? dnsSheet.properties.sheetId : 0;

const values = colAResp.values || [];
let headerRowIndex = -1;
for (let i = 0; i < values.length; i++) {
  if (values[i] && values[i][0] && values[i][0].includes('Below is the full DNS List')) {
    headerRowIndex = i;
    break;
  }
}

const dnsSheetId = $('Categorize All Items').item.json.dnsSheetId;

if (headerRowIndex >= 0) {
  return [{
    json: {
      shouldCreateFilter: true,
      dnsSpreadsheetId: dnsSheetId,
      filterBody: JSON.stringify({
        requests: [{
          setBasicFilter: {
            filter: {
              range: {
                sheetId: sheetId,
                startRowIndex: headerRowIndex,
                startColumnIndex: 0
              }
            }
          }
        }]
      })
    }
  }];
} else {
  return [{
    json: {
      shouldCreateFilter: false,
      dnsSpreadsheetId: dnsSheetId,
      filterBody: '{}'
    }
  }];
}
