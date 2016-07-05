/**
 * Client-side accounts
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var BigNumber = require("bignumber.js");
var ethTx = require("ethereumjs-tx");
var keys = require("keythereum");
var uuid = require("node-uuid");
var clone = require("clone");
var locks = require("locks");
var request = (NODE_JS) ? require("request") : require("browser-request");
var abi = require("augur-abi");
var errors = require("augur-contracts").errors;
var constants = require("../constants");
var utils = require("../utilities");
var abacus = require("../modules/abacus");

request = request.defaults({timeout: 120000});
BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

keys.constants.pbkdf2.c = constants.ROUNDS;
keys.constants.scrypt.n = constants.ROUNDS;

module.exports = function () {

    var augur = this;

    return {

        // The account object is set when logged in
        account: {},

				setWebAccount: function (name, secureLoginID, privateKey, address, keystore) {
					var self = this;

					self.account = {
						name: name,
						secureLoginID: secureLoginID,
						privateKey: privateKey,
						address: address,
						keystore: keystore
					};
				},

        // free (testnet) ether for new accounts on registration
        fundAccount: function (account, branch, onSent, onSuccess, onFailed) {
          var self = this;

          if (process.env.BUILD_AZURE) {
            var FREEBIE_ETH = 5;
            augur.rpc.sendEther({
              to: account.address,
              value: FREEBIE_ETH,
              from: augur.coinbase,
              onFailed: onFailed,
              onSent: utils.noop,
              onSuccess: function (res) {
                augur.fundNewAccount({
                  branch: branch || augur.constants.DEFAULT_BRANCH_ID,
                  onSent: onSent,
                  onSuccess: onSuccess,
                  onFailed: onFailed
                });
              }
            });
          } else {
            var url = constants.FAUCET + abi.format_address(account.address);
            request(url, function (err, response, body) {
              if (err) return onFailed(err);
              if (response.statusCode !== 200) {
                  return onFailed(response.statusCode);
              }
              console.log("sent ether to account:", account);
              augur.fundNewAccount({
                branch: branch || augur.constants.DEFAULT_BRANCH_ID,
                onSent: onSent,
                onSuccess: onSuccess,
                onFailed: onFailed
              });
            });
          }
        },

        register: function (name, password, cb) {
            var i, self = this;

            if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);

            // generate ECDSA private key and initialization vector
            keys.create(null, function (plain) {
              if (plain.error) return cb(plain);

              // derive secret key from password
              keys.deriveKey(password, plain.salt, null, function (derivedKey) {
                if (derivedKey.error) return cb(derivedKey);

                if (!Buffer.isBuffer(derivedKey)) {
                  derivedKey = new Buffer(derivedKey, "hex");
                }

                var encryptedPrivateKey = new Buffer(keys.encrypt(
                  plain.privateKey,
                  derivedKey.slice(0, 16),
                  plain.iv
                ), "base64").toString("hex");

                // encrypt private key using derived key and IV, then
                // store encrypted key & IV, indexed by handle
                var keystore = {
                  address: abi.format_address(keys.privateKeyToAddress(plain.privateKey)),
                  crypto: {
                    cipher: keys.constants.cipher,
                    ciphertext: encryptedPrivateKey,
                    cipherparams: {iv: plain.iv.toString("hex")},
                    kdf: constants.KDF,
                    kdfparams: {
                      c: keys.constants[constants.KDF].c,
                      dklen: keys.constants[constants.KDF].dklen,
                      prf: keys.constants[constants.KDF].prf,
                      salt: plain.salt.toString("hex")
                    },
                    mac: keys.getMAC(derivedKey, encryptedPrivateKey)
                  },
                  version: 3,
                  id: uuid.v4()
                };
								var unsecureLoginIDObject = { name: name, keystore: keystore };
								var secureLoginID = abacus.base58Encrypt(unsecureLoginIDObject);

								// while logged in, web.account object is set
								self.setWebAccount(name, secureLoginID, plain.privateKey, keystore.address, keystore);
								// console.log(self.account);
								// console.log(plain.privateKey);
								// console.log(encryptedPrivateKey);
	              // self.account = {
								// 	name: name,
	              //   secureLoginID: secureLoginID,
	              //   privateKey: plain.privateKey,
	              //   address: keystore.address,
	              //   keystore: keystore
	              // };

								cb({ name: name, secureLoginID: secureLoginID, keystore: keystore, address: keystore.address });
              }); // deriveKey
          }); // create
        },

        login: function (secureLoginID, password, cb) {
          var self = this;

          // blank password
          if (!password || password === "") return cb(errors.BAD_CREDENTIALS);
					try {
						var unencryptedLoginIDObject = abacus.base58Decrypt(secureLoginID);
					} catch (err) {
						return cb(errors.BAD_CREDENTIALS);
					}
					var keystore = unencryptedLoginIDObject.keystore;
					var name = unencryptedLoginIDObject.name;

          // derive secret key from password
          keys.deriveKey(password, keystore.crypto.kdfparams.salt, null, function (derived) {
            if (!derived || derived.error) return cb(errors.BAD_CREDENTIALS);

            // verify that message authentication codes match
            var storedKey = keystore.crypto.ciphertext;
            if (keys.getMAC(derived, storedKey) !== keystore.crypto.mac.toString("hex")) {
              return cb(errors.BAD_CREDENTIALS);
            }

            if (!Buffer.isBuffer(derived)) {
              derived = new Buffer(derived, "hex");
            }

            // decrypt stored private key using secret key
            try {
              var privateKey = new Buffer(keys.decrypt(
                storedKey,
                derived.slice(0, 16),
                keystore.crypto.cipherparams.iv
              ), "hex");

              // while logged in, web.account object is set
							self.setWebAccount(name, secureLoginID, privateKey, keystore.address, keystore);
              // self.account = {
							// 	name: name,
              //   secureLoginID: secureLoginID,
              //   privateKey: privateKey,
              //   address: keystore.address,
              //   keystore: keystore
              // };

              cb({ name: name, secureLoginID: secureLoginID, keystore: keystore, address: keystore.address });
            // decryption failure: bad password
            } catch (exc) {
              var e = clone(errors.BAD_CREDENTIALS);
              e.bubble = exc;
              if (utils.is_function(cb)) cb(e);
            }
          }); // deriveKey
        },

        persist: function () {
            var account = augur.db.getPersistent();
            if (account && account.privateKey) {
                this.account = account;
            }
            return account;
        },

        logout: function () {
            this.account = {};
            augur.db.removePersistent();
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
            tx = clone(itx);
            if (tx.params === undefined || tx.params === null) {
                tx.params = [];
            } else if (tx.params.constructor !== Array) {
                tx.params = [tx.params];
            }
            for (var j = 0; j < tx.params.length; ++j) {
                if (tx.params[j] !== undefined && tx.params[j] !== null &&
                    tx.params[j].constructor === Number) {
                    tx.params[j] = abi.prefix_hex(tx.params[j].toString(16));
                }
            }
            if (tx.to) tx.to = abi.prefix_hex(tx.to);

            // package up the transaction and submit it to the network
            packaged = {
                to: tx.to,
                from: this.account.address,
                gasLimit: tx.gas || constants.DEFAULT_GAS,
                nonce: 0,
                value: tx.value || "0x0",
                data: abi.encode(tx)
            };
            if (tx.timeout) packaged.timeout = tx.timeout;
            if (tx.gasPrice && abi.number(tx.gasPrice) > 0) {
                packaged.gasPrice = tx.gasPrice;
                return this.getTxNonce(packaged, cb);
            }
            augur.rpc.gasPrice(function (gasPrice) {
                if (!gasPrice || gasPrice.error) {
                    return cb(errors.TRANSACTION_FAILED);
                }
                packaged.gasPrice = gasPrice;
                self.getTxNonce(packaged, cb);
            });
        },

        submitTx: function (packaged, cb) {
            var self = this;
            var mutex = locks.createMutex();
            mutex.lock(function () {
                for (var rawTxHash in augur.rpc.rawTxs) {
                    if (!augur.rpc.rawTxs.hasOwnProperty(rawTxHash)) continue;
                    if (augur.rpc.rawTxs[rawTxHash].nonce === packaged.nonce) {
                        ++packaged.nonce;
                        break;
                    }
                }
                mutex.unlock();
                var etx = new ethTx(packaged);

                // sign, validate, and send the transaction
                etx.sign(self.account.privateKey);

                // calculate the cost (in ether) of this transaction
                var cost = etx.getUpfrontCost().toString();

                // transaction validation
                if (!etx.validate()) return cb(errors.TRANSACTION_INVALID);

                // send the raw signed transaction to geth
                augur.rpc.sendRawTx(etx.serialize().toString("hex"), function (res) {
                    var err;
                    if (res) {
                        if (res.error) {
                            if (res.message.indexOf("rlp") > -1) {
                                err = clone(errors.RLP_ENCODING_ERROR);
                                err.bubble = res;
                                err.packaged = packaged;
                                return cb(err);
                            } else if (res.message.indexOf("Nonce too low") > -1 ||
                                res.message.indexOf("Known transaction") > -1) {
                                console.debug("bad nonce, retry", res.message);
                                return self.getTxNonce(packaged, cb);
                            } else {
                                err = clone(errors.RAW_TRANSACTION_ERROR);
                                err.bubble = res;
                                err.packaged = packaged;
                                return cb(err);
                            }
                        }

                        // res is the txhash if nothing failed immediately
                        // (even if the tx is nulled, still index the hash)
                        augur.rpc.rawTxs[res] = {
                            tx: packaged,
                            cost: new BigNumber(cost, 10).dividedBy(augur.rpc.ETHER).toFixed()
                        };

                        // nonce ok, execute callback
                        return cb(res);
                    }
                    cb(errors.TRANSACTION_FAILED);
                });
            });
        },

        // get nonce: number of transactions
        getTxNonce: function (packaged, cb) {
            var self = this;
            augur.rpc.pendingTxCount(self.account.address, function (txCount) {
                if (txCount && !txCount.error && !(txCount instanceof Error)) {
                    packaged.nonce = parseInt(txCount);
                }
                self.submitTx(packaged, cb);
            });
        }

    };
};
