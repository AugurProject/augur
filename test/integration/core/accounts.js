/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
var clone = require("clone");
var keys = require("keythereum");
var abi = require("augur-abi");
var utils = require("../../../src/utilities");
var constants = require("../../../src/constants");
var tools = require("../../tools");
var random = require("../../random");
var augur = tools.setup(require("../../../src"), process.argv.slice(2));

// generate random private key
var privateKey = crypto.randomBytes(32);
var address = keys.privateKeyToAddress(privateKey);

// generate random names and passwords
var name = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));

var loginID;
var generatedKeystore;

var name2 = utils.sha256(new Date().toString()).slice(10) + "@" +
    utils.sha256(new Date().toString()).slice(10) + ".com";
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);
var loginID2;

var numMarkets = parseInt(augur.getNumMarketsBranch(constants.DEFAULT_BRANCH_ID), 10);
var markets = augur.getSomeMarketsInBranch(constants.DEFAULT_BRANCH_ID, numMarkets - 100, numMarkets);
var market_id = markets[markets.length - 1];

function checkAccount(augur, account, noWebAccountCheck) {
  assert.notProperty(account, "error");
  assert.isString(account.address);
  assert.isObject(account.keystore);
  assert.strictEqual(account.address.length, 42);
  if (!noWebAccountCheck) {
    assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
    assert.isString(augur.accounts.account.address);
    assert.isObject(augur.accounts.account.keystore);
    assert.strictEqual(
      augur.accounts.account.privateKey.toString("hex").length,
      constants.KEYSIZE*2
    );
    assert.strictEqual(augur.accounts.account.address.length, 42);
    assert.strictEqual(account.address, augur.accounts.account.address);
    assert.strictEqual(
      JSON.stringify(account.keystore),
      JSON.stringify(augur.accounts.account.keystore)
    );
  }
  assert.strictEqual(account.address.length, 42);
}

before(function (done) {
  this.timeout(tools.TIMEOUT);
  augur.accounts.register(name, password, function (result) {
    loginID = result.loginID;
    augur.accounts.register(name2, password2, function (result) {
      loginID2 = result.loginID;
      done();
    });
  });
})

afterEach(function () { augur.accounts.logout(); });

describe("eth_call", function () {
  it("call getBranches using web.invoke", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    augur.accounts.login(loginID, password, function (user) {
      assert.notProperty(user, "error");
      assert.strictEqual(user.address, augur.accounts.account.address);

      // sync
      var tx = clone(augur.tx.Branches.getBranches);
      var branches = augur.accounts.invoke(tx);
      assert.notProperty(branches, "error");
      assert.isAbove(branches.length, 0);
      assert.isArray(branches);
      assert.strictEqual(
        abi.format_int256(branches[0]),
        abi.format_int256(augur.constants.DEFAULT_BRANCH_ID)
      );

      // async
      augur.accounts.invoke(tx, function (branches) {
        assert.notProperty(branches, "error");
        assert.isAbove(branches.length, 0);
        assert.isArray(branches);
        assert.strictEqual(
          abi.format_int256(branches[0]),
          abi.format_int256(augur.constants.DEFAULT_BRANCH_ID)
        );
        done();
      });
    });
  });
});

describe("Fund new account", function () {
  it("Address funding sequence", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    var sender = augur.from;
    augur.accounts.login(loginID, password, function (account) {
      // console.log("login:", account);
      checkAccount(augur, account);
      var recipient = account.address;
      var initial_balance = abi.fix(augur.rpc.balance(recipient));
      // console.log("initial balance:", initial_balance.toFixed());
      augur.accounts.fundNewAccountFromAddress(sender, 1, recipient, augur.constants.DEFAULT_BRANCH_ID,
        function (res) {
          assert.notProperty(res, "error");
        },
        function (response) {
          assert.notProperty(response, "error");
          assert.strictEqual(response.callReturn, "1");
          var final_balance = abi.fix(augur.rpc.balance(recipient));
            // console.log("final balance:", final_balance.toFixed());
          assert.isAbove(final_balance.toNumber(), 0);
          assert.isAbove(final_balance.minus(initial_balance).toNumber(), 0);
          augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, recipient, function (repBalance) {
            assert.notProperty(repBalance, "error");
            assert.strictEqual(abi.number(repBalance), 47);
            augur.getCashBalance(recipient, function (cashBalance) {
              assert.notProperty(cashBalance, "error");
              assert.strictEqual(parseInt(cashBalance), 10000);
              done();
            });
          });
        },
        done
      );
    });
  });
  it("Faucet funding sequence", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));

    // faucet only exists on network 2!
    if (augur.network_id !== "2") return done();

    augur.accounts.login(loginID2, password2, function (account) {
      // console.log("login:", account);
      checkAccount(augur, account);
      var recipient = account.address;
      var initial_balance = abi.unfix(augur.rpc.balance(recipient));
      // console.log("initial balance:", initial_balance.toFixed());
      augur.accounts.fundNewAccountFromFaucet(recipient, augur.constants.DEFAULT_BRANCH_ID,
        function (res) {
          assert.notProperty(res, "error");
        },
        function (response) {
          assert.notProperty(response, "error");
          assert.strictEqual(response.callReturn, "1");
          var final_balance = abi.unfix(augur.rpc.balance(recipient));
            // console.log("final balance:", final_balance.toFixed());
          assert.isAbove(final_balance.toNumber(), 0);
          assert.isAbove(final_balance.minus(initial_balance).toNumber(), 0);
          augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, recipient, function (repBalance) {
            assert.notProperty(repBalance, "error");
            assert.strictEqual(abi.number(repBalance), 47);
            augur.getCashBalance(recipient, function (cashBalance) {
              assert.notProperty(cashBalance, "error");
              assert.strictEqual(parseInt(cashBalance), 10000);
              done();
            });
          });
        },
        done
      );
    });
  });
});

