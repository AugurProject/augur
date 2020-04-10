const path = require("path");
const shell = require("shelljs");
const Listr = require("listr");

const colors = require("./common/colors");

const SERVER = path.resolve(__dirname, "../server.js");

process.env.NODE_ENV = "development";
process.env.FORCE_COLOR = true;

const FLAGS = JSON.parse(process.env.npm_config_argv).original.filter(
  arg => arg.indexOf("--") !== -1
);
process.env.NODE_OPTIONS = "--max_old_space_size=8192";
process.env.TYPE_CHECKING = FLAGS.indexOf("--type-checking") !== -1 ? true : false;
process.env.USE_SSL = FLAGS.indexOf("--ssl") !== -1 ? true : false;
process.env.AUTO_LOGIN = FLAGS.indexOf("--auto-login") !== -1 ? true : false;
process.env.ENABLE_MAINNET = FLAGS.indexOf("--disableMainnet") === -1;

// START DEVELOPMENT SERVER
//	NOTE -- this will also automatically spin up webpack w/ HMR (Hot Module Reload)
shell.echo(`
${colors.title("== Running Augur Development Environment ==")}
${
  process.env.USE_SSL === "true"
    ? `

${colors.notice("SSL Enabled -- make sure key + cert are present")}

`
    : ""
}
${
  process.env.TYPE_CHECKING=== "true"
    ? `

${colors.notice("Typescript Type checking enabled.")}
`
    : ""
}
${colors.notice("NOTE")}	${colors.dim(`| The initial build takes a while.
	| You'll need to wait until the full build is finished without errors before utilization.`)}
`);

const devServer = new Promise((resolve, reject) => {
  shell.exec(`node ${SERVER}`, code => {
    if (code !== 0) {
      reject(new Error());
      shell.exit(code);
    }

    resolve();
  });
});

const tasks = new Listr(
  [
    {
      title: "Development Build",
      task: () => devServer
    }
  ],
  {
    renderer: "verbose"
  }
);

tasks.run().catch(err => {});
