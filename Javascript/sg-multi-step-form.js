<script type="text/javascript">
  $(document).ready(function(){
    let currentFormStep = 0;
    const steps = [
      '#container_buyer_intention',
      '#container_financial_status',
      '#container_budget',
      '#container_preferred_bedrooms',
      '#container_family_type'
    ];

    $('.step-q1-headline').hide();

    $('#lp-pom-button-717').click(function(){
      $('.multi-step-form').addClass('active');
      $('.multi-step-start').hide();
      $('.step-q1-headline').show();
      $(steps[currentFormStep]).addClass('active');
      $('#lp-pom-root').addClass('multi-step'+currentFormStep);
    });
    
    //next
    $('#lp-pom-button-730').click(function(){
      let radioName = $(steps[currentFormStep]).find("input[type='radio']").attr("name"),
          selectedOpt = $('input[name="'+radioName+'"]:checked').val();

      if(selectedOpt != undefined && selectedOpt != ''){
        if(currentFormStep  < steps.length - 1){
          $.each(steps, function(index, tag){
            $(tag).removeClass('active');
          });

          currentFormStep++;
          currentStep(currentFormStep);
          $(steps[currentFormStep]).addClass('active');

          //classing
          let prevStep = currentFormStep - 1;
          $('#lp-pom-root').removeClass('multi-step'+prevStep);
          $('#lp-pom-root').addClass('multi-step'+currentFormStep);
        }else{
          $('#lp-pom-button-43').click();
        }

        $('.step-q1-headline').hide();
        $('.multi-fav-footer').show();
      }else{
        if($(steps[currentFormStep]).find('.sg-toast').length === 0){
          $(steps[currentFormStep]).find('.optionsList').prepend("<div class='sg-toast'>This is required</div>");

          setTimeout(function(){
            $('.sg-toast').addClass('active');
          }, 500);
          setTimeout(function(){
            $('.sg-toast').remove();
          }, 5000);
        }else{
        	$('.sg-toast').remove();
        }
      }
    });

    //prev
    $('#lp-pom-button-729').click(function(){

      if(currentFormStep > 0){
        $.each(steps, function(index, tag){
          $(tag).removeClass('active');
        });
        currentFormStep--;
        currentStep(currentFormStep);
        $(steps[currentFormStep]).addClass('active');
        
        let prevStep = currentFormStep + 1;
		$('#lp-pom-root').removeClass('multi-step'+prevStep);
        $('#lp-pom-root').addClass('multi-step'+currentFormStep);
      }
      
    });

    function currentStep(stepIndicator){
      let stepText = 'One';
      switch(stepIndicator){
        case 0:
          stepText = "One";
          break;
        case 1:
          stepText = "Two";
          break;
        case 2:
          stepText = "Three";
          break;
        case 3:
          stepText = "Four";
          break;
        case 4:
          stepText = "Five";
          break;
      }
      $('.stepIndicator').text(stepText);
    }
    
    



  });
</script>
