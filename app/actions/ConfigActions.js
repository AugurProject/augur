var abi = require('../libs/abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function (host) {

    var configState = this.flux.store('config').getState();
    var branchState = this.flux.store('branch').getState();

    var clientParams = {
      host: host || configState.host,
      // FIXME: If we can, we should make defaultBranchId unnecessary. We should
      // always know which branch we're acting on in the client, and pass it to
      // EthereumClient functions.
      defaultBranchId: branchState.currentBranch ? branchState.currentBranch.id : process.env.AUGUR_BRANCH_ID
    }
    var ethereumClient = window.ethereumClient = new EthereumClient(clientParams);

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient
    });

    // update market when a price change has been detected
    var self = this;
    ethereumClient.onMarketChange(function(marketId) {

      if (marketId) {
        if (marketId < new BigNumber(2).toPower(255)) {
          marketId = marketId.plus(new BigNumber(2).toPower(256));
        }
        utilities.log('updating market ' + marketId.toString(16));
        self.flux.actions.market.loadMarket(marketId);
      }
    })
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
