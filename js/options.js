

function test(y) {
  var x = false;

  //var y = true;
  !y && console.log('true test &&');
  y || console.log('true test ||');

  var t = document.head;
  t.insertAdjacentHTML('beforeend', '<div>hello</div>');
}
test();

var options = {
    galleryPath : './gallery/',
    JSONurl : 'gallery/gallery.json',
    sizes : '280,430,720,1200',
    thumbPadding : 0,
    proportion: [1,1],
    thumbSize : 'md',
    thumbFit : 'cover',
    thumbSizeSizes : {
        'xs': ['col-xs-1'],
        'sm': ['col-xs-2', 'col-sm-1'],
        'md': ['col-xs-3', 'col-sm-2', 'col-md-1'],
        'lg': ['col-xs-4', 'col-sm-3', 'col-md-2', 'col-lg-1'],
        'xl': ['col-xs-5', 'col-sm-4', 'col-md-3', 'col-lg-2'],
        'xxl': ['col-xs-6', 'col-sm-5', 'col-md-4', 'col-lg-3']
    }
}
