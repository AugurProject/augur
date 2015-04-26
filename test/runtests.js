#!/usr/bin/env node
/**
 * ethrpc.js tests
 */
if (typeof(module) != 'undefined') {
    var BigNumber = require('bignumber.js');
    var EthRPC = require('../ethrpc');
    var constants = require('./constants');
}
(function runtests() {
    var tx, res;

    console.log("Running ethrpc.js tests:");

    function report(tx) {
        var params, output, send, returns;
        output = " - ";
        if (tx) {
            if (tx.params && tx.params.constructor === Array) {
                params = JSON.stringify(tx.params);
            } else {
                params = (tx.params) ? tx.params.toString() : "";
            }
            if (params.length > 25) params = params.slice(0,25) + "...";
            send = (tx.send) ? "sendTransaction" : "call";
            returns = (tx.returns) ? tx.returns : "string";
            output += send + " " + tx.to + ": " + tx.function + "(" + params + ") -> " + returns;
            console.log(output);
        }
    }

    function array_equal(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function runtest(tx, expected, apply) {
        if (tx && expected) {
            report(tx);
            res = EthRPC.invoke(tx);
            if (apply) {
                if (res && res.constructor === Array) {
                    console.assert(array_equal(apply(res), apply(expected)));
                } else {
                    console.assert(apply(res) === apply(expected));
                }
            } else {
                if (res && res.constructor === Array) {
                    console.assert(array_equal(res, expected));
                } else {
                    console.assert(res === expected);
                }
            }
        }
    }

    function test(tx, expected, apply) {
        var res;
        if (tx.send === undefined) {
            tx.send = false;
            runtest(tx, expected, apply);
            // tx.send = true;
            // runtest(tx, expected, apply);
        } else {
            runtest(tx, expected, apply);
        }
    }

    // No parameters
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
    tx = {
        to: constants.addr.examples.ten,
        function: "ten",
        send: false,
        returns: "int"
    };
    test(tx, 10);

    tx.returns = "bignumber";
    test(tx, new BigNumber(10), String);

    tx = {
        to: constants.addr.augur.cash,
        function: "faucet",
        send: false
    };
    test(tx, "0x0000000000000000000000000000000000000000000000000000000000000001");

    tx.returns = "int";
    test(tx, 1);

    // Single integer parameter
    // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x5204f18c652d1c31c6a5968cb65e011915285a50","data":"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003","gas":"0x2dc6c0"}],"id":1}' http://127.0.0.1:8545
    tx = {
        to: constants.addr.examples.mul2,
        function: "double",
        signature: "i",
        params: [3],
        returns: "int"
    };
    test(tx, 6);

    tx.params = 100;
    test(tx, 200);

    tx.params = 22121;
    test(tx, 44242);

    // Single integer parameter, array return value
    tx = {
        to: constants.addr.augur.branches,
        function: "getMarkets",
        signature: "i",
        params: 1010101,
        returns: "array"
    };
    test(tx, [
        "0x0000000000000000000000000000000000000000000000000000000000000032",
        "0x00000000000000000000000000000000000000000000000000000000000000e8",
        "0x00000000000000000000000000000000000000000000000000000000000000e8"
    ], function (a) {
        return a.slice(0,3);
    });

    tx.returns = "string";
    test(tx,
        "0x000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000e", 
        function (s) {
            return s.slice(0,193);
        }
    );

    tx = {
        to: constants.addr.examples.multiplier,
        function: "multiply",
        signature: "ii",
        params: [2, 3],
        returns: "int"
    };
    test(tx, 6);

    tx.params = [123, 321];
    test(tx, 39483);

    tx = {
        to: constants.addr.augur.cash,
        function: "balance",
        signature: "i",
        params: constants.addr.jack
    };
    test(tx, "0x0000000000000000000000000000000000000000000027100000000000000000");

})();
