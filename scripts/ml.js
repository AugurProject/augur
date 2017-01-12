#!/usr/bin/env node

"use strict";

var fs = require("fs");
var join = require("path").join;
var Firebase = require("firebase");
var FirebaseTokenGenerator = require("firebase-token-generator");

var mlDataFile = join(__dirname, "ml-" + new Date().toISOString() + ".csv");
var firebase = new Firebase("https://augur.firebaseio.com");

var token = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET).createToken({
  uid: "ml-downloader"
}, {
  expires: Date.now() * 1.1
});

firebase.authWithCustomToken(token, function (err, authData) {
  if (err) return console.error(err);
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
});
