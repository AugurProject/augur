#!/usr/bin/env node

// const getBalance = require("./get-balance");
// const getMarketBalance = require("./get-market-balance");
// const listMarkets = require("./list-markets");
// const designatedReport = require("./designated-report");
// const initialReport = require("./initial-report");
// const disputeContribute = require("./dispute-contribute");
// const finalizeMarket = require("./finalize-market");
// const pushTime = require("./push-time");
// const marketInfo = require("./market-info");
// const showInitialReporter = require("./show-initial-reporter");
// const fork = require("./fork");
// const listMarketOrders = require("./list-market-orders");
// const fillMarketOrders = require("./fill-market-orders");
// const createMarketOrder = require("./create-market-order");
// const pushTimestamp = require("./push-timestamp");
// const setTimestamp = require("./set-timestamp-cmd");
// const forceDispute = require("./force-dispute");
// const forceFinalize = require("./force-finalize");
// const transferAssets = require("./transfer-assets");
// const tradeCompleteSets = require("./trade-complete-sets");
// const getTimestamp = require("./get-time")

import { options } from "options-parser";
import chalk from "chalk";
import { strip0xPrefix } from "speedomatic";
import BigNumber from "bignumber.js";

import columnify from "columnify";
import {ContractDependenciesEthers} from "contract-dependencies-ethers";
import keythereum from "keythereum";
import { JsonRpcProvider } from "ethers/providers";

import { NetworkConfiguration } from "@augurproject/core";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Augur } from "@augurproject/sdk";
import { Controller } from "@augurproject/sdk/src/state/Controller";
const debugOptions = require("../debug-options");
import { ContractAPI } from "../libs/ContractAPI";
import { makeDbMock } from "../libs/MakeDbMock";
import { BlockAndLogStreamerListener } from "@augurproject/sdk/src/state/db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "@augurproject/sdk/src/state/db/EventLogDBRouter";

function getPrivateKeyFromString(privateKey) {
  privateKey = Buffer.from(strip0xPrefix(privateKey), "hex");
  const address = keythereum.privateKeyToAddress(privateKey);
  if (debugOptions.cannedMarkets) console.log(chalk.green.dim("sender:"), chalk.green(address));
  return { accountType: "privateKey", signer: privateKey, address };
}

const NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];
const mock = makeDbMock();  // TODO when augur-sdk API is ready, deprecate using the mock here

