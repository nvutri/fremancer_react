var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-clean-css');

gulp.task('default', function () {
  return gulp.src([
    'css/bootstrap.min.css',
    'css/react-bootstrap-table-all.min.css',
    'css/react-select.min.css',
    'css/react-datepicker.css',
    'css/font-awesome.min.css',
    'css/app.css'
  ]).pipe(concat('bundle.css'))
    .pipe(gulp.dest('../fremancer/static/'));
});
