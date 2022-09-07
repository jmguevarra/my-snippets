
//loop age
//const validAge =  document.querySelector('#age');

const validAge = function(minAge, maxAge){
    //check first if valid number
    const minAgeType = typeof minAge, maxAgeType = typeof maxAge;
    if(minAgeType !== 'number' || maxAgeType !== 'number'){ return; }

    //Do Actions
    const Ages = [];
    for(let i = Math.trunc(minAge); i <= Math.trunc(maxAge); i++){
        Ages.push(i);
        if(i === maxAge){ break; }
    }

    return Ages;
}

let ages = validAge(18, 50);
ages.forEach(function(age){
    const ageTag = document.querySelector('#age');
    const optionTag = document.createElement('option');
    optionTag.value = age;
    optionTag.innerHTML = age;
    ageTag.appendChild(optionTag);
});