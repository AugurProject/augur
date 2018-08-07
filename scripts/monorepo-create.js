const execa = require('execa');
const Listr = require('listr');

async function refreshPackage(task, packageName) {
  task.title = `Updating ${packageName}`;
  const { stdout }  = await execa('git', ['subtree', 'add', '-P', `packages/${packageName}`, '-m', `Update ${packageName}`,  `https://github.com/AugurProject/${packageName}`, 'master']);
  task.title = `Done updating ${packageName} - ${stdout}`;
}
const tasks = new Listr([
	{
		title: 'Augur Core',
		task: async (ctx, task) => await refreshPackage(task, 'augur-core')
  },
	{
		title: 'Augur.js',
		task: async (ctx, task) => await refreshPackage(task, 'augur.js')
  },
	{
		title: 'Augur UI',
		task: async (ctx, task) => await refreshPackage(task, 'augur-ui')
  },
	{
		title: 'Augur Node',
		task: async (ctx, task) => await refreshPackage(task, 'augur-node')
  },
	{
		title: 'Augur App',
		task: async (ctx, task) => await refreshPackage(task, 'augur-app')
  },
]);

tasks.run().catch((err) => {
  console.err(err);
  process.exit(1);
});
