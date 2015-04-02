var web3 = require('ethereum.js');

var constants = require('../constants');
var utilities = require('../utilities');

var NetworkActions = {
  updateNetwork: function (network) {
    var accountState = this.flux.stores('account').getState();

    this.dispatch(constants.network.UPDATE_NETWORK, {
      peerCount: web3.net.peerCount,
      blockNumber: web3.eth.blockNumber,
      gas: utilities.formatGas(web3.eth.getBalance(accountState.account)),
      gasPrice: utilities.formatGas(web3.eth.gasPrice)
    });
  }
};

module.exports = NetworkActions;
