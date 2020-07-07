#!/usr/bin/env node

// NOTE: Make sure to run with --max-old-space-size=12288. We're loading a massive file into memory during report generation

const { execSync } = require('child_process');
const copydir = require('copy-dir');
const replace = require('replace');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

rimraf.sync('./contracts');
fs.mkdirSync('./contracts');
copydir.sync('./src/contracts', './contracts');

replace({
  regex: 'ROOT',
  replacement: path.join(__dirname, '../../contracts'),
  paths: getAllFiles('./contracts'),
  silent: false,
});

try {
  execSync('yarn truffle compile --all', { stdio: [0, 1, 2] });
} catch (err) {
  console.log(err);
}
