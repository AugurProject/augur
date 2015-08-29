#!/usr/bin/env node
/**
 * augur.js initial private chain setup
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var nodeUtil = require("util");
var async = require("async");
var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var _ = require("lodash");
var rm = require("rimraf");
var abi = require("augur-abi");
var chalk = require("chalk");
var mocha = new (require("mocha"))();
var mod_getopt = require("posix-getopt");
var augur = require(path.join(__dirname, "..", "src"));
var constants = augur.constants;
var utils = augur.utils;
var log = console.log;

var options = {
    DEBUG: false,
    MOCHA_REPORTER: "spec",
    NETWORK_ID: "10101",
    GENESIS_BLOCK: path.join(__dirname, "..", "data", "genesis-10101.json"),
    PEER_PORT: 30303,
    RPC_PORT: 8545,
    MINIMUM_ETHER: 32,
    AUGUR_CORE: path.join(process.env.HOME, "src", "augur-core"),
    GOSPEL: path.join(__dirname, "..", "data", "gospel.json"),
    CUSTOM_GOSPEL: false,
    LOG: path.join(__dirname, "..", "data", "geth.log"),
    GETH: process.env.GETH || "/usr/local/bin/geth",
    SPAWN_GETH: true,
    SUITE: []
};
options.UPLOADER = path.join(options.AUGUR_CORE, "load_contracts.py");

// Test network (networkid 10101)
if (options.NETWORK_ID === "10101") {
    options.DATADIR = path.join(process.env.HOME, ".augur-test");
}

// Private alpha network (networkid 1010101)
else if (options.NETWORK_ID === "1010101") {
    options.DATADIR = path.join(process.env.HOME, ".augur");
}

// Public testnet (networkid 0)
else if (options.NETWORK_ID === "0") {
    options.DATADIR = path.join(process.env.HOME, ".ethereum-augur");
}

var accounts = utils.get_test_accounts(options.DATADIR, constants.MAX_TEST_ACCOUNTS);
var verified_accounts = false;

options.GETH_FLAGS = [
    "--etherbase", accounts[0],
    "--unlock", accounts[0],
    "--mine",
    "--port", options.PEER_PORT,
    "--rpc",
    "--rpcport", options.RPC_PORT,
    "--rpccorsdomain", "http://localhost:8080",
    "--rpcapi", "shh,db,eth,net,web3,miner",
    "--ipcapi", "admin,db,eth,debug,miner,net,shh,txpool,personal,web3",
    "--shh",
    "--nodiscover",
    "--maxpeers", "64",
    "--networkid", options.NETWORK_ID,
    "--datadir", options.DATADIR,
    "--genesis", options.GENESIS_BLOCK,
    "--password", path.join(options.DATADIR, ".password")
];

log("Create", chalk.magenta("geth"), "log file:", chalk.green(options.LOG));
var geth_log = fs.createWriteStream(options.LOG, {flags : 'w'});

function kill_geth(geth) {
    log(chalk.gray("Shut down ") + chalk.magenta("geth") + chalk.gray("..."));
    geth.kill();
}

function spawn_geth(flags) {
    var geth = null;
    if (options.SPAWN_GETH) {
        log("Spawn " + chalk.magenta(options.GETH) + " on network " +
            chalk.yellow.bold(options.NETWORK_ID) + "...");
        geth = cp.spawn(options.GETH, flags);
        log(chalk.magenta("geth"), "listening on ports:");
        log(chalk.gray(" - Peer:"), chalk.cyan(options.PEER_PORT));
        log(chalk.gray(" - RPC: "), chalk.cyan(options.RPC_PORT));
        geth.stdout.on("data", function (data) {
            if (options.DEBUG) {
                process.stdout.write(chalk.cyan(data.toString()));
            }
            geth_log.write("stdout: " + nodeUtil.format(data.toString()) + "\n");
        });
        geth.stderr.on("data", function (data) {
            if (options.DEBUG) {
                process.stdout.write(chalk.yellow(data.toString()));
            }
            geth_log.write(nodeUtil.format(data.toString()) + "\n");
        });
        geth.on("close", function (code) {
            if (code !== 2 && code !== 0) {
                log(chalk.red.bold("geth closed with code " + code));
                kill_geth(geth);
                if (code === 1) {
                    utils.wait(5);
                    log("Restarting", chalk.magenta("geth") + "...");
                    return spawn_geth(flags);
                }
            }
        });
    }
    return geth;
}

function mine_minimum_ether(geth, account, next) {
    var balance = abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toNumber();
    if (balance < options.MINIMUM_ETHER) {
        if (balance > 0) {
            log(chalk.green(balance) + chalk.gray(" ETH, waiting for ") +
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
    augur.rpc.bignumbers = false;
    if (options.CUSTOM_GOSPEL) {
        augur = utils.setup(
            augur,
            ["--gospel"],
            { port: options.RPC_PORT }
        );
    } else {
        augur = utils.setup(
            augur,
            null,
            { port: options.RPC_PORT }
        );
    }
}

function init(geth, account, callback, next, count) {
    function retry() {
        init(geth, account, callback, next, ++count);
    }
    connect_augur();
    count = count || 0;
    if (augur.connected()) {
        accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
        verified_accounts = true;
        if (!verified_accounts && account !== accounts[0]) {
            if (geth) kill_geth(geth);
            account = accounts[0];
            log(chalk.blue.bold("\nAccount 0: ") + chalk.cyan(account));
            options.GETH_FLAGS[1] = account;
            options.GETH_FLAGS[3] = account;
            setTimeout(function () {
                init(
                    spawn_geth(options.GETH_FLAGS),
                    account,
                    callback,
                    next,
                    ++count
                );
            }, 5000);
        } else {
            var balance = augur.rpc.balance(account);
            if (balance && !balance.error) {
                balance = abi.bignum(balance).dividedBy(constants.ETHER).toFixed();
                log("Connected on account", chalk.cyan(account));
                log(chalk.green(augur.rpc.blockNumber()), chalk.gray("blocks"));
                log(chalk.green(balance), chalk.gray("ETH"));
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
                if (geth) kill_geth(geth);
                utils.wait(2.5);
                geth = spawn_geth(options.GETH_FLAGS);
            }
            setTimeout(retry, 2500);
        }
    }
}

function reset_tests(suite) {
    suite.tests.forEach(function (t) {
        delete t.state;
        t.timedOut = false;
    });
    suite.suites.forEach(reset_tests);
}

function faucets(geth) {
    connect_augur();
    var branch = augur.branches.dev;
    var coinbase = augur.coinbase;
    var balance = {
        reputation: abi.bignum(augur.getRepBalance(branch, coinbase)),
        cash: abi.bignum(augur.getCashBalance(coinbase))
    };
    var needs = {
        reputation: !balance.reputation || balance.reputation.lt(new BigNumber(47)),
        cash: !balance.cash || balance.cash.lt(new BigNumber(5))
    };
    reset_tests(mocha.suite);
    mocha.addFile(path.join(__dirname, "..", "test", "core", "faucets.js"));
    mocha.reporter(options.MOCHA_REPORTER).run(function (failures) {
        var cash_balance = augur.getCashBalance(coinbase);
        var rep_balance = augur.getRepBalance(branch, coinbase);
        var ether_balance = abi.bignum(augur.rpc.balance(coinbase)).dividedBy(constants.ETHER).toFixed();
        log(chalk.cyan("\nBalances:"));
        log("Cash:       " + chalk.green(cash_balance));
        log("Reputation: " + chalk.green(rep_balance));
        log("Ether:      " + chalk.green(ether_balance));
        if (geth) kill_geth(geth);
        for (var i = 0, len = accounts.length; i < len; ++i) {
            if (options.GETH_FLAGS[1] === accounts[i]) break;
        }
        if (i < accounts.length - 1) {
            log(chalk.blue.bold("\nAccount " + (i+1) + ": ") + chalk.cyan(accounts[i+1]));
            options.GETH_FLAGS[1] = accounts[i+1];
            options.GETH_FLAGS[3] = accounts[i+1];
            setTimeout(function () {
                init(
                    spawn_geth(options.GETH_FLAGS),
                    accounts[i+1],
                    mine_minimum_ether,
                    faucets
                );
            }, 5000);
        } else {
            process.exit(failures);
        }
    });
}

function upload_contracts(geth) {
    if (!options.UPLOAD_CONTRACT) {
        log(chalk.red.bold("Upload contracts to network ")+
            chalk.yellow.bold(options.NETWORK_ID)+
            chalk.red.bold(":"));
    } else {
        log(chalk.red.bold("Uploading ")+
            chalk.yellow.bold(options.UPLOAD_CONTRACT)+
            chalk.red.bold(" contract to network ")+
            chalk.yellow.bold(options.NETWORK_ID)+
            chalk.red.bold(":"));
    }
    var uploader_options = [
        "--blocktime", "1.75",
        "--rpcport", options.RPC_PORT
    ];
    if (options.UPLOAD_CONTRACT) {
        uploader_options.push("--contract=" + options.UPLOAD_CONTRACT);
    }
    var uploader = cp.spawn(options.UPLOADER, uploader_options);
    uploader.stdout.on("data", function (data) {
        process.stdout.write(chalk.cyan.dim(data.toString()));
    });
    uploader.stderr.on("data", function (data) {
        process.stdout.write(chalk.red(data.toString()));
    });
    uploader.on("close", function (code) {
        if (code !== 0) {
            log(chalk.red.bold("Uploader closed with code", code));
        } else {
            var gospelcmd = path.join(options.AUGUR_CORE, "generate_gospel.py -j");
            cp.exec(gospelcmd, function (err, stdout) {
                if (err) throw err;
                fs.writeFileSync(options.GOSPEL, stdout.toString());
                log("Saved contract addresses:", chalk.green(options.GOSPEL));
                options.CUSTOM_GOSPEL = true;
                if (options.FAUCETS) {
                    log("Send", options.MINIMUM_ETHER, "ETH to:");
                    for (var i = 1, len = accounts.length; i < len; ++i) {
                        log(chalk.green("  ✓ ") + chalk.gray(accounts[i]));
                        augur.pay(accounts[i], options.MINIMUM_ETHER);
                    }
                }
                if (options.FAUCETS) {
                    if (geth) kill_geth(geth);
                    if (options.FAUCETS) {
                        log(chalk.blue.bold("\nAccount 1:"), chalk.cyan(accounts[1]));
                        options.GETH_FLAGS[1] = accounts[1];
                        options.GETH_FLAGS[3] = accounts[1];
                        setTimeout(function () {
                            init(
                                spawn_geth(options.GETH_FLAGS),
                                accounts[1],
                                mine_minimum_ether,
                                faucets
                            );
                        }, 10000);
                    }
                } else {
                    process.exit(0);
                }
            });
        }
    });
}

var old_spawn = cp.spawn;
cp.spawn = function () {
    if (options.DEBUG) log(arguments);
    var result = old_spawn.apply(this, arguments);
    return result;
};

function reset_datadir() {
    log("Reset " + chalk.magenta("augur") + " data directory: " +
        chalk.green(options.DATADIR));
    var directories = [ "blockchain", "chaindata", "dapp", "extra", "nodes", "state" ];
    for (var i = 0, len = directories.length; i < len; ++i) {
        rm.sync(path.join(options.DATADIR, directories[i]));
    }
}

function main(account, options) {
    if (options.RESET) {
        reset_datadir();
        init(
            spawn_geth(options.GETH_FLAGS),
            account,
            mine_minimum_ether,
            upload_contracts
        );
    } else if (options.UPLOAD_CONTRACT) {
        init(
            spawn_geth(options.GETH_FLAGS),
            account,
            mine_minimum_ether,
            upload_contracts
        );
    } else if (options.FAUCETS) {
        init(
            spawn_geth(options.GETH_FLAGS),
            account,
            mine_minimum_ether,
            faucets
        );
    }
}

var option, optstring, parser, done;
optstring = "d(debug)r(reset)g(geth)o(gospel)f(faucets)"+
            "u:(augur)t:(contract)";
parser = new mod_getopt.BasicParser(optstring, process.argv);

while ((option = parser.getopt()) !== undefined) {
    switch (option.option) {
        case 'd':
            options.DEBUG = true;
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
        case 'o':
            log("Load contracts from file:", chalk.green(options.GOSPEL));
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
        default:
            assert.strictEqual('?', option.option);
            done = true;
            break;
    }
    if (done) break;
}

main(accounts[0], options);
