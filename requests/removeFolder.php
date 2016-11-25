<?php
if (isset($_GET['folder']) || isset($_POST['folder'])) {
	global $gForce;

	$dir = $_POST['folder'];
	$dir = explode(",", $dir);

	foreach ($dir as $value) {
		//$dir = 'samples' . DIRECTORY_SEPARATOR . 'sampledirtree';
		$it = new RecursiveDirectoryIterator('../'.$value, RecursiveDirectoryIterator::SKIP_DOTS);
		$files = new RecursiveIteratorIterator($it,
		             RecursiveIteratorIterator::CHILD_FIRST);
		foreach($files as $file) {
		    if ($file->isDir()){
		        rmdir($file->getRealPath());
		    } else {
		        unlink($file->getRealPath());
		    }
		}
		rmdir($value);
		echo $value." removed.";
	}
}
?>
