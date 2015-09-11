var _ = require('lodash');
var abi = require('augur-abi');
var augurContracts = require('augur-contracts');
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
}

// TODO: migrate off default
EthereumClient.prototype.setDefaultBranch = function (branchId) {
  this.defaultBranchId = branchId;
};

EthereumClient.prototype.connect = function () {
  augur.connect(this.host);
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
        this.currentAccount = accounts[0];
      } else {
        this.currentAccount = accounts;
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

EthereumClient.prototype.repFaucet = function (branchId, onSent) {
  return augur.reputationFaucet(branchId || this.defaultBranchId, onSent);
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
        log(self.currentAccount, 'sent', amount, 'ether to', destination);
        log("txhash:", result.txHash);
      }
    }
  });
};

EthereumClient.prototype.getEvents = function (period, branchId) {

  if (!period) return;
  branchId = branchId || this.defaultBranchId;

  var validEvents = _.filter(augur.getEvents(branchId, period), function (eventId) {
    //log('"'+eventId.toString(16)+'",');  
    return !_.contains(blacklist.events, eventId.toString(16));
  });

  return validEvents;
};

EthereumClient.prototype.checkQuorum = function (branchId, onSent, onSuccess, onFailed) {
  if (!branchId) return;

  augur.dispatch(branchId, function (result) {

    if (result) {
      if (result.callReturn) {
        result.step = result.callReturn;
        delete result.callReturn;
      }
      if (result && result.message && result.error) {
        utilities.error(result.message);
        if (typeof(result.txHash == 'Object')) {
          console.error(result.txHash.message);
        }
      }
      if (onSent) onSent(result.txHash);
    }

  }, function (result) {

    if (result && result.callReturn) {
      result.step = result.callReturn;
      delete result.callReturn;
    }
    console.log('dispatch succeeded');
    if (onSuccess) onSuccess();

  }, function (error) {
    utilities.error(error);
    if (onFailed) onFailed(error);
  });
};

EthereumClient.prototype.getMarkets = function (branchId, currentMarkets) {
  branchId = branchId || this.defaultBranchId;
  var validMarkets = _.filter(augur.getMarkets(branchId), function (marketId) {
    return !_.contains(blacklist.markets[augur.network_id][branchId], marketId.toString(16));
  }, this);

  if (currentMarkets) {    // return new markets o
    // convert ids to strings for comparision
    validMarkets = _.map(validMarkets, function(marketId) { return marketId.toString() } );
    currentMarkets = _.map(currentMarkets, function(marketId) { return marketId.toString() } );
    var newMarkets = _.difference(validMarkets, currentMarkets);

    return newMarkets;

  } else {

    return validMarkets;
  }
};

EthereumClient.prototype.addEvent = function (params, onSuccess) {
    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    augur.createEvent({
      branchId: branchId,
      description: description,
      expDate: expirationBlock,
      minValue: minValue,
      maxValue: maxValue,
      numOutcomes: numOutcomes,
      onSent: function (newEvent) {
        if (newEvent && newEvent.callReturn) {
          newEvent.id = newEvent.callReturn;
          delete newEvent.callReturn;
          utilities.debug("submitted new event: " + newEvent.id.toString(16));
        }
      },
      onSuccess: function (newEvent) {
        if (newEvent) {
          if (newEvent.callReturn) {
            newEvent.id = newEvent.callReturn;
            delete newEvent.callReturn;
          }
          if (newEvent.txHash) {
            utilities.debug("txHash: " + newEvent.txHash);
            augur.rpc.getTx(newEvent.txHash);
          }
          if (onSuccess) onSuccess(newEvent);
        }
      },
      onFailed: function (r) {
        log("createEvent failed:", r);
      }
    });
};

EthereumClient.prototype.addMarket = function (params, onSent) {
    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var alpha = "0.0079";
    var initialLiquidity = params.initialLiquidity;
    var tradingFee = params.tradingFee;
    var events = params.events;  // a list of event ids

    augur.createMarket({
      branchId: branchId,
      description: description,
      alpha: alpha,
      initialLiquidity: initialLiquidity,
      tradingFee: tradingFee.toFixed(),
      events: events,
      onSent: function (newMarket) {
        onSent(newMarket.txHash);
      },
      onSuccess: function (r) {
        log("createMarket successful:", r);
      },
      onFailed: function (r) {
        log("createMarket failed:", r);
      }
    });
};

EthereumClient.prototype.closeMarket = function (marketId, branchId) {
  try {
    marketId = abi.bignum(marketId).toFixed();
  } catch (e) {
    marketId = abi.prefix_hex(marketId);
  }
  try {
    branchId = abi.bignum(branchId).toFixed();
  } catch (e) {
    branchId = abi.prefix_hex(branchId);
  }
  log("Closing market", marketId, "on branch", branchId);
  augur.closeMarket({
    branchId: branchId,
    marketId: marketId,
    onSent: function (txHash) { log("Close market sent:", txHash); },
    onSuccess: function (res) { log("Close market succeeded:", res); },
    onFailed: function (err) { log("Close market failed:", err); }
  });
};

var getSimulationArgs = function (marketId, outcomeId, numShares, callback) {
  var wrappedCallback = function (result) {
    // Pass the callback the result with its values converted from fixed point
    // and assigned to keys.
    callback({ cost: result[0], newPrice: result[1] });
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
