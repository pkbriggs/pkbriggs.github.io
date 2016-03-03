var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var ghPages = require('gulp-gh-pages');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');

// starts a local webserver on port 8000 to serve static files
gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: false, // requires livereload browser plugin to work!
      open: false // don't open it in the browser when running gulp
    }));
});

// compile sass to css
gulp.task('sass', function () {
  return gulp.src('./css/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ // make sure we add vendor prefixes!
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

// compile all of our jade templates to html
gulp.task('jade', function() {
  return gulp.src('./views/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

// compile all our coffeescript files to js
gulp.task('coffee', function() {
  gulp.src('./coffee/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

// simply copy files in our lib folder to our output folder
gulp.task('copy-lib', function() {
  gulp.src('./lib/js/*.js')
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
  gulp.src('./lib/css/*.css')
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
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
    .pipe(livereload());
});

// watch our files for changes
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./css/*.scss', ['sass']);
  gulp.watch('./views/**/*.jade', ['jade']);
  gulp.watch('./img/*', ['imagemin']);
  gulp.watch('./coffee/*', ['coffee']);
});

// deploy to github pages automatically
gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// group together all the relevant 'build' tasks for our convenience
gulp.task('build', ['sass', 'jade', 'imagemin', 'coffee', 'copy-lib']);

// by default, build everything, start the webserver, and watch our files for changes
gulp.task('default', ['build', 'webserver', 'watch']);
