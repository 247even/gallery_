<?php
function backup() {
	$t = time();
	$file = 'gallery.json';
	$newfile = '../backups/gallery.'.$t.'.json';
	if(!copy($file,$newfile)) {
		echo "copy $newfile failed";
	}
};
//////////////////////////////////////////////////////////////////////////////////////
$bu = false;

if(isset($_GET['backup'])||isset($_POST['backup'])) {
	$bu = true;
}

// bu is required
if($bu) {
	backup();
}
?>
