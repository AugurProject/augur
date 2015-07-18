/**
 * Centralized/trustless web client *
 */

"use strict";

var crypto;
if ((typeof module !== "undefined") && process && !process.browser) {
    crypto = require("crypto");
} else {
    crypto = require("crypto-browserify");
}
var BigNumber = require("bignumber.js");
var EthUtil = require("ethereumjs-util");
var EthTx = require("ethereumjs-tx");
var eccrypto = require("eccrypto");
var errors = require("./errors");
var constants = require("./constants");
var utilities = require("./utilities");
var numeric = require("./numeric");

module.exports = function (augur) {

    return {

        account: {},

        db: {

            write: function (handle, data, f) {
                try {
                    return augur.rpc.json_rpc(augur.rpc.postdata(
                        "putString",
                        ["accounts", handle, JSON.stringify(data)],
                        "db_"
                    ), f);
                } catch (e) {
                    return errors.DB_WRITE_FAILED;
                }
            },

            get: function (handle, f) {
                try {
                    if (f) {
                        augur.rpc.json_rpc(augur.rpc.postdata(
                            "getString",
                            ["accounts", handle],
                            "db_"
                        ), function (account) {
                            if (!account.error) {
                                f(JSON.parse(account));
                            } else {
                                // account does not exist
                                f(errors.BAD_CREDENTIALS);
                            }
                        });
                    } else {
                        var account = augur.rpc.json_rpc(augur.rpc.postdata(
                            "getString",
                            ["accounts", handle],
                            "db_"
                        ));
                        if (!account.error) {
                            return JSON.parse(account);
                        } else {
                            // account does not exist
                            return errors.BAD_CREDENTIALS;
                        }
                    }
                } catch (e) {
                    return errors.DB_READ_FAILED;
                }
            }
        },

        encrypt: function (plaintext, key, iv) {
            var cipher, ciphertext;
            cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
            ciphertext = cipher.update(plaintext, "hex", "base64");
            return ciphertext + cipher.final("base64");
        },

        decrypt: function (ciphertext, key, iv) {
            var decipher, plaintext;
            decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
            plaintext = decipher.update(ciphertext, "base64", "hex");
            return plaintext + decipher.final("hex");
        },

        register: function (handle, password) {

            var privKey, pubKey, address, iv, encryptedPrivKey;

            // make sure this handle isn't taken already
            if (this.db.get(handle).error) {

                // generate private key, derive public key and address
                privKey = crypto.randomBytes(32);
                pubKey = eccrypto.getPublic(privKey);
                address = "0x" + EthUtil.pubToAddress(pubKey).toString("hex");

                // password hash used as secret key to aes-256 encrypt private key
                iv = crypto.randomBytes(16);
                encryptedPrivKey = this.encrypt(privKey, new Buffer(utilities.sha256(password), "hex"), iv);

                // store encrypted key & password hash, indexed by handle
                this.db.write(handle, {
                    handle: handle,
                    privateKey: encryptedPrivKey,
                    iv: iv.toString("base64"),
                    address: address,
                    nonce: 0
                });

                this.account = {
                    handle: handle,
                    privateKey: privKey,
                    address: address,
                    nonce: 0
                };

                return this.account;

            // account already exists
            } else {
                return errors.HANDLE_TAKEN;
            }
        },

        login: function (handle, password) {
            var storedInfo, privateKey;

            // retrieve account info from database
            storedInfo = this.db.get(handle);

            // use the hashed password to decrypt the private key
            try {

                privateKey = new Buffer(this.decrypt(
                    storedInfo.privateKey,
                    new Buffer(utilities.sha256(password), "hex"),
                    new Buffer(storedInfo.iv, "base64")
                ), "hex");

                this.account = {
                    handle: handle,
                    privateKey: privateKey,
                    address: storedInfo.address,
                    nonce: storedInfo.nonce
                };

                return this.account;

            // decryption failure: bad password
            } catch (e) {
                return errors.BAD_CREDENTIALS;
            }
        },

        logout: function () {
            this.account = {};
        },

        sendEther: function (toHandle, value, callback) {
            if (this.account.address) {
                var toAccount = this.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    return this.invoke({
                        value: value,
                        from: this.account.address,
                        to: toAccount.address
                    }, callback);
                } else {
                    return errors.TRANSACTION_FAILED;
                }
            }
        },

        sendCash: function (toHandle, value, callback) {
            if (this.account.address) {
                var toAccount = this.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    var tx = utilities.copy(augur.tx.sendCash);
                    tx.params = [toAccount.address, numeric.fix(value)];
                    return this.invoke(tx, callback);
                } else {
                    return errors.TRANSACTION_FAILED;
                }
            }
        },

        sendReputation: function (toHandle, value, callback) {
            if (this.account.address) {
                var toAccount = this.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    var tx = utilities.copy(augur.tx.sendReputation);
                    tx.params = [toAccount.address, numeric.fix(value)];
                    return this.invoke(tx, callback);
                } else {
                    return errors.TRANSACTION_FAILED;
                }
            }
        },

        invoke: function (itx, callback) {
            var tx, data_abi, packaged, stored;

            // client-side transactions only needed for sendTransactions
            if (itx.send) {
                if (this.account.privateKey && itx && itx.constructor === Object) {

                    // parse and serialize transaction parameters
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
                        data_abi = augur.abi.encode(tx);
                    }

                    // package up the transaction and submit it to the network
                    packaged = new EthTx({
                        to: tx.to,
                        gasPrice: "0xda475abf000", // 0.000015 ether
                        gasLimit: (tx.gas) ? tx.gas : constants.default_gas,
                        nonce: ++this.account.nonce,
                        value: tx.value || "0x0",
                        data: data_abi
                    });

                    // write the incremented nonce to the database
                    stored = this.db.get(this.account.handle);
                    stored.nonce = this.account.nonce;
                    this.db.write(this.account.handle, stored);

                    // sign, validate, and send the transaction
                    packaged.sign(this.account.privateKey);
                    if (packaged.validate()) {
                        return augur.sendRawTx(packaged.serialize().toString("hex"), callback);

                    // transaction validation failed
                    } else {
                        return errors.TRANSACTION_INVALID;
                    }
                } else {
                    return errors.TRANSACTION_FAILED;
                }

            // if this is just a call, use the regular invoke method
            } else {
                return augur.invoke(itx, callback);
            }
        }

    };
};
