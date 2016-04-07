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

		$("#inputRememberme").click(function(e){
    e.stopImmediatePropagation();
    var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
    var checked = (element.checked) ? false : true;
    element.checked = (checked) ? false : checked.toString();
		});

	// Attach a submit handler to the form
	$("#loginSubmit").click( function(event) {
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
				console.log(data);
			}
		})
	})
});
