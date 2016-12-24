const shell = require('shelljs');

shell.echo('== Running Augur Coverage ==');

process.env.NODE_ENV = 'test';
process.env.FORCE_COLOR = true;

shell.exec('istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- --require babel-register -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rimraf ./coverage', (code) => {
	if (code !== 0) {
		shell.exit(code);
	}
});
