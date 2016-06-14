/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var connector = require("ethereumjs-connect");
var contracts = require("augur-contracts");
var constants = require("./constants");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

function Augur() {
    this.version = "1.3.12";

    this.options = {debug: {broadcast: false, fallback: false}};
    this.protocol = NODE_JS || document.location.protocol;
    
    this.connection = null;
    this.coinbase = null;
    this.from = null;

    this.constants = constants;
    this.abi = abi;
    this.utils = require("./utilities");
    this.db = require("./client/db");
    this.connector = connector;
    this.errors = contracts.errors;

    rpc.debug = this.options.debug;
    this.rpc = rpc;

    // Branch IDs
    this.branches = {
        demo: "0xf69b5",
        alpha: "0xf69b5",
        dev: "0xf69b5"
    };

    // Load submodules
    this.web = this.Accounts();
    this.filters = this.Filters();
}

/************************
 * Dependent submodules *
 ************************/

Augur.prototype.Accounts = require("./client/accounts");
Augur.prototype.Filters = require("./filters");

/******************************
 * Ethereum network connector *
 ******************************/

Augur.prototype.sync = function (connector) {
    if (connector && connector.constructor === Object) {
        this.network_id = connector.network_id;
        this.from = connector.from;
        this.coinbase = connector.coinbase;
        this.tx = connector.tx;
        this.contracts = connector.contracts;
        this.init_contracts = connector.init_contracts;
        return true;
    }
    return false;
};
Augur.prototype.updateContracts = function (newContracts) {
    if (this.connector && this.connector.constructor === Object) {
        this.connector.contracts = clone(newContracts);
        this.connector.update_contracts();
        return this.sync(this.connector);
    }
    return false;
};

/** 
 * @param rpcinfo {Object|string=} Two forms accepted:
 *    1. Object with connection info fields:
 *       { http: "https://eth3.augur.net",
 *         ipc: "/path/to/geth.ipc",
 *         ws: "wss://ws.augur.net" }
 *    2. URL string for HTTP RPC: "https://eth3.augur.net"
 * @param ipcpath {string=} Local IPC path, if not provided in rpcinfo object.
 * @param cb {function=} Callback function.
 */
Augur.prototype.connect = function (rpcinfo, ipcpath, cb) {
    var options = {};
    if (rpcinfo) {
        switch (rpcinfo.constructor) {
        case String:
            options.http = rpcinfo;
            break;
        case Function:
            cb = rpcinfo;
            options.http = null;
            break;
        case Object:
            options = rpcinfo;
            break;
        default:
            options.http = null;
        }
    }
    if (ipcpath) {
        switch (ipcpath.constructor) {
        case String:
            options.ipc = ipcpath;
            break;
        case Function:
            if (!cb) {
                cb = ipcpath;
                options.ipc = null;
            }
            break;
        default:
            options.ipc = null;
        }
    }
    if (!this.utils.is_function(cb)) {
        var connected = connector.connect(options);
        this.sync(connector);
        return connected;
    }
    var self = this;
    connector.connect(options, function (connected) {
        self.sync(connector);
        cb(connected);
    });
};

/*********************************
 * ethrpc fire/transact wrappers *
 *********************************/

Augur.prototype.fire = function (tx, callback) {
    if (this.web && this.web.account && this.web.account.address) {
        tx.from = this.web.account.address;
    } else {
        tx.from = tx.from || this.coinbase;
    }
    return rpc.fire(tx, callback);
};
Augur.prototype.transact = function (tx, onSent, onSuccess, onFailed) {
    if (this.web && this.web.account && this.web.account.address) {
        tx.from = this.web.account.address;
        tx.invocation = {invoke: this.web.invoke, context: this.web};
    } else {
        tx.from = tx.from || this.coinbase;
    }
    rpc.transact(tx, onSent, onSuccess, onFailed);
};

/*************
 * Augur API *
 *************/

// faucets.se
Augur.prototype.reputationFaucet = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    if (branch && branch.constructor === Object && branch.branch) {
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        if (branch.onSent) onSent = branch.onSent;
        branch = branch.branch;
    }
    var tx = clone(this.tx.reputationFaucet);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.cashFaucet = function (onSent, onSuccess, onFailed) {
    if (onSent && onSent.constructor === Object && onSent.onSent) {
        if (onSent.onSuccess) onSuccess = onSent.onSuccess;
        if (onSent.onFailed) onFailed = onSent.onFailed;
        if (onSent.onSent) onSent = onSent.onSent;
    }
    return this.transact(clone(this.tx.cashFaucet), onSent, onSuccess, onFailed);
};
Augur.prototype.fundNewAccount = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    if (branch && branch.constructor === Object && branch.branch) {
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        if (branch.onSent) onSent = branch.onSent;
        branch = branch.branch;
    }
    var tx = clone(this.tx.fundNewAccount);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// cash.se
