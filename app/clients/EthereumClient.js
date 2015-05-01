var _ = require('lodash');
var Promise = require('es6-promise').Promise;

var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

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
 *
 * @param {object} [addresses] - The address for each contract, keyed as defined in abi.js.
 * @param {object} [web3] - The web3 object to use to access Ethereum data.
 */
function EthereumClient(account, addresses, web3) {

  this.account = account;
  this.addresses = addresses || {};
  this.web3 = web3 || require('web3');
  this.defaultGas = 1000000;

  this.contracts = {};
  _.defaults(this.addresses, constants.addresses);
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
EthereumClient.prototype.getMarkets = function (branchId) {

  var branchContract = this.getContract('branches');
  var marketContract = this.getContract('markets');
  var infoContract = this.getContract('info');
  var account = this.account;

  var validMarkets = _.filter(branchContract.getMarkets.call(branchId), function(marketId) {
    var events = marketContract.getMarketEvents.call(marketId);
    return events.length ? true : false;
  });

  var marketList = _.map(validMarkets, function(marketId) {

    var events = marketContract.getMarketEvents.call(marketId);
    var description = infoContract.getDescription.call(marketId);
    var alpha = fromFixedPoint(marketContract.getAlpha.call(marketId));
    var author = infoContract.getCreator.call(marketId);
    var creationFee = infoContract.getCreationFee.call(marketId);

    var endDate = new Date();   // TODO: calc from last event expiration
    var traderCount = marketContract.getCurrentParticipantNumber.call(marketId);
    var tradingPeriod = marketContract.getTradingPeriod.call(marketId);
    var tradingFee = marketContract.getTradingFee.call(marketId);
    var traderId =  marketContract.getParticipantNumber.call(marketId, account);
    var totalVolume = 0;

    var outcomeCount = marketContract.getMarketNumOutcomes.call(marketId).toNumber();
    var outcomes = _.map( _.range(1, outcomeCount + 1), function (outcomeId) {

      var volume = marketContract.getSharesPurchased.call(marketId, outcomeId);
      //console.log(volume.toNumber());

      //totalVolume += volume;

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

    var price = outcomes.length ? outcomes[0].price : '-';
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

EthereumClient.prototype.addEvent = function(params) {

    var contract = this.getContract('createEvent');
    var infoContract = this.getContract('info');

    var branchId = params.branchId || 1010101;
    var description = params.description;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    var newEventId = contract.createEvent.call(
      branchId, description, expirationBlock, minValue, maxValue, numOutcomes, {gas: 300000}
    );

    if (newEventId !== 0) {

      contract.createEvent.sendTransaction(
        branchId, description, expirationBlock, minValue, maxValue, numOutcomes, {from: this.account, gas: 1000000}
      );

    } else {

      utilities.error('unknown error adding event');
      return false;
    }

    return newEventId;
};

EthereumClient.prototype.addMarketTest = function(params) {

    //var Augur = require('augur.js');

    var contract = this.getContract('createMarket');

    var branchId = params.branchId || 1010101;
    var description = params.description;
    var alpha = 1;  // debugging, should be 0.07
    var initialLiquidity = params.initialLiquidity;
    var tradingFee = params.tradingFee;   // percent trading fee
    var events = params.events;  // a list of event ids

    Augur.createMarket(branchId, description, alpha, initialLiquidity, tradingFee, events);

},

EthereumClient.prototype.addMarket = function(params) {

    var contract = this.getContract('createMarket');

    var branchId = params.branchId || 1010101;
    var description = params.description;
    var alpha = toFixedPoint(1);  // debugging, should be 0.07
    var initialLiquidity = toFixedPoint(params.initialLiquidity);
    var tradingFee = toFixedPoint(parseInt(params.tradingFee)/100);   // percent trading fee
    var events = params.events;  // a list of event ids

    // use call to get new market id or error return
    //var newMarketId = contract.createMarket.call(
    //  branchId, description, alpha, initialLiquidity, tradingFee, events, {gas: 300000}
    //);

    console.log(newMarketId.toString(16));
    console.log(branchId, description, alpha.toString(16), initialLiquidity.toString(16), tradingFee.toString(16), events);

    if ([-1, -2, -3, -4].indexOf(newMarketId.toNumber()) > -1) {

      utilities.error('error adding market ('+newMarketId+')');
      return false;

    } else if (newMarketId) {

      contract.createMarket.sendTransaction(
        branchId, description, alpha, initialLiquidity, tradingFee, events, {from: this.account, gas: 1000000}
      );

    } else {

      utilities.error('unknown error adding market');
      return false;
    }

    return newMarketId;
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
