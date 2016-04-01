<?php
ini_set('display_errors', 'On');

// check libs
if (extension_loaded('gd')) {
	//print_r(gd_info());
} else {
	echo 'GD is not available.<br>';
}

if (extension_loaded('imagick')) {
	$imagick = new Imagick();
	print_r($imagick -> queryFormats());
} else {
	echo 'ImageMagick is not available.<br>';
}

require 'ImageResize.php';
use \Eventviva\ImageResize;
$force = false;

function resizeStore($folder, $file, $sizes) {
	if ($folder) {

		if (strpos($folder, "/") !== false) {
			// remove '/'
			$file = str_replace('/', '', $file);
		}
		if (strpos($folder, ".") !== false) {
			echo "invalid folder";
		}

		// check if sourcefolder exists
		if (!file_exists($folder) && !is_dir($folder)) {
			echo "$folder not found.<br>";
			exit ;
		}

	} else {
		echo "missing sourcefolder<br>";
		return false;
	}

	if ($file) {
		// check if file contains '/'
		if (strpos($file, "/") !== false) {
			if (strpos($file, "/") === 0) {
				// remove '/'
				$file = str_replace('/', '', $file);
			}
		}
		$sourceFile = $folder . '/' . $file;
		// check if sourceFile exists
		if (!file_exists($sourceFile)) {
			echo "$sourceFile not found.<br>";
		}
	} else {
		echo "missing file<br>";
		return false;
	}

	if ($sizes) {
		if (!is_array($sizes)) {
			$sizes = array($sizes);
		}
	} else {
		echo "missing size<br>";
		return false;
	}

	// here we go...
	$totalSizes = count($sizes);
	$tsi = 0;
	foreach ($sizes as $value) {
		// use int, not strings
		$size = intval($value);
		if ($size > 0) {
			// check if targetfolder exists or create it
			$targetFolder = $folder . '_' . strval($size);
			if (!file_exists($targetFolder) && !is_dir($targetFolder)) {
				mkdir($targetFolder);
				echo "directory $targetFolder created.<br>";
			} else {
				echo "directory $targetFolder already exists.<br>";
			}

			$image = new ImageResize($sourceFile);
			if (!file_exists($targetFolder . '/' . $file) || $force) {
				$image -> resizeToBestFit($size, $size);
				$image -> save($targetFolder . '/' . $file);
			}
		} else {
			echo "invalid size <br>";
		}

		$image = null;
		unset($image);

		// limit to 10 files; not necessary anymore?!
		if ($force) {
			if ($i > 10) {
				$i = 0;
			}
		}

		$tsi++;
		if ($tsi < $totalSizes) {
			echo $tsi . ' of ' . $totalSizes . ' processed<br>';
		} else {
			echo $tsi . ' of ' . $totalSizes . ' processed - Finished!<br>';
		}
	}

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// http://www.url.com/gallery/createThumbs.php?file=test.jpg&folder=somedirectory&sizes=380,480,720&force=true
// http://192.168.1.21/gallery_/gallery/createThumbs.php?file=bird-1249136_1920.jpg&folder=birds

if (isset($_GET['force'])) {
	global $gForce;
	$gForce = $_GET['force'];
	//echo "force = ".$force."<br>";
}

if (isset($_GET['folder'])) {
	$gFolder = $_GET['folder'];
	echo "gFolder = " . $gFolder . "<br>";
}

if (isset($_GET['sizes'])) {
	$gSizes = $_GET['sizes'];
	// comma seperated string! >> sizes=380,480,720
	$sizeValues = explode(",", $gSizes);
	echo "sizeValues = " . json_encode($sizeValues) . "<br>";
} else {
	$sizeValues = array('380', '480', '720');
	echo "sizeValues = " . json_encode($sizeValues) . "<br>";
}

if (isset($_GET['file'])) {
	$gFile = $_GET['file'];
	echo "gFile = " . $gFile . "<br>";
	resizeStore($gFolder, $gFile, $sizeValues);
}
?>