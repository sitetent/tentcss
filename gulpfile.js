/*!
 * Tent CSS 
 * http://css.sitetent.com
 *
 * Copyright (c) 2017, Aaron Mazade
 * Licensed under the MIT license
 */

'use strict';

var gulp             = require('gulp'),
    sass             = require('gulp-sass'),
    autoprefixer     = require('gulp-autoprefixer'),
    sourcemaps       = require('gulp-sourcemaps'),
    cssmin           = require('gulp-cssmin'),
    rename           = require('gulp-rename'),
    del              = require('del'),
    stripCssComments = require('gulp-strip-css-comments'),
    cssbeautify      = require('gulp-cssbeautify'),
    header           = require('gulp-header'),
    watch            = require('gulp-watch');
    config           = require('./package.json'),

/* Header banner */
var banner = ['/*!',
    '  * <%= config.prettyName %>',
    '  * Version: <%= config.version %>',
    '  * Website: <%= config.homepage %>',
    '  * License: <%= config.license %>',
    '  */',
    '\n'
].join('\n');


/* 
 * Clean task
 */

gulp.task('clean', function() {
    return del( config.routes.dist + '*');
});

/* 
 * Compile SCSS 
 * Autoprefix, Stripcomments, Beautify, Minify. 
 */

gulp.task('scss', function() {
    return gulp.src( config.routes.scss )
        .pipe(sourcemaps.init())
        .pipe(sass({ 
            outputStyle: 'expanded' 
        }).on('error', sass.logError))
        .pipe(autoprefixer({ 
            browsers: ['last 2 versions'], 
            cascade: false 
        }))
        .pipe(stripCssComments({ 
            preserve: false 
        }))
        .pipe(cssbeautify())
        .pipe(header(banner, { 
            pkg: config 
        }))
        .pipe(gulp.dest( config.routes.dist ))
        .pipe(cssmin())
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( config.routes.dist ));
});


/*
 * Watch files, clean and rebuild SCSS on change 
 */

gulp.task('watch:scss', function() {
    gulp.watch( config.routes.src + '**/*', ['clean', 'scss']);
});


/* 
 * Watch task 
 */

gulp.task('watch', ['clean', 'scss', 'watch:scss']);


/* 
 * Default task 
 */

gulp.task('default', ['clean', 'scss']);