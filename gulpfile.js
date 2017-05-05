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
    gulpif           = require('gulp-if'),
    del              = require('del'),
    stripCssComments = require('gulp-strip-css-comments'),
    cssbeautify      = require('gulp-cssbeautify'),
    header           = require('gulp-header'),
    watch            = require('gulp-watch'),
    cfg              = require('./package.json');

/* Header banner */
var banner = ['/*!',
    '  * <%= cfg.fullname %>',
    '  * Version: <%= cfg.version %>',
    '  * Website: <%= cfg.homepage %>',
    '  * License: <%= cfg.license %>',
    '  */',
    '\n'
].join('\n');


/* 
 * Compile SCSS 
 * Autoprefix, Stripcomments, Beautify, Minify. 
 */

gulp.task('build:scss', function() {
    return gulp.src( [cfg.routes.src + 'tent.scss', cfg.routes.src + 'themes/**/*.scss', '!' + cfg.routes.src + 'themes/**/_*.scss' ] )
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
            cfg: cfg 
        }))
        .pipe(gulp.dest( cfg.routes.dist ))
        .pipe(cssmin())
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(sourcemaps.write('.'))
        // .pipe( gulpif( [ 'tent.css', 'tent.min.css' ], gulp.dest( cfg.routes.dist ), gulp.dest( cfg.routes.dist + 'themes/' ) ) )
        .pipe( gulp.dest( cfg.routes.dist ) );
});

/* 
 * Clean task
 */

gulp.task('util:clean', function() {
    return del( cfg.routes.dist + '*');
});


/*
 * Watch files, clean and rebuild SCSS on change 
 */

gulp.task('watch:scss', function() {
    gulp.watch( cfg.routes.src + '**/*', ['util:clean', 'build:scss']);
});


/* 
 * Watch task 
 */

gulp.task('watch', ['util:clean', 'build:scss', 'watch:scss']);


/* 
 * Default task 
 */

gulp.task('default', ['util:clean', 'build:scss']);