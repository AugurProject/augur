var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    var configState = this.flux.store('config').getState();
    var clientParams = {
      host: configState.host,
      defaultBranchId: configState.rootBranchId
    }
    var ethereumClient = window.ethereumClient = configState.ethereumClient || new EthereumClient(clientParams);

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });
  },

  loadEthereumClient: function () {

    var configState = this.flux.store('config').getState();

    this.flux.actions.config.updateEthereumClient();

    this.flux.actions.network.checkNetwork();
    this.flux.actions.network.updateNetwork();
    this.flux.actions.branch.updateCurrentBranch(configState.rootBranchId);
  }
};

module.exports = ConfigActions;
