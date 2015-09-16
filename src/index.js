/**
 * augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var contracts = require("augur-contracts");
var Tx = require("./tx");
var Filters = require("./filters");
var Accounts = require("./client/accounts");
var Comments = require("./client/comments");
var Namereg = require("./aux/namereg");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

var augur = {

    options: { debug: { broadcast: false, fallback: false } },

    // If set to true, all numerical results (excluding hashes)
    // are returned as BigNumber objects
    bignumbers: true,

    connection: null,

    utils: require("./utilities"),
    constants: require("./constants"),
    errors: require("./errors"),
    numeric: abi,

    rpc: rpc,
    web: {},
    comments: {},
    filters: {},
    namereg: {},

    // Network ID
    network_id: "0",

    // Branch IDs
    branches: {
        demo: "0xf69b5",
        alpha: "0xf69b5",
        dev: "0xf69b5"
    },

    // Demo/shared account
    demo: "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec"

};

rpc.TX_POLL_MAX = 64;
augur.contracts = augur.utils.copy(contracts["0"]);
augur.init_contracts = augur.utils.copy(contracts["0"]);

augur.reload_modules = function () {
    if (this.contracts) this.tx = new Tx(this.contracts);
    rpc.bignumbers = this.bignumbers;
    rpc.debug = this.options.debug;
    this.web = new Accounts(this);
    this.comments = new Comments(this);
    this.filters = new Filters(this);
    this.namereg = new Namereg(this);
};

augur.reload_modules();

/*******************************
 * Ethereum network connection *
 *******************************/

 augur.default_rpc = function () {
    rpc.reset();
    this.reload_modules();
    return false;
};

augur.detect_network = function (chain) {
    var key, method;
    this.network_id = chain || rpc.version() || "0";
    this.contracts = this.utils.copy(contracts[this.network_id]);
    for (method in this.tx) {
        if (!this.tx.hasOwnProperty(method)) continue;
        key = this.utils.has_value(this.init_contracts, this.tx[method].to);
        if (key) {
            this.tx[method].to = this.contracts[key];
        }
    }
    this.reload_modules();
    return this.network_id;
};

augur.get_coinbase = function () {
    var accounts, num_accounts, i, method;
    this.coinbase = rpc.coinbase();
    if (!this.coinbase) {
        accounts = rpc.accounts();
        num_accounts = accounts.length;
        if (num_accounts === 1) {
            if (this.unlocked(accounts[0])) {
                this.coinbase = accounts[0];
            }
        } else {
            for (i = 0; i < num_accounts; ++i) {
                if (this.unlocked(accounts[i])) {
                    this.coinbase = accounts[i];
                    break;
                }
            }
        }
    }
    if (this.coinbase && this.coinbase !== "0x") {
        for (method in this.tx) {
            if (!this.tx.hasOwnProperty(method)) continue;
            this.tx[method].from = this.coinbase;
        }
    } else {
        return this.default_rpc();
    }
};

augur.update_contracts = function () {
    var key, method;
    if (JSON.stringify(this.init_contracts) !== JSON.stringify(this.contracts)) {
        for (method in this.tx) {
            if (!this.tx.hasOwnProperty(method)) continue;
            key = this.utils.has_value(this.init_contracts, this.tx[method].to);
            if (key) {
                this.tx[method].to = this.contracts[key];
            }
        }
        this.reload_modules();
    }
    this.init_contracts = this.utils.copy(this.contracts);
};

