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
      ethereumClient: ethereumClient,
      host: host || configState.host
    });
  },

  updatePercentLoaded: function(percent) {

    this.dispatch(constants.config.UPDATE_PERCENT_LOADED_SUCCESS, {
      percentLoaded: percent
    });
  },

  /**
   * Load all application data 
   */
  loadApplicationData: function() {

    this.flux.actions.branch.loadBranches();
    this.flux.actions.branch.setCurrentBranch();

    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarkets();
    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.report.loadPendingReports();

    this.dispatch(constants.config.LOAD_APPLICATION_DATA_SUCCESS);

    // start monitoring new blocks
    this.flux.actions.config.startMonitoring();
  },

  startMonitoring: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var self = this;

    ethereumClient.onNewBlock(function(blockHash) {

      self.flux.actions.asset.updateAssets();
      self.flux.actions.market.loadNewMarkets();

      // We pull the branch's block-dependent period information from
      // contract calls that need to be called each block.
      self.flux.actions.branch.updateCurrentBranch();

      // TODO: We can skip loading events to report if the voting period hasn't changed.
      self.flux.actions.report.loadEventsToReport();
      self.flux.actions.branch.checkQuorum();

      self.flux.actions.report.submitQualifiedReports();

    });

    // update market when a price change has been detected
    ethereumClient.onMarketChange(function(marketId) {

      if (marketId) {

        // augur.js market ids are differnt from web3 :/
        if (marketId < new BigNumber(2).toPower(255)) {
          marketId = marketId.plus(new BigNumber(2).toPower(256));
        }

        utilities.log('updating market ' + marketId.toString(16));
        self.flux.actions.market.loadMarket(marketId);
      }
    });

    // start watching for augur transactions
    ethereumClient.onAugurTx(this.flux.actions.transaction.onAugurTx);
  },

  initializeState: function() {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();
  }
};

module.exports = ConfigActions;
