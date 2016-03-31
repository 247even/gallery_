<?php
require 'jsonutil.php';
require 'ImageResize.php';
use \Eventviva\ImageResize;

$existingFolders;
//$allFolders;
$galleries;
$existingGallery;
$force = false;

// http://www.cad-artist.de/gallery/gallery.php?scanFolder=objekte&force=true
if (isset($_GET['force'])) {
	global $force;
	$force = $_GET['force'];
	echo "force = ".$force."<br>";
}

// force rebuild folder
// http://www.cad-artist.de/gallery/gallery.php?scanFolder=objekte
if (isset($_GET['scanFolder'])) {

	$scanFolder = $_GET['scanFolder'];
	echo "scanFolder: ".$scanFolder."<br>";
	$imagesInFolder = imagesFromFolder($scanFolder); 
	echo "imagesInFolder: ".count($imagesInFolder)."<br>";
	processImages($imagesInFolder, $scanFolder);
	return false;
}

function checkFolders($jsonFolders, $existingFolders) {
	
	$ck = 0;
	
	if (!$jsonFolders) {
		echo "Error: No jsonFolders!<br>";
		return false;
	}
	if (!$existingFolders) {
		echo "Error: No existingFolders!<br>";
		return false;
	}

	$newFolders = array_diff($existingFolders, $jsonFolders);
	
	if (!empty($newFolders)) {
		foreach ($newFolders as $key => $value) {
			$targetpath = $value . '_thumbs/';
			mkdir($targetpath);
			processImages(imagesFromFolder($newFolder), $value);
			$ck = 1;
		}
	}

	$oldFolders = array_diff($jsonFolders, $existingFolders);
	if (!empty($oldFolders)) {
		foreach ($oldFolders as $key => $value) {
			echo "Removed folder found: '" . $value . "'.<br>";
			if (!file_exists($value)) {
				// this folder is not present anymore
				$tf = $value . "_thumbs";
				if (file_exists($tf)) {
					echo "lonesome thumbs-Folder found: " . $tf . " <br>";
					array_map('unlink', glob("$tf/*.*"));
					if (rmdir($tf)) {
						echo "...and removed.<br>";
					}
				}
			}
		}
		$ck = 1;
	}

	if($ck == 1){
		saveJSON(buildExistingGallery());
		start();
	}
}

function processImages($newImages, $folder) {

	if (!$newImages) {
		echo "Error: No image array!<br>";
		return false;
	}

	if ($folder) {
		echo "folder: ".$folder."<br>";
		$path = $folder . '/';
		$targetpath_thumb = $folder . '_thumbs/';
		$targetpath_720 = $folder . '_720/';
		$targetpath_1200 = $folder . '_1200/';
	}

	global $existingGallery;
	//global $allFolders;
	
	$a = 0;
	$i = 0;
	foreach ($newImages as $key => $value) {
		
		$a++;
		$i++;
		
		if (!$folder) {
			echo "no folder!<br>";
			global $existingGallery;
			$imgObj = $existingGallery['images'][$value];
			$file = $imgObj['file'];
			$gallery = $imgObj['path'];
			$tpath_thumb = $gallery . '_thumbs';
			$tpath_720 = $gallery . '_720';
			$tpath_1200 = $gallery . '_1200';
			$targetpath_thumb = $gallery . '_thumbs/';
			$targetpath_720 = $gallery . '_720/';
			$targetpath_1200 = $gallery . '_1200/';
			$path = $gallery . '/';
		} else {
			$file = $value;
		}
		
		if ($targetpath_thumb == "_thumbs/") {
			echo "Error!<br><br>";
			return false;
		}

		
		mkdir($targetpath_thumb);
		mkdir($targetpath_720);
		mkdir($targetpath_1200);	

		//echo "targetpath: " . $targetpath_thumb . "<br>";

		$imgpath = $path . $file;
		echo "imgpath: " . $imgpath . "<br>";
		
		// if $force = true, do it anymway
		$image = new ImageResize($imgpath);
		if( !file_exists($targetpath_1200.$file) || $force ){
			$image -> resizeToBestFit(1200, 940);
			$image -> save($targetpath_1200 . $file);
		}
		if( !file_exists($targetpath_720.$file) || $force){
				
			$image -> resizeToBestFit(720, 600);
			$image -> save($targetpath_720 . $file);
		}
		
		if( !file_exists($targetpath_thumb.$file) || $force){
			$image -> resizeToBestFit(380, 300);
			$image -> save($targetpath_thumb . $file);
		}

		// clear
		$image = null;
		unset($image);

		// control:
		if( file_exists($targetpath_1200.$file) ){
			echo "image exists: ".$targetpath_1200.$file."<br>";
		}
		if( file_exists($targetpath_720.$file) ){
			echo "image exists: ".$targetpath_720.$file."<br>";
		}
		if( file_exists($targetpath_thumb.$file) ){
			echo "image exists: ".$targetpath_thumb.$file."<br>";
		}
		
		// if $force = true, just process images
		if ($force){
			if ( $i > 10 ) {
				//saveJSON(buildExistingGallery());
				$i = 0;
			}			
		}
	}

	echo "images processed: ".$a."<br>";
	echo "<br> processImages done <br>";
	return true;
}

