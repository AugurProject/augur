"use strict";

var cp = require("child_process");
var async = require("async");
var del = require("del");
var gulp = require("gulp");

gulp.task("clean", function (callback) {
  del(["dist/*"], callback);
});

gulp.task("lint", function (callback) {
  cp.exec("npm run lint", function (err, stdout) {
    if (err) if (stdout) process.stdout.write(stdout);
    callback(err);
  });
});

gulp.task("test", function (callback) {
  cp.exec("npm test", function (err, stdout) {
    if (err) if (stdout) process.stdout.write(stdout);
    callback(err);
  });
});

function shellExec(command, callback) {
  cp.exec(command, function (err, stdout) {
    if (err) return callback(err);
    if (stdout) process.stdout.write(stdout);
    callback();
  });
}

gulp.task("build", function (callback) {
  async.eachSeries([
    "./node_modules/.bin/babel ./node_modules/uuid-parse --source-root ./node_modules/uuid-parse  -d ./node_modules/uuid-parse",
    "./node_modules/.bin/babel ./src --source-root ./src -d ./build"
  ], shellExec, function (err) {
    if (err) return callback(err);
    async.each([
      "./node_modules/.bin/browserify ./exports.js > ./dist/augur.js",
      "./node_modules/.bin/browserify ./exports.js | ./node_modules/uglify-js/bin/uglifyjs > ./dist/augur.min.js"
    ], shellExec, callback);
  });
});

gulp.task("default", ["lint", "test", "build"]);
