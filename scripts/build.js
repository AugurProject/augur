const shell = require('shelljs');

const clean = require('./common/clean');

process.env.NODE_ENV = 'production';

// CLEAN BUILD DIRECTORY
clean();

// GENERATE BUILD
shell.exec('webpack --config webpack.config.js');

// LOCK PACKAGE VERSIONS
shell.exec('npm prune && npm shrinkwrap');
