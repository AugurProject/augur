const shell = require('shelljs');

const isYarn = process.env.npm_execpath.indexOf('yarn');

process.env.FORCE_COLOR = true;

if (isYarn !== -1) {
	// Workaround for yarn's lifecycle script handling (failing in these cases)
	shell.exec(`npm i airbitz-core-js-ui augur.js cssnano`, (code) => {
		if (code !== 0) {
			shell.exit(code);
		}
	});
}
