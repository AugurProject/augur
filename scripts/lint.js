const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

process.env.FORCE_COLOR = true;

const FLAGS = JSON.parse(process.env.npm_config_argv).original.filter(arg => arg.indexOf('--') !== -1);

const shouldFix = FLAGS.indexOf('--fix') !== -1 ? true : false;

shell.echo(colors.title(`
== Running Augur Linting${shouldFix ? ' -- Fix Enabled' : '' } ==
${shouldFix ? `
${colors.notice('NOTE')}	${colors.dim(`| "With great power comes great responsibility" - Uncle Ben.
	| Since you've enabled auto-fix, please review all automatic changes before commiting.`)}` : ''}
`));

const lintSource = new Promise((resolve, reject) => {
  shell.exec(`eslint${shouldFix ? ' --fix' : ''} --ext .js,.jsx ${srcPath}`, (code) => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const lintTests = new Promise((resolve, reject) => {
  shell.exec(`eslint${shouldFix ? ' --fix' : ''} --ext .js ${testPath}`, (code) => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const lintStyles = new Promise((resolve, reject) => {
  shell.exec(`stylelint '${srcPath}/**/*.less'${shouldFix ? ' --fix' : ''}`, (code) => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const tasks = new Listr([
  {
    title: 'Linting Source',
    task: () => lintSource
  },
  {
    title: 'Linting Tests',
    task: () => lintTests
  },
  {
    title: 'Linting Styles',
    task: () => lintStyles
  },
], {
  concurrent: true,
  renderer: 'verbose'
});

tasks.run().catch((err) => {});
