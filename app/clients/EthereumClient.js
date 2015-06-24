var _ = require('lodash');
var Promise = require('es6-promise').Promise;
var moment = require('moment');

var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var fromFixedPoint = utilities.fromFixedPoint;
var toFixedPoint = utilities.toFixedPoint;

var Augur = window.Augur = require('augur.js');
Augur.BigNumberOnly = true;

function MissingContractError(contractName) {
  this.name = 'MissingContractError';
  this.message = contractName;
}

/**
 * Augur is implemented as several Ethereum contracts, mainly due to size
 * limitations. EthereumClient wraps the calls to those contracts to abstract
 * the contract details from the rest of the codebase.
 */
function EthereumClient(params) {

  params = params || {};
  this.addresses = {};
  this.filters = {}
  this.contracts = {};

  // defaults
  this.defaultBranchId = params.defaultBranchId;
  this.host = params.host || 'localhost:8545';

  _.defaults(this.addresses, constants.addresses);

  // web3 setup
  this.web3 = window.web3 = params.web3 || require('web3');
  this.web3.setProvider(new web3.providers.HttpProvider('//'+this.host));

  // augur.js setup
  var domain, port;
  [domain, port] = this.host.split(':');
  Augur.connect({ host: domain, port: port || '8545' });
  this.account = Augur.coinbase;
}

/**
 * Get the contract object for the given contract name. If it hasn't been
 * created yet, create and store it.
 *
 * @param name - The name of the contract to get. See abi.js.
 * @returns {Contract}
 */
EthereumClient.prototype.getContract = function (name) {

  var contract = this.contracts[name];
  if (_.isUndefined(contract)) {
    var contractAbi = abi[name];
    var address = this.addresses[name];
    if (_.isUndefined(address) || _.isUndefined(contractAbi)) {
      throw new MissingContractError(name);
    }

    var Contract = web3.eth.contract(contractAbi);
    contract = Contract.at(address);
    this.contracts[name] = contract;
  }

  return contract;
};

EthereumClient.prototype.testGetMarkets = function() {

  var contract = this.getContract('branches');

  var markets = contract.getMarkets.call(1010101);

  _.each(markets, function(marketId) {
    console.log(marketId.toString(16));
  })
}

