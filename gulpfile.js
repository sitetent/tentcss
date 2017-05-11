/*!
 * Tent CSS 
 * http://css.sitetent.com
 *
 * Copyright (c) 2017, Aaron Mazade
 * Licensed under the MIT license
 */

'use strict';

const gulp             = require('gulp');
const sass             = require('gulp-sass');
const autoprefixer     = require('gulp-autoprefixer');
const sourcemaps       = require('gulp-sourcemaps');
const cssmin           = require('gulp-cssmin');
const plumber          = require('gulp-plumber');
const rename           = require('gulp-rename');
const del              = require('del');
const cssbeautify      = require('gulp-cssbeautify');
const header           = require('gulp-header');
const watch            = require('gulp-watch');
const browserSync      = require('browser-sync');
const cfg              = require('./package.json');


/**
 * Distribution files banner 
 */
var banner = ['/*!',
    '  * <%= cfg.fullname %>',
    '  * Version: <%= cfg.version %>',
    '  * Website: <%= cfg.homepage %>',
    '  * License: <%= cfg.license %>',
    '  */',
    '\n'
].join('\n');


/** 
 * Build CSS Distribution files 
 * Autoprefix, Stripcomments, Beautify, Minify. 
 */

gulp.task('build:framework', function() {
    return gulp.src( cfg.buildSettings.framework )
        .pipe(plumber())
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
        .pipe( gulp.dest( cfg.buildSettings.dist ) )
        .pipe(cssmin())
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(plumber.stop())
        .pipe( gulp.dest( cfg.buildSettings.dist ) )
        .pipe(browserSync.reload({stream: true}));
});

/** 
 * Utility: Clean task
 */

gulp.task('util:clean', function() {
    return del( cfg.buildSettings.dist + '*');
});

/**
 * BrowserSync
 */

gulp.task('serve', function() {
  browserSync.init({
    server: cfg.buildSettings.sync.dir,
    open: false,
    notify: false,
    port: cfg.buildSettings.sync.port,

    // Whether to listen on external
    online: false,
  });
});


/*
 * Watch files, clean and rebuild SCSS on change 
 */

gulp.task('watch:scss', function() {
    gulp.watch( cfg.buildSettings.src + '**/*', ['util:clean', 'build:framework']);
});

/** 
 * Watch task 
 */

gulp.task('watch', ['util:clean', 'build:framework', 'watch:scss', 'serve']);


/** 
 * Default task 
 * This will just run a build of the files. Does not watch files.
 */

gulp.task('default', ['util:clean', 'build:framework']);