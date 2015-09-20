var _ = require('lodash');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

/**
 * augur is implemented as several Ethereum contracts, mainly due to size
 * limitations. EthereumClient wraps the calls to those contracts to abstract
 * the contract details from the rest of the codebase.
 */
function EthereumClient(params) {
  params = params || {};
  this.accounts = null;
  this.currentAccount = null;
  this.defaultBranchId = params.defaultBranchId;
  this.host = params.host;

  // basically set rpc host in augur.js here
  this.connect();
}

// TODO: migrate off default
EthereumClient.prototype.setDefaultBranch = function (branchId) {
  this.defaultBranchId = branchId;
};

EthereumClient.prototype.connect = function () {

  try {
    augur.connect(this.host);
    utilities.log('rpc host: ' + this.host);
  } catch (err) {
    console.log(err);
  }
};

EthereumClient.prototype.batch = function (commands) {

  var batch = augur.createBatch();

  _.each(commands, function (command) {
    batch.add(command[0], command[1], command[2]);
  });

  batch.execute();
};

EthereumClient.prototype.getAccounts = function (onResult) {
  var self = this;
  if (this.accounts) return this.accounts;
  if (onResult && onResult.constructor === Function) {
    augur.rpc.accounts(function (accounts) {
      if (accounts.error) return utilities.error(accounts);
      self.accounts = accounts;
      if (accounts && accounts.constructor === Array) {
        self.currentAccount = accounts[0];
      } else {
        self.currentAccount = accounts;
      }
      if (onResult) onResult(accounts);
    });
  } else {
    var accounts = augur.rpc.accounts();
    if (accounts && accounts.constructor === Array) {
      this.currentAccount = accounts[0];
    } else {
      this.currentAccount = accounts;
    }
    return accounts;
  }
};

EthereumClient.prototype.getAccountSync = function () {

  // if signed in, then use the signed-in account
  if (augur.web.account.address) {
    this.currentAccount = augur.web.account.address;

  // otherwise, use the coinbase
  } else {
    if (this.currentAccount) return this.currentAccount;
    this.currentAccount = augur.coinbase;
    if (!this.currentAccount) this.currentAccount = augur.coinbase;
  }

  // check if this is the demo account
  if (this.currentAccount === augur.demo) {
    this.isDemoAccount = true;
  } else {
    this.isDemoAccount = false;
  }

  return this.currentAccount;
};

EthereumClient.prototype.getAccount = function (onResult, onError) {

  // async version doesn't exist, so simulate using Sync for now
  var result = this.getAccountSync();

  if (augur.utils.is_function(onResult)) {
    if (result) {
        onResult(result);
    } else if (onError) {
        onError();
    }
  } else {
    return result
  }
};

EthereumClient.prototype.sendRep = function (destination, amount, branchId) {
  return augur.sendReputation({
    branchId: branchId || this.defaultBranchId,
    to: destination,
    value: amount,
    onSent: function (result) {
      console.log('sending '+amount+' rep to '+ destination);
    },
    onSuccess: function (result) {
      console.log('rep sent successfully');
    },
    onFailed: function (error) {
      utilities.error('failed to send rep: ' + error);
    }
  });
};

EthereumClient.prototype.sendEther = function (destination, amount) {
  var self = this;
  augur.rpc.sendEther({
    to: destination,
    value: amount,
    from: this.getAccount(),
    onSent: function (result) {
      if (result && result.error) return utilities.error(result);
    },
    onSuccess: function (result) {
      if (result) {
        if (result.error) return utilities.error(result);
        console.log(self.currentAccount, 'sent', amount, 'ether to', destination);
        console.log("txhash:", result.txHash);
      }
    },
    onFailed: function (result) {
      utilities.error("sendEther failed:", result);
    }
  });
};

var getSimulationArgs = function (marketId, outcomeId, numShares, callback) {
  var wrappedCallback = function (result) {
    // Pass the callback the result with its values converted from fixed point
    // and assigned to keys.
    callback({ cost: abi.bignum(result[0]), newPrice: abi.bignum(result[1]) });
  };
  return [ marketId, outcomeId, numShares, wrappedCallback ];
};

EthereumClient.prototype.getSimulatedBuy = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  augur.getSimulatedBuy.apply(augur, args);
};

EthereumClient.prototype.getSimulatedSell = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  augur.getSimulatedSell.apply(augur, args);
};

module.exports = EthereumClient;
