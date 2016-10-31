/* Sliders */

$('.admin-header a[aria-controls="slider-panel"]').on('shown.bs.tab', function(e) {

    if ( !$('#slider-sortable .sortable-item').length ) {
        for (var i = 0; i < 2; i++) {
          prototype({
            'template' : '#placeholder-item-prototype',
            'targets' : '#slider-sortable'
          });
        }

        proportion('#slider-sortable .placeholder-item', 1, 1);

//        var phel = document.querySelectorAll('#slider-sortable .placeholder-item');
//        proportion(phel, 1, 1);
        //$('#slider-sortable .placeholder-item').proportion(1,1);
    }


    var blurIntensity = 5;

    document.getElementById('blur-slider').value = blurIntensity;
    document.getElementById('blur-input').value = blurIntensity;

    function fullScreen(img) {
        var ef = document.getElementById("effect-fullscreen");
        document.getElementById("effect-preview-image").addEventListener("click", function() {
            ef.style.display = 'block';
            ef.style.backgroundImage = 'url(' + img + ')';
        });
        ef.addEventListener("click", function() {
            ef.style.display = 'none';
        });
    };

    function loadBlur() {

        var selImg = document.querySelector("#slider-sortable .selected-image .thumb-div");

        if (!selImg) {
          console.log(selImg);
          var selItem = document.querySelector("#slider-sortable .gallery-item");
          selItem.className += " selected-image";
          selImg = document.querySelector("#slider-sortable .selected-image .thumb-div");
        }

        var imgSrc = selImg.getAttribute("respi-path");
        $("#blurPath").val(imgSrc);
        var imgSrcSplit = imgSrc.split("/");
        var imgSrc_720 = imgSrc.replace("_respi", "_720");
        var imgSrc_720_blur = imgSrc_720.replace("gallery", "gallery/blur");

        //document.querySelector("#blur-status").innerHTML = "Static blur image not found.";

        $("#blur-image-frame img").attr('src', imgSrc_720).imagesLoaded().always(function() {
            //console.log("blur image");
        }).done(function() {
            blur('#effect-preview-image', blurIntensity);
            fullScreen(imgSrc_720);
            blur('#effect-fullscreen', blurIntensity);
        });

        /*
         $("#blurImageFrame img").attr('src', imgSrc_720_blur + '?ts=' + Date.now()).imagesLoaded().always(function(instance) {
         //console.log('blur image request');
         }).done(function(instance) {
         document.querySelector("#blur-status").innerHTML = "Static blur image found.";
         fullScreen(imgSrc_720_blur);
         //console.log("blur image loaded");
         }).fail(function() {
         console.log('image failure');
         document.querySelector("#blur-status").innerHTML = "Static blur image not found.";

         $("#blurImageFrame img").attr('src', imgSrc_720).imagesLoaded().always(function() {
         console.log("blur image not loaded");
         }).done(function() {
         blur('#effect-preview-image', blurIntensity);
         fullScreen(imgSrc_720);
         blur('#effect-fullscreen', blurIntensity);
         });

         });
         */

    };

    $("#blur-slider").rangeslider({
        polyfill: false,
        onInit: function(position, value) {
            //document.getElementById("blur-input").value = value;
        },
        onSlide: function(position, value) {
            document.getElementById("blur-input").value = value;
        },
        onSlideEnd: function(position, value) {
            blurIntensity = value;
            document.getElementById("blur-input").value = value;
            blur('#effect-preview-image', value);
            blur('#effect-fullscreen', value);
        }
    });

    $("#blur-input").on("change", function() {
        var bsval = document.getElementById("blur-slider").value;
        if (bsval != this.val) {
            $("#blur-slider").val(this.value).change();
        }
    });

    $("#blur-submit").click(function(e) {
        e.preventDefault();
        var postdata = $("#blur-form").serialize();
        console.log(postdata);
        $.ajax({
            type: "GET",
            url: "gallery/blur.php",
            data: postdata,
            success: function(data) {
                console.log(data);
                if (data == "done") {
                    loadBlur();
                }
            }
        })
    });

    $(".gallery-row .selected-image").removeClass("selected-image");
    //	$('.sortable').sortable('destroy');
    document.getElementById('slider-sortable').innerHtml = "";

    var nS = document.getElementById("slider-number-select");
    var sliderNumber = nS.options[nS.selectedIndex].text;
    nS.addEventListener("change", function() {
        sliderNumber = nS.options[nS.selectedIndex].text;
        //console.log(nS.options[nS.selectedIndex].text);
    });

    function selectedIds() {
        var selected_ids = [];
        var items = document.querySelectorAll("#slider-sortable .gallery-item");
        for (var i = 0, len = items.length; i < len; i++) {
            selected_ids.push(items[i].getAttribute("data-id"));
        }
        return selected_ids;
    };

    function autoIds(q) {

        if (!$("#slider-sortable").is(':empty')) {
            $("#slider-sortable .gallery-item").each(function() {
                var did = $(this).attr('data-id');
                console.log(did);
                //$('[data-id="'+did+'"]').addClass("selected-image");

                $('.gallery-row [data-id="' + did + '"]').addClass("selected-image");
            });
            return false;
        }

        var slider1 = gJ.sliders[0];
        if (slider1.length > 1 || slider1 != "auto") {
            /*
             for (var i = 0, len = slider1.length; i < len; i++) {
             $('*[data-id="'+slider1[i]+'"]').addClass("selected-image");
             }
             */

            for (var i = 0, len = slider1.length; i < len; i++) {
                console.log(slider1[i]);
                $('*[data-id="' + slider1[i] + '"]').addClass("selected-image");
                document.querySelector('.gallery-row div[data-id="' + gJ.sliders[0][i] + '"]').click();
            }
        }

        return false;

        var a = sliderNumber;
        if (q) {
            a = q;
        }
        var ids = [];
        $(".gallery .gallery-item").each(function(k, v) {
            if (k < a) {
                ids.push($(this).attr('data-id'));
            }
        });
    };
    autoIds();

    /*
     sortable('.sortable',{
     placeholderClass: 'col-xs-3 gallery-item sort-placeholder',
     forcePlaceholderSize: true
     //hoverClass: 'sort-placeholder'
     });

     sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
     console.log(e);
     gJ.sliders["slider1"] = selectedIds();
     saveStatus(true);
     });
     */

    function reset() {
        clearHtml(["#slider-sortable"]);
        removeClasses(".gallery-item", ["selected-image"]);
        //$(".gallery-item").removeClass("selected-image");

        for (var i = 0; i < 2; i++) {
          prototype({
            'template' : '#placeholder-item-prototype',
            'targets' : '#slider-sortable'
          });
        }

        //var phel = document.querySelectorAll('#slider-sortable .placeholder-item');
        //proportion(phel, 1, 1);
        proportion('#slider-sortable .placeholder-item', 1, 1);

        //$("#slider-sortable").html("");
				$("#slider-save-btn").prop("disabled", true);
        $("#slider-clear-btn").prop("disabled", true);
        $("#slider-preview-btn").prop("disabled", true);
    };

    $("#slider-clear-btn").on("click", function(e) {
        e.preventDefault();
        reset();
    });

    $("#slider-auto-btn").on("click", function(e) {
        e.preventDefault();
        reset();

        var sliderNumber = nS.options[nS.selectedIndex].text;
        $(".gallery .gallery-item").each(function(k, v) {
            if (k < sliderNumber) {
                $(this).trigger('click');
            }
        });

        gJ.sliders[0] = [];
    });

    $("#slider-save-btn").on("click", function(e) {
        e.preventDefault();
        gJ.sliders[0] = selectedIds();
        saveStatus(true);
    });

    $("#slider-preview-btn").on("click", function(e) {
        e.preventDefault();
        buildSliders();
        $('#slider-wrapper').removeClass('hidden');
        $('#slider-1 .item').respi();
        setTimeout(function() {
            $('#slider-1').carousel();
        }, 1000);
    });

    $('#slider-wrapper').on('click', function() {
        $('#slider-wrapper').addClass('hidden');
    });

    /*
     $(".gallery-row .gallery-item").removeClass("selected-image").off("click").on("click", function(e) {
     e.preventDefault();
     e.stopPropagation();
     $(".gallery-item").removeClass("selected-image");
     $(this).addClass("selected-image");

     loadBlur();
     });
     */

    sortable('.sortable', {
        placeholderClass: 'col-xs-2 gallery-item sort-placeholder',
        forcePlaceholderSize: true,
        hoverClass: 'is-hovered'
    })

    sortable('.sortable')[0].addEventListener('sortupdate', function(e) {
        gJ.sliders[0] = selectedIds();
        saveStatus(true);
    });

    $(".gallery-row .gallery-item").off("click").on("click", function(e) {

        e.preventDefault();
        e.stopPropagation();

        $(this).toggleClass("selected-image");

        if ($(this).hasClass("selected-image")) {

            $("#slider-sortable .gallery-item").removeClass("selected-image");
            var cl = 'thumbSize gallery-item col-xs-2 selected-image sortable-item'
            $(this).clone().off().removeClass().addClass(cl).appendTo("#slider-sortable").on("click", function() {
                $("#slider-sortable .gallery-item").removeClass("selected-image");
                $(this).addClass("selected-image");
                loadBlur();
            });

            $("#slider-sortable .gallery-item a").remove();

            // set same height for chrome
            var el = document.querySelectorAll("#slider-sortable .gallery-item");
            if (el.length > 0) {
              proportion(el, 1, 1);
              $("#slider-sortable .gallery-item").css('height', Math.round(el[0].offsetHeight));
            }

        } else {
            var data_id = $(this).attr("data-id");
            $("#slider-sortable div[data-id='" + data_id + "']").remove();
        }

        sortable('.sortable');

        var selected_ids = selectedIds();
        var selLength = selected_ids.length;
        var dis = true;

        $('#slider-sortable .placeholder-item').remove();

        if (selLength === 0) {
          for (var i = 0; i < 2; i++) {
            prototype({
              'template' : '#placeholder-item-prototype',
              'targets' : '#slider-sortable'
            });
          }
          proportion('#slider-sortable .placeholder-item', 1, 1);
          //$('#slider-sortable .placeholder-item').proportion(1,1);
          document.getElementById('effect-preview-image').src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }

        if (selLength > 0) {
          loadBlur();
        }

        if (selLength === 1) {
          prototype({
            'template' : '#placeholder-item-prototype',
            'targets' : '#slider-sortable'
          });
          proportion('#slider-sortable .placeholder-item', 1, 1);
          //$('#slider-sortable .placeholder-item').proportion(1,1);
        }

        if (selLength >= 2 ) {
          dis = false;
        }

        $("#slider-save-btn").prop("disabled", dis);
        $("#slider-clear-btn").prop("disabled", dis);
        $("#slider-preview-btn").prop("disabled", dis);

        gJ.sliders[0] = selected_ids;
        saveStatus(true);

    });

    /*
     $('.sortable').sortable('.sortable',{
     placeholderClass: 'col-xs-3 gallery-item sort-placeholder',
     forcePlaceholderSize: true,
     hoverClass: 'is-hovered'
     }).unbind('sortupdate').bind('sortupdate', function(e, ui) {
     gJ.sliders["slider1"] = selectedIds();
     saveStatus(true);
     });
     */

});
