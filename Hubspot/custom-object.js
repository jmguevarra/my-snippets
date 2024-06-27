const axios = require('axios');
const baseURL = "https://api.hubapi.com"; //form entries
const formEntriesEURL = "/crm/v3/objects/2-31587822?properties=program_length,contact,form_type,form_id&associations=contacts";
// const contactEURL = "/crm/v3/objects/contacts";
const contactEURL = "/crm/v3/objects/contacts/batch/read";

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer [KEYHERE]'
  }
};
const formId = "a534c0e8-0ad2-4c00-af74-ad417bdb8061";
const formType = "consultation";

const getContactDetailsByIds = async (ids, assocContact) => {
  let defaultRes = { isSuccess: false, data: null, message: '' };
  const inputs = ids.map(i => ({"id": i}));
  const bodyData = {
    "inputs": inputs,
    "properties": ["email"],
    "idProperty": "hs_object_id"
  };
  const newConfig = {
    method: "POST",
    ...config,
    body: JSON.stringify(bodyData),
  };


  const resResult = await fetch(`${baseURL}${contactEURL}`, newConfig).then(response => {
    if (!response.ok) {
      defaultRes.message = `Contact getContactDetailsByIds was not success: ${response}`;
      return defaultRes;
    }
    return response.json(); 
  }).then(data => {


    if(data["status"] == "COMPLETE"){
      const contactsRes = data["results"];
      const contactsProps = contactsRes.map(cr => cr["properties"]);
      const contactPerson = contactsProps.map(cps => {
        return { id: cps["hs_object_id"], email: cps["email"] };
      });
      
      let updatedAssocData = [];
      contactPerson.forEach(cp => {
        const mappedEmail = assocContact.map(assocItem => {
          if(assocItem.contactId == cp.id){
            return {...assocItem, email: cp.email };
          }
          return null;  
        });
        const cleanAssocData = mappedEmail.filter(i => (i != null));
        updatedAssocData = [...updatedAssocData, ...cleanAssocData];
      });

      return { isSuccess: true, data: updatedAssocData,  message: "Associated Form Entries with contact successuly retreived!"};
    }
  }).catch((error)=> {
    defaultRes.message = `Contact getContactDetailsByIds has error:${error}`;
    return defaultRes;
  });

  return resResult;
};

// const getContactDetailsById = async (id) => {
//   return await fetch(`${baseURL}${contactEURL}/${id}`, config).then(response => {
//     if (response.ok) { return response.json(); }
//     return { isSuccess: false, data: null};
//   }).then(data => {
//     const contactProps = data["properties"];
//     const email = { [id]: contactProps["email"] };
//     return { isSuccess: true, data: email};
//   }).catch((error)=> {
//     return { isSuccess: false, data: null};
//   });
// };

const getFormEntries = async ()=> {
  let responseResult = { isSuccess: false, data: null, message: '' };
  
  const result = await fetch(`${baseURL}${formEntriesEURL}`, config).then(response => {
    if (response.ok) { 
      return response.json();
    }
    responseResult.message = "HTTP Request has error";
    return responseResult;
  }).then(data => {
    const results = data["results"];
    if(results.length > 0){

      const assocContactRaw = results.map((item)=>{
        const props = item["properties"];
        if(props["form_type"] == formType && props["form_id"] == formId){
          const contactResult = item["associations"]["contacts"]["results"];
          return {
            formEntryId: item["id"],
            contactId: contactResult[0]["id"]
          }
        }
      });

      const assocContacts = assocContactRaw.filter(x => x != null);
      const contactIds = [...new Set(assocContacts.map((i)=> i.contactId))];
      responseResult.isSuccess = true;
      responseResult.data = {
        contactIds: contactIds,
        assocContacts: assocContacts,
      }
      return responseResult;
    }
    return responseResult;
  }).catch(error => {
    responseResult.message = error;
    return responseResult;
  });

  return result;
};


exports.main = async (context, sendResponse) => {
  const formEntriesRes = await getFormEntries();
  if(formEntriesRes.isSuccess){
    const { contactIds, assocContacts } = formEntriesRes.data;
    const contactRes = await getContactDetailsByIds(contactIds, assocContacts);
    if(contactRes.isSuccess){
      sendResponse({ body: contactRes.data, statusCode: 500 });
    }
  }
  
  sendResponse({ body: {data: [], message: "Something went wrong!"} , statusCode: 500 });
//   const rr = await getContactDetailsByIds(["24914122819","31150352925"], [{"formEntryId":"13732671529","contactId":"24914122819"},{"formEntryId":"13733437450","contactId":"31150352925"}]);
  //31150352925
//     const contactResult = await getContactDetailsById("31150352925");
//     sendResponse({ body: {results: contactResult, d: 9} , statusCode: 200 });
  

};

