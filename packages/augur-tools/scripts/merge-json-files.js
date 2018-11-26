#!/usr/bin/env node
var options = require("options-parser");
var fs = require("fs");

function mergeJsonFiles(existingAddresses, newNetworkIdAddresses) {
  return JSON.stringify(Object.assign(JSON.parse(existingAddresses), JSON.parse(newNetworkIdAddresses)), null, " ");
}

function errorOccurred(err, opts) {
  if (err) {
    options.help(opts);
    console.error("ERROR:", err);
    process.exit(1);
  }
}
var fileType = "utf8";

var opts = {
  primary: { required: true, short: "p", help: "Existing Nework addresses.json file"},
  secondary: { required: true, short: "s", help: "Addresses.json file to merge into main addresses.json file"},
  output: { required: true, short: "o", help: "output file of the merge"},
};
var args = options.parse(opts, process.argv, function (error) {
  errorOccurred(error, opts);
});
var primaryFile = args.opt.primary;
var secondaryFile = args.opt.secondary;
var output = args.opt.output;
fs.readFile(primaryFile, fileType, function (err, primaryContent) {
  errorOccurred(err, opts);
  if (!primaryContent || primaryContent.length === 0) {
    errorOccurred("existing addresses.json file has no content", opts);
  }
  fs.readFile(secondaryFile, fileType, function (err, secondaryContent) {
    errorOccurred(err, opts);
    if (!secondaryContent || secondaryContent.length === 0) {
      errorOccurred("new addresses.json file has no content", opts);
    }
    var result = mergeJsonFiles(primaryContent, secondaryContent);
    fs.writeFile(output, result, function (err) {
      errorOccurred(err, opts);
      process.exit(0);
    });
  });
});


