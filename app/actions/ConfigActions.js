var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function () {

    var configState = this.flux.store('config').getState();
    var branchState = this.flux.store('branch').getState();

    var clientParams = {
      host: configState.host,
      // FIXME: If we can, we should make defaultBranchId unnecessary. We should
      // always know which branch we're acting on in the client, and pass it to
      // EthereumClient functions.
      defaultBranchId: branchState.currentBranch ? branchState.currentBranch.id : process.env.AUGUR_BRANCH_ID
    }
    var ethereumClient = window.ethereumClient = new EthereumClient(clientParams);

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });
  },

  updatePercentLoaded: function(percent) {

    this.dispatch(constants.config.UPDATE_PERCENT_LOADED_SUCCESS, {
      percentLoaded: percent
    });
  },

  initializeState: function() {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();
  }
};

module.exports = ConfigActions;
