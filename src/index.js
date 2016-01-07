/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var ramble = require("ramble");
var contracts = require("augur-contracts");
var connector = require("ethereumjs-connect");

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
    this.comments = ramble;
    this.comments.connector = connector;
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
    this.network_id = connector.network_id;
    this.from = connector.from;
    this.coinbase = connector.coinbase;
    this.tx = connector.tx;
    this.contracts = connector.contracts;
    this.init_contracts = connector.init_contracts;
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
    var tx = this.utils.copy(this.tx.reputationFaucet);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// cash.se
Augur.prototype.getCashBalance = function (account, onSent) {
    // account: ethereum account
    var tx = this.utils.copy(this.tx.getCashBalance);
    tx.params = account || this.web.account.address || this.coinbase;
    return this.fire(tx, onSent);
};
Augur.prototype.sendCash = function (to, value, onSent, onSuccess, onFailed) {
    // to: ethereum account
    // value: number -> fixed-point
    if (to && to.value) {
        value = to.value;
        if (to.onSent) onSent = to.onSent;
        if (to.onSuccess) onSuccess = to.onSuccess;
        if (to.onFailed) onFailed = to.onFailed;
        to = to.to;
    }
    var tx = this.utils.copy(this.tx.sendCash);
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
    var tx = this.utils.copy(this.tx.sendCashFrom);
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
    var tx = this.utils.copy(this.tx.depositEther);
    tx.value = "0x" + abi.bignum(value).mul(rpc.ETHER).toString(16);
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.withdrawEther = function (to, value, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.withdrawEther);
    var unpacked = this.utils.unpack(to, this.utils.labels(this.withdrawEther), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.bignum(tx.params[1]).mul(rpc.ETHER).toFixed();
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// info.se
Augur.prototype.getCreator = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getCreator);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.getCreationFee = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getCreationFee);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.getDescription = function (item, onSent) {
    // item: sha256 hash id
    var tx = this.utils.copy(this.tx.getDescription);
    tx.params = item;
    return this.fire(tx, onSent);
};
Augur.prototype.setInfo = function (id, description, creator, fee, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.setInfo);
    var unpacked = this.utils.unpack(id, this.utils.labels(this.setInfo), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// redeem_interpolate.se
Augur.prototype.redeem_interpolate = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_interpolate);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.read_ballots = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.read_ballots);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// center.se
Augur.prototype.center = function (reports, reputation, scaled, scaled_max, scaled_min, max_iterations, max_components, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.center);
    tx.params = [
        abi.fix(reports, "hex"),
        abi.fix(reputation, "hex"),
        scaled,
        scaled_max,
        scaled_min,
        max_iterations,
        max_components
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// redeem_center.se
Augur.prototype.redeem_center = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_center);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.redeem_covariance = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_covariance);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// redeem_score.se
Augur.prototype.redeem_blank = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_blank);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.redeem_loadings = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_loadings);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// score.se
Augur.prototype.blank = function (components_remaining, max_iterations, num_events, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.blank);
    tx.params = [components_remaining, max_iterations, num_events];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.loadings = function (iv, wcd, reputation, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.loadings);
    tx.params = [
        abi.fix(iv, "hex"),
        abi.fix(wcd, "hex"),
        abi.fix(reputation, "hex"),
        num_reports,
        num_events
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// resolve.se
Augur.prototype.resolve = function (smooth_rep, reports, scaled, scaled_max, scaled_min, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.resolve);
    tx.params = [
        abi.fix(smooth_rep, "hex"),
        abi.fix(reports, "hex"),
        scaled,
        scaled_max,
        scaled_min,
        num_reports,
        num_events
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// redeem_resolve.se
Augur.prototype.redeem_resolve = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_resolve);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// branches.se
Augur.prototype.getBranches = function (onSent) {
    return this.fire(this.tx.getBranches, onSent);
};
Augur.prototype.getMarkets = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getPeriodLength = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getPeriodLength);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getVotePeriod = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getVotePeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getStep = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getStep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.setStep = function (branch, step, onSent) {
    var tx = this.utils.copy(this.tx.setStep);
    tx.params = [branch, step];
    return this.fire(tx, onSent);
};
Augur.prototype.getSubstep = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.setSubstep = function (branch, substep, onSent) {
    var tx = this.utils.copy(this.tx.setSubstep);
    tx.params = [branch, substep];
    return this.fire(tx, onSent);
};
Augur.prototype.incrementSubstep = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.incrementSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumMarkets = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getNumMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getMinTradingFee = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getMinTradingFee);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumBranches = function (onSent) {
    return this.fire(this.tx.getNumBranches, onSent);
};
Augur.prototype.getBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = this.utils.copy(this.tx.getBranch);
    tx.params = branchNumber;
    return this.fire(tx, onSent);
};
Augur.prototype.incrementPeriod = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.incrementPeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.addMarket = function (branch, marketID, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.addMarket);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.addMarket), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));    
};

