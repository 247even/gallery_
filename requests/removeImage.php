<?php
if (isset($_GET['path']) || isset($_POST['path'])) {

	$path = '../'.$_GET['path'];
	
	if(file_exists($path)){
		if(unlink($path)){
			echo $path." removed.";
		} else {
			echo "error";
		}
	} else {
		echo "file not found";
	}

}
?>
