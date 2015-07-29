/**
 * JavaScript bindings for the Augur API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var crypto;
if (NODE_JS) {
    crypto = require("crypto");
} else {
    crypto = require("crypto-browserify");
}
var BigNumber = require("bignumber.js");

var constants = require("./constants");
var errors = require("./errors");
var numeric = require("./numeric");
var contracts = require("./contracts");
var utilities = require("./utilities");
var RPC = require("./rpc");
var WebClient = require("./web");
var Comments = require("./comments");
var Filters = require("./filters");
var Tx = require("./tx");
var Namereg = require("./namereg");

var log = console.log;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

var DEFAULT_RPC = utilities.urlstring({
    // protocol: (NODE_JS) ? "http" : window.location.protocol.slice(0, -1),
    protocol: "http",
    host: "127.0.0.1",
    port: 8545
});

var options = {

    // primary Ethereum RPC connection info
    RPC: DEFAULT_RPC,

    // multicast RPC nodes
    nodes: [],

    // If set to true, all numerical results (excluding hashes)
    // are returned as BigNumber objects
    BigNumberOnly: true

};

var augur = {

    connection: null,

    options: {},

    abi: require("./abi"),
    utilities: utilities,
    numeric: numeric,

    rpc: {},
    web: {},
    comments: {},
    filters: {},
    namereg: {},

    contracts: utilities.copy(contracts.testnet),
    init_contracts: utilities.copy(contracts.testnet),

    // transact notifications
    notifications: {},

    // Network ID
    network_id: "0",

    // Branch IDs
    branches: {
        demo: '0xf69b5',
        alpha: '0xf69b5',
        dev: '0xf69b5'
    },

    // Demo account (demo.augur.net)
    demo: "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec"

};

augur.reload_modules = function (options) {
    if (options) this.options = options;
    this.rpc = new RPC(this.options);
    if (this.contracts) this.tx = new Tx(this.contracts);
    this.web = new WebClient(this);
    this.comments = new Comments(this);
    this.filters = new Filters(this);
    this.namereg = new Namereg(this);
};

augur.reload_modules(options);

/******************************
 * Ethereum JSON-RPC bindings *
 ******************************/

augur.raw = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params, "null"), f);
};

augur.eth = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params), f);
};

augur.net = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params, "net_"), f);
};

augur.web3 = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params, "web3_"), f);
};

augur.db = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params, "db_"), f);
};

augur.shh = function (command, params, f) {
    return this.rpc.json_rpc(this.rpc.postdata(command, params, "shh_"), f);
};

augur.hash = augur.sha3 = function (data, f) {
    return this.rpc.json_rpc(this.rpc.postdata("sha3", data.toString(), "web3_"), f);
};

augur.gasPrice = function (f) {
    return this.rpc.json_rpc(this.rpc.postdata("gasPrice"), f);
};

augur.blockNumber = function (f) {
    if (f) {
        this.rpc.json_rpc(this.rpc.postdata("blockNumber"), f);
    } else {
        return parseInt(this.rpc.json_rpc(this.rpc.postdata("blockNumber")));
    }
};

augur.getBalance = augur.balance = function (address, block, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getBalance", [address || this.coinbase, block || "latest"]), f);
};

augur.getTransactionCount = augur.txCount = function (address, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getTransactionCount", address || this.coinbase), f);
};

