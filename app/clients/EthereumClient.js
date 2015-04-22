var _ = require('lodash');
var Promise = require('es6-promise').Promise;

var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

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

EthereumClient.prototype.cashFaucet = function() {

  var cashContract = this.getContract('cash');
  var status = cashContract.sendTransaction({from: this.account, gas: 1000000}).faucet();

  return status;
};

EthereumClient.prototype.getCashBalance = function() {

  var cashContract = this.getContract('cash');
  var balance = cashContract.call().balance(this.account);

  return balance.dividedBy(new BigNumber(2).toPower(64)).toNumber();
};

EthereumClient.prototype.sendCash = function(destination, amount) {

  var cashContract = this.getContract('cash');
  var fixedAmount = new BigNumber(amount).times(new BigNumber(2).toPower(64));

  var status = cashContract.sendTransaction({from: this.account, gas: 1000000}).send(destination, fixedAmount);

  return status;
};

EthereumClient.prototype.repFaucet = function() {

  var reportingContract = this.getContract('reporting');
  var status = reportingContract.sendTransaction({from: this.account, gas: 1000000}).faucet();  

  return status;
};

EthereumClient.prototype.getRepBalance = function(branchId) {

  var id = branchId || 1010101;

  var reportingContract = this.getContract('reporting');
  var rep = reportingContract.call().getRepBalance(id, this.account);

  return rep.dividedBy(new BigNumber(2).toPower(64)).toNumber();
};

EthereumClient.prototype.sendRep = function(destination, amount, brachId) {

  var id = branchId || 1010101;
  var sendRepContract = this.getContract('sendReputation');
  var fixedAmount = new BigNumber(amount).times(new BigNumber(2).toPower(64));

  var self = this;
  var status = sendRepContract.sendTransaction({from: this.account, gas: 1000000}).sendReputation(destination, fixedAmount);

  return status;
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

  var branchList = _.map(branchContract.call().getBranches(), function(branchId) {

    var storedRep = reportingContract.call().getRepBalance(branchId, account);
    var rep = storedRep.dividedBy(new BigNumber(2).toPower(64)).toNumber();
    var marketCount = branchContract.call().getNumMarkets(branchId).toNumber();
    var periodLength = branchContract.call().getPeriodLength(branchId).toNumber();
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

EthereumClient.prototype.getMarkets = function (branchId) {

  var branchContract = this.getContract('branches');
  var marketContract = this.getContract('markets');
  var infoContract = this.getContract('info');
  var account = this.account;

  var marketList = _.map(branchContract.call().getMarkets(branchId), function(id) {

    var marketId = id.toNumber();

    var desc = infoContract.call().getDescription(marketId);
    var events = marketContract.call().getMarketEvents(marketId);
    var alpha = marketContract.call().getAlpha(marketId).toNumber();
    var author = infoContract.call().getCreator(marketId).toNumber();
    var creationFee = infoContract.call().getCreationFee(marketId);
    var endDate = new Date();   // TODO: calc from last event expiration
    var traderCount = marketContract.call().getCurrentParticipantNumber(marketId).toNumber();
    var tradingPeriod = marketContract.call().getTradingPeriod(marketId).toNumber();
    var tradingFee = marketContract.call().getTradingFee(marketId).toNumber();
    var traderId =  marketContract.call().getParticipantNumber(marketId, account);
    var totalVolume = 0;

    var outcomeCount = marketContract.call().getMarketNumOutcomes(marketId).toNumber(); 
    var outcomes = _.map( _.range(outcomeCount), function (id) {

      id += 1;   // 1-indexed 
      var volume = marketContract.call().getSharesPurchased(marketId, id).toNumber();
      totalVolume += volume;

      return {
        id: id,
        price: marketContract.call().price(marketId, id).toNumber(),
        //sellPrice: marketContract.call().getSimulatedSell(marketId, id).toNumber(),
        //buyPrice: marketContract.call().getSimulatedBuy(marketId, id).toNumber(),
        priceHistory: [],  // NEED
        sharesPurchased: marketContract.call().getParticipantSharesPurchased(marketId, traderId, id).toNumber(),
        volume: volume
      };
    });

    var winningOutcomes = marketContract.call().getWinningOutcomes(marketId);

    return {
      id: marketId,
      price: outcomes[0].price,  // HACK
      desc: desc,
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
  //console.log(markets);
  
  return markets;
};

EthereumClient.prototype.getEvents = function(branchId) {

  return {};
};

EthereumClient.prototype.getEvent = function(eventId) {

  var contract = this.getContract('events');
  var r = contract.call({gas: 1000000}).getEventInfo(eventId);

  console.log(r);
};

EthereumClient.prototype.addEvent = function(params) {

    var contract = this.getContract('createEvent');

    var branchId = params.branchId || 1010101;
    var desc = params.desc;
    var expirationBlock = params.expirationBlock;
    var minValue = params.minValue || 0;
    var maxValue = params.maxValue || 1;
    var numOutcomes = params.numOutcomes || 2;

    try {
      var newEventId = contract.call({gas: 1000000}).createEvent(
        branchId, desc, expirationBlock, minValue, maxValue, numOutcomes
      );

      contract.sendTransaction({from: this.account, gas: 1000000}).createEvent(
        branchId, desc, expirationBlock, minValue, maxValue, numOutcomes
      );
    } catch(err) {

      utilities.error(err);
      return false;;
    }

    return newEventId;
};

EthereumClient.prototype.addMarket = function(params) {

    var contract = this.getContract('createMarket');

    var branchId = 1010101;
    var desc = params.des;
    var alpha = new BigNumber('0.07').multiplyBy(new BigNumber(2).toPower(64));
    var initialLiquidity = new BigNumber(params.initialLiquidity).multiplyBy(new BigNumber(2).toPower(64));
    var tradingFee = new BigNumber(params.tradingFee).multiplyBy(new BigNumber(2).toPower(64));   // percent trading fee
    var events = params.events;  // a list of event ids

    try {

      var newMarketId = contract.call({gas: 30000}).createMarket(
        branchId, desc, alpha, initialLiquidity, tradingFee, events
      );

      contract.sendTransaction({from: this.account, gas: 30000}).createMarket(
        branchId, desc, alpha, initialLiquidity, tradingFee, events
      );

    } catch(err) {

      utilities.error(err);
      return false;
    }

    return newMarketId;
};

module.exports = EthereumClient;
