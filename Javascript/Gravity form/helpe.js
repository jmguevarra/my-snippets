const mobileGfp1 = function(formWrap){
		let formWrapper = jQuery(formWrap), //form wrapper
			gfPage1 = jQuery(formWrapper).find('.gform_page:first-child'), //gravity form page _1
			gfPage2prevBtn = jQuery(formWrapper).find('.gform_page:nth-child(2) .gform_previous_button'); //Gravity form Page _2 prev Button
		
		if(jQuery(window).width() <= 767){
			formWrapper.addClass('smv-active');
		}else{
			formWrapper.removeClass('smv-active');
		}
		
		//button to show gform page 2
		jQuery('#gfp2-btn').click(function(){
			jQuery('.sm-gfp1').hide();
			gfPage1.find('.gform_next_button').click();
		});
	};
	
	mobileGfp1('#comp-form');
	jQuery(window).resize(function(){ mobileGfp1('#comp-form'); });


jQuery('.smv-active .gform_page:nth-child(2) .gform_previous_button').click(function(e){
		e.preventDefault();
		jQuery('.sm-gfp1').fadeIn('slow');
	});