augur.sendEther = augur.pay = function (to, value, from, onSent, onSuccess, onFailed) {
    from = from || this.rpc.json_rpc(this.rpc.postdata("coinbase"));
    if (from !== this.demo) {
        var tx, txhash;
        if (to && to.value) {
            value = to.value;
            if (to.from) from = to.from || this.coinbase;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        tx = {
            from: from,
            to: to,
            value: numeric.bignum(value).mul(constants.ETHER).toFixed()
        };
        if (onSent) {
            this.sendTx(tx, function (txhash) {
                if (txhash) {
                    onSent(txhash);
                    if (onSuccess) this.tx_notify(0, value, tx, txhash, null, onSent, onSuccess, onFailed);
                }
            }.bind(this));
        } else {
            txhash = this.sendTx(tx);
            if (txhash) {
                if (onSuccess) this.tx_notify(0, value, tx, txhash, null, onSent, onSuccess, onFailed);
                return txhash;
            }
        }
    }
};

augur.sign = function (address, data, f) {
    return this.rpc.json_rpc(this.rpc.postdata("sign", [address, data]), f);
};

augur.getTransaction = augur.getTx = function (hash, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getTransactionByHash", hash), f);
};

augur.peerCount = function (f) {
    if (f) {
        this.rpc.json_rpc(this.rpc.postdata("peerCount", [], "net_"), f);
    } else {
        return parseInt(this.rpc.json_rpc(this.rpc.postdata("peerCount", [], "net_")));
    }
};

augur.accounts = function (f) {
    return this.rpc.json_rpc(this.rpc.postdata("accounts"), f);
};

augur.mining = function (f) {
    return this.rpc.json_rpc(this.rpc.postdata("mining"), f);
};

augur.hashrate = function (f) {
    if (f) {
        this.rpc.json_rpc(this.rpc.postdata("hashrate"), f);
    } else {
        return parseInt(this.rpc.json_rpc(this.rpc.postdata("hashrate")));
    }
};

augur.getBlockByHash = function (hash, full, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getBlockByHash", [hash, full || false]), f);
};

augur.getBlockByNumber = function (number, full, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getBlockByNumber", [number, full || false]), f);
};

augur.netVersion = augur.version = function (f) {
    return this.rpc.json_rpc(this.rpc.postdata("version", [], "net_"), f);
};

// estimate a transaction's gas cost
augur.estimateGas = function (tx, f) {
    tx.to = tx.to || "";
    return this.rpc.json_rpc(this.rpc.postdata("estimateGas", tx), f);
};

// execute functions on contracts on the blockchain
augur.call = function (tx, f) {
    tx.to = tx.to || "";
    tx.gas = (tx.gas) ? numeric.prefix_hex(tx.gas.toString(16)) : constants.DEFAULT_GAS;
    return this.rpc.json_rpc(this.rpc.postdata("call", tx), f);
};

augur.sendTransaction = augur.sendTx = function (tx, f) {
    tx.to = tx.to || "";
    tx.gas = (tx.gas) ? numeric.prefix_hex(tx.gas.toString(16)) : constants.DEFAULT_GAS;
    return this.rpc.json_rpc(this.rpc.postdata("sendTransaction", tx), f);
};

// IN: RLP(tx.signed(privateKey))
// OUT: txhash
augur.sendRawTransaction = augur.sendRawTx = function (rawTx, f) {
    return this.rpc.json_rpc(this.rpc.postdata("sendRawTransaction", rawTx), f);
};

augur.getTransactionReceipt = augur.receipt = function (txhash, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getTransactionReceipt", txhash), f);
};

// publish a new contract to the blockchain (from the coinbase account)
augur.publish = function (compiled, f) {
    return this.sendTx({ from: this.coinbase, data: compiled }, f);
};

// Read the code in a contract on the blockchain
augur.getCode = augur.read = function (address, block, f) {
    return this.rpc.json_rpc(this.rpc.postdata("getCode", [address, block || "latest"]), f);
};

/*******************************
 * Ethereum network connection *
 *******************************/

augur.listening = function () {
    try {
        return this.net("listening");
    } catch (e) {
        return false;
    }
};

augur.connect = function (rpcinfo, chain) {

    var default_rpc = function () {
        this.options.RPC = DEFAULT_RPC;
        this.reload_modules();
        return false;
    }.bind(this);

    var rpc, key, method, rpc_obj = {};
    if (rpcinfo) {
        if (rpcinfo.constructor === Object) {
            if (rpcinfo.protocol) rpc_obj.protocol = rpcinfo.protocol;
            if (rpcinfo.host) rpc_obj.host = rpcinfo.host;
            if (rpcinfo.port) {
                rpc_obj.port = rpcinfo.port;
            } else {
                if (rpcinfo.host) {
                    rpc = rpcinfo.host.split(":");
                    if (rpc.length === 2) {
                        rpc_obj.host = rpc[0];
                        rpc_obj.port = rpc[1];
                    }
                }
            }
            if (rpcinfo.chain) chain = rpcinfo.chain;
        } else if (rpcinfo.constructor === String) {
            try {
                rpc = rpcinfo.split("://");
                console.assert(rpc.length === 2);
                rpc_obj.protocol = rpc[0];
                rpc = rpc[1].split(':');
                if (rpc.length === 2) {
                    rpc_obj.host = rpc[0];
                    rpc_obj.port = rpc[1];
                } else {
                    rpc_obj.host = rpc;
                }
            } catch (e) {
                try {
                    rpc = rpcinfo.split(':');
                    if (rpc.length === 2) {
                        rpc_obj.host = rpc[0];
                        rpc_obj.port = rpc[1];
                    } else {
                        rpc_obj.host = rpc;
                    }
                } catch (exc) {
                    return default_rpc();
                }
            }
        }
        this.options.RPC = utilities.urlstring(rpc_obj);
    } else {
        this.options.RPC = DEFAULT_RPC;
    }
    this.reload_modules();
    // if (!this.listening()) {
       // TODO if no local ethereum node, default to web client
    // }
    try {
        if (this.connection === null &&
            JSON.stringify(this.init_contracts) === JSON.stringify(this.contracts)) {
            this.network_id = chain || this.version() || "0";
            switch (this.network_id.toString()) {
                case "1010101":
                    this.contracts = utilities.copy(contracts.privatechain);
                    break;
                case "10101":
                    this.contracts = utilities.copy(contracts.testchain);
                    break;
                default:
                    this.contracts = utilities.copy(contracts.testnet);
            }
            for (method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                key = utilities.has_value(this.init_contracts, this.tx[method].to);
                if (key) {
                    this.tx[method].to = this.contracts[key];
                }
            }
            this.reload_modules();
        }
        this.coinbase = this.rpc.json_rpc(this.rpc.postdata("coinbase"));
        if (!this.coinbase) {
            var accounts = this.accounts();
            var num_accounts = accounts.length;
            if (num_accounts === 1) {
                this.coinbase = accounts[0];
            } else {
                for (var i = 0; i < num_accounts; ++i) {
                    if (!this.sign(accounts[i], "1010101").error) {
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
            return default_rpc();
        }
        if (JSON.stringify(this.init_contracts) !== JSON.stringify(this.contracts)) {
            for (method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                key = utilities.has_value(this.init_contracts, this.tx[method].to);
                if (key) {
                    this.tx[method].to = this.contracts[key];
                }
            }
            this.reload_modules();
        }
        this.init_contracts = utilities.copy(this.contracts);
        this.connection = true;
        return true;
    } catch (e) {
        return default_rpc();
    }
};

augur.connected = function () {
    try {
        this.rpc.json_rpc(this.rpc.postdata("coinbase"));
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Invoke a function from a contract on the blockchain.
 *
 * Input tx format:
 * {
 *    from: <sender's address> (hexstring; optional, coinbase default)
 *    to: <contract address> (hexstring)
 *    method: <function name> (string)
 *    signature: <function signature, e.g. "iia"> (string)
 *    params: <parameters passed to the function> (optional)
 *    returns: <"number[]", "int", "BigNumber", or "string" (default)>
 *    send: <true to sendTransaction, false to call (default)>
 * }
 */
augur.invoke = function (itx, f) {
    var tx, data_abi, packaged, invocation, invoked;
    if (itx) {
        if (itx.send && this.web && this.web.account.address) {
            return this.web.invoke(itx, f);
        } else {
            tx = utilities.copy(itx);
            if (tx.params !== undefined) {
                if (tx.params.constructor === Array) {
                    for (var i = 0, len = tx.params.length; i < len; ++i) {
                        if (tx.params[i] !== undefined &&
                            tx.params[i].constructor === BigNumber) {
                            tx.params[i] = tx.params[i].toFixed();
                        }
                    }
                } else if (tx.params.constructor === BigNumber) {
                    tx.params = tx.params.toFixed();
                }
            }
            if (tx.to) tx.to = numeric.prefix_hex(tx.to);
            if (tx.from) tx.from = numeric.prefix_hex(tx.from);
            data_abi = this.abi.encode(tx);
            if (data_abi) {
                packaged = {
                    from: tx.from || this.coinbase,
                    to: tx.to,
                    data: data_abi
                };
                if (tx.returns) packaged.returns = tx.returns;
                invocation = (tx.send) ? this.sendTx : this.call;
                invoked = true;
                return invocation.call(this, packaged, f);
            }
        }
    }
    if (!invoked) {
        if (f) {
            f(errors.TRANSACTION_FAILED);
        } else {
            return errors.TRANSACTION_FAILED;
        }
    }
};

/************************
 * Batched RPC commands *
 ************************/

augur.batch = function (txlist, f) {
    var num_commands, rpclist, callbacks, tx, data_abi, packaged, invocation;
    if (txlist.constructor === Array) {
        num_commands = txlist.length;
        rpclist = new Array(num_commands);
        callbacks = new Array(num_commands);
        for (var i = 0; i < num_commands; ++i) {
            tx = utilities.copy(txlist[i]);
            if (tx.params !== undefined) {
                if (tx.params.constructor === Array) {
                    for (var j = 0, len = tx.params.length; j < len; ++j) {
                        if (tx.params[j].constructor === BigNumber) {
                            tx.params[j] = tx.params[j].toFixed();
                        }
                    }
                } else if (tx.params.constructor === BigNumber) {
                    tx.params = tx.params.toFixed();
                }
            }
            if (tx.from) tx.from = numeric.prefix_hex(tx.from);
            tx.to = numeric.prefix_hex(tx.to);
            data_abi = this.abi.encode(tx);
            if (data_abi) {
                if (tx.callback && tx.callback.constructor === Function) {
                    callbacks[i] = tx.callback;
                    delete tx.callback;
                }
                packaged = {
                    from: tx.from || this.coinbase,
                    to: tx.to,
                    data: data_abi
                };
                if (tx.returns) packaged.returns = tx.returns;
                invocation = (tx.send) ? "sendTransaction" : "call";
                rpclist[i] = this.rpc.postdata(invocation, packaged);
            } else {
                log("unable to package commands for batch RPC");
                return rpclist;
            }
        }
        if (f) {
            if (f.constructor === Function) { // callback on whole array
                this.rpc.json_rpc(rpclist, f);
            } else if (f === true) {
                this.rpc.json_rpc(rpclist, function (res) {
                    if (res) {
                        if (res.constructor === Array && res.length) {
                            for (j = 0; j < num_commands; ++j) {
                                if (res[j] && callbacks[j]) {
                                    callbacks[j](res[j]);
                                }
                            }
                        } else {
                            if (callbacks.length && callbacks[0]) {
                                callbacks[0](res);
                            }
                        }
                    }
                });
            }
        } else {
            return this.rpc.json_rpc(rpclist, f);
        }
    } else {
        log("expected array for batch RPC, invoking instead");
        return this.invoke(txlist, f);
    }
};

/**
 * User-friendly batch interface:
 *
 * var b = Augur.createBatch();
 * b.add("getCashBalance", [Augur.coinbase], callback);
 * b.add("getRepBalance", [Augur.branches.dev, Augur.coinbase], callback);
 * b.execute();
 */
var Batch = function () {
    this.txlist = [];
};

Batch.prototype.add = function (method, params, callback) {
    if (method) {
        var tx = utilities.copy(augur.tx[method]);
        if (params && params.length !== 0) {
            tx.params = params;
        }
        if (callback) tx.callback = callback;
        this.txlist.push(tx);
    }
};

Batch.prototype.execute = function () {
    augur.batch(this.txlist, true);
};

augur.createBatch = function createBatch () {
    return new Batch();
};

augur.clear_notifications = function (id) {
    for (var i = 0, len = this.notifications.length; i < len; ++i) {
        clearTimeout(this.notifications[id][i]);
        this.notifications[id] = [];
    }
};

augur.encode_result = function (result, returns) {
    if (result) {
        if (returns === "null") {
            result = null;
        } else if (returns === "address" || returns === "address[]") {
            result = numeric.prefix_hex(numeric.remove_leading_zeros(result));
        } else {
            if (this.options.BigNumberOnly && returns !== "string") {
                result = numeric.bignum(result);
            }
            if (!this.options.BigNumberOnly) {
                if (!returns || returns === "hash[]" || returns === "hash") {
                    result = numeric.bignum(result, "hex");
                } else if (returns === "number") {
                    result = numeric.bignum(result, "string");
                }
            }
        }
    }
    return result;
};

augur.error_codes = function (tx, response) {
    if (response && response.constructor === Array) {
        for (var i = 0, len = response.length; i < len; ++i) {
            response[i] = this.error_codes(tx.method, response[i]);
        }
    } else {
        if (errors[response]) {
            response = {
                error: response,
                message: errors[response]
            };
        } else {
            if (tx.returns && tx.returns !== "string" ||
                (response && response.constructor === String &&
                response.slice(0,2) === "0x"))
            {
                var response_number = numeric.bignum(response);
                if (response_number) {
                    response_number = numeric.bignum(response).toFixed();
                    if (errors[tx.method] && errors[tx.method][response_number]) {
                        response = {
                            error: response_number,
                            message: errors[tx.method][response_number]
                        };
                    }
                }
            }
        }
    }
    return response;
};

augur.fire = function (itx, callback) {
    var tx = utilities.copy(itx);
    if (callback) {
        this.invoke(tx, function (res) {
            callback(this.encode_result(
                this.error_codes(tx, res),
                itx.returns
            ));
        }.bind(this));
    } else {
        return this.encode_result(
            this.error_codes(tx, this.invoke(tx)),
            itx.returns
        );
    }
};

/***************************************
 * Call-send-confirm callback sequence *
 ***************************************/

augur.check_blockhash =  function (tx, callreturn, itx, txhash, returns, count, onSent, onSuccess, onFailed) {
    if (tx && tx.blockHash && numeric.bignum(tx.blockHash).toNumber() !== 0) {
        this.clear_notifications(txhash);
        tx.callReturn = this.encode_result(callreturn, returns);
        tx.txHash = tx.hash;
        delete tx.hash;
        if (onSuccess) onSuccess(tx);
    } else {
        if (count !== undefined && count < constants.TX_POLL_MAX) {
            if (count === 0) {
                this.notifications[txhash] = [setTimeout(function () {
                    this.tx_notify(count + 1, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed);
                }.bind(this), constants.TX_POLL_INTERVAL)];
            } else {
                this.notifications[txhash].push(setTimeout(function () {
                    this.tx_notify(count + 1, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed);
                }.bind(this), constants.TX_POLL_INTERVAL));
            }
        }
    }
};

augur.tx_notify =  function (count, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed) {
    this.getTx(txhash, function (tx) {
        if (tx === null) {
            if (returns) itx.returns = returns;
        } else {
            this.check_blockhash(tx, callreturn, itx, txhash, returns, count, onSent, onSuccess, onFailed);
        }
    }.bind(this));
};

augur.confirmTx = function (tx, txhash, returns, onSent, onSuccess, onFailed) {
    var self = this;
    if (tx && txhash) {
        this.notifications[txhash] = [];
        if (errors[txhash]) {
            if (onFailed) onFailed({
                error: txhash,
                message: errors[txhash]
            });
        } else {
            this.getTx(txhash, function (sent) {
                if (returns !== "null") {
                    self.call({
                        from: sent.from || self.coinbase,
                        to: sent.to || tx.to,
                        data: sent.input,
                        returns: returns
                    }, function (callreturn) {
                        if (callreturn) {
                            if (callreturn.constructor === Object && callreturn.error) {
                                if (onFailed) onFailed(callreturn);
                            } else if (errors[callreturn]) {
                                if (onFailed) onFailed({
                                    error: callreturn,
                                    message: errors[callreturn]
                                });
                            } else {
                                try {
                                    var num = numeric.bignum(callreturn);
                                    if (num && num.constructor === BigNumber) {
                                        num = num.toFixed();
                                    }
                                    if (num && errors[tx.method] && errors[tx.method][num]) {
                                        if (onFailed) onFailed({
                                            error: num,
                                            message: errors[tx.method][num]
                                        });
                                    } else {
                                        onSent({
                                            txHash: txhash,
                                            callReturn: self.encode_result(callreturn, returns)
                                        });
                                        if (onSuccess) {
                                            self.tx_notify(
                                                0,
                                                callreturn,
                                                tx,
                                                txhash,
                                                returns,
                                                onSent,
                                                onSuccess,
                                                onFailed
                                            );
                                        }
                                    }
                                } catch (e) {
                                    if (onFailed) onFailed(e);
                                }
                            }
                        }
                    });

                // if returns type is null, skip the intermediate call
                } else {
                    onSent({
                        txHash: txhash,
                        callReturn: null
                    });
                    if (onSuccess) {
                        self.tx_notify(
                            0,
                            null,
                            tx,
                            txhash,
                            returns,
                            onSent,
                            onSuccess,
                            onFailed
                        );
                    }
                }
            });
        }
    }
};

augur.transact = function (tx, onSent, onSuccess, onFailed) {
    var returns = tx.returns;
    tx.send = true;
    delete tx.returns;
    if (onSent && onSent.constructor === Function) {
        this.invoke(tx, function (txhash) {
            this.confirmTx(tx, txhash, returns, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        return this.invoke(tx);
    }
};

/*************
 * Augur API *
 *************/

// faucets.se
augur.cashFaucet = function (onSent, onSuccess, onFailed) {
    return this.transact(this.tx.cashFaucet, onSent, onSuccess, onFailed);
};
augur.reputationFaucet = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    var tx = utilities.copy(this.tx.reputationFaucet);
    tx.params = branch;
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// cash.se
augur.getCashBalance = function (account, onSent) {
    // account: ethereum account
    var tx = utilities.copy(this.tx.getCashBalance);
    tx.params = account || this.web.account.address || this.coinbase;
    return this.fire(tx, onSent);
};
augur.sendCash = function (to, value, onSent, onSuccess, onFailed) {
    // to: ethereum account
    // value: number -> fixed-point
    if (this.rpc.json_rpc(this.rpc.postdata("coinbase")) !== this.demo) {
        if (to && to.value) {
            value = to.value;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        var tx = utilities.copy(this.tx.sendCash);
        tx.params = [to, numeric.fix(value)];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};
augur.sendCashFrom = function (to, value, from, onSent, onSuccess, onFailed) {
    // to: ethereum account
    // value: number -> fixed-point
    // from: ethereum account
    if (this.rpc.json_rpc(this.rpc.postdata("coinbase")) !== this.demo) {
        if (to && to.value) {
            value = to.value;
            from = to.from;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        var tx = utilities.copy(this.tx.sendCashFrom);
        tx.params = [to, numeric.fix(value), from];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};

// info.se
augur.getCreator = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getCreator);
    tx.params = id;
    return this.fire(tx, onSent);
};
augur.getCreationFee = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getCreationFee);
    tx.params = id;
    return this.fire(tx, onSent);
};
augur.getDescription = function (item, onSent) {
    // item: sha256 hash id
    var tx = utilities.copy(this.tx.getDescription);
    tx.params = item;
    return this.fire(tx, onSent);
};
augur.checkPeriod = function (branch) {
    var period = Number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(this.blockNumber() / Number(this.getPeriodLength(branch)));
    var periodsBehind = (currentPeriod - 1) - period;
    return periodsBehind;
};

// redeem_interpolate.se
augur.redeem_interpolate = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_interpolate);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.read_ballots = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.read_ballots);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// center.se
augur.center = function (reports, reputation, scaled, scaled_max, scaled_min, max_iterations, max_components, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.center);
    tx.params = [
        numeric.fix(reports, "hex"),
        numeric.fix(reputation, "hex"),
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
    var tx = utilities.copy(this.tx.redeem_center);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.redeem_covariance = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_covariance);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// redeem_score.se
augur.redeem_blank = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_blank);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.redeem_loadings = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_loadings);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// score.se
augur.blank = function (components_remaining, max_iterations, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.blank);
    tx.params = [components_remaining, max_iterations, num_events];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.loadings = function (iv, wcd, reputation, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.loadings);
    tx.params = [
        numeric.fix(iv, "hex"),
        numeric.fix(wcd, "hex"),
        numeric.fix(reputation, "hex"),
        num_reports,
        num_events
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// resolve.se
augur.resolve = function (smooth_rep, reports, scaled, scaled_max, scaled_min, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.resolve);
    tx.params = [
        numeric.fix(smooth_rep, "hex"),
        numeric.fix(reports, "hex"),
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
    var tx = utilities.copy(this.tx.redeem_resolve);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// branches.se
augur.getBranches = function (onSent) {
    return this.fire(this.tx.getBranches, onSent);
};
augur.getMarkets = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getPeriodLength = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getPeriodLength);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getVotePeriod = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getVotePeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getStep = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getStep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.setStep = function (branch, step, onSent) {
    var tx = utilities.copy(this.tx.setStep);
    tx.params = [branch, step];
    return this.fire(tx, onSent);
};
augur.getSubstep = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.setSubstep = function (branch, substep, onSent) {
    var tx = utilities.copy(this.tx.setSubstep);
    tx.params = [branch, substep];
    return this.fire(tx, onSent);
};
augur.incrementSubstep = function (branch, onSent) {
    var tx = utilities.copy(this.tx.incrementSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getNumMarkets = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getNumMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getMinTradingFee = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getMinTradingFee);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.getNumBranches = function (onSent) {
    return this.fire(this.tx.getNumBranches, onSent);
};
augur.getBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = utilities.copy(this.tx.getBranch);
    tx.params = branchNumber;
    return this.fire(tx, onSent);
};
augur.incrementPeriod = function (branch, onSent) {
    var tx = utilities.copy(this.tx.incrementPeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent) {
    var tx = utilities.copy(this.tx.moveEventsToCurrentPeriod);
    tx.params = [branch, currentVotePeriod, currentPeriod];
    return this.fire(tx, onSent);
};
augur.getCurrentPeriod = function (branch) {
    return parseInt(this.blockNumber()) / parseInt(this.getPeriodLength(branch));
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
    var tx = utilities.copy(this.tx.addEvent);
    tx.params = [branch, futurePeriod, eventID];
    return this.fire(tx, onSent);
};
augur.setTotalRepReported = function (branch, expDateIndex, repReported, onSent) {
    var tx = utilities.copy(this.tx.setTotalRepReported);
    tx.params = [branch, expDateIndex, repReported];
    return this.fire(tx, onSent);
};
augur.setReporterBallot = function (branch, expDateIndex, reporterID, report, reputation, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.setReporterBallot);
    tx.params = [branch, expDateIndex, reporterID, numeric.fix(report, "hex"), reputation];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.setVSize = function (branch, expDateIndex, vSize, onSent) {
    var tx = utilities.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, vSize];
    return this.fire(tx, onSent);
};
augur.setReportsFilled = function (branch, expDateIndex, reportsFilled, onSent) {
    var tx = utilities.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, reportsFilled];
    return this.fire(tx, onSent);
};
augur.setReportsMask = function (branch, expDateIndex, reportsMask, onSent) {
    var tx = utilities.copy(this.tx.setReportsMask);
    tx.params = [branch, expDateIndex, reportsMask];
    return this.fire(tx, onSent);
};
augur.setWeightedCenteredData = function (branch, expDateIndex, weightedCenteredData, onSent) {
    var tx = utilities.copy(this.tx.setWeightedCenteredData);
    tx.params = [branch, expDateIndex, weightedCenteredData];
    return this.fire(tx, onSent);
};
augur.setCovarianceMatrixRow = function (branch, expDateIndex, covarianceMatrixRow, onSent) {
    var tx = utilities.copy(this.tx.setCovarianceMatrixRow);
    tx.params = [branch, expDateIndex, covarianceMatrixRow];
    return this.fire(tx, onSent);
};
augur.setDeflated = function (branch, expDateIndex, deflated, onSent) {
    var tx = utilities.copy(this.tx.setDeflated);
    tx.params = [branch, expDateIndex, deflated];
    return this.fire(tx, onSent);
};
augur.setLoadingVector = function (branch, expDateIndex, loadingVector, onSent) {
    var tx = utilities.copy(this.tx.setLoadingVector);
    tx.params = [branch, expDateIndex, loadingVector];
    return this.fire(tx, onSent);
};
augur.setScores = function (branch, expDateIndex, scores, onSent) {
    var tx = utilities.copy(this.tx.setScores);
    tx.params = [branch, expDateIndex, scores];
    return this.fire(tx, onSent);
};
augur.setSetOne = function (branch, expDateIndex, setOne, onSent) {
    var tx = utilities.copy(this.tx.setOne);
    tx.params = [branch, expDateIndex, setOne];
    return this.fire(tx, onSent);
};
augur.setSetTwo = function (branch, expDateIndex, setTwo, onSent) {
    var tx = utilities.copy(this.tx.setSetTwo);
    tx.params = [branch, expDateIndex, setTwo];
    return this.fire(tx, onSent);
};
augur.setOld = function (branch, expDateIndex, setOld, onSent) {
    var tx = utilities.copy(this.tx.setOld);
    tx.params = [branch, expDateIndex, setOld];
    return this.fire(tx, onSent);
};
augur.setNewOne = function (branch, expDateIndex, newOne, onSent) {
    var tx = utilities.copy(this.tx.setNewOne);
    tx.params = [branch, expDateIndex, newOne];
    return this.fire(tx, onSent);
};
augur.setNewTwo = function (branch, expDateIndex, newTwo, onSent) {
    var tx = utilities.copy(this.tx.setNewTwo);
    tx.params = [branch, expDateIndex, newTwo];
    return this.fire(tx, onSent);
};
augur.setAdjPrinComp = function (branch, expDateIndex, adjPrinComp, onSent) {
    var tx = utilities.copy(this.tx.setAdjPrinComp);
    tx.params = [branch, expDateIndex, adjPrinComp];
    return this.fire(tx, onSent);
};
augur.setSmoothRep = function (branch, expDateIndex, smoothRep, onSent) {
    var tx = utilities.copy(this.tx.setSmoothRep);
    tx.params = [branch, expDateIndex, smoothRep];
    return this.fire(tx, onSent);
};
augur.setOutcomesFinal = function (branch, expDateIndex, outcomesFinal, onSent) {
    var tx = utilities.copy(this.tx.setOutcomesFinal);
    tx.params = [branch, expDateIndex, outcomesFinal];
    return this.fire(tx, onSent);
};
augur.setReportHash = function (branch, expDateIndex, reportHash, onSent) {
    var tx = utilities.copy(this.tx.setReportHash);
    tx.params = [branch, expDateIndex, reportHash];
    return this.fire(tx, onSent);
};

// events.se
augur.getEventInfo = function (event_id, onSent) {
    // event_id: sha256 hash id
    var self = this;
    var parse_info = function (info) {
        if (info && info.length) {
            if (self.options.BigNumberOnly) {
                info[0] = numeric.hex(info[0]);
                info[1] = numeric.bignum(info[1]);
                info[2] = numeric.unfix(info[2]);
                info[3] = numeric.bignum(info[3]);
                info[4] = numeric.bignum(info[4]);
                info[5] = numeric.bignum(info[5]);
            } else {
                info[0] = numeric.hex(info[0]);
                info[1] = numeric.bignum(info[1]).toFixed();
                info[2] = numeric.unfix(info[2], "string");
                info[3] = numeric.bignum(info[3]).toFixed();
                info[4] = numeric.bignum(info[4]).toFixed();
                info[5] = numeric.bignum(info[5]).toFixed();
            }
        }
        return info;
    };
    this.tx.getEventInfo.params = event_id;
    if (onSent) {
        this.fire(this.tx.getEventInfo, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(this.fire(this.tx.getEventInfo));
    }
};
augur.getEventBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = utilities.copy(this.tx.getEventBranch);
    tx.params = branchNumber;
    return this.fire(tx, onSent);
};
augur.getExpiration = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getExpiration);
    tx.params = event;
    return this.fire(tx, onSent);
};
augur.getOutcome = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getOutcome);
    tx.params = event;
    return this.fire(tx, onSent);
};
augur.getMinValue = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getMinValue);
    tx.params = event;
    return this.fire(tx, onSent);
};
augur.getMaxValue = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getMaxValue);
    tx.params = event;
    return this.fire(tx, onSent);
};
augur.getNumOutcomes = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getNumOutcomes);
    tx.params = event;
    return this.fire(tx, onSent);
};
augur.getCurrentVotePeriod = function (branch, onSent) {
    // branch: sha256
    var periodLength, blockNum;
    this.tx.getPeriodLength.params = branch;
    if (onSent) {
        this.fire(this.tx.getPeriodLength, function (periodLength) {
            if (periodLength) {
                periodLength = numeric.bignum(periodLength);
                this.blockNumber(function (blockNum) {
                    blockNum = numeric.bignum(blockNum);
                    onSent(blockNum.dividedBy(periodLength).floor().sub(1));
                });
            }
        });
    } else {
        periodLength = this.fire(this.tx.getPeriodLength);
        if (periodLength) {
            blockNum = numeric.bignum(this.blockNumber());
            return blockNum.dividedBy(numeric.bignum(periodLength)).floor().sub(1);
        }
    }
};

