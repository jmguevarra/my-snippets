//Ordinary Slider
    const ordinarySlider = function(ids = [], bullets = [], prevButton = null, nextButton = null){
      const sldIds = ids;
      const navBullets = bullets;
      let slideIndex = 0;
      var interval;
      
      if(sldIds.length == 0 ){
        return;
      }
      
      //Primary Components
      function sldPrev(){
        if(slideIndex == 0){
          slideIndex = sldIds.length-1;
        }else{
          slideIndex--;
        }
        sldHideShow(slideIndex);
      }

      function sldNext(){
        if(slideIndex >= sldIds.length-1){
          slideIndex = 0;
        }else{
          slideIndex++;
        }
        sldHideShow(slideIndex);
      }

      function sldHideShow(idIndex){
        $.each(sldIds, function(index, data){
          $(data).hide();
          if( idIndex === index){
            $(data).show();
          }
        });

        if(navBullets.lenght != 0){
          $.each(navBullets, function(index, data){
            $(data).removeClass('active');
            if( idIndex === index){
              $(data).addClass('active');
            }
          });
        }
      }
      
      //Timer for AutoSlide
      var timer = function(){
        interval = setInterval(function(){
          sldNext();
        },5000);
      };
      //end Primary Components
      
      
      //Initialize
      sldHideShow(slideIndex);
      timer();
      
      
      //Buttons
      if(prevButton != null){
        $(prevButton).click(function(){
          sldPrev();
        });
      }
     
      if(nextButton != null){
        $(nextButton).click(function(){
          sldNext();
        });
      }
      
      if(navBullets.length != 0){
        $.each(navBullets, function(index, data){
          $(data).click(function(){
            sldHideShow(index);
          });
        });
      }
      //End Buttons
      
    } //end of Ordinary Slider
    
    //Career
    const careerIds = ['.career1', '.career2'];
    const careerBullets = ['#lp-pom-box-685', '#lp-pom-box-686'];
    ordinarySlider(careerIds, careerBullets, '#lp-pom-image-815', '#lp-pom-image-687'); //(ids, bullets, prev, next) args