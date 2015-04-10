var constants = require('../constants');
var utilities = require('../utilities');

var NetworkActions = {
  updateNetwork: function () {
    var web3 = this.flux.store('config').getWeb3();

    this.dispatch(constants.network.UPDATE_NETWORK, {
      accounts: web3.eth.accounts,
      peerCount: web3.net.peerCount,
      blockNumber: web3.eth.blockNumber,
      gasPrice: utilities.formatGas(web3.eth.gasPrice)
    });

    // The account may have changed. Load holdings.
    this.flux.actions.holding.loadHoldings();
  }
};

module.exports = NetworkActions;
