#!/usr/bin/env node

global.fs = require("fs");
global.chalk = require("chalk");
global.keythereum = require("keythereum");
global.constants = require("./src/constants");
global.Augur = require("./src");

global.augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNode = {
  // http: "http://rinkeby.augur.net:8545",
  // ws: "ws://rinkeby.augur.net:8546"
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
const augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  console.log(chalk.cyan("Network"), chalk.green(augur.rpc.getNetworkID()));
  const networkID = augur.rpc.getNetworkID();
  // console.log({
  //   universe: augur.contracts.addresses[networkID].Universe,
  //   _endTime: parseInt(Date.now() / 1000, 10) + 180, // end in 3 minutes
  //   _feePerEthInWei: "100",
  //   _denominationToken: augur.contracts.addresses[networkID].Cash,
  //   _designatedReporterAddress: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
  //   _topic: "navel-gazing",
  //   _extraInfo: {
  //     marketType: "categorical",
  //     shortDescription: "Will this market be the One Market?",
  //     longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
  //     outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
  //     tags: ["Ancient evil", "Large flaming eyes"],
  //     creationTimestamp: parseInt(Date.now() / 1000, 10),
  //   },
  //   meta: {
  //     signer: keythereum.recover(fs.readFileSync("/home/jack/.rinkeby/.password").toString("utf8"), JSON.parse(fs.readFileSync("/home/jack/.rinkeby/keystore/UTC--2016-01-08T09-32-12.068Z--05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"))),
  //     accountType: "privateKey",
  //   }
  // });
  // augur.createMarket.createBinaryMarket({
  //   universe: augur.contracts.addresses[networkID].Universe,
  //   _endTime: parseInt(Date.now() / 1000, 10) + 180, // end in 3 minutes
  //   _feePerEthInWei: "100",
  //   _denominationToken: augur.contracts.addresses[networkID].Cash,
  //   _designatedReporterAddress: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
  //   _topic: "navel-gazing",
  //   _extraInfo: {
  //     marketType: "categorical",
  //     shortDescription: "Will this market be the One Market?",
  //     longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
  //     outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
  //     tags: ["Ancient evil", "Large flaming eyes"],
  //     creationTimestamp: parseInt(Date.now() / 1000, 10),
  //   },
  //   meta: {
  //     signer: keythereum.recover(fs.readFileSync("/home/jack/.rinkeby/.password").toString("utf8"), JSON.parse(fs.readFileSync("/home/jack/.rinkeby/keystore/UTC--2016-01-08T09-32-12.068Z--05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"))),
  //     accountType: "privateKey",
  //   },
  //   onSent: res => console.log("sent!", res),
  //   onSuccess: res => console.log("success:", res),
  //   onFailed: err => console.error("error:", err),
  // });

  // augur.api.Universe.getCurrentReportingWindow({ tx: { to: "0xc127ad8fb3418a78f47c4bc74c7a5d952e1f8c61" } }, (err, currentReportingWindow) => {
  //   if (err) return console.error(err);
  //   augur.api.ReportingWindow.
  // });
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
