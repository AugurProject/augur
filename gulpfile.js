"use strict";

var gulp = require("gulp");
var del = require("del");
var babelify = require("babelify");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");

function bundle(cb) {
    return browserify({
        entries: "src/index.js",
        insertGlobals: true,
        fullPaths: true,
        debug: true
    }).transform(babelify, {
        presets: ["es2015"],
        compact: false,
        global: true
    }).bundle().on("finish", cb || function () {});
}

gulp.task("clean", function (cb) {
    del(["dist/*"], cb);
});

gulp.task("build", function (cb) {
    bundle(cb).pipe(source("augur.js")).pipe(gulp.dest("dist"));
});

gulp.task("minify", function (cb) {
    bundle(cb).pipe(source("augur.min.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["build", "minify"]);
