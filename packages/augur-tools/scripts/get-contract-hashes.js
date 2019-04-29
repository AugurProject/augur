#!/usr/bin/env node
const fs = require("fs");
const contractsFile = '../augur-artifacts/src/contracts.json';


var crypto = require('crypto');
var md5sum = crypto.createHash('md5');

var s = fs.ReadStream(contractsFile);
  s.on('data', function(d) {
  md5sum.update(d);
});

s.on('end', function() {
  var generated_hash = md5sum.digest('hex');
  console.log(generated_hash);
});
