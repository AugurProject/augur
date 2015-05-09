var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    var configState = this.flux.store('config').getState();
    var clientParams = {
      host: configState.host,
      defaultBranchId: 1010101
    }
    var ethereumClient = window.ethereumClient = configState.ethereumClient || new EthereumClient(clientParams);

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
    this.flux.actions.network.updateNetwork();
  }
};

module.exports = ConfigActions;
