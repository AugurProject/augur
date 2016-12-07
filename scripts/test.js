const shell = require('shelljs');
const Ora = require('ora');

const clear = require('./common/clear');

const spinner = new Ora({
	text: 'Running Tests',
	color: 'cyan'
});

spinner.start();

clear();

shell.exec(`mocha --compilers js:babel-core/register`, (code) => {
	if (code !== 0) {
		spinner.text = 'Tests Failed';
		spinner.fail();
	} else {
		spinner.text = 'Tests Passed';
		spinner.succeed();
	}
});
