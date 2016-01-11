"use strict";

var abi = require("augur-abi");
var augur = require("augur.js");
var constants = require("../libs/constants");
var utilities = require("../libs/utilities");

var ConfigActions = {

  connect: function (hosted) {
    var host, self = this;
    var connectHostedCb = function (host) {
      if (!host) {
        return console.error("Couldn't connect to hosted node:", host);
      }
      console.log("connected to host:", augur.rpc.nodes.hosted[0]);
      self.flux.actions.network.checkNetwork();
    };
    if (hosted) {
      this.flux.actions.config.connectHosted(connectHostedCb);
    } else {
      host = this.flux.store('config').getState().host;
      if (!host) {
        return this.flux.actions.config.connectHosted(connectHostedCb);
      }
      augur.connect(host, null, function (connected) {
        if (connected) {
          console.log("connected to host:", augur.rpc.nodes.local || augur.rpc.nodes.hosted[0]);
          if (!augur.rpc.nodes.local) {
            self.flux.actions.config.setIsHosted(connected);
          }
          return self.flux.actions.network.checkNetwork();
        }
        self.flux.actions.config.connectHosted(connectHostedCb);
      });
    }
  },

  connectHosted: function (cb) {
    var self = this;
    augur.rpc.reset();
    augur.connect(null, null, function (connected) {
      augur.rpc.balancer = true;
      self.flux.actions.config.setIsHosted(connected);
      if (!connected) return cb(false);
      cb(augur.rpc.nodes.hosted[0]);
    });
  },

  setIsHosted: function (isHosted) {
    this.dispatch(constants.config.SET_IS_HOSTED, { isHosted: isHosted });
  },

  setHost: function (host) {
    this.dispatch(constants.config.SET_HOST, { host: host });
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
          self.flux.actions.asset.updateAssets();
        }
      },

      // listen for augur transactions
      contracts: function (filtrate) {
        if (filtrate && filtrate.address) {
          if (filtrate.error) {
            return console.log("contracts filter error:", filtrate);
          }
          console.log("[filter] contracts:", filtrate.address);
          self.flux.actions.network.updateNetwork();
          self.flux.actions.asset.updateAssets();
          self.flux.actions.branch.updateCurrentBranch();
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
          self.flux.actions.market.loadMarket(marketId);        }
      },

      // listen for new markets
      creation: function (result) {
        if (result && result.marketId) {
          console.log("[filter] creationBlock:", result.blockNumber);
          var checks = 0;
          var marketId = abi.bignum(result.marketId);
          self.flux.actions.market.loadMarket(marketId);
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
    this.dispatch(constants.config.UPDATE_ACCOUNT, {
      currentAccount: null,
      privateKey: null,
      handle: null
    });
    this.flux.actions.asset.updateAssets();
  }
};

module.exports = ConfigActions;
