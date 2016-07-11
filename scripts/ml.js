#!/usr/bin/env node

"use strict";

var fs = require("fs");
var join = require("path").join;
var Firebase = require("firebase");

var mlDataFile = join(__dirname, "ml-" + new Date().toISOString() + ".csv");
var firebase = new Firebase("https://augur.firebaseio.com");

firebase.child("mailing-list").orderByValue().on("value", function (res) {
    var ml = res.val();
    var handles = [];
    for (var key in ml) {
        if (!ml.hasOwnProperty(key)) continue;
        handles.push(ml[key].handle);
    }
    fs.writeFile(mlDataFile, handles.join(','), function (err) {
        if (err) return console.error(err);
        process.exit(0);
    });
});
