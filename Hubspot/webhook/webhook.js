
const baseURL = "https://api.hubapi.com"; //form entries
// const formEntriesEURL = "/crm/v3/objects/2-31587822?properties=program_length,contact,form_type,form_id&associations=contacts";
// // const contactEURL = "/crm/v3/objects/contacts";
const contactBaseEURL = "crm/v3/objects/contacts/";
const CREATE_CONTACT_SUBSID = 2675588;
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer KEYHERE'
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

const createContact = async (data) => {
  const cmsContactEURL = "cms/v3/hubdb/tables/20846409";
  let result = { isSuccess: false, data: null, message: ''};

  //create contact
  const contactRes = await getContactById("31150352925");
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
    const newConfig = {
      method: "POST",
      ...config,
      body: JSON.stringify(contactData),
    };
    
    const contactCreationRes = await fetch(`${baseURL}/${cmsContactEURL}/rows/`, newConfig).then((response) => {
      if (response.ok) { return response.json(); }
      result.message = `Contact request has and error: ${JSON.stringify(response)}`;
      return result;
    }).then(data => {
      if(data){
        result = {
          isSuccess: true,
          data: data,
          message: "Contact has been added"
        };
        
    
        //       axios.post(`${baseURL}/draft/publish`, {}, config)
        //         .then(res=> { 
        //         result.message = "Contact has been added";
        //         result.data = response;
        //         return result;
        //       }).catch((error)=>{
        //         result.message = `There's error on publishing contacts: ${error}`;
        //         return result;
        //       });
      }
      return result;
    }).catch((error) => {
      result.message = `Getting contact by its ID has an error: ${error}`;
      return result;
    });
    if(contactCreationRes.isSuccess){
      result = contactCreationRes;
    }
  }
  //end create contact

  return result;
};

exports.main = async ({body, params}, sendRes) => {
  const subscriptionId = body.subscriptionId;

  if(subscriptionId == CREATE_CONTACT_SUBSID){
    const reqResult = await createContact(body);
    sendRes({ body: {result: reqResult  }, statusCode: 200 });
  }

  if(params){
    sendRes({ body: {result: "getContactById"}, statusCode: 200 });
  }

};

