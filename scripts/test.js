const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

process.env.NODE_ENV = process.env.BABEL_ENV = 'test';
process.env.FORCE_COLOR = true;

shell.echo(`
${process.argv[2] ? colors.title(`== Running Test: ${colors.notice(process.argv[2])} ==`) : colors.title(`== Running All Augur Tests ==`)}
`);

const tests = new Promise((resolve, reject) => {
  shell.exec(`mocha ${process.argv[2] || `"{src/**/*[-\.]test,test/**/*}.js?(x)"`} --timeout 10000`, (code, stdout, stderr) => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const tasks = new Listr([
  {
    title: 'Running Tests',
    task: () => tests
  }
],
  {
    renderer: 'verbose'
  });

tasks.run().catch((err) => {});