augur.parse_rpcinfo = function (rpcinfo, chain) {
    var rpcstr, rpc_obj = {};
    if (rpcinfo.constructor === Object) {
        if (rpcinfo.protocol) rpc_obj.protocol = rpcinfo.protocol;
        if (rpcinfo.host) rpc_obj.host = rpcinfo.host;
        if (rpcinfo.port) {
            rpc_obj.port = rpcinfo.port;
        } else {
            if (rpcinfo.host) {
                rpcstr = rpcinfo.host.split(":");
                if (rpcstr.length === 2) {
                    rpc_obj.host = rpcstr[0];
                    rpc_obj.port = rpcstr[1];
                }
            }
        }
        if (rpcinfo.chain) chain = rpcinfo.chain;
    } else if (rpcinfo.constructor === String) {
        if (rpcinfo.indexOf("://") === -1 && rpcinfo.indexOf(':') === -1) {
            rpc_obj.host = rpcinfo;
        } else if (rpcinfo.indexOf("://") > -1) {
            rpcstr = rpcinfo.split("://");
            rpc_obj.protocol = rpc[0];
            rpcstr = rpcstr[1].split(':');
            if (rpcstr.length === 2) {
                rpc_obj.host = rpcstr[0];
                rpc_obj.port = rpcstr[1];
            } else {
                rpc_obj.host = rpcstr;
            }
        } else if (rpcinfo.indexOf(':') > -1) {
            rpcstr = rpcinfo.split(':');
            if (rpcstr.length === 2) {
                rpc_obj.host = rpcstr[0];
                rpc_obj.port = rpcstr[1];
            } else {
                rpc_obj.host = rpcstr;
            }
        } else {
            return this.default_rpc();
        }
    }
    return this.utils.urlstring(rpc_obj);
};

augur.connect = function (rpcinfo, chain) {
    if (rpcinfo) {
        var localnode = this.parse_rpcinfo(rpcinfo, chain);
        if (localnode) rpc.nodes.local = localnode;
    }
    this.reload_modules();
    if (this.connection === null &&
        JSON.stringify(this.init_contracts) === JSON.stringify(this.contracts))
    {
        this.detect_network(chain);
    }
    this.get_coinbase();
    this.update_contracts();
    this.connection = true;
    return true;
};

augur.connected = function () {
    try {
        rpc.coinbase();
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Batch interface:
 * var b = augur.createBatch();
 * b.add("getCashBalance", [augur.coinbase], callback);
 * b.add("getRepBalance", [augur.branches.dev, augur.coinbase], callback);
 * b.execute();
 */
var Batch = function () {
    this.txlist = [];
};

Batch.prototype.add = function (method, params, callback) {
    if (method) {
        var tx = abi.copy(augur.tx[method]);
        tx.params = params;
        if (callback) tx.callback = callback;
        this.txlist.push(tx);
    }
};

Batch.prototype.execute = function () {
    rpc.batch(this.txlist, true);
};

augur.createBatch = function createBatch () {
    return new Batch();
};

augur.fire = function (tx, callback) {
    tx.from = tx.from || augur.coinbase;
    return rpc.fire(tx, callback);
};

augur.transact = function (tx, onSent, onSuccess, onFailed) {
    if (tx.send && this.web && this.web.account && this.web.account.address) {
        tx.invocation = { invoke: this.web.invoke, context: this.web };
    }
    tx.from = tx.from || augur.coinbase;
    rpc.transact(tx, onSent, onSuccess, onFailed);
};

/*************
 * augur API *
 *************/

// faucets.se
augur.cashFaucet = function (onSent, onSuccess, onFailed) {
    if (onSent && onSent.constructor === Object) {
        if (onSent.onSuccess) onSuccess = onSent.onSuccess;
        if (onSent.onFailed) onFailed = onSent.onFailed;
        if (onSent.onSent) onSent = onSent.onSent;
    }
    return this.transact(this.tx.cashFaucet, onSent, onSuccess, onFailed);
};
augur.reputationFaucet = function (branch, onSent, onSuccess, onFailed) {
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
augur.getCashBalance = function (account, onSent) {
    // account: ethereum account
    var tx = this.utils.copy(this.tx.getCashBalance);
    tx.params = account || this.web.account.address || this.coinbase;
    return augur.fire(tx, onSent);
};
augur.sendCash = function (to, value, onSent, onSuccess, onFailed) {
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
augur.sendCashFrom = function (to, value, from, onSent, onSuccess, onFailed) {
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

// info.se
augur.getCreator = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getCreator);
    tx.params = id;
    return augur.fire(tx, onSent);
};
augur.getCreationFee = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getCreationFee);
    tx.params = id;
    return augur.fire(tx, onSent);
};
augur.getDescription = function (item, onSent) {
    // item: sha256 hash id
    var tx = this.utils.copy(this.tx.getDescription);
    tx.params = item;
    return augur.fire(tx, onSent);
};
augur.setInfo = function (id, description, creator, fee, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.setInfo);
    var unpacked = this.utils.unpack(id, this.utils.labels(this.setInfo), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// redeem_interpolate.se
augur.redeem_interpolate = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_interpolate);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.read_ballots = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.read_ballots);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// center.se
augur.center = function (reports, reputation, scaled, scaled_max, scaled_min, max_iterations, max_components, onSent, onSuccess, onFailed) {
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
augur.redeem_center = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_center);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.redeem_covariance = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_covariance);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// redeem_score.se
augur.redeem_blank = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_blank);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.redeem_loadings = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_loadings);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// score.se
augur.blank = function (components_remaining, max_iterations, num_events, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.blank);
    tx.params = [components_remaining, max_iterations, num_events];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.loadings = function (iv, wcd, reputation, num_reports, num_events, onSent, onSuccess, onFailed) {
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
augur.resolve = function (smooth_rep, reports, scaled, scaled_max, scaled_min, num_reports, num_events, onSent, onSuccess, onFailed) {
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
augur.redeem_resolve = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.redeem_resolve);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// branches.se
augur.getBranches = function (onSent) {
    return augur.fire(this.tx.getBranches, onSent);
};
augur.getMarkets = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getMarkets);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getPeriodLength = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getPeriodLength);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getVotePeriod = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getVotePeriod);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getStep = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getStep);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.setStep = function (branch, step, onSent) {
    var tx = this.utils.copy(this.tx.setStep);
    tx.params = [branch, step];
    return augur.fire(tx, onSent);
};
augur.getSubstep = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getSubstep);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.setSubstep = function (branch, substep, onSent) {
    var tx = this.utils.copy(this.tx.setSubstep);
    tx.params = [branch, substep];
    return augur.fire(tx, onSent);
};
augur.incrementSubstep = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.incrementSubstep);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getNumMarkets = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getNumMarkets);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getMinTradingFee = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getMinTradingFee);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.getNumBranches = function (onSent) {
    return augur.fire(this.tx.getNumBranches, onSent);
};
augur.getBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = this.utils.copy(this.tx.getBranch);
    tx.params = branchNumber;
    return augur.fire(tx, onSent);
};
augur.incrementPeriod = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.incrementPeriod);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.addMarket = function (branch, marketID, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.addMarket);
    var unpacked = this.utils.unpack(branch, this.utils.labels(this.addMarket), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));    
};

