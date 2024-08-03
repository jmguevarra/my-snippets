
const BASEURL = "https://api.hubapi.com"; 
const limit = 2500;
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '{{KEY HERE}}'
  }
};

const mappedWithProps = (obj, propsVals) => {
  const keys = Object.keys(propsVals);
  
  if(obj.results.length > 0){
   
    let properties = obj.results;
    keys.forEach(key => {
      const includedValues = propsVals[key].split(";");
      properties = properties.map(i => {
        const propValue = i.values[key];
        return includedValues.includes(propValue) ? { id: i.id, name: propValue, type: "foreignid"  } : null;
      }).filter(i => (i != null));
    });
    
    return {keys: keys, props: properties };
  }
  
  return obj;
};

const getForeignTableRows = async (tableId, propsVals)=> {
  let result = { isSuccess: false, data: null, message: ''};
  const eUrl = `${BASEURL}/cms/v3/hubdb/tables/${tableId}/rows?limit=${limit}`;

  try{
    const res = await fetch(eUrl, config);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const props = mappedWithProps(data, propsVals);
    result = { isSuccess: true, data: props, message: "Data fetched!" }; 
  }catch(error){
    result.message = error;
  }
    
  return result;
};
 
exports.main = async ({body}, sendRes) => {
  if(body){
    const reqResult = await getForeignTableRows(body.tableId, body.propertiesValues);
    sendRes({ body: {data: reqResult }, statusCode: 200 })
//     if(reqResult.isSuccess){
//       sendRes({ body: reqResult.data, statusCode: 200 });
//     }
  }
  
  sendRes({ body: {result: "Something went wrong!" }, statusCode: 200 });
};
