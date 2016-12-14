const path = require('path');
const shell = require('shelljs');

const SERVER = path.resolve(__dirname, '../server.js');

process.env.NODE_ENV = 'development';

// START DEVELOPMENT SERVER
//	NOTE -- this will also automatically spin up webpack w/ HMR (Hot Module Reload)
shell.exec(`node ${SERVER}`);
