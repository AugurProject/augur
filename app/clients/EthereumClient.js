var _ = require('lodash');
var Promise = require('es6-promise').Promise;
var Augur = require('augur.js');

var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var fromFixedPoint = utilities.fromFixedPoint;
var toFixedPoint = utilities.toFixedPoint;

function MissingContractError(contractName) {
  this.name = 'MissingContractError';
  this.message = contractName;
}

/**
 * Augur is implemented as several Ethereum contracts, mainly due to size
 * limitations. EthereumClient wraps the calls to those contracts to abstract
 * the contract details from the rest of the codebase.
 */
function EthereumClient(host) {

  this.web3 = window.web3 = require('web3');
  this.addresses = {};
  this.filters = {}

  this.defaultGas = 1000000;

  this.contracts = {};
  _.defaults(this.addresses, constants.addresses);

  this.web3.setProvider(new web3.providers.HttpProvider('http://'+host));
}

EthereumClient.prototype.isAvailable = function() {

    try {
      this.account = this.getPrimaryAccount();
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
  return this.web3.eth.getBalance(this.account);
}

EthereumClient.prototype.getAccounts = function() {
  return this.web3.eth.accounts;
}

EthereumClient.prototype.getPrimaryAccount = function() {
  return this.web3.eth.coinbase;
}

EthereumClient.prototype.getStats = function() {
  return {
    gasPrice: this.web3.eth.gasPrice,
    blockNumber: this.web3.eth.blockNumber,
    miner: this.web3.eth.miner,
    peerCount: this.web3.net.peerCount
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

  var cashContract = this.getContract('cash');
  var status = cashContract.faucet.sendTransaction({from: this.account, gas: this.defaultGas});

  return status;
};

EthereumClient.prototype.getCashBalance = function() {

  var cashContract = this.getContract('cash');
  var balance = cashContract.balance.call(this.account);

  return fromFixedPoint(balance).toNumber();
};

EthereumClient.prototype.sendCash = function(destination, amount, onSuccess) {

  var cashContract = this.getContract('cash');
  var fixedAmount = toFixedPoint(amount);

  cashContract.send.sendTransaction( destination, fixedAmount, {from: this.account, gas: this.defaultGas} );
};

EthereumClient.prototype.repFaucet = function() {

  var reportingContract = this.getContract('reporting');
  var status = reportingContract.faucet.sendTransaction({from: this.account, gas: this.defaultGas});

  return status;
};

EthereumClient.prototype.getRepBalance = function(branchId) {

  var id = branchId || 1010101;

  var reportingContract = this.getContract('reporting');
  var rep = reportingContract.getRepBalance.call(id, this.account);

  return fromFixedPoint(rep).toNumber();
};

EthereumClient.prototype.sendRep = function(destination, amount, branchId) {

  var id = branchId || 1010101;
  var sendRepContract = this.getContract('sendReputation');
  var fixedAmount = toFixedPoint(amount);

  var self = this;
  sendRepContract.sendReputation.sendTransaction(id, destination, fixedAmount, {from: this.account, gas: this.defaultGas});

};

EthereumClient.prototype.getDescription = function(id) {

  var contract = this.getContract('info');
  var description = contract.getDescription.call(id);

  return description;
};

EthereumClient.prototype.getCreator = function(id) {

  var contract = this.getContract('info');
  var creatorId = contract.getCreator.call(id);

  return creatorId;
};

EthereumClient.prototype.getEventBranch = function(id) {

  var contract = this.getContract('events');
  var branchId = contract.getEventBranch.call(id);

  return branchId;
};

/**
 * Get information about all available branches.
 *
 * @returns {object} Branch information keyed by branch ID.
 */
EthereumClient.prototype.getBranches = function () {
  var branchContract = this.getContract('branches');
  var reportingContract = this.getContract('reporting');
  var account = this.account;

  var branchList = _.map(branchContract.getBranches.call(), function(branchId) {

    var storedRep = reportingContract.getRepBalance.call(branchId, account);
    var rep = fromFixedPoint(storedRep).toNumber();
    var marketCount = branchContract.getNumMarkets.call(branchId).toNumber();
    var periodLength = branchContract.getPeriodLength.call(branchId).toNumber();
    var branchName = branchId == 1010101 ? 'General' : 'Unknown';  // HACK: until we're actually using multi-branch

    return {
      id: branchId.toNumber(),
      name: branchName,
      periodLength: periodLength,
      rep: rep,
      marketCount: marketCount
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
                markets[market].volume = markets[market].outcomes[outcome].volume = fromFixedPoint(allShares);
                markets[market].totalVolume = markets[market].totalVolume.plus(markets[market].volume);
                Augur.price(market, outcome, function (price) {
                  markets[market].price = fromFixedPoint(price);
                  Augur.getParticipantSharesPurchased(market, marketInfo.currentParticipant, outcome, function (myShares) {
                    markets[market].outcomes[outcome].sharesPurchased = fromFixedPoint(myShares);
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

  var branchContract = this.getContract('branches');
  var marketContract = this.getContract('markets');
  var eventContract = this.getContract('events');
  var infoContract = this.getContract('info');
  var account = this.account;

  var validMarkets = _.filter(branchContract.getMarkets.call(branchId), function(marketId) {
    return !_.contains(blacklist.markets, marketId.toString(16));
  });

  var marketList = _.map(validMarkets, function(marketId) {

    console.log(marketId.toString(16));
    var events = marketContract.getMarketEvents.call(marketId);
    var description = infoContract.getDescription.call(marketId);
    var alpha = fromFixedPoint(marketContract.getAlpha.call(marketId));
    var author = infoContract.getCreator.call(marketId);
    var creationFee = fromFixedPoint(infoContract.getCreationFee.call(marketId));

    // calc end date from first events expiration
    var endDate;
    if (events.length) {
      var expirationBlock = eventContract.getExpiration.call(events[0]);
      endDate = utilities.blockToDate(expirationBlock.toNumber());
    }

    var traderCount = marketContract.getCurrentParticipantNumber.call(marketId);
    var tradingPeriod = marketContract.getTradingPeriod.call(marketId);
    var tradingFee = fromFixedPoint(marketContract.getTradingFee.call(marketId));
    var traderId =  marketContract.getParticipantNumber.call(marketId, account);
    var totalVolume = new BigNumber(0);

    var outcomeCount = marketContract.getMarketNumOutcomes.call(marketId).toNumber();
    var outcomes = _.map( _.range(1, outcomeCount + 1), function (outcomeId) {

      var volume = fromFixedPoint(marketContract.getSharesPurchased.call(marketId, outcomeId));
      totalVolume = totalVolume.plus(volume);

      return {
        id: outcomeId,
        price: fromFixedPoint(marketContract.price.call(marketId, outcomeId)),
        //sellPrice: marketContract.getSimulatedSell.call(marketId, id).toNumber(),
        //buyPrice: marketContract.getSimulatedBuy.call(marketId, id).toNumber(),
        priceHistory: [],  // NEED
        sharesPurchased: fromFixedPoint(marketContract.getParticipantSharesPurchased.call(marketId, traderId, outcomeId)),
        volume: volume
      };
    });

    var price = outcomes.length ? outcomes[0].price : new BigNumber(0);  
    var winningOutcomes = marketContract.getWinningOutcomes.call(marketId);

    return {
      id: marketId,
      price: price,  // HACK
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
  });

  var markets = _.indexBy(marketList, 'id');

  return markets;
};

EthereumClient.prototype.getEvents = function(branchId, expirationPeriod) {

  return {};
};

EthereumClient.prototype.getEvent = function(eventId) {

  var contract = this.getContract('events');
  var info = contract.getEventInfo.call(eventId);

  return info;
};

EthereumClient.prototype.addEvent = function(params, onSuccess) {

    var branchId = params.branchId || 1010101;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 1;  // why arn't these 0 and 1?!  create market errors if they are not
    var maxValue = params.maxValue || 2;
    var numOutcomes = params.numOutcomes || 2;

    //var contract = this.getContract('createEvent');
    //var newEventId = contract.createEvent.call(
    //  branchId, description, expirationBlock, minValue, maxValue, numOutcomes, {gas: 300000}
    //);

    Augur.createEvent(

      branchId, description, expirationBlock, minValue, maxValue, numOutcomes,

      // sent callback
      function (newEvent) {
        utilities.debug("submitted new event "+ newEvent.id);
      },

      // success callback
      function (newEvent) {

        utilities.debug("tx: " + newEvent.txhash);

        Augur.getTx(newEvent.txhash);
        if (onSuccess) onSuccess(newEvent);
      }
    );

    //return newEventId;
};

EthereumClient.prototype.addMarket = function(params, onSuccess) {

    var branchId = params.branchId || 1010101;
    var description = params.description;
    //var alpha = toFixedPoint(0.07);
    //var initialLiquidity = toFixedPoint(params.initialLiquidity);
    //var tradingFee = toFixedPoint(params.tradingFee);   // percent trading fee
    var alpha = (new BigNumber(0.07)).mul(Augur.ONE).toFixed();
    var initialLiquidity = (new BigNumber(params.initialLiquidity)).mul(Augur.ONE).toFixed();
    var tradingFee = (new BigNumber(params.tradingFee)).mul(Augur.ONE).toFixed();
    var events = params.events;  // a list of event ids

    //var contract = this.getContract('createMarket');

    // use call to get new market id or error return
    //var newMarketId = contract.createMarket.call(
    //  branchId, description, alpha, initialLiquidity, tradingFee, events, {gas: 300000}
    //);

    Augur.createMarket(
          
      branchId, description, alpha, initialLiquidity, tradingFee, events,

      // sent callback
      function (newMarket) {
        utilities.debug("submitted new market "+ newMarket.id);
      },

      // success callback
      function (newMarket) {
        utilities.debug("tx: " + newMarket.txhash);

        if (onSuccess) onSuccess();
      },

      // failed callback
      function (newMarket) {
        utilities.error("error adding new market")
        utilities.error(newMarket);
      }
    );

    //return newMarketId;
};

EthereumClient.prototype.getSimulatedBuy = function (marketId, outcomeId, numShares) {
  var marketContract = this.getContract('markets');
  var result = marketContract.getSimulatedBuy.call(
    marketId,
    outcomeId,
    toFixedPoint(numShares)
  );

  return {
    cost: fromFixedPoint(result[0]),
    newPrice: fromFixedPoint(result[1])
  };
};

module.exports = EthereumClient;

