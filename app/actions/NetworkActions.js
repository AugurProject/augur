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

      // stop monitoring 
      ethereumClient.stopMonitoring();

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

      ethereumClient.connect();
      this.flux.actions.network.initializeNetwork();
      this.flux.actions.config.initializeData();
    }

    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  initializeNetwork: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();

    var networkId = ethereumClient.getNetworkId();
    this.dispatch(constants.network.UPDATE_NETWORK, { networkId: networkId });

    ethereumClient.getClientVersion(function(clientVersion) {
      this.dispatch(constants.network.UPDATE_NETWORK, { clientVersion: clientVersion });
    }.bind(this));

    ethereumClient.getAccount(function(account) {
      this.dispatch(constants.config.UPDATE_ACCOUNT, {
        currentAccount: account
      });
    }.bind(this), function () {

      utilities.log('no unlocked account detected');

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.network.ETHEREUM_STATUS_NO_ACCOUNT}
      );
    }.bind(this));

    this.flux.actions.network.updateNetwork();
  },

  updateNetwork: function () {
    var configState = this.flux.store('config').getState();
    var networkState = this.flux.store('network').getState();
    var branchState = this.flux.store('branch').getState();

    // just block age and peer count until we're current
    ethereumClient.getBlockNumber(function(blockNumber) {
      var blockMoment = utilities.blockToDate(blockNumber);
      this.dispatch(constants.network.UPDATE_NETWORK, {
        blockNumber: blockNumber,
        blocktime: blockMoment
      });
      ethereumClient.getBlock(blockNumber, function(block) {
        if (block) {
          var blockTimeStamp = augur.rpc.getBlock(blockNumber).timestamp;
          var currentTimeStamp = moment().unix();
          var age = currentTimeStamp - blockTimeStamp;
          this.dispatch(constants.network.UPDATE_BLOCK_CHAIN_AGE, {
            blockChainAge: age
          });
        }
      }.bind(this));
    }.bind(this));

    ethereumClient.getPeerCount(function(peerCount) {
      this.dispatch(constants.network.UPDATE_NETWORK, { peerCount: peerCount });
    }.bind(this));

    if (networkState.blockChainAge && networkState.blockChainAge < constants.MAX_BLOCKCHAIN_AGE) {

      ethereumClient.getAccounts(function(accounts) {
        this.dispatch(constants.network.UPDATE_NETWORK, { accounts: accounts });
      }.bind(this));
      ethereumClient.getGasPrice(function(gasPrice) {
        this.dispatch(constants.network.UPDATE_NETWORK, { gasPrice: gasPrice });
      }.bind(this));
      ethereumClient.getMining(function(mining) {
        this.dispatch(constants.network.UPDATE_NETWORK, { mining: mining });
      }.bind(this));
      ethereumClient.getHashrate(function(hashrate) {
        this.dispatch(constants.network.UPDATE_NETWORK, { hashrate: hashrate });
      }.bind(this));
    }
  }

};

module.exports = NetworkActions;
