const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const { title } = require('./common/colors');

const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

process.env.FORCE_COLOR = true;

shell.echo(title(`
== Running Augur Linting ==
`));

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
	concurrent: true,
	renderer: 'verbose'
});

tasks.run().catch((err) => {});
