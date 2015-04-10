window.web3 = require('web3');
var constants = require('../constants');
var utilities = require('../utilities');

var NetworkActions = {

  checkEthereumClient: function() {

    web3.setProvider(new web3.providers.HttpProvider());

    try {
      web3.eth.accounts;
    } catch(err) {
      console.log('[augur] no ethereum client found');
      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.network.ETHEREUM_STATUS_FAILED});
      return;
    }

    this.dispatch(
      constants.network.UPDATE_ETHEREUM_STATUS,
      {ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED});

  },

  updateNetwork: function () {

    var accountState = this.flux.store('account').getState();

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