const methods = {
  "trade-complete-sets": {
    method: tradeCompleteSets,
    opts: {
      help: { flag: true, short: "h", help: "This help, transfer ETH or REP" },
      marketId: {
        short: "m",
        help: "Optional, will just grab one if not provided",
      },
      amount: {
        required: true,
        short: "a",
        help: "amount of asset to transfer",
      },
    },
  },
  "transfer-assets": {
    method: transferAssets,
    opts: {
      help: { flag: true, short: "h", help: "This help, transfer ETH or REP" },
      ether: { flag: true, short: "e", help: "indicates ETH" },
      rep: { flag: true, short: "r", help: "indicates REP" },
      to: {
        required: true,
        short: "t",
        help: "account address sending assets to",
      },
      amount: {
        required: true,
        short: "a",
        help: "amount of asset to transfer",
      },
    },
  },
  "get-balance": {
    method: getBalance,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, get this accounts balances",
      },
      account: { required: true, short: "a", help: "account address" },
    },
  },
  "get-market-balance": {
    method: getMarketBalance,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, get this accounts balances",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      account: { short: "a", help: "account address" },
    },
  },
  "list-markets": {
    method: listMarkets,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, list all markets, show endTime and description",
      },
    },
  },
  "designate-report": {
    method: designatedReport,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, REP is given to user if needed",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      asPrice: { flag: true, short: "p", help: "add flag to pass in price instead of outcome index, used for scalars"},
      outcome: {
        required: true,
        short: "o",
        help:
          "Outcome, sets outcome to use, negative outcome use \\\"-10\\\"",
      },
      description: { default: "designate report", short: "d", help: "Add description" },
      noPush: {
        short: "n",
        flag: true,
        default: false,
        help: "normally time is used, no pushing",
      },
    },
  },
  "initial-report": {
    method: initialReport,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, used for Open Reporting",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      asPrice: { flag: true, short: "p", help: "add flag to pass in price instead of outcome index, used for scalars"},
      outcome: {
        required: true,
        short: "o",
        help:
          "Outcome, sets outcome to use, negative outcome use \\\"-10\\\"",
      },
      description: { default: "initial report", short: "d", help: "Add description" },
      noPush: {
        short: "n",
        flag: true,
        default: false,
        help: "normally time is used, no pushing",
      },
    },
  },
  "dispute-contribute": {
    method: disputeContribute,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, push time and dispute this market",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      asPrice: { flag: true, short: "p", help: "add flag to pass in price instead of outcome index, used for scalars"},
      outcome: {
        required: true,
        short: "o",
        help:
          "Outcome, sets outcome to use, negative outcome use \\\"-10\\\"",
      },
      amount: { short: "a", help: "Optional: amount of REP to dispute with" },
      description: { default: "dispute contribute", short: "d", help: "Add description" },
      noPush: {
        short: "n",
        flag: true,
        default: false,
        help:
          "normally time is pushed to dispute contribute on market, simply don't push time",
      },
    },
  },
  "finalize-market": {
    method: finalizeMarket,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, finalize the market, it's in the correct state",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      noPush: {
        short: "n",
        flag: true,
        default: false,
        help:
          "normally time is pushed to finalize market, to finalize forking market don't push time",
      },
    },
  },
  "push-time": {
    method: pushTime,
    opts: {
      help: {
        flag: true,
        short: "h",
        help:
          "This help, push-time has been dep. use push-timestamp or set-timestamp",
      },
    },
  },
  "get-timestamp": {
    method: getTimestamp,
    opts: {
      help: {
        flag: true,
        short: "h",
        help:
          "This help, returns timestamp",
      },
    },
  },
  "market-info": {
    method: marketInfo,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, show attributes of this market",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "show-initial-reporter": {
    method: showInitialReporter,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, show initial reporter address",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "fork": {
    method: fork,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, dispute this market all the way to fork",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      stopsBefore: {
        short: "s",
        help: "Number of rounds to stop short of a fork",
      },
    },
  },
  "approval": {
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      account: {
        required: true,
        short: "a",
        help: "account address to be approved to trade",
      },
    },
    method: async (contractAPI, pouchDbFactory, args) => {
      if (args === "help" || args.opt.help) {
        console.log(chalk.red("Approves account address, used for trading"));
        return;
      }
      const address = args.opt.address;
      const universe = contractAPI.universe.address;
      console.log(chalk.green.dim("address:"), chalk.green(address));
      console.log(chalk.green.dim("universe:"), chalk.green(universe));

      return contractAPI.approveAugurEternalApprovalValue(address);
    },
  },
  "list-market-orders": {
    method: listMarketOrders,
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "fill-market-orders": {
    method: fillMarketOrders,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, script approves user if needed",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: {
        required: true,
        short: "o",
        help: "Outcome to fill order on, negative outcome use \\\"-10\\\"",
      },
      orderType: {
        required: true,
        short: "t",
        help: "Order type ('buy' | 'sell')",
      },
    },
  },
  "create-market-order": {
    method: createMarketOrder,
    opts: {
      help: {
        flag: true,
        short: "h",
        help: "This help, script approves user if needed",
      },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: {
        required: true,
        short: "o",
        help: "Outcome to fill order on, negative outcome use \\\"-10\\\"",
      },
      orderType: {
        required: true,
        short: "t",
        help: "Order type ('buy' | 'sell')",
      },
      price: { required: true, short: "p", help: "Price of the order" },
      amount: {
        required: true,
        short: "a",
        help: "amount of shares to purchase with eth",
      },
      useShares: {
        flag: true,
        short: "s",
        help: "use existing shares for the order",
      },
    },
  },
  "push-timestamp": {
    method: pushTimestamp,
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      days: { flag: true, short: "d", help: "push days" },
      weeks: { flag: true, short: "w", help: "push weeks" },
      seconds: { flag: true, short: "s", help: "push seconds, default" },
      count: {
        required: true,
        short: "c",
        help: "Required number of unit to push timestamp",
      },
    },
  },
  "set-timestamp": {
    method: setTimestamp,
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      timestamp: {
        required: true,
        short: "t",
        help: "Required actual timestamp to set",
      },
    },
  },
  "force-dispute": {
    method: forceDispute,
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
      asPrice: { flag: true, short: "p", help: "add flag to pass in price instead of outcome index, used for scalars"},
      rounds: {
        default: 10,
        short: "r",
        help: "Number or rounds to dispute, default is 10",
      },
    },
  },
  "force-finalize": {
    method: forceFinalize,
    opts: {
      help: { flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
};

async function runCommandWithArgs(commandName, method, args, network): Promise<void> {
  console.log("Running with Args");
  console.log(chalk.yellow.dim("command"), commandName);
  console.log(chalk.yellow.dim("parameters"), JSON.stringify(args));
  console.log(chalk.yellow.dim("network"), network);

  const config = NetworkConfiguration.create(network);
  console.log(chalk.yellow("network http:"), config.http);

  const auth = getPrivateKeyFromString(process.env.ETHEREUM_PRIVATE_KEY || config.privateKey);

  const ethersProvider = new EthersProvider(new JsonRpcProvider(config.http), 5, 0, 40);
  const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, auth.address);
  const augur = await Augur.create(ethersProvider, contractDependencies, auth.address);
  const contractAPI = new ContractAPI(augur, ethersProvider, auth.address);

  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, augur.addresses.Augur, augur.events.getEventTopics);
  const controller = new Controller<BigNumber>(
    augur,
    mock.constants.networkId,
    mock.constants.blockstreamDelay,
    mock.constants.defaultStartSyncBlockNumber,
    [auth.address],
    mock.makeFactory(),
    blockAndLogStreamerListener);
  controller.run();  // sets up databases

  // TODO figure out how to do this/if it's still useful
  // augur.rpc.setDebugOptions(debugOptions);

  const dbController = mock.makeDB(augur, [auth.address]);

  await method.method(contractAPI, dbController, args).catch((err) => {
    if (err) console.log(chalk.red("Error "), chalk.red(err));
    console.log(chalk.green("Finished Execution"));
    process.exit(0);
  });
}

