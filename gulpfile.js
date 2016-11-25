var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

gulp.task('default', ['css-assets', 'css-move', 'fonts-move', 'js-assets', 'js-admin-assets', 'js-move', 'move'] ,function () {
  console.log('Hello Gulp!')

});

gulp.task('css-assets', function() {
    return gulp.src('./css/assets/*.css')
        .pipe(concat('assets.css'))
        .pipe(gulp.dest('./css/'))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('css-move', ['fonts-move'], function() {
    return gulp.src(['./css/req/*.css'])
        .pipe(gulp.dest('./dist/css/req/'));
});

gulp.task('fonts-move', function() {
    return gulp.src(['./css/fonts/*'])
        .pipe(gulp.dest('./dist/css/fonts/'));
});

gulp.task('js-assets', function() {
    return gulp.src('./js/assets/*.js')
        .pipe(concat('assets.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(uglify())
        .pipe(rename('assets.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-admin-assets', function() {
    return gulp.src('./js/admin-assets/*.js')
        .pipe(concat('admin-assets.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(uglify())
        .pipe(rename('admin-assets.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-move', function() {
    return gulp.src(['./js/req/*.js'])
        .pipe(gulp.dest('./dist/js/req/'));
});

gulp.task('move', ['move-html', 'move-requests'], function() {

});

gulp.task('move-html', function() {
    return gulp.src(['./admin.html','./gallery.json'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('move-requests', function() {
    return gulp.src(['.requests/*.php'])
        .pipe(gulp.dest('./dist/requests'));
});
