#!/usr/bin/env node
/**
 * automated tests for augur.js
 */
var fs    = require("fs");
var path  = require("path");
var cp = require("child_process");
var rm = require("rimraf");
var chalk = require("chalk");
var Mocha = require("mocha");
var Augur = require("../augur");

var log = console.log;

var DEBUG = false;
var DATADIR = path.join(process.env.HOME, ".augur");
var AUGURCORE = path.join(process.env.HOME, "src", "augur-core");

var accounts = [
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c",
    "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6"
];
var enodes = [
    "enode://035b7845dfa0c0980112abdfdf4dc11087f56b77e10d2831f186ca12bc00f5b9327c427d03d9cd8106db01488905fb2200b5706f9e41c5d75885057691d9997c@[::]:30303"
].join(' ');
var network_id = "10101";
var protocol_version = "59";
var timers = [];

function clear_timeouts(t) {
    for (var j = 0, len = t.length; j < len; ++j) {
        clearTimeout(t[j]);
    }
    return t;
}
function retry(timers, account, callback) {
    timers.push(
        setTimeout(function () { check_connection(account, callback); }, 2500)
    );
    return timers;
}
function check_connection(account, callback) {
    var balance;
    try {
        balance = Augur.balance(account);
        if (balance && !balance.error) {
            balance = Augur.bignum(balance).dividedBy(Augur.ETHER).toFixed();
            log("Connected on account", chalk.green(account));
            // log(" - Balance:", balance, "ETH");
            // log(" - Block", Augur.blockNumber());
            timers = clear_timeouts(timers);
            callback(account);
        } else {
            timers = retry(timers, account, callback);
        }
    } catch (e) {
        timers = retry(timers, account, callback);
    }
}
function upload_contracts(account) {
    var balance = Augur.bignum(Augur.balance(account)).dividedBy(Augur.ETHER).toNumber();
    if (balance < 30) {
        log(chalk.bold("Balance: " + balance + " ETH") + ", waiting for 30...");
        setTimeout(function () { upload_contracts(account); }, 10000);
    } else {
        log("Upload contracts to test chain...");
        var uploader = cp.spawn(
            path.join(AUGURCORE, "load_contracts.py"),
            ["--BLOCKTIME=2"]
        );
        uploader.stdout.on("data", function (data) {
            process.stdout.write(chalk.cyan(data.toString()));
        });
        uploader.stderr.on("data", function (data) {
            console.error(chalk.red.bold(data.toString()));
        });
        uploader.on("close", function (code) {
            log(chalk.green.bold("uploader closed with code " + code));
            geth.kill();
        });
    }
}
var old_spawn = cp.spawn;
cp.spawn = function () {
    if (DEBUG) {
        log(arguments);
    }
    var result = old_spawn.apply(this, arguments);
    return result;
};

// var mocha = new Mocha({ ui: "tdd" });
var mocha = new Mocha;

log("Reset Augur test chain...");
var directories = [ "blockchain", "extra", "nodes", "state" ];
for (var i = 0, len = directories.length; i < len; ++i) {
    rm.sync(path.join(DATADIR, directories[i]));
}
    
log("Spawn geth on network " + network_id + " (version " + protocol_version + ")...");
var geth = cp.spawn("geth", [
    "--mine",
    "--rpc",
    "--rpccorsdomain", "http://localhost:8080",
    "--shh",
    "--maxpeers", "64",
    "--networkid", network_id,
    "--datadir", DATADIR,
    "--protocolversion", protocol_version,
    "--bootnodes", enodes,
    "--etherbase", accounts[0],
    "--unlock", accounts[0],
    "--password", DATADIR + "/.password"
]);

// geth.stdout.on("data", function (data) {
//     if (data.toString().slice(0, 17) === "Unlocking account") {
//         geth.stdin.write("password");
//     }
// });
// geth.stderr.on("data", function (data) {
//     // send to log file
//     log("stderr: " + data);
// });
geth.on("close", function (code) {
    log("geth closed with code " + code);
});

check_connection(accounts[0], upload_contracts);

// mocha.addFile(
//     path.join(__dirname, "test_connect.js")
// );

// mocha.run(function (failures) {
//     process.on("exit", function () {
//         process.exit(failures);
//     });
// });
