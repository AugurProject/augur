#!/usr/bin/env node

global.chalk = require("chalk");
global.constants = require("./src/constants");
global.Augur = require("./src");

global.augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546"
};
const augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  console.log(chalk.cyan("Network"), chalk.green(augur.rpc.getNetworkID()));
  // const account = augur.rpc.getCoinbase();
  // augur.api.Cash.balanceOf({ address: account }, (err, cashBalance) => {
  //   augur.api.Reporting.getRepBalance({ branch: global.branch, address: account }, (err, repBalance) => {
  //     augur.rpc.eth.getBalance([account, "latest"], (ethBalance) => {
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
