"use strict";

var cp = require("child_process");
var gulp = require("gulp");
var del = require("del");

gulp.task("clean", function (callback) {
  del(["dist/*"], callback);
});

gulp.task("lint", function (callback) {
  cp.exec("npm run lint", function (err, stdout) {
    if (err) if (stdout) process.stdout.write(stdout);
    callback(err);
  });
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
