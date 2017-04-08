/**
 * Client-side accounts
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var async = require("async");
var keys = require("keythereum");
var uuid = require("uuid");
var clone = require("clone");
var request = (NODE_JS) ? require("request") : require("browser-request");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("./constants");
var utils = require("./utilities");

request = request.defaults({timeout: 999999});

keys.constants.pbkdf2.c = constants.ROUNDS;
keys.constants.scrypt.n = constants.ROUNDS;

module.exports = function () {

  var augur = this;
  return {

    // The account object is set when logged in
    account: {},

    // free (testnet) ether for new accounts on registration
    fundNewAccountFromFaucet: function (registeredAddress, branch, onSent, onSuccess, onFailed) {
      var onSentCallback, onSuccessCallback, onFailedCallback, url;
      onSentCallback = onSent || utils.noop;
      onSuccessCallback = onSuccess || utils.noop;
      onFailedCallback = onFailed || utils.noop;
      if (registeredAddress === undefined || registeredAddress === null || registeredAddress.constructor !== String) {
        return onFailed(registeredAddress);
      }
      url = constants.FAUCET + abi.format_address(registeredAddress);
      if (augur.options.debug.accounts) console.debug("fundNewAccountFromFaucet:", url);
      request(url, function (err, response, body) {
        if (augur.options.debug.accounts) {
          console.log("faucet err:", err);
          console.log("faucet response:", response);
          console.log("faucet body:", body);
        }
        if (err) return onFailed(err);
        if (response.statusCode !== 200) {
          return onFailed(response.statusCode);
        }
        if (augur.options.debug.accounts) console.debug("Sent ether to:", registeredAddress);
        augur.rpc.balance(registeredAddress, function (ethBalance) {
          var balance;
          if (augur.options.debug.accounts) console.debug("Balance:", ethBalance);
          balance = parseInt(ethBalance, 16);
          if (balance > 0) {
            augur.fundNewAccount({
              branch: branch || constants.DEFAULT_BRANCH_ID,
              onSent: onSentCallback,
              onSuccess: onSuccessCallback,
              onFailed: onFailedCallback
            });
          } else {
            async.until(function () {
              return balance > 0;
            }, function (callback) {
              augur.rpc.fastforward(1, function (nextBlock) {
                if (augur.options.debug.accounts) console.log("Block:", nextBlock);
                augur.rpc.balance(registeredAddress, function (ethBalance) {
                  if (augur.options.debug.accounts) console.debug("Balance:", ethBalance);
                  balance = parseInt(ethBalance, 16);
                  callback(null, balance);
                });
              });
            }, function (e) {
              if (e) console.error(e);
              augur.fundNewAccount({
                branch: branch || constants.DEFAULT_BRANCH_ID,
                onSent: onSentCallback,
                onSuccess: onSuccessCallback,
                onFailed: onFailedCallback
              });
            });
          }
        });
      });
    },

    fundNewAccountFromAddress: function (fromAddress, amount, registeredAddress, branch, onSent, onSuccess, onFailed) {
      var onSentCallback, onSuccessCallback, onFailedCallback;
      onSentCallback = onSent || utils.noop;
      onSuccessCallback = onSuccess || utils.noop;
      onFailedCallback = onFailed || utils.noop;
      augur.rpc.sendEther({
        to: registeredAddress,
        value: amount,
        from: fromAddress,
        onSent: utils.noop,
        onSuccess: function () {
          augur.fundNewAccount({
            branch: branch || constants.DEFAULT_BRANCH_ID,
            onSent: onSentCallback,
            onSuccess: onSuccessCallback,
            onFailed: onFailedCallback
          });
        },
        onFailed: onFailedCallback
      });
    },

    register: function (password, cb) {
      var callback, self = this;
      callback = (utils.is_function(cb)) ? cb : utils.pass;
      if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);

      // generate ECDSA private key and initialization vector
      keys.create(null, function (plain) {
        if (plain.error) return callback(plain);

        // derive secret key from password
        keys.deriveKey(password, plain.salt, {kdf: constants.KDF}, function (derivedKey) {
          var encryptedPrivateKey, address, kdfparams, keystore;
          if (derivedKey.error) return callback(derivedKey);
          encryptedPrivateKey = keys.encrypt(plain.privateKey, derivedKey.slice(0, 16), plain.iv).toString("hex");

          // encrypt private key using derived key and IV, then
          // store encrypted key & IV, indexed by handle
          address = abi.format_address(keys.privateKeyToAddress(plain.privateKey));
          kdfparams = {
            dklen: keys.constants[constants.KDF].dklen,
            salt: plain.salt.toString("hex")
          };
          if (constants.KDF === "scrypt") {
            kdfparams.n = keys.constants.scrypt.n;
            kdfparams.r = keys.constants.scrypt.r;
            kdfparams.p = keys.constants.scrypt.p;
          } else {
            kdfparams.c = keys.constants.pbkdf2.c;
            kdfparams.prf = keys.constants.pbkdf2.prf;
          }
          keystore = {
            address: address,
            crypto: {
              cipher: keys.constants.cipher,
              ciphertext: encryptedPrivateKey,
              cipherparams: {iv: plain.iv.toString("hex")},
              kdf: constants.KDF,
              kdfparams: kdfparams,
              mac: keys.getMAC(derivedKey, encryptedPrivateKey)
            },
            version: 3,
            id: uuid.v4()
          };

          // while logged in, account object is set
          self.account = {
            privateKey: plain.privateKey,
            address: address,
            keystore: keystore,
            derivedKey: derivedKey
          };

          return callback(clone(self.account));
        }); // deriveKey
      }); // create
    },

    importAccount: function (password, keystore, cb) {
      var callback, self = this;
      callback = (utils.is_function(cb)) ? cb : utils.pass;
      if (!password || password === "") return callback(errors.BAD_CREDENTIALS);
      keys.recover(password, keystore, function (privateKey) {
        var keystoreCrypto;
        if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
        keystoreCrypto = keystore.crypto || keystore.Crypto;
        keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {kdf: constants.KDF}, function (derivedKey) {
          self.account = {
            privateKey: privateKey,
            address: abi.format_address(keystore.address),
            keystore: keystore,
            derivedKey: derivedKey
          };
          return callback(clone(self.account));
        });
      });
    },

    setAccountObject: function (account) {
      var privateKey = account.privateKey;
      var derivedKey = account.derivedKey;
      if (privateKey && !Buffer.isBuffer(privateKey)) {
        privateKey = new Buffer(privateKey, "hex");
      }
      if (derivedKey && !Buffer.isBuffer(derivedKey)) {
        derivedKey = new Buffer(derivedKey, "hex");
      }
      this.account = {
        privateKey: privateKey,
        address: abi.format_address(account.keystore.address),
        keystore: account.keystore,
        derivedKey: derivedKey
      };
    },

    login: function (keystore, password, cb) {
      var keystoreCrypto, callback, self = this;
      callback = (utils.is_function(cb)) ? cb : utils.pass;
      if (!keystore || !password || password === "") return callback(errors.BAD_CREDENTIALS);
      keystoreCrypto = keystore.crypto || keystore.Crypto;

      // derive secret key from password
      keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {
        kdf: keystoreCrypto.kdf,
        kdfparams: keystoreCrypto.kdfparams,
        cipher: keystoreCrypto.kdf
      }, function (derivedKey) {
        var storedKey, privateKey, e;
        if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);

        // verify that message authentication codes match
        storedKey = keystoreCrypto.ciphertext;
        if (keys.getMAC(derivedKey, storedKey) !== keystoreCrypto.mac.toString("hex")) {
          return callback(errors.BAD_CREDENTIALS);
        }

        // decrypt stored private key using secret key
        try {
          privateKey = keys.decrypt(storedKey, derivedKey.slice(0, 16), keystoreCrypto.cipherparams.iv);

          // while logged in, account object is set
          self.account = {
            privateKey: privateKey,
            address: abi.format_address(keystore.address),
            keystore: keystore,
            derivedKey: derivedKey
          };
          return callback(clone(self.account));

          // decryption failure: bad password
        } catch (exc) {
          e = clone(errors.BAD_CREDENTIALS);
          e.bubble = exc;
          return callback(e);
        }
      }); // deriveKey
    },

    // user-supplied plaintext private key
    loginWithMasterKey: function (privateKey, cb) {
      var callback = (utils.is_function(cb)) ? cb : utils.pass;
      var privateKeyBuf = (Buffer.isBuffer(privateKey)) ? privateKey : new Buffer(privateKey, "hex");
      this.account = {
        address: abi.format_address(keys.privateKeyToAddress(privateKeyBuf)),
        privateKey: privateKeyBuf,
        derivedKey: new Buffer(abi.unfork(utils.sha256(privateKeyBuf)), "hex")
      };
      return callback(clone(this.account));
    },

    logout: function () {
      this.account = {};
      augur.rpc.clear();
    }
  };
};
