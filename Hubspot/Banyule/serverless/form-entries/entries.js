const hubspot = require('@hubspot/api-client');
const ACCESS_TOKEN = "TOKEN HERE";

const bookingProperties = [
  'contact',
  'form_type',
  'form_label',
  'form_id',
  'bkcons_teacher_requirement',
  'program_interest',
  'bkcons_booking_reminder_date',
  'bkcons_program_length',
  'bkcons_school_cost',
  'bkcons_programs',
  'bkcons_room',
  'bkcons_staffing_needs',
  'assigned_staff',
  'bkcons_softwares',
  'bkcons_equipments',
  'bkcons_learning_outcomes',
  'bkcons_additional_notes',
  'bkcons_location_site',
  'bkcons_estimate_number_of_students',
  'bkcons_estimate_number_of_teachers',
  'bkcons_bus_transportation',
  'bkpros_start_date',
  'bkpros_end_date',
  'bkpros_start_time',
  'bkpros_end_time',
  'bkpros_students_number',
  'bkpros_teachers_number',
  'bkpros_year_level',
  'bkpros_status',
  'bus_pick_up_location',
  'bus_pick_up_time',
  'bus_return_pick_up_location',
  'bus_return_pick_up_time',
  'bkpros_bus_email',
  'bus_company_name',
  'bus_booking_date'
];

const getContactDetailsByIds = async (ids, assocContact) => {
  const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });
  let defaultRes = { isSuccess: false, data: null, message: '' };


  const inputs = ids.map(i => ({"id": i}));
  const bodyData = {
    "inputs": inputs,
    "properties": ["email", "firstname", "lastname", "mobilephone", 'bnts_school'],
    "idProperty": "hs_object_id"
  };

  try{
    const apiRes = await hubspotClient.apiRequest({
      method: 'POST',
      path: `/crm/v3/objects/contacts/batch/read`,
      body: bodyData
    });


    if(apiRes.body.status == "COMPLETE"){
      const contactsRes = apiRes.body.results;
      const contactsProps = contactsRes.map(cr => cr.properties);
      const contactPerson = contactsProps.map(cps => {
        return { 
          id: cps["hs_object_id"],
          email: cps["email"],
          firstname: cps.firstname,
          lastname: cps.lastname,
          mobilephone: cps.mobilephone,
          bnts_school: cps.bnts_school
        };
      });

      let updatedAssocData = [];
      contactPerson.forEach(cp => {
        const mappedEmail = assocContact.map(assocItem => {
          if(assocItem.contactId == cp.id){
            return {
              ...assocItem,
              email: cp.email,
              firstname: cp.firstname,
              lastname: cp.lastname,
              mobilephone: cp.mobilephone,
              bnts_school: cp.bnts_school
            };
          }
          return null;  
        });
        const cleanAssocData = mappedEmail.filter(i => (i != null));
        updatedAssocData = [...updatedAssocData, ...cleanAssocData];
      });

      defaultRes.isSuccess = true;
      defaultRes.data = contactsRes;
      defaultRes.message = "Associated Form Entries with contact successuly retreived!";
    }

    return defaultRes;
  }catch(e){
    if (e.message === 'HTTP request failed' && e.response) {
      console.error(JSON.stringify(e.response, null, 2));
    } else {
      console.error(e);
    }

    defaultRes.message = e.message;
    defaultRes.data = e.response ? e.response.body : e;
    return defaultRes;
  }
};

const getFormEntries = async (formType) => {
  const hubspotClient = new hubspot.Client({ accessToken: ACCESS_TOKEN });
  let responseResult = { isSuccess: false, data: null, message: '' };

  const bodyProps = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'form_type', 
            operator: 'EQ',
            value: formType 
          }
        ]
      }
    ],
    limit: 100,  
    after: 0,
    properties: bookingProperties
  };
  let rawData = [];
  let offset;

  try {

    do {
      const apiRes = await hubspotClient.apiRequest({
        method: 'POST',
        path: '/crm/v3/objects/2-31715586/search',
        body: bodyProps
      });

      rawData.push(...apiRes.body.results);
      offset = apiRes.body.paging ? apiRes.body.paging.next.after : undefined;
    } while (offset);

    if(rawData.length > 1){ 
      const formEntryIds = rawData.map((item)=> ({id: item.id}));
      const assocFormEntries = { "inputs": formEntryIds };

      //get Associated Ids with Contacts
      const apiResAssocEntries = await hubspotClient.apiRequest({
        method: 'POST',
        path: '/crm/v4/associations/2-31715586/contacts/batch/read',
        body: assocFormEntries
      });

      const assocEntriesResBody = apiResAssocEntries.body;
      if(assocEntriesResBody.status == "COMPLETE"){
        const contactIds = assocEntriesResBody.results.map((item) => ({                                              
          formEntryId: item.from.id,
          contactId: item.to[0].toObjectId
        }));

        const assocContactRaw = rawData.map((item) => {
          const props = item.properties;
          if(formType.toLowerCase() == "booking proposal"){
            //Proposal Only
            if(props.form_type == formType && props.bkpros_status == "Active" ){
              const contactResult = contactIds.find(x => x.formEntryId == item.id);
              return {
                formEntryId: item.id,
                properties: props,
                contactId: contactResult.contactId
              }
            }
          }else{
            //Default
            if(props.form_type == formType){
              const contactResult = contactIds.find(x => x.formEntryId == item.id);
              return {
                formEntryId: item.id,
                properties: props,
                contactId: contactResult.contactId
              }
            }
          }
        });

        const assocContacts = assocContactRaw.filter(x => x != null);
        const uniqueContactIds = [...new Set(assocContacts.map((i)=> i.contactId))];

        responseResult.isSuccess = true;
        responseResult.data = {
          contactIds: uniqueContactIds,
          assocContacts: assocContacts,
        }
      }
    }
    return responseResult;
  } catch (e) {
    if (e.message === 'HTTP request failed' && e.response) {
      console.error(JSON.stringify(e.response, null, 2));
    } else {
      console.error(e);
    }

    responseResult.message = e.message;
    responseResult.data = e.response ? e.response.body : e;
    return responseResult;
  }
};

exports.main = async ({body, params}, sendResponse) => {
  if(params && params.form_type){
    const formEntriesRes = await getFormEntries(params.form_type[0]);
    if(formEntriesRes.isSuccess){
      const { contactIds, assocContacts } = formEntriesRes.data;
      const contactRes = await getContactDetailsByIds(contactIds, assocContacts);
      sendResponse({ body: contactRes, statusCode: 200 });

      //       if(contactRes.isSuccess){
      //         sendResponse({ body: contactRes.data, statusCode: 200 });
      //       }
    }
  }
  sendResponse({ body: {data: [], message: "Nothing found here."} , statusCode: 200 });
}
