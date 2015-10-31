var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var ConfigActions = {

  connect: function (hosted) {
    var host;
    if (hosted) {
      host = this.flux.actions.config.connectHosted();
    } else {
      host = this.flux.store('config').getState().host;
      if (!augur.connect(host)) {
        host = this.flux.actions.config.connectHosted();
      }
    }
    console.log("connected to host:", augur.rpc.nodes.local || augur.rpc.nodes.hosted[0]);
    this.flux.actions.network.checkNetwork();
  },

  connectHosted: function () {
    augur.rpc.reset();
    augur.connect();
    this.flux.actions.config.setIsHosted(true);
    this.flux.actions.config.useMarketCache(true);
    return augur.rpc.nodes.hosted[0];
  },

  setIsHosted: function (isHosted) {
    this.dispatch(constants.config.SET_IS_HOSTED, { isHosted: isHosted });
  },

  setHost: function (host) {
    this.dispatch(constants.config.SET_HOST, { host: host });
  },

  useMarketCache: function (use) {
    this.dispatch(constants.config.USE_MARKET_CACHE, { useMarketCache: use });
  },

  updatePercentLoaded: function (percent) {
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
    this.flux.actions.market.loadMarkets();
    this.flux.actions.report.loadEventsToReport();
    this.flux.actions.report.loadPendingReports();
    this.dispatch(constants.config.LOAD_APPLICATION_DATA_SUCCESS);

    // set up filters to watch the blockchain
    augur.filters.listen({

      // listen for new blocks
      block: function (blockHash) {
        if (blockHash && self.flux.store('config').getAccount()) {
          self.flux.actions.network.updateNetwork();
          self.flux.actions.asset.updateAssets();
          self.flux.actions.branch.updateCurrentBranch();
        }
      },

      // listen for augur transactions
      // contracts: function (filtrate) {
      //   if (filtrate) {
      //     if (filtrate.error) {
      //       return console.log("contracts filter error:", filtrate);
      //     }
      //     console.log("[filter] contracts:", filtrate.address);
      //     self.flux.actions.asset.updateAssets();
      //     if (self.flux.store("config").getState().useMarketCache) {
      //       setTimeout(self.flux.actions.market.loadMarkets, 5000);
      //     } else {
      //       self.flux.actions.market.loadMarkets();
      //     }
      //   }
      // },

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
              }
            })();
          } else {
            self.flux.actions.market.loadMarket(marketId);
          }
        }
      },

      // listen for new markets
      creation: function (result) {
        if (result && result.marketId) {
          console.log("[filter] creationBlock:", result.blockNumber);
          var checks = 0;
          var marketId = abi.bignum(result.marketId);
          if (self.flux.store("config").getState().useMarketCache) {
            (function checkMarketCache() {
              self.flux.actions.market.loadMarketCache();
              if (!self.flux.store("market").getMarket(marketId)) {
                if (++checks < 10) return setTimeout(checkMarketCache, 2500);
              }
            })();
          } else {
            self.flux.actions.market.loadMarket(marketId);
          }
        }
      }
    });

  },

  updateAccount: function (credentials) {
    this.dispatch(constants.config.UPDATE_ACCOUNT, {
      currentAccount: credentials.currentAccount,
      privateKey: credentials.privateKey,
      handle: credentials.handle
    });
  },

  signOut: function() {
    augur.web.logout();
    this.flux.actions.market.updateSharesHeld(null);
    this.dispatch(constants.config.UPDATE_ACCOUNT, {
      currentAccount: null,
      privateKey: null,
      handle: null
    });
    this.flux.actions.asset.updateAssets();
  }
};

module.exports = ConfigActions;
