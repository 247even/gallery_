<?php
//*imafox.de*//
ini_set('memory_limit', -1);
//echo memory_get_usage() . "<br>";
require 'ImageResize.php';
use \Eventviva\ImageResize;

//echo "get: ".$_GET['img']."<br>";
if (isset($_GET['img'])) {
	$src = $_GET['img'];

	$src = ltrim($src, '/');
	//echo "src: " . $src . "<br>";
	$sourcePath = str_replace('gallery/', '', $src);
	//echo "sourcePath: " . $sourcePath . "<br>";

	$base = explode("/", $sourcePath);
	$basefolder_1200 = $base[0] . "_1200";
	$basefolder_720 = $base[0] . "_720";
	$basefolder_thumbs = $base[0] . "_thumbs";
	//echo "basefolder: ".$basefolder."<br>";
	$baseFile = explode(".", $base[1]);
	$fileName = $baseFile[0];
	$fileExtension = $baseFile[1];
	//echo "fileName: " . $fileName . "<br>";
	//echo "fileExtension: " . $fileExtension . "<br>";

	$sourceFile = $basefolder_720 . '/' . $fileName . '.' . $fileExtension;
	//echo "sourceFile: " . $sourceFile . "<br>";

	if (!file_exists($sourceFile)) {
		echo "source file does not exist: " . $sourceFile;
		return false;
	}

	$baseFolder = 'blur/' . $basefolder_720;
	//echo "baseFolder: " . $baseFolder . "<br>";
	mkdir($baseFolder);

	$newImage = $baseFolder . '/' . $base[1];
	//echo "newImage: " . $newImage . "<br>";
	$default_blur = 80;

	if (isset($_GET['depth'])) {
		$depth = $_GET['depth'];
	} else {
		$depth = $default_blur;
	}

	//$new_background = $base_title.'-blur2'.'.'.$base_extension;
	if (file_exists($newImage)) {
		echo 'already exists ' . $newImage;
		// File already exists, so load it.
		//$im = imagecreatefromjpeg($new_image);
		//header('Content-Type: image/jpeg');
		//$im_output = imagejpeg($im);
		if (!isset($_GET['overwrite'])) {
			echo $newImage;
			return false;
		}
	}

	//echo 'making it <br>';
	// The file doesn't exist, so, make it
	$im = imagecreatefromjpeg($sourceFile);
	
	//$gaussian = array(array(1.0, 2.0, 1.0), array(2.0, 4.0, 2.0), array(1.0, 2.0, 1.0));
	$gaussian = array(array(0.11111, 0.11111, 0.11111), array(0.11111, 0.11111, 0.11111), array(0.11111, 0.11111, 0.11111));

	for ($i = 1; $i <= $depth; $i++) {
		imagefilter($im, IMG_FILTER_SMOOTH, -6);
		imageconvolution($im, $gaussian, 16, 0);
	}
/*
	for ($i = 1; $i <= $depth; $i++) {

		imagefilter($im, IMG_FILTER_GAUSSIAN_BLUR);
		//echo memory_get_usage()."<br>";
	}
 */

	//header('Content-Type: image/jpeg');
	$im_output = imagejpeg($im, $newImage, 70);
	//echo '<a href="' . $newImage . '">' . $newImage . '</a><br>';

	$path2 = 'blur/' . $basefolder_720 . '/' . $fileName . '.' . $fileExtension;
	$image = new ImageResize($newImage);
	$image -> resizeToBestFit(720, 600);
	$image -> save($path2);

	//echo '<a href="' . $path2 . '">' . $path2 . '</a>';
	echo "done";

	//imagedestroy($im_output);
} else {
	// Photo not found
	echo "No img " . $_GET['img'];
}
?>