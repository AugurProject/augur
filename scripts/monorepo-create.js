const execa = require("execa");
const Listr = require("listr");

async function refreshPackage(task, packageName) {
  task.title = `Updating ${packageName}`;
  const { stdout } = await execa("git", [
    "subtree",
    "add",
    "-P",
    `packages/${packageName}`,
    "-m",
    `Update ${packageName}`,
    `https://github.com/AugurProject/${packageName}`,
    "master"
  ]);
  task.title = `Done updating ${packageName} - ${stdout}`;
}

let tasks;
if (process.argv.length == 2) {
  tasks = new Listr([
    {
      title: "Augur Core",
      task: async (ctx, task) => await refreshPackage(task, "augur-core")
    },
    {
      title: "Augur UI",
      task: async (ctx, task) => await refreshPackage(task, "augur-ui")
    }
  ]);
} else {
  tasks = new Listr([
    {
      title: `Updating ${process.argv[2]}`,
      task: async (ctx, task) => await refreshPackage(task, process.argv[2])
    }
  ]);
}
tasks.run().catch(err => {
  console.err(err);
  process.exit(1);
});