Augur.prototype.setCash = function (address, balance, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setCash);
    var unpacked = this.utils.unpack(address, this.utils.labels(this.setCash), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.addCash = function (ID, amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.addCash);
    var unpacked = this.utils.unpack(ID, this.utils.labels(this.addCash), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.initiateOwner = function (account, onSent, onSuccess, onFailed) {
    // account: ethereum account
    if (account && account.account) {
        if (account.onSent) onSent = account.onSent;
        if (account.onSuccess) onSuccess = account.onSuccess;
        if (account.onFailed) onFailed = account.onFailed;
        account = account.account;
    }
    var tx = clone(this.tx.initiateOwner);
    tx.params = account;
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.getCashBalance = function (account, callback) {
    // account: ethereum account
    var tx = clone(this.tx.getCashBalance);
    tx.params = account || this.from;
    return this.fire(tx, callback);
};
Augur.prototype.sendCash = function (to, value, onSent, onSuccess, onFailed) {
    // to: ethereum account
    // value: number -> fixed-point
    if (to && to.value !== null && to.value !== undefined) {
        value = to.value;
        if (to.onSent) onSent = to.onSent;
        if (to.onSuccess) onSuccess = to.onSuccess;
        if (to.onFailed) onFailed = to.onFailed;
        to = to.to;
    }
    var tx = clone(this.tx.sendCash);
    tx.params = [to, abi.fix(value, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.sendCashFrom = function (to, value, from, onSent, onSuccess, onFailed) {
    // to: ethereum account
    // value: number -> fixed-point
    // from: ethereum account
    if (to && to.value) {
        value = to.value;
        from = to.from;
        if (to.onSent) onSent = to.onSent;
        if (to.onSuccess) onSuccess = to.onSuccess;
        if (to.onFailed) onFailed = to.onFailed;
        to = to.to;
    }
    var tx = clone(this.tx.sendCashFrom);
    tx.params = [to, abi.fix(value, "hex"), from];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
// TODO unit test
Augur.prototype.depositEther = function (value, onSent, onSuccess, onFailed) {
    // value: amount of ether to exchange for cash (in ETHER, not wei!)
    if (value && value.value) {
        if (value.onSent) onSent = value.onSent;
        if (value.onSuccess) onSuccess = value.onSuccess;
        if (value.onFailed) onFailed = value.onFailed;
        value = value.value;
    }
    var tx = clone(this.tx.depositEther);
    tx.value = abi.prefix_hex(abi.bignum(value).mul(rpc.ETHER).toString(16));
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.withdrawEther = function (to, value, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.withdrawEther);
    var unpacked = this.utils.unpack(to, this.utils.labels(this.withdrawEther), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.prefix_hex(abi.bignum(tx.params[1]).mul(rpc.ETHER).toString(16));
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// info.se
Augur.prototype.getCreator = function (id, callback) {
    // id: sha256 hash id
    var tx = clone(this.tx.getCreator);
    tx.params = id;
    return this.fire(tx, callback);
};
Augur.prototype.getCreationFee = function (id, callback) {
    // id: sha256 hash id
    var tx = clone(this.tx.getCreationFee);
    tx.params = id;
    return this.fire(tx, callback);
};
Augur.prototype.getDescription = function (item, callback) {
    // item: sha256 hash id
    var tx = clone(this.tx.getDescription);
    tx.params = item;
    return this.fire(tx, callback);
};

// branches.se
Augur.prototype.initDefaultBranch = function (onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.initDefaultBranch);
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.getNumBranches = function (callback) {
    return this.fire(this.tx.getNumBranches, callback);
};
Augur.prototype.getBranches = function (callback) {
    return this.fire(this.tx.getBranches, callback);
};
Augur.prototype.getMarketsInBranch = function (branch, callback) {
    // branch: sha256 hash id
    var tx = clone(this.tx.getMarketsInBranch);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getPeriodLength = function (branch, callback) {
    // branch: sha256 hash id
    var tx = clone(this.tx.getPeriodLength);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getVotePeriod = function (branch, callback) {
    // branch: sha256 hash id
    var tx = clone(this.tx.getVotePeriod);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getReportPeriod = function (branch, callback) {
    // branch: sha256 hash id
    var tx = clone(this.tx.getReportPeriod);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getNumMarketsBranch = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getNumMarketsBranch);
    tx.params = branch;
    return this.fire(tx, callback);
    // return callback("90");
};
Augur.prototype.getNumMarkets = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getNumMarketsBranch);
    tx.params = branch;
    return this.fire(tx, callback);
    // return callback("90");
};
Augur.prototype.getMinTradingFee = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getMinTradingFee);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getBranchByNum = function (branchNumber, callback) {
    // branchNumber: integer
    var tx = clone(this.tx.getBranchByNum);
    tx.params = branchNumber;
    return this.fire(tx, callback);
};

// events.se
Augur.prototype.getmode = function (event, callback) {
    // event: sha256 hash id
    var tx = clone(this.tx.getmode);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getUncaughtOutcome = function (event, callback) {
    // event: sha256 hash id
    var tx = clone(this.tx.getUncaughtOutcome);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getMarkets = function (eventID, callback) {
    // eventID: sha256 hash id
    var tx = clone(this.tx.getMarkets);
    tx.params = eventID;
    return this.fire(tx, callback);
};
Augur.prototype.getReportingThreshold = function (event, callback) {
    var tx = clone(this.tx.getReportingThreshold);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getEventInfo = function (eventId, callback) {
    // eventId: sha256 hash id
    var self = this;
    var parse_info = function (info) {
        // eventinfo = string(7*32 + length)
        // eventinfo[0] = self.Events[event].branch
        // eventinfo[1] = self.Events[event].expirationDate 
        // eventinfo[2] = self.Events[event].outcome
        // eventinfo[3] = self.Events[event].minValue
        // eventinfo[4] = self.Events[event].maxValue
        // eventinfo[5] = self.Events[event].numOutcomes
        // eventinfo[6] = self.Events[event].bond
        // mcopy(eventinfo + 7*32, load(self.Events[event].resolutionSource[0], chars=length), length)
        if (info && info.length) {
            info[0] = abi.hex(info[0]);
            info[1] = abi.bignum(info[1]).toFixed();
            info[2] = abi.unfix(info[2], "string");
            info[3] = abi.unfix(info[3], "string");
            info[4] = abi.unfix(info[4], "string");
            info[5] = parseInt(info[5]);
            info[6] = abi.unfix(info[6], "string");
        }
        return info;
    };
    var tx = clone(this.tx.getEventInfo);
    tx.params = eventId;
    if (this.utils.is_function(callback)) {
        this.fire(tx, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
Augur.prototype.getEventBranch = function (eventId, callback) {
    var tx = clone(this.tx.getEventBranch);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getExpiration = function (eventId, callback) {
    var tx = clone(this.tx.getExpiration);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getOutcome = function (eventId, callback) {
    var tx = clone(this.tx.getOutcome);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getMinValue = function (eventId, callback) {
    var tx = clone(this.tx.getMinValue);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getMaxValue = function (eventId, callback) {
    var tx = clone(this.tx.getMaxValue);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getNumOutcomes = function (eventId, callback) {
    var tx = clone(this.tx.getNumOutcomes);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.setOutcome = function (ID, outcome, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setOutcome);
    var unpacked = this.utils.unpack(ID, this.utils.labels(this.setOutcome), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// expiringEvents.se
Augur.prototype.getEventIndex = function (period, eventID, callback) {
    var tx = clone(this.tx.getEventIndex);
    tx.params = [period, eventID];
    return this.fire(tx, callback);
};
Augur.prototype.getEvents = function (branch, reportPeriod, callback) {
    // branch: sha256 hash id
    // reportPeriod: integer
    var tx = clone(this.tx.getEvents);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getNumberEvents = function (branch, reportPeriod, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getNumberEvents);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getEvent = function (branch, reportPeriod, eventIndex, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getEvent);
    tx.params = [branch, reportPeriod, eventIndex];
    return this.fire(tx, callback);
};
Augur.prototype.getTotalRepReported = function (branch, reportPeriod, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getTotalRepReported);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReport = function (branch, reportPeriod, eventId, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getReport);
    tx.params = [branch, reportPeriod, eventId];
    return this.fire(tx, callback);
};
Augur.prototype.getReportHash = function (branch, reportPeriod, reporter, event, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getReportHash);
    tx.params = [branch, reportPeriod, reporter, event];
    return this.fire(tx, callback);
};

// markets.se
Augur.prototype.get_total_trades = function (market_id, callback) {
    var tx = clone(this.tx.get_total_trades);
    tx.params = market_id;
    return this.fire(tx, callback);
};
Augur.prototype.getOrderBook = function (marketID, callback) {
    var tx = clone(this.tx.getOrderBook);
    tx.params = marketID;
    if (!this.utils.is_function(callback)) {
        var orderArray = this.fire(tx);
        if (!orderArray || orderArray.error) return orderArray;
        var numOrders = orderArray.length / 8;
        var orders, orderBook = {buy: [], sell: []};
        for (var i = 0; i < numOrders; ++i) {
            orders = this.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
            orderBook[orders.type].push(orders);
        }
        return orderBook;
    }
    var self = this;
    this.fire(tx, function (orderArray) {
        if (!orderArray || orderArray.error) return callback(orderArray);
        var numOrders = orderArray.length / 8;
        var orders, orderBook = {buy: [], sell: []};
        for (var i = 0; i < numOrders; ++i) {
            orders = self.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
            if (!orderBook[orders.type]) orderBook[orders.type] = [];
            orderBook[orders.type].push(orders);
        }
        callback(orderBook);
    });
};
Augur.prototype.get_trade_ids = function (market_id, callback) {
    var tx = clone(this.tx.get_trade_ids);
    tx.params = market_id;
    return this.fire(tx, callback);
};
Augur.prototype.getVolume = function (market, callback) {
    var tx = clone(this.tx.getVolume);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getCreationTime = function (market, callback) {
    var tx = clone(this.tx.getCreationTime);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getForkSelection = function (market, callback) {
    var tx = clone(this.tx.getForkSelection);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getMarketInfo = function (market, callback) {
    var self = this;
    var tx = clone(this.tx.getMarketInfo);
    var unpacked = this.utils.unpack(market, this.utils.labels(this.getMarketInfo), arguments);
    tx.params = unpacked.params;
    tx.timeout = 45000;
    if (unpacked && this.utils.is_function(unpacked.cb[0])) {
        return this.fire(tx, function (marketInfo) {
            if (!marketInfo) return callback(self.errors.NO_MARKET_INFO);
            self.parseMarketInfo(marketInfo, {combinatorial: true}, function (info) {
                if (info.numEvents && info.numOutcomes) {
                    unpacked.cb[0](info);
                } else {
                    unpacked.cb[0](null);
                }
            });
        });
    }
    var marketInfo = this.parseMarketInfo(this.fire(tx));
    if (marketInfo.numOutcomes && marketInfo.numEvents) {
        return marketInfo;
    } else {
        return null;
    }
};
Augur.prototype.batchGetMarketInfo = function (marketIDs, callback) {
    var self = this;
    function batchGetMarketInfo(marketsArray) {
        var len, shift, rawInfo, info, marketID;
        if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
            return marketsArray;
        }
        var numMarkets = marketIDs.length;
        var marketsInfo = {};
        var totalLen = 0;
        for (var i = 0; i < numMarkets; ++i) {
            len = parseInt(marketsArray[totalLen]);
            shift = totalLen + 1;
            rawInfo = marketsArray.slice(shift, shift + len - 1);
            marketID = marketsArray[shift];
            info = self.parseMarketInfo(rawInfo);
            if (info && parseInt(info.numEvents) && info.numOutcomes) {
                marketsInfo[marketID] = info;
                marketsInfo[marketID].sortOrder = i;
            }
            totalLen += len;
        }
        return marketsInfo;
    }
    var tx = clone(this.tx.batchGetMarketInfo);
    tx.params = [marketIDs];
    if (!this.utils.is_function(callback)) {
        return batchGetMarketInfo(this.fire(tx));
    }
    this.fire(tx, function (marketsArray) {
        callback(batchGetMarketInfo(marketsArray));
    });
};
Augur.prototype.getMarketsInfo = function (options, callback) {
    // options: {branch, offset, numMarketsToLoad, callback}
    var self = this;
    if (this.utils.is_function(options) && !callback) {
        callback = options;
        options = {};
    }
    options = options || {};
    var branch = options.branch || this.branches.dev;
    var offset = options.offset || 0;
    var numMarketsToLoad = options.numMarketsToLoad || 0;
    if (!callback && this.utils.is_function(options.callback)) {
        callback = options.callback;
    }
    var tx = clone(this.tx.getMarketsInfo);
    tx.params = [branch, offset, numMarketsToLoad];
    tx.timeout = 240000;
    if (!this.utils.is_function(callback)) {
        return this.parseMarketsArray(this.fire(tx));
    }
    this.fire(tx, function (marketsArray) {
        callback(self.parseMarketsArray(marketsArray));
    });
};
Augur.prototype.getMarketEvents = function (market, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getMarketEvents);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getNumEvents = function (market, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getNumEvents);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getBranchID = function (market, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getBranchID);
    tx.params = market;
    return this.fire(tx, callback);
};
// Get the current number of participants in this market
Augur.prototype.getCurrentParticipantNumber = function (market, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getCurrentParticipantNumber);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getMarketNumOutcomes = function (market, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getMarketNumOutcomes);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getCumScale = function (market, callback) {
    // market: sha256
    var tx = clone(this.tx.getCumScale);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getTradingPeriod = function (market, callback) {
    // market: sha256
    var tx = clone(this.tx.getTradingPeriod);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getTradingFee = function (market, callback) {
    // market: sha256
    var tx = clone(this.tx.getTradingFee);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getWinningOutcomes = function (market, callback) {
    // market: sha256 hash id
    var self = this;
    var tx = clone(this.tx.getWinningOutcomes);
    tx.params = market;
    if (!this.utils.is_function(callback)) {
        var winningOutcomes = this.fire(tx);
        if (!winningOutcomes) return null;
        if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
            return winningOutcomes;
        }
        return winningOutcomes.slice(0, this.getMarketNumOutcomes(market));
    }
    this.fire(tx, function (winningOutcomes) {
        if (!winningOutcomes) return callback(null);
        if (winningOutcomes.error || winningOutcomes.constructor !== Array) {
            return callback(winningOutcomes);
        }
        self.getMarketNumOutcomes(market, function (numOutcomes) {
            if (numOutcomes && numOutcomes.error) {
                return callback(numOutcomes);
            }
            callback(winningOutcomes.slice(0, numOutcomes));
        });
    });
};
Augur.prototype.initialLiquidityAmount = function (market, outcome, callback) {
    var tx = clone(this.tx.initialLiquidityAmount);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getSharesPurchased = function (market, outcome, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getParticipantSharesPurchased = function (market, participantNumber, outcome, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participantNumber, outcome];
    return this.fire(tx, callback);
};
// Get the participant number (the array index) for specified address
Augur.prototype.getParticipantNumber = function (market, address, callback) {
    // market: sha256
    // address: ethereum account
    var tx = clone(this.tx.getParticipantNumber);
    tx.params = [market, address];
    return this.fire(tx, callback);
};
// Get the address for the specified participant number (array index) 
Augur.prototype.getParticipantID = function (market, participantNumber, callback) {
    // market: sha256
    var tx = clone(this.tx.getParticipantID);
    tx.params = [market, participantNumber];
    return this.fire(tx, callback);
};

// reporting.se
Augur.prototype.getRepBalance = function (branch, account, callback) {
    // branch: sha256 hash id
    // account: ethereum address (hexstring)
    var tx = clone(this.tx.getRepBalance);
    tx.params = [branch, account || this.from];
    return this.fire(tx, callback);
};
Augur.prototype.getRepByIndex = function (branch, repIndex, callback) {
    // branch: sha256
    // repIndex: integer
    var tx = clone(this.tx.getRepByIndex);
    tx.params = [branch, repIndex];
    return this.fire(tx, callback);
};
Augur.prototype.getReporterID = function (branch, index, callback) {
    // branch: sha256
    // index: integer
    var tx = clone(this.tx.getReporterID);
    tx.params = [branch, index];
    return this.fire(tx, callback);
};
Augur.prototype.getNumberReporters = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getNumberReporters);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.repIDToIndex = function (branch, repID, callback) {
    // branch: sha256
    // repID: ethereum account
    var tx = clone(this.tx.repIDToIndex);
    tx.params = [branch, repID];
    return this.fire(tx, callback);
};
Augur.prototype.getTotalRep = function (branch, callback) {
    var tx = clone(this.tx.getTotalRep);
    tx.params = branch;
    return this.fire(tx, callback);
};

// trades.se
Augur.prototype.makeTradeHash = function (max_value, max_amount, trade_ids, callback) {
    var tx = clone(this.tx.makeTradeHash);
    tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids];
    return this.fire(tx, callback);
};
Augur.prototype.commitTrade = function (hash, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.commitTrade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.commitTrade), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.setInitialTrade = function (id, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setInitialTrade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.setInitialTrade), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.getInitialTrade = function (id, callback) {
    var tx = clone(this.tx.getInitialTrade);
    tx.params = id;
    return this.fire(tx, callback);
};
Augur.prototype.zeroHash = function (onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.zeroHash);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.zeroHash), arguments);
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.checkHash = function (tradeHash, sender, callback) {
    var tx = clone(this.tx.checkHash);
    tx.params = [tradeHash, sender];
    return this.fire(tx, callback);
};
Augur.prototype.getID = function (tradeID, callback) {
    var tx = clone(this.tx.getID);
    tx.params = tradeID;
    return this.fire(tx, callback);
};
Augur.prototype.saveTrade = function (trade_id, type, market, amount, price, sender, outcome, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.saveTrade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.saveTrade), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    tx.params[4] = abi.fix(tx.params[4], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.get_trade = function (id, callback) {
    // trade = array(9)
    // trade[0] = self.trades[id].id
    // trade[1] = self.trades[id].type
    // trade[2] = self.trades[id].market
    // trade[3] = self.trades[id].amount
    // trade[4] = self.trades[id].price
    // trade[5] = self.trades[id].owner
    // trade[6] = self.trades[id].block
    // trade[7] = self.trades[id].outcome
    var self = this;
    var tx = clone(this.tx.get_trade);
    tx.params = id;
    if (!this.utils.is_function(callback)) {
        var trade = this.fire(tx);
        if (!trade || trade.error) return trade;
        return this.parseTradeInfo(trade);
    }
    this.fire(tx, function (trade) {
        if (!trade || trade.error) return callback(trade);
        callback(self.parseTradeInfo(trade));
    });
};
Augur.prototype.get_amount = function (id, callback) {
    var tx = clone(this.tx.get_amount);
    tx.params = id;
    return this.fire(tx, callback);
};
Augur.prototype.get_price = function (id, callback) {
    var tx = clone(this.tx.get_price);
    tx.params = id;
    return this.fire(tx, callback);
};
Augur.prototype.update_trade = function (id, price, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.update_trade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.update_trade), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.remove_trade = function (id, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.remove_trade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.remove_trade), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.fill_trade = function (id, fill, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.fill_trade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.fill_trade), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// expects BigNumber inputs
Augur.prototype.calculatePriceDepth = function (liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue) {
    return startingQuantity.times(minValue.plus(maxValue).minus(halfPriceWidth)).dividedBy(liquidity.minus(new BigNumber(2).times(bestStartingQuantity)));
};

/**
 * @param {Object} p
 *     market: market ID
 *     liquidity: initial cash to be placed on the order book
 *     initialFairPrices: array of midpoints used for bid/offer prices when the market opens
 *     startingQuantity: number of shares in each order
 *     bestStartingQuantity: number of shares in best bid/offer orders (optional)
 *     priceWidth: spread between best bid/offer
 *     isSimulation: if falsy generate order book; otherwise pass basic info to onSimulate callback
 * @param {Object} cb
 *     onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed
 */
Augur.prototype.generateOrderBook = function (p, cb) {
    var self = this;
    var liquidity = new BigNumber(p.liquidity);
    var numOutcomes = p.initialFairPrices.length;
    var initialFairPrices = new Array(numOutcomes);
    for (var i = 0; i < numOutcomes; ++i) {
        initialFairPrices[i] = new BigNumber(p.initialFairPrices[i]);
    }
    var startingQuantity = new BigNumber(p.startingQuantity);
    var bestStartingQuantity = new BigNumber(p.bestStartingQuantity || p.startingQuantity);
    var halfPriceWidth = new BigNumber(p.priceWidth).dividedBy(new BigNumber(2));
    cb = cb || {};
    var onSimulate = cb.onSimulate || this.utils.noop;
    var onBuyCompleteSets = cb.onBuyCompleteSets || this.utils.noop;
    var onSetupOutcome = cb.onSetupOutcome || this.utils.noop;
    var onSetupOrder = cb.onSetupOrder || this.utils.noop;
    var onSuccess = cb.onSuccess || this.utils.noop;
    var onFailed = cb.onFailed || this.utils.noop;
    this.getMarketInfo(p.market, function (marketInfo) {
        var minValue, maxValue;
        if (marketInfo.type === "scalar") {
            minValue = new BigNumber(marketInfo.events[0].minValue);
            maxValue = new BigNumber(marketInfo.events[0].maxValue);
        } else {
            minValue = new BigNumber(0);
            maxValue = new BigNumber(1);
        }
        var priceDepth = self.calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue);
        if (priceDepth.lte(constants.ZERO) || priceDepth.toNumber() === Infinity) {
            return onFailed(self.errors.INSUFFICIENT_LIQUIDITY);
        }
        var buyPrices = new Array(numOutcomes);
        var sellPrices = new Array(numOutcomes);
        var numSellOrders = new Array(numOutcomes);
        var numBuyOrders = new Array(numOutcomes);
        var shares = new BigNumber(0);
        var i, j, buyPrice, sellPrice, outcomeShares;
        for (i = 0; i < numOutcomes; ++i) {
            if (initialFairPrices[i].lt(minValue.plus(halfPriceWidth)) ||
                initialFairPrices[i].gt(maxValue.minus(halfPriceWidth))) {
                return onFailed(self.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
            }
            buyPrice = initialFairPrices[i].minus(halfPriceWidth);
            sellPrice = initialFairPrices[i].plus(halfPriceWidth);
            numBuyOrders[i] = buyPrice.minus(minValue).dividedBy(priceDepth).floor().toNumber();
            numSellOrders[i] = maxValue.minus(sellPrice).dividedBy(priceDepth).floor();
            outcomeShares = bestStartingQuantity.plus(startingQuantity.times(numSellOrders[i]));
            if (outcomeShares.gt(shares)) shares = outcomeShares;
            numSellOrders[i] = numSellOrders[i].toNumber();
            buyPrices[i] = new Array(numBuyOrders[i]);
            buyPrices[i][0] = buyPrice;
            for (j = 1; j < numBuyOrders[i]; ++j) {
                buyPrices[i][j] = buyPrices[i][j - 1].minus(priceDepth);
                if (buyPrices[i][j].lte(minValue)) {
                    buyPrices[i][j] = minValue.plus(priceDepth.dividedBy(new BigNumber(10)));
                }
            }
            sellPrices[i] = new Array(numSellOrders[i]);
            sellPrices[i][0] = sellPrice;
            for (j = 1; j < numSellOrders[i]; ++j) {
                sellPrices[i][j] = sellPrices[i][j - 1].plus(priceDepth);
                if (sellPrices[i][j].gte(maxValue)) {
                    sellPrices[i][j] = maxValue.minus(priceDepth.dividedBy(new BigNumber(10)));
                }
            }
        }
        if (p.isSimulation) {
            var numTransactions = 0;
            for (i = 0; i < numOutcomes; ++i) {
                numTransactions += numBuyOrders[i] + numSellOrders[i] + 3;
            }
            return onSimulate({
                shares: shares.toFixed(),
                numBuyOrders: numBuyOrders,
                numSellOrders: numSellOrders,
                buyPrices: abi.string(buyPrices),
                sellPrices: abi.string(sellPrices),
                numTransactions: numTransactions,
                priceDepth: priceDepth.toFixed()
            });
        }
        self.buyCompleteSets({
            market: p.market,
            amount: abi.hex(shares),
            onSent: function (res) {
                // console.log("generateOrderBook.buyCompleteSets sent:", res);
            },
            onSuccess: function (res) {
                // console.log("generateOrderBook.buyCompleteSets success:", res);
                onBuyCompleteSets(res);
                var outcomes = new Array(numOutcomes);
                for (var i = 0; i < numOutcomes; ++i) {
                    outcomes[i] = i + 1;
                }
                async.forEachOf(outcomes, function (outcome, index, nextOutcome) {
                    async.parallel([
                        function (callback) {
                            async.forEachOf(buyPrices[index], function (buyPrice, i, nextBuyPrice) {
                                // console.log("buyPrice", i, buyPrice.toFixed());
                                var amount = (!i) ? bestStartingQuantity : startingQuantity;
                                self.buy({
                                    amount: abi.hex(amount),
                                    price: abi.hex(buyPrice),
                                    market: p.market,
                                    outcome: outcome,
                                    onSent: function (res) {
                                        // console.log("generateOrderBook.buy", amount.toFixed(), buyPrice.toFixed(), outcome, "sent:", res);
                                    },
                                    onSuccess: function (res) {
                                        // console.log("generateOrderBook.buy", amount.toFixed(), buyPrice.toFixed(), outcome, "success:", res);
                                        onSetupOrder({
                                            market: p.market,
                                            outcome: outcome,
                                            amount: amount.toFixed(),
                                            buyPrice: buyPrice.toFixed()
                                        });
                                        nextBuyPrice();
                                    },
                                    onFailed: function (err) {
                                        console.error("generateOrderBook.buy", amount.toFixed(), buyPrice.toFixed(), outcome, "failed:", err);
                                        nextBuyPrice(err);
                                    }
                                });
                            }, function (err) {
                                if (err) console.error("async.each buy:", err);
                                callback(err);
                            });
                        },
                        function (callback) {
                            async.forEachOf(sellPrices[index], function (sellPrice, i, nextSellPrice) {
                                // console.log("sellPrice", i, sellPrice.toFixed());
                                var amount = (!i) ? bestStartingQuantity : startingQuantity;
                                self.sell({
                                    amount: abi.hex(amount),
                                    price: abi.hex(sellPrice),
                                    market: p.market,
                                    outcome: outcome,
                                    onSent: function (res) {
                                        // console.log("generateOrderBook.sell", amount.toFixed(), sellPrice.toFixed(), outcome, "sent:", res);
                                    },
                                    onSuccess: function (res) {
                                        // console.log("generateOrderBook.sell", amount.toFixed(), sellPrice.toFixed(), outcome, "success:", res);
                                        onSetupOrder({
                                            market: p.market,
                                            outcome: outcome,
                                            amount: amount.toFixed(),
                                            sellPrice: sellPrice.toFixed()
                                        });
                                        nextSellPrice();
                                    },
                                    onFailed: function (err) {
                                        console.error("generateOrderBook.sell", amount.toFixed(), sellPrice.toFixed(), outcome, "failed:", err);
                                        nextSellPrice(err);
                                    }
                                });
                            }, function (err) {
                                if (err) console.error("async.each sell:", err);
                                callback(err);
                            });
                        }
                    ], function (err) {
                        if (err) console.error("buy/sell:", err);
                        onSetupOutcome({market: p.market, outcome: outcome});
                        nextOutcome(err);
                    });
                }, function (err) {
                    if (err) return onFailed(err);
                    self.getOrderBook(p.market, onSuccess);
                });
            },
            onFailed: function (err) {
                console.error("generateOrderBook.buyCompleteSets failed:", err);
                onFailed(err);
            }
        });
    });
};

// buy&sellShares.se
Augur.prototype.cancel = function (trade_id, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.cancel);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.cancel), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
// TODO: buy and sell should return trade IDs
Augur.prototype.buy = function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.buy);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.buy), arguments);
    tx.params = unpacked.params;
    tx.params[0] = abi.fix(tx.params[0], "hex");
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.sell = function (amount, price, market, outcome, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.sell);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.sell), arguments);
    tx.params = unpacked.params;
    tx.params[0] = abi.fix(tx.params[0], "hex");
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.short_sell = function (buyer_trade_id, max_amount, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
    var self = this;
    if (buyer_trade_id.constructor === Object && buyer_trade_id.buyer_trade_id) {
        max_amount = buyer_trade_id.max_amount;
        onTradeHash = buyer_trade_id.onTradeHash;
        onCommitSent = buyer_trade_id.onCommitSent;
        onCommitSuccess = buyer_trade_id.onCommitSuccess;
        onCommitFailed = buyer_trade_id.onCommitFailed;
        onNextBlock = buyer_trade_id.onNextBlock;
        onTradeSent = buyer_trade_id.onTradeSent;
        onTradeSuccess = buyer_trade_id.onTradeSuccess;
        onTradeFailed = buyer_trade_id.onTradeFailed;
        buyer_trade_id = buyer_trade_id.buyer_trade_id;
    }
    onTradeHash = onTradeHash || this.utils.noop;
    onCommitSent = onCommitSent || this.utils.noop;
    onCommitSuccess = onCommitSuccess || this.utils.noop;
    onCommitFailed = onCommitFailed || this.utils.noop;
    onNextBlock = onNextBlock || this.utils.noop;
    onTradeSent = onTradeSent || this.utils.noop;
    onTradeSuccess = onTradeSuccess || this.utils.noop;
    onTradeFailed = onTradeFailed || this.utils.noop;
    this.makeTradeHash(0, max_amount, [buyer_trade_id], function (tradeHash) {
        onTradeHash(tradeHash);
        self.commitTrade({
            hash: tradeHash,
            onSent: onCommitSent,
            onSuccess: function (res) {
                onCommitSuccess(res);
                rpc.fastforward(1, function (blockNumber) {
                    onNextBlock(blockNumber);
                    var tx = clone(self.tx.short_sell);
                    tx.params = [
                        buyer_trade_id,
                        abi.fix(max_amount, "hex")
                    ];
                    self.transact(tx, function (sentResult) {
                        var result = clone(sentResult);
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 4) {
                                result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                result.callReturn[3] = abi.unfix(result.callReturn[3], "string");
                            }
                        }
                        onTradeSuccess(result);
                    }, function (successResult) {
                        var result = clone(successResult);
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 4) {
                                result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                                result.callReturn[3] = abi.unfix(result.callReturn[3], "string");
                            }
                        }
                        onTradeSuccess(result);
                    }, onTradeFailed);
                });
            },
            onFailed: onCommitFailed
        });
    });
};

/**
 * Allows trading multiple outcomes in market.
 *
 * This method can result in multiple ethereum transactions per trade order (e.g. when user wants to buy 20 shares but
 * there are only 10 ask shares on order book, this method does trade() and buy()). Callbacks are called with
 * requestId to allow client map transactions to individual trade order
 *
 * Important fields in userTradeOrder are: shares, ether (total cost + fees) and limitPrice
 *
 * Algorithm:
 *
 * for each user trade order do this:
 * 1.1/ when user wants to buy: find all asks for that outcome which have less or equal price (user
 * doesn't want to pay more than specified). Sort asks by price ascendingly (lower prices first)
 * 1.2/ when user wants to sell: find all bids in order book for that outcome which have greater or equal price
 * (user doesn't want to sell at lower price than specified). Sort bids by price descendingly (higher prices first)
 *
 * 2/ if there are no orders to match, place order to order book. exit
 *
 * if there are suitable orders in order book let's trade:
 *
 * 3/ Trade user's buy order:
 *      3.1/ if user order was filled there is nothing to do. exit
 *      3.1/ if user order was partially filled we place bid for remaining shares to order book. exit
 *
 * 4/ Trade user's sell order:
 *      4.1/ if user has position, sell shares he owns:
 *          4.1.1/ if user order was filled there is nothing to do. exit
 *          4.1.2/ if order was partially filled place ask to order book. exit
 *      4.2/ if user doesn't have position do short sell
 *          4.2.1/ if there is bid for short_sell, try to fill it. if there are still shares after filling it try again
 *          4.2.2/ if there is no bid for short_sell user has to buy complete set and then sell the outcome he wants, which
 *          results in the equal position
 *
 *
 * @param {Number} requestId Value to be passed to callbacks so client can pair callbacks with client call to this method
 * @param {String} market The market ID on which trading occurs
 * @param {Object} marketOrderBook Bids and asks for market (mixed for all outcomes)
 * @param {Object} userTradeOrdersPerOutcome Trade orders to execute (one per outcome) (usually from UI).
 * @param {Object} positionsPerOutcome User's positions per outcome
 * @param {Function} onTradeHash
 * @param {Function} onCommitSent
 * @param {Function} onCommitSuccess
 * @param {Function} onCommitFailed
 * @param {Function} onNextBlock
 * @param {Function} onTradeSent
 * @param {Function} onTradeSuccess
 * @param {Function} onTradeFailed
 * @param {Function} onBuySellSent
 * @param {Function} onBuySellSuccess
 * @param {Function} onBuySellFailed
 * @param {Function} onBuyCompleteSetsSent
 * @param {Function} onBuyCompleteSetsSuccess
 * @param {Function} onBuyCompleteSetsFailed
 */
Augur.prototype.multiTrade = function (
    requestId, market, marketOrderBook, userTradeOrdersPerOutcome, positionsPerOutcome,
    onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock,
    onTradeSent, onTradeSuccess, onTradeFailed,
    onBuySellSent, onBuySellSuccess, onBuySellFailed,
    onShortSellSent, onShortSellSuccess, onShortSellFailed,
    onBuyCompleteSetsSent, onBuyCompleteSetsSuccess, onBuyCompleteSetsFailed
) {
    var self = this;
    if (requestId.constructor === Object && requestId.requestId) {
        market = requestId.market;
        marketOrderBook = requestId.marketOrderBook;
        userTradeOrdersPerOutcome = requestId.userTradeOrdersPerOutcome;
        positionsPerOutcome = requestId.positionsPerOutcome;
        onTradeHash = requestId.onTradeHash || this.utils.noop;
        onCommitSent = requestId.onCommitSent || this.utils.noop;
        onCommitSuccess = requestId.onCommitSuccess || this.utils.noop;
        onCommitFailed = requestId.onCommitFailed || this.utils.noop;
        onNextBlock = requestId.onNextBlock || this.utils.noop;
        onTradeSent = requestId.onTradeSent || this.utils.noop;
        onTradeSuccess = requestId.onTradeSuccess || this.utils.noop;
        onTradeFailed = requestId.onTradeFailed || this.utils.noop;
        onBuySellSent = requestId.onBuySellSent || this.utils.noop;
        onBuySellSuccess = requestId.onBuySellSuccess || this.utils.noop;
        onBuySellFailed = requestId.onBuySellFailed || this.utils.noop;
        onBuyCompleteSetsSent = requestId.onBuyCompleteSetsSent || this.utils.noop;
        onBuyCompleteSetsSuccess = requestId.onBuyCompleteSetsSuccess || this.utils.noop;
        onBuyCompleteSetsFailed = requestId.onBuyCompleteSetsFailed || this.utils.noop;
        requestId = requestId.requestId;
    }
    /**
     * Recursive. Uses either short_sell or buyCompleteSets + sell
     *
     * @param tradeOrderId
     * @param matchingSortedBidIds
     * @param userTradeOrder
     */
    function shortSellUntilZero(tradeOrderId, matchingSortedBidIds, userTradeOrder) {
        var sharesLeft = new BigNumber(userTradeOrder.shares.value);
        if (matchingSortedBidIds.length > 0) {
            // 4.2.1/ there is order to fill
            var firstBuyerTradeId = matchingSortedBidIds[0];
            self.short_sell({
                buyer_trade_id: firstBuyerTradeId,
                max_amount: sharesLeft,
                onTradeHash: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onTradeHash:", data);
                    onTradeHash(tradeOrderId, data);
                },
                onCommitSent: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onCommitSent:", data);
                    onCommitSent(tradeOrderId, data);
                },
                onCommitSuccess: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onCommitSuccess:", data);
                    onCommitSuccess(tradeOrderId, data);
                },
                onCommitFailed: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onCommitFailed:", data);
                    onCommitFailed(tradeOrderId, data);
                },
                onNextBlock: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onNextBlock:", data);
                    onNextBlock(tradeOrderId, data);
                },
                onTradeSent: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onTradeSent:", data);
                    onTradeSent(tradeOrderId, data);
                },
                onTradeSuccess: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onTradeSuccess:", data);
                    onTradeSuccess(tradeOrderId, data);
                    var newSharesLeft = new BigNumber(data.callReturn[1]);
                    if (newSharesLeft.gt(constants.ZERO)) {
                        // not all user shares were shorted, recursively short
                        userTradeOrder.shares.value = newSharesLeft.toFixed();
                        shortSellUntilZero(tradeOrderId, matchingSortedBidIds.slice(1), userTradeOrder);
                    }
                },
                onTradeFailed: function (data) {
                    console.log("[multiTrade] shortSellUntilZero: onTradeFailed:", data);
                    onTradeFailed(tradeOrderId, data);
                }
            });
        } else {
            // 4.2.2/ no order to fill
            self.buyCompleteSets({
                market: market,
                amount: userTradeOrder.shares.value,
                onSent: function (data) {
                    onBuyCompleteSetsSent(requestId, data);
                },
                onSuccess: function (data) {
                    onBuyCompleteSetsSuccess(requestId, data);
                    self.sell({
                        amount: sharesLeft.toFixed(),
                        price: userTradeOrder.limitPrice,
                        market: market,
                        outcome: userTradeOrder.data.outcomeID,
                        onSent: function (data) {
                            onBuySellSent(requestId, data);
                        },
                        onSuccess: function (data) {
                            onBuySellSuccess(requestId, data);
                        },
                        onFailed: function (data) {
                            onBuySellFailed(requestId, data);
                        }
                    });
                },
                onFailed: function (data) {
                    onBuyCompleteSetsFailed(requestId, data);
                }
            });
        }
    }

    userTradeOrdersPerOutcome.forEach(function (userTradeOrder) {
        if (userTradeOrder.type === "buy_shares") {
            // 1.1/ user wants to buy
            var matchingSortedAskIds = marketOrderBook.sell
                .filter(function (ask) {
                    return ask.outcome === userTradeOrder.data.outcomeID &&
                        parseFloat(ask.price) <= userTradeOrder.limitPrice;
                }, this)
                .sort(function compareOrdersByPriceAsc(order1, order2) {
                    return order1.price < order2.price ? -1 : 0;
                })
                .map(function (ask) {
                    return ask.id;
                });

            if (matchingSortedAskIds.length === 0) {
                // 2/ there are no suitable asks on order book
                this.buy({
                    amount: userTradeOrder.ether.value,
                    price: userTradeOrder.limitPrice,
                    market: market,
                    outcome: userTradeOrder.data.outcomeID,
                    onSent: function onBuySentInner(data) {
                        console.log("[multiTrade] trade: buy: onSent:", data);
                        onBuySellSent(requestId, data);
                    },
                    onSuccess: function onBuySuccessInner(data) {
                        console.log("[multiTrade] trade: buy: onSuccess:", data);
                        onBuySellSuccess(requestId, data);
                    },
                    onFailed: function onBuyFailureInner(data) {
                        console.log("[multiTrade] trade: buy: onFail:", data);
                        onBuySellFailed(requestId, data);
                    }
                });
            } else {
                // 3/ there are orders on order book to match
                this.trade({
                    max_value: userTradeOrder.ether.value,
                    max_amount: 0,
                    trade_ids: matchingSortedAskIds,
                    onTradeHash: function (data) {
                        onTradeHash(requestId, data);
                    },
                    onCommitSent: function (data) {
                        onCommitSent(requestId, data);
                    },
                    onCommitSuccess: function (data) {
                        onCommitSuccess(requestId, data);
                    },
                    onCommitFailed: function (data) {
                        onCommitFailed(requestId, data);
                    },
                    onNextBlock: function (data) {
                        onNextBlock(requestId, data);
                    },
                    onTradeSent: function (data) {
                        onTradeSent(requestId, data);
                    },
                    onTradeSuccess: function localOnTradeSuccess(data) {
                        var etherNotFilled = Number(data.callReturn[1]);
                        if (etherNotFilled > 0) {
                            // 3.1/ order was partially filled so place bid on order book
                            self.buy({
                                amount: etherNotFilled,
                                price: userTradeOrder.limitPrice,
                                market: market,
                                outcome: userTradeOrder.data.outcomeID,
                                onSent: function localOnBuySent(data) {
                                    console.log("[multiTrade] trade: buy: onSent:", data);
                                    onBuySellSent(requestId, data);
                                },
                                onSuccess: function localOnBuySuccess(data) {
                                    console.log("[multiTrade] trade: buy: onSuccess:", data);
                                    onBuySellSuccess(requestId, data);
                                },
                                onFailed: function localOnBuyFailure(data) {
                                    console.log("[multiTrade] trade: buy: onFail:", data);
                                    onBuySellFailed(requestId, data);
                                }
                            });
                        }
                        onTradeSuccess(requestId, data);
                    },
                    onTradeFailed: function (data) {
                        onTradeFailed(requestId, data);
                    }
                });
            }
        } else {
            // 1.2/ user wants to sell
            var matchingSortedBidIds = marketOrderBook.buy
                .filter(function (bid) {
                    return bid.outcome === userTradeOrder.data.outcomeID &&
                        parseFloat(bid.price) >= userTradeOrder.limitPrice;
                })
                .sort(function compareOrdersByPriceDesc(order1, order2) {
                    return order1.price < order2.price ? 1 : 0;
                })
                .map(function (bid) {
                    return bid.id;
                });

            var userPosition = positionsPerOutcome[userTradeOrder.data.outcomeID];
            var hasUserPosition = userPosition && userPosition.qtyShares > 0;
            if (hasUserPosition) {
                if (matchingSortedBidIds.length === 0) {
                    // 2/ no bids to match => place ask on order book
                    this.sell({
                        amount: userTradeOrder.shares.value,
                        price: userTradeOrder.limitPrice,
                        market: market,
                        outcome: userTradeOrder.data.outcomeID,
                        onSent: function localOnSellSent(data) {
                            console.log("[multiTrade] trade: sell: onSent:", data);
                            onBuySellSent(requestId, data);
                        },
                        onSuccess: function localOnSellSuccess(data) {
                            console.log("[multiTrade] trade: sell: onSuccess:", data);
                            onBuySellSuccess(requestId, data);
                        },
                        onFailed: function localOnSellFailure(data) {
                            console.log("[multiTrade] trade: sell: onFail:", data);
                            onBuySellFailed(requestId, data);
                        }
                    });
                } else {
                    // 4.1/ there are bids to match
                    this.trade({
                        max_value: 0,
                        max_amount: userTradeOrder.shares.value,
                        trade_ids: matchingSortedBidIds,
                        onTradeHash: function (data) {
                            onTradeHash(requestId, data);
                        },
                        onCommitSent: function (data) {
                            onCommitSent(requestId, data);
                        },
                        onCommitSuccess: function (data) {
                            onCommitSuccess(requestId, data);
                        },
                        onCommitFailed: function (data) {
                            onCommitFailed(requestId, data);
                        },
                        onNextBlock: function (data) {
                            onNextBlock(requestId, data);
                        },
                        onTradeSent: function (data) {
                            onTradeSent(requestId, data);
                        },
                        onTradeSuccess: function localOnTradeSuccess(data) {
                            var sharesNotSold = Number(data.callReturn[2]);
                            if (sharesNotSold > 0) {
                                // 4.1.2 order was partially filled
                                self.sell({
                                    amount: sharesNotSold,
                                    price: userTradeOrder.limitPrice,
                                    market: market,
                                    outcome: userTradeOrder.data.outcomeID,
                                    onSent: function (data) {
                                        console.log("[multiTrade] trade: sell: onSent:", data);
                                        onBuySellSent(requestId, data);
                                    },
                                    onSuccess: function (data) {
                                        console.log("[multiTrade] trade: sell: onSuccess:", data);
                                        onBuySellSuccess(requestId, data);
                                    },
                                    onFailed: function (data) {
                                        console.log("[multiTrade] trade: sell: onFail:", data);
                                        onBuySellFailed(requestId, data);
                                    }
                                });
                            }
                            onTradeSuccess(requestId, data);
                        },
                        onTradeFailed: function (data) {
                            onTradeFailed(requestId, data);
                        }
                    });
                }
            } else {
                // 4.2/ no user position
                shortSellUntilZero(requestId, matchingSortedBidIds, userTradeOrder);
            }
        }
    }, this);
};

Augur.prototype.trade = function (max_value, max_amount, trade_ids, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
    var self = this;
    if (max_value.constructor === Object && max_value.max_value) {
        max_amount = max_value.max_amount;
        trade_ids = max_value.trade_ids;
        onTradeHash = max_value.onTradeHash;
        onCommitSent = max_value.onCommitSent;
        onCommitSuccess = max_value.onCommitSuccess;
        onCommitFailed = max_value.onCommitFailed;
        onNextBlock = max_value.onNextBlock;
        onTradeSent = max_value.onTradeSent;
        onTradeSuccess = max_value.onTradeSuccess;
        onTradeFailed = max_value.onTradeFailed;
        max_value = max_value.max_value;
    }
    onTradeHash = onTradeHash || this.utils.noop;
    onCommitSent = onCommitSent || this.utils.noop;
    onCommitSuccess = onCommitSuccess || this.utils.noop;
    onCommitFailed = onCommitFailed || this.utils.noop;
    onNextBlock = onNextBlock || this.utils.noop;
    onTradeSent = onTradeSent || this.utils.noop;
    onTradeSuccess = onTradeSuccess || this.utils.noop;
    onTradeFailed = onTradeFailed || this.utils.noop;
    this.makeTradeHash(max_value, max_amount, trade_ids, function (tradeHash) {
        onTradeHash(tradeHash);
        self.commitTrade({
            hash: tradeHash,
            onSent: onCommitSent,
            onSuccess: function (res) {
                onCommitSuccess(res);
                rpc.fastforward(1, function (blockNumber) {
                    onNextBlock(blockNumber);
                    var tx = clone(self.tx.trade);
                    tx.params = [
                        abi.fix(max_value, "hex"),
                        abi.fix(max_amount, "hex"),
                        trade_ids
                    ];
                    self.transact(tx, function (sentResult) {
                        var result = clone(sentResult);
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 3) {
                                result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                            }
                        }
                        onTradeSuccess(result);
                    }, function (successResult) {
                        var result = clone(successResult);
                        if (result.callReturn && result.callReturn.constructor === Array) {
                            result.callReturn[0] = parseInt(result.callReturn[0]);
                            if (result.callReturn[0] === 1 && result.callReturn.length === 3) {
                                result.callReturn[1] = abi.unfix(result.callReturn[1], "string");
                                result.callReturn[2] = abi.unfix(result.callReturn[2], "string");
                            }
                        }
                        onTradeSuccess(result);
                    }, onTradeFailed);
                });
            },
            onFailed: onCommitFailed
        });
    });
};

// completeSets.se
Augur.prototype.buyCompleteSets = function (market, amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.buyCompleteSets);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.buyCompleteSets), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.sellCompleteSets = function (market, amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.sellCompleteSets);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.sellCompleteSets), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// createBranch.se
Augur.prototype.createBranch = function (description, periodLength, parent, tradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    var self = this;
    if (description && description.parent) {
        periodLength = description.periodLength;
        parent = description.parent;
        tradingFee = description.tradingFee;
        oracleOnly = description.oracleOnly;
        if (description.onSent) onSent = description.onSent;
        if (description.onSuccess) onSuccess = description.onSuccess;
        if (description.onFailed) onFailed = description.onFailed;
        description = description.description;
    }
    oracleOnly = oracleOnly || 0;
    return this.createSubbranch({
        description: description,
        periodLength: periodLength,
        parent: parent,
        tradingFee: tradingFee,
        oracleOnly: oracleOnly,
        onSent: onSent,
        onSuccess: function (response) {
            response.branchID = self.utils.sha3([
                0,
                response.from,
                "0x2f0000000000000000",
                periodLength,
                parseInt(response.blockNumber),
                abi.hex(parent),
                parseInt(abi.fix(tradingFee, "hex")),
                oracleOnly,
                new Buffer(description, "utf8")
            ]);
            onSuccess(response);
        },
        onFailed: onFailed
    });
};
Augur.prototype.createSubbranch = function (description, periodLength, parent, tradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    if (description && description.parent) {
        periodLength = description.periodLength;
        parent = description.parent;
        tradingFee = description.tradingFee;
        oracleOnly = description.oracleOnly;
        if (description.onSent) onSent = description.onSent;
        if (description.onSuccess) onSuccess = description.onSuccess;
        if (description.onFailed) onFailed = description.onFailed;
        description = description.description;
    }
    oracleOnly = oracleOnly || 0;
    var tx = clone(this.tx.createSubbranch);
    tx.params = [
        description,
        periodLength,
        parent,
        abi.fix(tradingFee, "hex"),
        oracleOnly
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// sendReputation.se
Augur.prototype.sendReputation = function (branchId, to, value, onSent, onSuccess, onFailed) {
    // branchId: sha256
    // to: sha256
    // value: number -> fixed-point
    if (branchId && branchId.branchId && branchId.to && branchId.value) {
        to = branchId.to;
        value = branchId.value;
        if (branchId.onSent) onSent = branchId.onSent;
        if (branchId.onSuccess) onSuccess = branchId.onSuccess;
        if (branchId.onFailed) onFailed = branchId.onFailed;
        branchId = branchId.branchId;
    }
    var tx = clone(this.tx.sendReputation);
    tx.params = [branchId, to, abi.fix(value, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// makeReports.se
Augur.prototype.getNumEventsToReport = function (branch, period, callback) {
    var tx = clone(this.tx.getNumEventsToReport);
    tx.params = [branch, period];
    return this.fire(tx, callback);
};
Augur.prototype.getReportedPeriod = function (branch, period, reporter, callback) {
    var tx = clone(this.tx.getReportedPeriod);
    tx.params = [branch, period, reporter];
    return this.fire(tx, callback);
};
Augur.prototype.getNumReportsActual = function (branch, reportPeriod, callback) {
    var tx = clone(this.tx.getNumReportsActual);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getSubmittedHash = function (branch, period, reporter, callback) {
    var tx = clone(this.tx.getSubmittedHash);
    tx.params = [branch, period, reporter];
    return this.fire(tx, callback);
};
Augur.prototype.getBeforeRep = function (branch, period, callback) {
    var tx = clone(this.tx.getBeforeRep);
    tx.params = [branch, period];
    return this.fire(tx, callback);
};
Augur.prototype.getAfterRep = function (branch, period, callback) {
    var tx = clone(this.tx.getAfterRep);
    tx.params = [branch, period];
    return this.fire(tx, callback);
};
Augur.prototype.getReport = function (branch, period, event, callback) {
    var tx = clone(this.tx.getReport);
    tx.params = [branch, period, event];
    return this.fire(tx, callback);
};
Augur.prototype.getRRUpToDate = function (callback) {
    return this.fire(clone(this.tx.getRRUpToDate), callback);
};
Augur.prototype.getNumReportsExpectedEvent = function (branch, reportPeriod, eventID, callback) {
    var tx = clone(this.tx.getNumReportsExpectedEvent);
    tx.params = [branch, reportPeriod, eventID];
    return this.fire(tx, callback);
};
Augur.prototype.getNumReportsEvent = function (branch, reportPeriod, eventID, callback) {
    var tx = clone(this.tx.getNumReportsEvent);
    tx.params = [branch, reportPeriod, eventID];
    return this.fire(tx, callback);
};
Augur.prototype.makeHash = function (salt, report, event, from, indeterminate, isScalar) {
    var fixedReport;
    if (isScalar && report === "0") {
        fixedReport = "0x1";
    } else {
        fixedReport = abi.fix(report, "hex");
    }
    return this.utils.sha3([
        from || this.from,
        abi.hex(salt),
        fixedReport,
        event
    ]);
};
Augur.prototype.makeHash_contract = function (salt, report, event, sender, indeterminate, isScalar, callback) {
    if (salt.constructor === Object && salt.salt) {
        report = salt.report;
        event = salt.event;
        if (salt.callback) callback = salt.callback;
        salt = salt.salt;
    }
    var fixedReport;
    if (isScalar && report === "0") {
        fixedReport = "0x1";
    } else {
        fixedReport = abi.fix(report, "hex");
    }
    var tx = clone(this.tx.makeHash);
    tx.params = [abi.hex(salt), fixedReport, event, sender];
    return this.fire(tx, callback);
};
Augur.prototype.calculateReportingThreshold = function (branch, eventID, reportPeriod, callback) {
    var tx = clone(this.tx.calculateReportingThreshold);
    tx.params = [branch, eventID, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.submitReportHash = function (branch, reportHash, reportPeriod, eventID, eventIndex, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object && branch.branch) {
        reportHash = branch.reportHash;
        reportPeriod = branch.reportPeriod;
        eventID = branch.eventID;
        eventIndex = branch.eventIndex;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branch;
    }
    onSent = onSent || this.utils.pass;
    onSuccess = onSuccess || this.utils.pass;
    onFailed = onFailed || this.utils.pass;
    var tx = clone(this.tx.submitReportHash);
    if (eventIndex !== null && eventIndex !== undefined) {
        tx.params = [branch, reportHash, reportPeriod, eventID, eventIndex];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
    this.getEventIndex(reportPeriod, eventID, function (eventIndex) {
        if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
        if (eventIndex.error) return onFailed(eventIndex);
        tx.params = [branch, reportHash, reportPeriod, eventID, eventIndex];
        self.transact(tx, onSent, onSuccess, onFailed);
    });
};
Augur.prototype.submitReport = function (branch, reportPeriod, eventIndex, salt, report, eventID, ethics, isScalar, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object && branch.branch) {
        reportPeriod = branch.reportPeriod;
        eventIndex = branch.eventIndex;
        salt = branch.salt;
        report = branch.report;
        eventID = branch.eventID;
        ethics = branch.ethics;
        isScalar = branch.isScalar;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branch;
    }
    onSent = onSent || this.utils.pass;
    onSuccess = onSuccess || this.utils.pass;
    onFailed = onFailed || this.utils.pass;
    var fixedReport;
    if (isScalar && report === "0") {
        fixedReport = "0x1";
    } else {
        fixedReport = abi.fix(report, "hex");
    }
    var tx = clone(this.tx.submitReport);
    if (eventIndex !== null && eventIndex !== undefined) {
        tx.params = [
            branch,
            reportPeriod,
            eventIndex,
            abi.hex(salt),
            fixedReport,
            eventID,
            abi.fix(ethics, "hex")
        ];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
    this.getEventIndex(reportPeriod, eventID, function (eventIndex) {
        if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
        if (eventIndex.error) return onFailed(eventIndex);
        tx.params = [
            branch,
            reportPeriod,
            eventIndex,
            abi.hex(salt),
            fixedReport,
            eventID,
            abi.fix(ethics, "hex")
        ];
        self.transact(tx, onSent, onSuccess, onFailed);
    });
};
Augur.prototype.checkReportValidity = function (branch, report, reportPeriod, callback) {
    var tx = clone(this.tx.checkReportValidity);
    tx.params = [branch, abi.fix(report, "hex"), reportPeriod];
    return this.fire(tx, callback);
};

// createMarket.se
Augur.prototype.createSingleEventMarket = function (branchId, description, expDate, minValue, maxValue, numOutcomes, resolution, tradingFee, tags, makerFees, extraInfo, onSent, onSuccess, onFailed) {
    var self = this;
    if (branchId.constructor === Object && branchId.branchId) {
        description = branchId.description;         // string
        expDate = branchId.expDate;
        minValue = branchId.minValue;               // integer (1 for binary)
        maxValue = branchId.maxValue;               // integer (2 for binary)
        numOutcomes = branchId.numOutcomes;         // integer (2 for binary)
        resolution = branchId.resolution;
        tradingFee = branchId.tradingFee;           // number -> fixed-point
        tags = branchId.tags;
        makerFees = branchId.makerFees;
        extraInfo = branchId.extraInfo;
        onSent = branchId.onSent;                   // function
        onSuccess = branchId.onSuccess;             // function
        onFailed = branchId.onFailed;               // function
        branchId = branchId.branchId;               // sha256 hash
    }
    if (!tags || tags.constructor !== Array) tags = [];
    if (tags.length) {
        for (var i = 0; i < tags.length; ++i) {
            if (tags[i] === null || tags[i] === undefined || tags[i] === "") {
                tags[i] = "0x0";
            } else {
                tags[i] = abi.short_string_to_int256(tags[i]);
            }
        }
    }
    while (tags.length < 3) {
        tags.push("0x0");
    }
    description = description.trim();
    expDate = parseInt(expDate);
    var tx = clone(this.tx.createEvent);
    tx.params = [
        branchId,
        description,
        expDate,
        abi.fix(minValue, "hex"),
        abi.fix(maxValue, "hex"),
        numOutcomes,
        resolution
    ];
    this.transact(tx, this.utils.noop, function (res) {
        var tx = clone(self.tx.createMarket);
        tx.params = [
            branchId,
            description,
            abi.fix(tradingFee, "hex"),
            [res.callReturn],
            tags[0],
            tags[1],
            tags[2],
            abi.fix(makerFees, "hex"),
            extraInfo || ""
        ];
        rpc.gasPrice(function (gasPrice) {
            tx.gasPrice = gasPrice;
            gasPrice = abi.bignum(gasPrice);
            tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
            self.getPeriodLength(branchId, function (periodLength) {
                self.transact(tx, onSent, function (res) {
                    var tradingPeriod = abi.prefix_hex(new BigNumber(expDate).dividedBy(new BigNumber(periodLength)).floor().toString(16));
                    rpc.getBlock(res.blockNumber, false, function (block) {
                        res.marketID = self.utils.sha3([
                            tradingPeriod,
                            abi.fix(tradingFee, "hex"),
                            block.timestamp,
                            tags[0],
                            tags[1],
                            tags[2],
                            expDate,
                            new Buffer(description, "utf8").length,
                            description
                        ]);
                        onSuccess(res);
                    });
                }, onFailed);
            });
        });
    }, onFailed);
    // var tx = clone(this.tx.createSingleEventMarket);
    // tx.params = [
    //     branchId,
    //     description,
    //     expDate,
    //     abi.fix(minValue, "hex"),
    //     abi.fix(maxValue, "hex"),
    //     numOutcomes,
    //     resolution,
    //     abi.fix(tradingFee, "hex"),
    //     tags[0],
    //     tags[1],
    //     tags[2],
    //     abi.fix(makerFees, "hex"),
    //     extraInfo || ""
    // ];
    // rpc.gasPrice(function (gasPrice) {
    //     tx.gasPrice = gasPrice;
    //     gasPrice = abi.bignum(gasPrice);
    //     tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
    //     self.transact(tx, onSent, function (res) {
    //         self.getPeriodLength(branchId, function (periodLength) {
    //             rpc.getBlock(res.blockNumber, false, function (block) {
    //                 var tradingPeriod = abi.prefix_hex(new BigNumber(expDate).dividedBy(new BigNumber(periodLength)).floor().toString(16));
    //                 res.marketID = self.utils.sha3([
    //                     tradingPeriod,
    //                     abi.fix(tradingFee, "hex"),
    //                     block.timestamp,
    //                     tags[0],
    //                     tags[1],
    //                     tags[2],
    //                     expDate,
    //                     new Buffer(description, "utf8").length,
    //                     description
    //                 ]);
    //                 onSuccess(res);
    //             });
    //         });
    //     }, onFailed);
    // });
};
Augur.prototype.createEvent = function (branchId, description, expDate, minValue, maxValue, numOutcomes, resolution, onSent, onSuccess, onFailed) {
    if (branchId.constructor === Object && branchId.branchId) {
        description = branchId.description;         // string
        minValue = branchId.minValue;               // integer (1 for binary)
        maxValue = branchId.maxValue;               // integer (2 for binary)
        numOutcomes = branchId.numOutcomes;         // integer (2 for binary)
        expDate = branchId.expDate;
        resolution = branchId.resolution;
        onSent = branchId.onSent;                   // function
        onSuccess = branchId.onSuccess;             // function
        onFailed = branchId.onFailed;               // function
        branchId = branchId.branchId;               // sha256 hash
    }
    var tx = clone(this.tx.createEvent);
    tx.params = [
        branchId,
        description.trim(),
        parseInt(expDate),
        abi.fix(minValue, "hex"),
        abi.fix(maxValue, "hex"),
        numOutcomes,
        resolution
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.createMarket = function (branchId, description, tradingFee, events, tags, makerFees, extraInfo, onSent, onSuccess, onFailed) {
    var self = this;
    if (branchId.constructor === Object && branchId.branchId) {
        description = branchId.description; // string
        tradingFee = branchId.tradingFee;   // number -> fixed-point
        events = branchId.events;           // array [sha256, ...]
        tags = branchId.tags;
        makerFees = branchId.makerFees;
        extraInfo = branchId.extraInfo;
        onSent = branchId.onSent;           // function
        onSuccess = branchId.onSuccess;     // function
        onFailed = branchId.onFailed;       // function
        branchId = branchId.branchId;       // sha256 hash
    }
    if (!tags || tags.constructor !== Array) tags = [];
    if (tags.length) {
        for (var i = 0; i < tags.length; ++i) {
            if (tags[i] === null || tags[i] === undefined || tags[i] === "") {
                tags[i] = "0x0";
            } else {
                tags[i] = abi.short_string_to_int256(tags[i]);
            }
        }
    }
    while (tags.length < 3) {
        tags.push("0x0");
    }
    var tx = clone(this.tx.createMarket);
    description = description.trim();
    tx.params = [
        branchId,
        description,
        abi.fix(tradingFee, "hex"),
        events,
        tags[0],
        tags[1],
        tags[2],
        abi.fix(makerFees, "hex"),
        extraInfo || ""
    ];
    rpc.gasPrice(function (gasPrice) {
        tx.gasPrice = gasPrice;
        gasPrice = abi.bignum(gasPrice);
        tx.value = abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("1000000").times(gasPrice).times(new BigNumber(events.length - 1)).plus(new BigNumber("500000").times(gasPrice)))).toString(16));
        self.getPeriodLength(branchId, function (periodLength) {
            self.transact(tx, onSent, function (res) {
                self.getExpiration(events[0], function (expDate) {
                    expDate = parseInt(expDate);
                    var tradingPeriod = abi.prefix_hex(new BigNumber(expDate).dividedBy(new BigNumber(periodLength)).floor().toString(16));
                    rpc.getBlock(res.blockNumber, false, function (block) {
                        res.marketID = self.utils.sha3([
                            tradingPeriod,
                            abi.fix(tradingFee, "hex"),
                            block.timestamp,
                            tags[0],
                            tags[1],
                            tags[2],
                            expDate,
                            new Buffer(description, "utf8").length,
                            description
                        ]);
                        onSuccess(res);
                    });
                });
            }, onFailed);
        });
    });
};
Augur.prototype.updateTradingFee = function (branch, market, tradingFee, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.updateTradingFee);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.updateTradingFee), arguments);
    tx.params = unpacked.params;
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.pushMarketForward = function (branch, market, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.pushMarketForward);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.pushMarketForward), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// closeMarket.se
Augur.prototype.closeMarket = function (branch, market, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branch) {
        market = branch.market;
        onSent = branch.onSent;
        onSuccess = branch.onSuccess;
        onFailed = branch.onFailed;
        branch = branch.branch;
    }
    var tx = clone(this.tx.closeMarket);
    tx.params = [branch, market];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

/*******************
 * Utility methods *
 *******************/

Augur.prototype.updatePeriod = function (branch) {
    var currentPeriod = this.getCurrentPeriod(branch);
    this.incrementPeriod(branch);
    this.moveEventsToCurrentPeriod(branch, this.getVotePeriod(branch), currentPeriod);
};
Augur.prototype.parseTradeInfo = function (trade) {
    return {
        id: trade[0],
        type: (trade[1] === "0x1") ? "buy" : "sell", // 0x1=buy, 0x2=sell
        market: trade[2],
        amount: abi.unfix(trade[3], "string"),
        price: abi.unfix(trade[4], "string"),
        owner: abi.format_address(trade[5], true),
        block: parseInt(trade[6]),
        outcome: abi.string(trade[7])
    };
};
Augur.prototype.decodeTag = function (tag) {
    try {
        return (tag && tag !== "0x0" && tag !== "0x") ?
            abi.int256_to_short_string(abi.unfork(tag, true)) : null;
    } catch (exc) {
        if (this.options.debug.broadcast) console.error(exc, tag);
        return null;
    }
};
Augur.prototype.parseMarketInfo = function (rawInfo, options, callback) {
    var EVENTS_FIELDS = 6;
    var OUTCOMES_FIELDS = 2;
    var WINNING_OUTCOMES_FIELDS = 8;
    var info = {};
    if (rawInfo && rawInfo.length > 14 && rawInfo[0] && rawInfo[4] && rawInfo[7] && rawInfo[8]) {

        // all-inclusive except price history
        // info[1] = self.Markets[marketID].currentParticipant
        // info[2] = self.Markets[marketID].makerFees
        // info[3] = participantNumber
        // info[4] = self.Markets[marketID].numOutcomes
        // info[5] = self.Markets[marketID].tradingPeriod
        // info[6] = self.Markets[marketID].tradingFee
        // info[7] = self.Markets[marketID].branch
        // info[8] = self.Markets[marketID].lenEvents
        // info[9] = self.Markets[marketID].cumulativeScale
        // info[10] = self.Markets[marketID].blockNum
        // info[11] = self.Markets[marketID].volume
        // info[12] = INFO.getCreationFee(marketID)
        // info[13] = INFO.getCreator(marketID)
        // info[14] = self.Markets[marketID].tag1
        // info[15] = self.Markets[marketID].tag2
        // info[16] = self.Markets[marketID].tag3
        var index = 17;
        info = {
            network: this.network_id || rpc.version(),
            traderCount: parseInt(rawInfo[1]),
            makerFees: abi.unfix(rawInfo[2], "string"),
            traderIndex: abi.unfix(rawInfo[3], "number"),
            numOutcomes: abi.number(rawInfo[4]),
            tradingPeriod: abi.number(rawInfo[5]),
            tradingFee: abi.unfix(rawInfo[6], "string"),
            branchId: rawInfo[7],
            numEvents: parseInt(rawInfo[8]),
            cumulativeScale: abi.unfix(rawInfo[9], "string"),
            creationTime: parseInt(rawInfo[10]),
            volume: abi.unfix(rawInfo[11], "string"),
            creationFee: abi.unfix(rawInfo[12], "string"),
            author: abi.format_address(rawInfo[13]),
            tags: [
                this.decodeTag(rawInfo[14]),
                this.decodeTag(rawInfo[15]),
                this.decodeTag(rawInfo[16])
            ],
            type: null,
            endDate: null,
            winningOutcomes: [],
            description: null
        };
        info.outcomes = new Array(info.numOutcomes);
        info.events = new Array(info.numEvents);

        // organize event info
        // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
        var endDate;
        for (var i = 0; i < info.numEvents; ++i) {
            endDate = parseInt(rawInfo[i*EVENTS_FIELDS + index + 1]);
            info.events[i] = {
                id: rawInfo[i*EVENTS_FIELDS + index],
                endDate: endDate,
                outcome: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 2], "string"),
                minValue: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 3], "string"),
                maxValue: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 4], "string"),
                numOutcomes: abi.number(rawInfo[i*EVENTS_FIELDS + index + 5])
            };
            // market type: binary, categorical, or scalar
            if (info.events[i].numOutcomes !== 2) {
                info.events[i].type = "categorical";
            } else if (info.events[i].minValue === '1' && info.events[i].maxValue === '2') {
                info.events[i].type = "binary";
            } else {
                info.events[i].type = "scalar";
            }
            if (info.endDate === null || endDate < info.endDate) {
                info.endDate = endDate;
            }
        }

        // organize outcome info
        index += info.numEvents*EVENTS_FIELDS;
        for (i = 0; i < info.numOutcomes; ++i) {
            info.outcomes[i] = {
                id: i + 1,
                outstandingShares: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index], "string"),
                price: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string")
            };
        }
        index += info.numOutcomes*OUTCOMES_FIELDS;
        info.winningOutcomes = abi.string(
            rawInfo.slice(index, index + WINNING_OUTCOMES_FIELDS)
        );
        index += WINNING_OUTCOMES_FIELDS;

        // convert description byte array to unicode
        try {
            info.description = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - parseInt(rawInfo[index])));
        } catch (exc) {
            if (this.options.debug.broadcast) console.error(exc, rawInfo);
            info.description = "";
        }

        // market types: binary, categorical, scalar, combinatorial
        if (info.numEvents === 1) {
            info.type = info.events[0].type;
            if (!this.utils.is_function(callback)) return info;
            return callback(info);
        }

        // multi-event (combinatorial) markets: batch event descriptions
        info.type = "combinatorial";
        if (options && options.combinatorial) {
            var txList = new Array(info.numEvents);
            for (i = 0; i < info.numEvents; ++i) {
                txList[i] = clone(this.tx.getDescription);
                txList[i].params = info.events[i].id;
            }
            if (this.utils.is_function(callback)) {
                return rpc.batch(txList, function (response) {
                    for (var i = 0, len = response.length; i < len; ++i) {
                        info.events[i].description = response[i];
                    }
                    callback(info);
                });
            }
            var response = rpc.batch(txList);
            for (i = 0; i < response.length; ++i) {
                info.events[i].description = response[i];
            }
        }
    }
    if (!this.utils.is_function(callback)) return info;
    callback(info);
};
Augur.prototype.parseMarketsArray = function (marketsArray) {
    var numMarkets, marketsInfo, totalLen, len, shift, rawInfo, marketID;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
        return marketsArray;
    }
    numMarkets = parseInt(marketsArray.shift());
    marketsInfo = {};
    totalLen = 0;
    for (var i = 0; i < numMarkets; ++i) {
        len = parseInt(marketsArray[totalLen]);
        shift = totalLen + 1;
        rawInfo = marketsArray.slice(shift, shift + len);
        marketID = marketsArray[shift];
        marketsInfo[marketID] = {
            _id: marketID,
            sortOrder: i,
            tradingPeriod: parseInt(marketsArray[shift + 1]),
            tradingFee: abi.unfix(marketsArray[shift + 2], "string"),
            creationTime: parseInt(marketsArray[shift + 3]),
            volume: abi.unfix(marketsArray[shift + 4], "string"),
            tags: [
                this.decodeTag(marketsArray[shift + 5]),
                this.decodeTag(marketsArray[shift + 6]),
                this.decodeTag(marketsArray[shift + 7])
            ],
            endDate: parseInt(marketsArray[shift + 8]),
            description: abi.bytes_to_utf16(marketsArray.slice(shift + 9, shift + len - 1))
        };
        totalLen += len;
    }
    return marketsInfo;
};
Augur.prototype.getCurrentPeriod = function (branch, callback) {
    if (!callback) {
        return rpc.blockNumber() / parseInt(this.getPeriodLength(branch));
    }
    this.getPeriodLength(branch, function (periodLength) {
        rpc.blockNumber(function (blockNumber) {
            callback(parseInt(blockNumber) / parseInt(periodLength));
        });
    });
};

