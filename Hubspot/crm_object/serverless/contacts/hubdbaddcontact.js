const axios = require('axios');

exports.main = ({body}, sendResponse) => {
  const baseURL = "https://api.hubapi.com/cms/v3/hubdb/tables/20846409";
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '{TOKEN HERE}'
    }
  };
  if (body) {
    axios.post(`${baseURL}/rows/`, body, config).then((response)=>{
      if(response.status == 200){
        axios.post(`${baseURL}/draft/publish`, {}, config)
          .then(res=> { 
            sendResponse({ body: { response: {message: "Contact has been added", res: response} }, statusCode: 200 });
          }).catch((error)=>{
             sendResponse({ body: { error: `Contact added but not published: ${error}` }, statusCode: 500 });
          });
      }
    }).catch((error)=>{
      sendResponse({ body: { error: `Contact not added: ${error}` }, statusCode: 500 });
    });
  } else {
    sendResponse({ body: { error: 'Invalid request structure' }, statusCode: 400 });
  }
};