describe("Send transaction", function () {
  it("detect logged in user and default to web.invoke", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    augur.accounts.login(loginID, password, function (user) {
      assert.notProperty(user, "error");
      assert.strictEqual(user.address, augur.accounts.account.address);
      augur.reputationFaucet({
        branch: augur.constants.DEFAULT_BRANCH_ID + "01",
        onSent: function (r) {
          // sent
          assert.property(r, "callReturn");
          assert.isObject(augur.rpc.rawTxs[r.txHash].tx);
          assert.isAbove(parseFloat(augur.rpc.rawTxs[r.txHash].cost), 0);
        },
        onSuccess: function (r) {
          // success
          assert.property(r, "callReturn");
          assert.property(r, "blockHash");
          assert.property(r, "blockNumber");
          assert.isAbove(parseInt(r.blockNumber), 0);
          assert.strictEqual(r.callReturn, "1");
          assert.strictEqual(r.from, user.address);
          assert.strictEqual(r.to, augur.contracts.Faucets);
          assert.strictEqual(Number(r.value), 0);
          assert.isObject(augur.rpc.rawTxs[r.hash].tx);
          assert.isAbove(parseFloat(augur.rpc.rawTxs[r.hash].cost), 0);
          assert.strictEqual(augur.rpc.txs[r.hash].status, "confirmed");
          done();
        },
        onFailed: done
      });
    });
  });
  it("sign and send transaction using account 1", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    augur.accounts.login(loginID, password, function (user) {
      assert.notProperty(user, "error");
      var tx = clone(augur.tx.Faucets.reputationFaucet);
      tx.params = augur.constants.DEFAULT_BRANCH_ID;
      augur.accounts.invoke(tx, function (txhash) {
        assert.notProperty(txhash, "error");
        assert(txhash);
        assert.isObject(augur.rpc.rawTxs[txhash].tx);
        assert.isAbove(parseFloat(augur.rpc.rawTxs[txhash].cost), 0);
        augur.rpc.getTx(txhash, function (confirmTx) {
          assert.notProperty(confirmTx, "error");
          assert(confirmTx.hash);
          assert(confirmTx.from);
          assert(confirmTx.to);
          assert.strictEqual(txhash, confirmTx.hash);
          assert.strictEqual(confirmTx.from, user.address);
          assert.strictEqual(confirmTx.to, tx.to);
          done();
        });
      });
    });
  });
});
describe("Concurrent transactions", function () {
  it("staggered", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    var connectParams = {
      http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
      ws: augur.rpc.wsUrl,
      ipc: null
    };
        // augur.rpc.debug.tx = true;
    augur.connect(connectParams, function (connection) {
      assert.deepEqual(connection, connectParams);
      var sender = augur.from;
      augur.accounts.register("", utils.sha256(Math.random().toString(36).substring(4)), function (user) {
        console.log("registered:", user);
        assert.notProperty(user, "error");
        assert.strictEqual(user.address, augur.accounts.account.address);
        augur.accounts.fundNewAccountFromAddress(sender, 1, user.address, augur.constants.DEFAULT_BRANCH_ID,
          function (r) {
            // console.log("fundNewAccountFromAddress sent:", r);
          },
          function (r) {
            console.log("fundNewAccountFromAddress success:", r.from, user.address, sender);
            var count = 0;
            var tx1 = clone(augur.tx.Faucets.reputationFaucet);
            var tx2 = clone(augur.tx.Faucets.fundNewAccount);
            tx1.params = [random.hash()];
            tx2.params = [random.hash()];
            var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
            tx1.nonce = txCount;
            tx2.nonce = txCount + 1;
            augur.transact(tx1, function (r) {
              console.log('tx1:', r);
              assert.property(r, "callReturn");
              augur.transact(tx2, function (r) {
                console.log('tx2:', r);
                assert.property(r, "callReturn");
              }, function (r) {
                console.log('tx1 ok:', r);
                ++count;
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.strictEqual(r.callReturn, "1");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, user.address);
                assert.strictEqual(r.to, augur.contracts.Faucets);
                assert.strictEqual(Number(r.value), 0);
                if (count === 2) done();
              }, function (err) {
                done(new Error(JSON.stringify(err)));
              });
            }, function (r) {
              console.log('tx2 ok:', r);
              ++count;
              assert.property(r, "callReturn");
              assert.property(r, "blockHash");
              assert.property(r, "blockNumber");
              assert.strictEqual(r.callReturn, "1");
              assert.isAbove(parseInt(r.blockNumber), 0);
              assert.strictEqual(r.from, user.address);
              assert.strictEqual(r.to, augur.contracts.Faucets);
              assert.strictEqual(Number(r.value), 0);
              if (count === 2) done();
            }, function (err) {
              done(new Error(JSON.stringify(err)));
            });
          },
          function (err) {
            done(new Error(JSON.stringify(err)));
          }
        );
      });
    });
  });
  it("simultaneous", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    var connectParams = {
      http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
      ws: augur.rpc.wsUrl,
      ipc: null
    };
    // augur.rpc.debug.tx = true;
    augur.connect(connectParams, function (connection) {
      assert.deepEqual(connection, connectParams);
      var sender = augur.from;
      augur.accounts.register("", utils.sha256(Math.random().toString(36).substring(4)), function (user) {
        console.log("registered:", user);
        assert.notProperty(user, "error");
        assert.strictEqual(user.address, augur.accounts.account.address);
        augur.accounts.fundNewAccountFromAddress(sender, 1, user.address, augur.constants.DEFAULT_BRANCH_ID,
          function (r) {
              // console.log("fundNewAccountFromAddress sent:", r);
          },
          function (r) {
            console.log("fundNewAccountFromAddress success:", r.from, user.address, sender);
            var count = 0;
            var tx1 = clone(augur.tx.Faucets.reputationFaucet);
            var tx2 = clone(augur.tx.Faucets.fundNewAccount);
            tx1.params = [random.hash()];
            tx2.params = [random.hash()];
            var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
            tx1.nonce = txCount;
            tx2.nonce = txCount + 1;
            augur.transact(tx1, function (r) {
              assert.property(r, "callReturn");
            }, function (r) {
              ++count;
              assert.property(r, "callReturn");
              assert.property(r, "blockHash");
              assert.property(r, "blockNumber");
              assert.strictEqual(r.callReturn, "1");
              assert.isAbove(parseInt(r.blockNumber), 0);
              assert.strictEqual(r.from, user.address);
              assert.strictEqual(r.to, augur.contracts.Faucets);
              assert.strictEqual(Number(r.value), 0);
              if (count === 2) done();
            }, function (err) {
              done(new Error(JSON.stringify(err)));
            });
            augur.transact(tx2, function (r) {
              assert.property(r, "callReturn");
            }, function (r) {
              ++count;
              assert.property(r, "callReturn");
              assert.property(r, "blockHash");
              assert.property(r, "blockNumber");
              assert.strictEqual(r.callReturn, "1");
              assert.isAbove(parseInt(r.blockNumber), 0);
              assert.strictEqual(r.from, user.address);
              assert.strictEqual(r.to, augur.contracts.Faucets);
              assert.strictEqual(Number(r.value), 0);
              if (count === 2) done();
            }, function (err) {
              done(new Error(JSON.stringify(err)));
            });
          },
          function (err) {
            done(new Error(JSON.stringify(err)));
          }
        );
      });
    });
  });
  it("duplicate nonce", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    var connectParams = {
      http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
      ws: augur.rpc.wsUrl,
      ipc: null
    };
    // augur.rpc.debug.tx = true;
    augur.connect(connectParams, function (connection) {
      assert.deepEqual(connection, connectParams);
      var sender = augur.from;
      augur.accounts.register("", utils.sha256(Math.random().toString(36).substring(4)), function (user) {
        console.log("registered:", user);
        assert.notProperty(user, "error");
        assert.strictEqual(user.address, augur.accounts.account.address);
        augur.accounts.fundNewAccountFromAddress(sender, 1, user.address, augur.constants.DEFAULT_BRANCH_ID,
          function (r) {
            // console.log("fundNewAccountFromAddress sent:", r);
          },
          function (r) {
            console.log("fundNewAccountFromAddress success:", r.from, user.address, sender);
            var count = 0;
            var tx1 = clone(augur.tx.Faucets.reputationFaucet);
            var tx2 = clone(augur.tx.Faucets.fundNewAccount);
            tx1.params = [random.hash()];
            tx2.params = [random.hash()];
            var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
            tx1.nonce = txCount;
            tx2.nonce = txCount;
            augur.transact(tx1, function (r) {
              assert.property(r, "callReturn");
            }, function (r) {
              ++count;
              assert.property(r, "callReturn");
              assert.property(r, "blockHash");
              assert.property(r, "blockNumber");
              assert.strictEqual(r.callReturn, "1");
              assert.isAbove(parseInt(r.blockNumber), 0);
              assert.strictEqual(r.from, user.address);
              assert.strictEqual(r.to, augur.contracts.Faucets);
              assert.strictEqual(Number(r.value), 0);
              if (count === 2) done();
            }, function (err) {
              done(new Error(JSON.stringify(err)));
            });
            augur.transact(tx2, function (r) {
              assert.property(r, "callReturn");
            }, function (r) {
              ++count;
              assert.property(r, "callReturn");
              assert.property(r, "blockHash");
              assert.property(r, "blockNumber");
              assert.strictEqual(r.callReturn, "1");
              assert.isAbove(parseInt(r.blockNumber), 0);
              assert.strictEqual(r.from, user.address);
              assert.strictEqual(r.to, augur.contracts.Faucets);
              assert.strictEqual(Number(r.value), 0);
              if (count === 2) done();
            }, function (err) {
              done(new Error(JSON.stringify(err)));
            });
          },
          function (err) {
            done(new Error(JSON.stringify(err)));
          }
        );
      });
    });
  });
  it("duplicate payload", function (done) {
    this.timeout(tools.TIMEOUT*2);
    var augur = tools.setup(tools.reset("../../../src/index"), process.argv.slice(2));
    var connectParams = {
      http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
      ws: augur.rpc.wsUrl,
      ipc: null
    };
    // augur.rpc.debug.tx = true;
    augur.connect(connectParams, function (connection) {
      assert.deepEqual(connection, connectParams);
      var sender = augur.from;
      augur.accounts.register("", utils.sha256(Math.random().toString(36).substring(4)), function (user) {
        console.log("registered:", user);
        assert.notProperty(user, "error");
        assert.strictEqual(user.address, augur.accounts.account.address);
        augur.accounts.fundNewAccountFromAddress(sender, 1, user.address, augur.constants.DEFAULT_BRANCH_ID,
          function (r) {
            // console.log("fundNewAccountFromAddress sent:", r);
          },
          function (r) {
            console.log("fundNewAccountFromAddress success:", r.from, user.address, sender);
            var count = 0;
            var branch = random.hash();
            augur.reputationFaucet({
              branch: branch,
              onSent: function (r) {
                ++count;
                assert.property(r, "callReturn");
              },
              onSuccess: function (r) {
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.strictEqual(r.callReturn, "1");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, user.address);
                assert.strictEqual(r.to, augur.contracts.Faucets);
                assert.strictEqual(Number(r.value), 0);
                if (count === 2) done();
              },
              onFailed: function (err) {
                if (++count === 2) {
                  assert.strictEqual(err.error, -32000);
                  assert.isAbove(err.message.indexOf("Known transaction"), -1);
                  return done();
                }
                done(new Error(JSON.stringify(err)));
              }
            });
            augur.reputationFaucet({
              branch: branch,
              onSent: function (r) {
                ++count;
                assert.property(r, "callReturn");
              },
              onSuccess: function (r) {
                assert.property(r, "callReturn");
                assert.property(r, "blockHash");
                assert.property(r, "blockNumber");
                assert.strictEqual(r.callReturn, "1");
                assert.isAbove(parseInt(r.blockNumber), 0);
                assert.strictEqual(r.from, user.address);
                assert.strictEqual(r.to, augur.contracts.Faucets);
                assert.strictEqual(Number(r.value), 0);
                if (count === 2) done();
              },
              onFailed: function (err) {
                if (++count === 2) {
                  assert.strictEqual(err.error, -32000);
                  assert.isAbove(err.message.indexOf("Known transaction"), -1);
                  return done();
                }
                done(new Error(JSON.stringify(err)));
              }
            });
          });
      },
        function (err) {
          done(new Error(JSON.stringify(err)));
        }
      );
    });
  });
});
