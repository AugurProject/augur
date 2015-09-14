var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function (host) {

    host = host || this.flux.store('config').getState().host;
    var branch = this.flux.store('branch').getState().currentBranch || { id: process.env.AUGUR_BRANCH_ID };
    var isHosted = false;

    // start signed out if we're not localhost
    // TODO: use a better trigger for local v. hosted than a regex
    if (!host.match(/localhost/) && !host.match(/127.0.0.1/)) {

      console.log('unsetting account');
      this.flux.actions.market.updateSharesHeld(null);
      this.dispatch(constants.config.UPDATE_ACCOUNT, { currentAccount: null });
      isHosted = true;
    }

    // FIXME: If we can, we should make defaultBranchId unnecessary. We should
    // always know which branch we're acting on in the client, and pass it to
    // EthereumClient functions.
    var ethereumClient = window.ethereumClient = new EthereumClient({
      host: host,
      defaultBranchId: branch.id,
      isHosted: isHosted
    });

    this.dispatch(constants.config.UPDATE_ETHEREUM_CLIENT_SUCCESS, {
      ethereumClient: ethereumClient,
      host: host,
      isHosted: isHosted
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
  initializeData: function () {
    var self = this;
    this.flux.actions.branch.loadBranches();
    this.flux.actions.branch.setCurrentBranch();
    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarkets();
    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.report.loadPendingReports();
    this.dispatch(constants.config.LOAD_APPLICATION_DATA_SUCCESS);

    // if we're on a hosted node, update via push notification
    // if (!augur.rpc.nodes.local) {
    // pubsub yayayayay

    // if we're on a local node, set up filters
    // } else {
      augur.filters.listen({

        // listen for new blocks
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
            console.log("price updated:", result.marketId.toString(16));
            self.flux.actions.market.loadMarket(result.marketId);
          }
        }
      });
    // }
  },

  initializeState: function() {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();
  },

  register: function (handle, password) {

    var self = this;
    augur.web.register(handle, password, function (account) {
      if (account && account.address) {
        console.log("new account registered: " + account.handle);
        console.log("address: " + account.address);
        console.log("private key: " + account.privateKey.toString("hex"));

        self.flux.actions.asset.updateAssets();

        self.dispatch(constants.config.UPDATE_ACCOUNT, {
          currentAccount: account.address,
          privateKey: account.privateKey,
          handle: account.handle
        });

      } else {
        console.log("register failed");
      }
    });
  },

  signIn: function (handle, password) {
    var self = this;
    augur.web.login(handle, password, function (account) {
      if (account && account.address) {

        console.log("signed in to account: " + account.handle);
        console.log("address: " + account.address);
        console.log("private key: " + account.privateKey.toString("hex"));

        self.flux.actions.asset.updateAssets();

        self.dispatch(constants.config.UPDATE_ACCOUNT, {
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle
        });

      } else {
        console.log("sign in failed");
      }
    });
  },

  signOut: function() {
    augur.web.logout();
    this.flux.actions.market.updateSharesHeld(null);
    this.dispatch(constants.config.UPDATE_ACCOUNT, { currentAccount: null });
  }
};

module.exports = ConfigActions;
