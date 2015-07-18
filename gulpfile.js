"use strict";

var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");
var gutil = require("gulp-util");
var runSequence = require("run-sequence");

gulp.task("clean", function (callback) {
    del(["dist"], callback);
});

gulp.task("test", function (callback) {
    require("./scripts/workflow")(callback);
});

gulp.task("build", function () {
    return browserify({
            entries: "./src/index.js",
            debug: true
        }).bundle()
        .pipe(source("augur.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .on("error", gutil.log)
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("watch", function() {
    gulp.watch("src/*", ["build"]);
});

gulp.task("default", ["clean"], function (callback) {
    runSequence(["build"], callback);
});
