#!/usr/bin/env node

var Augur = require("../../src");
var debugOptions = require("../debug-options");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var chalk = require("chalk");
var columnify = require("columnify");
var options = require("options-parser");

var NetworkConfiguration = require("augur-core").NetworkConfiguration;
var getBalance = require("./get-balance");
var listMarkets  = require("./list-markets");
var designatedReport = require("./designated-report");
var initialReport = require("./initial-report");
var disputeContribute = require("./dispute-contribute");
var finalizeMarket = require("./finalize-market");
var pushTime = require("./push-time");
var marketInfo = require("./market-info");
var showInitialReporter = require("./show-initial-reporter");

var commands = ["get-balance", "list-markets", "designate-report", "initial-report", "dispute-contribute", "finalize-market", "push-time", "market-info", "show-initial-reporter"];
var NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];
var methods = [getBalance, listMarkets, designatedReport, initialReport, disputeContribute, finalizeMarket, pushTime, marketInfo, showInitialReporter];

function runCommand(command, params, networks, callback) {
  console.log("networks", networks);
  console.log(chalk.yellow.dim("command"), command);
  console.log(chalk.yellow.dim("parameters"), params);
  console.log(chalk.yellow.dim("networks"), networks);
  networks.forEach(function (network) {
    console.log(NetworkConfiguration.create);
    var config = NetworkConfiguration.create(network);
    console.log(chalk.yellow("network http:"), config.http);
    var augur = new Augur();
    augur.rpc.setDebugOptions(debugOptions);
    var auth = getPrivateKeyFromString(config.privateKey);
    var augurWs = process.env.AUGUR_WS ? process.env.AUGUR_WS : "http://localhost:9001";

    augur.connect({ ethereumNode: { http: config.http }, augurNode: augurWs }, function (err) {
      if (err) {
        console.log(chalk.red("Error "), chalk.red(err));
        return callback(err);
      }
      methods[commands.indexOf(command)](augur, params, auth, function (err) {
        if (err) console.log(chalk.red("Error "), chalk.red(err));
        console.log(chalk.green("Finished Execution"));
        process.exit(0);
      });
    });
  });
}

function help() {

  console.log("                                  ");
  console.log("      Welcome to FLASH ......>    ");
  console.log("                                  ");
  console.log("Usage: flash <command> param1,param2,... -n network1,network2,...");
  console.log("Command Help flash <command> -h");

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
  console.log("ex: ETHEREUM_PRIVATE_KEY is used to change time and needs to be same account as used to upload contracts");

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
  }, {
    env: "AUGUR_WS",
    Description: "The http endpoint for augur-node, (default: http://localhost:9001) ",
  }], {
    columnSplitter: " - ",
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false,
  }));

  console.log("               ");
  console.log(chalk.underline("\Method descriptions"));
  commands.forEach(function (command) {
    console.log(chalk.underline(command));
    methods[commands.indexOf(command)](null, "help", null, function () { });
    console.log("               ");
  });
}

if (require.main === module) {
  var opts = {
    help: {flag: true, short: "h", help: "This help" },
    networks: { multi: true, short: "n", default: ["environment"], help: "Networks to run command against"},
  };
  var args;
  try {
    args = options.parse(opts, process.argv);
    console.log(JSON.stringify(args));
    args.opt.command = args.args[2];
    args.opt.params = args.args[3];
    console.log(JSON.stringify(args));
  } catch (error) {
    console.log(error);
    help();
    process.exit();
  }
  if (commands.indexOf(args.opt.command) === -1 && args.opt.help) {
    help();
    process.exit();
  } else if (commands.indexOf(args.opt.command) > 0 && args.opt.help) {
    console.log(chalk.yellow("Help for"), chalk.yellow.underline(args.opt.command));
    methods[commands.indexOf(args.opt.command)](null, "help", null, function () { });
    process.exit(0);
  } else if (args.opt.networks.length === 0) {
    console.log(chalk.red("Network is required"));
    help();
    process.exit();
  }
  runCommand(args.opt.command, args.opt.params, args.opt.networks, function () {
    process.exit();
  });
}
