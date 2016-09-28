<?php
if (isset($_GET['folder']) || isset($_POST['folder'])) {
	$dir = $_POST['folder'];
	if (is_dir($dir)) {
		die($dir + ' already exists');
	} else {
		if (!mkdir($dir, 0777, true)) {
			die('error');
		}
	}
	echo $dir . ' created';
}
?>