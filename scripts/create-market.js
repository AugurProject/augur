#!/usr/bin/env node

const BigNumber = require("bignumber.js");
const speedomatic = require("speedomatic");
const Augur = require("../src");

const augur = new Augur();

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

const ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
const augurNode = "ws://127.0.0.1:9001";

function createTestBinaryMarket(universe, callback) {
  augur.createMarket.createBinaryMarket({
    universe,
    _endTime: parseInt(Date.now() / 1000, 10) + 180, // 3 minutes from now
    _feePerEthInWei: "0x123445",
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    _topic: "navel-gazing",
    _extraInfo: {
      marketType: "categorical",
      description: "Will this market be the One Market?",
      longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
      outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
      tags: ["Ancient evil", "Large flaming eyes"],
    },
    onSent: res => console.log("createBinaryMarket sent:", res.hash),
    onSuccess: (res) => {
      console.log("createBinaryMarket success:", res.callReturn);
      callback(null);
    },
    onFailed: callback,
  });
}

function faucetInAndMigrate(universe, callback) {
  augur.api.LegacyReputationToken.faucet({
    _amount: speedomatic.fix(47, "hex"),
    onSent: res => console.log("faucet sent:", res.hash),
    onSuccess: (res) => {
      console.log("faucet success:", res.callReturn);
      augur.api.Universe.getReputationToken({ tx: { to: universe } }, (err, reputationToken) => {
        if (err) return callback(err);
        console.log("reputationToken:", reputationToken);
        augur.api.LegacyReputationToken.approve({
          _spender: reputationToken,
          _value: speedomatic.prefixHex(new BigNumber(2, 10).toPower(255).minus(1).toString(16)),
          onSent: res => console.log("approve sent:", res.hash),
          onSuccess: (res) => {
            console.log("approve success:", res.callReturn);
            augur.api.ReputationToken.migrateFromLegacyReputationToken({
              tx: { to: reputationToken },
              onSent: res => console.log("migrateFromLegacyReputationToken sent:", res.hash),
              onSuccess: (res) => {
                console.log("migrateFromLegacyReputationToken success:", res.callReturn);
                callback(null);
              },
              onFailed: callback,
            });
          },
          onFailed: callback,
        });
      });
    },
    onFailed: callback,
  });
}

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  console.log("networkID:", augur.rpc.getNetworkID());
  const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log("universe:", universe);
  faucetInAndMigrate(universe, function (err) {
    if (err) return console.error("faucetInAndMigrate failed:", err);
    createTestBinaryMarket(universe, function (err) {
      if (err) console.error("createTestBinaryMarket failed:", err);
      process.exit();
    });
  });
});
