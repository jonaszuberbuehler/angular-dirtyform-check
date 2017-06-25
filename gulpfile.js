(function () {
    'use strict';
    
    const gulp = require('gulp');
    const connect = require('gulp-connect');
    const jshint = require('gulp-jshint');
    const stylish = require('jshint-stylish');
    const gulpif = require('gulp-if');
    const uglify = require('gulp-uglify');
    const concat = require('gulp-concat');
    
    gulp.task('ngRoute-demo', function () {
        gulp.watch(['./src/**/*', './ngRoute-demo/**/*'], ['reload']);
        connect.server({
            root: ['./ngRoute-demo', './'],
            livereload: true
        });
    });
    
    gulp.task('ui.router-demo', function () {
        gulp.watch(['./src/**/*', './ui.router-demo/**/*'], ['reload']);
        connect.server({
            root: ['./ui.router-demo', './'],
            livereload: true
        });
    });
    
    gulp.task('reload', function () {
        gulp.src(['./src/**/*', './ui.router-demo/**/*', './ngRoute-demo/**/*'])
            .pipe(gulpif('*.js', jshint()))
            .pipe(gulpif('*.js', jshint.reporter(stylish)))
            .pipe(connect.reload());
    });
    
    gulp.task('build', function () {
        return gulp.src('./src/*.js')
            .pipe(concat('angular-dirtyform-check.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./dist'));
    })
})();
