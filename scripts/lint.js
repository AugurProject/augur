const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

shell.echo(`
== Running Augur Linting ==
`);

const lintSource = new Promise((resolve, reject) => {
	shell.exec(`eslint --ext .js,.jsx ${srcPath}`, (code) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});

const lintTests = new Promise((resolve, reject) => {
	shell.exec(`eslint --ext .js ${testPath}`, (code) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});

const lintStyles = new Promise((resolve, reject) => {
	shell.exec(`stylelint '${srcPath}/**/*.less'`, (code) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});

const tasks = new Listr([
	{
		title: 'Linting Source',
		task: () => lintSource
	},
	{
		title: 'Linting Tests',
		task: () => lintTests
	},
	{
		title: 'Linting Styles',
		task: () => lintStyles
	},
], {
	concurrent: true
});

tasks.run().catch((err) => {});
