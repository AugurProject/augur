#!/usr/bin/env node
const options = require("options-parser");
const fs = require("fs");
const fileType = "utf8";
const dockerRunFile = "../augur-artifacts/docker.json";

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

fs.readFile(dockerRunFile, fileType, function(err, content) {
  errorOccurred(err);
  if (!content || content.length === 0) {
    errorOccurred("docker.json file has no content");
  }
  const existing = JSON.parse(content);
  const result = existing[imageName];

  if (!result || result.length == 0) {
    errorOccurred(`docker.json file doesn't contain ${imageName}`);
  }
  console.log(result);
});
