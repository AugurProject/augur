/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var modules = [
    require("./modules/connect"),
    require("./modules/transact"),
    require("./modules/faucets"),
    require("./modules/cash"),
    require("./modules/info"),
    require("./modules/branches"),
    require("./modules/events"),
    require("./modules/expiringEvents"),
    require("./modules/markets"),
    require("./modules/reporting"),
    require("./modules/trades"),
    require("./modules/buyAndSellShares"),
    require("./modules/trade"),
    require("./modules/completeSets"),
    require("./modules/createBranch"),
    require("./modules/sendReputation"),
    require("./modules/makeReports"),
    require("./modules/createMarket"),
    require("./modules/closeMarket"),
    require("./modules/consensus"),
    require("./modules/compositeGetters"),
    require("./modules/whitelist"),
    require("./modules/logs"),
    require("./modules/abacus")
];

function Augur() {
    this.version = "1.4.12";

    this.options = {debug: {broadcast: false, fallback: false}};
    this.protocol = NODE_JS || document.location.protocol;

    this.connection = null;
    this.coinbase = null;
    this.from = null;

    this.constants = require("./constants");
    this.abi = require("augur-abi");
    this.utils = require("./utilities");
    this.db = require("./client/db");
    this.errors = require("augur-contracts").errors;
    this.rpc = require("ethrpc");
    this.rpc.debug = this.options.debug;

    // Branch IDs
    this.branches = {dev: this.constants.DEFAULT_BRANCH_ID};

    // Load submodules
    for (var i = 0, len = modules.length; i < len; ++i) {
        for (var fn in modules[i]) {
            if (!modules[i].hasOwnProperty(fn)) continue;
            this[fn] = modules[i][fn].bind(this);
            this[fn].toString = Function.prototype.toString.bind(modules[i][fn]);
        }
    }
    this.generateOrderBook = require("./generateOrderBook").bind(this);
    this.processOrder = require("./processOrder").bind(this);
    this.createBatch = require("./batch").bind(this);
    this.web = this.Accounts();
    this.filters = this.Filters();
}

Augur.prototype.Accounts = require("./client/accounts");
Augur.prototype.Filters = require("./filters");

module.exports = new Augur();
