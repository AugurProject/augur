#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */
(function () {

    "use strict";

    var BigNumber = require("bignumber.js");
    var assert = require("assert");
    var crypto = require("crypto");
    var Augur = require("./../augur");
    var constants = require("./constants");

    function report(tx, showsig) {
        var params, output, send, returns;
        output = "";
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
            output += send + " " + tx.to + ": " + tx.method + "(" + params + ")";
            if (!showsig || showsig !== "signature") {
                output += " -> " + returns;
            }
            return output;
        }
    }
    function array_equal(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return false;
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
                    assert(array_equal(apply(res), apply(expected)));
                } else {
                    assert(apply(res) === apply(expected));
                }
            } else {
                if (res && res.constructor === Array) {
                    assert(array_equal(res, expected));
                } else {
                    assert(res === expected);
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
                    check_results(res, expected, apply);
                });
            } else {
                var res = Augur.invoke(tx);
                check_results(res, expected, apply);
            }
            return report(tx);
        }
    }
    function abi_test(tx, expected, apply) {
        if (tx && expected) {
            var res = Augur.abi_data(tx);
            check_results(res, expected, apply);
            return report(tx, "signature");
        }
    }
    function test(itx, expected, apply) {
        var res, tx;
        tx = Augur.clone(itx);
        if (tx.send === undefined) {
            tx.send = false;
            runtest(tx, expected, apply);
        } else {
            runtest(tx, expected, apply);
        }
    }
    function rpctest(method, command, expected, params) {
        var res;
        if (Augur.async) {
            Augur[method](command, params, function (res) {
                if (expected.constructor === Function) {
                    assert(expected(res));
                } else {
                    assert.equal(expected, res);
                }
            });
        } else {
            res = Augur[method](command, params);
            if (expected.constructor === Function) {
                assert(expected(res));
            } else {
                assert.equal(expected, res);
            }
        }
    }
    function sha512(s) {
        return crypto.createHash('sha512').update(s).digest('hex');
    }
    function sha256(s) {
        return crypto.createHash('sha256').update(s).digest('hex');
    }
    function gteq0(n) { return (parseFloat(n) >= 0); }
    function is_array(r) {
        assert(r.constructor === Array);
        assert(r.length > 0);
    }
    function is_object(r) {
        assert(r.constructor === Object);
    }
    function is_empty(o) {
        for (var i in o) {
            if (o.hasOwnProperty(i)) return false;
        }
        return true;
    }
    function on_root_branch(r) {
        assert(parseInt(r.branch) === 1010101);
    }
    function is_not_zero(r) {
        assert(r.id !== "0" && r.id !== "0x" && r.id !== "0x0" && parseInt(r) !== 0);
    }

    var print = console.log;

    var TestWhisper = function () {
        var comment_text = Math.random().toString(36).substring(4);
        var dbname = "augur";
        var market_id = "0x00000003";
        Augur.newIdentity(function (whisper_id) {
            if (whisper_id) {
                var post_params = {
                    from: whisper_id,
                    topics: [ market_id ],
                    priority: '0x64',
                    ttl: "0x500" // time-to-live (until expiration) in seconds
                };
                Augur.commentFilter(market_id, function (filter) {
                    post_params.payload = Augur.prefix_hex(Augur.encode_hex(comment_text));
                    Augur.post(post_params, function (post_ok) {
                        if (post_ok) {
                            Augur.getFilterChanges(filter, function (message) {
                                if (message) {
                                    var updated_comments = JSON.stringify([{
                                        whisperId: message[0].from, // whisper ID
                                        from: Augur.coinbase, // ethereum account
                                        comment: Augur.decode_hex(message[0].payload),
                                        time: message[0].sent
                                    }]);
                                    // get existing comment(s) stored locally
                                    Augur.getString(market_id, function (comments) {
                                        if (comments) {
                                            updated_comments = updated_comments.slice(0,-1) + "," + comments.slice(1);
                                        }
                                        Augur.putString(market_id, updated_comments, function (put_ok) {
                                            if (put_ok && updated_comments) {
                                                print(JSON.parse(updated_comments));
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    // minimal example that crashes geth (?)
    // var print = console.log;
    // Augur.shh("newFilter", { topics: [ "0xb13d98f933cbd602a3d9d4626260077678ab210d1e63b3108b231c1758ff9971" ] }, print);
    // Augur.shh("uninstallFilter", "0x0", print);

    describe("Comments", function () {
        var comment_text = Math.random().toString(36).substring(4);
        var market_id = "-0x18b9aec6e8886ecec9ff0fd5c149800468edf8e9533efd32ab2efcc4a9388533";    
        Augur.comment(market_id, comment_text, function (comments) {
            assert(comments);
            // print(comments.length.toString() + " comments found");
            // print(comments);
        });
    });
    describe("Ethereum JSON-RPC", function () {
        describe("coinbase", function () {
            it("should be 42 characters long", function () {
                assert.equal(Augur.coinbase.length, 42);
            });
        });
        describe("net_version", function () {
            it("should be version 0", function () {
                rpctest("rpc", "net_version", "0");
            });
        });
        describe("eth_protocolVersion", function () {
            it("should be version 60", function () {
                rpctest("eth", "protocolVersion", "60");
            });
        });
        describe("eth_coinbase", function () {
            it("should match Augur.coinbase", function () {
                rpctest("eth", "coinbase", Augur.coinbase);
            });
        });
        describe("web3_sha3", function () {
            var input = "boom!";
            var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
            it("'" + input + "' should hash to '" + digest + "'", function () {
                rpctest("web3", "sha3", digest, input);
                rpctest("hash", input, digest);
                rpctest("sha3", input, digest);
            });
        });
        describe("db_putString", function () {
            it("should return true", function () {
                rpctest("db", "putString", true, ["augur_test_DB", "boomkey", "boom!"]);
            });
        });
        describe("db_getString", function () {
            it("should fetch 'boom!' using key 'boomkey'", function () {
                rpctest("db", "getString", "boom!", ["augur_test_DB", "boomkey"]);
            });
        });
        describe("shh_version", function () {
            it("should be version 2", function () {
                rpctest("shh", "version", "2");
            });
        });
        describe("gasPrice", function () {
            it("should be 10 szabo", function () {
                rpctest("gasPrice", "", "0x9184e72a000");
            });
        });      
        describe("blockNumber", function () {
            it("should be a number greater than or equal to 200,000", function () {
                rpctest("blockNumber", "", function (n) { return parseFloat(n) >= 200000; });
            });
        });
        describe("balance", function () {
            it("should be a number greater than or equal to 0", function () {
                rpctest("balance", "", gteq0);
                rpctest("getBalance", "", gteq0);
            });
        });
        describe("txCount", function () {
            it("should be a number greater than or equal to 0", function () {
                rpctest("txCount", "", gteq0);
                rpctest("getTransactionCount", "", gteq0);
            });
        });
        describe("peerCount", function () {
            it("should be a number greater than or equal to 0", function () {
                rpctest("peerCount", "", gteq0);
            });
        });
    });

    describe("Contract ABI data serialization", function () {
        describe("No parameters", function () {
            describe("ten.se: " + constants.examples.ten, function () {
                it("ten() -> 0x643ceff9", function () {
                    var tx = {
                        to: constants.examples.ten,
                        method: "ten",
                        send: false,
                        returns: "number"
                    };
                    assert.equal(Augur.abi_data(tx), "0x643ceff9");
                });
            });
            describe("cash.se: " + Augur.contracts.cash, function () {
                it("faucet() -> 0xde5f72fd", function () {
                    var tx = {
                        to: Augur.contracts.cash,
                        method: "faucet",
                        send: false
                    };
                    assert.equal(Augur.abi_data(tx), "0xde5f72fd");
                });
            });
            describe("branches.se: " + Augur.contracts.branches, function () {
                var hex = "0xc3387858";
                it("getBranches() -> " + hex, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.branches,
                        method: "getBranches"
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
        });
        describe("One int256 parameter", function () {
            describe("mul2.se: " + constants.examples.mul2, function () {
                var hex = "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003";
                it("double() -> " + hex, function () {
                    var tx = {
                        to: constants.examples.mul2,
                        method: "double",
                        signature: "i",
                        params: [3],
                        returns: "number"
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
            describe("branches.se: " + Augur.contracts.branches, function () {
                var hex = "0xb3903c8a00000000000000000000000000000000000000000000000000000000000f69b5";
                it("getMarkets(1010101) -> " + hex, function () {
                    var tx = {
                        to: Augur.contracts.branches,
                        method: "getMarkets",
                        signature: "i",
                        params: 1010101,
                        returns: "array"
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
            describe("branches.se: " + Augur.contracts.branches, function () {
                var hex = "0x7a66d7ca00000000000000000000000000000000000000000000000000000000000f69b5";
                it("getVotePeriod(1010101) -> " + hex, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.branches,
                        method: "getVotePeriod",
                        signature: "i",
                        params: 1010101
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
            describe("info.se: " + Augur.contracts.info, function () {
                var method = "getDescription";
                var params = "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
                var hex = "0x37e7ee00b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
                it(method + "(" + params + ") -> " + hex, function () {
                    var tx = {
                        to: Augur.contracts.info,
                        method: method,
                        signature: "i",
                        send: false,
                        params: params
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
            describe("events.se: " + Augur.contracts.events, function () {
                var method = "getEventInfo";
                var params = "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
                var hex = "0x1aecdb5bb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
                it(method + "(" + params + ") -> " + hex, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.events,
                        method: method,
                        signature: "i",
                        params: params
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
        });
        describe("Two int256 parameters", function () {
            describe("multiplier.se: " + constants.examples.multiplier, function () {
                var hex = "0x3c4308a800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003";
                it("multiply(2,3) -> " + hex, function () {
                    var tx = {
                        to: constants.examples.multiplier,
                        method: "multiply",
                        signature: "ii",
                        params: [2, 3],
                        returns: "number"
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
        });
        describe("Multiple parameters: int256, string", function () {
            describe("createEvent.se: " + Augur.contracts.createEvent, function () {
                var hex = "0x74cd7d2000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000000000000000003d09000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000261756775722072616765666573742032303135";
                it("createEvent('augur ragefest 2015') -> " + hex, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.createEvent,
                        method: "createEvent",
                        signature: "isiiii",
                        params: [1010101, "augur ragefest 2015", 250000, 1, 2, 2],
                        gas: 2500000
                    };
                    assert.equal(Augur.abi_data(tx), hex);
                });
            });
        });
        describe("Multiple parameters: int256, string, int256[]", function () {
            describe("createMarket.se: " + Augur.contracts.createMarket, function () {
                var hex0 = "0x45d96cd70000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000f69b50000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000000004000000000000006d61726b657420666f7220726167656665737473b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83";
                it("createMarket('market for ragefests') -> " + hex0, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.createMarket,
                        method: "createMarket",
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
                    };
                    assert.equal(Augur.abi_data(tx), hex0);
                });
                // negative hash
                var hex1 = "0x45d96cd70000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a0000000000000000756e69636f726e7320617265207265616cd51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591";
                it("createMarket('unicorns are real') -> " + hex1, function () {
                    var tx = {
                        from: Augur.coinbase,
                        to: Augur.contracts.createMarket,
                        method: "createMarket",
                        signature: "isiiia",
                        params: [
                            1010101,
                            "unicorns are real",
                            "0x10000000000000000",
                            "0xa0000000000000000",
                            "0xa0000000000000000",
                            ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"]
                        ],
                    };
                    assert.equal(Augur.abi_data(tx), hex1);
                });
            });
        });
    });

    describe("Invoke contract functions", function () {
        // No parameters
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
        describe("No parameters", function () {
            describe("ten.se: " + constants.examples.ten, function () {
                var method = "ten";
                var params = "";
                var expected = "10";
                var tx = {
                    to: constants.examples.ten,
                    method: method,
                    send: false,
                    params: params,
                    returns: "number"
                };
                it(method + "(" + params + ") -> " + expected, function () {
                    assert.equal(Augur.invoke(tx), expected);
                });
                var expected = new BigNumber(10);
                it(method + "(" + params + ") -> " + expected, function () {
                    tx.returns = "bignumber";
                    test(tx, expected, String);
                });
            });
            describe("cash.se: " + Augur.contracts.cash, function () {
                var method = "faucet";
                var params = "";
                var expected = "0x0000000000000000000000000000000000000000000000000000000000000001";
                it(method + "(" + params + ") -> " + expected, function () {
                    var tx = {
                        to: Augur.contracts.cash,
                        method: method,
                        params: params,
                        send: false
                    };
                    var expected = "0x0000000000000000000000000000000000000000000000000000000000000001";
                    test(tx, expected);
                });
                var expected = "1";
                it(method + "(" + params + ") -> " + expected, function () {
                    var expected = "1";
                    var tx = {
                        to: Augur.contracts.cash,
                        method: method,
                        params: params,
                        send: false,
                        returns: "number"
                    };
                    test(tx, expected);
                });
            });
        });
        // Single integer parameter
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x5204f18c652d1c31c6a5968cb65e011915285a50","data":"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003","gas":"0x2dc6c0"}],"id":1}' http://127.0.0.1:8545
        describe("Single integer parameter", function () {
            describe("mul2.se: " + constants.examples.mul2, function () {
                var tx = {
                    to: constants.examples.mul2,
                    method: "double",
                    signature: "i",
                    returns: "number"
                };
                it("double(3) -> 6", function () {
                    tx.params = [3];
                    test(tx, "6");
                });
                it("double(100) -> 200", function () {
                    tx.params = 100;
                    test(tx, "200");
                });
                it("double(22121) -> 44242", function () {
                    tx.params = 22121;
                    test(tx, "44242");
                });
            });
        });
        // multiple integer parameters
        describe("Multiple integer parameters", function () {
            describe("multiplier.se: " + constants.examples.multiplier, function () {
                var tx = {
                    to: constants.examples.multiplier,
                    method: "multiply",
                    signature: "ii",
                    returns: "number"
                };
                it("multiply(2,3) -> 6", function () {
                    tx.params = [2, 3];
                    test(tx, "6");
                });
                it("multiply(123,321) -> 39483", function () {
                    tx.params = [123, 321];
                    test(tx, "39483");
                });
            });
        });
        // Single integer parameter, array return value
        describe("Single integer parameter, array return value", function () {
            describe("branches.se: " + Augur.contracts.branches, function () {
                var tx = {
                    to: Augur.contracts.branches,
                    method: "getMarkets",
                    signature: "i",
                    params: 1010101
                };
                it("getMarkets(1010101) -> " + JSON.stringify([
                        "0x00000000000000000000000000000000000000000000000000000000000000e8",
                        "0x00000000000000000000000000000000000000000000000000000000000000e8", "..."
                    ]), function () {
                    tx.returns = "hash[]";
                    test(tx, [
                        "0x00000000000000000000000000000000000000000000000000000000000000e8",
                        "0x00000000000000000000000000000000000000000000000000000000000000e8"
                    ], function (a) {
                        a.slice(1,2);
                    });
                });
                it("getMarkets(1010101) -> 0x000000000000000000000000000000000000000000000000000000000000003300000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000e8", function () {
                    tx.returns = null;
                    test(tx,
                        "0x000000000000000000000000000000000000000000000000000000000000003300000000000000000000000000000000000000000000000000000000000000e800000000000000000000000000000000000000000000000000000000000000e8",
                        function (s) {
                            return s.slice(66,194);
                        }
                    );
                });
            });
        });
    });
    describe("Augur API", function () {

        var tx;
    
        Augur.BigNumberOnly = false;

        var ex_integer = 12345678901;
        var ex_decimal = 0.123456789;
        var ex_integer_hex = "0x2dfdc1c35";
        var ex_integer_string = "12345678901";
        var ex_decimal_string = "0.123456789";

        describe("bignum", function () {
            it("should be the same if called with a float or a string", function () {
                assert(Augur.bignum(ex_decimal).eq(Augur.bignum(ex_decimal_string)));
            });
        });
        describe("fix", function () {
            it("should be equal to round(n*2^64)", function () {
                assert(Augur.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(Augur.ONE).round()));
            });
            it("should return a base 10 string '2277375790844960561'", function () {
                assert(Augur.fix(ex_decimal, "string") === "2277375790844960561");
            });
            it("should return a base 16 string '0x1f9add3739635f31'", function () {
                assert(Augur.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
            });
        });
        describe("unfix", function () {
            it("fixed-point -> hex", function () {
                assert(Augur.unfix(Augur.fix(ex_integer_hex, "BigNumber"), "hex") === ex_integer_hex);
            });
            it("fixed-point -> string", function () {
                assert(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "string") === ex_integer_string);
            });
            it("fixed-point -> number", function () {
                assert(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "number") === ex_integer);
            });
        });

        describe("getMarketInfo", function () {
            var market_id = "-0x18b9aec6e8886ecec9ff0fd5c149800468edf8e9533efd32ab2efcc4a9388533";
            var marketInfo = Augur.getMarketInfo(market_id);
            it("should have 2 outcomes", function () {
                assert.equal("2", marketInfo.numOutcomes);
            });
            it("should have trading period 81074", function () {
                assert.equal("81074", marketInfo.tradingPeriod);
            });
            it("should have description 'Will Hillary Rodham Clinton win the 2016 presidential race?'", function () {
                assert.equal("Will Hillary Rodham Clinton win the 2016 presidential race?", marketInfo.description);
            });
        });
    
        var amount = "1";
        var branch_id = "1010101";
        var branch_number = "1";
        var participant_id = constants.accounts.jack;
        var participant_number = "1";
        var outcome = Augur.NO.toString();
        var event_id = "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c";
        var market_id = "0xb13d98f933cbd602a3d9d4626260077678ab210d1e63b3108b231c1758ff9971";
        var market_id2 = "0x97d63d7567b1fc41c19296d959eba0e7df4900bf2d197c6b7b746d864fdde421";
        var event_description = "[augur.js] " + Math.random().toString(36).substring(4);
        var market_description = "[augur.js] " + Math.random().toString(36).substring(4);
        var market_description_long = "[augur.js] abcdefghijklmnopqrstuvwxyzkaetlkfwagalkjgakhgealkgeajgealgqwMCQeaAjgeajleagjlagai3";
        var reporter_index = "0";
        var reporter_address = constants.accounts.jack;
        var ballot = [Augur.YES, Augur.YES, Augur.NO, Augur.YES];
        var salt = "1337";
        var receiving_account = constants.accounts.joey;
        var vote_period = 1;

        // cash.se
        describe("cash.se", function () {
            // Augur.getCashBalance(Augur.coinbase, function (r) {
            //     describe("getCashBalance(" + Augur.coinbase + ") -> " + r, function () {
            //         it("is not zero", function () {
            //             is_not_zero(r);
            //         });
            //         Augur.getCashBalance(receiving_account, function (r) {
            //             describe("getCashBalance(" + receiving_account + ") -> " + r, function () {
            //                 Augur.tx.sendCash.send = false;
            //                 Augur.tx.sendCash.returns = "unfix";
            //                 Augur.sendCash(receiving_account, amount, function (r) {
            //                     describe("sendCash(" + receiving_account + ", " + amount + ") [call] -> " + r, function () {
            //                         it("is not zero", function () {
            //                             is_not_zero(r);
            //                         });
            //                         it("is equal to the input amount", function () {
            //                             assert(r === amount);
            //                         });
            //                         Augur.tx.sendCash.send = true;
            //                         Augur.tx.sendCash.returns = undefined;
            //                         Augur.sendCash(receiving_account, amount, function (r) {
            //                             print("sendCash(" + receiving_account + ", " + amount + ") [sendTx] -> " + r);
            //                             is_not_zero(r);
            //                             // TODO check that balances actually changed
            //                         });
            //                     });
            //                 });
            //             });
            //         });
            //     });
            // });
            describe("cashFaucet() [call] -> '1'", function () {
                Augur.tx.cashFaucet.send = false;
                Augur.tx.cashFaucet.returns = "number";
                var res = Augur.cashFaucet();
                it("sync", function () {
                    assert(res === "1");
                });
                it("async", function () {
                    Augur.cashFaucet(function (r) {
                        assert(r === "1");
                    });
                });
            });
            describe("cashFaucet() [sendTx] != 0", function () {
                // it("sync", function () {
                //     Augur.tx.cashFaucet.send = true;
                //     Augur.tx.cashFaucet.returns = undefined;
                //     var res = Augur.cashFaucet();
                //     is_not_zero(res);
                // });
                it("async", function () {
                    Augur.tx.cashFaucet.send = true;
                    Augur.tx.cashFaucet.returns = undefined;
                    Augur.cashFaucet(function (r) {
                        is_not_zero(r);
                    });
                });
            });
        });

        // info.se
        describe("info.se", function () {
            describe("getCreator(" + event_id + ") [event] -> 0x00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89", function () {
                it("sync", function () {
                    var res = Augur.getCreator(event_id);
                    assert(res === "0x00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89")
                });
                it("async", function () {
                    Augur.getCreator(event_id, function (r) {
                        assert(r === "0x00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89");
                    });
                });
            });
            describe("getCreator(" + market_id + ") [market] -> 0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70", function () {
                it("sync", function () {
                    var res = Augur.getCreator(market_id);
                    assert(res === "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70")
                });
                it("async", function () {
                    Augur.getCreator(market_id, function (r) {
                        assert(r === "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70");
                    });
                });
            });
            describe("getCreationFee(" + event_id + ") [event]", function () {
                it("sync", function () {
                    var res = Augur.getCreationFee(event_id);
                    assert(res === "0.00000000000000000244");
                });
                it("async", function () {
                    Augur.getCreationFee(event_id, function (r) {
                        assert(r === "0.00000000000000000244");
                    });
                });
            });
            describe("getCreationFee(" + market_id + ") [market]", function () {
                it("sync", function () {
                    var res = Augur.getCreationFee(market_id);
                    assert(res === "10");
                });
                it("async", function () {
                    Augur.getCreationFee(market_id, function (r) {
                        assert(r === "10");
                    });
                });
            });
            describe("getDescription(" + event_id + ")", function () {
                it("sync", function () {
                    var res = Augur.getDescription(event_id);
                    assert(res.slice(-9) === "ragefest!");
                });
                it("async", function () {
                    Augur.getDescription(event_id, function (r) {
                        assert(r.slice(-9) === "ragefest!");
                    });
                });
            });
        });

        // branches.se
        describe("branches.se", function () {
            describe("getBranches", function () {
                it("should be an array with length >= 3", function () {
                    Augur.getBranches(function (r) {
                        assert(r.length >= 3);
                        is_array(r);
                    });
                });
            });
            describe("getMarkets(" + branch_id + ")", function () {
                it("should be an array with length > 1 and first two elements equal to 232", function () {
                    Augur.getMarkets(branch_id, function (r) {
                        is_array(r);
                        assert(r.length > 1);
                        assert(r[0] === "0x00000000000000000000000000000000000000000000000000000000000000e8");
                        assert(r[1] === "0x00000000000000000000000000000000000000000000000000000000000000e8");
                    });
                });
            });
            describe("getPeriodLength(" + branch_id + ") == '20'", function () {
                it("sync", function () {
                    assert(Augur.getPeriodLength(branch_id) === "20");
                });
                it("async", function () {
                    Augur.getPeriodLength(branch_id, function (r) {
                        assert(r === "20");
                    });
                });
            });
            describe("getVotePeriod(" + branch_id + ") >= 2", function () {
                it("sync", function () {
                    assert(parseInt(Augur.getVotePeriod(branch_id)) >= 2);
                });
                it("async", function () {
                    Augur.getVotePeriod(branch_id, function (r) {
                        assert(parseInt(r) >= 2);
                    });
                });
            });
            describe("getStep(" + branch_id + ") <= 9", function () {
                it("sync", function () {
                    var res = parseInt(Augur.getStep(branch_id));
                    assert(res >= 0 && res <= 9);
                });
                it("async", function () {
                    Augur.getStep(branch_id, function (r) {
                        assert(parseInt(r) >= 0 && parseInt(r) <= 9);
                    });
                });
            });
            describe("getNumMarkets(" + branch_id + ") >= 120", function () {
                it("sync", function () {
                    assert(parseInt(Augur.getNumMarkets(branch_id)) >= 120);
                });
                it("async", function () {
                    Augur.getNumMarkets(branch_id, function (r) {
                        assert(parseInt(r) >= 120);
                    });
                });
            });
            Augur.getMinTradingFee(branch_id, function (r) {
                print("getMinTradingFee(" + branch_id + ") -> " + r);
                assert(parseFloat(r) >= 0.0 && parseFloat(r) <= 1.0);
            });
            Augur.getNumBranches(function (r) {
                print("getNumBranches() -> " + r);
                assert(parseInt(r) >= 3);
            });
            Augur.getBranch(branch_number, function (r) {
                print("getBranch(" + branch_number + ") -> " + r);
                assert(r === "0x7f5026f174d59f6f01ff3735773b5e3adef0b9c98f8a8e84e0000f034cfbf35a");
            });
        });

        // events.se
        describe("events.se", function () {
            describe("getEventInfo(" + event_id + ")", function () {
                it("sync", function () {
                    var res = Augur.getEventInfo(event_id);
                    on_root_branch(res);
                    assert(res.expirationDate === "250000");
                    assert(res.description.slice(-9) === "ragefest!");
                });
                it("async", function () {
                    Augur.getEventInfo(event_id, function (r) {
                        on_root_branch(r);
                        assert(r.expirationDate === "250000");
                        assert(r.description.slice(-9) === "ragefest!");
                    });
                });
            });

            // TODO getEventBranch
            describe("getExpiration(" + event_id + ") == '250000'", function () {
                it("sync", function () {
                    assert(Augur.getExpiration(event_id) === "250000");
                });
                it("async", function () {
                    Augur.getExpiration(event_id, function (r) {
                        assert(r === "250000");
                    });
                });
            });
            // TODO getOutcome
            describe("getMinValue(" + event_id + ") == '1'", function () {
                it("sync", function () {
                    assert(Augur.getMinValue(event_id) === '1');
                });
                it("async", function () {
                    Augur.getMinValue(event_id, function (r) {
                        assert(r === "1");
                    });
                });
            });
            describe("getMaxValue(" + event_id + ") == '2'", function () {
                it("sync", function () {
                    assert(Augur.getMaxValue(event_id) === "2");
                });
                it("async", function () {
                    Augur.getMaxValue(event_id, function (r) {
                        assert(r === "2");
                    });
                });
            });
            describe("getNumOutcomes(" + event_id + ") == '2'", function () {
                it("sync", function () {
                    assert(Augur.getNumOutcomes(event_id) === '2');
                });
                it("async", function () {
                    Augur.getNumOutcomes(event_id, function (r) {
                        assert(r === "2");
                    });
                });
            });
        });

        // expiringEvents.se
        describe("expiringEvents.se", function () {
            describe("getEvents(" + branch_id + ", " + vote_period + ")", function () {
                it("sync", function () {
                    var res = Augur.getEvents(branch_id, vote_period);
                });
                it("async", function () {
                    Augur.getEvents(branch_id, vote_period, function (r) {
                    
                    });
                });
            });
        });

        // markets.se
        describe("markets.se", function () {
            describe("getSimulatedBuy(" + market_id + ", " + outcome + ", " + amount + ")", function () {
                it("sync", function () {
                    var r = Augur.getSimulatedBuy(market_id, outcome, amount);
                    is_array(r);
                    assert(r.length === 2);
                    gteq0(r[0]);
                    gteq0(r[1]);
                });
                it("async", function () {
                    Augur.getSimulatedBuy(market_id, outcome, amount, function (r) {
                        is_array(r);
                        assert(r.length === 2);
                        gteq0(r[0]);
                        gteq0(r[1]);
                    });
                });
            });
            describe("getSimulatedSell(" + market_id + ", " + outcome + ", " + amount + ")", function () {
                it("sync", function () {
                    var r = Augur.getSimulatedSell(market_id, outcome, amount);
                    assert(r.length === 2);
                    is_array(r);
                    gteq0(r[0]);
                    gteq0(r[1]);
                });
                it("async", function () {
                    Augur.getSimulatedSell(market_id, outcome, amount, function (r) {
                        assert(r.length === 2);
                        is_array(r);
                        gteq0(r[0]);
                        gteq0(r[1]);
                    });
                });
            });
            describe("getMarketInfo(" + market_id + ")", function () {
                it("sync", function () {
                    var r = Augur.getMarketInfo(market_id);
                    assert(r.description === "unicorn");
                });
                it("async", function () {
                    Augur.getMarketInfo(market_id, function (r) {
                        assert(r.description === "unicorn");
                    });
                });
            });
            describe("getMarketInfo(" + market_id2 + ")", function () {
                it("sync", function () {
                    var r = Augur.getMarketInfo(market_id2);
                    assert(r.description === "lol");
                });
                it("async", function () {
                    Augur.getMarketInfo(market_id2, function (r) {
                        assert(r.description === "lol");
                    });
                });
            });
            describe("getMarketEvents(" + market_id + ")", function () {
                function test(r) {
                    assert(r.constructor === Array);
                    assert(array_equal(r, ['0xd51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591']));
                }
                it("sync", function () {
                    test(Augur.getMarketEvents(market_id));
                });
                it("async", function () {
                    Augur.getMarketEvents(market_id, test);
                });
            });
            describe("getNumEvents(" + market_id + ") === '1'", function () {
                var test = function (r) {
                    assert(r === "1");
                };
                it("sync", function () { test(Augur.getNumEvents(market_id)); });
                it("async", function () { Augur.getNumEvents(market_id, test); });
            });
            describe("getBranchID(" + market_id + ")", function () {
                var test = function (r) {
                    assert(r === "0x00000000000000000000000000000000000000000000000000000000000f69b5");
                };
                it("sync", function () { test(Augur.getBranchID(market_id)); });
                it("async", function () { Augur.getBranchID(market_id, test); });
            });
            describe("getCurrentParticipantNumber(" + market_id + ") >= 0", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getCurrentParticipantNumber(market_id)); });
                it("async", function () { Augur.getCurrentParticipantNumber(market_id, test); });
            });

            describe("getMarketNumOutcomes(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(r === "2");
                };
                it("sync", function () { test(Augur.getMarketNumOutcomes(market_id)); });
                it("async", function () { Augur.getMarketNumOutcomes(market_id, test); });
            });
            describe("getParticipantSharesPurchased(" + market_id + ", " + participant_number + "," + outcome + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getParticipantSharesPurchased(market_id, participant_number, outcome)); });
                it("async", function () { Augur.getParticipantSharesPurchased(market_id, participant_number, outcome, test); });
            });
            describe("getSharesPurchased(" + market_id + ", " + outcome + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getSharesPurchased(market_id, outcome)); });
                it("async", function () { Augur.getSharesPurchased(market_id, outcome, test); });
            });
            describe("getWinningOutcomes(" + market_id + ")", function () {
                var test = function (r) {
                    is_array(r);
                };
                it("sync", function () { test(Augur.getWinningOutcomes(market_id)); });
                it("async", function () { Augur.getWinningOutcomes(market_id, test); });
            });
            describe("price(" + market_id + ", " + outcome + ") ", function () {
                var test = function (r) {
                    assert(parseFloat(r) >= 0.0 && parseFloat(r) <= 1.0);
                };
                it("sync", function () { test(Augur.price(market_id, outcome)); });
                it("async", function () { Augur.price(market_id, outcome, test); });
            });
            describe("getParticipantNumber(" + market_id + ", " + constants.accounts.jack + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getParticipantNumber(market_id, constants.accounts.jack)); });
                it("async", function () { Augur.getParticipantNumber(market_id, constants.accounts.jack, test); });
            });
            describe("getParticipantID(" + market_id + ", " + participant_number + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getParticipantID(market_id, participant_number)); });
                it("async", function () { Augur.getParticipantID(market_id, participant_number, test); });
            });
            describe("getAlpha(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(parseFloat(r).toFixed(6) === "0.078125");
                };
                it("sync", function () { test(Augur.getAlpha(market_id)); });
                it("async", function () { Augur.getAlpha(market_id, test); });
            });
            describe("getCumScale(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(r === "0.00000000000000000005");
                };
                it("sync", function () { test(Augur.getCumScale(market_id)); });
                it("async", function () { Augur.getCumScale(market_id, test); });
            });
            describe("getTradingPeriod(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(r === "70779157");
                };
                it("sync", function () { test(Augur.getTradingPeriod(market_id)); });
                it("async", function () { Augur.getTradingPeriod(market_id, test); });
            });
            describe("getTradingFee(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(r === "10");
                };
                it("sync", function () { test(Augur.getTradingFee(market_id)); });
                it("async", function () { Augur.getTradingFee(market_id, test); });
            });
        });

        // reporting.se
        describe("reporting.se", function () {
            describe("getRepBalance(" + branch_id + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getRepBalance(branch_id, Augur.coinbase)); });
                it("async", function () { Augur.getRepBalance(branch_id, Augur.coinbase, test); });
            });
            describe("getRepByIndex(" + branch_id + ", " + reporter_index + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                };
                it("sync", function () { test(Augur.getRepByIndex(branch_id, reporter_index)); });
                it("async", function () { Augur.getRepByIndex(branch_id, reporter_index, test); });
            });
            describe("getReporterID(" + branch_id + ", " + reporter_index + ") ", function () {
                var test = function (r) {
                    assert(r === "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70");
                };
                it("sync", function () { test(Augur.getReporterID(branch_id, reporter_index)); });
                it("async", function () { Augur.getReporterID(branch_id, reporter_index, test); });
            });
            describe("getReputation(" + reporter_address + ")", function () {
                var test = function (r) {
                    is_array(r);
                    assert(r.length >= 3); // why equal to 5...?
                    for (var i = 0, len = r.length; i < len; ++i)
                        gteq0(r[i]);
                };
                it("sync", function () { test(Augur.getReputation(reporter_address)); });
                it("async", function () { Augur.getReputation(reporter_address, test); });
            });
            describe("getNumberReporters(" + branch_id + ") ", function () {
                var test = function (r) {
                    gteq0(r);
                    assert(parseInt(r) >= 22);
                };
                it("sync", function () { test(Augur.getNumberReporters(branch_id)); });
                it("async", function () { Augur.getNumberReporters(branch_id, test); });
            });
            describe("repIDToIndex(" + branch_id + ") ", function () {
                var test = function (r) {
                    
                };
                it("sync", function () { test(Augur.repIDToIndex(branch_id, "0")); });
                it("async", function () { Augur.repIDToIndex(branch_id, "0", test); });
            });
            describe("hashReport([ballot], " + salt + ") ", function () {
                var test = function (r) {
                    // TODO double-check this
                    assert(r === "0xa5ea8e72fa70be0521a240201dedd1376599a9a935be4977d798522bcfbc29de");
                };
                it("sync", function () { test(Augur.hashReport(ballot, salt)); });
                it("async", function () { Augur.hashReport(ballot, salt, test); });
            });
            Augur.tx.reputationFaucet.send = false;
            Augur.tx.reputationFaucet.returns = "number";
            describe("reputationFaucet(" + branch_id + ") ", function () {
                var test = function (r) {
                    assert(r === "1");
                };
                it("sync", function () { test(Augur.reputationFaucet()); });
                it("async", function () { Augur.reputationFaucet(test); });
            });
        });

        // buy&sellShares.se
        describe("buy&sellShares.se", function () {
            describe("getNonce(" + market_id + ") ", function () {
                var test = function (r) {
                    assert(r === "0");
                };
                it("sync", function () { test(Augur.getNonce(market_id)); });
                it("async", function () { Augur.getNonce(market_id, test); });
            });
            describe("buyShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [call] ", function () {
                var test = function (r) {
                    is_not_zero(r);
                };
                it("sync", function () {
                    Augur.tx.buyShares.send = false;
                    test(Augur.buyShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null
                    }));
                });
                it("async", function () {
                    Augur.tx.buyShares.send = false;
                    Augur.buyShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null,
                        onSent: test
                    });
                });
            });
            describe("sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [call] ", function () {
                var test = function (r) {
                    is_not_zero(r);
                };
                it("sync", function () {
                    Augur.tx.sellShares.send = false;
                    test(Augur.sellShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null
                    }));
                });
                it("async", function () {
                    Augur.tx.sellShares.send = false;
                    Augur.sellShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null,
                        onSent: test
                    });
                });
            });
            describe("buyShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [sendTx] ", function () {
                var test = function (r) {
                    is_not_zero(r);
                };
                it("sync", function () {
                    var amount = (Math.random() * 10).toString();
                    Augur.tx.buyShares.send = true;
                    test(Augur.buyShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null
                    }));
                });
                it("async", function () {
                    var amount = (Math.random() * 10).toString();
                    Augur.tx.buyShares.send = true;
                    Augur.buyShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null,
                        onSent: test
                    });
                });
            });
            describe("sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [sendTx] ", function () {
                var test = function (r) {
                    is_not_zero(r);
                };
                it("sync", function () {
                    var amount = (Math.random() * 10).toString();
                    Augur.tx.sellShares.send = true;
                    test(Augur.sellShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null
                    }));
                });
                it("async", function () {
                    var amount = (Math.random() * 10).toString();
                    Augur.tx.sellShares.send = true;
                    Augur.sellShares({
                        branchId: branch_id,
                        marketId: market_id,
                        outcome: outcome,
                        amount: amount,
                        nonce: null,
                        onSent: test
                    });
                });
            });
        });

        // createBranch.se

        // p2pWagers.se

        // sendReputation.se
        // call: returns rep amount sent
        describe("sendReputation.se", function () {
            describe("sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [call] ", function () {
                it("async", function () {
                    Augur.tx.sendReputation.send = false;
                    Augur.tx.sendReputation.returns = "unfix";
                    Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                        is_not_zero(r);
                        assert(r === amount);
                        // sendTx: returns txhash
                        Augur.tx.sendReputation.send = true;
                        Augur.tx.sendReputation.returns = undefined;
                        Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                            // print("sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [sendTx] -> " + r);
                            is_not_zero(r);
                            var larger_amount = "9000"; // should fail
                            Augur.tx.sendReputation.send = false;
                            Augur.tx.sendReputation.returns = "number";
                            Augur.sendReputation(branch_id, receiving_account, larger_amount, function (r) {
                                // print("sendReputation(" + branch_id + ", " + receiving_account + ", " + larger_amount + ") [call] -> " + r);
                                assert(r === "0");
                                Augur.tx.sendReputation.send = true;
                                Augur.tx.sendReputation.returns = undefined;
                            });
                        });
                    });
                });
            });
        });

        // transferShares.se

        // makeReports.se

        // createEvent.se
        describe("createEvent.se", function () {
            describe("createEvent: \"" + event_description + "\"", function () {
                it("async", function () {
                    var expDate = "300000";
                    var minValue = "1";
                    var maxValue = "2";
                    var numOutcomes = "2";
                    Augur.createEvent({
                        branchId: branch_id,
                        description: event_description,
                        expDate: expDate,
                        minValue: minValue,
                        maxValue: maxValue,
                        numOutcomes: numOutcomes,
                        onSent: function (r) {
                            print("sent: " + JSON.stringify(r, null, 2));
                            is_object(r);
                            !is_empty(r);
                            is_not_zero(r.id);
                            is_not_zero(r.txhash);
                        },
                        onSuccess: function (r) {
                            print("success: " + JSON.stringify(r, null, 2));
                            is_object(r);
                            !is_empty(r);
                            is_not_zero(r.id);
                            is_not_zero(r.txhash);
                            assert(r.branch === branch_id);
                            assert(r.expirationDate === expDate);
                            assert(r.minValue === minValue);
                            assert(r.maxValue === maxValue);
                            assert(r.numOutcomes === numOutcomes);
                            assert(r.description.slice(-5) === event_description.slice(-5));
                        }
                    });
                });
            });
        });

        // // createMarket.se
        // describe("createMarket.se", function () {
        //     describe("createMarket: \"" + market_description + "\"", function () {
        //         it("async", function () {
        //             var alpha = "0.0079";
        //             var initialLiquidity = "100";
        //             var tradingFee = "0.01";
        //             var events = ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"];
        //             Augur.createMarket({
        //                 branchId: branch_id,
        //                 description: market_description,
        //                 alpha: alpha,
        //                 initialLiquidity: initialLiquidity,
        //                 tradingFee: tradingFee,
        //                 events: events,
        //                 onSent: function (r) {
        //                     print("sent: " + JSON.stringify(r, null, 2));
        //                     is_object(r);
        //                     !is_empty(r);
        //                     is_not_zero(r.id);
        //                     is_not_zero(r.txhash);
        //                 },
        //                 onSuccess: function (r) {
        //                     print("createMarket: \"" + market_description + "\"");
        //                     print("success: " + JSON.stringify(r, null, 2));
        //                     is_object(r);
        //                     !is_empty(r);
        //                     is_not_zero(r.id);
        //                     is_not_zero(r.txhash);
        //                     assert(r.numOutcomes === numOutcomes);
        //                     // assert(r.alpha === alpha); // rounding error WTF?
        //                     assert(r.numOutcomes === numOutcomes);
        //                     assert(r.tradingFee === tradingFee);
        //                     assert(r.description.slice(-5) === market_description.slice(-5));
        //                 },
        //                 onFailed: function (r) {
        //                     print("createMarket: \"" + market_description + "\"");
        //                     print("failed: " + JSON.stringify(r, null, 2));
        //                     is_object(r);
        //                     !is_empty(r);
        //                 }
        //             });
        //         });
        //     });
        // });

        // closeMarket.se
        describe("closeMarket.se", function () {
            describe("closeMarket(" + branch_id + ", " + market_id + ") [call] ", function () {
                it("async", function () {
                    Augur.tx.closeMarket.send = false;
                    Augur.tx.closeMarket.returns = "number";
                    Augur.closeMarket(branch_id, market_id, function (r) {
                        print("closeMarket: " + r);
                    });
                    Augur.tx.closeMarket.send = true;
                    Augur.tx.closeMarket.returns = undefined;
                });
            });
        });

        // dispatch.se
        describe("dispatch.se", function () {
            describe("dispatch(" + branch_number + ") [call] ", function () {
                it("async", function () {
                    Augur.tx.dispatch.send = false;
                    Augur.tx.dispatch.returns = "number";
                    Augur.dispatch(branch_number, function (r) {
                        print("dispatch: " + r);
                    });
                    Augur.tx.dispatch.send = true;
                    Augur.tx.dispatch.returns = undefined;
                });
            });
        });
    });
})();
