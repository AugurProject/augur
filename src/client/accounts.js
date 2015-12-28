/**
 * Client-side accounts
 */

"use strict";

var BigNumber = require("bignumber.js");
var ethTx = require("ethereumjs-tx");
var keys = require("keythereum");
var uuid = require("node-uuid");
var abi = require("augur-abi");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

keys.constants.pbkdf2.c = 65536;
keys.constants.scrypt.n = 65536;

module.exports = function () {

    var augur = this;

    return {

        // The account object is set when logged in
        account: {},

        // free (testnet) ether for new accounts on registration
        fund: function (account, onSent, onConfirm, onFinal) {
            var self = this;
            onSent = onSent || utils.noop;
            onConfirm = onConfirm || utils.noop;
            onFinal = onFinal || utils.noop;
            augur.rpc.coinbase(function (funder) {
                if (!funder || funder.error) return onConfirm();
                augur.rpc.sendEther({
                    to: account.address,
                    value: constants.FREEBIE,
                    from: funder,
                    onSent: function (r) {
                        onSent(account);
                    },
                    onSuccess: function (r) {
                        var count = 0;
                        var check = function (response) {
                            if (++count === 2) onFinal(response);
                        };
                        onConfirm(account);

                        // exchange half of the free ether for cash
                        augur.depositEther({
                            value: constants.FREEBIE*0.5,
                            onSent: function (res) {
                                console.log("depositEther:", res.txHash);
                                augur.reputationFaucet({
                                    branch: augur.branches.dev,
                                    onSent: function (res) {
                                        console.log("reputationFaucet:", res.txHash);
                                    },
                                    onSuccess: check,
                                    onFailed: onFinal
                                });
                            },
                            onSuccess: check,
                            onFailed: onFinal
                        });
                    },
                    onFailed: onConfirm
                });
            });
        },

        register: function (handle, password, cb, donotfund) {
            var self = this;
            cb = cb || utils.pass;
            if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);
            augur.db.get(handle, function (record) {
                if (!record || !record.error) return cb(errors.HANDLE_TAKEN);

                // generate ECDSA private key and initialization vector
                keys.create(null, function (plain) {

                    // derive secret key from password
                    keys.deriveKey(password, plain.salt, null, function (derivedKey) {
                        if (derivedKey.error) return cb(derivedKey);

                        var encryptedPrivateKey = new Buffer(keys.encrypt(
                            plain.privateKey,
                            derivedKey.slice(0, 16),
                            plain.iv
                        ), "base64").toString("hex");

                        var mac = keys.getMAC(derivedKey, encryptedPrivateKey);

                        // encrypt private key using derived key and IV, then
                        // store encrypted key & IV, indexed by handle
                        augur.db.put(handle, {
                            privateKey: abi.prefix_hex(encryptedPrivateKey), // 256-bit
                            iv: abi.prefix_hex(plain.iv.toString("hex")), // 128-bit
                            salt: abi.prefix_hex(plain.salt.toString("hex")), // 256-bit
                            mac: abi.prefix_hex(mac), // 256-bit
                            id: abi.prefix_hex(new Buffer(uuid.parse(uuid.v4())).toString("hex")) // 128-bit
                        }, function (result) {
                            if (!result || result.error) {
                                if (cb.constructor === Array) {
                                    return cb[0](result);
                                }
                                return cb(result);
                            }

                            // set web.account object
                            self.account = {
                                handle: handle,
                                privateKey: plain.privateKey,
                                address: keys.privateKeyToAddress(plain.privateKey)
                            };

                            if (cb.constructor === Array) {
                                return self.fund(self.account, cb[0], cb[1]);
                            }
                            if (donotfund) return cb(self.account);
                            self.fund(self.account, cb);

                        }); // augur.db.put
                    }); // deriveKey
                }); // create
            }); // augur.db.get
        },

        login: function (handle, password, cb) {
            var self = this;

            // blank password
            if (!password || password === "") return cb(errors.BAD_CREDENTIALS);

            // retrieve account info from database
            augur.db.get(handle, function (stored) {
                if (!stored || stored.error) return cb(errors.BAD_CREDENTIALS);

                // derive secret key from password
                keys.deriveKey(password, stored.salt, null, function (derived) {
                    if (!derived || derived.error) return cb(errors.BAD_CREDENTIALS);

                    // verify that message authentication codes match
                    var storedKey = stored.privateKey;
                    if (keys.getMAC(derived, storedKey) !== stored.mac.toString("hex")) {
                        return cb(errors.BAD_CREDENTIALS);
                    }

                    // decrypt stored private key using secret key
                    try {
                        var dk = new Buffer(keys.decrypt(
                            storedKey,
                            derived.slice(0, 16),
                            stored.iv
                        ), "hex");

                        // while logged in, web.account object is set
                        self.account = {
                            handle: handle,
                            privateKey: dk,
                            address: abi.format_address(keys.privateKeyToAddress(dk))
                        };

                        cb(self.account);
                    
                    // decryption failure: bad password
                    } catch (e) {
                        if (utils.is_function(cb)) {
                            cb(errors.BAD_CREDENTIALS);
                        }
                    }
                }); // deriveKey
            }); // augur.db.get
        },

        importKey: function (password, json, cb) {
            if (!utils.is_function(cb)) {
                return keys.recover(password, JSON.parse(json));
            }
            keys.recover(password, JSON.parse(json), function (keyObj) {
                cb(keyObj);
            });
        },

        logout: function () {
            this.account = {};
            augur.rpc.clear();
        },

        invoke: function (itx, cb) {
            var self = this;
            var tx, packaged;

            // if this is just a call, use ethrpc's regular invoke method
            if (!itx.send) return augur.rpc.fire(itx, cb);

            cb = cb || utils.pass;
            if (!this.account.address) return cb(errors.NOT_LOGGED_IN);
            if (!this.account.privateKey || !itx || itx.constructor !== Object) {
                return cb(errors.TRANSACTION_FAILED);
            }

            // parse and serialize transaction parameters
            tx = abi.copy(itx);
            if (tx.params !== undefined) {
                if (tx.params.constructor === Array) {
                    for (var i = 0, len = tx.params.length; i < len; ++i) {
                        if (tx.params[i] !== undefined &&
                            tx.params[i].constructor === BigNumber) {
                            tx.params[i] = abi.hex(tx.params[i]);
                        }
                    }
                } else if (tx.params.constructor === BigNumber) {
                    tx.params = abi.hex(tx.params);
                }
            }
            if (tx.to) tx.to = abi.prefix_hex(tx.to);

            // package up the transaction and submit it to the network
            packaged = {
                to: tx.to,
                from: this.account.address,
                gasPrice: (tx.gasPrice) ? tx.gasPrice : augur.rpc.gasPrice(),
                gasLimit: (tx.gas) ? tx.gas : constants.DEFAULT_GAS,
                nonce: 0,
                value: tx.value || "0x0",
                data: abi.encode(tx)
            };

            // get nonce: number of transactions
            return augur.rpc.txCount(this.account.address, function (txCount) {
                if (txCount && !txCount.error) {
                    packaged.nonce = parseInt(txCount);
                }
                (function repack(packaged) {
                    var etx = new ethTx(packaged);

                    // sign, validate, and send the transaction
                    etx.sign(self.account.privateKey);

                    // transaction validation
                    if (!etx.validate()) return cb(errors.TRANSACTION_INVALID);

                    // send the raw signed transaction to geth
                    augur.rpc.sendRawTx(etx.serialize().toString("hex"), function (res) {
                        if (res) {

                            // geth error -32603: nonce too low / known tx
                            if (res.error === -32603) {

                                // rlp encoding error also has -32603 error code
                                if (res.message.indexOf("rlp") > -1) {
                                    console.error("mysterious RLP encoding error:", res);
                                    return console.log(JSON.stringify(packaged, null, 2));
                                }

                                ++packaged.nonce;
                                return repack(packaged);

                            // other errors
                            } else if (res.error) {
                                console.error("repack error:", res);
                                return console.log(JSON.stringify(packaged, null, 2));
                            }

                            // res is the txhash if nothing failed immediately
                            // (even if the tx is nulled, still index the hash)
                            augur.rpc.rawTxs[res] = {tx: packaged};

                            // nonce ok, execute callback
                            cb(res);
                        }
                    });
                })(packaged);
            });
        }
    };
};