// misc utility functions

augur.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent) {
    var tx = this.utils.copy(this.tx.moveEventsToCurrentPeriod);
    tx.params = [branch, currentVotePeriod, currentPeriod];
    return augur.fire(tx, onSent);
};
augur.getCurrentPeriod = function (branch) {
    return parseInt(rpc.blockNumber()) / parseInt(this.getPeriodLength(branch));
};
augur.updatePeriod = function (branch) {
    var currentPeriod = this.getCurrentPeriod(branch);
    this.incrementPeriod(branch);
    this.setStep(branch, 0);
    this.setSubstep(branch, 0);
    this.moveEventsToCurrentPeriod(branch, this.getVotePeriod(branch), currentPeriod);
};
augur.sprint = function (branch, length) {
    for (var i = 0, len = length || 25; i < len; ++i) {
        this.updatePeriod(branch);
    }
};

augur.addEvent = function (branch, futurePeriod, eventID, onSent) {
    var tx = this.utils.copy(this.tx.addEvent);
    tx.params = [branch, futurePeriod, eventID];
    return augur.fire(tx, onSent);
};
augur.setTotalRepReported = function (branch, expDateIndex, repReported, onSent) {
    var tx = this.utils.copy(this.tx.setTotalRepReported);
    tx.params = [branch, expDateIndex, repReported];
    return augur.fire(tx, onSent);
};
augur.setReporterBallot = function (branch, expDateIndex, reporterID, report, reputation, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.setReporterBallot);
    tx.params = [branch, expDateIndex, reporterID, abi.fix(report, "hex"), reputation];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.setVSize = function (branch, expDateIndex, vSize, onSent) {
    var tx = this.utils.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, vSize];
    return augur.fire(tx, onSent);
};
augur.setReportsFilled = function (branch, expDateIndex, reportsFilled, onSent) {
    var tx = this.utils.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, reportsFilled];
    return augur.fire(tx, onSent);
};
augur.setReportsMask = function (branch, expDateIndex, reportsMask, onSent) {
    var tx = this.utils.copy(this.tx.setReportsMask);
    tx.params = [branch, expDateIndex, reportsMask];
    return augur.fire(tx, onSent);
};
augur.setWeightedCenteredData = function (branch, expDateIndex, weightedCenteredData, onSent) {
    var tx = this.utils.copy(this.tx.setWeightedCenteredData);
    tx.params = [branch, expDateIndex, weightedCenteredData];
    return augur.fire(tx, onSent);
};
augur.setCovarianceMatrixRow = function (branch, expDateIndex, covarianceMatrixRow, onSent) {
    var tx = this.utils.copy(this.tx.setCovarianceMatrixRow);
    tx.params = [branch, expDateIndex, covarianceMatrixRow];
    return augur.fire(tx, onSent);
};
augur.setDeflated = function (branch, expDateIndex, deflated, onSent) {
    var tx = this.utils.copy(this.tx.setDeflated);
    tx.params = [branch, expDateIndex, deflated];
    return augur.fire(tx, onSent);
};
augur.setLoadingVector = function (branch, expDateIndex, loadingVector, onSent) {
    var tx = this.utils.copy(this.tx.setLoadingVector);
    tx.params = [branch, expDateIndex, loadingVector];
    return augur.fire(tx, onSent);
};
augur.setScores = function (branch, expDateIndex, scores, onSent) {
    var tx = this.utils.copy(this.tx.setScores);
    tx.params = [branch, expDateIndex, scores];
    return augur.fire(tx, onSent);
};
augur.setSetOne = function (branch, expDateIndex, setOne, onSent) {
    var tx = this.utils.copy(this.tx.setOne);
    tx.params = [branch, expDateIndex, setOne];
    return augur.fire(tx, onSent);
};
augur.setSetTwo = function (branch, expDateIndex, setTwo, onSent) {
    var tx = this.utils.copy(this.tx.setSetTwo);
    tx.params = [branch, expDateIndex, setTwo];
    return augur.fire(tx, onSent);
};
augur.setOld = function (branch, expDateIndex, setOld, onSent) {
    var tx = this.utils.copy(this.tx.setOld);
    tx.params = [branch, expDateIndex, setOld];
    return augur.fire(tx, onSent);
};
augur.setNewOne = function (branch, expDateIndex, newOne, onSent) {
    var tx = this.utils.copy(this.tx.setNewOne);
    tx.params = [branch, expDateIndex, newOne];
    return augur.fire(tx, onSent);
};
augur.setNewTwo = function (branch, expDateIndex, newTwo, onSent) {
    var tx = this.utils.copy(this.tx.setNewTwo);
    tx.params = [branch, expDateIndex, newTwo];
    return augur.fire(tx, onSent);
};
augur.setAdjPrinComp = function (branch, expDateIndex, adjPrinComp, onSent) {
    var tx = this.utils.copy(this.tx.setAdjPrinComp);
    tx.params = [branch, expDateIndex, adjPrinComp];
    return augur.fire(tx, onSent);
};
augur.setSmoothRep = function (branch, expDateIndex, smoothRep, onSent) {
    var tx = this.utils.copy(this.tx.setSmoothRep);
    tx.params = [branch, expDateIndex, smoothRep];
    return augur.fire(tx, onSent);
};
augur.setOutcomesFinal = function (branch, expDateIndex, outcomesFinal, onSent) {
    var tx = this.utils.copy(this.tx.setOutcomesFinal);
    tx.params = [branch, expDateIndex, outcomesFinal];
    return augur.fire(tx, onSent);
};
augur.setReportHash = function (branch, expDateIndex, reportHash, onSent) {
    var tx = this.utils.copy(this.tx.setReportHash);
    tx.params = [branch, expDateIndex, reportHash];
    return augur.fire(tx, onSent);
};

