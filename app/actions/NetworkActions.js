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
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED
    );
    var wasDown = (
      !networkState.ethereumStatus ||
      networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED
    );

    if (!nowUp) {

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
    }

    // check yo self
    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  updateNetwork: function () {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var self = this;

    ethereumClient.getAccounts(function(accounts) {
      self.dispatch(constants.network.UPDATE_NETWORK, { accounts: accounts });
    });
    ethereumClient.getPrimaryAccount(function(account) {
      self.dispatch(constants.network.UPDATE_NETWORK, { primaryAccount: account });
    });
    ethereumClient.getPeerCount(function(peerCount) {
      self.dispatch(constants.network.UPDATE_NETWORK, { peerCount: peerCount });
    });
    ethereumClient.getBlockNumber(function(blockNumber) {
      var blockMoment = utilities.blockToDate(blockNumber);
      self.dispatch(constants.network.UPDATE_NETWORK, { blockNumber: blockNumber, blocktime: blockMoment.format('MMM Do, HH:mm') });
    });
    ethereumClient.getGasPrice(function(gasPrice) {
      self.dispatch(constants.network.UPDATE_NETWORK, { gasPrice: gasPrice });
    });
    ethereumClient.getMining(function(mining) {
      self.dispatch(constants.network.UPDATE_NETWORK, { mining: mining });
    });
    ethereumClient.getHashrate(function(hashrate) {
      self.dispatch(constants.network.UPDATE_NETWORK, { hashrate: hashrate });
    });

    var blockChainAge = ethereumClient.blockChainAge();
    this.dispatch(constants.network.UPDATE_BLOCK_CHAIN_AGE, { blockChainAge: blockChainAge });
  },

  /**
   * Load all of the application's data, particularly during initialization.
   */
  loadEverything: function () {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.updateNetwork();

    this.flux.actions.branch.loadBranches();
    this.flux.actions.branch.setCurrentBranch();

    this.flux.actions.asset.loadAssets();
    this.flux.actions.market.loadMarkets();
    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.report.loadPendingReports();

    // start monitoring for updates
    this.flux.actions.network.startMonitoring();
  },

  /**
   * Update data that should change over time in the UI.
   */
  onNewBlock: function () {

    this.flux.actions.network.updateNetwork();
    this.flux.actions.asset.loadAssets();
    this.flux.actions.market.loadNewMarkets();

    // We pull the branch's block-dependent period information from
    // contract calls that need to be called each block.
    this.flux.actions.branch.updateCurrentBranch();

    // TODO: We can skip loading events to report if the voting period hasn't changed.
    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.branch.checkQuorum();

    this.flux.actions.report.submitQualifiedReports();
  },

  startMonitoring: function () {
    var networkState = this.flux.store('network').getState()
    if (!networkState.isMonitoringBlocks) {
      var ethereumClient = this.flux.store('config').getEthereumClient();
      ethereumClient.startMonitoring(this.flux.actions.network.onNewBlock);
    }
  }
};

module.exports = NetworkActions;
