"use strict";

var displayedConnectionInfo = false;

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var async = require("async");
var chalk = require("chalk");
var clone = require("clone");
var constants = require("../src/constants");
var reptools = require("../src/modules/reporting");
var noop = require("../src/utils/noop");
var isFunction = require("../src/utils/is-function");
var path, madlibs;
try {
  path = require("path");
  madlibs = require("madlibs");
} catch (exc) {
  path = null;
  madlibs = require("./madlibs");
}

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

  // a function to quickly reset the callCounts object.
  clearCallCounts: function (callCounts) {
    var i, numKeys, keys = Object.keys(callCounts);
    for (i = 0, numKeys = keys.length; i < numKeys; ++i) {
      callCounts[keys[i]] = 0;
    }
  },

  print_residual: function (periodLength, label) {
    var t, residual;
    t = parseInt(new Date().getTime() / 1000, 10);
    periodLength = parseInt(periodLength, 10);
    residual = (t % periodLength) + "/" + periodLength + " (" + reptools.getCurrentPeriodProgress(periodLength) + "%)";
    if (label) console.log("\n" + chalk.blue.bold(label));
    console.log(chalk.white.dim(" - Residual:"), chalk.cyan.dim(residual));
  },

  print_reporting_status: function (augur, eventID, label) {
    var sender = augur.accounts.account.address || augur.from;
    var branch = augur.Events.getBranch(eventID);
    var periodLength = parseInt(augur.Branches.getPeriodLength(branch), 10);
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
    var unlocked, active, clientSideAccount, accounts, self = this;
    unlocked = [];
    active = augur.from;
    branch = branch || constants.DEFAULT_BRANCH_ID;
    accounts = clone(accountList);
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
                onSent: noop,
                onSuccess: function (r) {
                  if (r.callReturn !== "1") return next();
                  augur.setCash({
                    address: account,
                    balance: "10000000000",
                    onSent: noop,
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
    var branchDescription, tradingFee, accounts, sender, clientSideAccount, parentBranchRepBalance, self = this;
    branchDescription = "Branchy McBranchface [" + Math.random().toString(36).substring(4) + "]";
    tradingFee = "0.01";
    accounts = clone(accountList);
    if (this.DEBUG) {
      console.log(chalk.blue.bold("\nCreating new branch (periodLength=" + periodLength + ")"));
      console.log(chalk.white.dim("Account(s):"), chalk.green(accounts));
    }
    sender = augur.from;
    parentBranchRepBalance = augur.getRepBalance(parentBranchID, sender);
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
        var newBranchID;
        console.log("createBranch success:", res);
        newBranchID = res.branchID;
        if (self.DEBUG) console.log(chalk.white.dim("New branch ID:"), chalk.green(newBranchID));

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
    var binaryDescription, categoricalDescription, scalarDescription, streetName, action, city, resolution, tags, extraInfo, takerFee, makerFee, numCategories, categories, i, markets, active, clientSideAccount, self = this;

    // markets have matching descriptions, tags, fees, etc.
    branchID = branchID || augur.constants.DEFAULT_BRANCH_ID;
    binaryDescription = "Binary test market";
    categoricalDescription = "Categorical test market";
    scalarDescription = "Scalar test market";
    streetName = madlibs.streetName();
    action = madlibs.action();
    city = madlibs.city();
    resolution = "http://" + action + "." + madlibs.noun() + "." + madlibs.tld();
    tags = [streetName, action, city];
    extraInfo = streetName + " is a " + madlibs.adjective() + " " + madlibs.noun() + ".  " + madlibs.transportation() + " " + madlibs.usState() + " " + action + " and " + madlibs.noun() + "!";
    expDate = expDate || parseInt(new Date().getTime() / 995, 10);
    takerFee = "0.02";
    makerFee = "0.01";
    numCategories = 7;
    categories = new Array(numCategories);
    for (i = 1; i <= numCategories; ++i) {
      categories[i - 1] = "Outcome " + i.toString();
    }
    markets = {};

    // create a binary market
    console.log("New markets expire at:", expDate, parseInt(new Date().getTime() / 1000, 10), expDate - parseInt(new Date().getTime() / 1000, 10));
    active = augur.from;
    if (augur.accounts.account.address) {
      clientSideAccount = clone(augur.accounts.account);
      augur.accounts.account = {};
    }
    augur.createSingleEventMarket({
      branch: branchID,
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
      onSent: function () {

        // create a categorical market
        augur.createSingleEventMarket({
          branch: branchID,
          description: categoricalDescription + " [" + Math.random().toString(36).substring(4) + "]~|>" + categories.join("|"),
          expDate: expDate,
          minValue: 1,
          maxValue: numCategories,
          numOutcomes: numCategories,
          resolution: resolution,
          takerFee: takerFee,
          makerFee: makerFee,
          tags: tags,
          extraInfo: extraInfo,
          onSent: function () {

            // create a scalar market
            augur.createSingleEventMarket({
              branch: branchID,
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
              onSent: noop,
              onSuccess: function (res) {
                if (self.DEBUG) console.log("Scalar market ID:", res.callReturn);
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
            if (self.DEBUG) console.log("Categorical market ID:", res.callReturn);
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
        if (self.DEBUG) console.log("Binary market ID:", res.callReturn);
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
          onSent: noop,
          onSuccess: function () {
            if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Placing sell order");
            augur.sell({
              amount: amountPerMarket,
              price: "0.7",
              market: market,
              outcome: 2,
              onSent: noop,
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
      var trades;
      if (err) console.error("trade_in_each_market failed:", err);
      augur.useAccount(taker);
      trades = {};
      async.forEachOf(markets, function (market, type, nextMarket) {
        var marketTrades;
        if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Searching for trade...");
        marketTrades = augur.get_trade_ids(market, 0, 0);
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
        if (err) console.error("trade_in_each_market failed:", err);
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
              onCommitSent: noop,
              onCommitSuccess: function () {
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
          onSent: noop,
          onSuccess: function () {
            var price;
            if (self.DEBUG) self.print_residual(periodLength, "[" + type  + "] Placing sell order");
            price = (type === "scalar") ? "12.3" : "0.7";
            augur.sell({
              amount: amountPerMarket,
              price: price,
              market: market,
              outcome: 2,
              onSent: noop,
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
    var t = parseInt(new Date().getTime() / 1000, 10);
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
    var i, elements, chunked, position;
    if (string.length >= 66) {
      stride = stride || 64;
      if (offset) {
        elements = Math.ceil(string.slice(offset).length / stride) + 1;
      } else {
        elements = Math.ceil(string.length / stride);
      }
      chunked = new Array(elements);
      position = 0;
      for (i = 0; i < elements; ++i) {
        if (offset && i === 0) {
          chunked[i] = string.slice(position, position + offset);
          position += offset;
        } else {
          chunked[i] = string.slice(position, position + stride);
          position += stride;
        }
      }
    } else {
      chunked = string;
    }
    return chunked;
  },

  pp: function (obj, indent) {
    var k, o = clone(obj);
    for (k in o) {
      if (o.hasOwnProperty(k)) {
        if (typeof o[k] === "function") {
          o[k] = o[k].toString();
          if (o[k].length > 64) {
            o[k] = o[k].match(/function (\w*)/).slice(0, 1).join("");
          }
        }
      }
    }
    return chalk.green(JSON.stringify(o, null, indent || 4));
  },

  display_connection_info: function (augur) {
    if ((!require.main && !displayedConnectionInfo) || augur.options.debug.connect) {
      console.log(chalk.cyan.bold("sync:   "), chalk.cyan(augur.rpc.internalState.transporter.internalState.syncTransport.address));
      console.log(chalk.yellow.bold("network: "), chalk.yellow(augur.network_id));
      console.log(chalk.bold("coinbase:"), chalk.white.dim(augur.coinbase));
      console.log(chalk.bold("from:    "), chalk.white.dim(augur.from));
      displayedConnectionInfo = true;
    }
  },

  setup: function (Augur, callback) {
    var self = this;
    var augur = new Augur();
    var connectParams = {
      http: "http://127.0.0.1:8545",
      noFallback: true
    };
    if (typeof callback !== "function") {
      if (augur.connect(connectParams)) this.display_connection_info(augur);
      return augur;
    }
    augur.connect(connectParams, function (isConnected) {
      if (isConnected) self.display_connection_info(augur);
      callback(augur);
    });
  },

  reset: function (mod) {
    mod = path.join(__dirname, "..", "src", path.parse(mod).name);
    delete require.cache[require.resolve(mod)];
    return require(mod);
  },

  get_test_accounts: function (augur, max_accounts) {
    var accounts, i, len;
    if (augur) {
      if (typeof augur === "object") {
        accounts = augur.rpc.accounts();
      } else if (typeof augur === "string") {
        accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
        for (i = 0, len = accounts.length; i < len; ++i) {
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
    while ((new Date()) - start <= delay) {} // eslint-disable-line no-empty
    return true;
  },

  get_balances: function (augur, account, branch) {
    if (augur) {
      branch = branch || augur.constants.DEFAULT_BRANCH_ID;
      account = account || augur.coinbase;
      return {
        cash: augur.Cash.balance(account),
        reputation: augur.getRepBalance(branch || augur.constants.DEFAULT_BRANCH_ID, account),
        ether: abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toFixed()
      };
    }
  },

  copy: function (obj) {
    var attr, copy;
    if (null === obj || "object" !== typeof obj) return obj;
    copy = obj.constructor();
    for (attr in obj) {
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
    var p;
    for (p in o) {
      if (o.hasOwnProperty(p)) {
        if (o[p] === v) return p;
      }
    }
  },

  select_random: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  gteq0: function (n) { return (new BigNumber(n)).toNumber() >= 0; },

  // Make sure current period = expiration period + periodGap
  // If not, wait until it is:
  // expPeriod - currentPeriod periods
  // t % periodLength seconds
  checkTime: function (augur, branch, event, periodLength, periodGap, callback) {
    var self = this;
    if (!callback && isFunction(periodGap)) {
      callback = periodGap;
      periodGap = null;
    }
    periodGap = periodGap || 1;
    function wait(branch, secondsToWait, next) {
      if (augur.options.debug.reporting) {
        console.log("Waiting", secondsToWait / 60, "minutes...");
      }
      setTimeout(function () {
        augur.Consensus.incrementPeriodAfterReporting({
          branch: branch,
          onSent: noop,
          onSuccess: function (r) {
            if (augur.options.debug.reporting) {
              console.log("Incremented period:", r.callReturn);
            }
            augur.getVotePeriod(branch, function (votePeriod) {
              next(null, votePeriod);
            });
          },
          onFailed: next
        });
      }, secondsToWait*1000);
    }
    augur.getExpiration(event, function (expTime) {
      var expPeriod, currentPeriod, fullPeriodsToWait, secondsToWait;
      expPeriod = Math.floor(expTime / periodLength);
      currentPeriod = augur.getCurrentPeriod(periodLength);
      if (augur.options.debug.reporting) {
        console.log("\nreporting.checkTime:");
        console.log(" - Expiration period:", expPeriod);
        console.log(" - Current period:   ", currentPeriod);
        console.log(" - Target period:    ", expPeriod + periodGap);
      }
      if (currentPeriod < expPeriod + periodGap) {
        fullPeriodsToWait = expPeriod - augur.getCurrentPeriod(periodLength) + periodGap - 1;
        if (augur.options.debug.reporting) {
          console.log("Full periods to wait:", fullPeriodsToWait);
        }
        secondsToWait = periodLength;
        if (fullPeriodsToWait === 0) {
          secondsToWait -= (parseInt(new Date().getTime() / 1000, 10) % periodLength);
        }
        if (augur.options.debug.reporting) {
          console.log("Seconds to wait:", secondsToWait);
        }
        wait(branch, secondsToWait, function (err, votePeriod) {
          if (err) return callback(err);
          if (augur.options.debug.reporting) {
            console.log("New vote period:", votePeriod);
          }
          self.checkTime(augur, branch, event, periodLength, callback);
        });
      } else {
        callback(null);
      }
    });
  }
};
