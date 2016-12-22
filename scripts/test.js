const shell = require('shelljs');
const ora = require('ora');

process.env.NODE_ENV = 'test';

const spinner = ora('Running Tests').start();

shell.exec('mocha --require babel-register', (code, stdout, stderr) => {
	if (code !== 0) {
		spinner.text = 'Tests Failing';
		spinner.fail();
		shell.exit(code);
	}

	spinner.succeed();
});