// expiringEvents.se
augur.getEvents = function (branch, votePeriod, onSent) {
    // branch: sha256 hash id
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
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
    return this.batch(txlist, onSent);
};
augur.getNumberEvents = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNumberEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getEvent = function (branch, votePeriod, eventIndex, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getEvent);
    tx.params = [branch, votePeriod, eventIndex];
    return this.fire(tx, onSent);
};
augur.getTotalRepReported = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getTotalRepReported);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getReporterBallot = function (branch, votePeriod, reporterID, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReporterBallot);
    tx.params = [branch, votePeriod, reporterID];
    return this.fire(tx, onSent);
};
augur.getReport = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReports);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, onSent);
};
augur.getReportHash = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportHash);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, onSent);
};
augur.getVSize = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getVSize);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getReportsFilled = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportsFilled);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getReportsMask = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportsMask);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getWeightedCenteredData = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getWeightedCenteredData);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getCovarianceMatrixRow = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getCovarianceMatrixRow);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getDeflated = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getDeflated);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getLoadingVector = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getLoadingVector);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getLatent = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getLatent);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getScores = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getScores);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getSetOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSetOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getSetTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSetTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.returnOld = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.returnOld);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getNewOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNewOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getNewTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNewTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getAdjPrinComp = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getAdjPrinComp);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getSmoothRep = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSmoothRep);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getOutcomesFinal = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getOutcomesFinal);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.getReporterPayouts = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReporterPayouts);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};

