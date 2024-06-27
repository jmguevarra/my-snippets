const baseURL = "https://api.hubapi.com"; //form entries
// const formEntriesEURL = "/crm/v3/objects/2-31587822?properties=program_length,contact,form_type,form_id&associations=contacts";
// // const contactEURL = "/crm/v3/objects/contacts";
const contactBaseEURL = "crm/v3/objects/contacts/";
const WEBHOOK_CONTACT_SUBSTYPE = "contact.creation";
const CREATE_CONTACT_SUBSID = 2675588;
const CMSTABLE_CONTACTID = 20846409;
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer keyHere'
  }
};

// {
//   "appId": 3435896,
//   "eventId": 100,
//   "subscriptionId": 2675465,
//   "portalId": 7549024,
//   "occurredAt": 1719454544267,
//   "subscriptionType": "contact.propertyChange",
//   "attemptNumber": 0,
//   "objectId": 123,
//   "changeSource": "CRM",
//   "propertyName": "firstname",
//   "propertyValue": "sample-value",
//   "isSensitive": false
// }

//     {
//   "appId": 3435896,
//   "eventId": 100,
//   "subscriptionId": 2675588,
//   "portalId": 7549024,
//   "occurredAt": 1719454395030,
//   "subscriptionType": "contact.creation",
//   "attemptNumber": 0,
//   "objectId": 123,
//   "changeSource": "CRM",
//   "changeFlag": "NEW"
// }

const getContactById = async (id) => {
  let result = { isSuccess: false, data: null, message: ''};
  const includedProperties = [
    "hs_object_id",
    "email",
    "name",
    "firstname",
    "lastname",
    "mobilephone",
    "phone",
  ];
  const params = `properties=${includedProperties.join(',')}`;

  const contact = await fetch(`${baseURL}/${contactBaseEURL}/${id}?${params}`, config)
  .then(response =>{
    if (response.ok) { return response.json(); }
    result.message = `Contact request has and error: ${response}`;
    return result;
  }).then(data => {
    if(Object.keys(data).length > 1){
      result = {
        isSuccess: true,
        data: data.properties,
        message: "Successfully get the contact details"
      }
    }
    return result;
  }).catch(error => {
    result.message = `Getting contact by its ID has an error: ${error}`;
    return result;
  });

  return result;
};

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

const addCMSTableRow = async (tableId, rowData) => {
  const cmsContactEURL = `cms/v3/hubdb/tables/${tableId}`;
  let result = { isSuccess: false, data: null, message: ''};
  const newConfig = {
    method: "POST",
    ...config,
    body: JSON.stringify(rowData),
  };

  const contactCreationRes = await fetch(`${baseURL}/${cmsContactEURL}/rows/`, newConfig).then((response) => {
    if (response.ok) { return response.json(); }
    result.message = `Contact request has and error: ${JSON.stringify(response)}`;
    return result;
  }).then(data => {
    if(data){ result = { isSuccess: true, data: data, message: "Contact has been added" }; }
    return result;
  }).catch((error) => {
    result.message = `Getting contact by its ID has an error: ${error}`;
    return result;
  });

  return result;
}

//check if CRM contacts already in hubspot db contact table
const isContactExist = async (id) => {
  const endpoint = `${baseURL}/cms/v3/hubdb/tables/20846409/rows?crmid=${id}`;
  const reqResult = await fetch(endpoint, config).then(response => {
    if (response.ok) { return response.json(); }
    return false;
  }).then(data => {
    if(data.total > 0) { return true; } 3
    return false;
  }).catch(error => {
    return false;
  });

  return reqResult;
}

const createContact = async (id) => {
  let result = { isSuccess: false, data: null, message: ''};
  const contactExist = await isContactExist(id);
  
  if(!contactExist){
    //mapped values and add row on contact table of CMS
    const contactRes = await getContactById(id);
    if(contactRes.isSuccess && contactRes.data){
      const contact = contactRes.data;
      const contactData = {
        "values": {
          "firstname": contact.firstname,
          "lastname": contact.lastname,
          "email": contact.email,
          "mobilephone": contact.mobilephone,
          "fullname": contact.name,
          "crmid": contact.hs_object_id
        }
      };
      //add new row with mapped data
      const contactCreationRes = await addCMSTableRow(CMSTABLE_CONTACTID, contactData);
      if(contactCreationRes.isSuccess){
        result = contactCreationRes;
        const cmsContactPublishEURL = `${baseURL}/cms/v3/hubdb/tables/${CMSTABLE_CONTACTID}`;
        const publishRes = await publishCMSTable(cmsContactPublishEURL);
        if(publishRes.isSuccess){
          result = { isSuccess: true, data: { contactRes: data, published: publishRes.data }, message: publishRes.message };
        }
      }
    }
  }

  return result;
};

exports.main = async ({body, params}, sendRes) => {
  if(body && body.length > 0){
    const webhookData = body[0];
    if(webhookData.subscriptionId == CREATE_CONTACT_SUBSID){
      const reqResult = await createContact(webhookData.objectId);
      if(reqResult.isSuccess){
        sendRes({ body: {result: reqResult }, statusCode: 200 });
      }
    }
  }
  sendRes({ body: {result: "Nothing here" }, statusCode: 200 });
};

