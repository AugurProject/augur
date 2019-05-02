const path = require("path");
const shell = require("shelljs");
const Listr = require("listr");

const srcPath = path.resolve(__dirname, "../src");
const testPath = path.resolve(__dirname, "../test");

let shouldFix = false;
if (require.main === module) {
  process.env.FORCE_COLOR = true;

  const FLAGS = JSON.parse(process.env.npm_config_argv).original.filter(
    arg => arg.indexOf("--") !== -1
  );

  shouldFix = FLAGS.indexOf("--fix") !== -1 ? true : false;
}

const lintSource = () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `eslint${shouldFix ? " --fix" : ""} --ext .js,.jsx,.ts,.tsx ${srcPath}`,
      (code, stdOut) => {
        if (code !== 0) {
          console.error(stdOut);
          reject(new Error());
          shell.exit(code);
        }

        resolve();
      }
    );
  });

const lintTests = () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `eslint${shouldFix ? " --fix" : ""} --ext .js,.jsx,.ts,.tsx ${testPath}`,
      (code, stdOut) => {
        if (code !== 0) {
          console.error(stdOut);
          reject(new Error());
          shell.exit(code);
        }

        resolve();
      }
    );
  });

const lintStyles = () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `stylelint '${srcPath}/**/*.less'${shouldFix ? " --fix" : ""}`,
      (code, stdOut) => {
        if (code !== 0) {
          console.error(stdOut);
          reject(new Error());
          shell.exit(code);
        }

        resolve();
      }
    );
  });

const tasks = new Listr(
  [
    {
      title: "Lint Source",
      task: lintSource
    },
    {
      title: "Lint Tests",
      task: lintTests
    },
    {
      title: "Lint Styles",
      task: lintStyles
    }
  ],
  {
    concurrent: true
  }
);

// Check if this script was run directly. e.g. `node scripts/lint.js`
if (require.main === module) {
  new Listr([
    {
      title: `Linting Augur Project (--fix is ${
        shouldFix ? "enabled" : "disabled"
      })`,
      task: () => tasks
    }
  ])
    .run()
    .catch(err => {});
} else {
  module.exports = tasks;
}
