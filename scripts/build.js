const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

const BUILD_DIRECTORY = path.resolve(__dirname, '../build');
const NODE_MODULES = path.resolve(__dirname, '../node_modules');

const FLAGS = process.argv.filter(arg => arg.indexOf('--') !== -1);

process.env.NODE_ENV = process.env.BABEL_ENV = FLAGS.indexOf('--dev') !== -1 ? 'development' : 'production';
process.env.DEBUG_BUILD = FLAGS.indexOf('--dev') !== -1 ? true : false;

process.env.FORCE_COLOR = true;

shell.echo(`
${colors.title(`== Building Augur${process.env.NODE_ENV === 'development' ? ' -- Debug Mode' : ''} ==`)}

${colors.notice('NOTE')}	${colors.dim('| This will take some time.')}
`);

const removeBuildDir = new Promise((resolve, reject) => {
  const code = shell.exec(`rimraf ${BUILD_DIRECTORY}`).code;

  if (code !== 0) {
    reject(new Error());
    shell.exit(code);
  }

  resolve();
});

const createBuildDir = new Promise((resolve, reject) => {
  const code = shell.exec(`mkdir ${BUILD_DIRECTORY}`).code;

  if (code !== 0) {
    reject(new Error());
    shell.exit(code);
  }

  resolve();
});

const buildAugur = new Promise((resolve, reject) => {
  shell.exec('webpack --config webpack.config.js', (code) => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});


const tasks = new Listr([
  {
    title: 'Clean Build Directory',
    task: () => new Listr([
      {
        title: 'Removing Build Directory',
        task: () => removeBuildDir
      },
      {
        title: 'Creating Build Directory',
        task: () => createBuildDir
      }
    ])
  },
  {
    title: 'Build Augur',
    task: () => buildAugur
  }
],
  {
    renderer: 'verbose'
  });

tasks.run().catch((err) => {});
