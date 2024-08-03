const baseURL = "https://api.hubapi.com/cms/v3/hubdb/tables"; 
const CMSTABLE_BOOKED_PROGRAM_ID = "3417993";
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '{{Key HERE}}'
  }
};


const updateCMSTableRow = async (rowData) => {
  let result = { isSuccess: false, data: null, message: ''};
  const newConfig = {
    method: "PATCH",
    ...config,
    body: JSON.stringify(rowData.data),
  };

  const cmsEURL = `${baseURL}/${CMSTABLE_BOOKED_PROGRAM_ID }/rows/${rowData.id}/draft`;
  const resResult = await fetch(cmsEURL, newConfig).then((response) => {
    if (response.ok) { return response.json(); }
    result.message = `Request has and error: ${JSON.stringify(response)}`;
    return result;
  }).then(data => {
    if(data && data.id){ result = { isSuccess: true, data: data, message: "Updated Successfully" }; }
    return result;
  }).catch((error) => {
    result.message = `Something went wrong: ${error}`;
    return result;
  });

  return resResult;
}


const publishCMSTable = async (endpoint) => {
  let result = { isSuccess: false, data: null, message: ''};
  const newConfig = {
    method: "POST",
    ...config,
  };

  const resResult = await fetch(`${endpoint}/draft/publish`, newConfig).then((response) => {
    if (response.ok) { return response.json(); }
    result.message = `Publishing Table has an error: ${JSON.stringify(response)}`;
    return result;
  }).then(data => {
    if(data){ result = { isSuccess: true, data: data, message: "Table is now published" }; }
    return result;
  }).catch((error) => {
    result.message = `Publishing Table has an error: ${error}`;
    return result;
  });

  return resResult;
}

exports.main = async ({body}, sendRes) => {
  if(body && body.data){
    const updateRes = await updateCMSTableRow(body);
    if(updateRes.isSuccess){
      const cmsPublishEURL = `${baseURL}/${CMSTABLE_BOOKED_PROGRAM_ID}`;
      const publishRes = await publishCMSTable(cmsPublishEURL);
      if(publishRes.isSuccess){
         sendRes({ body: { cmsTableRes: updateRes.data, published: publishRes.data, message: "Successfully updated and published the record."}, statusCode: 200 });
      }else{
        sendRes({ body: {  cmsTableRes: updateRes.data, message: "CMS Booked Program is updated but not published"}, statusCode: 200 });
      }
    }else{
      sendRes({ body: updateRes, statusCode: 200 });
    }
  }

  sendRes({ body: {result: "Nothing here" }, statusCode: 200 });
};
