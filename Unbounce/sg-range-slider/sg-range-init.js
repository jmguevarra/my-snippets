<script defer>
  $( function(){

    var mySlider = $("input#buget_range").bootstrapSlider({
      ticks: [700, 1500],
      tooltip: 'always',
      value: 1000,
      step: 50
    });

    var budgetText = $('#buget_range');
    var budgetPicklist = $("#budget_picklist");

    $("input#buget_range").on("slide", function(slideEvt) {
      var slideValue = slideEvt.value;
      budgetRangeInit(parseInt(slideValue));
    }); 

    $("input#buget_range").on("slideStop", function(slideEvt) {
      var slideValue = slideEvt.value;
      budgetRangeInit(parseInt(slideValue));
    }); 

    //onload
    if(budgetText.val() == 1000){
      $('.tooltip-inner').text('1');
      $('.tooltip-main').addClass('million');
    }

    function budgetRangeInit(slideValue = 0){
      var initBudgetPicklist;

      $('.tooltip-main').removeClass('million');
      $('.tooltip-main').removeClass('plus');

      
      if( slideValue >= 700 && slideValue < 750 ){
        initBudgetPicklist = "$700K - $750K";
      }else if( slideValue >= 750 && slideValue < 800 ){
        initBudgetPicklist = "$750K - $800K";
      }else if( slideValue >= 800 && slideValue < 850 ){
        initBudgetPicklist = "$800K - $850K";
      }else if( slideValue >= 850 && slideValue < 900 ){
        initBudgetPicklist = "$850K - $900K";
      }else if( slideValue >= 900 && slideValue < 950 ){
        initBudgetPicklist = "$900K - $950K";
      }else if( slideValue >= 950 && slideValue < 1000 ){
        initBudgetPicklist = "$950K - $1M";
      }else if( slideValue >= 1000 && slideValue < 1100 ){
        initBudgetPicklist = "$1M - $1.1M";
        $('.tooltip-inner').text('1');
      }else if( slideValue >= 1100 && slideValue < 1200 ){
        initBudgetPicklist = "$1.1M - $1.2M";
        $('.tooltip-inner').text('1.1');
      }else if( slideValue >= 1200 && slideValue < 1300 ){
        initBudgetPicklist = "$1.2M - $1.3M";
        $('.tooltip-inner').text('1.2');
      }else if( slideValue >= 1300 && slideValue < 1400 ){
        initBudgetPicklist = "$1.3M - $1.4M";
        $('.tooltip-inner').text('1.3');
      }else if( slideValue >= 1400 && slideValue < 1500 ){
        initBudgetPicklist = "$1.4M - $1.5M";
        $('.tooltip-inner').text('1.4');
      }else if( slideValue >= 1500 && slideValue < 1600 ){
        initBudgetPicklist = "$1.5M - $1.6M";
        $('.tooltip-inner').text('1.5');
      }else if( slideValue >= 1600 && slideValue < 1700 ){
        initBudgetPicklist = "$1.6M - $1.7M";
        $('.tooltip-inner').text('1.6');
      }else if( slideValue >= 1700 && slideValue < 1800 ){
        initBudgetPicklist = "$1.7M - $1.8M";
        $('.tooltip-inner').text('1.7');
      }else if( slideValue >= 1800 && slideValue < 1900 ){
        initBudgetPicklist = "$1.8M - $1.9M";
        $('.tooltip-inner').text('1.8');
      }else if( slideValue >= 1900 && slideValue < 2000 ){
        initBudgetPicklist = "$1.9M - $2M";
        $('.tooltip-inner').text('1.9');
      }else if( slideValue >= 2000 ){
        initBudgetPicklist = "$2M+";
        $('.tooltip-inner').text('2');
        $('.tooltip-main').addClass('plus');
      }

      if(slideValue >= 1000 && slideValue < 2000){
        $('.tooltip-main').addClass('million');
      }else{
        $('.tooltip-main').removeClass('million');
      }

      budgetPicklist.val(initBudgetPicklist);
    }
    
  });
  </script>
