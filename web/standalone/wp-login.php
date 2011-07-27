<?php
session_start();

require_once '../../wp-config.php';

$config =  json_decode(file_get_contents('dynmap_config.json'), true);
$msginterval = $config['webchat-interval'];

if (is_user_logged_in()) {
	
	echo "true";

	$user = wp_get_current_user();

	if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_SESSION['lastchat'] < time()) {
		$micro = explode(' ', microtime());
		$timestamp = $micro[1].round($micro[0]*1000);
		
		$data = json_decode(trim(file_get_contents('php://input')));
		
		if ($data->message != "") {
			
			//$data->name = $user->display_name;
			$data->name = "[WEB] ".$user->display_name;
			$data->timestamp = $timestamp;
			$old_messages = json_decode(file_get_contents('dynmap_webchat.json'), true);
			if (!empty($old_messages)) {
				foreach($old_messages as $message) {
					if (($timestamp - $config['updaterate'] - 10000) < $message['timestamp']) {
						$new_messages[] = $message;
					}
				}
			}
			$new_messages[] = $data;
			file_put_contents('dynmap_webchat.json', json_encode($new_messages));
			$_SESSION['lastchat'] = time()+$msginterval;
		}
		
		$_SESSION['lastchat'] = time()+$msginterval;
	}
	else if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_SESSION['lastchat'] > time()) {
		header('HTTP/1.1 403 Forbidden');
	}

} else {

	echo "false";

}
?>