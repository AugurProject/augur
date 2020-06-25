#!/usr/bin/env node

// NOTE: Make sure to run with --max-old-space-size=12288. We're loading a massive file into memory during report generation

const App = require('solidity-coverage/lib/app.js');
const death = require('death');
const { execSync } = require('child_process');
const copydir = require('copy-dir');
const replace = require('replace');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

const COMPILE_COMMAND =
  'INPUT_PATH=coverageEnv OUTPUT_PATH=coverageEnv/build/ yarn build:contracts';

const getAllFiles = function(dirPath, arrayOfFiles) {

  files = fs.readdirSync(dirPath);
  
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  })
  
  return arrayOfFiles;
}

const config = {
  dir: './src',
  skipFiles: [],
  copyNodeModules: false,
  compileCommand: 'echo SKIPPING COMPILE',
};

const app = new App(config);

death((signal, err) => app.cleanUp(err));

rimraf.sync('./coverageEnv');
fs.mkdirSync('./coverageEnv');
copydir.sync('./src/contracts', './coverageEnv/contracts');

app.instrumentTarget();

copydir.sync(
  './tests/solidity_test_helpers',
  './coverageEnv/solidity_test_helpers'
);

copydir.sync('./src/contracts/0x', './coverageEnv/contracts/0x');
copydir.sync('./src/contracts/gsn', './coverageEnv/contracts/gsn');
copydir.sync('./src/contracts/uniswap', './coverageEnv/contracts/uniswap');

replace({
  regex: ' view| pure',
  replacement: ' ',
  paths: getAllFiles('./coverageEnv/contracts/uniswap'),
  silent: false,
});

replace({
  regex: ' view| pure',
  replacement: ' ',
  paths: getAllFiles('./coverageEnv/contracts/gsn'),
  silent: false,
});

replace({
  regex: ' view| pure',
  replacement: ' ',
  paths: getAllFiles('./coverageEnv/contracts/0x'),
  silent: false,
});


replace({
  regex: ' view| pure',
  replacement: ' ',
  paths: fs
    .readdirSync('./coverageEnv/solidity_test_helpers')
    .map(filename => './coverageEnv/solidity_test_helpers/' + filename),
  silent: false,
});

try {
  execSync('python3 -m pytest tests --cover', { stdio: [0, 1, 2] });
} catch (err) {
  console.log(err);
}

app.generateReport();

// Cleanup
rimraf.sync('./allFiredEvents');
rimraf.sync('./scTopics');
rimraf.sync('./coverage.json');
rimraf.sync('./tests/compilation_cache');
