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
 * Compile Framework 
 * Autoprefix, Stripcomments, Beautify, Minify. 
 */

gulp.task('build:framework', function() {
    return gulp.src( cfg.routes.framework )
        .pipe(sourcemaps.init())
        .pipe(sass({ 
            outputStyle: 'expanded' 
        }).on('error', sass.logError))
        .pipe(autoprefixer({ 
            browsers: ['last 2 versions'], 
            cascade: false 
        }))
        .pipe(cssbeautify())
        .pipe(header(banner, { 
            cfg: cfg 
        }))
        .pipe( gulp.dest( cfg.routes.dist ) )
        .pipe(cssmin())
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe( gulp.dest( cfg.routes.dist ) );
});

/* 
 * Compile Framework 
 * Autoprefix, Stripcomments, Beautify, Minify. 
 */

gulp.task('build:themes', function() {
    return gulp.src( [cfg.routes.srcThemes + '**/*.scss', '!' + cfg.routes.srcThemes + '**/_*.scss'] )
        .pipe(sourcemaps.init())
        .pipe(sass({ 
            outputStyle: 'expanded' 
        }).on('error', sass.logError))
        .pipe(autoprefixer({ 
            browsers: ['last 2 versions'], 
            cascade: false 
        }))
        .pipe(cssbeautify())
        .pipe(header(banner, { 
            cfg: cfg 
        }))
        .pipe( gulp.dest( cfg.routes.dist ) )
        .pipe(cssmin())
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe( gulp.dest( cfg.routes.distThemes ) );
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
    gulp.watch( cfg.routes.src + '**/*', ['util:clean', 'build:framework', 'build:themes']);
});


/* 
 * Watch task 
 */

gulp.task('watch', ['util:clean', 'build:framework', 'build:themes', 'watch:scss']);


/* 
 * Default task 
 */

gulp.task('default', ['util:clean', 'build:framework', 'build:themes']);