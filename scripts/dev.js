const path = require('path');
const shell = require('shelljs');
const Ora = require('ora');

const error = require('./common/error');
const clean = require('./common/clean');

process.env.NODE_ENV = 'development';

const SPINNER_COLOR = 'cyan';
const SERVER = path.resolve(__dirname, '../server.js');

// CLEAN BUILD DIRECTORY
// clean();

// START DEVELOPMENT SERVER
//	NOTE -- this will also automatically spin up webpack w/ HMR (Hot Module Reload)
const startDev = shell.exec(`node ${SERVER}`);

console.log('startDev');
