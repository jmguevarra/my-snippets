/*
 * Url String Parameter  
 */

 // const getUrlParam = function(param){
 //    let rawParams = decodeURIComponent(window.location.search).slice(1).split('&'); //Get Strings parameter form url
 //    let paramValue =  '';
 //    rawParams.forEach(function(obj){
 //      let paramArr = obj.split('=');
 //      if(paramArr[0] === param){ paramValue = paramArr[1]; }  
 //    });
 //    return paramValue;
 //  };


//Arrow Function
const getUrlParam = param =>{
    let rawParams = decodeURIComponent(window.location.search).slice(1).split('&');
    let paramValue = '[First Name]'; //Default Value if param not exists; 

    rawParams.forEach(obj =>{
        let paramArr = obj.split('=');
        if(paramArr[0] === param){ paramValue = paramArr[1]; }
    });
    return paramValue;
}

console.log(getUrlParam('last_name'));

