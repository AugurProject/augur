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

      ethereumClient.connect();  // connect augur.js after web3 has determined the network is available :/
      this.flux.actions.network.initializeNetwork();
    }

    // check yo self
    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  initializeNetwork: function() {

    this.flux.actions.network.updateNetwork();

    // start monitoring for updates
    this.flux.actions.network.startMonitoring();
  },

  updateNetwork: function () {

    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();
    var branchState = this.flux.store('branch').getState();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var self = this;

    // just block age and peer count until we're current
    ethereumClient.getBlockNumber(function(blockNumber) {
      var blockMoment = utilities.blockToDate(blockNumber);
      self.dispatch(constants.network.UPDATE_NETWORK, { blockNumber: blockNumber, blocktime: blockMoment });
      ethereumClient.getBlock(blockNumber, function(block) {
        if (block) {
          var blockTimeStamp = web3.eth.getBlock(blockNumber).timestamp;
          var currentTimeStamp = moment().unix();
          var age = currentTimeStamp - blockTimeStamp;
          self.dispatch(constants.network.UPDATE_BLOCK_CHAIN_AGE, { blockChainAge: age });
        }
      });
    });
    ethereumClient.getPeerCount(function(peerCount) {
      self.dispatch(constants.network.UPDATE_NETWORK, { peerCount: peerCount });
    });

    if (networkState.blockChainAge && networkState.blockChainAge < constants.MAX_BLOCKCHAIN_AGE) {

      ethereumClient.getAccounts(function(accounts) {
        self.dispatch(constants.network.UPDATE_NETWORK, { accounts: accounts });
      });
      ethereumClient.getPrimaryAccount(function(account) {
        self.dispatch(constants.network.UPDATE_NETWORK, { primaryAccount: account });
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

      // load all application data if the block chain is current
      if (!configState.loaded) {

        utilities.log('ethereum is current. loading Augur...');
        this.flux.actions.config.loadApplicationData();
      }
    }
  },

  startMonitoring: function () {

    var networkState = this.flux.store('network').getState()
    if (!networkState.isMonitoringBlocks) {

      var ethereumClient = this.flux.store('config').getEthereumClient();

      ethereumClient.onNewBlock(this.flux.actions.network.updateNetwork);
    }
  }
};

module.exports = NetworkActions;