augur.getTotalReputation = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getTotalReputation);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
augur.setTotalReputation = function (branch, votePeriod, totalReputation, onSent, onSuccess, onFailed) {
    // branch: sha256
    // votePeriod: integer
    // totalReputation: number -> fixed
    var tx = utilities.copy(this.tx.setTotalReputation);
    tx.params = [branch, votePeriod, numeric.fix(totalReputation, "hex")];
    return this.transact(tx, onSent, onSuccess, onFailed);
};
augur.makeBallot = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.makeBallot);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};

// markets.se
augur.getSimulatedBuy = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = utilities.copy(this.tx.getSimulatedBuy);
    tx.params = [market, outcome, numeric.fix(amount)];
    return this.fire(tx, onSent);
};
augur.getSimulatedSell = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = utilities.copy(this.tx.getSimulatedSell);
    tx.params = [market, outcome, numeric.fix(amount)];
    return this.fire(tx, onSent);
};
augur.lsLmsr = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.lsLmsr);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getMarketOutcomeInfo = function (market, outcome, onSent) {
    var self = this;
    var parse_info = function (info) {
        var i, len;
        if (info && info.length) {
            len = info.length;
            if (self.options.BigNumberOnly) {
                info[0] = numeric.unfix(info[0], "BigNumber");
                info[1] = numeric.unfix(info[1], "BigNumber");
                info[2] = numeric.unfix(info[2], "BigNumber");
                info[3] = numeric.bignum(info[3]);
                info[4] = numeric.bignum(info[4]);
                for (i = 5; i < len; ++i) {
                    info[i] = numeric.bignum(info[i]);
                }
            } else {
                info[0] = numeric.unfix(info[0], "string");
                info[1] = numeric.unfix(info[1], "string");
                info[2] = numeric.unfix(info[2], "string");
                info[3] = numeric.bignum(info[3]).toFixed();
                info[4] = numeric.bignum(info[4]).toFixed();
                for (i = 5; i < len; ++i) {
                    info[i] = numeric.bignum(info[i]).toFixed();
                }
            }
        }
        return info;
    };
    var tx = utilities.copy(this.tx.getMarketOutcomeInfo);
    tx.params = [market, outcome];
    if (onSent) {
        this.fire(tx, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
augur.getMarketInfo = function (market, onSent) {
    var self = this;
    var parse_info = function (info) {
        var i, len;
        if (info && info.length) {
            len = info.length;
            if (self.options.BigNumberOnly) {
                info[0] = numeric.bignum(info[0]);
                info[1] = numeric.unfix(info[1], "BigNumber");
                info[2] = numeric.bignum(info[2]);
                info[3] = numeric.bignum(info[3]);
                info[4] = numeric.bignum(info[4]);
                info[5] = numeric.unfix(info[5], "BigNumber");
                for (i = 6; i < len - 8; ++i) {
                    info[i] = numeric.prefix_hex(numeric.bignum(info[i]).toString(16));
                }
                for (i = len - 8; i < len; ++i) {
                    info[i] = numeric.bignum(info[i]);
                }
            } else {
                info[0] = numeric.bignum(info[0]).toFixed();
                info[1] = numeric.unfix(info[1], "string");
                info[2] = numeric.bignum(info[2]).toFixed();
                info[3] = numeric.bignum(info[3]).toFixed();
                info[4] = numeric.bignum(info[4]).toFixed();
                info[5] = numeric.unfix(info[5], "string");
                for (i = len - 8; i < len; ++i) {
                    info[i] = numeric.bignum(info[i]).toFixed();
                }
            }
        }
        return info;
    };
    var tx = utilities.copy(this.tx.getMarketInfo);
    tx.params = market;
    if (onSent) {
        this.fire(tx, function (info) {
            onSent(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
augur.getMarketEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getMarketEvents);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getNumEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getNumEvents);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getBranchID = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getBranchID);
    tx.params = branch;
    return this.fire(tx, onSent);
};
// Get the current number of participants in this market
augur.getCurrentParticipantNumber = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getCurrentParticipantNumber);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getMarketNumOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getMarketNumOutcomes);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getParticipantSharesPurchased = function (market, participationNumber, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participationNumber, outcome];
    return this.fire(tx, onSent);
};
augur.getSharesPurchased = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return this.fire(tx, onSent);
};
augur.getWinningOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getWinningOutcomes);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.price = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.price);
    tx.params = [market, outcome];
    return this.fire(tx, onSent);
};
// Get the participant number (the array index) for specified address
augur.getParticipantNumber = function (market, address, onSent) {
    // market: sha256
    // address: ethereum account
    var tx = utilities.copy(this.tx.getParticipantNumber);
    tx.params = [market, address];
    return this.fire(tx, onSent);
};
// Get the address for the specified participant number (array index) 
augur.getParticipantID = function (market, participantNumber, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getParticipantID);
    tx.params = [market, participantNumber];
    return this.fire(tx, onSent);
};
augur.getAlpha = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getAlpha);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getCumScale = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getCumScale);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getTradingPeriod = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getTradingPeriod);
    tx.params = market;
    return this.fire(tx, onSent);
};
augur.getTradingFee = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getTradingFee);
    tx.params = market;
    return this.fire(tx, onSent);
};

