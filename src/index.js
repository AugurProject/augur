/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var BigNumber = require("bignumber.js");
var Decimal = require("decimal.js");
var clone = require("clone");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var contracts = require("augur-contracts");
var connector = require("ethereumjs-connect");
var ramble = require("ramble");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

var options = {debug: {broadcast: false, fallback: false}};

function Augur() {
    var self = this;
    this.options = options;
    this.protocol = NODE_JS || document.location.protocol;

    this.connection = null;
    this.coinbase = null;
    this.from = null;

    this.utils = require("./utilities");
    this.constants = require("./constants");
    this.db = require("./client/db");
    this.orders = require("./client/orders");
    this.ramble = ramble;
    this.connector = connector;
    this.ramble.connector = connector;
    this.errors = contracts.errors;

    rpc.debug = this.options.debug;
    this.ramble.rpc = rpc;
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
    if (tx.send && this.web && this.web.account && this.web.account.address) {
        tx.from = this.web.account.address;
    } else {
        tx.from = tx.from || this.coinbase;
    }
    return rpc.fire(tx, callback);
};

Augur.prototype.transact = function (tx, onSent, onSuccess, onFailed) {
    if (tx.send && this.web && this.web.account && this.web.account.address) {
        tx.from = this.web.account.address;
        tx.invocation = { invoke: this.web.invoke, context: this.web };
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

// cash.se
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
Augur.prototype.depositEther = function (value, onSent, onSuccess, onFailed) {
    // value: amount of ether to exchange for cash (in ETHER, not wei!)
    if (value && value.value) {
        if (value.onSent) onSent = value.onSent;
        if (value.onSuccess) onSuccess = value.onSuccess;
        if (value.onFailed) onFailed = value.onFailed;
        value = value.value;
    }
    var tx = clone(this.tx.depositEther);
    tx.value = "0x" + abi.bignum(value).mul(rpc.ETHER).toString(16);
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.withdrawEther = function (to, value, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.withdrawEther);
    var unpacked = this.utils.unpack(to, this.utils.labels(this.withdrawEther), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.bignum(tx.params[1]).mul(rpc.ETHER).toFixed();
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
Augur.prototype.getMarkets = function (eventID, callback) {
    // eventID: sha256 hash id
    var tx = clone(this.tx.getMarkets);
    tx.params = eventID;
    return this.fire(tx, callback);
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
    var tx = clone(this.tx.getVotePeriod);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getNumMarketsBranch = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getNumMarketsBranch);
    tx.params = branch;
    return this.fire(tx, callback);
};
Augur.prototype.getNumMarkets = function (branch, callback) {
    // branch: sha256
    var tx = clone(this.tx.getNumMarketsBranch);
    tx.params = branch;
    return this.fire(tx, callback);
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
    this.tx.getEventInfo.params = eventId;
    if (this.utils.is_function(callback)) {
        this.fire(this.tx.getEventInfo, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(this.tx.getEventInfo));
    }
};
Augur.prototype.getEventBranch = function (eventId, callback) {
    var tx = clone(this.tx.getEventBranch);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getExpiration = function (eventId, callback) {
    // event: sha256
    var tx = clone(this.tx.getExpiration);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getOutcome = function (eventId, callback) {
    // event: sha256
    var tx = clone(this.tx.getOutcome);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getMinValue = function (eventId, callback) {
    // event: sha256
    var tx = clone(this.tx.getMinValue);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getMaxValue = function (eventId, callback) {
    // event: sha256
    var tx = clone(this.tx.getMaxValue);
    tx.params = eventId;
    return this.fire(tx, callback);
};
Augur.prototype.getNumOutcomes = function (eventId, callback) {
    // event: sha256
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
Augur.prototype.getEvents = function (branch, votePeriod, callback) {
    // branch: sha256 hash id
    // votePeriod: integer
    var tx = clone(this.tx.getEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getNumberEvents = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getNumberEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getEvent = function (branch, votePeriod, eventIndex, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getEvent);
    tx.params = [branch, votePeriod, eventIndex];
    return this.fire(tx, callback);
};
Augur.prototype.getTotalRepReported = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getTotalRepReported);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReporterBallot = function (branch, votePeriod, reporterID, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getReporterBallot);
    tx.params = [branch, votePeriod, reporterID];
    if (!this.utils.is_function(callback)) {
        var reporterBallot = this.fire(tx);
        if (reporterBallot && reporterBallot.error) return reporterBallot;
        return reporterBallot.slice(0, this.getNumberEvents(branch, votePeriod));
    }
    this.fire(tx, function (reporterBallot) {
        if (reporterBallot && reporterBallot.error) return callback(reporterBallot);
        this.getNumberEvents(branch, votePeriod, function (numberEvents) {
            if (numberEvents && numberEvents.error) return callback(numberEvents);
            callback(reporterBallot.slice(0, numberEvents));
        });
    });
};
Augur.prototype.getReport = function (branch, votePeriod, reporter, reportNum, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getReport);
    tx.params = [branch, votePeriod, reporter, reportNum];
    return this.fire(tx, callback);
};
Augur.prototype.getReportHash = function (branch, votePeriod, reporter, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getReportHash);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, callback);
};
Augur.prototype.getTotalReputation = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = clone(this.tx.getTotalReputation);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};

// markets.se
Augur.prototype.lsLmsr = function (market, callback) {
    if (!market) return new Error("no market input");
    if (market.constructor === Object) {
        if (market.network && market.events) {
            callback = callback || this.utils.pass;
            var info = JSON.parse(JSON.stringify(market));
            var cumScale = info.cumulativeScale;
            var alpha = new Decimal(info.alpha);
            var numOutcomes = info.numOutcomes;
            var sumShares = new Decimal(0);
            for (var i = 0; i < numOutcomes; ++i) {
                sumShares = sumShares.plus(new Decimal(info.outcomes[i].outstandingShares));
            }
            var bq = alpha.times(sumShares);
            var sumExp = new Decimal(0);
            for (i = 0; i < numOutcomes; ++i) {
                sumExp = sumExp.plus(new Decimal(info.outcomes[i].outstandingShares).dividedBy(bq).exp());
            }
            return callback(bq.times(cumScale).times(sumExp.ln()).toFixed());
        } else if (market._id) {
            market = market._id;
        }
    }
    var tx = clone(this.tx.lsLmsr);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.price = function (market, outcome, callback) {
    var self = this;
    if (market.constructor === Object) {
        if (market.network && market.events) {
            callback = callback || this.utils.pass;
            var info = JSON.parse(JSON.stringify(market));
            var epsilon = new Decimal("0.0000001");
            var a = new Decimal(self.lsLmsr(info));
            info.outcomes[outcome-1].outstandingShares = new Decimal(info.outcomes[outcome-1].outstandingShares).plus(epsilon).toFixed();
            var b = new Decimal(self.lsLmsr(info));
            return callback(b.minus(a).dividedBy(epsilon).toFixed());
        } else if (market._id) {
            market = market._id;
        }
    }
    var tx = clone(this.tx.price);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getSimulatedBuy = function (market, outcome, amount, callback) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number
    var self = this;
    function getSimulatedBuy(marketInfo, outcome, amount) {
        if (amount.constructor === BigNumber) amount = abi.string(amount);
        if (amount.constructor !== Decimal) amount = new Decimal(amount);
        outcome = parseInt(outcome);
        var info = JSON.parse(JSON.stringify(marketInfo));
        var oldCost = new Decimal(self.lsLmsr(info));
        var cumScale = info.cumulativeScale;
        var alpha = new Decimal(info.alpha);
        var numOutcomes = info.numOutcomes;
        info.outcomes[outcome-1].outstandingShares = new Decimal(info.outcomes[outcome-1].outstandingShares).plus(amount).toFixed();
        var sumShares = new Decimal(0);
        for (var i = 0; i < numOutcomes; ++i) {
            sumShares = sumShares.plus(new Decimal(info.outcomes[i].outstandingShares));
        }
        var bq = alpha.times(sumShares);
        var sumExp = new Decimal(0);
        for (i = 0; i < numOutcomes; ++i) {
            sumExp = sumExp.plus(new Decimal(info.outcomes[i].outstandingShares).dividedBy(bq).exp());
        }
        var newCost = bq.times(cumScale).times(sumExp.ln());
        if (newCost.lte(oldCost)) return self.errors.getSimulatedBuy["-2"];
        return [newCost.minus(oldCost).toFixed(), self.price(info, outcome)];
    }
    if (market.constructor === Object) {
        if (market.network && market.events) {
            callback = callback || this.utils.pass;
            return callback(getSimulatedBuy(market, outcome, amount));
        } else if (market._id) {
            market = market._id;
        }
    }
    if (!this.utils.is_function(callback)) {
        return getSimulatedBuy(this.getMarketInfo(market), outcome, amount);
    }
    this.getMarketInfo(market, function (info) {
        callback(getSimulatedBuy(info, outcome, amount));
    });
};
Augur.prototype.getSimulatedSell = function (market, outcome, amount, callback) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number
    var self = this;
    function getSimulatedSell(marketInfo, outcome, amount) {
        if (amount.constructor === BigNumber) amount = abi.string(amount);
        if (amount.constructor !== Decimal) amount = new Decimal(amount);
        outcome = parseInt(outcome);
        var info = JSON.parse(JSON.stringify(marketInfo));
        var oldCost = new Decimal(self.lsLmsr(info));
        var cumScale = info.cumulativeScale;
        var alpha = new Decimal(info.alpha);
        var numOutcomes = info.numOutcomes;
        info.outcomes[outcome-1].outstandingShares = new Decimal(info.outcomes[outcome-1].outstandingShares).minus(amount).toFixed();
        var sumShares = new Decimal(0);
        for (var i = 0; i < numOutcomes; ++i) {
            sumShares = sumShares.plus(new Decimal(info.outcomes[i].outstandingShares));
            if (i === outcome - 1) sumShares = sumShares.minus(amount);
        }
        var bq = alpha.times(sumShares);
        var sumExp = new Decimal(0);
        for (i = 0; i < numOutcomes; ++i) {
            sumExp = sumExp.plus(new Decimal(info.outcomes[i].outstandingShares).dividedBy(bq).exp());
        }
        var newCost = bq.times(cumScale).times(sumExp.ln());
        if (oldCost.lte(newCost)) return self.errors.getSimulatedSell["-2"];
        return [oldCost.minus(newCost).toFixed(), self.price(info, outcome)];
    }
    if (market.constructor === Object) {
        if (market.network && market.events) {
            callback = callback || this.utils.pass;
            return callback(getSimulatedSell(market, outcome, amount));
        } else if (market._id) {
            market = market._id;
        }
    }
    if (!this.utils.is_function(callback)) {
        return getSimulatedSell(this.getMarketInfo(market), outcome, amount);
    }
    this.getMarketInfo(market, function (info) {
        callback(getSimulatedSell(info, outcome, amount));
    });
};
Augur.prototype.getVolume = function (market, callback) {
    var tx = clone(this.tx.getVolume);
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
    if (!this.utils.is_function(callback)) {
        return this.parseMarketsArray(this.fire(tx), parseMarketsOptions);
    }
    var count = 0;
    var cb = function (marketsArray) {
        if (typeof marketsArray === "object" &&
            marketsArray.error === 500 && ++count < 4) {
            return self.fire(tx, cb);
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
Augur.prototype.initialLiquidityAmount = function (market, outcome, callback) {
    var tx = clone(this.tx.initialLiquidityAmount);
    tx.params = [market, outcome];
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
Augur.prototype.getParticipantSharesPurchased = function (market, participantNumber, outcome, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participantNumber, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getSharesPurchased = function (market, outcome, callback) {
    // market: sha256 hash id
    var tx = clone(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getWinningOutcomes = function (market, callback) {
    // market: sha256 hash id
    var self = this;
    var tx = clone(this.tx.getWinningOutcomes);
    tx.params = market;
    if (!this.utils.is_function(callback)) {
        var winningOutcomes = this.fire(tx);
        if (winningOutcomes && winningOutcomes.error) return winningOutcomes;
        return winningOutcomes.slice(0, this.getMarketNumOutcomes(market));
    }
    this.fire(tx, function (winningOutcomes) {
        if (winningOutcomes && winningOutcomes.error) {
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
Augur.prototype.hashReport = function (ballot, salt, callback) {
    // ballot: number[]
    // salt: integer
    if (ballot.constructor === Array) {
        var tx = clone(this.tx.hashReport);
        tx.params = [abi.fix(ballot, "hex"), salt];
        return this.fire(tx, callback);
    }
};

// buy&sellShares.se
Augur.prototype.makeMarketHash = function (market, outcome, amount, limit) {
    // market: sha256
    // outcome: integer
    // amount: number (convert to fixed-point)
    // limit: max price per share (convert to fixed-point); 0=market order
    if (market && market.constructor === Object && market.market) {
        outcome = market.outcome;
        amount = market.amount;
        limit = market.limit;
        market = market.market;
    }
    limit = (limit) ? abi.fix(limit, "hex") : 0;
    return this.utils.sha256([market, outcome, abi.fix(amount, "hex"), limit]);
};
Augur.prototype.commitTrade = function (market, hash, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.commitTrade);
    var unpacked = this.utils.unpack(market, this.utils.labels(this.commitTrade), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.buyShares = function (branch, market, outcome, amount, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        limit = branch.limit;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = clone(this.tx.buyShares);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    if (branch && branch.constructor === BigNumber) {
        branch = abi.prefix_hex(branch.toString(16));
    }
    limit = (limit) ? abi.fix(limit, "hex") : 0;
    if (onSent) {
        tx.params = [branch, market, outcome, abi.fix(amount, "hex"), limit];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
    tx.params = [branch, market, outcome, abi.fix(amount, "hex"), limit];
    return this.transact(tx);
};
Augur.prototype.sellShares = function (branch, market, outcome, amount, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        limit = branch.limit;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = clone(this.tx.sellShares);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    if (branch && branch.constructor === BigNumber) {
        branch = abi.prefix_hex(branch.toString(16));
    }
    limit = (limit) ? abi.fix(limit, "hex") : 0;
    if (onSent) {
        tx.params = [branch, market, outcome, abi.fix(amount, "hex"), limit];
        this.transact(tx, onSent, onSuccess, onFailed);
    } else {
        tx.params = [branch, market, outcome, abi.fix(amount, "hex"), limit];
        return this.transact(tx);
    }
};

// createBranch.se
Augur.prototype.createBranch = function (description, periodLength, parent, tradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    var self = this;
    if (description && description.periodLength) {
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
    if (description && description.periodLength) {
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
        parseInt(abi.fix(tradingFee, "hex")),
        oracleOnly
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// p2pWagers.se

// sendReputation.se
Augur.prototype.sendReputation = function (branch, to, value, onSent, onSuccess, onFailed) {
    // branch: sha256
    // to: sha256
    // value: number -> fixed-point
    if (branch && branch.branchId && branch.to && branch.value) {
        to = branch.to;
        value = branch.value;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = clone(this.tx.sendReputation);
    tx.params = [branch, to, abi.fix(value, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// transferShares.se

// makeReports.se
Augur.prototype.makeHash = function (salt, report, event, from) {
    return abi.hex(this.utils.sha256([
        from || this.from,
        abi.hex(salt),
        abi.fix(report, "hex"),
        event
    ]));
};
Augur.prototype.makeHash_contract = function (salt, report, event, callback) {
    if (salt.constructor === Object && salt.salt) {
        report = salt.report;
        event = salt.event;
        if (salt.callback) callback = salt.callback;
        salt = salt.salt;
    }
    var tx = clone(this.tx.makeHash);
    tx.params = [abi.hex(salt), abi.fix(report, "hex"), event];
    return this.fire(tx, callback);
};
Augur.prototype.calculateReportingThreshold = function (branch, eventID, votePeriod, callback) {
    var tx = clone(this.tx.calculateReportingThreshold);
    tx.params = [branch, eventID, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.submitReportHash = function (branch, reportHash, votePeriod, eventID, eventIndex, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object && branch.branch) {
        reportHash = branch.reportHash;
        votePeriod = branch.votePeriod || branch.reportPeriod;
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
    if (eventIndex) {
        tx.params = [branch, reportHash, votePeriod, eventID, eventIndex];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
    this.getEventIndex(votePeriod, eventID, function (eventIndex) {
        if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
        if (eventIndex.error) return onFailed(eventIndex);
        tx.params = [branch, reportHash, votePeriod, eventID, eventIndex];
        self.transact(tx, onSent, onSuccess, onFailed);
    });
};
Augur.prototype.submitReport = function (branch, votePeriod, eventIndex, salt, report, eventID, ethics, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object && branch.branch) {
        votePeriod = branch.votePeriod || branch.reportPeriod;
        eventIndex = branch.eventIndex;
        salt = branch.salt;
        report = branch.report;
        eventID = branch.eventID;
        ethics = branch.ethics;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branch;
    }
    onSent = onSent || this.utils.pass;
    onSuccess = onSuccess || this.utils.pass;
    onFailed = onFailed || this.utils.pass;
    var tx = clone(this.tx.submitReport);
    if (eventIndex) {
        tx.params = [
            branch,
            votePeriod,
            eventIndex,
            abi.hex(salt),
            abi.fix(report, "hex"),
            eventID,
            abi.fix(ethics, "hex")
        ];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
    this.getEventIndex(votePeriod, eventID, function (eventIndex) {
        if (!eventIndex) return onFailed("couldn't get event index for " + eventID);
        if (eventIndex.error) return onFailed(eventIndex);
        tx.params = [
            branch,
            votePeriod,
            eventIndex,
            abi.hex(salt),
            abi.fix(report, "hex"),
            eventID,
            abi.fix(ethics, "hex")
        ];
        self.transact(tx, onSent, onSuccess, onFailed);
    });
};
Augur.prototype.checkReportValidity = function (branch, report, votePeriod, callback) {
    var tx = clone(this.tx.checkReportValidity);
    tx.params = [branch, abi.fix(report, "hex"), votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.slashRep = function (branch, votePeriod, salt, report, reporter, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        votePeriod = branch.votePeriod || branch.reportPeriod;
        salt = branch.salt;
        report = branch.report;
        reporter = branch.reporter;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = clone(this.tx.slashRep);
    tx.params = [branch, votePeriod, salt, abi.fix(report, "hex"), reporter];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// createEvent.se
Augur.prototype.createEvent = function (branch, description, expDate, minValue, maxValue, numOutcomes, onSent, onSuccess, onFailed) {
    // first parameter can optionally be a transaction object
    if (branch.constructor === Object && branch.branchId) {
        description = branch.description; // string
        minValue = branch.minValue;       // integer (1 for binary)
        maxValue = branch.maxValue;       // integer (2 for binary)
        numOutcomes = branch.numOutcomes; // integer (2 for binary)
        expDate = branch.expDate || branch.expirationBlock;  // integer
        if (branch.onSent) onSent = branch.onSent;           // function({id, txhash})
        if (branch.onSuccess) onSuccess = branch.onSuccess;  // function({id, txhash})
        if (branch.onFailed) onFailed = branch.onFailed;     // function({id, txhash})
        branch = branch.branchId;         // sha256 hash
    }
    var tx = this.tx.createEvent;
    tx.params = [
        branch,
        description,
        expDate,
        minValue,
        maxValue,
        numOutcomes
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// createMarket.se
Augur.prototype.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, forkSelection, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        alpha = branch.alpha;                 // number -> fixed-point
        description = branch.description;     // string
        liquidity = branch.initialLiquidity;  // number -> fixed-point
        tradingFee = branch.tradingFee;       // number -> fixed-point
        events = branch.events;               // array [sha256, ...]
        forkSelection = branch.forkSelection; // integer
        onSent = branch.onSent;               // function({id, txhash})
        onSuccess = branch.onSuccess;         // function({id, txhash})
        onFailed = branch.onFailed;           // function({id, txhash})
        branch = branch.branchId;             // sha256 hash
    }
    forkSelection = forkSelection || 1;
    var tx = this.tx.createMarket;
    if (events && events.length) {
        for (var i = 0, len = events.length; i < len; ++i) {
            if (events[i] && events[i].constructor === BigNumber) {
                events[i] = events[i].toString(16);
            }
        }
    }
    tx.params = [
        branch,
        description,
        abi.fix(alpha, "hex"),
        abi.fix(liquidity, "hex"),
        abi.fix(tradingFee, "hex"),
        events,
        1
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// closeMarket.se
Augur.prototype.closeMarket = function (branch, market, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branch) {
        market = branch.market;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branch;
    }
    var tx = clone(this.tx.closeMarket);
    tx.params = [branch, market];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

/*******************
 * Utility methods *
 *******************/

Augur.prototype.parseMarketInfo = function (rawInfo, options, callback) {
    var EVENTS_FIELDS = 6;
    var OUTCOMES_FIELDS = 2;
    var WINNING_OUTCOMES_FIELDS = 8;
    var info = {};
    if (rawInfo && rawInfo.length) {

        // all-inclusive except comments & price history
        // info[0] = marketID
        // info[1] = self.Markets[marketID].currentParticipant
        // info[2] = self.Markets[marketID].alpha
        // info[3] = participantNumber
        // info[4] = self.Markets[marketID].numOutcomes
        // info[5] = self.Markets[marketID].tradingPeriod
        // info[6] = self.Markets[marketID].tradingFee
        // info[7] = self.Markets[marketID].branch
        // info[8] = self.Markets[marketID].lenEvents
        // info[9] = self.Markets[marketID].cumulativeScale
        // info[10] = INFO.getCreationFee(marketID)
        // info[11] = INFO.getCreator(marketID)
        var index = 12;
        info = {
            network: this.network_id || rpc.version(),
            traderCount: abi.number(rawInfo[1]),
            alpha: abi.unfix(rawInfo[2], "string"),
            traderIndex: abi.unfix(rawInfo[3], "number"),
            numOutcomes: abi.number(rawInfo[4]),
            tradingPeriod: abi.number(rawInfo[5]),
            tradingFee: abi.unfix(rawInfo[6], "string"),
            branchId: rawInfo[7],
            numEvents: abi.number(rawInfo[8]),
            cumulativeScale: abi.string(rawInfo[9]),
            creationFee: abi.unfix(rawInfo[10], "string"),
            author: abi.format_address(rawInfo[11]),
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
    var numMarkets, marketsInfo, totalLen, lengths, totalLengths, i, j, self,
        len, shift, rawInfo, marketID;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
        return marketsArray;
    }
    if (this.utils.is_function(options) && !callback) {
        callback = options;
        options = {};
    }
    options = options || {};
    numMarkets = parseInt(marketsArray.shift());
    marketsInfo = {};
    totalLen = 0;
    if (!this.utils.is_function(callback)) {
        for (i = 0; i < numMarkets; ++i) {
            len = parseInt(marketsArray[i]);
            shift = numMarkets + totalLen;
            rawInfo = marketsArray.slice(shift, shift + len);
            marketID = marketsArray[shift];
            marketsInfo[marketID] = this.parseMarketInfo(rawInfo, options);
            marketsInfo[marketID]._id = marketID;
            totalLen += len;
        }
        return marketsInfo;
    }
    self = this;
    lengths = new Array(numMarkets);
    totalLengths = Array.apply(null, {
        length: numMarkets
    }).map(Number.prototype.valueOf, 0);
    for (i = 0; i < numMarkets; ++i) {
        lengths[i] = parseInt(marketsArray[i]);
        for (j = 0; j < i; ++j) {
            totalLengths[i] += lengths[j];
        }
    }
    async.forEachOf(lengths, function (len, idx, next) {
        var shift, rawInfo, marketID;
        shift = numMarkets + totalLengths[idx];
        rawInfo = marketsArray.slice(shift, shift + len);
        marketID = marketsArray[shift];
        self.parseMarketInfo(rawInfo, options, function (info) {
            if (!info) return next(self.errors.NO_MARKET_INFO);
            if (info.constructor !== Object || info.error) {
                return next(info);
            }
            marketsInfo[marketID] = info;
            marketsInfo[marketID]._id = marketID;
            next();
        });
    }, function (err) {
        if (err) return callback(err);
        callback(marketsInfo);
    });
};
Augur.prototype.checkPeriod = function (branch) {
    var period = abi.number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(abi.number(rpc.blockNumber()) / abi.number(this.getPeriodLength(branch)));
    var periodsBehind = currentPeriod - period - 1;
    return periodsBehind;
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
Augur.prototype.getCurrentVotePeriod = function (branch, callback) {
    // branch: sha256
    var periodLength, blockNum;
    this.tx.getPeriodLength.params = branch;
    if (callback) {
        this.fire(this.tx.getPeriodLength, function (periodLength) {
            if (periodLength) {
                periodLength = abi.bignum(periodLength);
                rpc.blockNumber(function (blockNum) {
                    blockNum = abi.bignum(blockNum);
                    callback(blockNum.dividedBy(periodLength).floor().minus(1).toFixed());
                });
            }
        });
    } else {
        periodLength = this.fire(this.tx.getPeriodLength);
        if (periodLength) {
            blockNum = abi.bignum(rpc.blockNumber());
            return blockNum.dividedBy(abi.bignum(periodLength)).floor().minus(1).toFixed();
        }
    }
};
Augur.prototype.getEventsRange = function (branch, vpStart, vpEnd, callback) {
    // branch: sha256, vpStart: integer, vpEnd: integer
    var vp_range, txlist;
    vp_range = vpEnd - vpStart + 1; // inclusive
    txlist = new Array(vp_range);
    for (var i = 0; i < vp_range; ++i) {
        txlist[i] = {
            from: this.web.account.address || this.coinbase,
            to: this.contracts.expiringEvents,
            method: "getEvents",
            signature: "ii",
            returns: "hash[]",
            params: [branch, i + vpStart]
        };
    }
    return rpc.batch(txlist, callback);
};

/*************
 * Consensus *
 *************/

Augur.prototype.updatePeriod = function (branch) {
    var currentPeriod = this.getCurrentPeriod(branch);
    this.incrementPeriod(branch);
    this.moveEventsToCurrentPeriod(branch, this.getVotePeriod(branch), currentPeriod);
};
Augur.prototype.setReportHash = function (branch, reportPeriod, reporter, reportHash, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setReportHash);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.setReportHash), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.getOutcomesFinal = function (branch, reportPeriod, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getOutcomesFinal);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReporterPayouts = function (branch, reportPeriod, callback) {
    // branch: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.getReporterPayouts);
    tx.params = [branch, reportPeriod];
    return this.fire(tx, callback);
};
Augur.prototype.incrementPeriod = function (branchId, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.incrementPeriod);
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.incrementPeriod), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.moveEventsToCurrentPeriod);
    tx.params = [branch, currentVotePeriod, currentPeriod];
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
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.initializeMarket = function (marketID, events, tradingPeriod, tradingFee, branch, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.initializeMarket);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initializeMarket), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.setTotalReputation = function (branch, reportPeriod, totalReputation, onSent, onSuccess, onFailed) {
    // branch: sha256
    // reportPeriod: integer
    // totalReputation: number -> fixed
    var tx = clone(this.tx.setTotalReputation);
    tx.params = [branch, reportPeriod, abi.fix(totalReputation, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
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
    var unpacked = this.utils.unpack(branchId, this.utils.labels(this.addMarket), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.setReporterBallot = function (branchId, reportPeriod, reporterID, report, reputation, onSent, onSuccess, onFailed) {
    var tx = clone(this.tx.setReporterBallot);
    tx.params = [branchId, reportPeriod, reporterID, abi.fix(report, "hex"), reputation];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.makeBallot = function (branchId, reportPeriod, callback) {
    // branchId: sha256
    // reportPeriod: integer
    var tx = clone(this.tx.makeBallot);
    tx.params = [branchId, reportPeriod];
    return this.fire(tx, callback);
};

/******************
 * Simplified API *
 ******************/

Augur.prototype.getMostActive = function (branch, cb) {
    if (this.utils.is_function(branch) && !cb) {
        cb = branch;
        branch = this.branches.dev;
    }
    if (!branch || !this.utils.is_function(cb)) return;
    this.getMarketsInfo({
        branch: branch,
        offset: 0,
        numMarketsToLoad: 0,
        callback: function (marketsInfo) {
            var price, info, formatted;
            var childNodes = [];
            var volume = 0;
            for (var market in marketsInfo) {
                if (!marketsInfo.hasOwnProperty(market)) continue;
                info = marketsInfo[market];
                price = abi.number(info.outcomes[1].price);
                formatted = price.toFixed(2);
                if (formatted === "-0.00") formatted = "0.00";
                for (var i = 0, len = info.outcomes.length; i < len; ++i) {
                    volume += abi.number(info.outcomes[i].outstandingShares);
                }
                childNodes.push({
                    nodeId: "CONTRACT" + market,
                    nodeType: "CONTRACT",
                    name: info.description,
                    childNodes: null,
                    id: market,
                    eventName: info.description,
                    imagePath: null,
                    displayOrder: 0,
                    tickSize: 0.1,
                    tickValue: 0.01,
                    lastTradePrice: price,
                    lastTradePriceFormatted: formatted,
                    lastTradeCostPerShare: price,
                    lastTradeCostPerShareFormatted: formatted + " CASH",
                    sessionChangePrice: 0.0,
                    sessionChangePriceFormatted: "+0.0",
                    sessionChangeCostPerShare: 0.0,
                    sessionChangeCostPerShareFormatted: "0.00 CASH",
                    totalVolume: abi.number(volume.toFixed(2)),
                    bestBidPrice: price,
                    bestAskPrice: price,
                    leaf: true
                });
            }
            childNodes.sort(function (a, b) {
                return b.totalVolume - a.totalVolume;
            });
            cb({
                nodeId: "MOST_ACTIVE",
                nodeType: "MOST_ACTIVE",
                name: "Most Active",
                childNodes: childNodes,
                leaf: false
            });
        }
    });
};
Augur.prototype.getMarketsSummary = function (branch, cb) {
    if (this.utils.is_function(branch) && !cb) {
        cb = branch;
        branch = this.branches.dev;
    }
    if (!branch || !this.utils.is_function(cb)) return;
    this.getMarketsInfo({
        branch: branch,
        offset: 0,
        numMarketsToLoad: 0,
        callback: function (marketsInfo) {
            var info, price;
            var marketsSummary = [];
            for (var market in marketsInfo) {
                if (!marketsInfo.hasOwnProperty(market)) continue;
                info = marketsInfo[market];
                price = abi.number(info.outcomes[1].price);
                marketsSummary.push({
                    id: info._id,
                    name: info.description,
                    lastTradePrice: price,
                    lastTradePriceFormatted: price.toFixed(2),
                    lastTradeCostPerShare: price,
                    lastTradeCostPerShareFormatted: price.toFixed(2) + " CASH"
                });
            }
            cb(marketsSummary);
        }
    });
};

/*************************************
 * Trade events (price history data) *
 *************************************/

Augur.prototype.getPrices = function (market, cb) {
    var self = this;
    if (this.utils.is_function(market) && !cb) {
        cb = market;
        market = this.branches.dev;
    }
    if (!market || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice"]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var outcomes = [1, 2]; // TODO don't hardcode
        var prices = {};
        async.eachSeries(outcomes, function (outcome, nextOutcome) {
            var priceLog = self.filters.search_price_logs(logs, market, outcome);
            prices[outcome] = [];
            if (!priceLog) return nextOutcome(outcome);
            if (priceLog.constructor !== Array || !priceLog.length) {
                return nextOutcome();
            }
            async.eachSeries(priceLog, function (price, nextPrice) {
                rpc.getBlock(price.blockNumber, true, function (block) {
                    if (!block) return nextPrice(price);
                    if (block.error) return nextPrice(block);
                    var timestamp = parseInt(block.timestamp);
                    var dt = new Date(timestamp * 1000);
                    // buy&sellShares.se 102: amount = -price / cost
                    var amount = abi.bignum(price.price)
                                    .dividedBy(abi.bignum(price.cost).abs())
                                    .toNumber();
                    prices[outcome].push({
                        year: dt.getUTCFullYear(),
                        day: dt.getUTCDate(),
                        month: dt.getUTCMonth() + 1,
                        price: abi.number(price.price),
                        volume: amount,
                        timestamp: timestamp
                    });
                    nextPrice();
                });
            }, function (err) {
                if (err) return nextOutcome(err);
                prices[outcome].sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                nextOutcome();
            });
        }, function (err) {
            if (err) return cb(err);
            cb(prices);
        });
    });
};
Augur.prototype.getClosingPrices = function (market, cb) {
    var self = this;
    if (this.utils.is_function(market) && !cb) {
        cb = market;
        market = this.branches.dev;
    }
    if (!market || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice"]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var outcomes = [1, 2]; // TODO don't hardcode
        var prices = {};
        async.eachSeries(outcomes, function (outcome, nextOutcome) {
            var priceLog = self.filters.search_price_logs(logs, market, outcome);
            prices[outcome] = [];
            if (!priceLog) return nextOutcome(outcome);
            if (priceLog.constructor !== Array || !priceLog.length) {
                return nextOutcome();
            }
            var amount, timestamp, curDate, prevDate = {};
            var closing = {price: null, volume: 0};
            async.eachSeries(priceLog, function (price, nextPrice) {
                rpc.getBlock(price.blockNumber, true, function (block) {
                    if (!block) return nextPrice(price);
                    if (block.error) return nextPrice(block);
                    timestamp = parseInt(block.timestamp);
                    var dt = new Date(timestamp * 1000);
                    // buy&sellShares.se 102: amount = -price / cost
                    amount = abi.bignum(price.price)
                                .dividedBy(abi.bignum(price.cost).abs())
                                .toNumber();
                    // daily binning
                    curDate = {
                        year: dt.getUTCFullYear(),
                        day: dt.getUTCDate(),
                        month: dt.getUTCMonth() + 1
                    };
                    if (curDate.year === null ||
                        curDate.day === null ||
                        curDate.month === null) {
                        return nextPrice();
                    }
                    if (prevDate.year === undefined) {
                        closing.price = abi.number(price.price);
                        closing.volume += amount;
                    } else {
                        if (curDate.year === prevDate.year &&
                            curDate.day === prevDate.day &&
                            curDate.month === prevDate.month) {
                            // same day
                            closing.price = abi.number(price.price);
                            closing.volume += amount;
                        } else {
                            // new day
                            var lastPrice = {
                                year: prevDate.year,
                                day: prevDate.day,
                                month: prevDate.month,
                                timestamp: timestamp
                            };
                            if (closing.price !== null) {
                                lastPrice.closingPrice = closing.price;
                                lastPrice.volume = closing.volume;
                            } else {
                                lastPrice.closingPrice = abi.number(price.price);
                                lastPrice.volume = amount;
                            }
                            prices[outcome].push(lastPrice);
                            closing = {price: null, volume: 0};
                        }
                    }
                    prevDate.year = curDate.year;
                    prevDate.day = curDate.day;
                    prevDate.month = curDate.month;
                    nextPrice();
                });
            }, function (err) {
                if (err) return nextOutcome(err);
                // record the last day
                var lastPrice = {
                    year: curDate.year,
                    day: curDate.day,
                    month: curDate.month,
                    closingPrice: closing.price,
                    volume: closing.volume,
                    timestamp: timestamp
                };
                if (closing.price !== null) {
                    lastPrice.closingPrice = closing.price;
                    lastPrice.volume = closing.volume;
                } else {
                    lastPrice.closingPrice = abi.number(priceLog[priceLog.length - 1].price);
                    lastPrice.volume = amount;
                }
                prices[outcome].push(lastPrice);
                prices[outcome].sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                nextOutcome();
            });
        }, function (err) {
            if (err) return cb(err);
            cb(prices);
        });
    });
};
Augur.prototype.getPriceHistory = function (branch, cb) {
    var self = this;
    if (!branch || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice"]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var market, outcome, parsed, priceHistory = {};
        for (var i = 0, n = logs.length; i < n; ++i) {
            if (logs[i] && logs[i].data !== undefined &&
                logs[i].data !== null && logs[i].data !== "0x") {
                market = logs[i].topics[2];
                outcome = abi.number(logs[i].topics[3]);
                if (!priceHistory[market]) priceHistory[market] = {};
                if (!priceHistory[market][outcome]) priceHistory[market][outcome] = [];
                parsed = rpc.unmarshal(logs[i].data);
                priceHistory[market][outcome].push({
                    market: abi.hex(market), // re-fork
                    user: abi.format_address(logs[i].topics[1]),
                    price: abi.unfix(parsed[0], "string"),
                    cost: abi.unfix(parsed[1], "string"),
                    blockNumber: abi.hex(logs[i].blockNumber)
                });
            }
        }
        cb(priceHistory);
    });
};
Augur.prototype.getMarketPriceHistory = function (market, cb) {
    if (market) {
        var filter = {
            fromBlock: "0x1",
            toBlock: "latest",
            address: this.contracts.buyAndSellShares,
            topics: ["updatePrice", null, abi.unfork(market, true)]
        };
        if (!this.utils.is_function(cb)) {
            var logs = this.filters.eth_getLogs(filter);
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
                        blockNumber: abi.hex(logs[i].blockNumber)
                    });
                }
            }
            return priceHistory;
        }
        var self = this;
        this.filters.eth_getLogs(filter, function (logs) {
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
                        blockNumber: abi.hex(logs[i].blockNumber)
                    });
                }
            }
            cb(priceHistory);
        });
    }
};
Augur.prototype.getOutcomePriceHistory = function (market, outcome, cb) {
    if (!market || !outcome) return;
    var filter = {
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice", null, abi.unfork(market, true), outcome]
    };
    if (this.utils.is_function(cb)) {
        var self = this;
        this.filters.eth_getLogs(filter, function (logs) {
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return cb(null);
            }
            if (logs.error) return cb(logs);
            cb(self.filters.search_price_logs(logs, market, outcome));
        });
    } else {
        var logs = this.filters.eth_getLogs(filter);
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) throw logs;
        return this.filters.search_price_logs(logs, market, outcome);
    }
};

/******************************************
 * Market creation events (block numbers) *
 ******************************************/

Augur.prototype.getCreationBlocks = function (branch, cb) {
    var self = this;
    if (!branch || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.createMarket,
        topics: ["creationBlock"]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        self.getMarketsInBranch(branch, function (markets) {
            if (!markets || (markets && (markets.constructor !== Array || !markets.length))) {
                return cb(null);
            }
            if (markets.error) return cb(markets);
            var block, blocks = {};
            for (var i = 0, len = markets.length; i < len; ++i) {
                block = self.filters.search_creation_logs(logs, markets[i]);
                if (block && block.constructor === Array && block.length &&
                    block[0].constructor === Object && block[0].blockNumber) {
                    blocks[markets[i]] = abi.bignum(block[0].blockNumber).toNumber();
                }
            }
            cb(blocks);
        });
    });
};

Augur.prototype.getMarketCreationBlock = function (market, cb) {
    var self = this;
    if (!market || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.createMarket,
        topics: ["creationBlock", abi.unfork(market, true)]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var block = self.filters.search_creation_logs(logs, market);
        if (block && block.constructor === Array && block.length &&
            block[0].constructor === Object && block[0].blockNumber) {
            cb(abi.number(block[0].blockNumber));
        }
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

Augur.prototype.getAccountTrades = function (account, cb) {
    var self = this;
    if (!account || !this.utils.is_function(cb)) return;
    this.filters.eth_getLogs({
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice", abi.format_address(account), null, null]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var market, outcome, parsed, price, cost, trades = {};
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
                if (price && cost) {
                    trades[market][outcome].push({
                        market: abi.hex(market), // re-fork
                        price: price.toFixed(),
                        cost: cost.toFixed(),
                        // number of shares = -price / cost
                        shares: price.dividedBy(cost).mul(new BigNumber(-1)).toFixed(),
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

/**************
 * Order book *
 **************/

Augur.prototype.checkOrder = function (marketInfo, outcome, order, cb) {
    var self = this;
    var currentPrice = new BigNumber(this.price(marketInfo, outcome));
    if (order.amount.constructor !== BigNumber) {
        order.amount = new BigNumber(order.amount);
    }
    if (order.price.constructor !== BigNumber) {
        order.price = new BigNumber(order.price);
    }
    order.branch = marketInfo.branchId;
    order.market = marketInfo._id;
    order.outcome = outcome;

    // buy orders
    var priceMatched;
    if (order.amount.gt(new BigNumber(0))) {
        priceMatched = currentPrice.lte(order.price);
    } else {
        priceMatched = currentPrice.gte(order.price);
    }
    if (priceMatched) {
        var trade;
        if (order.cap) {
            trade = this.orders.limit.fill(marketInfo, order);
        } else {
            trade = {order: order, amount: order.amount.toFixed(), filled: true};
        }

        // execute order
        if (trade !== undefined) {
            this.trade({
                branch: order.branch,
                market: order.market,
                outcome: order.outcome,
                amount: trade.amount,
                callbacks: {
                    onMarketHash: function (marketHash) {
                        console.log("checkOrder.marketHash:", marketHash);
                    },
                    onCommitTradeSent: function (res) {
                        console.log("checkOrder.commitTradeSent:", res);
                    },
                    onCommitTradeSuccess: function (res) {
                        console.log("checkOrder.commitTradeSuccess:", res);
                    },
                    onCommitTradeFailed: cb,
                    onNextBlock: function (blockNumber) {
                        console.log("checkOrder.blockNumber:", blockNumber);
                    },
                    onTradeSent: function (res) {
                        console.log("checkOrder.trade sent:", res);
                        var cancelled = self.orders.cancel(self.from, order.market, order.outcome, order.id);
                        console.log("checkOrder.cancelled:", cancelled);
                        if (!trade.filled) {
                            var newOrder = JSON.parse(JSON.stringify(trade.order));
                            newOrder.account = self.from;
                            console.log("checkOrder.create order:", newOrder);
                            var created = self.orders.create(newOrder);
                            console.log("checkOrder.created:", created);
                        }
                    },
                    onTradeSuccess: function (res) {
                        cb(trade.order);
                    },
                    onTradeFailed: cb
                }
            });
        }
    }
};

Augur.prototype.checkOutcomeOrderList = function (marketInfo, outcome, orderList, cb) {
    var self = this;
    var matchedOrders = [];
    async.each(orderList, function (order, nextOrder) {
        console.log("order:", order);
        self.checkOrder(marketInfo, outcome, order, function (matched) {
            console.log("matched:", matched);
            if (matched && !matched.error) {
                matchedOrders.push(matched);
                return nextOrder();
            }
            nextOrder(matched || new Error("checkOutcomeOrderList error"));
        });
    }, function (err) {
        if (err) return cb(err);
        cb(matchedOrders);
    });
};

Augur.prototype.checkOrderBook = function (market, cb) {
    var self = this;
    cb = cb || this.utils.pass;
    var orders = this.orders.get(this.from);
    if (!market || !orders) return cb(false);
    var matchedOrders = [];
    if (market.constructor === Object && market.network && market.events) {
        if (!orders[market._id]) return cb(false);
        async.forEachOf(orders[market._id], function (orderList, outcome, nextOutcome) {
            self.checkOutcomeOrderList(market, outcome, orderList, function (matched) {
                if (matched && matched.constructor === Array) {
                    matchedOrders = matchedOrders.concat(matched);
                    return nextOutcome();
                }
                nextOutcome(matched || new Error("checkOrderBook error"));
            });
        }, function (err) {
            if (err) return cb(err);
            cb(matchedOrders);
        });
    }
    if (!orders[market]) return cb(false);
    this.getMarketInfo(market, function (info) {
        if (!info || info.error) return cb(info);
        self.checkOrderBook(info, cb);
    });
};

/**
 * Lockstep trade sequence:
 *   1. commitTrade(market, makeMarketHash(market, outcome, amount, limit))
 *   2. buyShares(branch, market, outcome, amount, limit)
 * callbacks: {onMarketHash,
 *             onCommitTradeSent, onCommitTradeSuccess, onCommitTradeFailed,
 *             onNextBlock,
 *             onTradeSent, onTradeSuccess, onTradeFailed,
 *             onOrderCreated}
 * (All callbacks are optional.)
 */
Augur.prototype.trade = function (branch, market, outcome, amount, limit, stop, expiration, cap, callbacks) {
    var self = this;
    if (branch && branch.constructor === Object && branch.branch) {
        market = branch.market;
        outcome = branch.outcome;
        amount = branch.amount;
        limit = branch.limit;
        stop = branch.stop;
        expiration = branch.expiration; // NYI
        cap = branch.cap;
        if (branch.callbacks) callbacks = clone(branch.callbacks);
        branch = branch.branch;
    }
    callbacks = callbacks || {};
    callbacks.onMarketHash = callbacks.onMarketHash || this.utils.pass;
    callbacks.onCommitTradeSent = callbacks.onCommitTradeSent || this.utils.pass;
    callbacks.onCommitTradeSuccess = callbacks.onCommitTradeSuccess || this.utils.pass;
    callbacks.onCommitTradeFailed = callbacks.onCommitTradeFailed || this.utils.pass;
    callbacks.onNextBlock = callbacks.onNextBlock || this.utils.pass;
    callbacks.onTradeSent = callbacks.onTradeSent || this.utils.pass;
    callbacks.onTradeSuccess = callbacks.onTradeSuccess || this.utils.pass;
    callbacks.onTradeFailed = callbacks.onTradeFailed || this.utils.pass;
    callbacks.onOrderCreated = callbacks.onOrderCreated || this.utils.pass;

    // stop orders: send to localStorage
    if (stop) {
        return callbacks.onOrderCreated(this.orders.create({
            account: this.from,
            market: market,
            outcome: outcome,
            price: limit,
            amount: amount,
            expiration: expiration || 0,
            cap: cap || 0
        }));
    }

    // market orders: send to chain
    amount = new Decimal(amount);
    var trade = (amount.gt(new Decimal(0))) ? this.buyShares : this.sellShares;
    amount = amount.abs().toFixed();
    var marketHash = this.makeMarketHash({
        market: market,
        outcome: parseInt(outcome),
        amount: amount,
        limit: 0 // nonzero for "true" limit orders, 0 for stop & market orders
    });
    callbacks.onMarketHash(marketHash);
    this.commitTrade({
        market: market,
        hash: marketHash,
        onSent: callbacks.onCommitTradeSent,
        onSuccess: function (res) {
            callbacks.onCommitTradeSuccess(res);
            self.rpc.blockNumber(function (thisBlock) {
                thisBlock = parseInt(thisBlock);
                (function waitForNextBlock() {
                    self.rpc.blockNumber(function (nextBlock) {
                        nextBlock = parseInt(nextBlock);
                        if (thisBlock === nextBlock) {
                            return setTimeout(waitForNextBlock, 3000);
                        }
                        callbacks.onNextBlock(nextBlock);
                        trade.call(self, {
                            branchId: branch,
                            marketId: market,
                            outcome: parseInt(outcome),
                            amount: amount,
                            limit: limit,
                            onSent: callbacks.onTradeSent,
                            onSuccess: callbacks.onTradeSuccess,
                            onFailed: callbacks.onTradeFailed
                        });
                    });
                })();
            });
        },
        onFailed: callbacks.onCommitTradeFailed
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
