const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

process.env.AUGUR_URL = 'http://localhost:8080';
process.env.FORCE_COLOR = true;

shell.echo(`
${process.argv[2] ? colors.title(`== Running Test: ${colors.notice(process.argv[2])} ==`) : colors.title(`== Running All Augur Tests ==`)}
`);

const tests = new Promise((resolve, reject) => {
  shell.exec(`jest`, (code, stdout, stderr) => {
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
