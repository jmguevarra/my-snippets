
let offers = [...this.groupOffer];
let terms = [...this.groupOffer[offerIndex].offerTerms];
terms[termIndex] = { ...terms[termIndex], isRecommended: false };
offers[offerIndex] = { ...offers[offerIndex], offerTerms: terms };
this.groupOffer = [...offers];

/** 

Need to clone each property object to update nested readonly object in typescript or javascript.

**/
