
var constants = require('../constants');
var utilities = require('../utilities');

var NetworkActions = {
  updateNetwork: function () {
    var accountState = this.flux.store('account').getState();
    var isDemo = this.flux.store('config').getState().isDemo;

    var web3;
    if (isDemo) {
      web3 = require('../demo').web3;
    } else {
      web3 = require('ethereum.js');
    }

    this.dispatch(constants.network.UPDATE_NETWORK, {
      accounts: web3.eth.accounts,
      peerCount: web3.net.peerCount,
      blockNumber: web3.eth.blockNumber,
      gas: utilities.formatGas(web3.eth.getBalance(accountState.account)),
      gasPrice: utilities.formatGas(web3.eth.gasPrice)
    });
  }
};

module.exports = NetworkActions;
