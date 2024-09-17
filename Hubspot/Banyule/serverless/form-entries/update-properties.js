
const baseURL = "https://api.hubapi.com"; 
const baseCRMObjURL = "crm/v3/objects";
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '{{TOKEN HERE}}'
  }
};

const updateProps = async (id, props) => {
  let result = { isSuccess: false, data: null, message: ''};
  const eURL = `${baseURL}/${baseCRMObjURL}/2-31715586/${id}`;
  const rowData = { properties: props };
  const newConfig = {
    method: "PATCH",
    ...config,
    body: JSON.stringify(rowData),
  };

  try{
    const res = await fetch(eURL, newConfig);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    result.isSuccess = true;
    result.data = data;
  }catch(error){
    result.message = error;
  }
  return result;
};

exports.main = async ({body}, sendRes) => {
  if(body && body.id && body.properties){
    const reqResult = await updateProps(body.id, body.properties);
    if(reqResult.isSuccess){
      sendRes({ body: reqResult, statusCode: 200 });
    }else{
      sendRes({ body: reqResult, statusCode: 200 });
    }
  }

  sendRes({ body: {result: "Nothing here" }, statusCode: 200 });
};

