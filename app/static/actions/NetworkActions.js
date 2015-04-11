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

    this.flux.actions.config.loadContract();
  },

  updateNetwork: function () {

    var web3 = this.flux.store('network').getWeb3();

    this.dispatch(constants.network.UPDATE_NETWORK, {
      accounts: web3.eth.accounts,
      peerCount: web3.net.peerCount,
      blockNumber: web3.eth.blockNumber,
      gasPrice: utilities.formatGas(web3.eth.gasPrice)
    });

    // The account may have changed. Load assets.
    this.flux.actions.asset.loadAssets();
  }
};

module.exports = NetworkActions;
