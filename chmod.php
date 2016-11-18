<?php
ini_set('display_errors', 'On');

function dirToArray($dir){
	$result = array();
	$cdir = array_diff(scandir($dir), ['..', '.']);
	foreach ($cdir as $key => $value) {
		if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
			$result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
		} else {
			$result[] = $value;
		}
	}	
	return $result;
}

function setmod($dir){
	$result = array();
	$cdir = array_diff(scandir($dir), ['..', '.']);
	foreach ($cdir as $key => $value) {
		$path = $dir . DIRECTORY_SEPARATOR . $value;
		echo $path."<br>";
		if (is_dir($path)) {
			chmod($path, 0777);
			$result[] = $path;
			setmod($path);
		} else {
			chmod($value, 0777);
			$result[] = $value;
		}
	}	
	return $result;
}

function chmodphp($dir) {
	$cwdPath = getcwd();
	if(!$dir){
		$dir = $cwdPath;
	} else {
		$dir = $cwdPath. DIRECTORY_SEPARATOR .$dir;
	}
	
	echo json_encode(setmod($dir));
};

chmodphp();

/*
 $files = scandir('/');
 echo $files;
 foreach ($files as $filename) {
 //chmod($filename, 0777);
 echo "chmod 777 set for: ".$filename."<br>";
 } */
 
php > umask(0);
// Should get created as 666
php > touch('file1.txt');

// "2" perms revoked from group, others, gets created as 644
php > umask(022);
php > touch('file2.txt');

// All revoked (2,4) from group, others, gets created as 600
php > umask(066);
php > touch('file3.txt');
 
 ?>


