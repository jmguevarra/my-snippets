
	$(document).ready(function(){
    	$('#accordions h3').click(function(){
          	let currentParent = $(this).parents('.accor-wrap');
          	if(currentParent.hasClass('active')){
        		currentParent.removeClass('active');
            }else{
              $('#accordions .accor-wrap').removeClass('active');
              currentParent.addClass('active');
            }
        });
    });
