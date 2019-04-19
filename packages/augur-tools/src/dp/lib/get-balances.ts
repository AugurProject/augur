import speedomatic from "speedomatic";

function getBalances(augur, universe, address, callback) {
  augur.api.Universe.getReputationToken({ tx: { to: universe } }, function(err, reputationTokenAddress) {
    if (err) return callback(err);
    augur.api.ReputationToken.balanceOf({
      tx: { to: reputationTokenAddress },
      _tokenHolder: address
    }, function(err, reputationBalance) {
      if (err) return callback(err);
      augur.rpc.eth.getBalance([address, "latest"], function(err, etherBalance) {
        if (err) return callback(err);
        if (etherBalance == null) return callback(new Error("rpc.eth.getBalance failed"));
        return callback(null, {
          reputation: speedomatic.unfix(reputationBalance, "string"),
          ether: speedomatic.unfix(etherBalance, "string")
        });
      });
    });
  });
}

export default getBalances;
