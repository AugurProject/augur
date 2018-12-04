const shell = require("shelljs");
const Listr = require("listr");

process.env.NODE_ENV = process.env.BABEL_ENV = "test";
process.env.FORCE_COLOR = true;

const silent = true;

const mochaTests = () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `mocha ${process.argv[2] ||
        `"test/**/*.js?(x)"`} --timeout 10000 --reporter=min`,
      {
        silent
      },
      (code, stdout, stderr) => {
        if (code !== 0) {
          console.error(stdout, stderr);
          reject(new Error());
          shell.exit(code);
        }

        resolve();
      }
    );
  });

const jestTests = () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `jest -c=jest.unit.config.js`,
      { silent },
      (code, stdout, stderr) => {
        if (code !== 0) {
          console.error(stdout, stderr);
          reject(new Error());
          shell.exit(code);
        }

        resolve();
      }
    );
  });

const tasks = new Listr([
  {
    title: "Run Tests",
    task: mochaTests
  },
  {
    title: "Run Jest Tests",
    task: jestTests
  }
]);

// Check if this script was run directly. e.g. `node scripts/lint.js`
if (require.main === module) {
  tasks.run().catch(err => {});
} else {
  module.exports = tasks;
}
