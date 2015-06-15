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
  this.defaultGas = params.defaultGas || 1000000;
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

EthereumClient.prototype.isAvailable = function() {

  // attempt an RPC call that should fail if the daemon is unreachable.
  try {
    return web3.net.listening
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
  this.filters.latest.watch(function (err, log) {
    if (err) utilities.error(err);
    callback();
  });
}

EthereumClient.prototype.stopMonitoring = function() {
  _.each(this.filters, function(filter) {
    filter.stopWatching()
  });
}

EthereumClient.prototype.setDefaultBranch = function(branchId) {
  this.defaultBranchId = branchId;
}

EthereumClient.prototype.getEtherBalance = function() {
  return Augur.balance(this.account);
}

EthereumClient.prototype.getAccounts = function() {
  return Augur.accounts();
}

EthereumClient.prototype.getPrimaryAccount = function() {
  return Augur.coinbase;
}

EthereumClient.prototype.getStats = function() {
  return {
    gasPrice: Augur.gasPrice(),
    blockNumber: Augur.blockNumber(),
    mining: Augur.mining(),
    hashrate: Augur.hashrate(),
    peerCount: Augur.peerCount()
  }
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
    contract = new Contract(address);
    this.contracts[name] = contract;
  }

  return contract;
};

EthereumClient.prototype.getAddress = function (name) {

  var address = this.addresses[name];
  if (_.isUndefined(address)) return false;

  return address;
};

EthereumClient.prototype.cashFaucet = function() {
  return Augur.cashFaucet();
};

EthereumClient.prototype.getCashBalance = function() {

  return Augur.getCashBalance(this.account);
};

EthereumClient.prototype.sendCash = function(destination, amount, onSuccess) {
  return Augur.sendCash(destination, amount, function(result) {
    utilities.log('sending '+amount+' cash to '+ destination);
  }, function(result) {
    utilities.log('cash sent successfully');
  }, function(error) {
    utilities.error('failed to send cash: ' + error);
  });
};

EthereumClient.prototype.repFaucet = function(branchId) {

  branchId = branchId || this.defaultBranchId;
  return Augur.reputationFaucet(branchId);
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
    }
    if (onSent) onSent(result.txHash);

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

/**
 * Get a list of all the market data for the given branch.
 *
 * @param branchId - The ID of the branch to get markets for.
 * @returns {object} Market information keyed by market ID.
 * @returns {Number} object.$id.price - The price of the primary outcome of
 *   the market (the positive outcome in binary markets).
 * @returns {BigNumber} object.$id.author - The account hash of the market
 *   creator. Convert to hexadecimal for display purposes.
 */
EthereumClient.prototype.getMarketsAsync = function (branchId) {
  var markets = {};
  Augur.getMarkets(branchId, function (marketList) {
    marketList.loop(function (market, nextMarket) {
      markets[market] = { id: market, comments: [], endDate: null };
      Augur.getMarketEvents(market, function (events) {
        markets[market].events = events;
        Augur.getMarketInfo(market, function (marketInfo) {
          /**
           * marketInfo: {
           *    currentParticipant: BigNumber
           *    alpha: BigNumber
           *    cumulativeScale: BigNumber
           *    description: string (ASCII)
           *    numOutcomes: int
           *    tradingFee: BigNumber
           *    tradingPeriod: BigNumber
           * }
           */
          markets[market].traderId = marketInfo.currentParticipant;
          markets[market].alpha = marketInfo.alpha;
          markets[market].description = marketInfo.description;
          markets[market].numOutcomes = marketInfo.numOutcomes;
          markets[market].tradingFee = marketInfo.tradingFee;
          markets[market].tradingPeriod = marketInfo.tradingPeriod;
          if (!markets[market].outcomes) {
            markets[market].outcomes = Array(marketInfo.numOutcomes);
          }
          Augur.getCreator(market, function (author) {
            markets[market].author = author;
            markets[market].totalVolume = new BigNumber(0);
            _.range(1, marketInfo.numOutcomes + 1).loop(function (outcome, nextOutcome) {
              markets[market].outcomes[outcome] = { id: outcome };
              Augur.getSharesPurchased(market, outcome, function (allShares) {
                markets[market].volume = markets[market].outcomes[outcome].volume = allShares;
                markets[market].totalVolume = markets[market].totalVolume.plus(markets[market].volume);
                Augur.price(market, outcome, function (price) {
                  markets[market].price = price;
                  Augur.getParticipantSharesPurchased(market, marketInfo.currentParticipant, outcome, function (myShares) {
                    markets[market].outcomes[outcome].sharesHeld = myShares;
                    Augur.getExpiration(events[0], function (expiration) {
                      if (events.length) {
                        markets[market].endDate = utilities.blockToDate((new BigNumber(expiration)).toNumber());
                        // markets[market] is ready to append to the DOM -- is there a way to do that
                        // on-the-fly instead of doing it all-at-once thru the dispatcher?
                        console.log(markets[market]);
                      }
                    });
                  });
                });
              });
              nextOutcome();
            });
          });
        });
      });
      nextMarket();
    });
  });
};

