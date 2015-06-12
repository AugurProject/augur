#!/usr/bin/env node

var fs    = require("fs");
var path  = require("path");
var child_process = require("child_process");
var Mocha = require("mocha");
var Augur = require("../augur");

old_spawn = child_process.spawn;
function my_spawn() {
    console.log('spawn called');
    console.log(arguments);
    var result = old_spawn.apply(this, arguments);
    return result;
}
child_process.spawn = my_spawn;

var datadir = path.join(process.env.HOME, ".augur-test");
var augurcore = path.join(process.env.HOME, "src", "augur-core");
var accounts = [
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c",
    "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
];
var enodes = [
    "enode://035b7845dfa0c0980112abdfdf4dc11087f56b77e10d2831f186ca12bc00f5b9327c427d03d9cd8106db01488905fb2200b5706f9e41c5d75885057691d9997c@[::]:30303"
].join(' ');
var network_id = "10101";
var protocol_version = "71";

var log = console.log;

// var mocha = new Mocha({ ui: "tdd" });
var mocha = new Mocha;

log("Reset Augur test chain...");
child_process.exec(path.join(datadir, "reset"), function (err) {
    if (err) throw err;

    log("Spawn geth on network " + network_id + " (version " + protocol_version + ")...");
    var geth = child_process.spawn("geth", [
        "--mine",
        "--rpc",
        "--rpccorsdomain", "http://localhost:8080",
        "--shh",
        "--maxpeers", "64",
        "--networkid", network_id,
        "--datadir", datadir,
        "--protocolversion", protocol_version,
        "--bootnodes", enodes,
        "--etherbase", accounts[0],
        "--password", datadir + "/.password"
    ]);

    var balance = Augur.bignum(Augur.balance()).dividedBy(Augur.ETHER).toFixed();
    log("Balance:", balance);
    geth.kill();
});

// mocha.addFile(
//     path.join(__dirname, "test_connect.js")
// );

// mocha.run(function (failures) {
//     process.on("exit", function () {
//         process.exit(failures);
//     });
// });
