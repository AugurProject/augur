"use strict";

var MODULAR = typeof(module) !== 'undefined';

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;

var utilities = {};

utilities.setup = function (augur, args) {
    if (args.length && (args[0] === "--gospel" ||
        (args.length > 1 && args[1] === "--gospel") ||
        args[0] === "--reset" ||
        args[0] === "--postupload" ||
        args[0] === "--faucets" ||
        args[0] === "--ballots")) {
        var gospel = require("path").join(__dirname, "gospel.json");
        var contracts = JSON.parse(require("fs").readFileSync(gospel));
        augur.contracts = JSON.parse(require("fs").readFileSync(gospel));
        for (var c in contracts) {
            if (!contracts.hasOwnProperty(c)) continue;
            assert.equal(augur.contracts[c], contracts[c]);
        }
    }
    augur.connect();
    return augur;
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

utilities.test_invoke = function (augur, itx, expected, apply) {
    var tx = utilities.copy(itx);
    if (tx.send === undefined) {
        tx.send = false;
        utilities.runtest(augur, tx, expected, apply);
    } else {
        utilities.runtest(augur, tx, expected, apply);
    }
};

if (MODULAR) module.exports = utilities;
