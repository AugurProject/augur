#!/usr/bin/env node

var path = require("path");
var assign = require("lodash").assign;
var Augur = require("../../src");
var debugOptions = require("../debug-options");
var connectionEndpoints = require("../connection-endpoints");
var core = require("augur-core");
var getPrivateKeyFromString = require("./lib/get-private-key").getPrivateKeyFromString;
var parrotSay = require("parrotsay-api");
var chalk = require("chalk");
var columnify = require("columnify");

var repFaucet = require("../rep-faucet");
var createMarkets = require("./create-markets");
var createOrders = require("./create-orders");

var COMMANDS = ["create-markets", "create-orders", "deploy", "rep-faucet", "upload"];
var NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];

function help() {
  return parrotSay(" Augur Deployment Parrot ").then(function (say) {
    console.log(say);
    console.log("Usage: dp <command> <network 1> <network 2> ... <network N>\n\n");

    console.log(chalk.underline("Commands"));
    console.log(COMMANDS.join(", "), "or help for this message");
    console.log("  NOTE: create-orders only supports " + chalk.bold("one network") + " at a time");

    console.log(chalk.underline("\nNetworks"));
    console.log(NETWORKS.join(", "));

    console.log(chalk.underline("\nConfiguration"));
    console.log("Set the following " + chalk.bold("environment variables") + " to modify the behavior of the deployment process");
    console.log("ex: USE_NORMAL_TIME=false dp deploy aura");

    console.log(chalk.underline("\nNetwork (when using `environment` for the network)"));
    console.log(columnify([{
      env: "ETHEREUM_HTTP",
      Description: "The http(s) address of your ethereum endpoint (default: http://localhost:8545)",
    }, {
      env: "AUGUR_WS",
      Description: "The websocket uri of your augur endpoint, only for " + chalk.bold("create-orders"),
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
  });
}

function runCannedData(command, networks, callback) {
  var deployerConfiguration = core.DeployerConfiguration.create(path.join(__dirname, "../../src/contracts"));
  var networkConfigurations = networks.map(core.NetworkConfiguration.create);
  // This is done in two steps on purpose, create validates the envs and will throw an error
  // if it doesn't work
  networkConfigurations.forEach(function (network) {
    var augur = new Augur();
    augur.rpc.setDebugOptions(debugOptions);

    var auth = getPrivateKeyFromString(network.privateKey);
    var ethereumNode = assign({}, connectionEndpoints.ethereumNode, { http: network.http });
    switch (command) {
      case "upload": {
        core.ContractDeployer.deployToNetwork(network, deployerConfiguration).then(function () {
          callback(null);
        });
        break;
      }

      case "rep-faucet": {
        augur.connect({ ethereumNode: ethereumNode }, function (err) {
          if (err) return callback(err);

          repFaucet(augur, 100000, auth, callback);
        });
        break;
      }

      case "create-markets": {
        augur.connect({ ethereumNode: ethereumNode }, function (err) {
          if (err) return callback(err);
          repFaucet(augur, 100000, auth, function (err) {
            if (err) return callback(err);
            createMarkets(augur, auth, callback);
          });
        });
        break;
      }

      case "create-orders": {
        if (typeof process.env.AUGUR_WS === "undefined") {
          console.log("Error: Must pass augur node URI in AUGUR_WS for create-orders\n");
          return help().then(function () {
            callback(null);
          });
        }
        augur.connect({ ethereumNode: { http: network.http }, augurNode: process.env.AUGUR_WS }, function (err) {
          if (err) return callback(err);
          createOrders(augur, auth, callback);
        });
        break;
      }

      case "deploy": {
        core.ContractDeployer.deployToNetwork(network, deployerConfiguration).then(function () {
          augur.contracts.reloadAddresses(function (err) {
            if (err) return callback(err);
            augur.connect({ ethereumNode: ethereumNode }, function (err) {
              if (err) return callback(err);
              // geth bug related to contract availability for estimating gas requires timeout
              setTimeout(function () {
                repFaucet(augur, 100000, auth, function (err) {
                  if (err) return callback(err);
                  createMarkets(augur, auth, callback);
                });
              }, 4000);
            });
          });
        });
        break;
      }

      default: {
        help().then(function () {
          callback(null);
        });
      }
    }
  });
}

function showError(error) {
  console.log("Failure!\n", error.message);
  if (error.stack && debugOptions.cannedMarkets) {
    console.log("-------- BACKTRACE ------");
    console.log(error.stack);
  }
  process.exit(1);
}

if (require.main === module) {
  var command = process.argv[2];
  var networks = process.argv.slice(3);

  if (networks.length === 0) {
    networks = ["environment"];
  }

  if (COMMANDS.indexOf(command) === -1 || command === "help") {
    help().then(function () {
      process.exit();
    });
  } else {
    try {
      runCannedData(command, networks, function (error) {
        if (error) return showError(error);
        process.exit();
      });
    } catch (error) {
      showError(error);
    }
  }
}