EthereumClient.prototype.watchTrades = function(onNewMarketPrice) {

  var contract = this.getContract('buyAndSellShares');

  var pricePaidEvent = contract.pricePaid();
  var priceSoldEvent = contract.priceSold();
  var updatePriceEvent = contract.updatePrice();

  pricePaidEvent.watch(function(error, result) {
    //if (error) console.log('pricePaidEvent error', error);
    //console.log('pricePaidEvent', result.args.market.toString(16), result.args.outcome.toNumber(), result.args.paid.toNumber(), result.args.user.toString(16));
    if (onNewMarketPrice) onNewMarketPrice(result);
  });

  priceSoldEvent.watch(function(error, result) {
    //if (error) console.log('priceSoldEvent error', error);
    //console.log('priceSoldEvent', result.args.market.toString(16), result.args.outcome.toNumber(), result.args.paid.toNumber(), result.args.user.toString(16));
    if (onNewMarketPrice) onNewMarketPrice(result);
  });

  updatePriceEvent.watch(function(error, result) {
    if (error) console.log('updatePriceEvent error', error);
    //console.log('updatePriceEvent', result.args.market.toString(16), result.args.outcome.toNumber(), utilities.fromFixedPoint(result.args.price).toNumber(), result.args.user.toString(16));
    //if (onNewMarketPrice) onNewMarketPrice(result);
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

EthereumClient.prototype.blockChainAge = function() {

  if (web3.net.listening) {
    var blockNumber = web3.eth.blockNumber;
    var blockTimeStamp = web3.eth.getBlock(blockNumber).timestamp;
    var currentTimeStamp = moment().unix();

    return currentTimeStamp - blockTimeStamp;
  }
};

EthereumClient.prototype.startMonitoring = function(callback) {

  this.filters.latest = web3.eth.filter('latest');
  this.filters.pending = web3.eth.filter('pending');
  this.filters.augur = web3.eth.filter({
    addresses: _.map(this.addresses, function(address, contract) { 
      return address;
    })
  });


  this.filters.latest.watch(function (error, result) {
    if (error) utilities.error(error);
    //console.log('latest', result);
    callback();
  });

  this.filters.pending.watch(function (error, result) {
    if (error) utilities.error(error);
    utilities.log('pending tx: ' + result);
  });


  this.filters.augur.watch(function (error, result) {
    if (error) utilities.error(error);
    console.log('augur', result);
  });

};

EthereumClient.prototype.stopMonitoring = function() {

  _.each(this.filters, function(filter) {
    filter.stopWatching()
  });
};

EthereumClient.prototype.setDefaultBranch = function(branchId) {
  this.defaultBranchId = branchId;
};

EthereumClient.prototype.getAccounts = function(callback) {
  web3.eth.getAccounts(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
};

EthereumClient.prototype.getEtherBalance = function(callback) {
  return web3.eth.getBalance(this.account);
};

EthereumClient.prototype.getPrimaryAccount = function(callback) {
  web3.eth.getCoinbase(function(error, result) {
    if (error) { 
      utilities.error(error);
    } else { 
      callback(result); 
    }
  });
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

EthereumClient.prototype.cashFaucet = function(onSent, onSuccess, onFailure) {
  return Augur.cashFaucet(function(result) {
    utilities.log('requesting cash');
  }, function(result) {
    utilities.log('cash request successful');
  }, function(error) {
    utilities.error('cash request failed: ' + error);
  });
};

EthereumClient.prototype.getCashBalance = function() {

  return Augur.getCashBalance(this.account);
};

EthereumClient.prototype.sendCash = function(destination, amount, onSent, onSuccess, onFailure) {
  return Augur.sendCash(destination, amount, function(result) {
    utilities.log('sending '+amount+' cash to '+ destination);
  }, function(result) {
    utilities.log('cash sent successfully');
  }, function(error) {
    utilities.error('failed to send cash: ' + error);
  });
};

EthereumClient.prototype.repFaucet = function(branchId, onSent, onSuccess, onFailure) {

  branchId = branchId || this.defaultBranchId;
  return Augur.reputationFaucet(branchId, function(result) {
    utilities.log('requesting reputation');
  }, function(result) {
    utilities.log('reputation request successful');
  }, function(error) {
    utilities.error('reputation request failed: ' + error);
  });
};

EthereumClient.prototype.getRepBalance = function(branchId) {

  var repBalance = Augur.getRepBalance(branchId || this.defaultBranchId, this.account);
  
  if (repBalance.error) {
    utilities.error(repBalance.message);
  } else {
    return repBalance.toNumber();
  }
};

EthereumClient.prototype.sendRep = function(destination, amount, branchId) {
  return Augur.sendReputation(branchId || this.defaultBranchId, destination, amount, function(result) {
    utilities.log('sending '+amount+' rep to '+ destination);
  }, function(result) {
    utilities.log('rep sent successfully');
  }, function(error) {
    utilities.error('failed to send rep: ' + error);
  });
};

EthereumClient.prototype.sendEther = function(destination, amount) {

  var transaction = {
    from: this.account,
    to: destination,
    value: amount
  };

  var self = this;
  this.web3.eth.sendTransaction(transaction, function(err, txhash) {
    if (!err) {
      utilities.log(self.account+' sent ' + amount + ' wei to '+ destination)
    } else {
      utilities.error(err);
    }
  });
};

EthereumClient.prototype.getDescription = function(id) {
  return Augur.getDescription(id);
};

EthereumClient.prototype.getCreator = function(id) {
  return Augur.getCreator(id);
};

EthereumClient.prototype.getEventBranch = function(id) {
  return Augur.getEventBranch(id);
};

/**
 * Get information about all available branches.
 *
 * @returns {object} Branch information keyed by branch ID.
 */
EthereumClient.prototype.getBranches = function () {

  return Augur.getBranches();
};

EthereumClient.prototype.getPeriodLength = function(branchId) {

  var periodLength = Augur.getPeriodLength(branchId);
  if (periodLength.error) {
    console.error(periodLength.message);
  } else {
    return periodLength.toNumber();
  }
};

EthereumClient.prototype.getVotePeriod = function(branchId) {

  var votePeriod =  Augur.getVotePeriod(branchId).toNumber();
  return votePeriod;
};

EthereumClient.prototype.getEvents = function(period, branchId) {

  if (!period) return;
  branchId = branchId || this.defaultBranchId;

  var events = _.map(Augur.getEvents(branchId, period), function(eventId) {
    return this.getEvent(eventId);
  }, this);

  return events;
};

EthereumClient.prototype.getEvent = function(eventId) {

  var event = Augur.getEventInfo(eventId);
  event.id = eventId;

  return event;
};

EthereumClient.prototype.checkQuorum = function(branchId, onSent, onSuccess, onFailed) {

  if (!branchId) return;
  utilities.log('calling dispatch');

  Augur.dispatch(branchId, function (result) {

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

EthereumClient.prototype.price = function (marketId, outcome, f) {
  return Augur.price(marketId, outcome, f);
};


EthereumClient.prototype.getMarkets = function(branchId, currentMarkets) {

  branchId = branchId || this.defaultBranchId;
  var validMarkets = _.filter(Augur.getMarkets(branchId), function (marketId) {
    //console.log('"'+marketId.toString(16)+'",');  
    return !_.contains(blacklist.markets, marketId.toString(16));
  });

  if (currentMarkets) {    // return new markets only

    // convert ids to strings for comparision
    validMarkets = _.map(validMarkets, function(marketId) { return marketId.toString() } );
    currentMarkets = _.map(currentMarkets, function(marketId) { return marketId.toString() } );
    var newMarkets = _.difference(currentMarkets, validMarkets);

    return newMarkets;

  } else {

    return validMarkets;
  }
};

EthereumClient.prototype.getMarketEvents = function(marketId, onResult) {
  return Augur.getMarketEvents(marketId, onResult);
};

EthereumClient.prototype.getMarketDescription = function(marketId, onResult) {
  return Augur.getDescription(marketId, onResult)
};

EthereumClient.prototype.getMarketAlpha = function(marketId, onResult) {
  return Augur.getAlpha(marketId, onResult);
};

EthereumClient.prototype.getMarketAuthor = function(marketId, onResult) {
  return Augur.getCreator(marketId, onResult);
};

EthereumClient.prototype.getMarketCreationFee = function(marketId, onResult) {
  return Augur.getCreationFee(marketId, onResult);
};

EthereumClient.prototype.getEventExpiration = function(eventId, onResult) {
  return Augur.getExpiration(eventId, onResult);
};

EthereumClient.prototype.getMarketTraderCount = function(marketId, onResult) {
  return Augur.getCurrentParticipantNumber(marketId, onResult);
};

EthereumClient.prototype.getMarketTradingPeriod  = function(marketId, onResult) {
  return Augur.getTradingPeriod(marketId, onResult);
};

EthereumClient.prototype.getMarketTradingFee  = function(marketId, onResult) {
  return Augur.getTradingFee(marketId, onResult);
};

EthereumClient.prototype.getMarketTraderId = function(marketId, onResult) {
  return Augur.getParticipantNumber(marketId, this.account, onResult);
};

EthereumClient.prototype.getMarketNumOutcomes = function(marketId, onResult) {
  return Augur.getMarketNumOutcomes(marketId, onResult);
};

EthereumClient.prototype.getMarketSharesPurchased = function(marketId, outcomeId, onResult) {
  return Augur.getSharesPurchased(marketId, outcomeId, onResult);
};

EthereumClient.prototype.getPrice = function(marketId, outcomeId, onResult) {
  return Augur.price(marketId, outcomeId, onResult);
};

EthereumClient.prototype.getMarketParticipantSharesPurchased = function(marketId, traderId, outcomeId, onResult) {
  return Augur.getParticipantSharesPurchased(marketId, traderId, outcomeId, onResult);
};

EthereumClient.prototype.getMarketWinningOutcomes = function(marketId) {

  var winningOutcomes = Augur.getWinningOutcomes(marketId);
  return winningOutcomes;
};

EthereumClient.prototype.getEventOutcome = function(eventId) {

  var outcome = Augur.getOutcome(eventId);
  return outcome;
};




EthereumClient.prototype.addEvent = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    //console.log(branchId, description, expirationBlock, minValue, maxValue, numOutcomes);

    Augur.createEvent({

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
          utilities.debug("submitted new event "+ newEvent.id);
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
            Augur.getTx(newEvent.txHash);
          }
          if (onSuccess) onSuccess(newEvent);
        }
      },

      onFailed: function (error) {
        utilities.error(error);
      },
    });
};

EthereumClient.prototype.addMarket = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var alpha = "0.0079";
    var initialLiquidity = params.initialLiquidity;
    var tradingFee = params.tradingFee;
    var events = params.events;  // a list of event ids

    //console.log(branchId, description, alpha, initialLiquidity, tradingFee, events);

    Augur.createMarket({
      branchId: branchId,
      description: description,
      alpha: alpha,
      initialLiquidity: initialLiquidity,
      tradingFee: tradingFee,
      events: events,

      onSent: function (newMarket) {
        if (newMarket && newMarket.callReturn) {
          newMarket.id = newMarket.callReturn;
          delete newMarket.callReturn;
          utilities.debug("submitted new market "+ newMarket.id);
        }
      },

      onSuccess: function (newMarket) {
        if (newMarket) {
          if (newMarket.callReturn) {
            newMarket.id = newMarket.callReturn;
            delete newMarket.callReturn;
          }
          if (newMarket.txHash) {
            utilities.debug("txHash: " + newMarket.txHash);
          }
          utilities.log('new market successfully added');
          if (onSuccess) onSuccess(newMarket);
        }
      },

      onFailed: function (error) {
        utilities.error("error adding new market")
        utilities.error(error);
      }
    });
};

EthereumClient.prototype.closeMarket = function (marketId, branchId) {
  try {
    marketId = Augur.bignum(marketId).toFixed();
  } catch (e) {
    marketId = Augur.prefix_hex(marketId);
  }
  try {
    branchId = Augur.bignum(branchId).toFixed();
  } catch (e) {
    branchId = Augur.prefix_hex(branchId);
  }
  utilities.log("Closing market " + marketId + " on branch " + branchId);
  Augur.closeMarket({
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
  Augur.getSimulatedBuy.apply(null, args);
};

EthereumClient.prototype.getSimulatedSell = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  Augur.getSimulatedSell.apply(null, args);
};


EthereumClient.prototype.buyShares = function (branchId, marketId, outcomeId, numShares, onSent) {
  Augur.buyShares(branchId, marketId, outcomeId, numShares, null, onSent);
};

EthereumClient.prototype.sellShares = function (branchId, marketId, outcomeId, numShares, onSent) {
  Augur.sellShares(branchId, marketId, outcomeId, numShares, null, onSent);
};

module.exports = EthereumClient;
