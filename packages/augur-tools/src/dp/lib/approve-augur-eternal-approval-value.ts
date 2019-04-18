import BigNumber from "bignumber.js";

function approveAugurEternalApprovalValue(augur, address, auth, callback) {
  let augurContract = augur.contracts.addresses[augur.rpc.getNetworkID()].Augur;
  augur.api.Cash.allowance({ _owner: address, _spender: augurContract }, function(err:Error, allowance) {
    if (err) return callback(err);
    if (new BigNumber(allowance, 10).eq(new BigNumber(augur.constants.ETERNAL_APPROVAL_VALUE, 16))) {
      console.log("Already Approved");
      return callback(null);
    }
    augur.api.Cash.approve({
      meta: auth,
      _spender: augurContract,
      _amount: augur.constants.ETERNAL_APPROVAL_VALUE,
      onSent: function() {
      },
      onSuccess: function(res) {
        console.log("Augur.approve success:", address, res.callReturn, res.hash);
        callback(null);
      },
      onFailed: function(err) {
        console.error("Augur.approve failed:", address, err);
        callback(err);
      }
    });
  });
}

export default approveAugurEternalApprovalValue;
