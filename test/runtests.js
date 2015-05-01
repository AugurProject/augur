#!/usr/bin/env node
/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */
(function () {
    var Tests = function (async) {
        var tx;
        
        if (typeof(module) != 'undefined') {
            var BigNumber = require('bignumber.js');
            var Augur = require('./../augur');
            var constants = require('./constants');
        }        
    
        Augur.async = async;

        if (async) console.log("###############################\n"+
                               "# asynchronous augur.js tests #\n"+
                               "###############################");
        else console.log("##############################\n"+
                         "# synchronous augur.js tests #\n"+
                         "##############################");

        function report(tx, showsig) {
            var params, output, send, returns;
            output = "   - ";
            if (tx) {
                returns = (tx.returns) ? tx.returns : "hex";
                if (showsig && showsig === "signature") {
                    params = tx.signature || "";
                } else {
                    if (tx.params && tx.params.constructor === Array) {
                        params = JSON.stringify(tx.params);
                    } else {
                        params = (tx.params) ? tx.params.toString() : "";
                    }
                }
                if (params && params.length > 25) params = params.slice(0,25) + "...";
                send = (tx.send) ? "sendTransaction" : "call";
                output += send + " " + tx.to + ": " + tx.function + "(" + params + ")";
                if (!showsig || showsig !== "signature") {
                    output += " -> " + returns;
                }
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
        function check_results(res, expected, apply) {
            if (res) {
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
            } else {
                console.error("no or incorrect response", res);
            }
        }
        function runtest(tx, expected, apply) {
            if (tx && expected) {
                if (Augur.async) {
                    Augur.invoke(tx, function (res) {
                        report(tx);
                        check_results(res, expected, apply);
                    });
                } else {
                    report(tx);
                    var res = Augur.invoke(tx);
                    check_results(res, expected, apply);
                }
            }
        }
        function abi_test(tx, expected, apply) {
            if (tx && expected) {
                report(tx, "signature");
                var res = Augur.abi_data(tx);
                check_results(res, expected, apply);
            }
        }
        function test(tx, expected, apply) {
            var res;
            var tx = Augur.clone(tx);
            if (tx.send === undefined) {
                tx.send = false;
                runtest(tx, expected, apply);
                // tx.send = true;
                // runtest(tx, expected, apply);
            } else {
                runtest(tx, expected, apply);
            }
        }
        function rpctest(method, command, expected, params) {
            var res;
            console.log("   - " + method + "(" + command + ")");
            if (Augur.async) {
                Augur[method](command, params, function (res) {
                    if (expected.constructor === Function) {
                        console.assert(expected(res));
                    } else {
                        console.assert(expected === res);
                    }
                });
            } else {
                res = Augur[method](command, params);
                if (expected.constructor === Function) {
                    console.assert(expected(res));
                } else {
                    console.assert(expected === res);
                }
            }
        }
        function gteq0(n) { return (parseFloat(n) >= 0); }

        console.log("  ethereum json-rpc wrapper");
        console.log("   - coinbase");
        console.assert(Augur.coinbase.length === 42);
        rpctest("rpc", "net_version", "0");
        rpctest("eth", "protocolVersion", "60");
        rpctest("eth", "coinbase", Augur.coinbase);
        rpctest("web3", "sha3", "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470", "boom!");
        rpctest("db", "putString", true, ["augur_test_DB", "boomkey", "boom!"]);
        rpctest("db", "getString", "boom!", ["augur_test_DB", "boomkey"]);
        try {
            rpctest("shh", "version", "2");
        } catch (e) {
            rpctest("shh", "version", "0");
            console.log("warning: no whisper support found (geth --shh)");
        }
        rpctest("hash", "boom!", "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
        rpctest("sha3", "boom!", "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
        rpctest("gasPrice", "", "0x9184e72a000");
        rpctest("blockNumber", "", gteq0);
        rpctest("balance", "", gteq0);
        rpctest("getBalance", "", gteq0);
        rpctest("txCount", "", gteq0);
        rpctest("getTransactionCount", "", gteq0);
        rpctest("peerCount", "", gteq0);

        console.log("  contract abi data serialization") // no rpc => always synchronous
        tx = {
            to: constants.contracts.examples.ten,
            function: "ten",
            send: false,
            returns: "int"
        };
        abi_test(tx, "0x643ceff9");
        tx = {
            to: Augur.contracts.cash,
            function: "faucet",
            send: false
        };
        abi_test(tx, "0xde5f72fd");
        tx = {
            to: constants.contracts.examples.mul2,
            function: "double",
            signature: "i",
            params: [3],
            returns: "int"
        };
        abi_test(tx, "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003");
        tx = {
            to: constants.contracts.examples.multiplier,
            function: "multiply",
            signature: "ii",
            params: [2, 3],
            returns: "int"
        };
        abi_test(tx, "0x3c4308a800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003");
        tx = {
            to: Augur.contracts.branches,
            function: "getMarkets",
            signature: "i",
            params: 1010101,
            returns: "array"
        };
        abi_test(tx, "0xb3903c8a00000000000000000000000000000000000000000000000000000000000f69b5");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.createEvent,
            function: "createEvent",
            signature: "isiiii",
            params: [1010101, "augur ragefest 2015", 250000, 1, 2, 2],
            gas: 2500000
        };
        abi_test(tx, "0x74cd7d2000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000000000000000003d09000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000261756775722072616765666573742032303135");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.createMarket,
            function: "createMarket",
            signature: "isiiia",
            params: [
                1010101,
                "market for ragefests",
                "0x1000000000000000",
                "0x2800000000000000000",
                "0x400000000000000",
                ["0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c",
                 "0x4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12",
                 "0x412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83"]
            ],
            gas: 3000000
        }
        abi_test(tx, "0x45d96cd70000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000f69b50000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000000004000000000000006d61726b657420666f7220726167656665737473b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.branches,
            function: "getBranches"
        };
        abi_test(tx, "0xc3387858");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.branches,
            function: "getVotePeriod",
            signature: "i",
            params: 1010101
        };
        abi_test(tx, "0x7a66d7ca00000000000000000000000000000000000000000000000000000000000f69b5");
        tx = {
            to: Augur.contracts.info,
            function: "getDescription",
            signature: "i",
            send: false,
            params: "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        };
        abi_test(tx, "0x37e7ee00b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.events,
            function: "getEventInfo",
            signature: "i",
            params: "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        };
        abi_test(tx, "0x1aecdb5bb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");
        
        console.log("  example contract functions");
        // No parameters
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
        tx = {
            to: constants.contracts.examples.ten,
            function: "ten",
            send: false,
            returns: "int"
        };
        test(tx, 10);
        tx.returns = "bignumber";
        test(tx, new BigNumber(10), String);
        // Single integer parameter
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x5204f18c652d1c31c6a5968cb65e011915285a50","data":"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003","gas":"0x2dc6c0"}],"id":1}' http://127.0.0.1:8545
        tx = {
            to: constants.contracts.examples.mul2,
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
        // multiple integer parameters
        tx = {
            to: constants.contracts.examples.multiplier,
            function: "multiply",
            signature: "ii",
            params: [2, 3],
            returns: "int"
        };
        test(tx, 6);
        tx.params = [123, 321];
        test(tx, 39483);

        console.log("  augur contract functions");
        tx = {
            to: Augur.contracts.cash,
            function: "faucet",
            send: false
        };
        test(tx, "0x0000000000000000000000000000000000000000000000000000000000000001");
        tx.returns = "int";
        test(tx, 1);
        // Single integer parameter, array return value
        tx = {
            to: Augur.contracts.branches,
            function: "getMarkets",
            signature: "i",
            params: 1010101,
            returns: "array"
        };
        test(tx, [
            "0x00000000000000000000000000000000000000000000000000000000000000e8",
            "0x00000000000000000000000000000000000000000000000000000000000000e8"
        ], function (a) {
            a.slice(1,2);
        });
        tx.returns = null;
        test(tx,
            "0x000000000000000000000000000000000000000000000000000000000000003300000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000e8",
            function (s) {
                return s.slice(66,194);
            }
        )
    };
    Tests(false);
    Tests(true);
})();
