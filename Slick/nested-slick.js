 
 
 $('.home-slides').slick({
      autoplay: false,
      infinite: true,
      dots: false,
      arrows: true, 
      draggable: false,
      touchMove: false,
      swipe: false,
      prevArrow: $('#lp-pom-image-1244'),
      nextArrow: $('#lp-pom-image-1245'),
    }); 
    
    $('.home-slides').on('afterChange', function(e, slick, currentSlide){
    	let activeHome = $('.slick-slide.slick-active .home-info'),
            name = activeHome.find(".name").text(),
            bed = activeHome.find(".bed").text(),
            toilet = activeHome.find(".toilet").text(),
            bath = activeHome.find(".bath").text(),
            car = activeHome.find(".car").text();
      
      $('.dyn-homename').text(name);
      $('.dyn-homebed').text(bed);
      $('.dyn-hometoilet').text(toilet);
      $('.dyn-homebath').text(bath);
      $('.dyn-homecar').text(car);
      $('.home-index').text(currentSlide + 1);
      
      $('#lp-pom-box-1228').removeClass("noToilet");
      if(currentSlide === 3 || currentSlide === 4){
        $('#lp-pom-box-1228').addClass("noToilet");
      }
    });
    
    $(".home-model-images").each(function(index, tag){
      $(tag).slick({
        autoplay: false,
        autoplaySpeed: 5000,
        speed:800,
        infinite: true,
        dots: false,
        arrows: false
      });
      $(tag).on('afterChange', function(e, slick, currentSlide){
        e.stopPropagation();
      });
    });
    
    $('#lp-pom-image-1248').click(function(){
      $(".hmd"+$('.home-index').text()).slick("slickPrev");
    });
    $('#lp-pom-image-1249').click(function(){
      $(".hmd"+$('.home-index').text()).slick("slickNext");
    });
