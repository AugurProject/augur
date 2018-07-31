#!/usr/bin/env node

global.BigNumber = require("bignumber.js");
global.chalk = require("chalk");
global.speedomatic = require("speedomatic");
global.Augur = require("./src");
global.getBalances = require("./scripts/dp/lib/get-balances");
var events = require("./src/events");

global.augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNodes = {
  rinkeby: {
    http: "https://rinkeby.ethereum.nodes.augur.net",
    ws: "wss://websocket-rinkeby.ethereum.nodes.augur.net",
  },
  local: {
    http: process.env.ETHEREUM_HTTP || "http://127.0.0.1:8545",
    ws: process.env.ETHEREUM_WS || "ws://127.0.0.1:8546",
    ipc: process.env.ETHEREUM_IPC,
  }
};

augur.connect({ ethereumNode: ethereumNodes.local, augurNode: "ws://127.0.0.1:9001" }, function (err, connectionInfo) {
  if (err) return console.error(err);
  augur.events.startBlockListeners({
    onAdded: function (block) {
      // console.log("Block added:", parseInt(block.number, 16), block.hash);
    },
    onRemoved: function (block) {
      // console.log("Block removed:", parseInt(block.number, 16), block.hash);
    },
  });
  global.networkId = augur.rpc.getNetworkID();
  global.universe = augur.contracts.addresses[networkId].Universe;
  console.log(chalk.cyan("Network"), chalk.green(networkId));
  const coinbaseAddress = augur.rpc.getCoinbase();
  if (coinbaseAddress != null) {
    console.log(chalk.cyan("Account"), chalk.green(coinbaseAddress));
    getBalances(augur, universe, coinbaseAddress, function (err, balances) {
      if (err) return console.error("getBalances failed:", err);
      console.log(chalk.cyan("Balances:"));
      console.log("Ether:      " + chalk.green(balances.ether));
      console.log("Reputation: " + chalk.green(balances.reputation));
    });
  }
});

events.nodes.augur.on("disconnect", function (err) {
  console.log("Augur Node Disconnected");
  if (err) console.error(err);
});
events.nodes.augur.on("reconnect", function () {
  console.log("Augur Node Reconnected");
});
events.nodes.ethereum.on("disconnect", function (err) {
  console.log("Ethereum Node Disconnected");
  if (err) console.error(err);
});
events.nodes.ethereum.on("reconnect", function () {
  console.log("Ethereum Node Reconnected");
});
