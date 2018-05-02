#!/usr/bin/env node

var events = require("./src/events");
var getBalances = require("./scripts/dp/lib/get-balances");
global.chalk = require("chalk");
global.speedomatic = require("speedomatic");
global.Augur = require("./src");

global.augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const nodes = {
  rinkeby: {
    http: "https://rinkeby.ethereum.nodes.augur.net",
    ws: "wss://websocket-rinkeby.ethereum.nodes.augur.net",
  },
  local: {
    http: "http://127.0.0.1:8545",
    ws: "ws://127.0.0.1:8546",
    ipc: process.env.GETH_IPC,
  }
};

const ethereumNode = nodes.local;
const augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  global.networkId = augur.rpc.getNetworkID();
  global.universe = augur.contracts.addresses[networkId].Universe;
  console.log(chalk.cyan("Network"), chalk.green(networkId));
  const account = augur.rpc.getCoinbase();
  if (account != null) {
    console.log(chalk.cyan("Account"), chalk.green(account));
    getBalances(augur, universe, account, function (err, balances) {
      if (err) return console.error("getBalances failed:", err);
      console.log(chalk.cyan("Balances:"));
      console.log("Ether:      " + chalk.green(balances.ether));
      console.log("Reputation: " + chalk.green(balances.reputation));
    });
  }
});

events.nodes.augur.on("disconnect", function() {
  console.log("Augur Node Disconnected");
});
events.nodes.augur.on("reconnect", function() {
  console.log("Augur Node Resconnected");
});
events.nodes.ethereum.on("disconnect", function() {
  console.log("Ethereum Node Disconnected");
});
events.nodes.ethereum.on("reconnect", function() {
  console.log("Ethereum Node Reconnected");
});
