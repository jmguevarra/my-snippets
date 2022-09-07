
// sample api url - https://jsonplaceholder.typicode.com/users

/** Old Asynchrounous with callback function
* 

const loadUsers = function(url, callback = function(){}){
    if( url == null ){ return; } 

    //Do action here
    const request = new XMLHttpRequest();

    //Do event listenter first before send the request
    request.addEventListener('readystatechange', function(){
        if(request.readyState === 4 && request.status === 200){
            let data = JSON.parse(request.responseText);
            callback(undefined, data);
        }else if(request.readyState === 4){
            let errMessage = 'Could not fetch the data. ERROR: '+request.status +' - visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status for more info.';
            callback(errMessage, undefined);
        }
    });

    request.open('GET', url);
    request.send();
}

//Usage with Callbacks
loadUsers('https://jsonplaceholder.typicode.com/users', function(err, data){
    if(err){ console.error(err); return; }
    
    console.log(data); //can loop here

});

*/


/** Fetch 
 *

fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(json => {
        json.forEach(item => {
            console.log(item.company);
            //console.log(`My name is ${item.name} and my email is ${item.email}`);
        });
    }).catch(err => console.error('Rejected ', err));

*/

