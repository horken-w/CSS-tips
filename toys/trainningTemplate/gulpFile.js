var gulp = require('gulp'),
	less = require('gulp-less'),
	watchLess = require('gulp-watch-less');

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./css'));
});

gulp.task('default', ['less']);