const path = require('path');
const shell = require('shelljs');
const Listr = require('listr');

const colors = require('./common/colors');

const SERVER = path.resolve(__dirname, '../server.js');

process.env.NODE_ENV = 'development';
process.env.FORCE_COLOR = true;

// START DEVELOPMENT SERVER
//	NOTE -- this will also automatically spin up webpack w/ HMR (Hot Module Reload)
shell.echo(`
${colors.title('== Starting Augur Development Server ==')}

${colors.notice('NOTE')}	${colors.dim(`| The initial build takes a while.
	| You'll need to wait until the full build is finished without errors to utilize.`)}
`
);

const devServer = new Promise((resolve, reject) => {
	shell.exec(`node ${SERVER}`, (code) => {
		if (code !== 0) {
			reject(new Error());
			shell.exit(code);
		}

		resolve();
	});
});

const tasks = new Listr([
	{
		title: 'Development Server',
		task: () => devServer
	}
],
{
	renderer: 'verbose'
});

tasks.run().catch((err) => {});
