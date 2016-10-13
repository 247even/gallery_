<?php

	$folders = array_values(array_filter(glob('*'), 'is_dir'));
	foreach ($folders as $key => $value) {
		echo '<a href="deleteFolder.php?path='.$value.'">'.$value.'</><br>';
	}
	echo '<a href="deleteFolder.php">refresh</><br>';

if (isset($_GET['path'])) {

	//$dir = 'samples' . DIRECTORY_SEPARATOR . 'sampledirtree';
	
	$dir = $_GET['path'];
	
	$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
	$files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
	foreach ($files as $file) {
		if ($file -> isDir()) {
			rmdir($file -> getRealPath());
		} else {
			unlink($file -> getRealPath());
		}
	}
	rmdir($dir);
	echo $dir . ' deleted';

}
?>