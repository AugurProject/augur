"use strict";

var cp = require("child_process");
var nodeUtil = require("util");
var chalk = require("chalk");
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

var gulp_log = require("fs").createWriteStream(
    require("path").join(__dirname, "gulp.log"),
    {flags : 'w'}
);

gulp.task("clean", function (callback) {
    del(["dist"], callback);
});

gulp.task("test", function (callback) {
    var runtests = cp.spawn("npm", ["test", "--", "--offline"]);
    runtests.stdout.on("data", function (data) {
        gulp_log.write(nodeUtil.format(data.toString()));
    });
    runtests.stderr.on("data", function (data) {
        process.stdout.write(data);
    });
    runtests.on("close", callback);
});

gulp.task("test-full", function (callback) {
    var runtests = cp.spawn("npm", ["test", "--", "--gospel"]);
    runtests.stdout.on("data", function (data) {
        process.stdout.write(data);
    });
    runtests.stderr.on("data", function (data) {
        process.stdout.write(chalk.yellow(data.toString()));
    });
    runtests.on("close", callback);
});

gulp.task("workflow", function (callback) {
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
    runSequence(["test", "build"], callback);
});
