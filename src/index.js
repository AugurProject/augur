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

var options = {debug: {broadcast: false, fallback: false}};

function Augur() {
    var self = this;
    this.options = options;
    this.protocol = NODE_JS || document.location.protocol;

    this.connection = null;
    this.coinbase = null;
    this.from = null;

    this.constants = constants;
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

Augur.prototype.connect = function (rpcinfo, ipcpath, cb) {
    if (!this.utils.is_function(cb)) {
        var connected = connector.connect(rpcinfo, ipcpath);
        this.sync(connector);
        return connected;
    }
    var self = this;
    connector.connect(rpcinfo, ipcpath, function (connected) {
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
Augur.prototype.getBranch = function (branchNumber, callback) {
    // branchNumber: integer
    var tx = clone(this.tx.getBranch);
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
        // info = array(6)
        // info[0] = self.Events[event].branch
        // info[1] = self.Events[event].expirationDate
        // info[2] = self.Events[event].outcome
        // info[3] = self.Events[event].minValue
        // info[4] = self.Events[event].maxValue
        // info[5] = self.Events[event].numOutcomes
        if (info && info.length) {
            info[0] = abi.hex(info[0]);
            info[1] = abi.bignum(info[1]).toFixed();
            info[2] = abi.unfix(info[2], "string");
            info[3] = abi.bignum(info[3]).toFixed();
            info[4] = abi.bignum(info[4]).toFixed();
            info[5] = abi.bignum(info[5]).toFixed();
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
Augur.prototype.getVolume = function (market, callback) {
    var tx = clone(this.tx.getVolume);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getCreationBlock = function (market, callback) {
    var tx = clone(this.tx.getCreationBlock);
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
                info._id = market;
                unpacked.cb[0](info);
            });
        });
    }
    var marketInfo = this.parseMarketInfo(this.fire(tx));
    if (marketInfo) marketInfo._id = market;
    return marketInfo;
};
Augur.prototype.getMarketsInfo = function (options, callback) {
    // options: {branch, offset, numMarketsToLoad, combinatorial, callback}
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
    var parseMarketsOptions = {combinatorial: options.combinatorial};
    var tx = clone(this.tx.getMarketsInfo);
    tx.params = [branch, offset, numMarketsToLoad];
    tx.timeout = 240000;
    if (!callback) {
        return this.parseMarketsArray(this.fire(tx), parseMarketsOptions);
    }
    var count = 0;
    var cb = function (marketsArray) {
        if (typeof marketsArray === "object" &&
            marketsArray.error === 500 && ++count < 4) {
            return self.fire(tx, cb);
        } else if (marketsArray.error) {
            return callback(marketsArray);
        }        
        self.parseMarketsArray(marketsArray, parseMarketsOptions, callback);
    };
    this.fire(tx, cb);
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
Augur.prototype.getAlpha = function (market, callback) {
    // market: sha256
    var tx = clone(this.tx.getAlpha);
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
Augur.prototype.checkHash = function (tradeHash, callback) {
    var tx = clone(this.tx.checkHash);
    tx.params = tradeHash;
    return this.fire(tx, callback);
};
Augur.prototype.getID = function (tradeID, callback) {
    var tx = clone(this.tx.getID);
    tx.params = tradeID;
    return this.fire(tx, callback);
};
// what is type?
Augur.prototype.saveTrade = function (trade_id, type, market, amount, price, sender, outcome, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.saveTrade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.saveTrade), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    tx.params[4] = abi.fix(tx.params[4], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.get_trade = function (id, callback) {
    var tx = clone(this.tx.get_trade);
    tx.params = id;
    return this.fire(tx, callback);
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

// buy&sellShares.se
Augur.prototype.cancel = function (trade_id, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.cancel);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.cancel), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
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
Augur.prototype.short_sell = function (buyer_trade_id, max_amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.short_sell);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.short_sell), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.trade = function (max_value, max_amount, trade_ids, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.trade);
    var unpacked = this.utils.unpack(arguments[0], this.utils.labels(this.trade), arguments);
    tx.params = unpacked.params;
    tx.params[0] = abi.fix(tx.params[0], "hex");
    tx.params[1] = abi.fix(tx.params[1], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
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
            response.branchID = self.utils.sha256([
                0,
                response.from,
                "0x2f0000000000000000",
                periodLength,
                parseInt(response.blockNumber),
                abi.hex(parent),
                parseInt(abi.fix(tradingFee, "hex")),
                oracleOnly,
                description
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
Augur.prototype.getReportable = function (reportPeriod, eventID, callback) {
    var tx = clone(this.tx.getReportable);
    tx.params = [reportPeriod, eventID];
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
    return abi.hex(this.utils.sha256([
        from || this.from,
        abi.hex(salt),
        fixedReport,
        event
    ]));
};
Augur.prototype.makeHash_contract = function (salt, report, event, indeterminate, isScalar, callback) {
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
    tx.params = [abi.hex(salt), fixedReport, event];
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

// createSingleEventMarket.se
Augur.prototype.createSingleEventMarket = function (branchId, description, expirationBlock, minValue, maxValue, numOutcomes, alpha, initialLiquidity, tradingFee, forkSelection, onSent, onSuccess, onFailed) {
    if (branchId.constructor === Object && branchId.branchId) {
        description = branchId.description;           // string
        expirationBlock = branchId.expirationBlock;   // integer
        minValue = branchId.minValue;                 // integer (1 for binary)
        maxValue = branchId.maxValue;                 // integer (2 for binary)
        numOutcomes = branchId.numOutcomes;           // integer (2 for binary)
        alpha = branchId.alpha;                       // number -> fixed-point
        initialLiquidity = branchId.initialLiquidity; // number -> fixed-point
        tradingFee = branchId.tradingFee;             // number -> fixed-point
        forkSelection = branchId.forkSelection;       // integer
        onSent = branchId.onSent;                     // function
        onSuccess = branchId.onSuccess;               // function
        onFailed = branchId.onFailed;                 // function
        branchId = branchId.branchId;                 // sha256 hash
    }
    var tx = clone(this.tx.createSingleEventMarket);
    tx.params = [
        branchId,
        description,
        expirationBlock,
        minValue,
        maxValue,
        numOutcomes,
        abi.fix(alpha, "hex"),
        abi.fix(initialLiquidity, "hex"),
        abi.fix(tradingFee, "hex"),
        forkSelection || 1
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// createEvent.se
Augur.prototype.createEvent = function (branchId, description, expirationBlock, minValue, maxValue, numOutcomes, onSent, onSuccess, onFailed) {
    // first parameter can optionally be a transaction object
    if (branchId.constructor === Object && branchId.branchId) {
        description = branchId.description;         // string
        minValue = branchId.minValue;               // integer (1 for binary)
        maxValue = branchId.maxValue;               // integer (2 for binary)
        numOutcomes = branchId.numOutcomes;         // integer (2 for binary)
        expirationBlock = branchId.expirationBlock; // integer
        onSent = branchId.onSent;                   // function
        onSuccess = branchId.onSuccess;             // function
        onFailed = branchId.onFailed;               // function
        branchId = branchId.branchId;               // sha256 hash
    }
    var tx = clone(this.tx.createEvent);
    tx.params = [
        branchId,
        description,
        expirationBlock,
        minValue,
        maxValue,
        numOutcomes
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// createMarket.se
Augur.prototype.createMarket = function (branchId, description, alpha, initialLiquidity, tradingFee, events, forkSelection, onSent, onSuccess, onFailed) {
    if (branchId.constructor === Object && branchId.branchId) {
        alpha = branchId.alpha;                        // number -> fixed-point
        description = branchId.description;            // string
        initialLiquidity = branchId.initialLiquidity;  // number -> fixed-point
        tradingFee = branchId.tradingFee;              // number -> fixed-point
        events = branchId.events;                      // array [sha256, ...]
        forkSelection = branchId.forkSelection;        // integer
        onSent = branchId.onSent;                      // function
        onSuccess = branchId.onSuccess;                // function
        onFailed = branchId.onFailed;                  // function
        branchId = branchId.branchId;                  // sha256 hash
    }
    var tx = clone(this.tx.createMarket);
    if (events && events.length) {
        for (var i = 0, len = events.length; i < len; ++i) {
            if (events[i] && events[i].constructor === BigNumber) {
                events[i] = events[i].toString(16);
            }
        }
    }
    tx.params = [
        branchId,
        description,
        abi.fix(alpha, "hex"),
        abi.fix(initialLiquidity, "hex"),
        abi.fix(tradingFee, "hex"),
        events,
        forkSelection || 1
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
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

Augur.prototype.parseMarketInfo = function (rawInfo, options, callback) {
    var EVENTS_FIELDS = 6;
    var OUTCOMES_FIELDS = 2;
    var WINNING_OUTCOMES_FIELDS = 8;
    var info = {};
    if (rawInfo && rawInfo.length > 12) {

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
        // info[11] = INFO.getCreationFee(marketID)
        // info[12] = INFO.getCreator(marketID)
        // info[13] = self.Markets[marketID].tag1
        // info[14] = self.Markets[marketID].tag2
        // info[15] = self.Markets[marketID].tag3
        var index = 16;
        info = {
            network: this.network_id || rpc.version(),
            traderCount: parseInt(rawInfo[1]),
            alpha: abi.unfix(rawInfo[2], "string"),
            traderIndex: abi.unfix(rawInfo[3], "number"),
            numOutcomes: abi.number(rawInfo[4]),
            tradingPeriod: abi.number(rawInfo[5]),
            tradingFee: abi.unfix(rawInfo[6], "string"),
            branchId: rawInfo[7],
            numEvents: parseInt(rawInfo[8]),
            cumulativeScale: abi.string(rawInfo[9]),
            creationBlock: parseInt(rawInfo[10]),
            volume: abi.unfix(rawInfo[11], "string"),
            creationFee: abi.unfix(rawInfo[12], "string"),
            author: abi.format_address(rawInfo[13]),
            tags: [rawInfo[14], rawInfo[15], rawInfo[16]],
            type: null,
            endDate: null,
            participants: {},
            winningOutcomes: [],
            description: null
        };
        info.outcomes = new Array(info.numOutcomes);
        info.events = new Array(info.numEvents);
        var traderFields = info.numOutcomes + 1;

        // organize trader info
        for (var i = 0; i < info.numOutcomes; ++i) {
            info.outcomes[i] = {shares: {}};
        }
        var addr;
        for (i = 0; i < info.traderCount; ++i) {
            addr = abi.format_address(rawInfo[i*traderFields + index]);
            info.participants[addr] = i;
            for (var j = 0; j < info.numOutcomes; ++j) {
                info.outcomes[j].shares[addr] = abi.unfix(rawInfo[i*traderFields + index + j + 1], "string");
            }
        }

        // organize event info
        // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
        var endDate;
        index += info.traderCount*traderFields;
        for (i = 0; i < info.numEvents; ++i) {
            endDate = abi.number(rawInfo[i*EVENTS_FIELDS + index + 1]);
            info.events[i] = {
                id: rawInfo[i*EVENTS_FIELDS + index],
                endDate: endDate,
                outcome: abi.string(rawInfo[i*EVENTS_FIELDS + index + 2]),
                minValue: abi.string(rawInfo[i*EVENTS_FIELDS + index + 3]),
                maxValue: abi.string(rawInfo[i*EVENTS_FIELDS + index + 4]),
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
            info.outcomes[i].id = i + 1;
            info.outcomes[i].outstandingShares = abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index], "string");
            info.outcomes[i].price = abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string");
            if (info.outcomes[i].id === 2) {
                info.price = info.outcomes[i].price;
            }
        }
        index += info.numOutcomes*OUTCOMES_FIELDS;
        info.winningOutcomes = abi.string(
            rawInfo.slice(index, index + WINNING_OUTCOMES_FIELDS)
        );
        index += WINNING_OUTCOMES_FIELDS;

        // convert description byte array to ASCII
        info.description = String.fromCharCode.apply(null, rawInfo.slice(
            rawInfo.length - parseInt(rawInfo[index])
        ));

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
Augur.prototype.parseMarketsArray = function (marketsArray, options, callback) {
    var numMarkets, marketsInfo, totalLen, i, len, shift, rawInfo, marketID;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
        return marketsArray;
    }
    numMarkets = parseInt(marketsArray.shift());
    marketsInfo = {};
    totalLen = 0;
    for (i = 0; i < numMarkets; ++i) {
        len = parseInt(marketsArray[i]);
        shift = numMarkets + totalLen;
        rawInfo = marketsArray.slice(shift, shift + len);
        marketID = marketsArray[shift];
        marketsInfo[marketID] = this.parseMarketInfo(rawInfo, options || {});
        marketsInfo[marketID]._id = marketID;
        marketsInfo[marketID].sortOrder = i;
        totalLen += len;
    }
    if (!callback) return marketsInfo;
    callback(marketsInfo);
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
Augur.prototype.initialLiquiditySetup = function (marketID, alpha, cumulativeScale, numOutcomes, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.initialLiquiditySetup);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initialLiquiditySetup), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.modifyShares = function (marketID, outcome, amount, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.modifyShares);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.modifyShares), arguments);
    tx.params = unpacked.params;
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.initializeMarket = function (marketID, events, tradingPeriod, tradingFee, branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.initializeMarket);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initializeMarket), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
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
    if (!cb && this.utils.is_function(options)) {
        cb = options;
        options = null;
    }
    options = options || {};
    var filter = {
        fromBlock: options.fromBlock || "0x1",
        toBlock: options.toBlock || "latest",
        address: this.contracts.buyAndSellShares,
        topics: [this.rpc.sha3(constants.LOGS.updatePrice), null, abi.unfork(market, true)]
    };
    if (!this.utils.is_function(cb)) {
        var logs = rpc.getLogs(filter);
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) throw new Error(JSON.stringify(logs));
        var outcome, parsed, priceHistory = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                outcome = abi.number(logs[i].topics[3]);
                if (!priceHistory[outcome]) priceHistory[outcome] = [];
                parsed = rpc.unmarshal(logs[i].data);
                priceHistory[outcome].push({
                    market: abi.hex(market),
                    user: abi.format_address(logs[i].topics[1]),
                    price: abi.unfix(parsed[0], "string"),
                    cost: abi.unfix(parsed[1], "string"),
                    blockNumber: parseInt(logs[i].blockNumber)
                });
            }
        }
        return priceHistory;
    }
    rpc.getLogs(filter, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var outcome, parsed, priceHistory = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                outcome = abi.number(logs[i].topics[3]);
                if (!priceHistory[outcome]) priceHistory[outcome] = [];
                parsed = rpc.unmarshal(logs[i].data);
                priceHistory[outcome].push({
                    market: abi.hex(market),
                    user: abi.format_address(logs[i].topics[1]),
                    price: abi.unfix(parsed[0], "string"),
                    cost: abi.unfix(parsed[1], "string"),
                    blockNumber: parseInt(logs[i].blockNumber)
                });
            }
        }
        cb(priceHistory);
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
        address: this.contracts.buyAndSellShares,
        topics: [this.rpc.sha3(constants.LOGS.updatePrice), abi.prefix_hex(abi.pad_left(abi.strip_0x(account))), null, null],
        timeout: 480000
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var market, outcome, parsed, price, cost, shares, trades = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                market = logs[i].topics[2];
                outcome = abi.number(logs[i].topics[3]);
                if (!trades[market]) trades[market] = {};
                if (!trades[market][outcome]) trades[market][outcome] = [];
                parsed = rpc.unmarshal(logs[i].data);
                price = abi.unfix(parsed[0]);
                cost = abi.unfix(parsed[1]);
                shares = abi.unfix(parsed[2]);
                if (price && cost && shares) {
                    trades[market][outcome].push({
                        market: abi.hex(market), // re-fork
                        price: price.toFixed(),
                        cost: cost.toFixed(),
                        shares: shares.toFixed(),
                        blockNumber: parseInt(logs[i].blockNumber)
                    });
                }
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
