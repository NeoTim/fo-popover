'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var nano = require('gulp-cssnano');
var replaceName = require('gulp-replace-name');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task('default', ['less', 'js', 'watch']);

gulp.task('less', function() {
  return gulp.src('./src/less/fo-popover.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(nano())
    .pipe(replaceName(/\.css/g, '.min.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
  return browserify('./src/js/main.js')
    .transform('babelify', {presets: 'es2015'})
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename('fo-popover.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(streamify(uglify()))
    .pipe(streamify(replaceName(/\.js/g, '.min.js')))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/less/*.less'], ['less']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
});