function help() {
  console.log("                                  ");
  console.log("      Welcome to FLASH ......>    ");
  console.log("                                  ");
  console.log("Usage: flash <command> OPTIONS");
  console.log("Command Help flash <command> -h");

  console.log(chalk.underline("\nUsages"));
  console.log(
    "flash depends on the TimeControlled smart contract, this allows for pushing time",
  );

  console.log(chalk.underline("\nCommands"));
  console.log(Object.keys(methods).join(", "), "or -h for this message");

  console.log(chalk.underline("\nNetworks"));
  console.log(NETWORKS.join(", "));

  console.log(chalk.underline("\nConfiguration"));
  console.log(
    "Set the same " +
      chalk.bold("environment variables") +
      " used in dp for deployment process",
  );
  console.log("ex: ETHEREUM_PRIVATE_KEY=<owner priv key>");
  console.log(
    "ex: ETHEREUM_PRIVATE_KEY is used to change time and needs to be same account as used to upload contracts",
  );

  console.log(
    chalk.underline("\nNetwork (when using 'environment' for the network)"),
  );
  console.log(
    columnify(
      [
        {
          env: "ETHEREUM_HTTP",
          Description:
            "The http(s) address of your ethereum endpoint (default: http://localhost:8545)",
        },
        {
          env: "ETHEREUM_PRIVATE_KEY",
          Description:
            "HEX Private Key of OWNER of contracts and used to move TIME on eth node",
        },
        {
          env: "GAS_PRICE_IN_NANOETH",
          Description:
            "The transaction gas price to use, specified in nanoeth (default: varies)",
        },
        {
          env: "AUGUR_WS",
          Description:
            "The http endpoint for augur-node, (default: http://localhost:9001) ",
        },
      ],
      {
        columnSplitter: " - ",
        minWidth: 20,
        maxWidth: 80,
        showHeaders: false,
      },
    ),
  );

  console.log("               ");
  console.log(chalk.underline("Method descriptions"));
  console.log("               ");
  Object.keys(methods)
    .sort()
    .map((name) => {
      console.log(chalk.underline(name));
      methods[name].method(null, "help", null, () => {});
      console.log("               ");
    });
}

if (require.main === module) {
  const opts = {
    help: { flag: true, short: "h", help: "This help" },
    network: {
      short: "n",
      default: ["environment"],
      help: "Network to run command against",
    },
  };
  let args;
  try {
    args = options.parse(opts, process.argv, () => {
      return true;
    });
    args.opt.command = args.args[2];
    args.opt.params = args.args[3];
  } catch (error) {
    console.log(error);
    help();
    process.exit();
  }
  console.log("args:", JSON.stringify(args));
  const method = methods[args.opt.command];

  if (args.opt.help) {
    if (!method) {
      help();
      process.exit();
    }
    options.help(method.opts);
    process.exit();
  }

  if (!method) {
    console.log(chalk.red("Method Not Found"), chalk.red(args.opt.command));
    console.log(chalk.red(Object.keys(methods).join(", ")));
    console.log(chalk.red("Try flash -h, to get help"));
    process.exit();
  }

  try {
    const localArgs = options.parse(method.opts, process.argv);
    runCommandWithArgs(
      args.opt.command,
      method,
      localArgs,
      args.opt.network,
    ).then(() => process.exit());
  } catch (error) {
    options.help(method.opts);
  }
}
