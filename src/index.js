/**
 * augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var contracts = require("augur-contracts");
var Tx = require("./tx");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

var options = { debug: { broadcast: false, fallback: false } };

function Augur() {
    this.options = options;
    this.connection = null;

    this.utils = require("./utilities");
    this.constants = require("./constants");
    this.errors = require("./errors");
    this.numeric = abi;

    rpc.debug = this.options.debug;
    this.rpc = rpc;

    // Network ID
    this.network_id = "7";
    this.tx = new Tx(this.network_id);
    this.contracts = this.utils.copy(contracts[this.network_id]);
    this.init_contracts = this.utils.copy(contracts[this.network_id]);

    // Branch IDs
    this.branches = {
        demo: "0xf69b5",
        alpha: "0xf69b5",
        dev: "0xf69b5"
    };

    // Demo/shared account
    this.demo = "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec";

    // Load submodules
    this.web = this.Accounts();
    this.comments = this.Comments();
    this.filters = this.Filters();
    this.namereg = this.Namereg();
    this.db = this.Database();
}

/************************
 * Dependent submodules *
 ************************/

Augur.prototype.Accounts = require("./client/accounts");
Augur.prototype.Comments = require("./client/comments");
Augur.prototype.Database = require("./client/db");
Augur.prototype.Filters = require("./filters");
Augur.prototype.Namereg = require("./aux/namereg");

/*******************************
 * Ethereum network connection *
 *******************************/

Augur.prototype.default_rpc = function () {
    rpc.reset();
    return false;
};

Augur.prototype.detect_network = function (callback) {
    var self = this;
    if (this.connection === null &&
        JSON.stringify(this.init_contracts) === JSON.stringify(this.contracts))
    {
        if (this.utils.is_function(callback)) {
            rpc.version(function (version) {
                var key;
                if (version !== null && version !== undefined && !version.error) {
                    self.network_id = version;
                    self.tx = new Tx(version);
                    self.contracts = self.utils.copy(contracts[self.network_id]);
                    for (var method in self.tx) {
                        if (!self.tx.hasOwnProperty(method)) continue;
                        key = self.utils.has_value(self.init_contracts, self.tx[method].to);
                        if (key) self.tx[method].to = self.contracts[key];
                    }
                }
                if (callback) callback(null, version);
            });
        } else {
            var key, method;
            this.network_id = rpc.version() || "7";
            this.tx = new Tx(this.network_id);
            this.contracts = this.utils.copy(contracts[this.network_id]);
            for (method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                key = this.utils.has_value(this.init_contracts, this.tx[method].to);
                if (key) this.tx[method].to = this.contracts[key];
            }
            return this.network_id;
        }
    } else {
        if (callback) callback();
    }
};

Augur.prototype.from_field_tx = function (account) {
    if (account && account !== "0x") {
        for (var method in this.tx) {
            if (!this.tx.hasOwnProperty(method)) continue;
            this.tx[method].from = account;
        }
    }
};

