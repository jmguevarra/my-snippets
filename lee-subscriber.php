//Subscriber Creation
add_action( 'gform_pre_submission_122', 'leeAddSubscriber' );
function leeAddSubscriber($form){
	$subscriberInfo = array(
		'first_name'	=> 	$_POST['input_3'],
		'last_name'		=> 	$_POST['input_4'],
		'user_email'	=> 	$_POST['input_5'],
		'user_login'	=> 	$_POST['input_6'],
		'user_pass'		=> 	$_POST['input_9_2'],
		'role'			=>  'subscriber',
		'display_name'	=>	$_POST['input_3']. ' ' . $_POST['input_4']
	);
	
	wp_insert_user($subscriberInfo);
}
/*End of Subscriber Creation*/
