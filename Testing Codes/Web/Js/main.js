/**
 * Array Reduce
 */

 const pokemon = {
    name : 'picachu',
    type : 'electric',
    hp : {
        'lvl10' : 1000,
        'lvl20' : 2500,
        'lvl30' : 5000,
        'lvl40' : 7500,
        'lvl50' : 10000,  
    },
        attack : {
        'lvl10' : 1000,
        'lvl20' : 2500,
        'lvl30' : 5000,
        'lvl40' : 7500,
        'lvl50' : 10000,   
    }
 };



 function attackMode(pokemon, lvl){
    const {name, type, hp, attack} = pokemon;
    
    let hpArray  = Object.entries(hp);
    let result = hpArray.filter( hp => hp[0] === `lvl${lvl}`);
    console.log(result);

    // values.filter( (stat, index, arr) => {
    //     console.log(arr);
    // });
    // let pokemonHp = 
    // return `${name} is ${type} pokemon. It is level ${lvl} with attack power of ${}`
 }

 attackMode(pokemon, 10);
 attackMode(pokemon, 40);