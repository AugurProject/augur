"use strict";

var gulp = require("gulp");
var del = require("del");
var babelify = require("babelify");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

function bundle() {
    return browserify({
        entries: "src/index.js",
        insertGlobals: true,
        fullPaths: true,
        debug: true
    }).transform(babelify, {
        presets: ["es2015"],
        compact: false,
        global: true
    }).bundle();
}

gulp.task("clean", function (callback) {
    del(["dist/*"], callback);
});

gulp.task("build", function () {
    bundle().pipe(source("augur.js")).pipe(gulp.dest("dist"));
});

gulp.task("minify", function () {
    bundle().pipe(source("augur.min.js"))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest("dist"));
});

gulp.task("default", ["build", "minify"]);
