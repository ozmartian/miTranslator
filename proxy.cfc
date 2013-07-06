<?php

	//if (isset($_GET['url']) && strlen($_GET['url']) && isset($_GET['data']) && strlen($_GET['data'])) {

		$url = isset($_GET['url']) ? urldecode($_GET['url']) : "";
		$data = isset($_GET['data']) ? urldecode($_GET['data']) : "testing";
		
		if (strlen($url) > 0 && strlen($data) > 0) {
			$response = http_post_fields($url, array($data=>"");
			print_r($response);
		}

	/* } else {

		header('Content-type: application/json');
		echo json_encode(array('error'=>'ERROR: Missing \'url\' and \'data\' parameters.'));

	} */
	
?>