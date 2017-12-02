#!/usr/bin/env node

const Augur = require("../src");

const augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
const augurNode = "ws://127.0.0.1:9001";

function createTestMarket(universe, callback) {
  augur.createMarket.createCategoricalMarket({
    universe,
    _description: "Will this market be the One Market?",
    _numOutcomes: 3,
    _endTime: parseInt(Date.now() / 1000, 10) + 180, // 3 minutes from now
    _feePerEthInWei: "0x123445",
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: augur.rpc.getCoinbase(),
    _topic: "navel-gazing",
    _extraInfo: {
      longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
      outcomeNames: ["Yes", "No", "Party at Ground Zero"],
      tags: ["Sauron", "Roflcopters"],
    },
    onSent: res => console.log("createCategoricalMarket sent:", res.hash),
    onSuccess: (res) => {
      console.log("createCategoricalMarket success:", res.callReturn);
      callback(null);
    },
    onFailed: callback,
  });
}

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  console.log("networkID:", augur.rpc.getNetworkID());
  const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log("universe:", universe);
  createTestMarket(universe, function (err) {
    if (err) console.error("createTestMarket failed:", err);
    process.exit();
  });
});
