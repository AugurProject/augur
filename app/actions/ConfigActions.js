var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var ConfigActions = {

  updateEthereumClient: function (host) {

    host = (host === undefined) ? this.flux.store('config').getState().host : host;
    var branch = this.flux.store('branch').getCurrentBranch();
    var isHosted = false;
    var useMarketCache = false;

    // TODO: use a better trigger for local v. hosted than a regex
    if (host && !host.match(/localhost/) && !host.match(/127.0.0.1/)) {
      useMarketCache = true;
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

    // set up filters to watch the blockchain
    augur.filters.listen({

      // listen for new blocks
      block: function (blockHash) {
        var account = self.flux.store('config').getAccount();
        if (account && blockHash) {
          self.flux.actions.network.updateNetwork();
          self.flux.actions.asset.updateAssets();

          // TODO: We can skip loading events to report
          // if the voting period hasn't changed.
          self.flux.actions.report.loadEventsToReport();
          self.flux.actions.branch.checkQuorum();
          self.flux.actions.report.submitQualifiedReports();

          self.flux.actions.branch.updateCurrentBranch();
        }
      },

      // listen for augur transactions
      contracts: function (filtrate) {
        if (filtrate) {
          if (filtrate.error) {
            return console.log("contracts filter error:", filtrate);
          }
          console.log("[filter] contracts:", filtrate.address);

          self.flux.actions.asset.updateAssets();

          if (self.flux.store("config").getState().useMarketCache) {
            setTimeout(self.flux.actions.market.loadMarkets, 5000);
          } else {
            self.flux.actions.market.loadNewMarkets();
          }
        }
      },

      // update market when a price change has been detected
      price: function (result) {
        if (result && result.marketId) {
          console.log("[filter] updatePrice:", result.marketId);
          var checks = 0;
          var marketId = abi.bignum(result.marketId);
          var getMarket = self.flux.store("market").getMarket;
          var outcomeIdx = result.outcome - 1;
          var oldPrice = getMarket(marketId).outcomes[outcomeIdx].price;
          self.flux.actions.asset.updateAssets();
          if (self.flux.store("config").getState().useMarketCache) {
            (function checkMarketCache() {
              self.flux.actions.market.loadMarketCache();
              if (getMarket(marketId).outcomes[outcomeIdx].price.eq(oldPrice)) {
                if (++checks < 10) return setTimeout(checkMarketCache, 2500);
                self.flux.actions.market.loadMarket(marketId);
              }
            })();
          } else {
            self.flux.actions.market.loadMarket(marketId);
          }
        }
      },

      // listen for new markets
      creation: function (result) {
        console.log("creationBlock:", result);
        if (result && result.marketId) {
          console.log("[filter] creationBlock:", result.blockNumber);
          var checks = 0;
          var marketId = abi.bignum(result.marketId);
          if (self.flux.store("config").getState().useMarketCache) {
            (function checkMarketCache() {
              self.flux.actions.market.loadMarketCache();
              if (!self.flux.store("market").getMarket(marketId)) {
                if (++checks < 10) return setTimeout(checkMarketCache, 2500);
                self.flux.actions.market.loadMarket(marketId);
              }
            })();
          } else {
            self.flux.actions.market.loadMarket(marketId);
          }
        }
      }
    });
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
        self.flux.actions.report.loadEventsToReport();
        self.flux.actions.report.loadPendingReports();
        if (self.flux.store("config").getState().useMarketCache) {
          self.flux.actions.market.loadMarkets();
        }
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
