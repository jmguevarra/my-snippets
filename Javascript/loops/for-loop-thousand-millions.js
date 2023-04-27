const budgetRanges = [];
for (let i = 100; i < 2000; i += 50) {

  if(i < 1000){
    let maxPrice = `${i + 50}K`;
    if( i + 50 >= 1000) {
      maxPrice =  `${(i + 50) / 1000}M`;
    }
    budgetRanges.push( {min: i, max: i + 50, value: `$${i}K - $${maxPrice}`} );
  }else{  
    let minPrice = `${i / 1000}M`,
        maxPrice = `${(i + 100) / 1000}M`;
    budgetRanges.push( {min: i, max: i + 100, value: `$${minPrice} - $${maxPrice}`} );
    i += 50;
  }
}
budgetRanges.push({ min: 2000, max: 3000, value: "$2M+" });


/**  Result 
[
    {
        "min": 100,
        "max": 150,
        "value": "$100K - $150K"
    },
    {
        "min": 150,
        "max": 200,
        "value": "$150K - $200K"
    },
    {
        "min": 200,
        "max": 250,
        "value": "$200K - $250K"
    },
    {
        "min": 250,
        "max": 300,
        "value": "$250K - $300K"
    },
    {
        "min": 300,
        "max": 350,
        "value": "$300K - $350K"
    },
    {
        "min": 350,
        "max": 400,
        "value": "$350K - $400K"
    },
    {
        "min": 400,
        "max": 450,
        "value": "$400K - $450K"
    },
    {
        "min": 450,
        "max": 500,
        "value": "$450K - $500K"
    },
    {
        "min": 500,
        "max": 550,
        "value": "$500K - $550K"
    },
    {
        "min": 550,
        "max": 600,
        "value": "$550K - $600K"
    },
    {
        "min": 600,
        "max": 650,
        "value": "$600K - $650K"
    },
    {
        "min": 650,
        "max": 700,
        "value": "$650K - $700K"
    },
    {
        "min": 700,
        "max": 750,
        "value": "$700K - $750K"
    },
    {
        "min": 750,
        "max": 800,
        "value": "$750K - $800K"
    },
    {
        "min": 800,
        "max": 850,
        "value": "$800K - $850K"
    },
    {
        "min": 850,
        "max": 900,
        "value": "$850K - $900K"
    },
    {
        "min": 900,
        "max": 950,
        "value": "$900K - $950K"
    },
    {
        "min": 950,
        "max": 1000,
        "value": "$950K - $1M"
    },
    {
        "min": 1000,
        "max": 1100,
        "value": "$1M - $1.1M"
    },
    {
        "min": 1100,
        "max": 1200,
        "value": "$1.1M - $1.2M"
    },
    {
        "min": 1200,
        "max": 1300,
        "value": "$1.2M - $1.3M"
    },
    {
        "min": 1300,
        "max": 1400,
        "value": "$1.3M - $1.4M"
    },
    {
        "min": 1400,
        "max": 1500,
        "value": "$1.4M - $1.5M"
    },
    {
        "min": 1500,
        "max": 1600,
        "value": "$1.5M - $1.6M"
    },
    {
        "min": 1600,
        "max": 1700,
        "value": "$1.6M - $1.7M"
    },
    {
        "min": 1700,
        "max": 1800,
        "value": "$1.7M - $1.8M"
    },
    {
        "min": 1800,
        "max": 1900,
        "value": "$1.8M - $1.9M"
    },
    {
        "min": 1900,
        "max": 2000,
        "value": "$1.9M - $2M"
    },
    {
        "min": 2000,
        "max": 3000,
        "value": "$2M+"
    }
] 
**/
