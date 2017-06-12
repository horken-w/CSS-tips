var gulp = require('gulp'),
	less = require('gulp-less'),
	rename = require('gulp-rename');

gulp.task('less', function(){
	gulp.src('./style.less')
		.pipe(less())
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./dis'))
});

gulp.task('watch', function(){
	gulp.watch('./**/*.less', ['less']);
})

gulp.task('default', ['less', 'watch']);