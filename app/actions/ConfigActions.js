var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    var configState = this.flux.store('config').getState();
    var ethereumClient = window.ethereumClient = configState.ethereumClient || new EthereumClient(configState.host);

    if (!ethereumClient) {
      this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_FAILED);
      return;
    }

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });
  },

  loadEthereumClient: function () {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();

    // just setting this to 100 for now
    this.dispatch(constants.config.UPDATE_PERCENT_LOADED, {
      percentLoaded: 100
    });

    this.flux.actions.network.updateNetwork();
    //this.flux.actions.branch.loadBranches();
    //this.flux.actions.event.loadEvents();
    this.flux.actions.market.loadMarkets();
  }
};

module.exports = ConfigActions;
