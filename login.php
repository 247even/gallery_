<?php

function checkCookie() {
	if (isset($_COOKIE['login'])) {

		$cookie_md5 = $_COOKIE['login'];

		if ($cookie_md5 == $login_md5) {
			return false;
		} else {
			return true;
		}

	} else {
		return false;
	}
}

function checkPostdata() {

	$user = 'user';
	$pass = 'pass';
	$login_md5 = md5($user . $pass);

	if (isset($_POST['username']) && isset($_POST['password'])) {

		$post_user = $_POST['username'];
		$post_pass = $_POST['password'];
		
		echo "post_user: " . $post_user . " post_pass: " . $post_pass . "<br>";	

		if (($post_user == $user) && ($post_pass == $pass)) {
				
			echo "user & pass correct";

			$post_md5 = md5($post_user . $post_pass);

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
			//echo 'Username/Password Invalid';
			return false;
		}

	} else {
		//echo 'You must supply a username and password.';
		return false;
	}
};

if(!checkCookie()){
	checkPostdata();
} else {
	echo "loggedin";
}
?>