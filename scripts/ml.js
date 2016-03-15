#!/usr/bin/env node

"use strict";

var fs = require("fs");
var join = require("path").join;
var Firebase = require("firebase");

var mlDataFile = join(__dirname, "ml.dat");
var firebase = new Firebase("https://augur.firebaseio.com");

firebase.child("mailing-list").orderByValue().on("value", function (res) {
    fs.writeFile(mlDataFile, JSON.stringify(res.val(), null, 2), function (err) {
        if (err) return console.error(err);
        process.exit(0);
    });
});
