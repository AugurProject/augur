const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const BUILD_DIRECTORY = path.resolve(__dirname, '../build');
const NODE_MODULES = path.resolve(__dirname, '../node_modules');

process.env.NODE_ENV = 'production';
process.env.FORCE_COLOR = true;

shell.echo(`
== Building Augur ==

NOTE -- This will take some time.
`);

const removeBuildDir = new Promise((resolve, reject) => {
	const code = shell.exec(`rimraf ${BUILD_DIRECTORY}`).code;

	if (code !== 0) {
		reject(new Error());
		shell.exit(code);
	}

	resolve();
});

const createBuildDir = new Promise((resolve, reject) => {
	const code = shell.exec(`mkdir -p ${BUILD_DIRECTORY}`).code;

	if (code !== 0) {
		reject(new Error());
		shell.exit(code);
	}

	resolve();
});

const buildAugur = new Promise((resolve, reject) => {
	shell.exec('webpack --config webpack.config.js', (code) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});


const tasks = new Listr([
	{
		title: 'Clean Build Directory',
		task: () => {
			return new Listr([
				{
					title: 'Removing Build Directory',
					task: () => removeBuildDir
				},
				{
					title: 'Creating Build Directory',
					task: () => createBuildDir
				}
			])
		}
	},
	{
		title: 'Build Augur',
		task: () => buildAugur
	}
],
{
	renderer: 'verbose'
});

tasks.run().catch((err) => {});
