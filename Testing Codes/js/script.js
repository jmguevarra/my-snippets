/*
 * Callback function
 */


const formSubmit = function(preSubmit, postSubmit){ //regular function, // preSubmit, postSubmit - (parameter) is a callback function

    preSubmit(); //do something before form submission

    //do for present form submission

    postSubmit(); //do something after form submission
}


//Invoke Function with call back

formSubmit(
    function(){ //preSumbit

    },

    function(){ //postSubmit

    }
); //preSubmit or postSubmit is argument in this function


