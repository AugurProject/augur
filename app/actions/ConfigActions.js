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
  initializeData: function() {

    this.flux.actions.branch.loadBranches();
    this.flux.actions.branch.setCurrentBranch();

    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarkets();

    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.report.loadPendingReports();

    this.dispatch(constants.config.LOAD_APPLICATION_DATA_SUCCESS);

    // start monitoring block, contract and price filters
    this.flux.actions.config.startMonitoring();
  },

  startMonitoring: function() {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var self = this;

    ethereumClient.startFiltering({

      block: function (blockHash) {
        self.flux.actions.network.updateNetwork();
        self.flux.actions.asset.updateAssets();
        self.flux.actions.market.loadNewMarkets();

        // We pull the branch's block-dependent period information from
        // contract calls that need to be called each block.
        self.flux.actions.branch.updateCurrentBranch();

        // TODO: We can skip loading events to report if the voting period hasn't changed.
        self.flux.actions.report.loadEventsToReport();
        self.flux.actions.branch.checkQuorum();

        self.flux.actions.report.submitQualifiedReports();
      },

      // listen for augur transactions
      contracts: self.flux.actions.transaction.onAugurTx,

      // update market when a price change has been detected
      price: function (result) {
        if (result && result.marketId) {
          log("price updated:", result.marketId.toString(16));
          self.flux.actions.market.loadMarket(result.marketId);
        }
      }
    });

  },

  initializeState: function() {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();

    // start signed out if we're using the demo
    if (this.flux.store('config').getEthereumClient().isDemoAccount) {
      this.flux.actions.market.updateSharesHeld(null);
      this.dispatch(constants.config.UPDATE_ACCOUNT, { currentAccount: null });
    }
  },

  register: function (handle, password) {

    var self = this;
    var client = this.flux.store('config').getEthereumClient();

    client.register(handle, password, function (account) {

      if (account && account.address) {

        // TODO put this info in a modal + make a button so user can look it up
        utilities.log("new account registered: " + account.handle);
        utilities.log("address: " + account.address);
        utilities.log("private key: " + account.privateKey.toString("hex"));

        self.flux.actions.asset.updateAssets();

        self.dispatch(constants.config.UPDATE_ACCOUNT, {
          currentAccount: account.address,
          privateKey: account.privateKey,
          handle: account.handle
        });

      } else {
        utilities.log("register failed");
      }
    });
  },

  signIn: function (handle, password) {

    var self = this;
    var client = this.flux.store('config').getEthereumClient();

    client.signIn(handle, password, function (account) {

      if (account && account.address) {

        // TODO put this info in a modal + make a button so user can look it up
        utilities.log("signed in to account: " + account.handle);
        utilities.log("address: " + account.address);
        utilities.log("private key: " + account.privateKey.toString("hex"));

        self.flux.actions.asset.updateAssets();

        self.dispatch(constants.config.UPDATE_ACCOUNT, {
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle
        });

      } else {
        utilities.log("sign in failed");
      }
    });
  },

  signOut: function() {

    this.flux.store('config').getEthereumClient().signOut();
    this.flux.actions.market.updateSharesHeld(null);
    utilities.log("signed out");
    this.dispatch(constants.config.UPDATE_ACCOUNT, { currentAccount: null });
  }
};

module.exports = ConfigActions;
