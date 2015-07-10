"use strict";

var MODULAR = typeof module !== "undefined";

var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var assert = require("chai").assert;
var log = console.log;

var utilities = {};

utilities.setup = function (augur, args) {
    if (args.length && (args[0] === "--gospel" ||
        (args.length > 1 && args[1] === "--gospel") ||
        args[0] === "--reset" ||
        args[0] === "--postupload" ||
        args[0] === "--faucets" ||
        args[0] === "--ballots")) {
        var gospel = require("path").join(__dirname || "", "gospel.json");
        log("Load contracts from file: " + chalk.green(gospel));
        var contracts = require("fs").readFileSync(gospel);
        augur.contracts = JSON.parse(contracts);
    }
    augur.connect();
    return augur;
};

utilities.reset = function (module) {
    delete require.cache[require.resolve(module)];
    return require(module);
};

utilities.gteq0 = function (n) { return (new BigNumber(n)).toNumber() >= 0; };

utilities.print_matrix = function (m) {
    for (var i = 0, rows = m.length; i < rows; ++i) {
        process.stdout.write("\t");
        for (var j = 0, cols = m[0].length; j < cols; ++j) {
            process.stdout.write(chalk.cyan(m[i][j] + "\t"));
        }
        process.stdout.write("\n");
    }
};

utilities.wait = function (seconds) {
    var start, delay;
    start = new Date();
    delay = seconds * 1000;
    while ((new Date()) - start <= delay) {}
    return true;
};

utilities.array_equal = function (a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    var a_length = a.length;
    if (a_length !== b.length) return false;
    for (var i = 0; i < a_length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

utilities.check_results = function (res, expected, apply) {
    if (res) {
        if (apply) {
            if (res && res.constructor === Array) {
                assert(utilities.array_equal(apply(res), apply(expected)));
            } else {
                assert.equal(apply(res), apply(expected));
            }
        } else {
            if (res && res.constructor === Array) {
                assert(utilities.array_equal(res, expected));
            } else {
                assert.equal(res, expected);
            }
        }
    } else {
        console.error("no or incorrect response", res);
    }
}

utilities.runtest = function (augur, tx, expected, apply) {
    if (tx && expected) {
        var res = augur.invoke(tx);
        utilities.check_results(res, expected, apply);
    }
};

utilities.copy = function (obj) {
    if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

utilities.has_value = function (o, v) {
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            if (o[p] === v) {
                return p;
            }
        }
    }
};

utilities.loop = function (list, iterator) {
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
        if (typeof setTimeout === 'undefined') runloop();
        else setTimeout(iterate, 1);
    };
    next();
};

utilities.test_invoke = function (augur, itx, expected, apply) {
    var tx = utilities.copy(itx);
    if (tx.send === undefined) {
        tx.send = false;
        utilities.runtest(augur, tx, expected, apply);
    } else {
        utilities.runtest(augur, tx, expected, apply);
    }
};

utilities.fold = function (arr, num_cols) {
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
};

utilities.prefix_hex = function (n) {
    if (n.constructor === Number || n.constructor === BigNumber) {
        n = n.toString(16);
    }
    if (n.slice(0,2) !== "0x" && n.slice(0,3) !== "-0x") {
        if (n.slice(0,1) === '-') {
            n = "-0x" + n.slice(1);
        } else {
            n = "0x" + n;
        }
    }
    return n;
};

utilities.get_test_accounts = function (augur, max_accounts) {
    var accounts;
    if (augur) {
        if (typeof augur === "object") {
            accounts = augur.rpc.accounts();
        } else if (typeof augur === "string") {
            accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
            for (var i = 0, len = accounts.length; i < len; ++i) {
                accounts[i] = utilities.prefix_hex(accounts[i]);
            }
        }
        if (max_accounts && accounts.length > max_accounts) {
            accounts = accounts.slice(0, max_accounts);
        }
        return accounts;
    }
};

utilities.get_balances = function (augur, account, branch) {
    if (augur) {
        branch = branch || augur.branches.dev;
        account = account || augur.coinbase;
        return {
            cash: augur.getCashBalance(account),
            reputation: augur.getRepBalance(branch || augur.branches.dev, account),
            ether: augur.numeric.bignum(augur.rpc.balance(account)).dividedBy(augur.ETHER).toFixed()
        };
    }
};

utilities.read_ballots = function (augur, address, branch, period) {
    var ballot, num_events;
    log("Looking up ballots for", chalk.green(address));
    for (var i = 0; i < period; ++i) {
        ballot = augur.getReporterBallot(branch, i, address);
        if (ballot.length && ballot[0] !== undefined) {
            num_events = augur.getNumberEvents(branch, i);
            log("Period", chalk.cyan(i), "\t",
                chalk.green(augur.numeric.fix(ballot.slice(0, num_events), "hex")));
        }
    }
};

utilities.chunk32 = function (string, stride) {
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
};

utilities.sha256 = function (x) {
    return "0x" + require("crypto").createHash("sha256").update(x).digest("hex");
};

if (MODULAR) module.exports = utilities;
