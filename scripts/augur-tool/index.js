#!/usr/bin/env node

const { promisify } = require("util");
const path = require("path");
const Augur = require("../../src");
const debugOptions = require("../debug-options");
const { ContractDeployer, DeployerConfiguration, NetworkConfiguration } = require("augur-core");
const { getPrivateKeyFromString } = require("./lib/get-private-key");
const parrotSay = require('parrotsay-api');
const chalk = require('chalk');
const columnify = require('columnify')

const repFaucet = promisify(require("../rep-faucet"));
const createMarkets = promisify(require("./create-markets"));
const createOrders = promisify(require("./create-orders"));

const commands = ["create-markets", "create-orders", "deploy", "rep-faucet", "upload"];
const networks = ["aura", "clique", "environment", "rinkeby", "ropsten"];

async function runCannedData(command, networks) {
  const deployerConfiguration = DeployerConfiguration.create(path.join(__dirname, "../../src/contracts"));
  const networkConfigurations = networks.map(NetworkConfiguration.create);
  for (const network of networkConfigurations) {
    const augur = new Augur();
    augur.rpc.setDebugOptions(debugOptions);

    const connect = promisify(augur.connect);
    await connect({ ethereumNode: { http: network.http } });

    const auth = getPrivateKeyFromString(network.privateKey);
    switch (command) {
      case "upload": {
        await ContractDeployer.deployToNetwork(network, deployerConfiguration);
        break;
      }

      case "rep-faucet": {
        await repFaucet(augur, auth);
        break;
      }

      case "create-markets": {
        await repFaucet(augur, auth);
        await createMarkets(augur, auth);
        break;
      }

      case "create-orders": {
        await createOrders(augur, auth);
        break;
      }

      case "deploy": {
        await ContractDeployer.deployToNetwork(network, deployerConfiguration);
        await augur.contracts.reloadAddresses();
        await repFaucet(augur, auth);
        await createMarkets(augur, auth);
        break;
      }

      default: {
        console.log((await parrotSay("Hello")).length);
      }
    }
  }
}

async function help() {
  console.log(await parrotSay(" Augur Deployment a.k.a. Disco Parrot "));
  console.log("Usage: dp <command> <network 1> <network 2> ... <network N>\n\n");

  console.log(chalk.underline("Commands"));
  console.log(commands.join(", "), "or help for this message");

  console.log(chalk.underline("\nNetworks"));
  console.log(networks.join(", "));

  console.log(chalk.underline("\nConfiguration"));
  console.log("Set the following " + chalk.bold("environment variables") + " to modify the behavior of the deployment process");
  console.log("ex: USE_NORMAL_TIME=false dp deploy aura")

  console.log(chalk.underline("\nNetwork (when using 'environment' for the network)"));
  console.log(columnify([{
    env: "ETHEREUM_HTTP",
    Description: "The http(s) address of your ethereum endpoint (default: http://localhost:8545)"
  }, {
    env: "ETHEREUM_PRIVATE_KEY",
    Description: "HEX Private Key used for transactions on this eth node"
  }, {
    env: "GAS_PRICE_IN_NANOETH",
    Description: "The transaction gas price to use, specified in nanoeth (default: varies)"
  }], {
    columnSplitter: ' - ',
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false
  }));

  console.log(chalk.underline("\nPrivate Keys (for any named environment)"));
  console.log(columnify([{
    env: "AURA_PRIVATE_KEY",
    description: "Set the private key to use with the named network"
  },
  {env: "CLIQUE_PRIVATE_KEY"},
  {env: "RINKEBY_PRIVATE_KEY"},
  {env: "ROPSTEN_PRIVATE_KEY"},
  ], {
    columnSplitter: ' - ',
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false
  }));
  console.log(chalk.underline("\nUpload Configs"));
  console.log(columnify([{
    env: "PRODUCTION",
    description: "[true, false] If true force USE_NORMAL_TIME to true and potentially other optimizations. (default: false)"
  }, {
    env: "USE_NORMAL_TIME",
    description: "[true, false] Should time flow normally or be adjusted using the custom time management (default: true)"
  }], {
    columnSplitter: ' - ',
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false
  }));
}

if (require.main === module) {
  const command = process.argv[2];
  const networks = process.argv.slice(3);

  if (commands.indexOf(command) === -1 || command === "help") {
    help().then(() => {
      process.exit();
    });
  } else {
    runCannedData(command, networks).then(() => {
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

