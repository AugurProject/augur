/**
 * Client-side accounts
 */

"use strict";

var BigNumber = require("bignumber.js");
var ethTx = require("ethereumjs-tx");
var keythereum = require("keythereum");
var uuid = require("node-uuid");
var abi = require("augur-abi");
var errors = require("../errors");
var constants = require("../constants");
var utils = require("../utilities");
var ethrpc = require("ethrpc");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

keythereum.constants.pbkdf2.c = 10000;
keythereum.constants.scrypt.n = 10000;

module.exports = function () {

    var augur = this;

    return {

        // The account object is set when logged in
        account: {},

        // free (testnet) ether for new accounts on registration
        fund: function (account, onSent, onConfirm) {
            var self = this;
            augur.rpc.coinbase(function (funder) {
                if (funder && !funder.error) {
                    augur.rpc.sendEther({
                        to: account.address,
                        value: constants.FREEBIE,
                        from: funder,
                        onSent: function (r) {
                            if (onSent) onSent(account);
                        },
                        onSuccess: function (r) {
                            if (onConfirm) onConfirm(account);
                        },
                        onFailed: function (r) {
                            if (onConfirm) onConfirm(r);
                        }
                    });
                }
            });
        },

        register: function (handle, password, callback, donotfund) {
            var self = this;
            if (password && password.length > 5) {
                augur.db.ipfs.get(handle, function (record) {
                    if (!record) {

                        // generate ECDSA private key and initialization vector
                        keythereum.create(null, function (plain) {

                            // derive secret key from password
                            keythereum.deriveKey(password, plain.salt, null, function (derivedKey) {
                                if (derivedKey.error) {
                                    if (utils.is_function(callback)) callback(derivedKey);
                                } else {
                                    var encryptedPrivateKey = keythereum.encrypt(
                                        plain.privateKey,
                                        derivedKey.slice(0, 16),
                                        plain.iv
                                    );
                                    var mac = new Buffer(
                                        keythereum.getMAC(
                                            derivedKey,
                                            new Buffer(encryptedPrivateKey, "base64")
                                        ),
                                        "hex"
                                    ).toString("base64");

                                    // encrypt private key using derived key and IV, then
                                    // store encrypted key & IV, indexed by handle
                                    augur.db.ipfs.put(handle, {
                                        handle: handle,
                                        privateKey: encryptedPrivateKey,
                                        iv: plain.iv.toString("base64"),
                                        salt: plain.salt.toString("base64"),
                                        mac: mac,
                                        id: uuid.v4()
                                    }, function (ipfsHash) {
                                        if (!ipfsHash || ipfsHash.error) return callback(ipfsHash);

                                        // set web.account object
                                        self.account = {
                                            handle: handle,
                                            privateKey: plain.privateKey,
                                            address: keythereum.privateKeyToAddress(plain.privateKey)
                                        };

                                        if (donotfund) return callback(self.account);

                                        if (callback && callback.constructor === Array) {
                                            return self.fund(
                                                self.account,
                                                callback[0],
                                                callback[1]
                                            );
                                        }
                                        self.fund(self.account, callback);

                                    }); // augur.db.ipfs.put

                                }

                            }); // deriveKey

                        }); // create

                    } else {
                        if (utils.is_function(callback)) callback(errors.HANDLE_TAKEN);
                    }
                }); // augur.db.ipfs.get

            } else {
                if (utils.is_function(callback)) callback(errors.PASSWORD_TOO_SHORT);
            }
        },

        login: function (handle, password, callback) {
            var self = this;

            // retrieve account info from database
            if (password && password !== "") {
                augur.db.ipfs.get(handle, function (storedInfo) {
                    if (storedInfo && !storedInfo.error) {

                        var iv = new Buffer(storedInfo.iv, "base64");
                        var salt = new Buffer(storedInfo.salt, "base64");

                        // derive secret key from password
                        keythereum.deriveKey(password, salt, null, function (derivedKey) {
                            if (derivedKey) {

                                // verify that message authentication codes match
                                var mac = new Buffer(keythereum.getMAC(
                                    derivedKey,
                                    new Buffer(storedInfo.privateKey, "base64")
                                ), "hex").toString("base64");

                                if (mac === storedInfo.mac) {
                                    try {

                                        // decrypt stored private key using secret key
                                        var privateKey = new Buffer(keythereum.decrypt(
                                            storedInfo.privateKey,
                                            derivedKey.slice(0, 16),
                                            iv
                                        ), "hex");

                                        // while logged in, web.account object is set
                                        self.account = {
                                            handle: handle,
                                            privateKey: privateKey,
                                            address: keythereum.privateKeyToAddress(privateKey),
                                            nonce: storedInfo.nonce
                                        };

                                        if (utils.is_function(callback)) callback(self.account);
                                    
                                    // decryption failure: bad password
                                    } catch (e) {
                                        if (utils.is_function(callback)) callback(errors.BAD_CREDENTIALS);
                                    }

                                // message authentication code mismatch
                                } else {
                                    if (utils.is_function(callback)) callback(errors.BAD_CREDENTIALS);
                                }
                            }

                        }); // deriveKey

                    // handle not found
                    } else {
                        if (utils.is_function(callback)) callback(errors.BAD_CREDENTIALS);
                    }

                }); // augur.db.ipfs.get

            // blank password
            } else {
                if (utils.is_function(callback)) callback(errors.BAD_CREDENTIALS);
            }
        },

        logout: function () {
            this.account = {};
            augur.rpc.clear();
        },

        invoke: function (itx, callback) {
            var self = this;
            var tx, packaged;

            // if this is just a call, use ethrpc's regular invoke method
            if (!itx.send) return augur.rpc.fire(itx, callback);

            if (this.account.address) {
                if (this.account.privateKey && itx && itx.constructor === Object) {

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
                            if (etx.validate()) {
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
                                        augur.rpc.rawTxs[res] = { tx: packaged };

                                        // nonce ok, execute callback
                                        if (utils.is_function(callback)) return callback(res);
                                    }
                                });

                            // transaction validation failed
                            } else {
                                if (utils.is_function(callback)) callback(errors.TRANSACTION_INVALID);
                            }
                        })(packaged);
                    });

                } else {
                    if (!utils.is_function(callback)) {
                        return errors.TRANSACTION_FAILED;
                    }
                    return callback(errors.TRANSACTION_FAILED);
                }

            } else {
                if (!utils.is_function(callback)) {
                    return errors.NOT_LOGGED_IN;
                }
                return callback(errors.NOT_LOGGED_IN);
            }
        }

    };
};
