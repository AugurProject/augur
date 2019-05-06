const shell = require("shelljs");
const Listr = require("listr");

const lintTasks = require("./lint.js");
const PROTECTED_BRANCHES = ["master"];

const shouldPushProtectedBranches =
  process.env.PUSH_PROTECTED_BRANCHES === "true";

const getCurrentGitBranchName = async () =>
  new Promise((resolve, reject) => {
    shell.exec(
      `git rev-parse --abbrev-ref HEAD`,
      { silent: true },
      (code, stdout) => {
        if (code !== 0) {
          reject(new Error());
        }
        resolve(stdout.trim());
      }
    );
  });

const confirmPushIfOnMaster = () =>
  getCurrentGitBranchName().then(branchName => {
    if (!PROTECTED_BRANCHES.includes(branchName) || shouldPushProtectedBranches)
      return;
    shell.echo(
      [
        `The current branch '${branchName}' is marked protected.\n`,

        `If pushing was intentional please do one of the following:`,
        `\t1. attempt again with PUSH_PROTECTED_BRANCHES='true' set.`,
        `\t2. Execute 'npm run git:push:protected'\n\n`,
        `The protected branches are enumerated in 'scripts/pre-push.js'\n`
      ].join("\n")
    );

    throw new Error();
  });

const tasks = () =>
  new Listr(
    [
      {
        title: "Run lint",
        task: () => lintTasks
      }
    ],
    {
      concurrent: true
    }
  );

const prePushTasks = new Listr(
  [
    {
      title: "Confirm branch",
      task: confirmPushIfOnMaster
    },
    {
      title: "Run Code Quality Checks",
      task: tasks
    }
  ],
  {
    exitOnError: true
  }
);

prePushTasks.run().catch(err => console.log(err));
