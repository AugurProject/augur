"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var fs = (NODE_JS) ? require("fs") : null;
var path = (NODE_JS) ? require("path") : null;
var assert = (NODE_JS) ? require("assert") : console.assert;
var BigNumber = require("bignumber.js");
var Decimal = require("decimal.js");
var abi = require("augur-abi");
var chalk = require("chalk");
var moment = require("moment");
var constants = require("../src/constants");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

var displayed_connection_info = false;

module.exports = {

    // maximum number of accounts/samples for testing
    MAX_TEST_ACCOUNTS: 3,
    UNIT_TEST_SAMPLES: 100,
    MAX_TEST_SAMPLES: 10,

    // unit test timeout
    TIMEOUT: 600000,

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
        if (NODE_JS && process.env.AUGURJS_INTEGRATION_TESTS) {
            defaulthost = "http://127.0.0.1:8545";
            ipcpath = process.env.GETH_IPC;
            wsUrl = "ws://127.0.0.1:8546";
        }
        if (process.env.CONTINUOUS_INTEGRATION) {
            this.TIMEOUT = 131072;
        }
        if (defaulthost) augur.rpc.setLocalNode(defaulthost);
        if (augur.connect({http: rpcinfo || defaulthost, ipc: ipcpath, ws: wsUrl})) {
            if (!displayed_connection_info) {
                console.log(chalk.cyan.bold("local:   "), chalk.cyan(augur.rpc.nodes.local));
                console.log(chalk.blue.bold("ws:      "), chalk.blue(augur.rpc.wsUrl));
                console.log(chalk.magenta.bold("ipc:     "), chalk.magenta(augur.rpc.ipcpath));
                this.print_nodes(augur.rpc.nodes.hosted);
                console.log(chalk.yellow.bold("network: "), chalk.yellow(augur.network_id));
                console.log(chalk.bold("coinbase:"), chalk.white.dim(augur.coinbase));
                console.log(chalk.bold("from:    "), chalk.white.dim(augur.from));
                displayed_connection_info = true;
            }
            augur.nodes = augur.rpc.nodes.hosted;
        }
        return augur;
    },

    reset: function (mod) {
        mod = path.join(__dirname, "..", "src", path.parse(mod).name);
        delete require.cache[require.resolve(mod)];
        return require(mod);
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
            branch = branch || augur.branches.dev;
            account = account || augur.coinbase;
            return {
                cash: augur.getCashBalance(account),
                reputation: augur.getRepBalance(branch || augur.branches.dev, account),
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

    toDecimal: function (x) {
        if (!x) return null;
        if (x.constructor === Array) {
            for (var i = 0, n = x.length; i < n; ++i) {
                x[i] = this.toDecimal(x[i]);
            }
        } else if (x.constructor !== Decimal) {
            if (x.toFixed && x.toFixed.constructor === Function) {
                x = x.toFixed();
            }
            if (x.toString && x.toString.constructor === Function) {
                x = x.toString();
            }
            x = new Decimal(x);
        }
        return x;
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
