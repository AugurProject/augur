const path = require('path');
const shell = require('shelljs');

const BUILD_DIRECTORY = path.resolve(__dirname, '../build');
const NODE_MODULES = path.resolve(__dirname, '../node_modules');

process.env.NODE_ENV = 'production';

shell.exec(`rimraf ${BUILD_DIRECTORY}`);
shell.exec(`mkdir -p ${BUILD_DIRECTORY}`);
shell.exec('webpack --config webpack.config.js');
shell.exec(`npm shrinkwrap --dev`);
