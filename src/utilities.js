"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var fs = require("fs");
var path = require("path");
var assert = (NODE_JS) ? require("assert") : console.assert;
var crypto = (NODE_JS) ? require("crypto") : require("crypto-browserify");
var BigNumber = require("bignumber.js");
var moment = require("moment");
var chalk = require("chalk");
var constants = require("./constants");
var numeric = require("./numeric");
var log = console.log;

module.exports = {

  // calculate date from block number
  block_to_date: function (augur, block) {
    var current_block = augur.blockNumber();
    var seconds = (block - current_block) * constants.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');
    return date;
  },

  // calculate block number from date
  date_to_block: function (augur, date) {
    date = moment(new Date(date));
    var current_block = augur.blockNumber();
    var now = moment();
    var seconds_delta = date.diff(now, 'seconds');
    var block_delta = parseInt(seconds_delta / constants.SECONDS_PER_BLOCK);
    return current_block + block_delta;
  },

  has_value: function (o, v) {
    for (var p in o) {
      if (o.hasOwnProperty(p)) {
        if (o[p] === v) return p;
      }
    }
  },

  setup: function (augur, args, rpcinfo) {
    var connected, gospel, contracts;
    if (NODE_JS && args && (args.indexOf("--gospel") > -1 || args.indexOf("--reset") > -1)) {
      gospel = path.join(__dirname, "..", "test", "gospel.json");
      log("Load contracts from file: " + chalk.green(gospel));
      contracts = fs.readFileSync(gospel);
      augur.contracts = JSON.parse(contracts.toString());
    }
    augur.options.BigNumberOnly = false;
    // augur.options.nodes = [
    //     "http://localhost:8545",
    //     "http://69.164.196.239:8545",
    //     "http://poc9.com:8545",
    //     "http://45.33.59.27:8545"
    // ];
    connected = (rpcinfo) ? augur.connect(rpcinfo) : augur.connect();
    if (connected) {
      log(chalk.magenta("augur"), "connected:", chalk.cyan(augur.options.RPC));
    }
    return augur;
  },

  reset: function (mod) {
    mod = path.join(__dirname, path.parse(mod).name);
    delete require.cache[require.resolve(mod)];
    return require(mod);
  },

  urlstring: function (obj) {
    return (obj.protocol || "http") + "://" + (obj.host || "127.0.0.1") + ":" + (obj.port || 8545);
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
  },

  wait: function (seconds) {
    var start, delay;
    start = new Date();
    delay = seconds * 1000;
    while ((new Date()) - start <= delay) {}
    return true;
  },

  get_test_accounts: function (augur, max_accounts) {
    var accounts;
    if (augur) {
      if (typeof augur === "object") {
        accounts = augur.accounts();
      } else if (typeof augur === "string") {
        accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
        for (var i = 0, len = accounts.length; i < len; ++i) {
          accounts[i] = numeric.prefix_hex(accounts[i]);
        }
      }
      if (max_accounts && accounts.length > max_accounts) {
        accounts = accounts.slice(0, max_accounts);
      }
      return accounts;
    }
  },

  get_balances: function (augur, account, branch) {
    if (augur) {
      branch = branch || augur.branches.dev;
      account = account || augur.coinbase;
      return {
        cash: augur.getCashBalance(account),
        reputation: augur.getRepBalance(branch || augur.branches.dev, account),
        ether: numeric.bignum(augur.balance(account)).dividedBy(constants.ETHER).toFixed()
      };
    }
  },

  read_ballots: function (augur, address, branch, period) {
    var ballot, num_events;
    log("Looking up ballots for", chalk.green(address));
    for (var i = 0; i < period; ++i) {
      ballot = augur.getReporterBallot(branch, i, address);
      if (ballot.length && ballot[0] !== undefined) {
        num_events = augur.getNumberEvents(branch, i);
        log("Period", chalk.cyan(i), "\t",
          chalk.green(numeric.fix(ballot.slice(0, num_events), "hex")));
      }
    }
  },

  chunk32: function (string, stride) {
    var elements, chunked, position;
    if (string.length >= 66) {
      stride = stride || 64;
      elements = Math.ceil(string.length / stride);
      chunked = new Array(elements);
      position = 0;
      for (var i = 0; i < elements; ++i) {
        chunked[i] = string.slice(position, position + stride);
        position += stride;
      }
      return chunked;
    } else {
      return string;
    }
  },

  sha256: function (x) {
    return crypto.createHash("sha256").update(x).digest("hex");
  },

  copy: function (obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },

  loop: function (list, iterator) {
    var n = list.length;
    var i = -1;
    var calls = 0;
    var looping = false;
    var iterate = function () {
      calls -= 1;
      i += 1;
      if (i === n) return;
      iterator(list[i], next);
    };
    var runloop = function () {
      if (looping) return;
      looping = true;
      while (calls > 0) iterate();
      looping = false;
    };
    var next = function () {
      calls += 1;
      if (typeof setTimeout === "undefined") runloop();
      else setTimeout(iterate, 1);
    };
    next();
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

  array_equal: function (a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    var a_length = a.length;
    if (a_length !== b.length) return false;
    for (var i = 0; i < a_length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  },

  check_results: function (res, expected, apply) {
    if (res) {
      if (apply) {
        if (res && res.constructor === Array) {
          assert(this.array_equal(apply(res), apply(expected)));
        } else {
          assert(apply(res) === apply(expected));
        }
      } else {
        if (res && res.constructor === Array) {
          assert(this.array_equal(res, expected));
        } else {
          assert(res === expected);
        }
      }
    } else {
      throw new Error("no or incorrect response: " + JSON.stringify(res));
    }
  },

  runtest: function (augur, tx, expected, apply) {
    if (tx && expected) {
      var res = augur.invoke(tx);
      this.check_results(res, expected, apply);
    }
  },

  test_invoke: function (augur, itx, expected, apply) {
    var tx = this.copy(itx);
    if (tx.send === undefined) {
      tx.send = false;
      this.runtest(augur, tx, expected, apply);
    } else {
      this.runtest(augur, tx, expected, apply);
    }
  }

};
