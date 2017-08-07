var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-clean-css');

gulp.task('default', function () {
  return gulp.src(['css/*.css'])
    .pipe(concat('bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/'));
});
