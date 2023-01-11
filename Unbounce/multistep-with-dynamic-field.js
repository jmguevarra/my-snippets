<script  type="text/javascript">
  $(document).ready(function(){
    let formSteps = {
    	1: [ '#container_first_name', '#container_last_name', '#container_email', '#container_postcode' ],
      	2: [ '#container_reason_for_studying', '#container_course_of_interest', '#container_preferred_start'],
      	3: [ '#container_study_mode', '#container_best_contact_method' ]
    };
    let currentStep = 1;
    let stepsLength = Object.keys(formSteps).length;
    
    showFields(currentStep);
    
    //Next
    $('#lp-pom-button-854').click(function(){
      let validated = false;
      if(currentStep === 1){
      	validated = validation(formSteps[currentStep], 'single');
      }else{
        validated = validation(formSteps[currentStep]);
      }
      
      if(currentStep < stepsLength && validated){
		removeField(currentStep);
        currentStep++;
        showFields(currentStep);
      }
      
      if(currentStep === stepsLength){
      	$('#lp-pom-button-854 .label').text("Submit");
      }
      
      //step 3 to submit
      if(currentStep === stepsLength && validated){
        $('#lp-pom-button-43').click();
      }
      
    });
    
    //previous
    $('#lp-pom-button-858').click(function(){
      if(currentStep > 1){
		removeField(currentStep);
        currentStep--;
        showFields(currentStep);
      }
      if(currentStep < stepsLength){
      	 $('#lp-pom-button-854 .label').text("Next Question");
      }
    });
    
    //Dynamic Fields
    $('input[name="reason_for_studying"]').click(function(){
      showDynRadioField($(this), "do_you_work_for", "Professional Development", 2);
    });
    function showDynRadioField(inputRadio, radioGroupName, defaultValue, step){
      if(inputRadio.length < 1){ return; }
      
      let rootClass = radioGroupName.replace(/_/g, '-');
      if(currentStep === step){
        if(inputRadio.val() === defaultValue && inputRadio.prop("checked")){
          $('#container_'+radioGroupName).addClass('show');
          $('#lp-pom-root').addClass(rootClass);
        }else{
          $('#container_'+radioGroupName).removeClass('show');
          $('#lp-pom-root').removeClass(rootClass);
          $('input[name="'+radioGroupName+'"]').prop("checked", false);
        }
      }else{
      	$('#container_'+radioGroupName).removeClass('show');
        $('#lp-pom-root').removeClass(rootClass);
      }
    }
    //End Dynamic Feilds
    
    function validation(formFields, tag = 'radio'){
      let flag = false;
      let isValid = [];
      
      $.each(formFields, function(index, field){
        let fieldInput;
        if(tag === 'single'){
          fieldInput = $(field).find('input.single');
          
          if($(fieldInput).attr('type') == "email" && $(fieldInput).attr('required') && $(fieldInput).val() == ''){
            isValid.push($(fieldInput)[0].validity.valid);
          }else if($(fieldInput).attr('required') && $(fieldInput).val() == ''){
            isValid.push(false);
          }else{
            isValid.push(true);
          }
          
        }else{
          fieldInput = $(field).find('input.radio');
          let radioName = $(field).find('input.radio').attr('name');
          if($('input[name="'+radioName+'"]:checked').val() === undefined){
            isValid.push(false);
          }else{
            isValid.push(true);
          }
        } 
        
      });
      
      if(!isValid.includes(false)){
      	flag = true;
        console.log('cehcking');
      }
     
      return flag;
    }
    
    function showFields(step){
      //showing fields
      $.each(formSteps[step], function(index, field){
      	$(field).addClass('show');
      });
          
      showDynRadioField($('input[name="reason_for_studying"]:checked'), "do_you_work_for", "Professional Development", 2);
      //indicator percentage
      let progressBar = (step/stepsLength) * 100;
      $('.multi-step-indicator .progress-bar').width(progressBar+'%');
      $('#lp-pom-root').addClass('step'+currentStep);
    }
    
    function removeField(step){
      $('#lp-pom-root').removeClass('step'+step);
      $.each(formSteps[step], function(index, field){
        $(field).removeClass('show');
      });
    }
    
  });
</script>
