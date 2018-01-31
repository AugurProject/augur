#!/usr/bin/env node
"use strict";

const fs = require("fs");
var WebSocket = require("ws");

// Bypass self-signed SSL
const requestOptions = { rejectUnauthorized:false };

if (process.argv.length < 3) throw new Error("Pass in json file(s) as arguments");


process.argv.slice(2).map(function(json_file) {
  const payload = fs.readFileSync(json_file, "utf8");

  // var ws = new WebSocket("ws://localhost:9001");
  var ws = new WebSocket("wss://localhost:9002", requestOptions);
  ws.on("open", function () {
    ws.send(JSON.stringify(JSON.parse(payload)));
  });

  ws.on("message", function (response) {
    console.log("\n" + json_file);
    console.log(payload);
    console.log(JSON.stringify(JSON.parse(response), null, 2));
    ws.close();
  });
});
