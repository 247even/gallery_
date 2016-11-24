<?php

if (isset($_POST['folder'])) {
	$oldmask = umask(0);
	$dir = $_POST['folder'];

	$response['dir'] = $dir;

	if (is_dir($dir)) {
		$response['error'] = 1;
	} else {
		if (!mkdir($dir, 0777, true)) {
			$response['error'] = 2;
		}
	}
	umask($oldmask);
	echo json_encode($response);
}
?>
