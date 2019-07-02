#!/usr/bin/env node

// NOTE: Make sure to run with --max-old-space-size=12288. We're loading a massive file into memory during report generation

const App = require('solidity-coverage/lib/app.js');
const death = require('death');
const { execSync } = require('child_process');
const copydir = require('copy-dir');
const replace = require("replace");
const rimraf = require('rimraf');
const fs = require('fs');

const COMPILE_COMMAND = "INPUT_PATH=coverageEnv OUTPUT_PATH=coverageEnv/build/ yarn build:contracts"

const config = {
    dir: './source',
    skipFiles: [],
    copyNodeModules: false,
    compileCommand: "echo SKIPPING COMPILE"
}

const app = new App(config);

death((signal, err) => app.cleanUp(err));

rimraf.sync('./coverageEnv');
fs.mkdirSync('./coverageEnv')
copydir.sync('./source/contracts', './coverageEnv/contracts')

app.instrumentTarget();

copydir.sync('./tests/solidity_test_helpers', './coverageEnv/solidity_test_helpers')

replace({
    regex: " view | pure ",
    replacement: " ",
    paths: fs.readdirSync('./coverageEnv/solidity_test_helpers').map(filename => './coverageEnv/solidity_test_helpers/' + filename),
    silent: false,
})

replace({
    regex: " view | pure ",
    replacement: " ",
    paths: fs.readdirSync('./coverageEnv/solidity_test_helpers/ZeroX').map(filename => './coverageEnv/solidity_test_helpers/ZeroX/' + filename),
    silent: false,
})

try {
    execSync('python3 -m pytest tests --cover', {stdio:[0,1,2]});
} catch (err) {
    console.log(err);
}

app.generateReport();

// Cleanup
rimraf.sync('./allFiredEvents');
rimraf.sync('./scTopics');
rimraf.sync('./coverage.json');
rimraf.sync('./tests/compilation_cache')