/*************
 * Consensus *
 *************/

Augur.prototype.proportionCorrect = function (event, branch, period, callback) {
    var tx = clone(this.tx.proportionCorrect);
    tx.params = [event, branch, period];
    return this.fire(tx, callback);
};
Augur.prototype.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.moveEventsToCurrentPeriod);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.moveEventsToCurrentPeriod), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.incrementPeriodAfterReporting = function (branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.incrementPeriodAfterReporting);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.incrementPeriodAfterReporting), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.penalizeNotEnoughReports = function (branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.penalizeNotEnoughReports);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.penalizeNotEnoughReports), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.penalizeWrong = function (branch, event, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.penalizeWrong);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.penalizeWrong), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.collectFees = function (branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.collectFees);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.collectFees), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.penalizationCatchup = function (branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.penalizationCatchup);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.penalizationCatchup), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.slashRep = function (branchId, salt, report, reporter, eventID, onSent, onSuccess, onFailed) {
    if (branchId.constructor === Object && branchId.branchId) {
        eventID = branchId.eventID;
        salt = branchId.salt;
        report = branchId.report;
        reporter = branchId.reporter;
        onSent = branchId.onSent;
        onSuccess = branchId.onSuccess;
        onFailed = branchId.onFailed;
        branchId = branchId.branchId;
    }
    var tx = clone(this.tx.slashRep);
    tx.params = [branchId, salt, abi.fix(report, "hex"), reporter, eventID];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

/******************************************************
 * TESTING-ONLY (whitelisted on production contracts) *
 ******************************************************/

Augur.prototype.setInfo = function (id, description, creator, fee, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setInfo);
    var unpacked = this.utils.unpack(id, this.utils.labels(this.setInfo), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.modifyShares = function (marketID, outcome, amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.modifyShares);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.modifyShares), arguments);
    tx.params = unpacked.params;
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.incrementPeriod = function (branchId, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.incrementPeriod);
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.incrementPeriod), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.addMarket = function (branchId, marketID, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.addMarket);
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.addMarket), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.addEvent = function (branchId, futurePeriod, eventID, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.addEvent);
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.addEvent), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.setTotalRepReported = function (branchId, reportPeriod, repReported, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setTotalRepReported);
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.setTotalRepReported), arguments);
    tx.params = unpacked.params;
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

