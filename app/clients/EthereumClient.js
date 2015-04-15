var _ = require('lodash');
var Promise = require('es6-promise').Promise;

var abi = require('../libs/abi');
var constants = require('../libs/constants');


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
function EthereumClient(addresses, web3) {
  this.contracts = {};
  this.web3 = web3 || require('web3');
  this.addresses = addresses;
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
    contract = new Contract(evmAddress);
    this.contracts[name] = contract;
  }

  return contract;
};

/**
 * Get information about all available branches.
 *
 * @returns {object} Branch information keyed by branch ID.
 */
EthereumClient.prototype.getBranches = function () {
  var branchContract = this.getContract('branch');
  var reportingContract = this.getContract('reporting');

  var branchList = _.map(branchContract.call().getBranches(), function(branchId) {
    var storedRep = reportingContract.call().getRepBalance(branchId, account);
    // TODO: Explain why storedRep is manipulated like this.
    var rep = storedRep.dividedBy(new BigNumber(2).toPower(64));
    var marketCount = branchContract.call().getMarkets(branchId).length;

    // TODO: Get name, currentPeriod and periodLength, which used to come from
    // getBranchDesc and getBranchInfo, neither of which appear in the current
    // ABI.

    return {
      id: branchId,
      name: 'TODO Branch Name',
      currentPeriod: 0, // branchInfo[2].toNumber()
      periodLength: 100, // branchInfo[3].toNumber()
      rep: rep,
      marketCount: marketCount
    };
  });

  var branches = _.indexBy(branchList, 'id');
  return branches;
};

module.exports = EthereumClient;