// misc utility functions

Augur.prototype.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent) {
    var tx = this.utils.copy(this.tx.moveEventsToCurrentPeriod);
    tx.params = [branch, currentVotePeriod, currentPeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getCurrentPeriod = function (branch) {
    return parseInt(rpc.blockNumber()) / parseInt(this.getPeriodLength(branch));
};
Augur.prototype.updatePeriod = function (branch) {
    var currentPeriod = this.getCurrentPeriod(branch);
    this.incrementPeriod(branch);
    this.setStep(branch, 0);
    this.setSubstep(branch, 0);
    this.moveEventsToCurrentPeriod(branch, this.getVotePeriod(branch), currentPeriod);
};

Augur.prototype.addEvent = function (branch, futurePeriod, eventID, onSent) {
    var tx = this.utils.copy(this.tx.addEvent);
    tx.params = [branch, futurePeriod, eventID];
    return this.fire(tx, onSent);
};
Augur.prototype.setTotalRepReported = function (branch, expDateIndex, repReported, onSent) {
    var tx = this.utils.copy(this.tx.setTotalRepReported);
    tx.params = [branch, expDateIndex, repReported];
    return this.fire(tx, onSent);
};
Augur.prototype.setReporterBallot = function (branch, expDateIndex, reporterID, report, reputation, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.setReporterBallot);
    tx.params = [branch, expDateIndex, reporterID, abi.fix(report, "hex"), reputation];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.setVSize = function (branch, expDateIndex, vSize, onSent) {
    var tx = this.utils.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, vSize];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportsFilled = function (branch, expDateIndex, reportsFilled, onSent) {
    var tx = this.utils.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, reportsFilled];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportsMask = function (branch, expDateIndex, reportsMask, onSent) {
    var tx = this.utils.copy(this.tx.setReportsMask);
    tx.params = [branch, expDateIndex, reportsMask];
    return this.fire(tx, onSent);
};
Augur.prototype.setWeightedCenteredData = function (branch, expDateIndex, weightedCenteredData, onSent) {
    var tx = this.utils.copy(this.tx.setWeightedCenteredData);
    tx.params = [branch, expDateIndex, weightedCenteredData];
    return this.fire(tx, onSent);
};
Augur.prototype.setCovarianceMatrixRow = function (branch, expDateIndex, covarianceMatrixRow, onSent) {
    var tx = this.utils.copy(this.tx.setCovarianceMatrixRow);
    tx.params = [branch, expDateIndex, covarianceMatrixRow];
    return this.fire(tx, onSent);
};
Augur.prototype.setDeflated = function (branch, expDateIndex, deflated, onSent) {
    var tx = this.utils.copy(this.tx.setDeflated);
    tx.params = [branch, expDateIndex, deflated];
    return this.fire(tx, onSent);
};
Augur.prototype.setLoadingVector = function (branch, expDateIndex, loadingVector, onSent) {
    var tx = this.utils.copy(this.tx.setLoadingVector);
    tx.params = [branch, expDateIndex, loadingVector];
    return this.fire(tx, onSent);
};
Augur.prototype.setScores = function (branch, expDateIndex, scores, onSent) {
    var tx = this.utils.copy(this.tx.setScores);
    tx.params = [branch, expDateIndex, scores];
    return this.fire(tx, onSent);
};
Augur.prototype.setSetOne = function (branch, expDateIndex, setOne, onSent) {
    var tx = this.utils.copy(this.tx.setOne);
    tx.params = [branch, expDateIndex, setOne];
    return this.fire(tx, onSent);
};
Augur.prototype.setSetTwo = function (branch, expDateIndex, setTwo, onSent) {
    var tx = this.utils.copy(this.tx.setSetTwo);
    tx.params = [branch, expDateIndex, setTwo];
    return this.fire(tx, onSent);
};
Augur.prototype.setOld = function (branch, expDateIndex, setOld, onSent) {
    var tx = this.utils.copy(this.tx.setOld);
    tx.params = [branch, expDateIndex, setOld];
    return this.fire(tx, onSent);
};
Augur.prototype.setNewOne = function (branch, expDateIndex, newOne, onSent) {
    var tx = this.utils.copy(this.tx.setNewOne);
    tx.params = [branch, expDateIndex, newOne];
    return this.fire(tx, onSent);
};
Augur.prototype.setNewTwo = function (branch, expDateIndex, newTwo, onSent) {
    var tx = this.utils.copy(this.tx.setNewTwo);
    tx.params = [branch, expDateIndex, newTwo];
    return this.fire(tx, onSent);
};
Augur.prototype.setAdjPrinComp = function (branch, expDateIndex, adjPrinComp, onSent) {
    var tx = this.utils.copy(this.tx.setAdjPrinComp);
    tx.params = [branch, expDateIndex, adjPrinComp];
    return this.fire(tx, onSent);
};
Augur.prototype.setSmoothRep = function (branch, expDateIndex, smoothRep, onSent) {
    var tx = this.utils.copy(this.tx.setSmoothRep);
    tx.params = [branch, expDateIndex, smoothRep];
    return this.fire(tx, onSent);
};
Augur.prototype.setOutcomesFinal = function (branch, expDateIndex, outcomesFinal, onSent) {
    var tx = this.utils.copy(this.tx.setOutcomesFinal);
    tx.params = [branch, expDateIndex, outcomesFinal];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportHash = function (branch, expDateIndex, reportHash, onSent) {
    var tx = this.utils.copy(this.tx.setReportHash);
    tx.params = [branch, expDateIndex, reportHash];
    return this.fire(tx, onSent);
};

// events.se
Augur.prototype.getEventInfo = function (event_id, callback) {
    // event_id: sha256 hash id
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
    this.tx.getEventInfo.params = event_id;
    if (this.utils.is_function(callback)) {
        this.fire(this.tx.getEventInfo, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(this.tx.getEventInfo));
    }
};
Augur.prototype.getEventBranch = function (branchNumber, callback) {
    // branchNumber: integer
    var tx = this.utils.copy(this.tx.getEventBranch);
    tx.params = branchNumber;
    return this.fire(tx, callback);
};
Augur.prototype.getExpiration = function (event, callback) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getExpiration);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getOutcome = function (event, callback) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getOutcome);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getMinValue = function (event, callback) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getMinValue);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getMaxValue = function (event, callback) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getMaxValue);
    tx.params = event;
    return this.fire(tx, callback);
};
Augur.prototype.getNumOutcomes = function (event, callback) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getNumOutcomes);
    tx.params = event;
    return this.fire(tx, callback);
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
                    callback(blockNum.dividedBy(periodLength).floor().sub(1));
                });
            }
        });
    } else {
        periodLength = this.fire(this.tx.getPeriodLength);
        if (periodLength) {
            blockNum = abi.bignum(rpc.blockNumber());
            return blockNum.dividedBy(abi.bignum(periodLength)).floor().sub(1);
        }
    }
};

