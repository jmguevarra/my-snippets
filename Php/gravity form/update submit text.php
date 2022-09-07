<?php 

add_filter('gform_submit_button_9', 'updateButtonText', 10, 2);
if( !function_exists('updateButtonText') ){
	function updateButtonText($button, $form){
		if( is_page(3057) ){ //specific ID
			$button = str_replace('OBTENIR MA SOUMISSION GRATUITE', 'COMPARER LES OPTIONS FUNÉRAIRES', $button);
		}
		return $button;
	}
}