// reporting.se
augur.getRepBalance = function (branch, account, onSent) {
    // branch: sha256 hash id
    // account: ethereum address (hexstring)
    var tx = utilities.copy(this.tx.getRepBalance);
    tx.params = [branch, account || this.coinbase];
    return this.fire(tx, onSent);
};
augur.getRepByIndex = function (branch, repIndex, onSent) {
    // branch: sha256
    // repIndex: integer
    var tx = utilities.copy(this.tx.getRepByIndex);
    tx.params = [branch, repIndex];
    return this.fire(tx, onSent);
};
augur.getReporterID = function (branch, index, onSent) {
    // branch: sha256
    // index: integer
    var tx = utilities.copy(this.tx.getReporterID);
    tx.params = [branch, index];
    return this.fire(tx, onSent);
};
// reputation of a single address over all branches
augur.getReputation = function (address, onSent) {
    // address: ethereum account
    var tx = utilities.copy(this.tx.getReputation);
    tx.params = address;
    return this.fire(tx, onSent);
};
augur.getNumberReporters = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getNumberReporters);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.repIDToIndex = function (branch, repID, onSent) {
    // branch: sha256
    // repID: ethereum account
    var tx = utilities.copy(this.tx.repIDToIndex);
    tx.params = [branch, repID];
    return this.fire(tx, onSent);
};
augur.getTotalRep = function (branch, onSent) {
    var tx = utilities.copy(this.tx.getTotalRep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
augur.hashReport = function (ballot, salt, onSent) {
    // ballot: number[]
    // salt: integer
    if (ballot.constructor === Array) {
        var tx = utilities.copy(this.tx.hashReport);
        tx.params = [numeric.fix(ballot, "hex"), salt];
        return this.fire(tx, onSent);
    }
};

// checkQuorum.se
augur.checkQuorum = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    if (this.rpc.json_rpc(this.rpc.postdata("coinbase")) !== this.demo) {
        var tx = utilities.copy(this.tx.checkQuorum);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};

// buy&sellShares.se
augur.getNonce = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getNonce);
    tx.params = id;
    return this.fire(tx, onSent);
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
    var tx = utilities.copy(this.tx.buyShares);
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, numeric.fix(amount), nonce, limit || 0];
            this.transact(tx, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, numeric.fix(amount), nonce, limit || 0];
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
    var tx = utilities.copy(this.tx.sellShares);
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, numeric.fix(amount), nonce, limit || 0];
            this.transact(tx, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, numeric.fix(amount), nonce, limit || 0];
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
    var tx = utilities.copy(this.tx.sendReputation);
    tx.params = [description, periodLength, parent, tradingFee];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// p2pWagers.se

