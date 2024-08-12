const hubspot = require('@hubspot/api-client');
const ACCESS_TOKEN = "{TOKEN HERE}"

exports.main = async (context, sendResponse) => {
  const hubspotClient = new hubspot.Client({ "accessToken": ACCESS_TOKEN });

  try {
    const properties = ['firstname', 'lastname', 'email', 'mobilephone', 'bnts_school'];
    const limit = 100; 
    const rawContacts = [];
    let offset;

    do {
      const response = await hubspotClient.crm.contacts.basicApi.getPage(limit, offset, properties);
      rawContacts.push(...response.body.results);
      offset = response.body.paging ? response.body.paging.next.after : undefined;
    } while (offset);

    const contacts = rawContacts.map(x => {
      const props = x.properties;
      return {
        id: x.id,
        firstname: props.firstname,
        lastname: props.lastname,
        email: props.email,
        mobilephone: props.mobilephone,
        bnts_school: props.bnts_school
      }
    });
    sendResponse({
      statusCode: 200,
      body: contacts
    });
  } catch (error) {
    sendResponse({
      statusCode: 500,
      body: { message: error.message }
    });
  }
};
