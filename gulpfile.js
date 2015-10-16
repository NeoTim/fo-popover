'use strict';

var gulp = require('gulp'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  babelify = require('babelify');

gulp.task('default', ['less', 'js', 'watch']);

gulp.task('less', function() {
  return gulp.src('./src/less/fo-popover.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
  return browserify('./src/js/main.js')
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename('fo-popover.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/less/*.less'], ['less']);
  gulp.watch(['./src/js/*.js'], ['js']);
});
