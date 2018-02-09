#!/usr/bin/env node

const { promisify } = require("util");
const Augur = require("../../src");
const debugOptions = require("../debug-options");
const { getPrivateKeyFromString } = require("../dp/lib/get-private-key");
const parrotSay = require("parrotsay-api");
const chalk = require("chalk");
const columnify = require("columnify");

const { NetworkConfiguration } = require("augur-core");
const repFaucet = promisify(require("../rep-faucet"));

const getBalance = promisify(require("./get-balance"));
const listMarkets  = promisify(require("./list-markets"));
// const designatedReport = promisify(require("./designated-report"));
// const initialReport = promisify(require("./initial-report"));
// const disputeContribute = promisify(require("./dispute-contribute"));
// const finalizeMarket = promisify(require("./finalize-market"));
// const pushTime = promisify(require("./push-time"));

const commands = ["get-balance", "list-markets", "designate-report", "initial-report", "dispute", "finalize-market", "push-time"];

async function runCommand(command, params, networks) {
  const networkConfigurations = networks.map(NetworkConfiguration.create);
  console.log(chalk.yellow.dim("command"), command);
  console.log(chalk.yellow.dim("parameters"), params);
  console.log(chalk.yellow.dim("networks"), networks);
  for (const network of networkConfigurations) {
    console.log(chalk.yellow("network:"), network);
    console.log(chalk.yellow("network http:"), network.http);
    const augur = new Augur();
    augur.rpc.setDebugOptions(debugOptions);

    const connect = promisify(augur.connect);

    const auth = getPrivateKeyFromString(network.privateKey);
    switch (command) {

      case "get-balance": {
        await connect({ ethereumNode: { http: network.http } });
        await getBalance(augur, params);
        break;
      }

      case "list-markets": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await listMarkets(augur);
        break;
      }

      case "designate-report": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await repFaucet(augur, params, auth);
        break;
      }

      default: {
        console.log((await parrotSay("Hello")).length);
      }
    }
  }
}

function parseArgs() {
  const args = {};
  process.argv.forEach(function (val, index) {
    if (index === 2) {
      args.command = val;
    } else if (val.indexOf("params") > -1) {
      args.params = val.split("=")[1];
    } else if (val.indexOf("networks") > -1) {
      args.networks = val.split("=")[1].split(",");
    }
  });
  return args;
}

async function help() {
  console.log("Usage: flash <command> params=<parameter 1>,<parameter 2>,... networks=<network 1>,<network 2>,...<network N>\n\n");

  console.log(chalk.underline("Commands"));
  console.log(commands.join(", "), "or help for this message");

  console.log(chalk.underline("\nNetworks"));

  console.log(chalk.underline("\nConfiguration"));
  console.log("Set the following " + chalk.bold("environment variables") + " to modify the behavior of the deployment process");
  console.log("ex: USE_NORMAL_TIME=false dp deploy aura");

  console.log(chalk.underline("\nNetwork (when using 'environment' for the network)"));
  console.log(columnify([{
    env: "ETHEREUM_HTTP",
    Description: "The http(s) address of your ethereum endpoint (default: http://localhost:8545)",
  }, {
    env: "ETHEREUM_PRIVATE_KEY",
    Description: "HEX Private Key used for transactions on this eth node",
  }, {
    env: "GAS_PRICE_IN_NANOETH",
    Description: "The transaction gas price to use, specified in nanoeth (default: varies)",
  }], {
    columnSplitter: " - ",
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false,
  }));

  console.log(chalk.underline("\nPrivate Keys (for any named environment)"));
  console.log(columnify([{
    env: "AURA_PRIVATE_KEY",
    description: "Override key used to deploy to Aura, defaults to the dev key",
  }, {
    env: "CLIQUE_PRIVATE_KEY",
    description: "Override key used to deploy to Clique, defaults to the dev key",
  }, {
    env: "RINKEBY_PRIVATE_KEY",
    description: "Set key used to deploy to Rinkeby, default is blank and " + chalk.bold("will error if not set"),
  }, {
    env: "ROPSTEN_PRIVATE_KEY",
    description: "Set key used to deploy to Ropsten, default is blank and " + chalk.bold("will error if not set"),
  }], {
    columnSplitter: " - ",
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false,
  }));
  console.log(chalk.underline("\nUpload Configs"));
  console.log(columnify([{
    env: "PRODUCTION",
    description: "[true, false] If true force USE_NORMAL_TIME to true and potentially other optimizations. (default: false)",
  }, {
    env: "USE_NORMAL_TIME",
    description: "[true, false] Should time flow normally or be adjusted using the custom time management (default: true)",
  }], {
    columnSplitter: " - ",
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false,
  }));
}

if (require.main === module) {
  const command = process.argv[2];

  if (commands.indexOf(command) === -1 || command === "help") {
    help().then(() => {
      process.exit();
    });
  } else {
    const args = parseArgs();
    if (!args.networks || args.networks.length === 0) {
      help().then(() => {
        process.exit();
      });
    } else {
      runCommand(args.command, args.params, args.networks).then(() => {
        process.exit();
      }).catch((error) => {
        console.log("Failure!\n", error.message);
        if (error.stack && debugOptions.cannedMarkets) {
          console.log("-------- BACKTRACE ------");
          console.log(error.stack);
        }
        process.exit(1);
      });
    }
  }
}

