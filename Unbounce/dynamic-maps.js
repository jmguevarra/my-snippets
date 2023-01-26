let mapDetails = [
      { 
        name: 'map1', 
        headline: 'A premier arts destination in historical rural Victoria', 
        subtext: 'Experience year-round music festivals and theatre productions against the backdrop of Bendigo’s rich cultural history. ', 
        bgColor: '#EAA95E'
      },
      { 
       name: 'map2', 
       headline: 'Everything you need, around the corner', 
       subtext: 'Key shopping and entertainment destinations are within easy driving distance, to offer the best in convenient living.', 
       bgColor: '#DF8A66'
      },
      { 
        name: 'map3', 
        headline: 'The luxury of choice ', 
        subtext: 'Choose from a wide selection of kindergartens, primary and secondary schools in Bendigo, as well as La Trobe University. ', 
        bgColor: '#233F49'
      },
      { 
        name: 'map4', 
        headline: 'Live well, travel often', 
        subtext: 'Just a short drive into Bendigo’s CBD via the Midland Highway or 2 hours by train to Melbourne’s CBD, Harlowe is connected to everything you need.', 
        bgColor: '#6E7E64'
      },
    ];
    $('select[name="gridPicklist"]').change(function(){
      let selectedMap = $(this).val();
      $('.maps').hide();
      $("."+selectedMap).fadeIn('slow');
      
      let mapDetail = mapDetails.find(function(map, index){
       if(map.name == selectedMap){
         return true
       }else{
       	return false;
       }
      });
      
      $('.mapdyn-headline').text(mapDetail.headline);
      $('.mapdyn-subtext').text(mapDetail.subtext);
      $('#lp-pom-block-874').css('background',  mapDetail.bgColor);
      
    });