// events.se
augur.getEventInfo = function (event_id, onSent) {
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
            if (self.bignumbers) {
                info[0] = abi.hex(info[0]);
                info[1] = abi.bignum(info[1]);
                info[2] = abi.unfix(info[2]);
                info[3] = abi.bignum(info[3]);
                info[4] = abi.bignum(info[4]);
                info[5] = abi.bignum(info[5]);
            } else {
                info[0] = abi.hex(info[0]);
                info[1] = abi.bignum(info[1]).toFixed();
                info[2] = abi.unfix(info[2], "string");
                info[3] = abi.bignum(info[3]).toFixed();
                info[4] = abi.bignum(info[4]).toFixed();
                info[5] = abi.bignum(info[5]).toFixed();
            }
        }
        return info;
    };
    this.tx.getEventInfo.params = event_id;
    if (onSent) {
        augur.fire(this.tx.getEventInfo, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(augur.fire(this.tx.getEventInfo));
    }
};
augur.getEventBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = this.utils.copy(this.tx.getEventBranch);
    tx.params = branchNumber;
    return augur.fire(tx, onSent);
};
augur.getExpiration = function (event, onSent) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getExpiration);
    tx.params = event;
    return augur.fire(tx, onSent);
};
augur.getOutcome = function (event, onSent) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getOutcome);
    tx.params = event;
    return augur.fire(tx, onSent);
};
augur.getMinValue = function (event, onSent) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getMinValue);
    tx.params = event;
    return augur.fire(tx, onSent);
};
augur.getMaxValue = function (event, onSent) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getMaxValue);
    tx.params = event;
    return augur.fire(tx, onSent);
};
augur.getNumOutcomes = function (event, onSent) {
    // event: sha256
    var tx = this.utils.copy(this.tx.getNumOutcomes);
    tx.params = event;
    return augur.fire(tx, onSent);
};
augur.getCurrentVotePeriod = function (branch, onSent) {
    // branch: sha256
    var periodLength, blockNum;
    this.tx.getPeriodLength.params = branch;
    if (onSent) {
        augur.fire(this.tx.getPeriodLength, function (periodLength) {
            if (periodLength) {
                periodLength = abi.bignum(periodLength);
                rpc.blockNumber(function (blockNum) {
                    blockNum = abi.bignum(blockNum);
                    onSent(blockNum.dividedBy(periodLength).floor().sub(1));
                });
            }
        });
    } else {
        periodLength = augur.fire(this.tx.getPeriodLength);
        if (periodLength) {
            blockNum = abi.bignum(rpc.blockNumber());
            return blockNum.dividedBy(abi.bignum(periodLength)).floor().sub(1);
        }
    }
};

