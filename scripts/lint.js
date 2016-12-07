const path = require('path');
const execa = require('execa');
const Listr = require('listr');

const clear = require('./common/clear');

const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

const tasks = new Listr([
	{
		title: 'Linting JS',
		task: () => execa.shell(`eslint --ext .js .jsx ${srcPath}`)
	},
	{
		title: 'Linting Tests',
		task: () => execa.shell(`eslint --ext .js ${testPath}`)
	},
	{
		title: 'Linting Styles',
		task: () => execa.shell(`stylelint '${srcPath}/**/*.less'`)
	}
], { concurrent: true });

clear();

tasks.run().catch(err => {
	console.error(err);
});
