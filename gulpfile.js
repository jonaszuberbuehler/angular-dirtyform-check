(function () {
    'use strict';
    
    const gulp = require('gulp');
    const connect = require('gulp-connect');
    const jshint = require('gulp-jshint');
    const stylish = require('jshint-stylish');
    const gulpif = require('gulp-if');
    const uglify = require('gulp-uglify');
    const concat = require('gulp-concat');
    
    gulp.task('demo', function () {
        gulp.watch(['./src/**/*', './demo/**/*'], ['reload']);
        connect.server({
            root: ['./demo', './'],
            livereload: true
        });
    });
    
    gulp.task('reload', function () {
        gulp.src(['./src/**/*', './demo/**/*'])
            .pipe(gulpif('*.js', jshint()))
            .pipe(gulpif('*.js', jshint.reporter(stylish)))
            .pipe(connect.reload());
    });
    
    gulp.task('build', function () {
        return gulp.src('./src/*.js')
            .pipe(concat('angular-dirty-check.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./dist'));
    })
})();