// expiringEvents.se
Augur.prototype.getEvents = function (branch, votePeriod, callback) {
    // branch: sha256 hash id
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getEventsRange = function (branch, vpStart, vpEnd, callback) {
    // branch: sha256
    // vpStart: integer
    // vpEnd: integer
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
Augur.prototype.getNumberEvents = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNumberEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getEvent = function (branch, votePeriod, eventIndex, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getEvent);
    tx.params = [branch, votePeriod, eventIndex];
    return this.fire(tx, callback);
};
Augur.prototype.getTotalRepReported = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getTotalRepReported);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReporterBallot = function (branch, votePeriod, reporterID, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReporterBallot);
    tx.params = [branch, votePeriod, reporterID];
    return this.fire(tx, callback);
};
Augur.prototype.getReport = function (branch, votePeriod, reporter, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReports);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, callback);
};
Augur.prototype.getReportHash = function (branch, votePeriod, reporter, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportHash);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, callback);
};
Augur.prototype.getVSize = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getVSize);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReportsFilled = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportsFilled);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReportsMask = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportsMask);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getWeightedCenteredData = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getWeightedCenteredData);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getCovarianceMatrixRow = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getCovarianceMatrixRow);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getDeflated = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getDeflated);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getLoadingVector = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getLoadingVector);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getLatent = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getLatent);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getScores = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getScores);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getSetOne = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSetOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getSetTwo = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSetTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.returnOld = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.returnOld);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getNewOne = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNewOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getNewTwo = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNewTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getAdjPrinComp = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getAdjPrinComp);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getSmoothRep = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSmoothRep);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getOutcomesFinal = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getOutcomesFinal);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.getReporterPayouts = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReporterPayouts);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};

