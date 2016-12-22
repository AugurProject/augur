const shell = require('shelljs');

shell.echo('== Running Augur Coverage ==');

shell.exec('istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rimraf ./coverage', (code) => {
	if (code !== 0) {
		shell.exit(code);
	}
});