// sendReputation.se
augur.sendReputation = function (branch, to, value, onSent, onSuccess, onFailed) {
    // branch: sha256
    // to: sha256
    // value: number -> fixed-point
    if (this.rpc.json_rpc(this.rpc.postdata("coinbase")) !== this.demo) {
        if (branch && branch.branchId && branch.to && branch.value) {
            to = branch.to;
            value = branch.value;
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branchId;
        }
        var tx = utilities.copy(this.tx.sendReputation);
        tx.params = [branch, to, numeric.fix(value)];
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
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
    var tx = utilities.copy(this.tx.report);
    tx.params = [branch, numeric.fix(report, "hex"), votePeriod, salt];
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
    var tx = utilities.copy(this.tx.submitReportHash);
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
    var tx = utilities.copy(this.tx.checkReportValidity);
    tx.params = [branch, numeric.fix(report, "hex"), votePeriod];
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
    var tx = utilities.copy(this.tx.slashRep);
    tx.params = [branch, votePeriod, salt, numeric.fix(report, "hex"), reporter];
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
        numOutcomes,
        this.blockNumber()
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
    tx.params = [
        branch,
        description,
        numeric.fix(alpha, "hex"),
        numeric.fix(liquidity, "hex"),
        numeric.fix(tradingFee, "hex"),
        events,
        this.blockNumber()
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
    var tx = utilities.copy(this.tx.closeMarket);
    tx.params = [branch, market];
    return this.transact(tx, onSent, onSuccess, onFailed);
};

// dispatch.se
augur.dispatch = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256 or transaction object
    if (this.rpc.json_rpc(this.rpc.postdata("coinbase")) !== this.demo) {
        if (branch.constructor === Object && branch.branchId) {
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branchId;
        }
        var tx = utilities.copy(this.tx.dispatch);
        tx.params = branch;
        return this.transact(tx, onSent, onSuccess, onFailed);
    }
};

// filters

augur.getCreationBlock = function (market_id, callback) {
    if (market_id) {
        var filter = {
            fromBlock: "0x1",
            toBlock: this.blockNumber(),
            topics: ["creationBlock"]
        };
        if (callback) {
            this.filters.eth_getLogs(filter, function (logs) {
                callback(logs);
            });
        } else {
            return this.filters.eth_getFilterLogs(filter);
        }
    }
};

augur.getMarketPriceHistory = function (market_id, outcome_id, callback) {
    if (market_id && outcome_id) {
        var filter = {
            fromBlock: "0x1",
            toBlock: this.blockNumber(),
            topics: ["updatePrice"]
        };
        if (callback) {
            this.filters.eth_getLogs(filter, function (logs) {
                callback(
                    this.filters.search_price_logs(logs, market_id, outcome_id)
                );
            }.bind(this));
        } else {
            return this.filters.search_price_logs(
                this.filters.eth_getLogs(filter),
                market_id,
                outcome_id
            );
        }
    }
};

module.exports = augur;