/**********************
 * Price history data *
 **********************/

Augur.prototype.getMarketPriceHistory = function (market, options, cb) {
    var self = this;
    function parsePriceLogs(logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return null;
        }
        if (logs.error) throw new Error(JSON.stringify(logs));
        var outcome, parsed, priceHistory = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                parsed = rpc.unmarshal(logs[i].data);
                outcome = parseInt(parsed[4], 16);
                if (!priceHistory[outcome]) priceHistory[outcome] = [];
                priceHistory[outcome].push({
                    market: market,
                    type: parseInt(parsed[0], 16),
                    user: abi.format_address(logs[i].topics[2]),
                    price: abi.unfix(parsed[1], "string"),
                    shares: abi.unfix(parsed[2], "string"),
                    timestamp: parseInt(parsed[3], 16),
                    blockNumber: parseInt(logs[i].blockNumber, 16)
                });
            }
        }
        return priceHistory;
    }
    if (!cb && this.utils.is_function(options)) {
        cb = options;
        options = null;
    }
    options = options || {};
    var filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.trade,
        topics: [constants.LOGS.price.signature, market]
    };
    if (!this.utils.is_function(cb)) {
        return parsePriceLogs(rpc.getLogs(filter));
    }
    rpc.getLogs(filter, function (logs) {
        cb(parsePriceLogs(logs));
    });
};

