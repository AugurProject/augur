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
    process.exit();
  });
});