// expiringEvents.se
augur.getEvents = function (branch, votePeriod, onSent) {
    // branch: sha256 hash id
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getEvents);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getEventsRange = function (branch, vpStart, vpEnd, onSent) {
    // branch: sha256
    // vpStart: integer
    // vpEnd: integer
    var vp_range, txlist;
    vp_range = vpEnd - vpStart + 1; // inclusive
    txlist = new Array(vp_range);
    for (var i = 0; i < vp_range; ++i) {
        txlist[i] = {
            from: this.coinbase,
            to: this.contracts.expiringEvents,
            method: "getEvents",
            signature: "ii",
            returns: "hash[]",
            params: [branch, i + vpStart]
        };
    }
    return rpc.batch(txlist, onSent);
};
augur.getNumberEvents = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNumberEvents);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getEvent = function (branch, votePeriod, eventIndex, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getEvent);
    tx.params = [branch, votePeriod, eventIndex];
    return augur.fire(tx, onSent);
};
augur.getTotalRepReported = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getTotalRepReported);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getReporterBallot = function (branch, votePeriod, reporterID, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReporterBallot);
    tx.params = [branch, votePeriod, reporterID];
    return augur.fire(tx, onSent);
};
augur.getReport = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReports);
    tx.params = [branch, votePeriod, reporter];
    return augur.fire(tx, onSent);
};
augur.getReportHash = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportHash);
    tx.params = [branch, votePeriod, reporter];
    return augur.fire(tx, onSent);
};
augur.getVSize = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getVSize);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getReportsFilled = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportsFilled);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getReportsMask = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReportsMask);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getWeightedCenteredData = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getWeightedCenteredData);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getCovarianceMatrixRow = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getCovarianceMatrixRow);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getDeflated = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getDeflated);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getLoadingVector = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getLoadingVector);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getLatent = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getLatent);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getScores = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getScores);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getSetOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSetOne);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getSetTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSetTwo);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.returnOld = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.returnOld);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getNewOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNewOne);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getNewTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getNewTwo);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getAdjPrinComp = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getAdjPrinComp);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getSmoothRep = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getSmoothRep);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getOutcomesFinal = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getOutcomesFinal);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.getReporterPayouts = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getReporterPayouts);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};

