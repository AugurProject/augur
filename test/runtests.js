#!/usr/bin/env node
/**
 * Automated tests for augur.js
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs    = require("fs");
var path  = require("path");
var cp = require("child_process");
var util = require("util");
var async = require("async");
var rm = require("rimraf");
var chalk = require("chalk");
var Mocha = require("mocha");
var Augur = require("../augur");

var log = console.log;

var DEBUG = true;
// var DATADIR = path.join(process.env.HOME, ".augur");
var DATADIR = path.join(process.env.HOME, ".augur-test");
var AUGUR_CORE = path.join(process.env.HOME, "src", "augur-core");
var NETWORK_ID = "10101";
var PROTOCOL_VERSION = "59";
var MINIMUM_ETHER = 30;

var accounts = [
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c",
    "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6"
];
var enodes = [
    "enode://035b7845dfa0c0980112abdfdf4dc11087f56b77e10d2831f186ca12bc00f5b9327c427d03d9cd8106db01488905fb2200b5706f9e41c5d75885057691d9997c@[::]:30303",
    "enode://4014c7fa323dafbb1ada241b74ce16099efde03f994728a55b9ff09a9a80664920045993978de85cb7f6c2ac7e9218694554433f586c1290a8b8faa186ce072c@[::]:30303",
    "enode://12bcaeb91de58d9c48a0383cc77f7c01decf30c7da6967408f31dc793e08b14e2b470536ebe501a4f527e98e84c7f5431755eae5e0f4ba2556539ab9faa77318@76.14.85.30:30303"
].join(' ');
var timers = [];
var geth_flags = [
    "--etherbase", accounts[0],
    "--unlock", accounts[0],
    "--mine",
    "--rpc",
    "--rpccorsdomain", "http://localhost:8080",
    "--shh",
    "--maxpeers", "64",
    "--networkid", NETWORK_ID,
    "--datadir", DATADIR,
    "--protocolversion", PROTOCOL_VERSION,
    "--bootnodes", enodes,
    "--password", path.join(DATADIR, ".password")
];
var check_connection;
var mocha = new Mocha();

function clear_timeouts(t) {
    for (var j = 0, len = t.length; j < len; ++j) {
        clearTimeout(t[j]);
    }
    return t;
}

function retry(geth, timers, account, callback, next) {
    timers.push(
        setTimeout(function () { check_connection(geth, account, callback, next); }, 2500)
    );
    return timers;
}

function preupload_tests() {
    mocha.addFile(path.join(__dirname, "test_fixedpoint.js"));
    mocha.addFile(path.join(__dirname, "test_encoder.js"));
    mocha.run(function (failures) {
        process.on("exit", function () {
            process.exit(failures);
        });
    });
}

function check_connection(geth, account, callback, next) {
    var balance;
    try {
        balance = Augur.balance(account);
        if (balance && !balance.error) {
            balance = Augur.bignum(balance).dividedBy(Augur.ETHER).toFixed();
            log("Connected on account", chalk.green(account));
            if (next) {
                Augur.contracts = JSON.parse(fs.readFileSync("gospel.json"));
                Augur.connect();
            }
            timers = clear_timeouts(timers);
            callback(geth, account, next);
        } else {
            timers = retry(geth, timers, account, callback, next);
        }
    } catch (e) {
        timers = retry(geth, timers, account, callback, next);
    }
}

function kill_geth(geth) {
    log("Shut down " + chalk.magenta("geth") + "...");
    geth.kill();
}

function postupload_tests() {
    mocha.addFile(path.join(__dirname, "test_ethrpc.js"));
    // mocha.addFile(path.join(__dirname, "test_invoke.js"));
    // mocha.addFile(path.join(__dirname, "test_reporting.js"));
    // mocha.addFile(path.join(__dirname, "test_expiring.js"));
    // mocha.addFile(path.join(__dirname, "test_augur.js"));
    mocha.addFile(path.join(__dirname, "test_createEvent.js"));
    // mocha.addFile(path.join(__dirname, "test_addEvent.js"));
    // mocha.addFile(path.join(__dirname, "test_createMarket.js"));
    mocha.addFile(path.join(__dirname, "test_buyAndSellShares.js"));
    mocha.addFile(path.join(__dirname, "fastforward.js"));
    mocha.addFile(path.join(__dirname, "test_ballot.js"));
    mocha.addFile(path.join(__dirname, "test_interpolate.js"));
    mocha.addFile(path.join(__dirname, "test_consensus.js"));
    // mocha.addFile(path.join(__dirname, "test_score.js"));
    // mocha.addFile(path.join(__dirname, "test_resolve.js"));
    // mocha.addFile(path.join(__dirname, "test_payments.js"));
    // mocha.addFile(path.join(__dirname, "test_markets.js"));
    // mocha.addFile(path.join(__dirname, "test_comments.js"));
    mocha.run(function (failures) {
        process.on("exit", function () {
            process.exit(failures);
        });
    });
}

function spawn_geth(flags) {
    log("Spawn " + chalk.magenta("geth") + " on network " + chalk.green(NETWORK_ID) +
        " (version " + chalk.green(PROTOCOL_VERSION) + ")...");
    var geth = cp.spawn("geth", flags);
    var geth_log = fs.createWriteStream(path.join(__dirname, 'geth.log'), {flags : 'w'});
    geth.stderr.on("data", function (data) {
        geth_log.write(util.format(data.toString()) + "\n");
    });
    geth.on("close", function (code) {
        log(chalk.red.bold("geth closed with code " + code));
    });
    return geth;
}

function faucets(geth, next) {
    log(chalk.yellow("Reputation") + " faucet...");
    Augur.reputationFaucet(Augur.branches.dev);
    log(chalk.yellow("Cash") + " faucet...");
    Augur.cashFaucet();
    geth_flags[1] = accounts[2];
    geth_flags[3] = accounts[2];
    setTimeout(function () {
        var cash_balance = Augur.getCashBalance(Augur.coinbase);
        var rep_balance = Augur.getRepBalance(Augur.branches.dev, Augur.coinbase);
        var ether_balance = Augur.bignum(Augur.balance(Augur.coinbase)).dividedBy(Augur.ETHER).toFixed();
        log(chalk.cyan("\nBalances:"));
        log("Cash:       " + chalk.green(cash_balance));
        log("Reputation: " + chalk.green(rep_balance));
        log("Ether:      " + chalk.green(ether_balance));
        kill_geth(geth);
        next(geth_flags);
    }, 10000);
}

function next_account() {
    check_connection(
        spawn_geth(geth_flags),
        accounts[2],
        faucets,
        postupload_tests
    );
}

function upload_contracts(geth, account) {
    var balance = Augur.bignum(Augur.balance(account)).dividedBy(Augur.ETHER).toNumber();
    if (balance < MINIMUM_ETHER) {
        log(chalk.bold("Balance: " + balance + " ETH") +
            ", waiting for " + chalk.bold(MINIMUM_ETHER) + "...");
        setTimeout(function () { upload_contracts(geth, account); }, 10000);
    } else {
        log("Upload contracts to test chain...");
        try {
            var uploader = cp.spawn(path.join(AUGUR_CORE, "load_contracts.py"), [
                "--BLOCKTIME=1"
            ]);
            uploader.stdout.on("data", function (data) {
                process.stdout.write(chalk.cyan(data.toString()));
            });
            uploader.stderr.on("data", function (data) {
                process.stdout.write(chalk.red(data.toString()));
            });
            uploader.on("close", function (code) {
                log(chalk.red.bold("Uploader closed with code " + code));
                cp.exec(path.join(AUGUR_CORE, "generate_gospel.py -j"), function (err, stdout) {
                    if (err) throw err;
                    log("Write contract addresses to " + chalk.magenta("gospel.json") + "...");
                    fs.writeFileSync("gospel.json", stdout.toString());
                    kill_geth(geth);
                    geth_flags[1] = accounts[1];
                    geth_flags[3] = accounts[1];
                    setTimeout(function () {
                        check_connection(
                            spawn_geth(geth_flags),
                            accounts[1],
                            faucets,
                            next_account
                        );
                    }, 10000);
                });
            });
        } catch (exc) {
            log(exc);
        }
    }
}

var old_spawn = cp.spawn;

cp.spawn = function () {
    if (DEBUG) log(arguments);
    var result = old_spawn.apply(this, arguments);
    return result;
};

function reset_datadir() {
    log("Reset " + chalk.magenta("augur") + " data directory: " + chalk.green(DATADIR));
    var directories = [ "blockchain", "extra", "nodes", "state" ];
    for (var i = 0, len = directories.length; i < len; ++i) {
        rm.sync(path.join(DATADIR, directories[i]));
    }
}

async.series([
    reset_datadir(),
    check_connection(spawn_geth(geth_flags), accounts[0], upload_contracts),
    preupload_tests()
]);
