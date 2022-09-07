<?php


//get the form object of specific Form ID in gravity form

$form = GFAPI::get_form(1); 
$fields = $form['fields'];

foreach($fields as  $field){
	if($field['id'] == 3){
		$field['placeholder'] = 'Test'; // or $field->placeholder = 'Test';
		echo '<script> console.log('. json_encode($field) .') </script>'; //for debugging purpose
	}
	
}