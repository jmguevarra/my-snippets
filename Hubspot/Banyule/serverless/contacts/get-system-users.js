const hubspot = require('@hubspot/api-client');
const ACCESS_TOKEN = "{{TOKEN HERE}}";
const ILSID_SYSUSERLIST = '103'; //membership ID for the system users of booking System.

exports.main = async (context, sendResponse) => {
  const hubspotClient = new hubspot.Client({ "accessToken": ACCESS_TOKEN });
  try {
    const limit = 100; 
    const memberRecords = [];
    let offset;

    do {
      const response = await hubspotClient.apiRequest({
        method: "GET",
        path: `/crm/v3/lists/${ILSID_SYSUSERLIST}/memberships`,
      });
      memberRecords.push(...response.body.results);
      offset = response.body.paging ? response.body.paging.next.after : undefined;
    } while (offset);

    const contactIds = memberRecords.map(x => ({id: x.recordId}));
    
    if(contactIds.length > 0){
      const contactsRes = await hubspotClient.apiRequest({
        method: "POST",
        path: `/crm/v3/objects/contacts/batch/read`,
        body: {
          "inputs": contactIds,
          "properties": [
            "firstname",
            "lastname",
            "email",
            "mobilephone",
            "booking_system_user_type"
          ],
          "idProperty": "hs_object_id"
        }
       });
      if(contactRes.status == "COMPLETE"){
        sendResponse({
          statusCode: 200,
          body: {data: contactsRes.results, message: "Success"}
        });
      }else{
        sendResponse({
          statusCode: 200,
          body: {data: [], message: "Something went wrong"}
        });
      }
    }else{
      sendResponse({
        statusCode: 200,
        body: {data: [], message: "No records on the list"}
      });
    }
  } catch (error) {
    sendResponse({
      statusCode: 500,
      body: { message: error.message }
    });
  }
};
