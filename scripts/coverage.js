const shell = require('shelljs');

shell.echo('== Running Augur Coverage ==');

process.env.NODE_ENV = 'test';
process.env.FORCE_COLOR = true;

shell.exec('nyc mocha && nyc report --require babel-register --reporter=lcov && cat ./coverage/lcov.info | coveralls && rimraf ./coverage && rimraf ./.nyc_output', (code) => {
  if (code !== 0) {
    shell.exit(code);
  }
});

// process.env.NODE_ENV = 'coverage';
// process.env.FORCE_COLOR = true;
//
// shell.exec('istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- --require babel-register --timeout 10000 -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rimraf ./coverage', (code) => {
//   if (code !== 0) {
//     shell.exit(code);
//   }
// });
