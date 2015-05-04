var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    var configState = this.flux.store('config').getState();
    var ethereumClient = window.ethereumClient = configState.ethereumClient || new EthereumClient(configState.host);

    // TODO: refactor this config state
    // EthereumClient is now a class interface that does not fail.  
    // network status serves this purpose
    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });
  },

  loadEthereumClient: function () {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();
  }
};

module.exports = ConfigActions;
