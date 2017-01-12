"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var async = require("async");
var chalk = require("chalk");
var clone = require("clone");
var path, madlibs;
try {
  path = require("path");
  madlibs = require("madlibs");
} catch (exc) {
  path = null;
  madlibs = require("./madlibs");
}
var constants = require("../src/constants");
var utils = require("../src/utilities");
var reptools = require("../src/modules/reporting");

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

var displayed_connection_info = false;

module.exports = {

  DEBUG: true,

  // maximum number of accounts/samples for testing
  MAX_TEST_ACCOUNTS: 3,
  UNIT_TEST_SAMPLES: 100,
  MAX_TEST_SAMPLES: 10,

  // unit test timeout
  TIMEOUT: 600000,

  // approximately equals threshold
  EPSILON: 1e-6,

  print_residual: function (periodLength, label) {
    var t = parseInt(new Date().getTime() / 1000);
    periodLength = parseInt(periodLength);
    var residual = (t % periodLength) + "/" + periodLength + " (" + reptools.getCurrentPeriodProgress(periodLength) + "%)";
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Residual:"), chalk.cyan.dim(residual));
  },

  print_reporting_status: function (augur, eventID, label) {
    var sender = augur.accounts.account.address || augur.from;
    var branch = augur.Events.getBranch(eventID);
    var periodLength = parseInt(augur.Branches.getPeriodLength(branch));
    var redistributed = augur.ConsensusData.getRepRedistributionDone(branch, sender);
    var votePeriod = augur.Branches.getVotePeriod(branch);
    var lastPeriodPenalized = augur.ConsensusData.getPenalizedUpTo(branch, sender);
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Vote period:          "), chalk.blue(votePeriod));
    console.log(chalk.white.dim(" - Expiration period:    "), chalk.blue(Math.floor(augur.getExpiration(eventID) / periodLength)));
    console.log(chalk.white.dim(" - Current period:       "), chalk.blue(reptools.getCurrentPeriod(periodLength)));
    console.log(chalk.white.dim(" - Last period:          "), chalk.blue(votePeriod - 1));
    console.log(chalk.white.dim(" - Last period penalized:"), chalk.blue(lastPeriodPenalized));
    console.log(chalk.white.dim(" - Rep redistribution:   "), chalk.cyan.dim(redistributed));
    this.print_residual(periodLength);
  },

  top_up: function (augur, branch, accountList, password, callback) {
    var unlocked = [];
    var self = this;
    var active = augur.from;
    branch = branch || constants.DEFAULT_BRANCH_ID;
    var clientSideAccount;
    var accounts = clone(accountList);
    if (augur.accounts.account.address) {
      accounts = [augur.accounts.account.address].concat(accounts);
    }
    async.eachSeries(accounts, function (account, nextAccount) {
      augur.rpc.personal("unlockAccount", [account, password], function (res) {
        if (res && res.error) {
          console.warn("Couldn't unlock account:", account);
          return nextAccount();
        }
        if (self.DEBUG) console.log(chalk.white.dim("Unlocked account:"), chalk.green(account));
        augur.Cash.balance(account, function (cashBalance) {
          augur.Reporting.getRepBalance({
            branch: branch,
            address: account,
            callback: function (repBalance) {
              function next() {
                if (augur.accounts.account.address) {
                  clientSideAccount = clone(augur.accounts.account);
                  augur.accounts.account = {};
                }
                nextAccount();
              }
              if (!augur.accounts.account.address) {
                augur.useAccount(account);
              }
              if (parseFloat(cashBalance) >= 10000000000 && parseFloat(repBalance) >= 47) {
                if (augur.accounts.account.address) {
                  clientSideAccount = clone(augur.accounts.account);
                  augur.accounts.account = {};
                } else {
                  unlocked.push(account);
                }
                return next();
              }
              augur.fundNewAccount({
                branch: branch,
                onSent: utils.noop,
                onSuccess: function (r) {
                  if (r.callReturn !== "1") return next();
                  augur.setCash({
                    address: account,
                    balance: "10000000000",
                    onSent: utils.noop,
                    onSuccess: function (r) {
                      if (r.callReturn === "1" && !augur.accounts.account.address) {
                        unlocked.push(account);
                      }
                      next();
                    },
                    onFailed: function () { next(); }
                  });
                },
                onFailed: function () { next(); }
              });
            }
          });
        });
      });
    }, function (err) {
      if (clientSideAccount) {
        augur.accounts.account = clientSideAccount;
      }
      augur.useAccount(active);
      if (err) return callback(err);
      callback(null, unlocked);
    });
  },

  // Create a new branch and get Reputation on it
  setup_new_branch: function (augur, periodLength, parentBranchID, accountList, callback) {
    var self = this;
    var branchDescription = "Branchy McBranchface [" + Math.random().toString(36).substring(4) + "]";
    var tradingFee = "0.01";
    var accounts = clone(accountList);
    if (this.DEBUG) {
      console.log(chalk.blue.bold("\nCreating new branch (periodLength=" + periodLength + ")"));
      console.log(chalk.white.dim("Account(s):"), chalk.green(accounts));
    }
    var sender = augur.from;
    var clientSideAccount;
    var parentBranchRepBalance = augur.getRepBalance(parentBranchID, sender);
    console.log("from:", sender);
    console.log("web.account.address:", augur.accounts.account.address);
    console.log("parent branch ID:", parentBranchID);
    console.log("parent branch rep balance:", parentBranchRepBalance);
    augur.createBranch({
      description: branchDescription,
      periodLength: periodLength,
      parent: parentBranchID,
      minTradingFee: tradingFee,
      oracleOnly: 0,
      onSent: function (res) {
        console.log("createBranch sent:", res);
      },
      onSuccess: function (res) {
        console.log("createBranch success:", res);
        var newBranchID = res.branchID;
        if (self.DEBUG) console.log(chalk.white.dim("New branch ID:"), chalk.green(newBranchID));
        var block = augur.rpc.getBlock(res.blockNumber);

                // get reputation on the new branch
        if (augur.accounts.account.address) {
          accounts = [augur.accounts.account.address].concat(accounts);
        }
        async.each(accounts, function (account, nextAccount) {
          if (self.DEBUG) console.log(chalk.white.dim("Funding account:"), chalk.green(account));
          function next() {
            if (augur.accounts.account.address) {
              clientSideAccount = clone(augur.accounts.account);
              augur.accounts.account = {};
            }
            nextAccount();
          }
          if (account !== augur.accounts.account.address) {
            augur.useAccount(account);
          }
          augur.fundNewAccount({
            branch: newBranchID,
            onSent: function () {},
            onSuccess: function () {
              nextAccount();
            },
            onFailed: next
          });
        }, function (err) {
          if (clientSideAccount) {
            augur.accounts.account = clientSideAccount;
          }
          augur.useAccount(sender);
          if (err) return callback(err);
          callback(null, newBranchID);
        });
      },
      onFailed: function (err) {
        if (clientSideAccount) {
          augur.accounts.account = clientSideAccount;
        }
        augur.useAccount(sender);
        callback(err);
      }
    });
  },

  is_created: function (markets) {
    return markets.scalar && markets.categorical && markets.binary;
  },

  create_each_market_type: function (augur, branchID, expDate, callback) {
    var self = this;

    // markets have matching descriptions, tags, fees, etc.
    branchID = branchID || augur.constants.DEFAULT_BRANCH_ID;
    var binaryDescription = "Binary test market";
    var categoricalDescription = "Categorical test market";
    var scalarDescription = "Scalar test market";
    var streetName = madlibs.streetName();
    var action = madlibs.action();
    var city = madlibs.city();
    var resolution = "http://" + action + "." + madlibs.noun() + "." + madlibs.tld();
    var tags = [streetName, action, city];
    var extraInfo = streetName + " is a " + madlibs.adjective() + " " + madlibs.noun() + ".  " + madlibs.transportation() + " " + madlibs.usState() + " " + action + " and " + madlibs.noun() + "!";
    expDate = expDate || parseInt(new Date().getTime() / 995, 10);
    var takerFee = "0.02";
    var makerFee = "0.01";
    var numCategories = 7;
    var categories = new Array(numCategories);
    for (var i = 1; i <= numCategories; ++i) {
      categories[i - 1] = "Outcome " + i.toString();
    }
    console.log('creating categories:', categories);
    var markets = {};

    // create a binary market
    console.debug('New markets expire at:', expDate, parseInt(new Date().getTime() / 1000, 10), expDate - parseInt(new Date().getTime() / 1000, 10));
    var active = augur.from;
    var clientSideAccount;
    if (augur.accounts.account.address) {
      clientSideAccount = clone(augur.accounts.account);
      augur.accounts.account = {};
    }
    augur.createSingleEventMarket({
      branchId: branchID,
      description: binaryDescription + " [" + Math.random().toString(36).substring(4) + "]",
      expDate: expDate,
      minValue: 1,
      maxValue: 2,
      numOutcomes: 2,
      resolution: resolution,
      takerFee: takerFee,
      makerFee: makerFee,
      tags: tags,
      extraInfo: extraInfo,
      onSent: function (res) {

        // create a categorical market
        augur.createSingleEventMarket({
          branchId: branchID,
          description: categoricalDescription + " [" + Math.random().toString(36).substring(4) + "]~|>" + categories.join('|'),
          expDate: expDate,
          minValue: 1,
          maxValue: numCategories,
          numOutcomes: numCategories,
          resolution: resolution,
          takerFee: takerFee,
          makerFee: makerFee,
          tags: tags,
          extraInfo: extraInfo,
          onSent: function (res) {

            // create a scalar market
            augur.createSingleEventMarket({
              branchId: branchID,
              description: scalarDescription + " [" + Math.random().toString(36).substring(4) + "]",
              expDate: expDate,
              minValue: -5,
              maxValue: 20,
              numOutcomes: 2,
              resolution: resolution,
              takerFee: takerFee,
              makerFee: makerFee,
              tags: tags,
              extraInfo: extraInfo,
              onSent: function () {},
              onSuccess: function (res) {
                if (self.DEBUG) console.debug("Scalar market ID:", res.callReturn);
                markets.scalar = res.callReturn;
                if (self.is_created(markets)) {
                  if (clientSideAccount) {
                    augur.accounts.account = clientSideAccount;
                  }
                  augur.useAccount(active);
                  callback(null, markets);
                }
              },
              onFailed: function (err) {
                if (self.DEBUG) console.error("Scalar createSingleEventMarket failed:", err);
                callback(new Error(self.pp(err)));
              }
            });
          },
          onSuccess: function (res) {
            if (self.DEBUG) console.debug("Categorical market ID:", res.callReturn);
            markets.categorical = res.callReturn;
            if (self.is_created(markets)) {
              if (clientSideAccount) {
                augur.accounts.account = clientSideAccount;
              }
              augur.useAccount(active);
              callback(null, markets);
            }
          },
          onFailed: function (err) {
            if (self.DEBUG) console.error("Categorical createSingleEventMarket failed:", err);
            callback(new Error(self.pp(err)));
          }
        });
      },
      onSuccess: function (res) {
        if (self.DEBUG) console.debug("Binary market ID:", res.callReturn);
        markets.binary = res.callReturn;
        if (self.is_created(markets)) {
          if (clientSideAccount) {
            augur.accounts.account = clientSideAccount;
          }
          augur.useAccount(active);
          callback(null, markets);
        }
      },
      onFailed: function (err) {
        if (self.DEBUG) console.error("Binary createSingleEventMarket failed:", err);
        callback(new Error(self.pp(err)));
      }
    });
  },

  trade_in_each_market: function (augur, amountPerMarket, markets, maker, taker, password, callback) {
    var self = this;
    var branch = augur.getBranchID(markets[Object.keys(markets)[0]]);
    var periodLength = augur.getPeriodLength(branch);
    var active = augur.from;
    var clientSideAccount;
    if (augur.accounts.account.address) {
      clientSideAccount = clone(augur.accounts.account);
      augur.accounts.account = {};
    }
    if (this.DEBUG) {
      console.log(chalk.blue.bold("\nTrading in each market..."));
      console.log(chalk.white.dim("Maker:"), chalk.green(maker));
      console.log(chalk.white.dim("Taker:"), chalk.green(taker));
    }
    async.forEachOf(markets, function (market, type, nextMarket) {
      augur.rpc.personal("unlockAccount", [maker, password], function (unlocked) {
        if (unlocked && unlocked.error) return nextMarket(unlocked);
        augur.useAccount(maker);
        if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Buying complete set");
        augur.buyCompleteSets({
          market: market,
          amount: amountPerMarket,
          onSent: function (r) {
          },
          onSuccess: function (r) {
            if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Placing sell order");
            augur.sell({
              amount: amountPerMarket,
              price: "0.7",
              market: market,
              outcome: 2,
              onSent: function () {},
              onSuccess: function () {
                nextMarket(null);
              },
              onFailed: nextMarket
            });
          },
          onFailed: nextMarket
        });
      });
    }, function (err) {
      augur.useAccount(taker);
      var trades = {};
      async.forEachOf(markets, function (market, type, nextMarket) {
        if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Searching for trade...");
        var marketTrades = augur.get_trade_ids(market);
        if (!marketTrades || !marketTrades.length) {
          return nextMarket("no trades found for " + market);
        }
        async.eachSeries(marketTrades, function (thisTrade, nextTrade) {
          var tradeInfo = augur.get_trade(thisTrade);
          if (!tradeInfo) return nextTrade("no trade info found");
          if (tradeInfo.owner === taker) return nextTrade(null);
          if (tradeInfo.type === "buy") return nextTrade(null);
          if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Trading");
          nextTrade(thisTrade);
        }, function (trade) {
          trades[type] = trade;
          nextMarket(null);
        });
      }, function (err) {
        if (self.DEBUG) console.log(chalk.white.dim("Trade IDs:"), trades);
        augur.rpc.personal("unlockAccount", [taker, password], function (unlocked) {
          if (unlocked && unlocked.error) return callback(unlocked);
          async.forEachOfSeries(markets, function (market, type, nextMarket) {
            augur.trade({
              max_value: amountPerMarket / 2,
              max_amount: 0,
              trade_ids: [trades[type]],
              sender: taker,
              onTradeHash: function (tradeHash) {
                if (self.DEBUG) {
                  self.print_residual(periodLength, "Trade hash: " + tradeHash);
                }
              },
              onCommitSent: function () {},
              onCommitSuccess: function (r) {
                if (self.DEBUG) self.print_residual(periodLength, "Trade committed");
              },
              onCommitFailed: function (e) {
                if (clientSideAccount) {
                  augur.accounts.account = clientSideAccount;
                }
                augur.useAccount(active);
                nextMarket(e);
              },
              onNextBlock: function (block) {
                if (self.DEBUG) self.print_residual(periodLength, "Got block " + block);
              },
              onTradeSent: function () {},
              onTradeSuccess: function (r) {
                if (self.DEBUG) {
                  self.print_residual(periodLength, "Trade complete: " + JSON.stringify(r, null, 2));
                }
                if (clientSideAccount) {
                  augur.accounts.account = clientSideAccount;
                }
                augur.useAccount(active);
                nextMarket(null);
              },
              onTradeFailed: function (e) {
                if (clientSideAccount) {
                  augur.accounts.account = clientSideAccount;
                }
                augur.useAccount(active);
                nextMarket(e);
              }
            });
          }, callback);
        });
      });
    });
  },

  make_order_in_each_market: function (augur, amountPerMarket, markets, maker, taker, password, callback) {
    var self = this;
    var branch = augur.getBranchID(markets[Object.keys(markets)[0]]);
    var periodLength = augur.getPeriodLength(branch);
    var active = augur.from;
    var clientSideAccount;
    if (augur.accounts.account.address) {
      clientSideAccount = clone(augur.accounts.account);
      augur.accounts.account = {};
    }
    if (this.DEBUG) {
      console.log(chalk.blue.bold("\nTrading in each market..."));
      console.log(chalk.white.dim("Maker:"), chalk.green(maker));
      console.log(chalk.white.dim("Taker:"), chalk.green(taker));
    }
    async.forEachOf(markets, function (market, type, nextMarket) {
      augur.rpc.personal("unlockAccount", [maker, password], function (unlocked) {
        if (unlocked && unlocked.error) return nextMarket(unlocked);
        augur.useAccount(maker);
        if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Buying complete set");
        augur.buyCompleteSets({
          market: market,
          amount: amountPerMarket,
          onSent: function () {},
          onSuccess: function (r) {
            if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Placing sell order");
            var price = (type === "scalar") ? "12.3" : "0.7";
            augur.sell({
              amount: amountPerMarket,
              price: price,
              market: market,
              outcome: 2,
              onSent: function () {},
              onSuccess: function () {
                nextMarket(null);
              },
              onFailed: nextMarket
            });
          },
          onFailed: nextMarket
        });
      });
    }, function (err) {
      if (clientSideAccount) {
        augur.accounts.account = clientSideAccount;
      }
      augur.useAccount(active);
      callback(err);
    });
  },

  wait_until_expiration: function (augur, eventID, callback) {
    var periodLength = augur.getPeriodLength(augur.getBranch(eventID));
    var t = parseInt(new Date().getTime() / 1000);
    var currentPeriod = augur.getCurrentPeriod(periodLength);
    var expirationPeriod = Math.floor(augur.getExpiration(eventID) / periodLength);
    var periodsToGo = expirationPeriod - currentPeriod;
    var secondsToGo = periodsToGo*periodLength + periodLength - (t % periodLength);
    if (this.DEBUG) {
      this.print_reporting_status(augur, eventID, "Waiting until period after new events expire...");
      console.log(chalk.white.dim(" - Periods to go:"), chalk.cyan.dim(periodsToGo + " + " + (periodLength - (t % periodLength)) + "/" + periodLength + " (" + (100 - augur.getCurrentPeriodProgress(periodLength)) + "%)"));
      console.log(chalk.white.dim(" - Minutes to go:"), chalk.cyan.dim(secondsToGo / 60));
    }
    setTimeout(function () { callback(null); }, secondsToGo*1000);
  },

  chunk32: function (string, stride, offset) {
    var elements, chunked, position;
    if (string.length >= 66) {
      stride = stride || 64;
      if (offset) {
        elements = Math.ceil(string.slice(offset).length / stride) + 1;
      } else {
        elements = Math.ceil(string.length / stride);
      }
      chunked = new Array(elements);
      position = 0;
      for (var i = 0; i < elements; ++i) {
        if (offset && i === 0) {
          chunked[i] = string.slice(position, position + offset);
          position += offset;
        } else {
          chunked[i] = string.slice(position, position + stride);
          position += stride;
        }
      }
      return chunked;
    } else {
      return string;
    }
  },

  pp: function (obj, indent) {
    var o = clone(obj);
    for (var k in o) {
      if (!o.hasOwnProperty(k)) continue;
      if (o[k] && o[k].constructor === Function) {
        o[k] = o[k].toString();
        if (o[k].length > 64) {
          o[k] = o[k].match(/function (\w*)/).slice(0, 1).join('');
        }
      }
    }
    return chalk.green(JSON.stringify(o, null, indent || 4));
  },

  print_nodes: function (nodes) {
    var node;
    if (nodes && nodes.length) {
      process.stdout.write(chalk.green.bold("hosted:   "));
      for (var i = 0, len = nodes.length; i < len; ++i) {
        node = nodes[i];
        node = (i === 0) ? chalk.green(node) : chalk.gray(node);
        process.stdout.write(node + ' ');
        if (i === len - 1) process.stdout.write('\n');
      }
    }
  },

  setup: function (augur, args, rpcinfo) {
    var defaulthost, ipcpath, wsUrl;
    if (NODE_JS) {
      defaulthost = process.env.GETH_HTTP || "http://127.0.0.1:8545";
      ipcpath = process.env.GETH_IPC;
      wsUrl = process.env.GETH_WS || "ws://127.0.0.1:8546";
    }
    if (process.env.CONTINUOUS_INTEGRATION) {
      this.TIMEOUT = 131072;
    }
    augur.rpc.retryDroppedTxs = true;
    augur.rpc.debug.broadcast = process.env.NODE_ENV === "development";
    if (defaulthost) augur.rpc.setLocalNode(defaulthost);
    if (augur.connect({http: rpcinfo || defaulthost, ipc: ipcpath, ws: wsUrl})) {
      if ((!require.main && !displayed_connection_info) || augur.options.debug.connect) {
        console.log(chalk.cyan.bold("local:   "), chalk.cyan(augur.rpc.nodes.local));
        console.log(chalk.blue.bold("ws:      "), chalk.blue(augur.rpc.wsUrl));
        console.log(chalk.magenta.bold("ipc:     "), chalk.magenta(augur.rpc.ipcpath));
        this.print_nodes(augur.rpc.nodes.hosted);
        console.log(chalk.yellow.bold("network: "), chalk.yellow(augur.network_id));
        console.log(chalk.bold("coinbase:"), chalk.white.dim(augur.coinbase));
        console.log(chalk.bold("from:    "), chalk.white.dim(augur.from));
        displayed_connection_info = true;
      }
      augur.rpc.clear();
    }
    return augur;
  },

  reset: function (mod) {
    mod = path.join(__dirname, "..", "src", path.parse(mod).name);
    delete require.cache[require.resolve(mod)];
    return require(mod);
  },

  get_test_accounts: function (augur, max_accounts) {
    var accounts;
    if (augur) {
      if (typeof augur === "object") {
        accounts = augur.rpc.accounts();
      } else if (typeof augur === "string") {
        accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
        for (var i = 0, len = accounts.length; i < len; ++i) {
          accounts[i] = abi.prefix_hex(accounts[i]);
        }
      }
      if (max_accounts && accounts && accounts.length > max_accounts) {
        accounts = accounts.slice(0, max_accounts);
      }
      return accounts;
    }
  },

  wait: function (seconds) {
    var start, delay;
    start = new Date();
    delay = seconds * 1000;
    while ((new Date()) - start <= delay) {}
    return true;
  },

  get_balances: function (augur, account, branch) {
    if (augur) {
      branch = branch || augur.constants.DEFAULT_BRANCH_ID;
      account = account || augur.coinbase;
      return {
        cash: augur.getCashBalance(account),
        reputation: augur.getRepBalance(branch || augur.constants.DEFAULT_BRANCH_ID, account),
        ether: abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toFixed()
      };
    }
  },

  copy: function (obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },

  remove_duplicates: function (arr) {
    return arr.filter(function (element, position, array) {
      return array.indexOf(element) === position;
    });
  },

  has_value: function (o, v) {
    for (var p in o) {
      if (o.hasOwnProperty(p)) {
        if (o[p] === v) return p;
      }
    }
  },

  linspace: function (a, b, n) {
    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
    if (n < 2) return (n === 1) ? [a] : [];
    var i, ret = new Array(n);
    n--;
    for (i = n; i >= 0; i--) {
      ret[i] = (i*b + (n - i)*a) / n;
    }
    return ret;
  },

  select_random: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  fold: function (arr, num_cols) {
    var i, j, folded, num_rows, row;
    folded = [];
    num_cols = parseInt(num_cols);
    num_rows = arr.length / num_cols;
    num_rows = parseInt(num_rows);
    for (i = 0; i < parseInt(num_rows); ++i) {
      row = [];
      for (j = 0; j < num_cols; ++j) {
        row.push(arr[i*num_cols + j]);
      }
      folded.push(row);
    }
    return folded;
  },

  gteq0: function (n) { return (new BigNumber(n)).toNumber() >= 0; },

  print_matrix: function (m) {
    for (var i = 0, rows = m.length; i < rows; ++i) {
      process.stdout.write("\t");
      for (var j = 0, cols = m[0].length; j < cols; ++j) {
        process.stdout.write(chalk.cyan(m[i][j] + "\t"));
      }
      process.stdout.write("\n");
    }
  }

};
