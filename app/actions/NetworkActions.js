window.web3 = require('web3');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var NetworkActions = {

  checkNetwork: function() {

    var host = this.flux.store('config').getState().host;
    var networkState = this.flux.store('network').getState()
    var netUp;

    try {
      web3.setProvider(new web3.providers.HttpProvider('http://'+host));
      web3.eth.accounts;
      netUp = true;
    } catch(err) {
      utilities.warn('failed to connect to ethereum');
      netUp = false;
    }

    if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED) && !netUp) {
 
      // we lost our connection

      // shutdown all network filters
      _.each(networkState.filters, function(filter) {
        filter.stopWatching()
      });

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {ethereumStatus: constants.network.ETHEREUM_STATUS_FAILED}
      );

    } else if ((!networkState.ethereumStatus || networkState.ethereumStatus === constants.network.ETHEREUM_STATUS_FAILED) && netUp) {

      // connection has been established

      var filters = {
        latest: web3.eth.filter('latest'),
        pending: web3.eth.filter({fromBlock:'pending', address: web3.eth.coinbase})
      };

      this.dispatch(
        constants.network.UPDATE_ETHEREUM_STATUS,
        {
          ethereumStatus: constants.network.ETHEREUM_STATUS_CONNECTED,
          filters: filters
        }
      );

      // start network monitoring
      var self = this;

      filters.latest.watch(function (err, log) {
        if (err) utilities.error(err);
        self.flux.actions.network.updateNetwork();
      });

      filters.pending.watch(function (err, log) {
        if (err) utilities.error(err);
        utilities.log(log);
      });

      this.flux.actions.config.loadEthereumClient();
    }

    // start monitoring the client
    setTimeout(this.flux.actions.network.checkNetwork, 3000);
  },

  updateNetwork: function () {

    var web3 = this.flux.store('network').getWeb3();

    this.dispatch(constants.network.UPDATE_NETWORK, {
      accounts: web3.eth.accounts,
      primaryAccount: web3.eth.coinbase,
      peerCount: web3.net.peerCount,
      blockNumber: web3.eth.blockNumber,
      gasPrice: web3.eth.gasPrice,
      miner: true
    });

    // The account may have changed. Load assets.
    this.flux.actions.asset.loadAssets();
  }
};

module.exports = NetworkActions;
