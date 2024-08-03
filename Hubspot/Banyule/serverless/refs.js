const BASEURL = "https://api.hubapi.com"; 
const limit = 2500;
const config = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '{{KEY HERE}}'
  }
};

const mappedWithProps = (obj, prop, values) => {
  const includedValues = values.split(";");
  
  if(obj.results.length > 0){
    const properties = obj.results.map(i => {
      const name = i.values[prop];
      return includedValues.includes(name) ? { id: i.id, name: name, type: "foreignid"  } : null;
    }).filter(i => (i != null));
    
    return properties;
  }
  
  return obj;
};

const getForeignTableRows = async (tableId, prop, values)=> {
  let result = { isSuccess: false, data: null, message: ''};
  const eUrl = `${BASEURL}/cms/v3/hubdb/tables/${tableId}/rows?limit=${limit}`;
  
  const reqResult = await fetch(eUrl, config)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      if(data){ 
        const props = mappedWithProps(data, prop, values);
        result = { isSuccess: true, data: props, message: "Data fetched!" }; 
      }
      return result;
    })
    .catch(error => {
      result.message = `Something went wrong: ${error}`;
      return result;
    });  
  
  return reqResult;
};
 
exports.main = async ({params}, sendRes) => {
  if(params){
    const reqResult = await getForeignTableRows(params.tableId[0], params.prop[0], params.values[0]);
    if(reqResult.isSuccess){
      sendRes({ body: reqResult.data, statusCode: 200 });
    }
  }
  
  sendRes({ body: {result: "Something went wrong!" }, statusCode: 200 });
};
