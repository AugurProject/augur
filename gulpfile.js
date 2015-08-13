"use strict";

var cp = require("child_process");
var nodeUtil = require("util");
var gulp = require("gulp");
var rename = require("gulp-rename");
var del = require("del");
var runSequence = require("run-sequence");

var gulp_log = require("fs").createWriteStream(
    require("path").join(__dirname, "data", "gulp.log"),
    {flags : 'w'}
);

gulp.task("clean", function (callback) {
    del(["dist/*"], callback);
});

gulp.task("test", function (callback) {
    var runtests = cp.spawn("npm", ["run", "offline"]);
    runtests.stdout.on("data", function (data) {
        gulp_log.write(nodeUtil.format(data.toString()));
    });
    runtests.stderr.on("data", function (data) {
        process.stdout.write(data);
    });
    runtests.on("close", callback);
});

gulp.task("build", function (callback) {
    cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js | "+
            "./node_modules/uglify-js/bin/uglifyjs > ./dist/augur.js",
            function (err, stdout) {
        if (err) throw err;
        if (stdout) process.stdout.write(stdout);
        callback();
    });
});

gulp.task("default", ["clean"], function (callback) {
    runSequence(["test", "build"], callback);
});
