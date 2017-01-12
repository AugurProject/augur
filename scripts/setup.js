#!/usr/bin/env node
/**
 * augur.js initial private chain setup
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var cp = require("child_process");
var nodeUtil = require("util");
var assert = require("chai").assert;
var async = require("async");
var BigNumber = require("bignumber.js");
var rm = require("rimraf");
var abi = require("augur-abi");
var chalk = require("chalk");
var getopt = require("posix-getopt");
var gethjs = require("geth");
var tools = require("../test/tools");
var augur = require(join(__dirname, "..", "src"));
var constants = augur.constants;
var utils = augur.utils;
var augur_contracts_path = join(process.env.HOME, "src", "augur-contracts", "contracts");
var augur_contracts = require(augur_contracts_path);

var SYMLINK = join(process.env.HOME, "ethlink");
var BOOTNODES = [
  "enode://"+
    "d4f4e7fd3954718562544dbf322c0c84d2c87f154dd66a39ea0787a6f74930c4"+
    "2f5d13ba2cfef481b66a6f002bc3915f94964f67251524696a448ba40d1e2b12"+
    "@45.33.59.27:30303",
  "enode://"+
    "a9f34ea3de79cd75ba49c37603d28a7c494f32604b4ad6e3415b4c6020ff5bf3"+
    "8f9772d69362c024355245fe839dd397ff9ec04db70b3258d92259323cb792ae"+
    "@69.164.196.239:30303",
  "enode://"+
    "4f23a991ea8739bcc5ab52625407fcfddb03ac31a36141184cf9072ff8bf3999"+
    "54bb94ec47e1f653a0b0fea8d88a67fa3147dbe5c56067f39e0bd5125ae0d1f1"+
    "@139.162.5.153:30303",
  "enode://"+
    "bafc7bbaebf6452dcbf9522a2af30f586b38c72c84922616eacad686ab6aaed2"+
    "b50f808b3f91dba6a546474fe96b5bff97d51c9b062b4a2e8bc9339d9bb8e186"+
    "@106.184.4.123:30303"
];

var options = {
  DEBUG: false,
  MINIMUM_ETHER: 50,
  AUGUR_CORE: join(process.env.HOME, "src", "augur-core"),
  GOSPEL: join(__dirname, "..", "data", "gospel.json"),
  CUSTOM_GOSPEL: false,
  GETH: process.env.GETH || "geth",
  SPAWN_GETH: true,
  GETH_OPTIONS: {
    symlink: SYMLINK,
    flags: {
      networkid: "10101",
      port: 30303,
      rpc: null,
      rpcport: 8545,
      rpcapi: "eth,net,web3",
      ipcapi: "admin,db,eth,debug,miner,net,shh,txpool,personal,web3",
      mine: null,
      minerthreads: 2
    }
  }
};
options.UPLOADER = join(options.AUGUR_CORE, "load_contracts.py");
options.GENESIS_BLOCK = join(__dirname, "..", "data", "genesis-10101.json");

var accounts = tools.get_test_accounts(SYMLINK, tools.MAX_TEST_ACCOUNTS);
var verified_accounts = false;

function mine_minimum_ether(geth, account, next) {
  var balance = abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toNumber();
  if (balance < options.MINIMUM_ETHER) {
    if (balance > 0) {
      console.log(chalk.green(balance) + chalk.gray(" ETH, waiting for ") +
                  chalk.green(options.MINIMUM_ETHER) + chalk.gray("..."));
    }
    setTimeout(function () {
      mine_minimum_ether(geth, account, next);
    }, 5000);
  } else {
    if (next) next(geth);
  }
}

function connect_augur() {
  if (options.CUSTOM_GOSPEL || options.RESET) {
    augur = tools.setup(
      augur,
      ["--gospel"],
      "127.0.0.1:" + options.GETH_OPTIONS.flags.rpcport
    );
  } else {
    augur = tools.setup(
      augur,
      null,
      "127.0.0.1:" + options.GETH_OPTIONS.flags.rpcport
    );
  }
}

function init(geth, account, callback, next, count) {
  function retry() {
    init(geth, account, callback, next, ++count);
  }
  connect_augur();
  count = count || 0;
  if (augur.connector.connected()) {
    accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
    verified_accounts = true;
    if (!verified_accounts && account !== accounts[0]) {
      gethjs.stop(function (err, code) {
        account = accounts[0];
        console.log(chalk.blue.bold("\nAccount 0: ") + chalk.cyan(account));
        options.GETH_OPTIONS.account = account;
        setTimeout(function () {
          gethjs.start(options.GETH_OPTIONS, function (err, geth) {
            init(geth, account, callback, next, ++count);
          });
        }, 5000);
      });
    } else {
      var balance = augur.rpc.balance(account);
      if (balance && !balance.error) {
        balance = abi.bignum(balance).dividedBy(constants.ETHER).toFixed();
        console.log("Connected on account", chalk.cyan(account));
        console.log(chalk.green(augur.rpc.blockNumber()), chalk.gray("blocks"));
        console.log(chalk.green(balance), chalk.gray("ETH"));
        callback(geth, account, next);
      } else {
        setTimeout(retry, 5000);
      }
    }
  } else {
    if (count < 10) {
      setTimeout(retry, 5000);
    } else {
      if (options.SPAWN_GETH) {
        gethjs.stop(function (err, code) {
          gethjs.start(options.GETH_OPTIONS, function (err, g) {
            geth = g;
          });
        });
      }
      setTimeout(retry, 2500);
    }
  }
}

function faucets(geth) {
  augur.connector.from = augur.coinbase;
  connect_augur();
  var branch = augur.constants.DEFAULT_BRANCH_ID;
  var coinbase = augur.coinbase;
  var value = constants.FREEBIE * 0.25;
  var weiValue = abi.bignum(value).mul(constants.ETHER).toFixed();
  var initialCash = abi.bignum(augur.getCashBalance(coinbase));
  delete require.cache[require.resolve("augur-contracts")];
  augur.contracts = require("augur-contracts")[options.GETH_OPTIONS.flags.networkid];
  augur.connector.update_contracts();
  augur.sync(augur.connector);
  augur.reputationFaucet({
    branch: branch,
    onSent: augur.utils.noop,
    onSuccess: function (r) {
      var rep_balance = augur.getRepBalance(branch, coinbase);
      var cash_balance = augur.getCashBalance(coinbase);
      augur.sendCash({
        value: 0,
        to: augur.contracts.cash,
        onSent: augur.utils.noop,
        onSuccess: function (res) {
          augur.depositEther({
            value: 5000,
            onSent: augur.utils.noop,
            onSuccess: function (res) {
              var cash_balance = augur.getCashBalance(coinbase);
              var rep_balance = augur.getRepBalance(branch, coinbase);
              var ether_balance = abi.bignum(augur.rpc.balance(coinbase)).dividedBy(constants.ETHER).toFixed();
              console.log(chalk.cyan("\nBalances:"));
              console.log("Cash:       " + chalk.green(cash_balance));
              console.log("Reputation: " + chalk.green(rep_balance));
              console.log("Ether:      " + chalk.green(ether_balance));
              gethjs.stop(function (err, code) {
                for (var i = 0, len = accounts.length; i < len; ++i) {
                  if (options.GETH_OPTIONS.account === accounts[i]) break;
                }
                if (i >= accounts.length - 1) return process.exit();
                console.log(chalk.blue.bold("\nAccount " + (i+1) + ": ") + chalk.cyan(accounts[i+1]));
                options.GETH_OPTIONS.account = accounts[i+1];
                setTimeout(function () {
                  gethjs.start(options.GETH_OPTIONS, function (err, geth) {
                    if (err) return console.error("geth.start:", err);
                    init(geth, accounts[i+1], mine_minimum_ether, faucets);
                  });
                }, 5000);
              });
            },
            onFailed: console.error
          });
        },
        onFailed: console.error
      });
    },
    onFailed: console.error
  });
}

function upload_contracts(geth) {
  if (!options.UPLOAD_CONTRACT) {
    console.log(chalk.red.bold("Upload contracts to network ")+
                chalk.yellow.bold(options.GETH_OPTIONS.flags.networkid)+
                chalk.red.bold(":"));
  } else {
    console.log(chalk.red.bold("Uploading ")+
                chalk.yellow.bold(options.UPLOAD_CONTRACT)+
                chalk.red.bold(" contract to network ")+
                chalk.yellow.bold(options.GETH_OPTIONS.flags.networkid)+
                chalk.red.bold(":"));
  }
  var uploader_options = [
    // "--source", "./src-extern",
    // "--externs",
    "--blocktime", "1.75",
    "--rpcport", options.GETH_OPTIONS.flags.rpcport
  ];
  if (options.UPLOAD_CONTRACT) {
    uploader_options = uploader_options.concat(["--contract", options.UPLOAD_CONTRACT]);
  }
  var uploader = cp.spawn(options.UPLOADER, uploader_options);
  uploader.stdout.on("data", function (data) {
    process.stdout.write(chalk.cyan.dim(nodeUtil.format(data.toString())));
  });
  uploader.stderr.on("data", function (data) {
    process.stdout.write(chalk.red(nodeUtil.format(data.toString())));
  });
  uploader.on("close", function (code) {
    if (code !== 0) {
      console.log(chalk.red.bold("Uploader closed with code", code));
    } else {
      var gospelcmd = join(options.AUGUR_CORE, "generate_gospel.py -j");
      cp.exec(gospelcmd, function (err, stdout) {
        if (err) throw err;
        fs.writeFileSync(options.GOSPEL, stdout.toString());
        augur_contracts[options.GETH_OPTIONS.flags.networkid] = JSON.parse(stdout);
        var jsonpath = augur_contracts_path + ".json";
        fs.writeFileSync(jsonpath, JSON.stringify(augur_contracts, null, 4));
        console.log("Saved contracts:", chalk.green(options.GOSPEL), chalk.magenta(jsonpath));
        options.CUSTOM_GOSPEL = true;
        augur.transact({
          to: augur_contracts[options.GETH_OPTIONS.flags.networkid].branches,
          method: "initDefaultBranch",
          returns: "number",
          send: true
        }, function (res) {
          // assert.property(res, "txHash");
          // assert.strictEqual(res.callReturn, "1");
        }, function (res) {
          if (options.FAUCETS) {
            if (geth) gethjs.stop();
            gethjs.stop(function (err, code) {
              if (options.FAUCETS) {
                console.log(chalk.blue.bold("\nAccount 1:"), chalk.cyan(accounts[1]));
                options.GETH_OPTIONS.account = accounts[1];
                setTimeout(function () {
                  gethjs.start(options.GETH_OPTIONS, function (err, geth) {
                      init(geth, accounts[1], mine_minimum_ether, faucets);
                    });
                }, 10000);
              }
            });
          } else {
            process.exit(0);
          }
        }, console.error);
      });
    }
  });
}

var old_spawn = cp.spawn;
cp.spawn = function () {
  if (options.DEBUG) console.log(arguments);
  var result = old_spawn.apply(this, arguments);
  return result;
};

function reset_datadir() {
  console.log("Reset " + chalk.magenta("augur") + " data directory: " + chalk.green(SYMLINK));
  var directories = ["blockchain", "chaindata", "dapp", "extra", "nodes", "state"];
  for (var i = 0, len = directories.length; i < len; ++i) {
    rm.sync(join(SYMLINK, directories[i]));
  }
}

function main(account, options) {
  if (options.RESET) reset_datadir();
  if (options.SPAWN_GETH) {
    options.GETH_OPTIONS.account = account;
    return gethjs.start(options.GETH_OPTIONS, function (err, geth) {
      setTimeout(function () {
        if (!options.RESET && options.FAUCETS) {
          return init(
            geth,
            account,
            mine_minimum_ether,
            faucets
          );
        }
        init(
          geth,
          account,
          mine_minimum_ether,
          upload_contracts
        );
      }, 5000);
    });
  } else if (options.FAUCETS) {
    return init(
      null,
      account,
      mine_minimum_ether,
      faucets
    );
  }
  init(
    null,
    account,
    mine_minimum_ether,
    upload_contracts
  );
}

var option, optstring, parser, done;
optstring = "d(debug)r(reset)g(geth)o(gospel)f(faucets)s(nodiscover)b(bootnodes)u:(augur)t:(contract)n:(networkid)";

parser = new getopt.BasicParser(optstring, process.argv);

while ( (option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'd':
      options.DEBUG = true;
      gethjs.debug = true;
      break;
    case 'r':
      options.RESET = true;
      options.SPAWN_GETH = true;
      break;
    case 'g':
      options.SPAWN_GETH = false;
      break;
    case 'f':
      options.FAUCETS = true;
      options.SPAWN_GETH = true;
      break;
    case 's':
      options.GETH_OPTIONS.flags.nodiscover = null;
      break;
    case 'b':
      options.GETH_OPTIONS.flags.bootnodes = BOOTNODES;
      break;
    case 'o':
      console.log("Load contracts from file:", chalk.green(options.GOSPEL));
      augur.contracts = JSON.parse(fs.readFileSync(options.GOSPEL));
      options.CUSTOM_GOSPEL = true;
      break;
    case 'u':
      options.AUGUR_CORE = option.optarg;
      break;
    case 't':
      options.UPLOAD_CONTRACT = option.optarg;
      options.RESET = false;
      break;
    case 'n':
      options.GETH_OPTIONS.flags.networkid = option.optarg;
      options.GENESIS_BLOCK = join(__dirname, "..", "data", "genesis-" + option.optarg + ".json");
      break;
    default:
      assert.strictEqual('?', option.option);
      done = true;
      break;
  }
  if (done) break;
}

main(accounts[0], options);
