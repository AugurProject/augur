const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

process.env.NODE_ENV = process.env.BABEL_ENV = 'test';
process.env.FORCE_COLOR = true;

const tests = () => new Promise((resolve, reject) => {
  shell.exec(`mocha ${process.argv[2] || `"{src/**/*[-\.]test,test/**/*}.js?(x)"`} --timeout 10000 --reporter=min`, {silent: true},(code, stdout) => {
    if (code !== 0) {
      console.error(stdout);
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const tasks = new Listr([
  {
    title: 'Run Tests',
    task: tests
  }
]);

// Check if this script was run directly. e.g. `node scripts/lint.js`
if (require.main === module) {
   tasks.run().catch((err) => {});
} else {
  module.exports = tasks;
}
