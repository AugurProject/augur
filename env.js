#!/usr/bin/env node

global.BigNumber = require("bignumber.js");
global.speedomatic = require("speedomatic");
global.chalk = require("chalk");
global.constants = require("./src/constants");
global.Augur = require("./src");
(global.reload = function () {
  global.branch = constants.DEFAULT_BRANCH_ID;
  global.augur = new Augur();
  augur.rpc.setDebugOptions({ connect: true, broadcast: false });
  augur.connect({
    http: "http://127.0.0.1:8545",
    ws: "ws://127.0.0.1:8546"
  }, function (vitals) {
    global.log = console.log;
    global.rpc = vitals.rpc;
    console.log(chalk.cyan("Network"), chalk.green(rpc.getNetworkID()));
    var account = augur.rpc.getCoinbase();
    // augur.api.Cash.balanceOf({ address: account }, function (cashBalance) {
    //   augur.api.Reporting.getRepBalance({ branch: global.branch, address: account }, function (repBalance) {
    //     augur.rpc.eth.getBalance([account, "latest"], function (ethBalance) {
    //       global.balances = {
    //         cash: cashBalance,
    //         reputation: repBalance,
    //         ether: speedomatic.unfix(ethBalance, "string")
    //       };
    //       console.log(chalk.cyan("Balances:"));
    //       console.log("Cash:       " + chalk.green(balances.cash));
    //       console.log("Reputation: " + chalk.green(balances.reputation));
    //       console.log("Ether:      " + chalk.green(balances.ether));
    //     });
    //   });
    // });
  });
})();
