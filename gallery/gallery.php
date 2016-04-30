<?php
ini_set('display_errors', 'On');
/*
echo "Start<br><br>";
echo 'Name des Benutzers: ' . get_current_user();

echo "<br>";
$processUser = posix_getpwuid(posix_geteuid());
echo $processUser['name'];
echo "<br>";
echo 'getmyuid: ' . getmyuid();
echo "<br>";
echo "whoami: ". `whoami`;
echo "<br>";
print shell_exec( 'whoami' );
echo "<br>";
echo exec('whoami');
echo "<br>";
file_put_contents("testFile", "test");
$user = fileowner("testFile");
echo "User: ".$user."<br>";
unlink("testFile");
echo "<br>";
echo "<br>";
*/

require 'jsonutil.php';
require 'resizeStore.php';
require 'saveFileAs.php';
require 'existingGallery.php';
require 'allFolders.php';
require 'checkFolders.php';

$existingFolders;
$galleries;
$existingGallery;
$sizeValues = array(280, 430, 720, 1200);

// http://www.url.com/gallery/gallery.php?scanFolder=objekte&force=true
if (isset($_GET['force'])) {
	global $force;
	$force = $_GET['force'];
	echo "force = " . $force . "<br>";
}

// force rebuild folder
// http://www.url.com/gallery/gallery.php?scanFolder=objekte
if (isset($_GET['scanFolder'])) {
	$scanFolder = $_GET['scanFolder'];
	echo "scanFolder: " . $scanFolder . "<br>";
	$imagesInFolder = imagesFromFolder($scanFolder);
	echo "imagesInFolder: " . count($imagesInFolder) . "<br>";
	processImages($imagesInFolder, $scanFolder);
	return false;
}

function processImages($newImages, $folder) {
	global $existingGallery;
	global $sizeValues;
	//global $allFolders;

	if (!$newImages) {
		echo "Error: No image array!<br>";
		return false;
	}

	if ($folder) {
		echo "folder: " . $folder . "<br>";
/*
		$path = $folder . '/';
		$targetpath_280 = $folder . '_280/';
		$targetpath_480 = $folder . '_480/';
		$targetpath_720 = $folder . '_720/';
		$targetpath_1200 = $folder . '_1200/';
 */

	}

	$a = 0;
	$i = 0;
	foreach ($newImages as $key => $value) {

		$a++;
		$i++;

		if (!$folder) {
			echo "no folder!<br>";
			$imgObj = $existingGallery['images'][$value];
			$file = $imgObj['file'];
			$gallery = $imgObj['path'];
			/*
			$tpath_280 = $gallery . '_280';
			$tpath_480 = $gallery . '_480';
			$tpath_720 = $gallery . '_720';
			$tpath_1200 = $gallery . '_1200';
			$targetpath_280 = $gallery . '_280/';
			$targetpath_480 = $gallery . '_480/';
			$targetpath_720 = $gallery . '_720/';
			$targetpath_1200 = $gallery . '_1200/';
			$path = $gallery . '/';
			 */
		} else {
			$file = $value;
		}

		// resizeStore($folder, $file, $sizes)
		resizeStore($gallery, $file, $sizes);
	}

	echo "images processed: " . $a . "<br>";
	echo "<br> processImages done <br>";
	return true;
}

/*
function saveJSON($jsf) {
	$ijson = json_encode($jsf);
	echo "<br>saveJSON...<br>";
	//echo $ijson . "<br>";
	$fp = fopen('gallery.json', 'w');
	fwrite($fp, $ijson);
	fclose($fp);
	echo ">>> JSON SAVED<br><br>";
}
*/



function imagesFromFolder($folder) {
	$path = $folder . '/';
	$images = array();

	if (!file_exists($folder)) {
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

	echo json_encode($images) . "<br>";
	return $images;
};

function checkDiff($galleries, $existingGallery) {
	//global $galleries;
	//global $existingGallery;

	$oldPath;

	$tools = new JSONTools();
	$diff = $tools -> diff($galleries['images'], $existingGallery['images']);
	echo "diff: " . json_encode($diff) . "<br>";

	if (!$diff) {
		echo "No changes found.<br><br>";
	} else {
		foreach ($diff as $key => $value) {
			$stat = array_keys($value)[0];
			echo("value: " . json_encode($stat) . "<br>");
			if ($stat == "new" || $stat == "upd") {
				$newImages[] = $key;
				$fpath = $existingGallery['images'][$key]['path'];

				echo "oldpath: " . $oldPath . " fpath: " . $fpath . "<br><br>";
				if ($oldPath) {
					if ($oldPath != $fpath) {
						echo "<br>oldPath !== fpath<br>";
						echo json_encode($oldPath);
						processImages($oldPath);
						saveFileAs(buildExistingGallery(), "gallery.json");
						start();
						return false;
					}
				}

				${$fpath}[] = $existingGallery['images'][$key]['file'];
				echo $stat . " entry found in '" . $key . "'!<br>";
				echo "fpath: " . json_encode($$fpath) . "<br><br>";
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
					$tf = $oldPath . "_280";
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
		saveJSON(buildExistingGallery(), "gallery.json");
	}
}

//////////////////////////////////////////////////////////////////////

function start() {
	global $existingFolders;
	//global $allFolders;

	$existingGallery = buildExistingGallery();
	//echo "existingGallery:<br>" . json_encode($existingGallery) . "<br><br>";
	$existingMd5 = $existingGallery['md5'];

	echo "existingFolders:<br>" . json_encode($existingFolders) . "<br><br>";

	// look for gallery.json, else create new
	if (file_exists("gallery.json")) {
		$galleryJSON = file_get_contents('gallery.json');
		$galleries = json_decode($galleryJSON, true);
		//echo "json galleries:<br>" . json_encode($galleries) . "<br><br>";
	} else {
		saveFileAs(buildExistingGallery(), "gallery.json");
		start();
		return false;
	}

	$jsonMd5 = $galleries['md5'];
	if (!$jsonMd5) {
		echo "No json md5!<br>";
		return false;
	}

	if (!$existingMd5) {
		echo "No ex md5!<br>";
		return false;
	}

	if ($jsonMd5 != $existingMd5) {
		echo "<br>md5 is NOT equal!<br>";
		echo "<br>" . $jsonMd5 . "<br>";
		echo $existingMd5 . "<br>";
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
	checkDiff($galleries, $existingGallery);
}

start();
?>