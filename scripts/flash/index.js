#!/usr/bin/env node

const { promisify } = require("util");
const Augur = require("../../src");
const debugOptions = require("../debug-options");
const { getPrivateKeyFromString } = require("../dp/lib/get-private-key");
const chalk = require("chalk");
const columnify = require("columnify");

const { NetworkConfiguration } = require("augur-core");
const getBalance = promisify(require("./get-balance"));
const listMarkets  = promisify(require("./list-markets"));
const designatedReport = promisify(require("./designated-report"));
const initialReport = promisify(require("./initial-report"));
const disputeContribute = promisify(require("./dispute-contribute"));
const finalizeMarket = promisify(require("./finalize-market"));
const pushTime = promisify(require("./push-time"));

const commands = ["get-balance", "list-markets", "designate-report", "initial-report", "dispute", "finalize-market", "push-time", "hello"];
const NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];


function runCommandHelp(command) {
  var help = "help";
  switch (command) {

    case "get-balance": {
      getBalance(null, help);
      break;
    }

    case "list-markets": {
      listMarkets(null, help);
      break;
    }

    case "initial-report": {
      initialReport(null, help);
      break;
    }

    case "designate-report": {
      designatedReport(null, help, null);
      break;
    }

    case "dispute": {
      disputeContribute(null, help);
      break;
    }

    case "finalize-market": {
      finalizeMarket(null, help);
      break;
    }

    case "push-time": {
      pushTime(null, help);
      break;
    }

    default: {
      console.log("run help to get main help");
    }
  }
  process.exit(0);
}

async function runCommand(command, params, networks) {
  if (params === "help") runCommandHelp(command);
  const networkConfigurations = networks.map(NetworkConfiguration.create);
  console.log(chalk.yellow.dim("command"), command);
  console.log(chalk.yellow.dim("parameters"), params);
  console.log(chalk.yellow.dim("networks"), networks);
  for (const network of networkConfigurations) {
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

      case "initial-report": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await initialReport(augur, params, auth);
        break;
      }

      case "designate-report": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await designatedReport(augur, params, auth);
        break;
      }

      case "dispute": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await disputeContribute(augur, params, auth);
        break;
      }

      case "finalize-market": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await finalizeMarket(augur, params, auth);
        break;
      }

      case "push-time": {
        await connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS });
        await pushTime(augur, params, auth);
        break;
      }

      default: {
        console.log("Hello Sir");
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
    } else if (index === 3 && val === "help") {
      args.help = true;
    }
  });
  return args;
}

async function help() {

  console.log("                                  ");
  console.log("      Welcome to FLASH ......>    ");
  console.log("                                  ");
  console.log("Usage: flash <command> params=param1,param,... networks=net1,net2,...");

  console.log(chalk.underline("\nUsages"));
  console.log("Pushing Time on contracts is only possible if USE_NORMAL_TIME='false' environment variable was set when contracts were uploaded");

  console.log(chalk.underline("\nCommands"));
  console.log(commands.join(", "), "or help for this message");
  console.log("Run command help to get parameters needed, ie. initial-report help");

  console.log(chalk.underline("\nNetworks"));
  console.log(NETWORKS.join(", "));

  console.log(chalk.underline("\nConfiguration"));
  console.log("Set the same " + chalk.bold("environment variables") + " used in dp for deployment process");
  console.log("ex: ETHEREUM_PRIVATE_KEY=<owner priv key>");

  console.log(chalk.underline("\nNetwork (when using 'environment' for the network)"));
  console.log(columnify([{
    env: "ETHEREUM_HTTP",
    Description: "The http(s) address of your ethereum endpoint (default: http://localhost:8545)",
  }, {
    env: "ETHEREUM_PRIVATE_KEY",
    Description: "HEX Private Key of OWNER of contracts and used to move TIME on eth node",
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
}

if (require.main === module) {
  const command = process.argv[2];
  const args = parseArgs();
  if (commands.indexOf(command) === -1 || command === "help") {
    help().then(() => {
      process.exit();
    });
  } else {
    if (!args.help && (!args.networks || (args.networks.length === 0))) {
      help().then(() => {
        process.exit();
      });
    } else {
      if (args.help) args.params = "help";
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


