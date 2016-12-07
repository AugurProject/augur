const path = require('path');
const shell = require('shelljs');
const Ora = require('ora');

const testSpinner = new Ora({
	text: 'Running Tests',
	color: 'cyan'
});

testSpinner.start();

shell.exec(`mocha --compilers js:babel-core/register`, (code, stdout, stderr) => {
	if (code !== 0) {
		testSpinner.
		testSpinner.text = 'Tests Failed';
		testSpinner.fail();
	} else {
		testSpinner.text = 'Tests Passed';
		testSpinner.succeed();
	}
});
