const shell = require('shelljs');

const colors = require('./common/colors');

shell.echo(colors.title('== Running Augur Coverage =='));

process.env.NODE_ENV = 'test';
process.env.FORCE_COLOR = true;

shell.exec('./node_modules/nyc/bin/nyc.js ./node_modules/mocha/bin/_mocha', (code) => {
  if (code !== 0) {
    shell.exit(code);
  }
});
