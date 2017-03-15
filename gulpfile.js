'use strict';

const gulp        = require('gulp');
const del         = require('del');
const util        = require('gulp-util');
const sass        = require('gulp-sass');
const prefixer    = require('gulp-autoprefixer');
const csso        = require('gulp-csso');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
const ghPages     = require('gulp-gh-pages');
const sassGlob    = require('gulp-sass-bulk-import');
const watch       = require('gulp-watch');
const babel       = require('gulp-babel');
const plumber     = require('gulp-plumber');

var paths = {
  src: { root: 'src' },
  dist: { root: 'dist' },
  init: function() {
    this.src.sass        = this.src.root + '/public/sass/**/*.scss';
    this.src.templates   = this.src.root + '/**/*.hbs';
    this.src.javascript  = [this.src.root + '/public/js/**/*.js', '!' + this.src.root + '/js/libs/*.js'];
    this.src.libs        = this.src.root + '/public/js/libs/*.js';
    this.src.images      = this.src.root + '/public/img/**/*.{jpg,jpeg,svg,png,gif}';
    this.src.files       = [this.src.root + '/*', '!' + this.src.root + '/*.hbs'];

    this.dist.css        = this.dist.root + '/public/css';
    this.dist.images     = this.dist.root + '/public/img';
    this.dist.javascript = this.dist.root + '/public/js';
    this.dist.libs       = this.dist.root + '/public/js/libs';

    return this;
  },
}.init();

gulp.task('serve', () => {
  browserSync.init({
    server: paths.dist.root,
    open: false,
    notify: false,
    port: 3010,

    // Whether to listen on external
    online: false,
  });
});

gulp.task('styles', () => {
  gulp.src([paths.src.sass])
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths: ['src/public/sass'],
    }))
    .pipe(prefixer('last 4 versions'))
    .pipe(csso({
        keepSpecialComments: 1
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Compile handlebars/partials into html
*/
gulp.task('templates', () => {
  var opts = {
    ignorePartials: true,
    batch: ['src/partials'],
  };

  gulp.src([paths.src.root + '/*.hbs'])
    .pipe(plumber())
    .pipe(handlebars(null, opts))
    .pipe(rename({
      extname: '.html',
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Bundle all javascript files
*/
gulp.task('scripts', () => {
  gulp.src(paths.src.javascript)
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dist.javascript))
    .pipe(browserSync.reload({stream: true}));

  /*
  * Uglify JS libs and move to dist folder
  */
  gulp.src([paths.src.libs])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.dist.libs))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', () => {
  gulp.src([paths.src.images])
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task('files', () => {
  gulp.src(paths.src.files)
    .pipe(gulp.dest(paths.dist.root));
});

// watch(paths.src.images, () => {
//   gulp.start('images');
// });

// watch(paths.src.files, () => {
//   gulp.start('files');
// });

gulp.task('watch', () => {
  gulp.watch(paths.src.sass, ['styles']);
  gulp.watch(paths.src.javascript, ['scripts']);
  gulp.watch(paths.src.templates, ['templates']);
});

gulp.task('deploy', () => {
  return gulp.src([paths.dist.root + '/**/*'])
    .pipe(ghPages());
});

gulp.task('build', ['images', 'files', 'styles', 'scripts', 'templates']);

gulp.task('default', ['watch', 'serve', 'images', 'files', 'styles', 'scripts', 'templates']);
