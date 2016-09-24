var loggedin;

$(function() {
	/*
	 $.ajax({
	 type : "POST",
	 url : "login.php",
	 data :
	 success : function(data) {
	 console.log(data);
	 }
	 });
	 */

	function checkLoggedin() {
		if (!loggedin) {
			/*
			$.ajax({
				type : "POST",
				url : "login.php",
				success : function(data) {
					loggedin = data;
					if (loggedin) {
						// tba
					}
				}
			})
			*/

			var request = new XMLHttpRequest();
			request.open('POST', 'login.php', true);

			request.onload = function(data) {
				if (request.status >= 200 && request.status < 400) {
					loggedin = data;
					if (loggedin) {
						// tba
					}
				} else {
					console.log("nope");
				}
			};

			request.onerror = function() {
				console.log("connection error");
			};

			request.send();

		}
	};

	console.log(checkLoggedin());

	$("#inputRememberme").click(function(e) {
		e.stopImmediatePropagation();
		var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
		var checked = (element.checked) ? false : true;
		element.checked = (checked) ? false : checked.toString();
	});

	// Attach a submit handler to the form
	$("#loginSubmit").click(function(event) {
		console.log("submit");

		// Stop form from submitting normally
		event.preventDefault();

		// Get some values from elements on the page:
		var postdata = $("form").serialize();
		console.log("postdata: " + postdata);

		// Send the data using post
		$.ajax({
			type : "POST",
			url : "login.php",
			data : postdata,
			success : function(data) {
				console.log("data: " + data);
			}
		})
	})
});
