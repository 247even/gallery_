jsLoader = function(od) {
    var options = {
        // path to jsLoader.php
        //'url' = 'jsLoader.php',
        'url': 'gallery/jsLoader.php',
        'path': '',
        'outpath': '/js/',
        'filter': '*.{js,json,js.gz,json.gz}',
        'concat': false,
        'minify': false,
        'gzip': false,
        'cache': false,
        'srcpath': '',
        'async': false,
        'head': false
    };

    this.set = function(od) {
        if (od) {
            for (var key in od) {
                options[key] = od[key];
            }
        }
    };

    if (od) {
        this.set(od);
    }

    var request = new XMLHttpRequest();
    request.onloadend = function(e) {
        var response = JSON.parse(e.target.responseText);

        for (i = 0; response.outfiles.length > i; i++) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = options.srcpath + response.outfiles[i];
            if (options.async) {
                script.async = "async";
            }
            script.onload = funcLoad;
            script.onreadystatechange = funcReadyStateChange;
            script.onerror = funcError;

            if (options.head) {
                document.head.appendChild(script);
            } else {
                document.body.appendChild(script);
            }

            var done = false;

            function funcLoad() {
                if (!done) {
                    done = true;
                    //callback(path, "ok");
                }
            }

            function funcReadyStateChange() {
                var state;

                if (!done) {
                    state = scr.readyState;
                    if (state === "complete") {
                        funcLoad();
                    }
                }
            }

            function funcError() {
                if (!done) {
                    done = true;
                    //callback(path, "error");
                }
            }

        }
        /*
         for ( i = 0; response.names.length > i; i++) {
         var script = document.createElement("script");
         script.type = "text/javascript";
         script.src = options.srcpath+response.names[i];
         document.body.appendChild(script);
         }
         */
    };
    //var url = options.url+"?path="+path+"&filter="+filter;
    var data = JSON.parse(JSON.stringify(options));
    delete data.url;
    // remove all 'false' or undefined data:
    for (var key in data) {
        if (!data[key]) {
            delete data.url;
        }
    }

    var jurl = options.url + '?options=' + JSON.stringify(data);
    request.open("GET", jurl, true);
    request.send();

};

var jsCheckLoaded = function(v, cb) {

    // wait for js to be loaded
    function doCheck() {
        console.log(window[v]);
        console.log("doCheck");
        if (typeof window[v] == 'undefined' || !window[v]) {
            console.log("jscheckloaded 2: " + window[v]);
            setTimeout(function() {
                doCheck();
            }, 1000);
            return false;
        } else {
            console.log("doCheck success: " + window[v]);
						if(cb){cb();}
            return true;
        }
    };

  return doCheck();
}
