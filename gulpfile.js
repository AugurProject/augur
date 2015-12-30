"use strict";

var cp = require("child_process");
var join = require("path").join;
var writeStream = require("fs").createWriteStream;
var gulp = require("gulp");
var del = require("del");

var gulp_log = writeStream(join(__dirname, "data", "gulp.log"), {flags : 'w'});

gulp.task("clean", function (callback) {
    del(["dist/*"], callback);
});

gulp.task("lint", function (callback) {
    var runtests = cp.spawn("npm", ["run", "lint"]);
    runtests.stdout.on("data", function (data) {
        gulp_log.write(data.toString());
    });
    runtests.stderr.on("data", process.stdout.write);
    runtests.on("close", callback);
});

gulp.task("build", function (callback) {
    cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js | "+
            "./node_modules/uglify-js/bin/uglifyjs > ./dist/augur.min.js",
            function (err, stdout) {
        if (err) return callback(err);
        if (stdout) process.stdout.write(stdout);
        cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js "+
                "> ./dist/augur.js",
                function (err, stdout) {
            if (err) return callback(err);
            if (stdout) process.stdout.write(stdout);
            callback();
        });
    });
});

gulp.task("default", ["lint", "build"]);
