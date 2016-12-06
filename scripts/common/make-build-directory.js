const path = require('path');
const shell = require('shelljs');
const Ora = require('ora');

const error = require('./error');

const SPINNER_COLOR = 'cyan';
const BUILD_DIRECTORY = path.resolve(__dirname, '../../build');

const spinner = new Ora({
	text: 'Making Build Directory',
	color: SPINNER_COLOR
});

module.exports = () => {
	// MAKE THE BUILD DIRECTORY
	spinner.start();

	const buildDir = shell.mkdir('-p', BUILD_DIRECTORY);

	if (buildDir.stderr) {
		spinner.fail();

		error(buildDir.stderr);
	} else {
		spinner.succeed();
	}
};
