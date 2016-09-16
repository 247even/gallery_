var gulp = require('gulp');
var purify = require('gulp-purifycss');

var gulp = require('gulp');
gulp.task('default', function () { console.log('Hello Gulp!') });

gulp.task('css', function() {
  return gulp.src('./css/bootstrap.min.css')
    .pipe(purify(['./.css/bootstrap-select.min.css', './css/slider.css', './css/style.css', './css/gallery.css', './css/mbr-additional.css', './css/imafox.css']))
    .pipe(gulp.dest('./dist/css'));
});