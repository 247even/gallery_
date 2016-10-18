
var loggedin = function() {
    var loginCookie = document.cookie.split('=')[1];
    return (loginCookie) ? true : false;
};

function checkLoggedin() {
    if (!loggedin) {

    }
};

function requestLogin(postdata) {
    var request = new XMLHttpRequest();
    request.open('POST', 'login.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            loggedin = data;
            console.log(data);
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

    request.send(postdata);
};

//console.log(checkLoggedin());

/*
document.getElementById('inputRememberme').onclick = function(e) {
	e.stopImmediatePropagation();
	var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
	var checked = (element.checked) ? false : true;
	element.checked = (checked) ? false : checked.toString();
};
*/

function initLogin() {
    // Attach a submit handler to the form
    document.getElementById('loginSubmit').onclick = function(e) {

        console.log("submit");
        // Stop form from submitting normally
        e.preventDefault();

        var username = document.getElementById('inputUsername').value;
        var password = document.getElementById('inputPassword').value;
        var rememberme = 'off';
        if (document.getElementById('inputRememberme').checked) {
            rememberme = 'on';
        }

        var postdata = "username=" + username + "&password=" + password + "&rememberme=" + rememberme;
        //username=&password=&rememberme=on&depth=5
        console.log("postdata: " + postdata);

        // Send the data using post
        requestLogin(postdata)

        /*
        $.ajax({
            type: "POST",
            url: "login.php",
            data: postdata,
            success: function(data) {
                console.log("data: " + data);
            }
        })
        */
    };
}
