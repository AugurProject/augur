var _ = require('lodash');
var Promise = require('es6-promise').Promise;

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
  this.web3 = window.web3 = params.web3 || require('web3');
  this.defaultBranchId = params.defaultBranchId || 1010101;
  this.defaultGas = params.defaultGas || 1000000;
  this.host = params.host || 'localhost:8454';

  _.defaults(this.addresses, constants.addresses);

  this.web3.setProvider(new web3.providers.HttpProvider('http://'+this.host));
}

EthereumClient.prototype.isAvailable = function() {

    try {
      this.account = Augur.coinbase;
    } catch(err) {
      return false;
    }

    return true;
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

  // Ensure that this.account is set and valid.
  // FIXME: We should make sure this gets set during the initialization process.
  if (!this.isAvailable() || this.account === '0x') {
    return 0;
  }

  return Augur.getCashBalance(this.account);
};

EthereumClient.prototype.sendCash = function(destination, amount, onSuccess) {
  return Augur.sendCash(destination, amount);
};

EthereumClient.prototype.repFaucet = function() {
  return Augur.reputationFaucet();
};

EthereumClient.prototype.getRepBalance = function(branchId) {

  // Ensure that this.account is set and valid.
  // FIXME: We should make sure this gets set during the initialization process.
  if (!this.isAvailable() || this.account === '0x') {
    return 0;
  }

  return Augur.getRepBalance(branchId || this.defaultBranchId, this.account).toNumber();
};

EthereumClient.prototype.sendRep = function(destination, amount, branchId) {
  return Augur.sendReputation(branchId || this.defaultBranchId, destination, amount);
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

  var account = this.account;

  var branchList = _.map(Augur.getBranches(), function (branchId) {

    return {
      id: (branchId.toNumber() === this.defaultBranchId) ? branchId.toNumber() : branchId.toFixed(),
      name: Augur.getDescription(branchId),
      periodLength: Augur.getPeriodLength(branchId).toNumber(),
      rep: Augur.getRepBalance(branchId, account).toNumber(),
      marketCount: Augur.getNumMarkets(branchId).toNumber()
    };
  });

  var branches = _.indexBy(branchList, 'id');
  return branches;
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
                    markets[market].outcomes[outcome].sharesPurchased = myShares;
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

EthereumClient.prototype.getMarkets = function (branchId) {

  branchId = branchId 
  var validMarkets = _.filter(Augur.getMarkets(branchId), function (marketId) {
    return !_.contains(blacklist.markets, marketId.toString(16));
  });

  var marketList = _.map(validMarkets, function (marketId) {
    return this.getMarket(marketId, branchId);
  }, this);

  return _.indexBy(marketList, 'id');
};

EthereumClient.prototype.getMarket = function (marketId, branchId) {

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
    var sharesPurchased = new BigNumber(0);
    if (traderId !== -1) {
      sharesPurchased = Augur.getParticipantSharesPurchased(marketId, traderId, outcomeId);
    }

    return {
      id: outcomeId,
      price: Augur.price(marketId, outcomeId),
      priceHistory: [],  // NEED
      sharesPurchased: sharesPurchased,
      volume: volume
    };
  });

  var price = outcomes.length ? outcomes[1].price : new BigNumber(0);  // hardcoded to outcome 2 (yes)
  var winningOutcomes = Augur.getWinningOutcomes(marketId);

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
    comments: []
  };
};

EthereumClient.prototype.getEvents = function(branchId, expirationPeriod) {
  return {};
};

EthereumClient.prototype.getEvent = function(eventId) {
  return Augur.getEventInfo(eventId);
};

EthereumClient.prototype.addEvent = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 1;
    var maxValue = params.maxValue || 2;
    var numOutcomes = params.numOutcomes || 2;

    Augur.createEvent({

      branchId: branchId,
      description: description,
      expDate: expirationBlock,
      minValue: minValue,
      maxValue: maxValue,
      numOutcomes: numOutcomes,

      onSent: function (newEvent) {
        utilities.debug("submitted new event "+ newEvent.id);
      },

      onSuccess: function (newEvent) {

        utilities.debug("tx: " + newEvent.txhash);

        Augur.getTx(newEvent.txhash);
        if (onSuccess) onSuccess(newEvent);
      }
    });
};

EthereumClient.prototype.addMarket = function(params, onSuccess) {

    var branchId = params.branchId || this.defaultBranchId;
    var description = params.description;
    var alpha = "0.0079";
    var initialLiquidity = params.initialLiquidity;
    var tradingFee = params.tradingFee;
    var events = params.events;  // a list of event ids

    Augur.createMarket({
      branchId: branchId,
      description: description,
      alpha: alpha,
      initialLiquidity: initialLiquidity,
      tradingFee: tradingFee,
      events: events,

      onSent: function (newMarket) {
        utilities.debug("submitted new market "+ newMarket.id);
      },

      onSuccess: function (newMarket) {
        utilities.debug("tx: " + newMarket.txhash);
        utilities.log('new market successfully added');
        if (onSuccess) onSuccess(newMarket);
      },
      
      onFailed: function (newMarket) {
        utilities.error("error adding new market")
        utilities.error(newMarket);
      }
    });
};

var hexNumber = function (bignum) {
  var hex = bignum.toString(16);
  if (hex[0] === '-') {
    return '-0x' + hex.slice(1);
  } else {
    return '0x' + hex;
  }
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
  console.log(args);
  Augur.getSimulatedBuy.apply(null, args);
};

EthereumClient.prototype.getSimulatedSell = function (marketId, outcomeId, numShares, callback) {
  var args = getSimulationArgs(marketId, outcomeId, numShares, callback);
  console.log(args);
  Augur.getSimulatedSell.apply(null, args);
};


EthereumClient.prototype.buyShares = function (branchId, marketId, outcomeId, numShares, callback) {

  Augur.buyShares(branchId, marketId, outcomeId, numShares, null, callback);
};

EthereumClient.prototype.sellShares = function (branchId, marketId, outcomeId, numShares, callback) {

  Augur.sellShares(branchId, marketId, outcomeId, numShares, null, callback);
};

module.exports = EthereumClient;