Augur.prototype.getTotalReputation = function (branch, votePeriod, callback) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getTotalReputation);
    tx.params = [branch, votePeriod];
    return this.fire(tx, callback);
};
Augur.prototype.setTotalReputation = function (branch, votePeriod, totalReputation, onSent, onSuccess, onFailed) {
    // branch: sha256
    // votePeriod: integer
    // totalReputation: number -> fixed
    var tx = this.utils.copy(this.tx.setTotalReputation);
    tx.params = [branch, votePeriod, abi.fix(totalReputation, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.makeBallot = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.makeBallot);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};

// markets.se
Augur.prototype.getSimulatedBuy = function (market, outcome, amount, callback) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = this.utils.copy(this.tx.getSimulatedBuy);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    tx.params = [market, outcome, abi.fix(amount, "hex")];
    return this.fire(tx, callback);
};
Augur.prototype.getSimulatedSell = function (market, outcome, amount, callback) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = this.utils.copy(this.tx.getSimulatedSell);
    tx.params = [market, outcome, abi.fix(amount, "hex")];
    return this.fire(tx, callback);
};
Augur.prototype.lsLmsr = function (market, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.lsLmsr);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.parseMarketInfo = function (rawInfo, options, callback) {
    var TRADER_FIELDS = 3;
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

        // organize trader info
        for (var i = 0; i < info.numOutcomes; ++i) {
            info.outcomes[i] = {shares: {}};
        }
        var addr;
        for (i = 0; i < info.traderCount; ++i) {
            addr = abi.format_address(rawInfo[i*TRADER_FIELDS + index]);
            info.participants[addr] = i;
            info.outcomes[0].shares[addr] = abi.unfix(rawInfo[i*TRADER_FIELDS + index + 1], "string");
            info.outcomes[1].shares[addr] = abi.unfix(rawInfo[i*TRADER_FIELDS + index + 2], "string");
        }

        // organize event info
        // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
        var endDate;
        index += info.traderCount*TRADER_FIELDS;
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
                txList[i] = this.utils.copy(this.tx.getDescription);
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
Augur.prototype.getMarketInfo = function (market, callback) {
    var self = this;
    var tx = this.utils.copy(this.tx.getMarketInfo);
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
    var tx = this.utils.copy(this.tx.getMarketsInfo);
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
    var tx = this.utils.copy(this.tx.getMarketEvents);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getNumEvents = function (market, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getNumEvents);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getBranchID = function (market, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getBranchID);
    tx.params = market;
    return this.fire(tx, callback);
};
// Get the current number of participants in this market
Augur.prototype.getCurrentParticipantNumber = function (market, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getCurrentParticipantNumber);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getMarketNumOutcomes = function (market, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getMarketNumOutcomes);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getParticipantSharesPurchased = function (market, participantNumber, outcome, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participantNumber, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getSharesPurchased = function (market, outcome, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
Augur.prototype.getWinningOutcomes = function (market, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getWinningOutcomes);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.price = function (market, outcome, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.price);
    tx.params = [market, outcome];
    return this.fire(tx, callback);
};
// Get the participant number (the array index) for specified address
Augur.prototype.getParticipantNumber = function (market, address, callback) {
    // market: sha256
    // address: ethereum account
    var tx = this.utils.copy(this.tx.getParticipantNumber);
    tx.params = [market, address];
    return this.fire(tx, callback);
};
// Get the address for the specified participant number (array index) 
Augur.prototype.getParticipantID = function (market, participantNumber, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getParticipantID);
    tx.params = [market, participantNumber];
    return this.fire(tx, callback);
};
Augur.prototype.getAlpha = function (market, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getAlpha);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getCumScale = function (market, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getCumScale);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getTradingPeriod = function (market, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getTradingPeriod);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.getTradingFee = function (market, callback) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getTradingFee);
    tx.params = market;
    return this.fire(tx, callback);
};
Augur.prototype.initialLiquiditySetup = function (marketID, alpha, cumulativeScale, numOutcomes, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.initialLiquiditySetup);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initialLiquiditySetup), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.modifyShares = function (marketID, outcome, amount, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.modifyShares);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.modifyShares), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
Augur.prototype.initializeMarket = function (marketID, events, tradingPeriod, tradingFee, branch, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.initializeMarket);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initializeMarket), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// reporting.se
Augur.prototype.getRepBalance = function (branch, account, onSent) {
    // branch: sha256 hash id
    // account: ethereum address (hexstring)
    var tx = this.utils.copy(this.tx.getRepBalance);
    tx.params = [branch, account || this.web.account.address || this.coinbase];
    return this.fire(tx, onSent);
};
Augur.prototype.getRepByIndex = function (branch, repIndex, onSent) {
    // branch: sha256
    // repIndex: integer
    var tx = this.utils.copy(this.tx.getRepByIndex);
    tx.params = [branch, repIndex];
    return this.fire(tx, onSent);
};
Augur.prototype.getReporterID = function (branch, index, onSent) {
    // branch: sha256
    // index: integer
    var tx = this.utils.copy(this.tx.getReporterID);
    tx.params = [branch, index];
    return this.fire(tx, onSent);
};
// reputation of a single address over all branches
Augur.prototype.getReputation = function (address, onSent) {
    // address: ethereum account
    var tx = this.utils.copy(this.tx.getReputation);
    tx.params = address;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumberReporters = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getNumberReporters);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.repIDToIndex = function (branch, repID, onSent) {
    // branch: sha256
    // repID: ethereum account
    var tx = this.utils.copy(this.tx.repIDToIndex);
    tx.params = [branch, repID];
    return this.fire(tx, onSent);
};
Augur.prototype.getTotalRep = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.getTotalRep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.hashReport = function (ballot, salt, onSent) {
    // ballot: number[]
    // salt: integer
    if (ballot.constructor === Array) {
        var tx = this.utils.copy(this.tx.hashReport);
        tx.params = [abi.fix(ballot, "hex"), salt];
        return this.fire(tx, onSent);
    }
};

