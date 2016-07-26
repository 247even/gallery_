<?php
function existingGallery() {

	global $existingFolders;
	global $sizeValues;
	//	global $allFolders;

	// find all galeries, aka folders:
	$allFolders = allFolders();
	//	echo "all Folders: " . json_encode($allFolders) . "<br><br>";
	// exclude and ignore folders:
	$folderfilter[] = 'blur';
	$existingFolders = array_diff($allFolders, $folderfilter);

	// remove size directories from list
	echo json_encode($sizeValues) . "<br>";
	foreach ($sizeValues as $size) {
		echo "size: " . $size . "<br>";
		$existingFolders = array_filter($existingFolders, function($va) {
			global $size;
			if (strstr($va, '_' . $size) !== false) {
				return false;
			}
			return true;
		});
	}

	$existingFolders = array_values($existingFolders);
	echo "folders: " . json_encode($existingFolders) . "<br>";

	foreach ($existingFolders as $key => $value) {
		//echo $key.' '.$value.'<br>';
		$path = $value . '/';
		// search all images in folder
		foreach (glob("$path*.{jpg,jpeg,png,gif}", GLOB_BRACE) as $filename) {
			resizeStore($value, basename($filename), $sizeValues);
			$imageObject = array("file" => basename($filename), "path" => $value, "time" => filemtime($filename), "tags" => [$value]);
			$existingImages[$value . basename($filename)] = $imageObject;
		}

		// prevent empty folders
		if ($existingImages) {
			$existingGallery = array("images" => $existingImages);
		}
		//echo 'existingImages: '.json_encode($existingImages).'<br>';

		// add hash
		$gmd5 = md5(json_encode($existingGallery["images"]));
		echo "md5: " . $gmd5 . "<br>";
		$existingGallery["md5"] = $gmd5;

		// add folder list
		if ($existingFolders) {
			$existingGallery["folders"] = $existingFolders;
		}

		// add sizes list
		if ($sizeValues) {
			$existingGallery["sizes"] = $sizeValues;
		}

	}

	return $existingGallery;
};
?>