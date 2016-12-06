const clc = require('cli-color');
const shell = require('shelljs');

module.exports = (err) => {
	shell.echo(clc.red.bold(`ERROR: ${err}`));
};