Augur.prototype.meanTradePrice = function (trades, sell) {
    var price, shares, totalShares, outcomeMeanPrice, meanPrice = {};
    function include(shares) {
        return (sell) ? shares.lt(new BigNumber(0)) : shares.gt(new BigNumber(0));
    }
    for (var outcome in trades) {
        if (!trades.hasOwnProperty(outcome)) continue;
        outcomeMeanPrice = new BigNumber(0);
        totalShares = new BigNumber(0);
        for (var i = 0, n = trades[outcome].length; i < n; ++i) {
            price = new BigNumber(trades[outcome][i].price);
            shares = new BigNumber(trades[outcome][i].shares);
            if (include(shares)) {
                outcomeMeanPrice = outcomeMeanPrice.plus(price.mul(shares));
                totalShares = totalShares.plus(shares);
            }
        }
        if (include(totalShares)) {
            meanPrice[outcome] = outcomeMeanPrice.dividedBy(totalShares).toFixed();
        }
    }
    return meanPrice;
};

Augur.prototype.getAccountTrades = function (account, options, cb) {
    var self = this;
    if (!cb && this.utils.is_function(options)) {
        cb = options;
        options = null;
    }
    options = options || {};
    if (!account || !this.utils.is_function(cb)) return;
    rpc.getLogs({
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.trade,
        topics: [
            constants.LOGS.price.signature,
            null,
            abi.prefix_hex(abi.pad_left(account))
        ],
        timeout: 480000
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var market, outcome, parsed, price, timestamp, shares, type, trades = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                market = logs[i].topics[1];
                if (!trades[market]) trades[market] = {};
                parsed = rpc.unmarshal(logs[i].data);
                outcome = parseInt(parsed[4]);
                if (!trades[market][outcome]) trades[market][outcome] = [];
                trades[market][outcome].push({
                    type: parseInt(parsed[0], 16),
                    market: market,
                    price: abi.unfix(parsed[1], "string"),
                    shares: abi.unfix(parsed[2], "string"),
                    timestamp: parseInt(parsed[3], 16),
                    blockNumber: parseInt(logs[i].blockNumber, 16)
                });
            }
        }
        cb(trades);
    });
};

