/**
 * Mock flux actions/stores.
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var DEBUG = false;

var flux = {
    augur: require("augur.js"),
    actions: {
        asset: require("../app/actions/AssetActions"),
        branch: require("../app/actions/BranchActions"),
        config: require("../app/actions/ConfigActions"),
        market: require("../app/actions/MarketActions"),
        network: require("../app/actions/NetworkActions"),
        report: require("../app/actions/ReportActions"),
        search: require("../app/actions/SearchActions")
    },
    stores: {
        asset: require("../app/stores/AssetStore"),
        branch: require("../app/stores/BranchStore"),
        config: require("../app/stores/ConfigStore"),
        market: require("../app/stores/MarketStore"),
        network: require("../app/stores/NetworkStore"),
        report: require("../app/stores/ReportStore"),
        search: require("../app/stores/SearchStore")
    },
    register: {

        // asset
        UPDATE_ASSETS: function (payload) {
            flux.stores.asset.handleUpdateAssets(payload);
        },
        LOAD_MEAN_TRADE_PRICES_SUCCESS: function (payload) {
            flux.stores.asset.handleLoadMeanTradePricesSuccess(payload);
        },

        // branch
        LOAD_BRANCHES_SUCCESS: function (payload) {
            flux.stores.branch.handleLoadBranchesSuccess(payload);
        },
        SET_CURRENT_BRANCH_SUCCESS: function (payload) {
            flux.stores.branch.handleUpdateCurrentBranchSuccess(payload);
        },
        UPDATE_CURRENT_BRANCH_SUCCESS: function (payload) {
            flux.stores.branch.handleUpdateCurrentBranchSuccess(payload);
        },
        CHECK_QUORUM_SENT: function (payload) {
            flux.stores.branch.handleCheckQuorumSent(payload);
        },
        CHECK_QUORUM_SUCCESS: function (payload) {
            flux.stores.branch.handleCheckQuorumSuccess(payload);
        },

        // config
        SET_HOST: function (payload) {
            flux.stores.config.handleSetHost(payload);
        },
        SET_IS_HOSTED: function (payload) {
            flux.stores.config.handleSetIsHosted(payload);
        },
        UPDATE_ACCOUNT: function (payload) {
            flux.stores.config.handleUpdateAccount(payload);
        },
        UPDATE_PERCENT_LOADED_SUCCESS: function (payload) {
            flux.stores.config.handleUpdatePercentLoadedSuccess(payload);
        },
        LOAD_APPLICATION_DATA_SUCCESS: function (payload) {
            flux.stores.config.handleLoadApplicationDataSuccess(payload);
        },
        FILTER_SETUP_COMPLETE: function (payload) {
            flux.stores.config.handleFilterSetupComplete(payload);
        },
        FILTER_TEARDOWN_COMPLETE: function (payload) {
            flux.stores.config.handleFilterTeardownComplete(payload);
        },
        USER_SIGNED_OUT: function () {
            flux.stores.config.handleUserSignedOut();
        },

        // market
        LOAD_MARKETS_SUCCESS: function (payload) {
            flux.stores.market.handleLoadMarketsSuccess(payload);
            flux.stores.search.handleMarketsUpdated(payload);
        },
        UPDATE_MARKETS_SUCCESS: function (payload) {
            flux.stores.market.handleUpdateMarketsSuccess(payload);
            flux.stores.search.handleMarketsUpdated(payload);
        },
        UPDATE_MARKET_SUCCESS: function (payload) {
            flux.stores.market.handleUpdateMarketSuccess(payload);
        },
        ADD_PENDING_MARKET_SUCCESS: function (payload) {
            flux.stores.market.handleAddPendingMarketSuccess(payload);
        },
        ADD_MARKET_SUCCESS: function (payload) {
            flux.stores.market.handleAddMarketSuccess(payload);
        },
        DELETE_MARKET_SUCCESS: function (payload) {
            flux.stores.market.handleDeleteMarketSuccess(payload);
        },
        MARKETS_LOADING: function (payload) {
            flux.stores.market.handleMarketsLoading(payload);
        },
        UPDATE_ORDERS_SUCCESS: function (payload) {
            flux.stores.market.handleUpdateOrdersSuccess(payload);
        },
        LOAD_ORDERS_SUCCESS: function (payload) {
            flux.stores.market.handleLoadOrdersSuccess(payload);
        },

        // network
        UPDATE_NETWORK: function (payload) {
            flux.stores.network.handleUpdateNetwork(payload);
        },
        UPDATE_BLOCKCHAIN_AGE: function (payload) {
            flux.stores.network.handleUpdateBlockchainAge(payload);
        },
        UPDATE_ETHEREUM_STATUS: function (payload) {
            flux.stores.network.handleUpdateNetwork(payload);
        },
        UPDATE_IS_MONITORING_BLOCKS: function (payload) {
            flux.stores.network.handleUpdateIsMonitoringBlocks(payload);
        },

        // report
        LOAD_EVENTS_TO_REPORT_SUCCESS: function (payload) {
            flux.stores.report.handleLoadEventsToReportSuccess(payload);
        },
        LOAD_PENDING_REPORTS_SUCCESS: function (payload) {
            flux.stores.report.handleLoadPendingReportsSuccess(payload);
        },
        UPDATE_PENDING_REPORTS: function (payload) {
            flux.stores.report.handleLoadPendingReportsSuccess(payload);
        },
        UPDATE_EVENT_TO_REPORT: function (payload) {
            flux.stores.report.handleUpdateEventToReport(payload);
        },

        // search
        KEYWORDS_UPDATED: function (payload) {
            flux.stores.search.handleKeywordsUpdated(payload);
        },
        UPDATE_SORT_BY: function (payload) {
            flux.stores.search.handleUpdateSortBy(payload);
        }
    },
    store: function (store) {
        return this.stores[store];
    }
};
for (var s in flux.stores) {
    if (!flux.stores.hasOwnProperty(s)) continue;
    flux.stores[s].emit = function (signal) {
        if (DEBUG) console.log("[" + s + "] emit: " + signal);
    };
}
for (var a in flux.actions) {
    if (!flux.actions.hasOwnProperty(a)) continue;
    flux.actions[a].flux = flux;
    flux.actions[a].dispatch = function (label, payload) {
        if (DEBUG) console.log("dispatch: " + label);
        return flux.register[label](payload);
    };
}

module.exports = flux;
