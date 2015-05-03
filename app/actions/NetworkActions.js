var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var NetworkActions = {

  checkNetwork: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var networkState = this.flux.store('network').getState()

    var up = ethereumClient.isAvailable();

    if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED) && !up) {
 
      utilities.warn('failed to connect to ethereum');

      // shutdown all network filters
      ethereumClient.stopMonitoring();

    } else if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) && up) {

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {
          ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED
        }
      );

      // start basic latest block monitoring
      ethereumClient.startMonitoring(this.flux.actions.network.updateNetwork);
    }

    // check yo self
    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  updateNetwork: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var networkStats = ethereumClient.getStats();

    this.dispatch(constants.network.UPDATE_NETWORK, {
      accounts: ethereumClient.getAccounts(),
      primaryAccount: ethereumClient.getPrimaryAccount(),
      peerCount: networkStats.peerCount,
      blockNumber: networkStats.blockNumber,
      gasPrice: networkStats.gasPrice,
      mining: networkStats.mining,
      hashrate: networkStats.hashrate
    });

    // the account may have changed. load assets.
    this.flux.actions.asset.loadAssets();
  }
};

module.exports = NetworkActions;
