const path = require('path');
const shell = require('shelljs');
const Ora = require('ora');

const error = require('./error');
const makeBuildDirectory = require('./make-build-directory');

const SPINNER_COLOR = 'cyan';
const BUILD_DIRECTORY = path.resolve(__dirname, '../../build');

const spinner = new Ora({
	text: 'Cleaning Build Directory',
	color: SPINNER_COLOR
});

module.exports = () => {
	// CLEAN THE BUILD DIRECTORY
	spinner.start();

	const clean = shell.exec(`rimraf ${BUILD_DIRECTORY}`);

	if (clean.stderr) {
		spinner.fail();

		error(clean.stderr);
	} else {
		spinner.succeed();

		makeBuildDirectory();
	}
};
