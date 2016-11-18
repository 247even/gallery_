var _resizeStoreSizes = function(folder, file, sizes, force) {

    if (!folder || !file) {
       //console.log("no folder or file!")
        return false;
    }

    var sizes = sizes || options.sizes;
    var force = force || false;

    var done;
    this.done = function(cb) {
        done = cb;
    };

    var i = 0;
    send();

    function send() {
        if (i < sizes.length) {

            stat.workingSize = sizes[i];

            resizeStore(folder, file, sizes[i], false).done(function() {
                i++;
                send();
            }).fail(function() {
               //console.log("resizeStore fail");
            });

        } else {
            done();
        }
    };
};
