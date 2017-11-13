#!/usr/bin/env node

global.chalk = require("chalk");
global.speedomatic = require("speedomatic");
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
  const networkID = augur.rpc.getNetworkID();
  console.log(chalk.cyan("Network"), chalk.green(networkID));
  const account = augur.rpc.getCoinbase();
  augur.api.Universe.getReputationToken({ tx: { to: augur.contracts.addresses[networkID].Universe } }, (err, reputationToken) => {
    if (err) return console.error("getReputationToken failed:", err);
    augur.api.ReputationToken.balanceOf({
      tx: { to: reputationToken },
      _owner: account,
    }, (err, reputationBalance) => {
      if (err) return console.error("ReputationToken.balanceOf failed:", err);
      augur.rpc.eth.getBalance([account, "latest"], (etherBalance) => {
        if (!etherBalance || etherBalance.error) return console.error("rpc.eth.getBalance failed:", etherBalance);
        global.balances = { reputation: speedomatic.unfix(reputationBalance, "string"), ether: speedomatic.unfix(etherBalance, "string") };
        console.log(chalk.cyan("Balances:"));
        console.log("Ether:      " + chalk.green(balances.ether));
        console.log("Reputation: " + chalk.green(balances.reputation));
      });
    });
  });
});