augur.getTotalReputation = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.getTotalReputation);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};
augur.setTotalReputation = function (branch, votePeriod, totalReputation, onSent, onSuccess, onFailed) {
    // branch: sha256
    // votePeriod: integer
    // totalReputation: number -> fixed
    var tx = this.utils.copy(this.tx.setTotalReputation);
    tx.params = [branch, votePeriod, abi.fix(totalReputation, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.makeBallot = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = this.utils.copy(this.tx.makeBallot);
    tx.params = [branch, votePeriod];
    return augur.fire(tx, onSent);
};

// markets.se
augur.getSimulatedBuy = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = this.utils.copy(this.tx.getSimulatedBuy);
    if (market && market.constructor === BigNumber) {
        market = abi.prefix_hex(market.toString(16));
    }
    tx.params = [market, outcome, abi.fix(amount, "hex")];
    return augur.fire(tx, onSent);
};
augur.getSimulatedSell = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = this.utils.copy(this.tx.getSimulatedSell);
    tx.params = [market, outcome, abi.fix(amount, "hex")];
    return augur.fire(tx, onSent);
};
augur.lsLmsr = function (market, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.lsLmsr);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getMarketOutcomeInfo = function (market, outcome, onSent) {
    var self = this;
    var parse_info = function (info) {
        var i, len;
        if (info && info.length) {
            len = info.length;
            if (self.bignumbers) {
                info[0] = abi.unfix(info[0], "BigNumber");
                info[1] = abi.unfix(info[1], "BigNumber");
                info[2] = abi.unfix(info[2], "BigNumber");
                info[3] = abi.bignum(info[3]);
                info[4] = abi.bignum(info[4]);
                for (i = 5; i < len; ++i) {
                    info[i] = abi.bignum(info[i]);
                }
            } else {
                info[0] = abi.unfix(info[0], "string");
                info[1] = abi.unfix(info[1], "string");
                info[2] = abi.unfix(info[2], "string");
                info[3] = abi.bignum(info[3]).toFixed();
                info[4] = abi.bignum(info[4]).toFixed();
                for (i = 5; i < len; ++i) {
                    info[i] = abi.bignum(info[i]).toFixed();
                }
            }
        }
        return info;
    };
    var tx = this.utils.copy(this.tx.getMarketOutcomeInfo);
    tx.params = [market, outcome];
    if (onSent) {
        augur.fire(tx, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(augur.fire(tx));
    }
};
augur.getMarketInfo = function (market, onSent) {
    var self = this;
    var parse_info = function (info) {
        // info[0] = self.Markets[market].currentParticipant
        // info[1] = self.Markets[market].alpha
        // info[2] = self.Markets[market].addr2participant[tx.origin]
        // info[3] = self.Markets[market].numOutcomes
        // info[4] = self.Markets[market].tradingPeriod
        // info[5] = self.Markets[market].tradingFee
        // info[6+] = winningOutcomes
        var i, len;
        if (info && info.length) {
            len = info.length;
            if (self.bignumbers) {
                info[0] = abi.bignum(info[0]);
                info[1] = abi.unfix(info[1], "BigNumber");
                info[2] = abi.bignum(info[2]);
                info[3] = abi.bignum(info[3]);
                info[4] = abi.bignum(info[4]);
                info[5] = abi.unfix(info[5], "BigNumber");
                for (i = 6; i < len - 8; ++i) {
                    info[i] = abi.prefix_hex(abi.bignum(info[i]).toString(16));
                }
                for (i = len - 8; i < len; ++i) {
                    info[i] = abi.bignum(info[i]);
                }
            } else {
                info[0] = abi.bignum(info[0]).toFixed();
                info[1] = abi.unfix(info[1], "string");
                info[2] = abi.bignum(info[2]).toFixed();
                info[3] = abi.bignum(info[3]).toFixed();
                info[4] = abi.bignum(info[4]).toFixed();
                info[5] = abi.unfix(info[5], "string");
                for (i = len - 8; i < len; ++i) {
                    info[i] = abi.bignum(info[i]).toFixed();
                }
            }
        }
        return info;
    };
    var tx = this.utils.copy(this.tx.getMarketInfo);
    if (market && market.constructor === BigNumber) {
        market = market.toString(16);
    }
    tx.params = market;
    if (onSent) {
        augur.fire(tx, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(augur.fire(tx));
    }
};
augur.getMarketEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getMarketEvents);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getNumEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getNumEvents);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getBranchID = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getBranchID);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
// Get the current number of participants in this market
augur.getCurrentParticipantNumber = function (market, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getCurrentParticipantNumber);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getMarketNumOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getMarketNumOutcomes);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getParticipantSharesPurchased = function (market, participationNumber, outcome, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participationNumber, outcome];
    return augur.fire(tx, onSent);
};
augur.getSharesPurchased = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return augur.fire(tx, onSent);
};
augur.getWinningOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getWinningOutcomes);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.price = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.price);
    tx.params = [market, outcome];
    return augur.fire(tx, onSent);
};
// Get the participant number (the array index) for specified address
augur.getParticipantNumber = function (market, address, onSent) {
    // market: sha256
    // address: ethereum account
    var tx = this.utils.copy(this.tx.getParticipantNumber);
    tx.params = [market, address];
    return augur.fire(tx, onSent);
};
// Get the address for the specified participant number (array index) 
augur.getParticipantID = function (market, participantNumber, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getParticipantID);
    tx.params = [market, participantNumber];
    return augur.fire(tx, onSent);
};
augur.getAlpha = function (market, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getAlpha);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getCumScale = function (market, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getCumScale);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getTradingPeriod = function (market, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getTradingPeriod);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.getTradingFee = function (market, onSent) {
    // market: sha256
    var tx = this.utils.copy(this.tx.getTradingFee);
    tx.params = market;
    return augur.fire(tx, onSent);
};
augur.initialLiquiditySetup = function (marketID, alpha, cumulativeScale, numOutcomes, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.initialLiquiditySetup);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initialLiquiditySetup), arguments);
    tx.params = unpacked.params;
    tx.params[1] = abi.fix(tx.params[1], "hex");
    tx.params[2] = abi.fix(tx.params[2], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
augur.modifyShares = function (marketID, outcome, amount, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.modifyShares);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.modifyShares), arguments);
    tx.params = unpacked.params;
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};
augur.initializeMarket = function (marketID, events, tradingPeriod, tradingFee, branch, onSent, onSuccess, onFailed) {
    var tx = this.utils.copy(this.tx.initializeMarket);
    var unpacked = this.utils.unpack(marketID, this.utils.labels(this.initializeMarket), arguments);
    tx.params = unpacked.params;
    tx.params[3] = abi.fix(tx.params[3], "hex");
    return this.transact.apply(this, [tx].concat(unpacked.cb));
};

