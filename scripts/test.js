const shell = require('shelljs');

process.env.NODE_ENV = 'test';

shell.exec('mocha --require babel-register');