function saveJSON($jsf) {
	$ijson = json_encode($jsf);
	echo "<br>saveJSON...<br>";
	//echo $ijson . "<br>";
	$fp = fopen('gallery.json', 'w');
	fwrite($fp, $ijson);
	fclose($fp);
	echo ">>> JSON SAVED<br><br>";
}

function buildExistingGallery() {

	global $existingFolders;
//	global $allFolders;

	// find all galeries, aka folders:
	$allFolders = array_values(array_filter(glob('*'), 'is_dir'));
//	echo "all Folders: " . json_encode($allFolders) . "<br><br>";
	// exclude and ignore folders:
	$folderfilter[] = 'blur';
	$existingFolders = array_diff($allFolders, $folderfilter);
	// remove 'thumb' directories from list
	$existingFolders = array_filter($existingFolders, function($value) {
		if (strstr($value, 'thumb') !== false) {
			return false;
		}
		return true;
	});
	$existingFolders = array_filter($existingFolders, function($value) {
		if (strstr($value, '_720') !== false) {
			return false;
		}
		return true;
	});
	$existingFolders = array_filter($existingFolders, function($value) {
		if (strstr($value, '_1200') !== false) {
			return false;
		}
		return true;
	});
	$existingFolders = array_values($existingFolders);

	foreach ($existingFolders as $key => $value) {
		$path = $value . '/';
		// search all images in folder
		foreach (glob("$path*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $filename) {
			$imageObject = array("file" => basename($filename), "path" => $value, "time" => filemtime($filename), "tags" => [$value]);
			$existingImages[$value . basename($filename)] = $imageObject;
		}

		// prevent empty folders
		if ($existingImages) {
			$existingGallery = array("images" => $existingImages);
		}
		// add hash
		$gmd5 = md5(json_encode($existingGallery["images"]));
		echo "md5: ".$gmd5."<br>";
		$existingGallery["md5"] = $gmd5;
		
		// add folder list
		if ($existingFolders) {
			$existingGallery["folders"] = $existingFolders;
		}
	}

	return $existingGallery;
};

function imagesFromFolder($folder) {
	$path = $folder . '/';
	$images = array();
	
	if(!file_exists($folder)){
		echo "no such folder.<br>";
		return false;
	}
	
	// search all images in folder
	foreach (glob("".$path."*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $filename) {
		array_push($images, basename($filename));
		/*
		 $imageObject = array("file" => basename($filename), "path" => $value, "time" => filemtime($filename), "tags" => [$value]);
		 $existingImages[$value.basename($filename)] = $imageObject;
		 */
	}

	echo json_encode($images)."<br>";
	return $images;
};

//////////////////////////////////////////////////////////////////////

function start() {
	global $existingFolders;
	//global $allFolders;
	
	$existingGallery = buildExistingGallery();
	//echo "existingGallery:<br>" . json_encode($existingGallery) . "<br><br>";
	$existingMd5 = $existingGallery['md5'];

	//$allFolders = $allFolders;
//	echo "allFolders:<br>" . json_encode($allFolders) . "<br><br>";

	//$existingFolders = $existingFolders;
	echo "existingFolders:<br>" . json_encode($existingFolders) . "<br><br>";

	$galleryJSON = file_get_contents('gallery.json');
	$galleries = json_decode($galleryJSON, true);
	//echo "json galleries:<br>" . json_encode($galleries) . "<br><br>";
	
	$jsonMd5 = $galleries['md5'];
	if(!$jsonMd5){
		echo "No json md5!<br>";
		return false;
	}

	if(!$existingMd5){
		echo "No ex md5!<br>";
		return false;
	}
	
	if($jsonMd5 != $existingMd5){
		echo "<br>md5 is NOT equal!<br>";
		echo "<br>".$jsonMd5."<br>";
		echo $existingMd5."<br>";
		//return false;
	} else {
		echo "<br>md5 is equal..<br>";
		//echo "<br>".$jsonMd5."<br>";
		//echo $existingMd5."<br>";
		return false;
	}

	$jsonFolders = $galleries['folders'];
	echo "json folders:<br>" . json_encode($jsonFolders) . "<br><br>";
	
	checkFolders($jsonFolders, $existingFolders);
	checkDiff($galleries,$existingGallery);
}

function checkDiff($galleries, $existingGallery) {
	//global $galleries;
	//global $existingGallery;
	
	$oldPath;

	$tools = new JSONTools();
	$diff = $tools -> diff($galleries['images'], $existingGallery['images']);
	echo "diff: ".json_encode($diff)."<br>";

	if (!$diff) {
		echo "No changes found.<br><br>";
	} else {
		foreach ($diff as $key => $value) {
			$stat = array_keys($value)[0];
			echo("value: " . json_encode($stat) . "<br>");
			if ($stat == "new" || $stat == "upd") {
				$newImages[] = $key;
				$fpath = $existingGallery['images'][$key]['path'];
				
				echo "oldpath: ".$oldPath." fpath: ".$fpath."<br><br>";
				if($oldPath){
					if ($oldPath != $fpath ){
						echo "<br>oldPath !== fpath<br>";
						echo json_encode($$oldPath);
						processImages($$oldPath, $oldPath);
						saveJSON(buildExistingGallery());
						start();
						return false;
					}
				}
				
				${$fpath}[] = $existingGallery['images'][$key]['file'];
				echo $stat." entry found in '" . $key . "'!<br>";
				echo "fpath: ".json_encode($$fpath)."<br><br>";
				$oldPath = $fpath;
			}
			/*
			if ($stat == "upd") {
				$fpath = $existingGallery['images'][$key]['path'];
				${$fpath}[] = $existingGallery['images'][$key]['file'];
				$newImages[] = $key;
				echo "Updated images found in '" . $key . "'!<br>";
			}
			 */
			if ($stat == "old") {
				echo "Removed file found: '" . $key . "'.<br>";
				$oldPath = $value['old']['path'];
				if (!in_array($oldPath, $existingFolders)) {
					// this folder is not present anymore
					$tf = $oldPath . "_thumbs";
					if (file_exists($tf)) {
						echo "lonesome thumbs-Folder found: " . $tf . " <br>";
						array_map('unlink', glob("$tf/*.*"));
						if (rmdir($tf)) {
							echo "...and removed.<br>";
						}
					}
				}
			}
		}
		echo "newImages: " . json_encode($newImages) . "<br><br>";
		processImages($newImages);
		saveJSON(buildExistingGallery());
	}
}

start();
?>