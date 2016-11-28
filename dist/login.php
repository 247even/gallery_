<?php

$user = 'user';
$pass = 'pass';
$login_md5 = md5($user . $pass);
$loggedin = false;

function checkCookie($login_md5) {
	if (isset($_COOKIE['login'])) {
		if ($login_md5 == $_COOKIE['login']) {
			return true;
		}
	}
	return false;
};

function checkPostdata($user,$pass,$login_md5) {

	if (isset($_POST['username']) && isset($_POST['password'])) {

		$post_user = $_POST['username'];
		$post_pass = $_POST['password'];
		//$post_md5 = $_POST['md5'];

		//echo "post_user: " . $post_user . " post_pass: " . $post_pass . "<br>";
		/*if($post_md5 == $login_md5){
			return true;
		}*/

		if (($post_user == $user) && ($post_pass == $pass)) {

			//echo "user & pass correct";
			//$post_md5 = md5($post_user . $post_pass);

			if (isset($_POST['rememberme'])) {
				/* Set cookie to last 1 year */
				$expire = time() + 60 * 60 * 24 * 365;
			} else {
				/* Cookie expires when browser closes */
				$expire = false;
			}
			header("Cache-Control: no-cache");
			setcookie('login', $login_md5, $expire);
			echo "loggedin";
			return true;

		} else {
			echo 'Username/Password Invalid';
			return false;
		}

	} else {
		echo 'no username and/or password';
		return false;
	}
};

$loggedin = checkCookie($login_md5);
if(!$loggedin){
	$loggedin = checkPostdata($user,$pass,$login_md5);
}
//echo $loggedin;
if($loggedin){
	echo "loggedin";
}
?>

<!--
<script>
	var loggedin = <?php //echo $loggedin; ?>;
	console.log('loggedin: '+loggedin);
</script>
-->