EthereumClient.prototype.getNewMarkets = function(branchId, currentMarkets) {

  branchId = branchId || this.defaultBranchId;
  var validMarkets = _.filter(Augur.getMarkets(branchId), function (marketId) {
    return !_.contains(blacklist.markets, marketId.toString(16));
  });

  // convert to string for comparision
  validMarkets = _.map(validMarkets, function(marketId) { return marketId.toString() } );

  var markets = _.difference(currentMarkets, validMarkets);  // new markets

  var marketList = _.map(markets, function (marketId) {
    utilities.debug('new market: '+marketId.toString(16));
    return this.getMarket(marketId, branchId);
  }, this);

  return _.indexBy(marketList, 'id');
};

EthereumClient.prototype.getMarkets = function(branchId, onProgress) {

  branchId = branchId || this.defaultBranchId;
  var validMarkets = _.filter(Augur.getMarkets(branchId), function (marketId) {
    //console.log('"'+marketId.toString(16)+'",');  
    return !_.contains(blacklist.markets, marketId.toString(16));
  });

  var progress = {total: validMarkets.length, current: 0};

  var marketList = _.map(validMarkets, function (marketId) {

    // update/call progress
    if (onProgress) {
      progress.current += 1;
      onProgress(progress);
    }

    return this.getMarket(marketId, branchId);

  }, this);

  return _.indexBy(marketList, 'id');
};

EthereumClient.prototype.getMarket = function(marketId, branchId) {

  var events = Augur.getMarketEvents(marketId);
  var description = Augur.getDescription(marketId);
  var alpha = Augur.getAlpha(marketId);
  var author = Augur.getCreator(marketId);

  var creationFee = Augur.getCreationFee(marketId);

  // calc end date from first events expiration
  var endDate;
  if (events.length) {
    var expirationBlock = Augur.getExpiration(events[0]);
    endDate = utilities.blockToDate(expirationBlock.toNumber());
  }

  var traderCount = Augur.getCurrentParticipantNumber(marketId);
  var tradingPeriod = Augur.getTradingPeriod(marketId);
  var tradingFee = Augur.getTradingFee(marketId);
  var traderId = Augur.getParticipantNumber(marketId, this.account);

  var totalVolume = new BigNumber(0);

  var outcomeCount = Augur.getMarketNumOutcomes(marketId).toNumber();
  var outcomes = _.map( _.range(1, outcomeCount + 1), function (outcomeId) {

    var volume = Augur.getSharesPurchased(marketId, outcomeId);
    totalVolume = totalVolume.plus(volume);
    var sharesHeld = new BigNumber(0);
    if (traderId !== -1) {
      sharesHeld = Augur.getParticipantSharesPurchased(marketId, traderId, outcomeId);
    }

    return {
      id: outcomeId,
      price: Augur.price(marketId, outcomeId),
      priceHistory: [],  // NEED
      sharesHeld: sharesHeld,
      volume: volume
    };
  });

  var price = outcomes.length ? outcomes[1].price : new BigNumber(0);  // hardcoded to outcome 2 (yes)
  // var winningOutcomes = Augur.getWinningOutcomes(marketId);

  // check if this market is ready to be closed
  var events = Augur.getMarketEvents(marketId);
  var expired = true;
  for (var i = 0, len = events.length; i < len; ++i) {
    if (Augur.getOutcome(events[i]).toFixed() === "0") {
      expired = false;
      break;
    }
  }

  // check validity
  var invalid = outcomes.length ? false : true;

  return {
    id: marketId,
    branchId: branchId,
    price: price,
    description: description,
    alpha: alpha,
    author: author,
    endDate: endDate,
    traderCount: traderCount,
    tradingPeriod: tradingPeriod,
    tradingFee: tradingFee,
    traderId: traderId,
    totalVolume: totalVolume,
    events: events,
    outcomes: outcomes,
    comments: [],
    invalid: invalid,
    expired: expired
  };
};

EthereumClient.prototype.addEvent = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    console.log(branchId, description, expirationBlock, minValue, maxValue, numOutcomes);

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

    console.log(branchId, description, alpha, initialLiquidity, tradingFee, events);

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


EthereumClient.prototype.buyShares = function (branchId, marketId, outcomeId, numShares, onSent, onSuccess, onFailed) {
  Augur.buyShares(branchId, marketId, outcomeId, numShares, null, onSent, onSuccess, onFailed);
};

EthereumClient.prototype.sellShares = function (branchId, marketId, outcomeId, numShares, onSent, onSuccess, onFailed) {
  Augur.sellShares(branchId, marketId, outcomeId, numShares, null, onSent, onSuccess, onFailed);
};

module.exports = EthereumClient;
