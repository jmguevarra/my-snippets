const companies = [
    {name: "Company One", category: "Finance", start: 1981, end: 2003},
    {name: "Company Two", category: "Retail", start: 1992, end: 2008},
    {name: "Company Three", category: "Auto", start: 1999, end: 2007},
    {name: "Company Four", category: "Retail", start: 1989, end: 2010},
    {name: "Company Five", category: "Technology", start: 2009, end: 2014},
    {name: "Company Six", category: "Finance", start: 1987, end: 2010},
    {name: "Company Seven", category: "Auto", start: 1986, end: 1996},
    {name: "Company Eight", category: "Technology", start: 2011, end: 2016},
    {name: "Company Nine", category: "Retail", start: 1981, end: 1989}
  ];
  
  const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];


/** forEach/ Method
 * 
 *

//old Format - for loop
for(let index = 0; index < companies.length; index++){
   console.log(companies[index]);
}

//New format - foreach 
companies.forEach(function(company){
    console.log(company);
});


 - End forEach */

 
 /** filter Method 
  *
//Old filter
let canDrink  = [];
for(let index = 0; index < ages.length; index++){
    if(ages[index] > 21){ 
        canDrink.push(ages[index]); //add it to new array - canDrink
    }
}

New filter
const canDrink = ages.filter(function(validAge){
    if(validAge > 21){
        return true;
    }
});

//-- or in ES6 Format to make it simplier to one line ---

const canDrink = ages.filter(validAge => validAge > 21);

console.log(canDrink); 
*/




