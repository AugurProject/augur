"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var fs = (NODE_JS) ? require("fs") : null;
var path = (NODE_JS) ? require("path") : null;
var assert = (NODE_JS) ? require("assert") : console.assert;
var crypto = (NODE_JS) ? require("crypto") : require("crypto-browserify");
var BigNumber = require("bignumber.js");
var validator = require("validator");
var moment = require("moment");
var chalk = require("chalk");
var abi = require("augur-abi");
var constants = require("./constants");

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    is_function: function (f) {
        return Object.prototype.toString.call(f) === "[object Function]";
    },

    pp: function (obj, indent) {
        var o = this.copy(obj);
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

    STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,

    ARGUMENT_NAMES: /([^\s,]+)/g,

    labels: function (func) {
        var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
        if (result === null) result = [];
        return result;
    },

    unpack: function (o, labels, args) {
        var params = [], cb = [];

        // unpack object argument
        if (o !== undefined && o !== null && o.constructor === Object &&
            labels && labels.constructor === Array && labels.length)
        {
            for (var i = 0, len = labels.length; i < len; ++i) {
                if (o[labels[i]] !== undefined) {
                    if (o[labels[i]].constructor === Function) {
                        cb.push(o[labels[i]]);
                    } else {
                        params.push(o[labels[i]]);
                    }
                } else {
                    return null;
                }
            }

        // unpack positional arguments
        } else {
            for (var j = 0, arglen = args.length; j < arglen; ++j) {
                if (args[j] !== undefined) {
                    if (args[j] && args[j].constructor === Function) {
                        cb.push(args[j]);
                    } else {
                        params.push(args[j]);
                    }
                } else {
                    return null;
                }
            }
        }

        return { params: params, cb: cb };
    },

    // calculate date from block number
    block_to_date: function (augur, block) {
        var current_block = augur.rpc.blockNumber();
        var seconds = (block - current_block) * constants.SECONDS_PER_BLOCK;
        var date = moment().add(seconds, 'seconds');
        return date;
    },

    // calculate block number from date
    date_to_block: function (augur, date) {
        date = moment(new Date(date));
        var current_block = augur.rpc.blockNumber();
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

    remove_duplicates: function (arr) {
        return arr.filter(function (element, position, array) {
            return array.indexOf(element) === position;
        });
    },

    print_nodes: function (nodes) {
        var node;
        process.stdout.write(chalk.green.bold("hosts: "));
        for (var i = 0, len = nodes.length; i < len; ++i) {
            node = nodes[i].split("//")[1].split(':')[0];
            node = (i === 0) ? chalk.green(node) : chalk.gray(node);
            process.stdout.write(node + ' ');
            if (i === len - 1) process.stdout.write('\n');
        }
    },

    setup: function (augur, args, rpcinfo) {
        var defaulthost, ipcpath;
        if (NODE_JS && !process.env.CONTINUOUS_INTEGRATION) {
            defaulthost = "http://127.0.0.1:8545";
            ipcpath = path.join(process.env.HOME, ".ethereum-of-the-moment", "geth.ipc");
        }
        if (process.env.CONTINUOUS_INTEGRATION) {
            augur.constants.TIMEOUT = 131072;
        }
        if (augur.connect(rpcinfo || defaulthost, ipcpath)) {
            if (augur.options.debug.broadcast || augur.options.debug.fallback) {
                console.log(chalk.red.bold("debug:"), augur.options.debug);
                console.log(chalk.blue.bold("local:"), chalk.cyan(augur.rpc.nodes.local));
                this.print_nodes(augur.rpc.nodes.hosted);
            }
            augur.nodes = augur.rpc.nodes.hosted;
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
                accounts = augur.rpc.accounts();
            } else if (typeof augur === "string") {
                accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
                for (var i = 0, len = accounts.length; i < len; ++i) {
                    accounts[i] = abi.prefix_hex(accounts[i]);
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
                ether: abi.bignum(augur.rpc.balance(account)).dividedBy(constants.ETHER).toFixed()
            };
        }
    },

    read_ballots: function (augur, address, branch, period) {
        var ballot, num_events;
        console.log("Looking up ballots for", chalk.green(address));
        for (var i = 0; i < period; ++i) {
            ballot = augur.getReporterBallot(branch, i, address);
            if (ballot.length && ballot[0] !== undefined) {
                num_events = augur.getNumberEvents(branch, i);
                console.log("Period", chalk.cyan(i), "\t",
                    chalk.green(abi.fix(ballot.slice(0, num_events), "hex")));
            }
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
    }

};
