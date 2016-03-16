var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var ghPages = require('gulp-gh-pages');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var browserSync = require('browser-sync').create();
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


// both used to serve static files as well as automatically reload browser on changes
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    notify: false // do not show a notification every time an update is done
    // open: false // can be set so it does not automatically open browser
  });
});

// compile sass to css
gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Sass error: <%= error.message %>")}))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ // make sure we add vendor prefixes!
      browsers: ['last 2 versions']
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// compile all of our jade templates to html
gulp.task('jade', function() {
  return gulp.src('./views/**/*.jade')
    .pipe(plumber({errorHandler: notify.onError("Jade error: <%= error.message %>")}))
    .pipe(jade())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// compile all our coffeescript files to js
gulp.task('coffee', function() {
  gulp.src('./coffee/*.coffee')
    .pipe(plumber({errorHandler: notify.onError("CoffeeScript error: <%= error.message %>")}))
    .pipe(coffee({bare: true}))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// simply copy files in our lib folder to our output folder
gulp.task('copy-lib', function() {
  gulp.src('./lib/js/*.js')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
  gulp.src('./lib/css/*.css')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// minify images (lossless) automatically!
gulp.task('imagemin', function() {
  return gulp.src('./img/*')
    // .pipe(imagemin({
    .pipe(cache(imagemin({ // can cache to prevent re-minification every time gulp is run (though it is sometimes buggy)
      progressive: true,
      use: [pngquant()]
    // }))
    })))
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.stream());
});

// watch our files for changes
gulp.task('watch', function () {
  gulp.watch('./views/**/*.jade', ['jade']);
  gulp.watch('./css/*.scss', ['sass']);
  gulp.watch('./img/*', ['imagemin']);
  gulp.watch('./coffee/*', ['coffee']);
});

// deploy to github pages automatically
gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      branch: "master" // deploy branch needs to be master, since this is a Github user site, not a project site
    }));
});

// group together all the relevant 'build' tasks for our convenience
gulp.task('build', ['jade', 'sass', 'imagemin', 'coffee', 'copy-lib']);

// by default, build everything, start the webserver, and watch our files for changes
gulp.task('default', ['build', 'browser-sync', 'watch']);