// reporting.se
augur.getRepBalance = function (branch, account, onSent) {
    // branch: sha256 hash id
    // account: ethereum address (hexstring)
    var tx = this.utils.copy(this.tx.getRepBalance);
    tx.params = [branch, account || this.coinbase];
    return augur.fire(tx, onSent);
};
augur.getRepByIndex = function (branch, repIndex, onSent) {
    // branch: sha256
    // repIndex: integer
    var tx = this.utils.copy(this.tx.getRepByIndex);
    tx.params = [branch, repIndex];
    return augur.fire(tx, onSent);
};
augur.getReporterID = function (branch, index, onSent) {
    // branch: sha256
    // index: integer
    var tx = this.utils.copy(this.tx.getReporterID);
    tx.params = [branch, index];
    return augur.fire(tx, onSent);
};
// reputation of a single address over all branches
augur.getReputation = function (address, onSent) {
    // address: ethereum account
    var tx = this.utils.copy(this.tx.getReputation);
    tx.params = address;
    return augur.fire(tx, onSent);
};
augur.getNumberReporters = function (branch, onSent) {
    // branch: sha256
    var tx = this.utils.copy(this.tx.getNumberReporters);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.repIDToIndex = function (branch, repID, onSent) {
    // branch: sha256
    // repID: ethereum account
    var tx = this.utils.copy(this.tx.repIDToIndex);
    tx.params = [branch, repID];
    return augur.fire(tx, onSent);
};
augur.getTotalRep = function (branch, onSent) {
    var tx = this.utils.copy(this.tx.getTotalRep);
    tx.params = branch;
    return augur.fire(tx, onSent);
};
augur.hashReport = function (ballot, salt, onSent) {
    // ballot: number[]
    // salt: integer
    if (ballot.constructor === Array) {
        var tx = this.utils.copy(this.tx.hashReport);
        tx.params = [abi.fix(ballot, "hex"), salt];
        return augur.fire(tx, onSent);
    }
};

// checkQuorum.se
augur.checkQuorum = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    if (rpc.coinbase() !== this.demo) {
        var tx = this.utils.copy(this.tx.checkQuorum);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};

// buy&sellShares.se
augur.getNonce = function (id, onSent) {
    // id: sha256 hash id
    var tx = this.utils.copy(this.tx.getNonce);
    tx.params = id;
    return augur.fire(tx, onSent);
};
augur.buyShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
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
augur.sellShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
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
augur.createSubbranch = function (description, periodLength, parent, tradingFee, onSent, onSuccess, onFailed) {
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
augur.sendReputation = function (branch, to, value, onSent, onSuccess, onFailed) {
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
augur.report = function (branch, report, votePeriod, salt, onSent, onSuccess, onFailed) {
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
augur.submitReportHash = function (branch, reportHash, votePeriod, onSent, onSuccess, onFailed) {
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
augur.checkReportValidity = function (branch, report, votePeriod, onSent, onSuccess, onFailed) {
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
augur.slashRep = function (branch, votePeriod, salt, report, reporter, onSent, onSuccess, onFailed) {
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
augur.createEvent = function (branch, description, expDate, minValue, maxValue, numOutcomes, onSent, onSuccess, onFailed) {
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
augur.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, onSent, onSuccess, onFailed) {
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
augur.closeMarket = function (branch, market, onSent, onSuccess, onFailed) {
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
augur.dispatch = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256 or transaction object
    if (rpc.coinbase() !== this.demo) {
        if (branch.constructor === Object && branch.branchId) {
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branchId;
        }
        var tx = this.utils.copy(this.tx.dispatch);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};

augur.checkPeriod = function (branch) {
    var period = Number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(rpc.blockNumber() / Number(this.getPeriodLength(branch)));
    var periodsBehind = (currentPeriod - 1) - period;
    return periodsBehind;
};

// filters

augur.getCreationBlock = function (market, cb) {
    if (market) {
        var filter = {
            fromBlock: "0x1",
            toBlock: rpc.blockNumber(),
            topics: ["creationBlock"]
        };
        if (this.utils.is_function(cb)) {
            this.filters.eth_getLogs(filter, function (logs) {
                if (logs) cb(logs);
            });
        } else {
            return this.filters.eth_getFilterLogs(filter);
        }
    }
};

augur.getMarketPriceHistory = function (market, outcome, cb) {
    if (market && outcome) {
        var filter = {
            fromBlock: "0x1",
            toBlock: "latest",
            address: this.contracts.buyAndSellShares,
            topics: ["updatePrice"]
        };
        if (this.utils.is_function(cb)) {
            var self = this;
            this.filters.eth_getLogs(filter, function (logs) {
                if (logs) {
                    if (logs.error) return console.error("eth_getLogs:", logs);
                    var price_logs = self.filters.search_price_logs(logs, market, outcome);
                    if (price_logs) {
                        if (price_logs.error) {
                            return console.error("search_price_logs:", price_logs);
                        }
                        cb(price_logs);
                    }
                }
            });
        } else {
            var logs = this.filters.eth_getLogs(filter);
            if (logs) {
                if (logs.error) throw logs;
                var price_logs = self.filters.search_price_logs(logs, market, outcome);
                if (price_logs) {
                    if (price_logs.error) throw price_logs;
                    return price_logs;
                }
            }
        }
    }
};

module.exports = augur;
