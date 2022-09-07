const mobileGfp1 = function(pageIds = [], formFrame = ''){
	let pageFound = false; //a flag that will return if page id not exists
	
	//return if its not the pages 
	jQuery.each(pageIds, function(index, id){	
		if( !jQuery('body').hasClass('page-id-'+id) ){ return; } //exit loop function when body haven't page-id-[ID number]
		
		pageFound = true;
		return;
	});
	if(!pageFound || formFrame == ''){ return; } //exit main function when flag still false or page id does not exit
	
	
	//do main action when flag is true or page id exist
	let formWrapper = jQuery(formFrame), //form wrapper
		gfPage1 = jQuery(formWrapper).find('.gform_page:first-child');  //gravity form page _1

	const smvCondition = function(){ //it just a condition for to addClass in form Frame
		if(jQuery(window).width() <= 767){
			formWrapper.addClass('smv-active');
		}else{
			formWrapper.removeClass('smv-active');
		}
	};

	//onload condition
	smvCondition();
	//resize condition
	jQuery(window).resize(function(){ smvCondition(); });
	
	//button to show gform page 2
	jQuery('#gfp2-btn').click(function(){
		jQuery('.sm-gfp1').hide();
		gfPage1.find('.gform_next_button').click();
	});
	
	//on GF form reload/ajax
	jQuery(document).bind('gform_post_render', function(){
		jQuery('.smv-active .gform_page:nth-child(2) .gform_previous_button').click(function(e){
			e.preventDefault();
			jQuery('.sm-gfp1').fadeIn('slow');
		});
	});
	
};

//Usage
mobileGfp1( [1164, 1188], '#comp-form'); //param (page ids, formFrame);