Augur.prototype.get_coinbase = function (callback) {
    var self = this;
    if (this.utils.is_function(callback)) {
        rpc.coinbase(function (coinbase) {
            if (coinbase && !coinbase.error) {
                self.coinbase = coinbase;
                self.from_field_tx(coinbase);
                if (callback) return callback(null, coinbase);
            }
            if (!self.coinbase && (rpc.nodes.local || rpc.ipcpath)) {
                rpc.accounts(function (accounts) {
                    if (accounts && accounts.constructor === Array && accounts.length) {
                        async.eachSeries(accounts, function (account, nextAccount) {
                            if (self.unlocked(account)) {
                                return nextAccount(account);
                            }
                            nextAccount();
                        }, function (account) {
                            if (account) {
                                self.coinbase = account;
                                self.from_field_tx(account);
                                if (callback) callback(null, account);
                            }
                        });
                    }
                });
            }
        });
    } else {
        var accounts, num_accounts, i, method;
        this.coinbase = rpc.coinbase();
        if (!this.coinbase && rpc.nodes.local) {
            accounts = rpc.accounts();
            if (accounts && accounts.constructor === Array) {
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
        }
        if (this.coinbase && this.coinbase !== "0x") {
            for (method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                this.tx[method].from = this.coinbase;
            }
        } else {
            return this.default_rpc();
        }
    }
};

Augur.prototype.update_contracts = function () {
    var key, method;
    if (JSON.stringify(this.init_contracts) !== JSON.stringify(this.contracts)) {
        for (method in this.tx) {
            if (!this.tx.hasOwnProperty(method)) continue;
            key = this.utils.has_value(this.init_contracts, this.tx[method].to);
            if (key) {
                this.tx[method].to = this.contracts[key];
            }
        }
    }
    this.init_contracts = this.utils.copy(this.contracts);
};

Augur.prototype.parse_rpcinfo = function (rpcinfo) {
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

Augur.prototype.connect = function (rpcinfo, ipcpath, callback) {
    var localnode, self = this;
    rpc.reset();
    if (rpcinfo) {
        localnode = this.parse_rpcinfo(rpcinfo);
        if (localnode) {
            rpc.nodes.local = localnode;
            rpc.balancer = false;
        } else {
            rpc.nodes.local = null;
            rpc.balancer = true;
        }
    } else {
        rpc.nodes.local = null;
        rpc.balancer = true;
    }
    if (ipcpath) {
        rpc.balancer = false;
        rpc.ipcpath = ipcpath;
        if (rpcinfo) {
            localnode = this.parse_rpcinfo(rpcinfo);
            if (localnode) rpc.nodes.local = localnode;
        } else {
            rpc.nodes.local = "http://127.0.0.1:8545";
        }
    } else {
        rpc.ipcpath = null;
    }
    if (this.utils.is_function(callback)) {
        async.series([
            this.detect_network.bind(this),
            this.get_coinbase.bind(this)
        ], function (err) {
            if (err) console.error("augur.connect error:", err);
            self.update_contracts();
            self.connection = true;
            if (callback) callback();
        });
    } else {
        try {
            this.detect_network();
            this.get_coinbase();
            this.update_contracts();
            this.connection = true;
            return true;
        } catch (exc) {
            if (this.options.debug.broadcast) console.error(exc);
            this.default_rpc();
            return false;
        }
    }
};

Augur.prototype.connected = function (f) {
    if (this.utils.is_function(f)) {
        return rpc.coinbase(function (coinbase) {
            f(coinbase && !coinbase.error);
        });
    }
    try {
        rpc.coinbase();
        return true;
    } catch (e) {
        return false;
    }
};

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
 * augur API *
 *************/

// faucets.se
Augur.prototype.cashFaucet = function (onSent, onSuccess, onFailed) {
    if (onSent && onSent.constructor === Object) {
        if (onSent.onSuccess) onSuccess = onSent.onSuccess;
        if (onSent.onFailed) onFailed = onSent.onFailed;
        if (onSent.onSent) onSent = onSent.onSent;
    }
    return this.transact(this.tx.cashFaucet, onSent, onSuccess, onFailed);
};
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
Augur.prototype.getMarketOutcomeInfo = function (market, outcome, callback) {
    var self = this;
    var parse_info = function (info) {
        var i, len;
        if (info && info.length) {
            len = info.length;
            info[0] = abi.unfix(info[0], "string");
            info[1] = abi.unfix(info[1], "string");
            info[2] = abi.unfix(info[2], "string");
            info[3] = abi.bignum(info[3]).toFixed();
            info[4] = abi.bignum(info[4]).toFixed();
            for (i = 5; i < len; ++i) {
                info[i] = abi.bignum(info[i]).toFixed();
            }
        }
        return info;
    };
    var tx = this.utils.copy(this.tx.getMarketOutcomeInfo);
    tx.params = [market, outcome];
    if (callback) {
        this.fire(tx, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
Augur.prototype.getFullMarketInfo = function (market, callback) {
    var self = this;
    var parse_info = function (rawInfo) {
        var TRADER_FIELDS = 3;
        var EVENTS_FIELDS = 6;
        var OUTCOMES_FIELDS =12;
        var WINNING_OUTCOMES_FIELDS = 8;
        var info;
        if (rawInfo && rawInfo.length) {

            // all-inclusive except comments & price history
            // info[0] = traderCount (self.Markets[market].currentParticipant)
            // info[1] = self.Markets[market].alpha
            // info[2] = self.Markets[market].addr2participant[tx.origin]
            // info[3] = self.Markets[market].numOutcomes
            // info[4] = self.Markets[market].tradingPeriod
            // info[5] = self.Markets[market].tradingFee
            // info[6] = self.Markets[market].branch
            // info[7] = numEvents (self.Markets[market].lenEvents)
            // info[8] = self.Markets[market].cumulativeScale
            // info[9] = INFO.getCreationFee(market)
            // info[10] = INFO.getCreator(market)
            var index = 11;
            info = {
                _id: market,
                network: self.network_id || rpc.version(),
                traderCount: abi.number(rawInfo[0]),
                alpha: abi.unfix(rawInfo[1], "string"),
                traderIndex: abi.unfix(rawInfo[2], "number"),
                numOutcomes: abi.number(rawInfo[3]),
                tradingPeriod: abi.number(rawInfo[4]),
                tradingFee: abi.unfix(rawInfo[5], "string"),
                branchId: rawInfo[6],
                numEvents: abi.number(rawInfo[7]),
                cumulativeScale: abi.string(rawInfo[8]),
                creationFee: abi.unfix(rawInfo[9], "string"),
                author: abi.format_address(rawInfo[10]),
                invalid: null,
                endDate: null,
                participants: {}
            };
            info.outcomes = new Array(info.numOutcomes);
            info.events = new Array(info.numEvents);

            // organize trader info
            var addr;
            for (var i = 0; i < info.traderCount; ++i) {
                addr = abi.format_address(rawInfo[i + index]);
                info.participants[addr] = i;
            }

            // organize event info
            // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
            index += info.traderCount*TRADER_FIELDS;
            for (i = 0; i < info.numEvents; ++i) {
                var endDate = abi.number(rawInfo[i + index + 1]);
                info.events[i] = {
                    id: rawInfo[i + index],
                    endDate: endDate,
                    outcome: abi.string(rawInfo[i + index + 2]),
                    minValue: abi.string(rawInfo[i + index + 3]),
                    maxValue: abi.string(rawInfo[i + index + 4]),
                    numOutcomes: abi.number(rawInfo[i + index + 5])
                };
                if (info.endDate === null || endDate < info.endDate) {
                    info.endDate = endDate;
                }
            }

            // organize outcome info
            index += info.numEvents*EVENTS_FIELDS;
            for (i = 0; i < info.numOutcomes; ++i) {
                info.outcomes[i] = {
                    id: i + 1,
                    outstandingShares: abi.unfix(rawInfo[i + index], "string"),
                    price: abi.unfix(rawInfo[i + index + 1], "string"),
                    shares: {}
                };
                for (var j = 0; j < info.traderCount; ++j) {
                    addr = abi.format_address(rawInfo[j + 11]);
                    info.outcomes[i].shares[addr] = abi.unfix(rawInfo[j + 12], "string");
                }
            }
        }
        return info;
    };
    var tx = this.utils.copy(this.tx.getFullMarketInfo);
    if (market && market.constructor === BigNumber) {
        market = market.toString(16);
    }
    tx.params = market;
    if (this.utils.is_function(callback)) {
        this.fire(tx, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
Augur.prototype.getMarketInfo = function (market, callback) {
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
        return info;
    };
    var tx = this.utils.copy(this.tx.getMarketInfo);
    if (market && market.constructor === BigNumber) {
        market = market.toString(16);
    }
    tx.params = market;
    if (this.utils.is_function(callback)) {
        this.fire(tx, function (info) {
            callback(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
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
Augur.prototype.getBranchID = function (branch, callback) {
    // branch: sha256 hash id
    var tx = this.utils.copy(this.tx.getBranchID);
    tx.params = branch;
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
Augur.prototype.getParticipantSharesPurchased = function (market, participationNumber, outcome, callback) {
    // market: sha256 hash id
    var tx = this.utils.copy(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participationNumber, outcome];
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
    var period = Number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(rpc.blockNumber() / Number(this.getPeriodLength(branch)));
    var periodsBehind = (currentPeriod - 1) - period;
    return periodsBehind;
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

Augur.prototype.getMarketPriceHistory = function (market, outcome, cb) {
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
