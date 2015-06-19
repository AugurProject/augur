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

var DEBUG = false;
// var DATADIR = path.join(process.env.HOME, ".augur");
var DATADIR = path.join(process.env.HOME, ".augur-test");
var AUGUR_CORE = path.join(process.env.HOME, "src", "augur-core");
var UPLOADER = path.join(AUGUR_CORE, "load_contracts.py");
var GOSPEL = "gospel.json";
var CUSTOM_GOSPEL = false;
var NETWORK_ID = "10101";
var PROTOCOL_VERSION = "59";
var MINIMUM_ETHER = 30;
var LOG = "geth.log";

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
var gospel_json = path.join(__dirname, GOSPEL);
var check_connection;
var mocha = new Mocha();

log("Create", chalk.magenta("geth"), "log file:", chalk.green(path.join(__dirname, LOG)));
var geth_log = fs.createWriteStream(path.join(__dirname, LOG), {flags : 'w'});

function wait(seconds) {
    var start, delay;
    start = new Date();
    delay = seconds * 1000;
    while ((new Date()) - start <= delay) {}
    return true;
}

function preupload_tests(geth, account) {
    mocha.addFile(path.join(__dirname, "test_fixedpoint.js"));
    mocha.addFile(path.join(__dirname, "test_encoder.js"));
    mocha.run(function (failures) {
        process.on("exit", function () {
            process.exit(failures);
        });
        upload_contracts(geth, account);
    });
}

function check_connection(geth, account, callback, next) {
    if (CUSTOM_GOSPEL) {
        log("Reading contracts from " + chalk.magenta(gospel_json));
        Augur.contracts = JSON.parse(fs.readFileSync(gospel_json));
    }
    wait(3);
    if (Augur.connect()) {
        var balance = Augur.balance(account);
        if (balance && !balance.error) {
            balance = Augur.bignum(balance).dividedBy(Augur.ETHER).toFixed();
            log("Connected on account", chalk.green(account));
            log(chalk.green(Augur.blockNumber()), chalk.gray("blocks"));
            log("Balance:", chalk.green(balance), chalk.gray("ETH"));
            callback(geth, account, next);
        } else {
            check_connection(geth, account, callback, next);
        }
    } else {
        check_connection(geth, account, callback, next);
    }
}

function kill_geth(geth) {
    log("Shut down " + chalk.magenta("geth") + "...");
    geth.kill();
}

function postupload_tests() {
    mocha.addFile(path.join(__dirname, "test_ethrpc.js"));
    mocha.addFile(path.join(__dirname, "test_invoke.js"));
    mocha.addFile(path.join(__dirname, "test_reporting.js"));
    mocha.addFile(path.join(__dirname, "test_batch.js"));
    // mocha.addFile(path.join(__dirname, "test_expiring.js"));
    // mocha.addFile(path.join(__dirname, "test_augur.js"));
    mocha.addFile(path.join(__dirname, "test_createEvent.js"));
    // mocha.addFile(path.join(__dirname, "test_addEvent.js"));
    mocha.addFile(path.join(__dirname, "test_createMarket.js"));
    mocha.addFile(path.join(__dirname, "test_buyAndSellShares.js"));
    mocha.addFile(path.join(__dirname, "fastforward.js"));
    mocha.addFile(path.join(__dirname, "test_ballot.js"));
    mocha.addFile(path.join(__dirname, "test_interpolate.js"));
    mocha.addFile(path.join(__dirname, "test_consensus.js"));
    mocha.addFile(path.join(__dirname, "test_score.js"));
    mocha.addFile(path.join(__dirname, "test_resolve.js"));
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
    geth.stdout.on("data", function (data) {
        geth_log.write("stdout: " + util.format(data.toString()) + "\n");
    });
    geth.stderr.on("data", function (data) {
        geth_log.write(util.format(data.toString()) + "\n");
    });
    geth.on("close", function (code) {
        log(chalk.red.bold("geth closed with code " + code));
        geth.kill();
        if (code === 1) {
            wait(5);
            log("Restarting", chalk.magenta("geth") + "...");
            return spawn_geth(flags);
        }
    });
    return geth;
}

function faucets(geth, next) {
    var cash_balance = Augur.getCashBalance(Augur.coinbase);
    var rep_balance = Augur.getRepBalance(Augur.branches.dev, Augur.coinbase);
    var ether_balance = Augur.bignum(Augur.balance(Augur.coinbase)).dividedBy(Augur.ETHER).toFixed();
    log(chalk.cyan("Balances:"));
    log("Cash:       " + chalk.green(cash_balance));
    log("Reputation: " + chalk.green(rep_balance));
    log("Ether:      " + chalk.green(ether_balance));
    mocha.addFile(path.join(__dirname, "test_faucets.js"));
    mocha.run(function (failures) {
        process.on("exit", function () {
            process.exit(failures);
            var cash_balance = Augur.getCashBalance(Augur.coinbase);
            var rep_balance = Augur.getRepBalance(Augur.branches.dev, Augur.coinbase);
            var ether_balance = Augur.bignum(Augur.balance(Augur.coinbase)).dividedBy(Augur.ETHER).toFixed();
            log(chalk.cyan("Balances:"));
            log("Cash:       " + chalk.green(cash_balance));
            log("Reputation: " + chalk.green(rep_balance));
            log("Ether:      " + chalk.green(ether_balance));
            kill_geth(geth);
            next(geth_flags);
        });
    });
}

function next_account() {
    log(chalk.blue.bold("Next account..."));
    check_connection(
        spawn_geth(geth_flags),
        accounts[2],
        faucets,
        postupload_tests
    );
}

function mine_minimum_ether(geth, account, next) {
    var balance = Augur.bignum(Augur.balance(account)).dividedBy(Augur.ETHER).toNumber();
    if (balance < MINIMUM_ETHER) {
        if (balance > 0) {
            log("Balance: " + chalk.green(balance) + chalk.gray(" ETH, waiting for ") +
                chalk.green(MINIMUM_ETHER) + chalk.gray("..."));
        }
        wait(5);
        mine_minimum_ether(geth, account, next);
    } else {
        next(geth, account);
    }
}

function upload_contracts(geth, account) {
    log(chalk.red.bold("Upload contracts to test chain..."));
    var uploader = cp.spawn(UPLOADER, ["--BLOCKTIME=2"]);
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
            log("Write contract addresses to " + chalk.magenta(gospel_json) + "...");
            fs.writeFileSync(gospel_json, stdout.toString());
            kill_geth(geth);
            geth_flags[1] = accounts[1];
            geth_flags[3] = accounts[1];
            setTimeout(function () {
                check_connection(
                    spawn_geth(geth_flags),
                    accounts[1],
                    mine_minimum_ether,
                    faucets
                );
            }, 10000);
        });
    });
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
    check_connection(
        spawn_geth(geth_flags),
        accounts[0],
        mine_minimum_ether,
        preupload_tests
    )
]);
