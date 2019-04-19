import async from "async";
import debugOptions from "../../debug-options";

function fundAccounts(
  augur,
  accountsToFund,
  etherFundingPerAccount,
  auth,
  callback
) {
  async.each(
    accountsToFund,
    function(accountToFund, nextAccountToFund) {
      if (debugOptions.cannedMarkets)
        console.log(
          "Funding account",
          accountToFund,
          "with",
          etherFundingPerAccount,
          "ETH"
        );
      augur.assets.sendEther({
        meta: auth,
        etherToSend: etherFundingPerAccount,
        from: auth.address,
        to: accountToFund,
        onSent: () => {
        },
        onSuccess: function() {
          nextAccountToFund();
        },
        onFailed: nextAccountToFund
      });
    },
    callback
  );
}

export default fundAccounts;
