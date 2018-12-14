#!/usr/bin/env node
const options = require("options-parser");
const fs = require("fs");
const fileType = "utf8";
const dockerRunFile = require("augur-artifacts/docker.json");

function errorOccurred(err, opts) {
  if (err) {
    options.help(opts);
    console.error("ERROR:", err);
    process.exit(1);
  }
}

var opts = {
  imageName: { required: true, short: "n", help: "Docker image name with tag" }
};

var args = options.parse(opts, process.argv, function(error) {
  errorOccurred(error, opts);
});

const imageName = args.opt.imageName;
const result = dockerRunFile[imageName];

if (!result || result.length == 0) {
  errorOccurred(`docker.json file doesn't contain ${imageName}`);
}

console.log(result);
