<?php

$response;
$now = time();
$path = "";

if (isset($_POST['data'])) {
	$data = $_POST['data'];
	$data = json_decode($data, true);
	$path = $data['path'];
	$tags = $data['tags'];
}

if ($path) {
	$path = chop($path);
	$path = ltrim($path,"..");
	if (!is_dir($path)) {
		$oldmask = umask(0);
		mkdir($path, 0777, true);
		umask($oldmask);
	}
}

if (isset($_FILES['files'])) {

/*
	if (!is_uploaded_file($_FILES['files']['tmp_name'])) {

		switch($HTTP_POST_FILES['files']['error']) {
			case 0 :
				//no error; possible file attack!
				echo "There was a problem with your upload.";
				break;
			case 1 :
				//uploaded file exceeds the upload_max_filesize directive in php.ini
				echo "The file you are trying to upload is too big.";
				break;
			case 2 :
				//uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the html form
				echo "The file you are trying to upload is too big.";
				break;
			case 3 :
				//uploaded file was only partially uploaded
				echo "The file you are trying upload was only partially uploaded.";
				break;
			case 4 :
				//no file was uploaded
				echo "You must select an image for upload.";
				break;
			default :
				//a default error, just in case!  :)
				echo "There was a problem with your upload.";
				break;
		}
		return false;
	}
*/
	$files = $_FILES['files'];
	$response = $files;

	foreach ($files["error"] as $key => $error) {
		if ($error != UPLOAD_ERR_OK) {
			$response = $files["error"];
			echo json_encode($response);
			return false;
		}
	}
	
	$i = 0;
	foreach ($files['name'] as $key => $value) {
		if($files['error'][$key] > 0){
			echo "error";
			return false;
		}

		$tmp_name = $files["tmp_name"][$key];
		$filename = $files["name"][$key];
		$bname = basename($filename);
		$filepath = $path . DIRECTORY_SEPARATOR . $filename;

		if(!move_uploaded_file($_FILES['files']["tmp_name"][$key], $filepath)){
			echo $filepath;
     		echo ' -> Error uploading file - check destination is writeable.';
     		return false;
		}

		$response["images"] = $value;
		$response["target"] = $filepath;

		$i++;
	}
}

$response["data"] = $data;

echo json_encode($response);

?>