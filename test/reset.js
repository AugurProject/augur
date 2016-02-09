/**
 * Flux/augur.js state reset.
 */

"use strict";

module.exports = function (flux) {
    if (!flux || !flux.stores) return flux;
    if (flux.augur) {
        delete require.cache[require.resolve("augur.js")];
        flux.augur = require("augur.js");
        flux.augur.connect();
    }
    if (flux.stores.config) {
        flux.stores.config.state = {
            host: null,
            currentAccount: null,
            privateKey: null,
            handle: null,
            keystore: null,
            debug: false,
            loaded: false,
            isHosted: true,
            percentLoaded: null,
            filters: {},
            isNewRegistration: false
        };
    }
    if (flux.stores.network) {
        flux.stores.network.state = {
            peerCount: null,
            blockNumber: null,
            blocktime: null,
            ether: null,
            gasPrice: null,
            ethereumStatus: null,
            mining: null,
            hashrate: null,
            clientVersion: null,
            networkId: null,
            blockchainAge: null,
            isMonitoringBlocks: false,
            hasCheckedQuorum: false
        };
    }
    if (flux.stores.market) {
        flux.stores.market.state = {
            markets: {},
            pendingMarkets: {},
            orders: {},
            marketLoadingIds: null,
            loadingPage: null,
            marketsPerPage: 15
        };
    }
    if (flux.stores.search) {
        flux.stores.search.state = {
            keywords: '',
            sortBy: '',
            reverseSort: null,
            cleanKeywords: [],
            markets: {},
            results: {}
        };
    }
    if (flux.stores.report) {
        flux.stores.report.state = {
            eventsToReport: {},
            pendingReports: []
        };
    }
    if (flux.stores.asset) {
        flux.stores.asset.state = {
            cash: null,
            reputation: null,
            ether: null,
            meanTradePrices: {}
        };
    }
    if (flux.stores.branch) {
        flux.stores.branch.state = {
            branches: [],
            currentBranch: null
        };
    }
    return flux;
};
