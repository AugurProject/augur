// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleancss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    order = require("gulp-order"),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    livereload = require('gulp-livereload'),
    serve = require('gulp-serve'),
    open = require('gulp-open'),
    modernizr = require('gulp-modernizr');

// HTML
gulp.task('html', function() {
  gulp.src('./*.html')
    .pipe(livereload());
});

// Styles
gulp.task('styles', function() {
    return gulp.src(['./src/styles/sass/site.scss'])
    .pipe(sass({
        style: 'compressed',
        errLogToConsole: true
    }))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleancss())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(livereload())
    .pipe(notify({ message: 'Styles task complete' }));
});

// Lint
gulp.task('lint', function() {
    return gulp.src('./src/scripts/site.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'Lint task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(['./src/scripts/**/*.js'])
    .pipe(order([
       "libs/*.js",
       "site.js"
     ]))
    .pipe(concat('site.js'))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(livereload())
    .pipe(notify({ message: 'Scripts task complete' }))
});

gulp.task('modernizr', function() {
  return gulp.src('./js/*.js')
    .pipe(modernizr())
    .pipe(gulp.dest('dist/'))
});

// Images
gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/images'))
    .pipe(livereload())
    .pipe(notify({ message: 'Images task complete' }));
});

// fonts 
gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(livereload())
    .pipe(notify({ message: 'Fonts task complete' }));
}); 

// Clean
gulp.task('clean', function() {
    return gulp.src(['./dist/styles', './dist/scripts', './dist/images', './dist/fonts'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

    livereload.listen();
    gulp.watch('./**/*.html', ['html']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('src/fonts/**/*', ['fonts']);
    gulp.src(__filename).pipe(open({
      uri: 'http://localhost:3000'
    }))
});

gulp.task('webserver', serve('./'))

gulp.task('serve', ['webserver', 'watch'])
