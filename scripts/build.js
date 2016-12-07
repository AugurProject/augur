const shell = require('shelljs');

const clean = require('./common/clean');

process.env.NODE_ENV = 'production';

// CLEAN BUILD DIRECTORY
clean();

// GENERATE BUILD
shell.exec('webpack --config webpack.config.js');