Augur.prototype.getAccountMeanTradePrices = function (account, cb) {
    var self = this;
    if (!this.utils.is_function(cb)) return;
    this.getAccountTrades(account, function (trades) {
        if (!trades) return cb(null);
        if (trades.error) return (trades);
        var meanPrices = {buy: {}, sell: {}};
        for (var marketId in trades) {
            if (!trades.hasOwnProperty(marketId)) continue;
            meanPrices.buy[marketId] = self.meanTradePrice(trades[marketId]);
            meanPrices.sell[marketId] = self.meanTradePrice(trades[marketId], true);
        }
        cb(meanPrices);
    });
};

/**
 * Batch interface:
 * var b = augur.createBatch();
 * b.add("getCashBalance", [augur.coinbase], callback);
 * b.add("getRepBalance", [augur.branches.dev, augur.coinbase], callback);
 * b.execute();
 */
var Batch = function (tx) {
    this.tx = tx;
    this.txlist = [];
};

Batch.prototype.add = function (method, params, callback) {
    if (method) {
        var tx = clone(this.tx[method]);
        tx.params = params;
        if (callback) tx.callback = callback;
        this.txlist.push(tx);
    }
};

Batch.prototype.execute = function () {
    rpc.batch(this.txlist, true);
};

Augur.prototype.createBatch = function createBatch () {
    return new Batch(this.tx);
};

module.exports = new Augur();
