<?php
require 'ImageResize.php';
use \Eventviva\ImageResize;


function createThumbs($file, $folder, $sizes){
	if($folder){
		// check if sourcefolder exists
		if (!file_exists($folder) && !is_dir($folder)) {
		    echo "$folder not found.<br>";
		    exit;
		}
		
	} else {
		echo "missing sourcefolder<br>";
		return false;
	}
	
	if($file){
		$sourceFile = $folder.'/'.$file;
		// check if sourceFile exists
		if (file_exists($sourceFile) ) {

			$image = new ImageResize($imgpath);
			if( !file_exists($targetpath_1200.$file) || $force ){
				$image -> resizeToBestFit(1200, 940);
				$image -> save($targetpath_1200 . $file);
			}			
			
		} else {
		    echo "$file not found.<br>";
		}			
	} else {
		echo "missing file<br>";
		return false;
	}

	if($sizes){					
		if (!is_array($sizes)){
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
		if($size > 0){
			
			// check if targetfolder exists or create it
			$targetFolder = $folder.'_'.strval($size);
			if (!file_exists($targetFolder) && !is_dir($targetFolder)) {
			    mkdir($targetFolder, 0777);
			    echo "directory $folder created.<br>";
			    exit;
			} else {
			    echo "directory $folder already exists.<br>";
			}

			$image = new ImageResize($sourceFile);
			if( !file_exists($targetFolder.'/'.$file) || $force ){
				$image -> resizeToBestFit($size, $size);
				$image -> save($targetFolder . $file);
			}			
		} else {
			echo "invalid size <br>";
		}
		
		$tsi++;
		if($tsi < $totalSizes){
			echo $tsi.' of '.$totalSizes.' processed';
		} else {
			echo $tsi.' of '.$totalSizes.' processed - Finished!';
		}
	}
	
}		

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// http://www.url.com/gallery/createThumbs.php?file=test.jpg&folder=somedirectory&sizes=380,480,720&force=true

if (isset($_GET['force'])) {
	global $gForce;
	$gForce = $_GET['force'];
	//echo "force = ".$force."<br>";
}

if (isset($_GET['file'])) {
	$gFile = $_GET['file'];
	echo "gFile = ".$gFile."<br>";
}

if (isset($_GET['folder'])) {
	$gFolder = $_GET['folder'];
	echo "gFolder = ".$gFolder."<br>";
}

if (isset($_GET['sizes'])) {
	$gSizes = $_GET['sizes'];
	// comma seperated string! >> sizes=380,480,720
	$sizeValues = explode(",", $gSizes);
	echo "sizeValues = ".json_encode($sizeValues)."<br>";
} else {
	$sizeValues = array('380','480','720');
	echo "sizeValues = ".json_encode($sizeValues)."<br>";
}

createThumbs($gFile, $gFolder, $sizeValues)

?>