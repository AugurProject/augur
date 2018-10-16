"use strict";

var async = require("async");
var debugOptions = require("../../debug-options");
var noop = require("../../../src/utils/noop");

function fundAccounts(augur, accountsToFund, etherFundingPerAccount, auth, callback) {
  async.each(accountsToFund, function (accountToFund, nextAccountToFund) {
    if (debugOptions.cannedMarkets) console.log("Funding account", accountToFund, "with", etherFundingPerAccount, "ETH");
    augur.assets.sendEther({
      meta: auth,
      etherToSend: etherFundingPerAccount,
      from: auth.address,
      to: accountToFund,
      onSent: noop,
      onSuccess: function () { nextAccountToFund(); },
      onFailed: nextAccountToFund,
    });
  }, callback);
}

module.exports = fundAccounts;
