var _ = require('lodash');
var Promise = require('es6-promise').Promise;
var moment = require('moment');

var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var fromFixedPoint = utilities.fromFixedPoint;
var toFixedPoint = utilities.toFixedPoint;

var abi = require('augur-abi');
var augurContracts = require('augur-contracts');
var augur = window.augur = require('augur.js');

function MissingContractError(contractName) {
  this.name = 'MissingContractError';
  this.message = contractName;
}

/**
 * augur is implemented as several Ethereum contracts, mainly due to size
 * limitations. EthereumClient wraps the calls to those contracts to abstract
 * the contract details from the rest of the codebase.
 */
function EthereumClient(params) {

  params = params || {};
  this.contractAddress = {};
  this.filters = [];
  this.contracts = augurContracts;
  this.accounts = null;
  this.currentAccount = null;
  this.networkId = null;

  // defaults
  this.defaultBranchId = params.defaultBranchId;
  this.host = params.host || 'localhost:8545';

  _.defaults(this.contractAddress, constants.contractAddress);

  // web3 setup
  this.web3 = window.web3 = params.web3 || require('web3');
  this.web3.setProvider(new web3.providers.HttpProvider('//'+this.host));
}

// TODO: migrate off default
EthereumClient.prototype.setDefaultBranch = function(branchId) {
  this.defaultBranchId = branchId;
};

/**
 * augur.js doesn't connect correctly if the network isn't available at load
 * this method allows the client to init augur.js after web3 has given the go ahead
 */
EthereumClient.prototype.connect = function() {

  // augur.js setup
  augur.connect(this.host);
};

EthereumClient.prototype.register = function (handle, password, callback) {
  if (handle && password) {
    augur.web.register(handle, password, callback);
  }
};

EthereumClient.prototype.signIn = function (handle, password, callback) {
  if (handle && password) {
    augur.web.login(handle, password, callback);
  }
};

EthereumClient.prototype.signOut = function () {
  augur.web.logout();
};

/*
* general filter that fires on every new block, "the network pulse"
* used to trigger general update of assets, netowrk data, etc
*/
EthereumClient.prototype.onNewBlock = function(callback) {

  // add a filter that calls callback on new block
  var filter = web3.eth.filter('latest');

  filter.watch(function (error, blockHash) {
    if (error) utilities.error(error);
    callback(blockHash);
  });

  this.filters.push(filter);
};

/*
* more specific filter that fires on any augur contract addresss and returns transaction info
* used to reconcile pending transactions in the transactions store
*/
EthereumClient.prototype.startFiltering = function (callbacks) {
  augur.filters.start_heartbeat(callbacks);
};

EthereumClient.prototype.stopMonitoring = function() {

  _.each(this.filters, function(filter) {
    filter.stopWatching()
  });
};

EthereumClient.prototype.isAvailable = function() {

  // attempt an RPC call that should fail if the daemon is unreachable.
  try {
    return this.web3.net.listening
  } catch(err) {
    return false;
  }
};

EthereumClient.prototype.batch = function(commands) {

  var batch = augur.createBatch();
  _.each(commands, function(command) {
    batch.add(command[0], command[1], command[2]);
  });

  batch.execute();
};

EthereumClient.prototype.getNetworkId = function (onResult) {
  if (this.networkId === null) {
    this.networkId = augur.rpc.version();
  }
  if (onResult) {
    return onResult(this.networkId);
  }
  return this.networkId;
};

EthereumClient.prototype.getClientVersion = function(onResult) {

  web3.version.getClient(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      onResult(result); 
    }
  })
};

EthereumClient.prototype.getBlock = function(blockNumber, onResult) {

  web3.eth.getBlock(blockNumber, function(error, block) {
    if (error) { 
      utilities.error(error);
    } else { 
      onResult(block); 
    }
  })
};

EthereumClient.prototype.getAccounts = function(onResult) {

  if (this.accounts) return this.accounts;

  if (!onResult) {
    var result = web3.eth.accounts;
    this.currentAccount = result;
    return result;
  }

  web3.eth.getAccounts(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      this.accounts = result;
      onResult(result); 
    }
  }.bind(this));
};

EthereumClient.prototype.getEtherBalance = function(onResult) {

  web3.eth.getBalance(this.getAccount(), function(error, result) {
    onResult(result);
  });
};

EthereumClient.prototype.getAccountSync = function() {

  // if signed in, then use the signed-in account
  if (augur.web.account.address) {
    
    this.currentAccount = augur.web.account.address;

  // otherwise, use the coinbase
  } else {

    if (this.currentAccount)
        return this.currentAccount;

    this.currentAccount = this.web3.eth.coinbase;

    if (!this.currentAccount)
        this.currentAccount = augur.coinbase;
  }

  // check if this is the demo account
  if (this.currentAccount === augur.demo) {
    this.isDemoAccount = true;
  } else {
    this.isDemoAccount = false;
  }

  return this.currentAccount;
};