// checkQuorum.se
Augur.prototype.checkQuorum = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.checkQuorum);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// buy&sellShares.se
Augur.prototype.getNonce = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getNonce);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.buyShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        if (branch.nonce) {
            nonce = branch.nonce; // integer (optional)
        }
        limit = branch.limit || 0;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = this.utils.copy(this.tx.buyShares);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    if (branch && branch.constructor === BigNumber) {
        branch = abi.prefix_hex(branch.toString(16));
    }
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, abi.fix(amount, "hex"), nonce, limit || 0];
            this.transact(tx, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, abi.fix(amount, "hex"), nonce, limit || 0];
        return this.transact(tx);
    }
};
Augur.prototype.sellShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        if (branch.nonce) {
            nonce = branch.nonce; // integer (optional)
        }
        limit = branch.limit || 0;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = this.utils.copy(this.tx.sellShares);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    if (branch && branch.constructor === BigNumber) {
        branch = abi.prefix_hex(branch.toString(16));
    }
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, abi.fix(amount, "hex"), nonce, limit || 0];
            this.transact(tx, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, abi.fix(amount, "hex"), nonce, limit || 0];
        return this.transact(tx);
    }
};

// createBranch.se
Augur.prototype.createSubbranch = function (description, periodLength, parent, tradingFee, onSent, onSuccess, onFailed) {
    if (description && description.periodLength) {
        periodLength = description.periodLength;
        parent = description.parent;
        tradingFee = description.tradingFee;
        if (description.onSent) onSent = description.onSent;
        if (description.onSuccess) onSuccess = description.onSuccess;
        if (description.onFailed) onFailed = description.onFailed;
        description = description.description;
    }
    var tx = this.utils.copy(this.tx.sendReputation);
    tx.params = [description, periodLength, parent, tradingFee];
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
    var tx = this.utils.copy(this.tx.sendReputation);
    tx.params = [branch, to, abi.fix(value, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// transferShares.se

// makeReports.se
Augur.prototype.report = function (branch, report, votePeriod, salt, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        report = branch.report;
        votePeriod = branch.votePeriod;
        salt = branch.salt;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.report);
    tx.params = [branch, abi.fix(report, "hex"), votePeriod, salt];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.submitReportHash = function (branch, reportHash, votePeriod, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        reportHash = branch.reportHash;
        votePeriod = branch.votePeriod;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.submitReportHash);
    tx.params = [branch, reportHash, votePeriod];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.checkReportValidity = function (branch, report, votePeriod, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        report = branch.report;
        votePeriod = branch.votePeriod;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.checkReportValidity);
    tx.params = [branch, abi.fix(report, "hex"), votePeriod];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.slashRep = function (branch, votePeriod, salt, report, reporter, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        votePeriod = branch.votePeriod;
        salt = branch.salt;
        report = branch.report;
        reporter = branch.reporter;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.slashRep);
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
        expDate = branch.expDate;         // integer
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
Augur.prototype.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, onSent, onSuccess, onFailed) {
    // first parameter can optionally be a transaction object
    if (branch.constructor === Object && branch.branchId) {
        alpha = branch.alpha;                // number -> fixed-point
        description = branch.description;    // string
        liquidity = branch.initialLiquidity; // number -> fixed-point
        tradingFee = branch.tradingFee;      // number -> fixed-point
        events = branch.events;              // array [sha256, ...]
        onSent = branch.onSent;              // function({id, txhash})
        onSuccess = branch.onSuccess;        // function({id, txhash})
        onFailed = branch.onFailed;          // function({id, txhash})
        branch = branch.branchId;            // sha256 hash
    }
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
        events
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// closeMarket.se
Augur.prototype.closeMarket = function (branch, market, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        market = branch.marketId;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.closeMarket);
    tx.params = [branch, market];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// dispatch.se
Augur.prototype.dispatch = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256 or transaction object
    if (branch.constructor === Object && branch.branchId) {
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = this.utils.copy(this.tx.dispatch);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};

Augur.prototype.checkPeriod = function (branch) {
    var period = abi.number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(abi.number(rpc.blockNumber()) / abi.number(this.getPeriodLength(branch)));
    var periodsBehind = currentPeriod - period - 1;
    return periodsBehind;
};

// new UI

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

// filter API

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
        self.getMarkets(branch, function (markets) {
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
        topics: ["creationBlock"]
    }, function (logs) {
        if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
            return cb(null);
        }
        if (logs.error) return cb(logs);
        var block = self.filters.search_creation_logs(logs, market);
        if (block && block.constructor === Array && block.length &&
            block[0].constructor === Object && block[0].blockNumber) {
            cb(abi.bignum(block[0].blockNumber).toNumber());
        }
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
        self.getMarkets(branch, function (markets) {
            if (!markets || (markets && (markets.constructor !== Array || !markets.length))) {
                return cb(null);
            }
            if (markets.error) return cb(markets);
            var priceHistory = {};
            var outcomes = [1, 2];
            for (var i = 0, len = markets.length; i < len; ++i) {
                priceHistory[markets[i]] = {};
                for (var j = 0, numOutcomes = outcomes.length; j < numOutcomes; ++j) {
                    priceHistory[markets[i]][outcomes[j]] = self.filters.search_price_logs(
                        logs,
                        markets[i],
                        outcomes[j]
                    );
                }
            }
            cb(priceHistory);
        });
    });
};

Augur.prototype.getOutcomePriceHistory = function (market, outcome, cb) {
    if (!market || !outcome) return;
    var filter = {
        fromBlock: "0x1",
        toBlock: "latest",
        address: this.contracts.buyAndSellShares,
        topics: ["updatePrice"]
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

Augur.prototype.getMarketPriceHistory = function (market, cb) {
    if (market) {
        var filter = {
            fromBlock: "0x1",
            toBlock: "latest",
            address: this.contracts.buyAndSellShares,
            topics: ["updatePrice"]
        };
        if (this.utils.is_function(cb)) {
            var self = this;
            this.filters.eth_getLogs(filter, function (logs) {
                if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                    return cb(null);
                }
                if (logs.error) return cb(logs);
                var priceHistory = {};
                var outcomes = [1, 2]; // TODO don't hardcode
                for (var j = 0, n = outcomes.length; j < n; ++j) {
                    priceHistory[outcomes[j]] = self.filters.search_price_logs(
                        logs,
                        market,
                        outcomes[j]
                    );
                }
                cb(priceHistory);
            });
        } else {
            var logs = this.filters.eth_getLogs(filter);
            if (!logs || (logs && (logs.constructor !== Array || !logs.length))) {
                return cb(null);
            }
            if (logs.error) throw logs;
            var priceHistory = {};
            var outcomes = [1, 2]; // TODO don't hardcode
            for (var j = 0, n = outcomes.length; j < n; ++j) {
                priceHistory[outcomes[j]] = this.filters.search_price_logs(
                    logs,
                    market,
                    outcomes[j]
                );
            }
            return priceHistory;
        }
    }
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
        var tx = abi.copy(this.tx[method]);
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
