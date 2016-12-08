const shell = require('shelljs');

shell.exec('mocha --compilers js:babel-core/register');