EthereumClient.prototype.getAccount = function(onResult, onError) {

  // async version doesn't exist, so simulate using Sync for now
  var result = this.getAccountSync();

  //backwards compatibility with calls using this method synchronously
  if (!onResult) return result;

  if (result) {
      onResult(result);
  } else if (onError) {
      onError();
  }
};

EthereumClient.prototype.getBlockNumber = function(callback) {
  web3.eth.getBlockNumber(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getGasPrice = function(callback) {
  web3.eth.getGasPrice(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getMining = function(callback) {
  web3.eth.getMining(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getHashrate = function(callback) {
  web3.eth.getHashrate(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getPeerCount = function(callback) {
  web3.net.getPeerCount(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getAddress = function (name) {

  var address = this.addresses[name];
  if (_.isUndefined(address)) return false;

  return address;
};

EthereumClient.prototype.cashFaucet = function(onSent) {

  augur.cashFaucet(function(result) {
    onSent(result.txHash);
  });
};

EthereumClient.prototype.getCashBalance = function(onResult) {
  this.getAccount(function (account) {
    augur.getCashBalance(account, function(result) {
      if (result) onResult(result);
    });
  });
};

EthereumClient.prototype.sendCash = function(destination, amount, onSent, onSuccess, onFailure) {
  return augur.sendCash(destination, amount, function(result) {
    utilities.log('sending '+amount+' cash to '+ destination);
  }, function(result) {
    utilities.log('cash sent successfully');
  }, function(error) {
    utilities.error('failed to send cash: ' + error);
  });
};

EthereumClient.prototype.repFaucet = function(branchId, onSent) {

  branchId = branchId || this.defaultBranchId;
  augur.reputationFaucet(branchId, function(result) {
    onSent(result.txHash);
  });
};

EthereumClient.prototype.getRepBalance = function (branchId, onResult) {

  augur.getRepBalance(
    branchId || this.defaultBranchId,
    this.getAccount(),
    function (result) {
      if (result) {
        if (result.error) return log("getRepBalance error:", result);
        onResult(result.toNumber());
      }
    }
  );
};

EthereumClient.prototype.sendRep = function(destination, amount, branchId) {
  return augur.sendReputation(branchId || this.defaultBranchId, destination, amount, function(result) {
    utilities.log('sending '+amount+' rep to '+ destination);
  }, function(result) {
    utilities.log('rep sent successfully');
  }, function(error) {
    utilities.error('failed to send rep: ' + error);
  });
};

EthereumClient.prototype.sendEther = function(destination, amount) {

  var amountInWei = this.web3.toWei(amount, 'ether');
  var transaction = {
    from: this.getAccount(),
    to: destination,
    value: amountInWei
  };

  var self = this;
  this.web3.eth.sendTransaction(transaction, function(err, txhash) {
    if (!err) {
      utilities.log(self.currentAccount+' sent ' + amount + ' ether to '+ destination)
    } else {
      utilities.error(err);
    }
  });
};

EthereumClient.prototype.getEventBranch = function(id) {

  return augur.getEventBranch(id);
};

EthereumClient.prototype.getBranches = function(onResult) {

  return augur.getBranches(onResult);
};

EthereumClient.prototype.getPeriodLength = function(branchId, onResult) {

  return augur.getPeriodLength(branchId, function (periodLength) {
    if (periodLength) {
      if (onResult) return onResult(periodLength);
      return periodLength;
    }
  });
};

EthereumClient.prototype.getVotePeriod = function(branchId, onResult) {

  return augur.getVotePeriod(branchId, onResult);
};

EthereumClient.prototype.getEvents = function(period, branchId) {

  if (!period) return;
  branchId = branchId || this.defaultBranchId;

  var validEvents = _.filter(augur.getEvents(branchId, period), function(eventId) {
    //log('"'+eventId.toString(16)+'",');  
    return !_.contains(blacklist.events, eventId.toString(16));
  });

  return validEvents;
};

EthereumClient.prototype.getEventInfo = function(eventId, onResult) {

  augur.getEventInfo(eventId, onResult);
};

EthereumClient.prototype.checkQuorum = function(branchId, onSent, onSuccess, onFailed) {

  if (!branchId) return;
  // utilities.log('calling dispatch');

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
    utilities.log('dispatch succeeded');
    if (onSuccess) onSuccess();

  }, function (error) {
    utilities.error(error);
    if (onFailed) onFailed(error);
  });
};

EthereumClient.prototype.getMarkets = function(branchId, currentMarkets) {

  branchId = branchId || this.defaultBranchId;
  var validMarkets = _.filter(augur.getMarkets(branchId), function (marketId) {
    //log('"'+marketId.toString(16)+'",');  
    return !_.contains(blacklist.markets[this.networkId][branchId], marketId.toString(16));
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

EthereumClient.prototype.getMarketInfo = function(marketId, onResult) {

  return augur.getMarketInfo(marketId, onResult);
};

EthereumClient.prototype.getMarketEvents = function(marketId, onResult) {

  return augur.getMarketEvents(marketId, onResult);
};

EthereumClient.prototype.getDescription = function(id, onResult) {

  return augur.getDescription(id, onResult)
};

EthereumClient.prototype.getAuthor = function(id, onResult) {

  return augur.getCreator(id, onResult);
};

EthereumClient.prototype.getMarketCreationFee = function(marketId, onResult) {

  return augur.getCreationFee(marketId, onResult);
};

EthereumClient.prototype.getMarketTraderCount = function(marketId, onResult) {

  return augur.getCurrentParticipantNumber(marketId, onResult);
};

EthereumClient.prototype.getMarketTradingPeriod  = function(marketId, onResult) {

  return augur.getTradingPeriod(marketId, onResult);
};

EthereumClient.prototype.getMarketTradingFee  = function(marketId, onResult) {

  return augur.getTradingFee(marketId, onResult);
};

EthereumClient.prototype.getMarketTraderId = function(marketId, onResult) {

  return augur.getParticipantNumber(marketId, this.getAccount(), onResult);
};

EthereumClient.prototype.getMarketNumOutcomes = function(marketId, onResult) {

  return augur.getMarketNumOutcomes(marketId, onResult);
};

EthereumClient.prototype.getMarketSharesPurchased = function(marketId, outcomeId, onResult) {

  return augur.getSharesPurchased(marketId, outcomeId, onResult);
};
                    
EthereumClient.prototype.getMarketParticipantSharesPurchased = function(marketId, traderId, outcomeId, onResult) {

  return augur.getParticipantSharesPurchased(marketId, traderId, outcomeId, onResult);
};

EthereumClient.prototype.getMarketWinningOutcomes = function(marketId, onResult) {

  return augur.getWinningOutcomes(marketId, onResult);
};


EthereumClient.prototype.addEvent = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    //log(branchId, description, expirationBlock, minValue, maxValue, numOutcomes);

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

EthereumClient.prototype.addMarket = function(params, onSent) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var alpha = "0.0079";
    var initialLiquidity = params.initialLiquidity;
    var tradingFee = params.tradingFee;
    var events = params.events;  // a list of event ids

    //log(branchId, description, alpha, initialLiquidity, tradingFee, events);

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
  utilities.log("Closing market " + marketId + " on branch " + branchId);
  augur.closeMarket({
    branchId: branchId,
    marketId: marketId,
    onSent: function (txHash) {
      utilities.log("Close market sent: " + JSON.stringify(txHash, null, 2));
    },
    onSuccess: function (res) {
      utilities.log("Close market succeeded:");
      utilities.log(res);
    },
    onFailed: function (err) {
      utilities.log("Close market failed:");
      utilities.log(err);
    }
  });
};

var getSimulationArgs = function (marketId, outcomeId, numShares, callback) {
  var wrappedCallback = function (result) {
    // Pass the callback the result with its values converted from fixed point
    // and assigned to keys.
    callback({
      cost: result[0],
      newPrice: result[1]
    });
  };

  return [
    marketId,
    outcomeId,
    numShares,
    wrappedCallback
  ];
};

EthereumClient.prototype.getSimulatedBuy = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  augur.getSimulatedBuy.apply(augur, args);
};

EthereumClient.prototype.getSimulatedSell = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  augur.getSimulatedSell.apply(augur, args);
};

EthereumClient.prototype.buyShares = function (branchId, marketId, outcomeId, numShares, onSent) {
  augur.buyShares({
    branchId: branchId,
    marketId: marketId,
    outcome: outcomeId,
    amount: numShares,
    nonce: null,
    limit: 0,
    onSent: function (result) {
      onSent(result.txHash);
    }
  });
};

EthereumClient.prototype.sellShares = function (branchId, marketId, outcomeId, numShares, onSent) {
  augur.sellShares({
    branchId: branchId,
    marketId: marketId,
    outcome: outcomeId,
    amount: numShares,
    nonce: null,
    limit: 0,
    onSent: function (result) {
      onSent(result.txHash);
    }
  });
};

module.exports = EthereumClient;
