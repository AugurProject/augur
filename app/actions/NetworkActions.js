var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var NetworkActions = {

  checkNetwork: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var networkState = this.flux.store('network').getState()

    var up = ethereumClient.isAvailable();

    if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED) && !up) {
 
      utilities.warn('failed to connect to ethereum');

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.network.ETHEREUM_STATUS_FAILED}
      );

    } else if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) && up) {

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {
          ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED
        }
      );

      // start basic latest block monitoring
      ethereumClient.startMonitoring(this.flux.actions.network.updateNetwork);

      this.flux.actions.asset.loadAssets();
      this.flux.actions.branch.loadBranches();
      this.flux.actions.market.loadMarkets();
      //this.flux.actions.branch.loadBallot();
      //this.flux.actions.event.loadEvents(); 
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

    // the account assets may have changed. reload.
    this.flux.actions.asset.loadAssets();

    // vote period may have changed
    this.flux.actions.branch.updateCurrentBranch();
    //this.flux.actions.event.updateEvents();

    //this.flux.actions.branch.loadBallot();  // should only be called on period change

    // check quorum
    var currentBranch = this.flux.store('branch').getState().currentBranch;
    ethereumClient.checkQuorum(currentBranch.id);
  }
};

module.exports = NetworkActions;
