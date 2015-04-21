var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    //var account = this.flux.store('network').getAccount();
    var web3 = require('web3');
    var ethereumClient = new EthereumClient(web3.eth.coinbase);

    if (!ethereumClient) {

      this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_FAILED);
      return;
    }

    // console object for testing/debuging
    var self = this;
    window.augur = {
      client: ethereumClient,
      debug: function(state) {
        if (typeof(state === 'boolean')) {
          self.flux.actions.config.updateDebug(state);
        }
        return self.flux.store('config').getState().debug;
      }
    }

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });

    // just setting this to 100 for now
    this.dispatch(constants.config.UPDATE_PERCENT_LOADED, {
      percentLoaded: 100
    });

    this.flux.actions.network.updateNetwork();
    this.flux.actions.branch.loadBranches();
    this.flux.actions.event.loadEvents();
    this.flux.actions.market.loadMarkets();
  },

  loadEthereumClient: function () {

    this.flux.actions.config.updateEthereumClient();
  },

  updateDebug: function (debug) {
    this.dispatch(constants.config.UPDATE_DEBUG, {debug: debug});
  }

};

module.exports = ConfigActions;
