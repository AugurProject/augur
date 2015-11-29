"use strict";

var path = require("path");
var cp = require("child_process");
var nodeUtil = require("util");
var gulp = require("gulp");
var del = require("del");

var gulp_log = require("fs").createWriteStream(
    require("path").join(__dirname, "data", "gulp.log"),
    {flags : 'w'}
);

gulp.task("clean", function (callback) {
    del(["dist/*"], callback);
});

gulp.task("lint", function (callback) {
    var runtests = cp.spawn("npm", ["run", "lint"]);
    runtests.stdout.on("data", function (data) {
        gulp_log.write(nodeUtil.format(data.toString()));
    });
    runtests.stderr.on("data", function (data) {
        process.stdout.write(data);
    });
    runtests.on("close", callback);
});

gulp.task("build", function (callback) {
    var browserify = "./node_modules/browserify/bin/cmd.js ./exports.js > ./dist/augur-es6.js";
    var babelify = "./node_modules/babel-cli/bin/babel.js ./dist/augur.js --presets es2015 --compact=false -o ./dist/augur-es5.js";
    var minify = "./node_modules/uglify-js/bin/uglifyjs ./dist/augur.js -o ./dist/augur.min.js";
    cp.exec(browserify, function (err, stdout) {
        if (err) throw err;
        if (stdout) process.stdout.write(stdout);
        cp.exec(babelify, function (err, stdout) {
            if (err) throw err;
            if (stdout) process.stdout.write(stdout);
            cp.exec(minify, function (err, stdout) {
                if (err) throw err;
                if (stdout) process.stdout.write(stdout);
                callback();
            });
        });
    });
});

gulp.task("default", ["lint", "build"]);
