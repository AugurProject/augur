"use strict";

var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var gutil = require("gulp-util");

gulp.task("default", function () {

    var b = browserify({
        entries: "./src/index.js",
        debug: true
    });

    return b.bundle()
        .pipe(source("augur.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .on("error", gutil.log)
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./dist/"));

});
