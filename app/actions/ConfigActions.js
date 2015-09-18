var BigNumber = require('bignumber.js');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function (host) {

    host = host || this.flux.store('config').getState().host;
    var branch = this.flux.store('branch').getCurrentBranch();
    var isHosted = false;
    var useMarketCache = this.flux.store('config').getState().useMarketCache;

    // TODO: use a better trigger for local v. hosted than a regex
    if (host.match(/localhost/) || host.match(/127.0.0.1/)) {
      useMarketCache = false;
    } else {
      isHosted = true;
      useMarketCache = true;
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
      isHosted: isHosted,
      useMarketCache: useMarketCache
    });
  },

  useMarketCache: function(useMarketCache) {

    this.dispatch(constants.config.UPDATE_USE_MARKET_CACHE, {
      useMarketCache: useMarketCache
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
          var account = self.flux.store('config').getAccount();
          if (account) {
            augur.rpc.balance(account, null, function (result) {
              if (result) {
                if (result.error) {
                  return console.log("block filter error:", result);
                }
                self.dispatch(constants.asset.UPDATE_ASSETS, {
                  ether: abi.bignum(result)
                });
              }
            });

            // TODO: We can skip loading events to report
            // if the voting period hasn't changed.
            self.flux.actions.report.loadEventsToReport();
            self.flux.actions.branch.checkQuorum();
            self.flux.actions.report.submitQualifiedReports();
          }
        },

        // listen for augur transactions
        contracts: function (filtrate) {
          if (filtrate) {
            if (filtrate.error) {
              return console.log("contracts filter error:", filtrate);
            }
            console.log("[filter] contracts:", filtrate.address);

            self.flux.actions.network.updateNetwork();
            self.flux.actions.asset.updateAssets();
            self.flux.actions.market.loadNewMarkets();

            // We pull the branch's block-dependent period information from
            // contract calls that need to be called each block.
            self.flux.actions.branch.updateCurrentBranch();
          }
        },

        // update market when a price change has been detected
        price: function (result) {
          if (result && result.marketId) {
            console.log("[filter] updatePrice:", result.marketId);
            self.flux.actions.market.loadMarkets(new BigNumber(result.marketId));
          }
        },

        // listen for new markets
        creation: function (result) {
          if (result && result.marketId) {
            console.log("[filter] creationBlock:", result.marketId, result.blockNumber);
            self.flux.actions.market.loadMarket(new BigNumber(result.marketId));
          }
        }
      });
    // }
  },

  initializeState: function() {

    this.flux.actions.config.updateEthereumClient();
    this.flux.actions.network.checkNetwork();
  },

  updateAccount: function(credentials) {

    this.dispatch(constants.config.UPDATE_ACCOUNT, {
      currentAccount: credentials.currentAccount,
      privateKey: credentials.privateKey,
      handle: credentials.handle
    });

    this.flux.actions.asset.updateAssets();
  },

  signIn: function (handle, password) {
    var self = this;
    augur.web.login(handle, password, function (account) {
      if (account) {
        if (account.error) {
          console.error(account.error, account.message);
          self.flux.actions.market.updateSharesHeld(null);
          self.dispatch(constants.config.UPDATE_ACCOUNT, {
            currentAccount: null,
            privateKey: null,
            handle: null
          });
          self.flux.actions.asset.updateAssets();
          return;
        }

        console.log("signed in to account: " + account.handle);
        console.log("address: " + account.address);
        console.log("private key: " + account.privateKey.toString("hex"));

        self.dispatch(constants.config.UPDATE_ACCOUNT, {
            currentAccount: account.address,
            privateKey: account.privateKey,
            handle: account.handle
        });
        self.flux.actions.asset.updateAssets();
      }
    });
  },

  signOut: function() {
    augur.web.logout();
    this.flux.actions.market.updateSharesHeld(null);
    this.dispatch(constants.config.UPDATE_ACCOUNT, { currentAccount: null });
    this.flux.actions.asset.updateAssets();
  }
};

module.exports = ConfigActions;
