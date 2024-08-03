const baseURL = "https://api.hubapi.com"; 
const baseCRMObjURL = "crm/v3/objects";
const CMSTABLE_BOOKED_PROGRAM_ID = "3417993";
const CRMOBJ_FORMENTRYID = "2-31715586";
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': '{{KEY HERE}}'
  }
};

const addCMSTableRow = async (tableId, rowData) => {
  const cmsEURL = `cms/v3/hubdb/tables/${tableId}`;
  let result = { isSuccess: false, data: null, message: ''};
  const newConfig = {
    method: "POST",
    ...config,
    body: JSON.stringify(rowData),
  };

  const resResult = await fetch(`${baseURL}/${cmsEURL}/rows/`, newConfig).then((response) => {
    if (response.ok) { return response.json(); }
    result.message = `Request has and error: ${JSON.stringify(response)}`;
    return result;
  }).then(data => {
    if(data && data.id){ result = { isSuccess: true, data: data, message: "Added Successfully" }; }
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
};

const addBookedPrograms = async (rowData) => {
  let result = { isSuccess: false, data: null, message: ''};

  const resAddRow = await addCMSTableRow(CMSTABLE_BOOKED_PROGRAM_ID, rowData);
  if(resAddRow.isSuccess){
    result = resAddRow;
    const cmsPublishEURL = `${baseURL}/cms/v3/hubdb/tables/${CMSTABLE_BOOKED_PROGRAM_ID}`;
    const publishRes = await publishCMSTable(cmsPublishEURL);
    if(publishRes.isSuccess){
      result = { isSuccess: true, data: { published: publishRes.data }, message: publishRes.message };
    }
  }
  return result;
};


exports.main = async ({body}, sendRes) => {
  if(body && body.values){
    const reqResult = await addBookedPrograms(body);
    if(reqResult.isSuccess){
      
      const formEntryProps = {
        id: body.values.crm_form_entry_id,
        properties: { bkpros_status: "Completed" }
      };
      const newConfig = {
        ...config,
        method: "POST",
        body: JSON.stringify(formEntryProps)
      };
      const updateResCRM = await fetch("https://mp.kongo.melbourne/_hcms/api/form-entry/update-properties", newConfig);
      const crmResData = await updateResCRM.json();
      if(crmResData.isSuccess){
        sendRes({ body: { cmsResData: reqResult, crmResData: crmResData, message: "Successfully processed the data."}, statusCode: 200 });
      }else{
        sendRes({ body: { cmsResData: reqResult.data, crmResData: crmResData, message: "CMS Booking Program is updated but CRM form entry is not."}, statusCode: 200 });
      }
    }else{
      sendRes({ body: reqResult, statusCode: 200 });
    }
  }

  sendRes({ body: {result: "Nothing here" }, statusCode: 200 });
};

