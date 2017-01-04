const shell = require('shelljs');
const chalk = require('chalk');
const Listr = require('listr');

process.env.NODE_ENV = 'test';
process.env.FORCE_COLOR = true;

shell.echo(`
${ process.argv[2] ? chalk.cyan(`== Running Test: ${process.argv[2]} ==`) : chalk.cyan(`== Running All Augur Tests ==`)}
`);

const tests = new Promise((resolve, reject) => {
	shell.exec(`mocha --require babel-register ${process.argv[2] || ''}`, (code, stdout, stderr) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});

const tasks = new Listr([
	{
		title: 'Running Tests',
		task: () => tests
	}
],
{
	renderer: 'verbose'
});

tasks.run().catch((err) => {});
