var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var NetworkActions = {

  /**
   * Update the UI and stores depending on the state of the network.
   *
   * If the daemon just became reachable (including startup), load the
   * latest data and ensure that we're monitoring new blocks to update our
   * stores. If our Ethereum daemon just became unreachable, dispatch an event so
   * an error dialog can be display.
   */
  checkNetwork: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var networkState = this.flux.store('network').getState()

    var nowUp = ethereumClient.isAvailable();
    var wasUp = (
      !networkState.ethereumStatus ||
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED
    );
    var wasDown = (
      !networkState.ethereumStatus ||
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED
    );

    if (wasUp && !nowUp) {

      utilities.warn('failed to connect to ethereum');

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.network.ETHEREUM_STATUS_FAILED}
      );

    } else if (wasDown && nowUp) {

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {
          ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED
        }
      );

      this.flux.actions.network.loadEverything();
      this.flux.actions.network.startMonitoring();
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

    this.flux.actions.branch.updateCurrentBranch();
    //this.flux.actions.event.updateEvents();

    // TODO: the following methods should only be called on period change to be nicer
    this.flux.actions.branch.loadBallots();

    var currentBranch = this.flux.store('branch').getState().currentBranch;
    ethereumClient.checkQuorum(currentBranch.id);
  },

  loadEverything: function () {
    this.flux.actions.network.updateNetwork();
    this.flux.actions.asset.loadAssets();
    this.flux.actions.branch.loadBranches();
    this.flux.actions.market.loadMarkets();
    this.flux.actions.branch.loadBallots();
  },

  startMonitoring: function () {
    var networkState = this.flux.store('network').getState()
    if (!networkState.isMonitoringBlocks) {
      var ethereumClient = this.flux.store('config').getEthereumClient();
      ethereumClient.startMonitoring(this.flux.actions.network.updateNetwork);
      // TODO: Update more than just the network data on each block.
    }
  }
};

module.exports = NetworkActions;
