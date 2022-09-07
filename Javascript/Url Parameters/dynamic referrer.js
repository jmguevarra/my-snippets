
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

const referrerUrl = function(queryKey, queryValue){
  let referrerKey = getUrlParameter(queryKey); //get value of query key
  if(referrerKey === undefined){ return; } //return if value is undefined

  let referrerLink = referrerKey.split('?')[0], //separate the domain from query strings
      valueIndex = referrerLink.indexOf(queryValue), //check if queryValue match in query key value
      flag = false;

  if(valueIndex !== -1){ flag = true; }
  return flag;
}; 

