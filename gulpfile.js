var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var chown = require('gulp-chown');
var chmod = require('gulp-chmod');
var git = require('gulp-git');

gulp.task('default', [
      'css-base',
      'css-assets',
      'css-req-move',
      'fonts-move',
      'js-base',
      'js-assets',
      'js-admin-assets',
      'js-req-move',
      'move',
      'ca'
    ] ,function () {
          console.log('gulp default')
});

gulp.task('css-base', function() {
    return gulp.src(['./css/gallery.css', './css/gallery-admin.css'])
        //.pipe(cssnano())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('css-assets', function() {
    return gulp.src('./css/assets/*.css')
        .pipe(concat('assets.css'))
        .pipe(gulp.dest('./css/'))
        //.pipe(cssnano())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('css-req-move', ['fonts-move'], function() {
    return gulp.src(['./css/req/*.css'])
        .pipe(gulp.dest('./dist/css/req/'));
});

gulp.task('fonts-move', function() {
    return gulp.src(['./css/fonts/*'])
        .pipe(gulp.dest('./dist/css/fonts/'));
});

gulp.task('js-base', function() {
    return gulp.src(['./js/gallery.js', './js/gallery-init.js', './js/gallery-admin.js', './js/jsLoader.js'])
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-assets', function() {
    return gulp.src('./js/assets/*.js')
        .pipe(concat('assets.js'))
        .pipe(gulp.dest('./js/'))
        //.pipe(uglify())
        .pipe(rename('assets.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-admin-assets', function() {
    return gulp.src('./js/admin-assets/*.js')
        .pipe(concat('admin-assets.js'))
        .pipe(gulp.dest('./js/'))
        //.pipe(uglify())
        .pipe(rename('admin-assets.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-req-move', function() {
    return gulp.src(['./js/req/*.js'])
        .pipe(gulp.dest('./dist/js/req/'));
});

gulp.task('move', ['base-move', 'move-requests'], function() {

});

gulp.task('base-move', ['move-requests'], function() {
    return gulp.src(['./admin.html', './options.json', './jsLoader.php', './login.php'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('move-requests', function() {
    return gulp.src(['./requests/*.php'])
        .pipe(gulp.dest('./dist/requests'));
});

gulp.task('ca', function() {
    return gulp.src([
        './dist/jsLoader.php',
        './dist/login.php',
        './dist/css/**',
        './dist/js/**',
        './dist/requests/**'
      ], {base:"./dist/"})
      .pipe(gulp.dest('../cad-artist/'));
});

gulp.task('chown', function() {
    return gulp.src('*.*')
            .pipe(chown('247even'))
            .pipe(chmod({
                        owner: {
                            read: true,
                            write: true,
                            execute: true
                        },
                        group: {
                            read: true,
                            write: true,
                            execute: true
                        },
                        others: {
                            execute: true
                        }
                    }))
            .pipe(gulp.dest(''));
});


gulp.task('git', function(){
  return gulp.src('*')
    .pipe(git.add({args: '--all'}))
    .pipe(git.commit(undefined, {
      args: '-m "done--"',
      disableMessageRequirement: true
    }));
});

gulp.task('commit', function(){
  return gulp.src('*')
    .pipe(git.commit(undefined, {
      args: '-m "done--"',
      disableMessageRequirement: true
    }));
});

gulp.task('gitpush', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});
