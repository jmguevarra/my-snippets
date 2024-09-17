const axios = require('axios');

exports.main = (res, sendResponse) => {
  const baseURL = "https://api.hubapi.com/crm/v3/objects/2-31562174"; //form entries
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'TOKEN HERE'
    }
  };
  axios.get(`${baseURL}`, config).then((response)=>{
    console.log(response, 2);
    sendResponse({ body: { response }, statusCode: 200 });
//     if(response.status == 200){
//       sendResponse({ body: { response }, statusCode: 200 });
//     }
  }).catch((error)=>{
    sendResponse({ body: { error: `Request has error: ${error}` }, statusCode: 500 });
  });
};

