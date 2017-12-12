#!/usr/bin/env node

global.chalk = require("chalk");
global.speedomatic = require("speedomatic");
global.Augur = require("./src");

global.augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNode = {
  // http: "http://rinkeby.augur.net:8545",
  // ws: "ws://rinkeby.augur.net:8546",
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
const augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  global.networkID = augur.rpc.getNetworkID();
  global.universe = augur.contracts.addresses[networkID].Universe;
  console.log(chalk.cyan("Network"), chalk.green(networkID));
  const account = augur.rpc.getCoinbase();
  if (account != null) {
    console.log(chalk.cyan("Account"), chalk.green(account));
    augur.api.Universe.getReputationToken({ tx: { to: universe } }, (err, reputationTokenAddress) => {
      if (err) return console.error("getReputationToken failed:", err);
      augur.api.ReputationToken.balanceOf({ tx: { to: reputationTokenAddress }, _owner: account }, (err, reputationBalance) => {
        if (err) return console.error("ReputationToken.balanceOf failed:", err);
        augur.rpc.eth.getBalance([account, "latest"], (etherBalance) => {
          if (!etherBalance || etherBalance.error) return console.error("rpc.eth.getBalance failed:", etherBalance);
          const balances = {
            reputation: speedomatic.unfix(reputationBalance, "string"),
            ether: speedomatic.unfix(etherBalance, "string"),
          };
          console.log(chalk.cyan("Balances:"));
          console.log("Ether:      " + chalk.green(balances.ether));
          console.log("Reputation: " + chalk.green(balances.reputation));
        });
      });
    });
  }
});
