var adminAssets = false;

if (typeof assets != true) {
  jsLoader({
      url: 'jsLoader.php',
      path: 'js/assets/',
      outpath: '/js/',
      filter: '*.{js,json}',
      srcpath: 'js/',
      concat: true,
      minify: false,
      gzip: false,
      cache: false,
      head : true
  });
};
