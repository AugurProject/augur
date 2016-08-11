/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var modules = [
    require("./modules/connect"),
    require("./modules/transact"),
    require("./modules/cash"),
    require("./modules/events"),
    require("./modules/markets"),
    require("./modules/trades"),
    require("./modules/buyAndSellShares"),
    require("./modules/trade"),
    require("./modules/completeSets"),
    require("./modules/createBranch"),
    require("./modules/sendReputation"),
    require("./modules/makeReports"),
    require("./modules/collectFees"),
    require("./modules/createMarket"),
    require("./modules/compositeGetters"),
    require("./modules/whitelist"),
    require("./modules/logs"),
    require("./modules/abacus"),
    require("./modules/reportingTools"),
    require("./modules/tradingActions")
];

function Augur() {
    this.version = "2.0.2";

    this.options = {
        debug: {
            tools: false,
            abi: false,
            broadcast: false,
            connect: false
        }
    };
    this.protocol = NODE_JS || document.location.protocol;

    this.connection = null;
    this.coinbase = null;
    this.from = null;

    this.constants = require("./constants");
    this.abi = require("augur-abi");
    this.utils = require("./utilities");
    this.errors = require("augur-contracts").errors;
    this.rpc = require("ethrpc");
    this.abi.debug = this.options.debug.abi;
    this.rpc.debug = this.options.debug;

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
    if (this.options.debug.tools) this.tools = require("../test/tools");
    this.sync();
}

Augur.prototype.Accounts = require("./accounts");
Augur.prototype.Filters = require("./filters");

module.exports = new Augur();
