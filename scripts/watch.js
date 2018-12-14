const path = require("path");
const shell = require("shelljs");
const Listr = require("listr");

const runTemplate = workspaceName => () =>
  setTimeout(
    () =>
      new Promise((resolve, reject) => {
        shell.exec(`yarn workspace ${workspaceName} watch`, {}, (code, stdout, stderr) => {
          if (code !== 0) {
            console.error(stdout, stderr);
            reject(new Error());
            shell.exit(code);
          }

          resolve();
        });
      }),
    1000
  );

const workspaces = ["augur-ui", "augur-node", "augur-tools"];
const tasks = new Listr(
  workspaces.map(workspace => ({
    title: `Run ${workspace}`,
    task: runTemplate(workspace)
  })),
  {
    concurrent: true
  }
);

tasks.run().catch(err => {});
