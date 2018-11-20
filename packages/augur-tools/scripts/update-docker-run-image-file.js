#!/usr/bin/env node
var options = require("options-parser");
var fs = require("fs");
var fileType = "utf8";
const dockerRunFile = "../augur-artifacts/docker.json";

var opts = {
  imageName: { required: true, short: "n", help: "Docker image name with tag" },
  imageId: {
    required: true,
    short: "i",
    help: "Docker image id associated with docker image name and tag"
  }
};

function errorOccurred(err, opts) {
  if (err) {
    options.help(opts);
    console.error("ERROR:", err);
    process.exit(1);
  }
}

var args = options.parse(opts, process.argv, function(error) {
  errorOccurred(error, opts);
});

var imageName = args.opt.imageName;
var imageId = args.opt.imageId;

fs.readFile(dockerRunFile, fileType, function(err, content) {
  errorOccurred(err);
  if (!content || content.length === 0) {
    errorOccurred("docker.json file has no content");
  }
  const existing = JSON.parse(content);
  existing[imageName] = imageId;
  const result = JSON.stringify(existing);
  fs.writeFile(dockerRunFile, result, function(err) {
    errorOccurred(err);
    process.exit(0);
  });
});
