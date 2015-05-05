#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */
(function () {
    var Tests = function (async) {
        var tx, print, assert, callback;

        if (typeof(module) != 'undefined') {
            var BigNumber = require('bignumber.js');
            var Augur = require('./../augur');
            var crypto = require('crypto');
            var constants = require('./constants');
        }

        print = console.log;
        assert = console.assert;
    
        Augur.async = async;
        Augur.BigNumberOnly = false;

        if (async) {
            print("###############################\n"+
                  "# asynchronous augur.js tests #\n"+
                  "###############################");
            callback = print;
        } else {
            print("##############################\n"+
                  "# synchronous augur.js tests #\n"+
                  "##############################");
        }

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
                output += send + " " + tx.to + ": " + tx.method + "(" + params + ")";
                if (!showsig || showsig !== "signature") {
                    output += " -> " + returns;
                }
                print(output);
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
                print(res);
                check_results(res, expected, apply);
            }
        }
        function test(tx, expected, apply) {
            var res;
            var tx = Augur.clone(tx);
            if (tx.send === undefined) {
                tx.send = false;
                runtest(tx, expected, apply);
            } else {
                runtest(tx, expected, apply);
            }
        }
        function rpctest(method, command, expected, params) {
            var res;
            print("   - " + method + "(" + command + ")");
            if (Augur.async) {
                Augur[method](command, params, function (res) {
                    if (expected.constructor === Function) {
                        assert(expected(res));
                    } else {
                        assert(expected === res);
                    }
                });
            } else {
                res = Augur[method](command, params);
                if (expected.constructor === Function) {
                    assert(expected(res));
                } else {
                    assert(expected === res);
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
            assert(r.id != "0" && r.id != "0x" && r.id != "0x0" && parseInt(r) != 0);
        }

        print("  utility functions");
        var ex_integer = 12345678901;
        var ex_decimal = 0.123456789;
        var ex_integer_hex = "0x2dfdc1c35";
        var ex_integer_string = "12345678901";
        var ex_decimal_string = "0.123456789";
        print("   - bignum");
        assert(Augur.bignum(ex_decimal).eq(Augur.bignum(ex_decimal_string)));
        print("   - fix");
        assert(Augur.fix(ex_decimal, "BigNumber").eq((new BigNumber(ex_decimal)).mul(Augur.ONE).round()));
        assert(Augur.fix(ex_decimal, "string") === "2277375790844960561");
        assert(Augur.fix(ex_decimal_string, "hex") === "0x1f9add3739635f31");
        print("   - unfix");
        assert(Augur.unfix(Augur.fix(ex_integer_hex, "BigNumber"), "hex") === ex_integer_hex);
        assert(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "string") === ex_integer_string);
        assert(Augur.unfix(Augur.fix(ex_integer_string, "BigNumber"), "number") === ex_integer);

        print("  ethereum json-rpc wrapper");
        print("   - coinbase");
        assert(Augur.coinbase.length === 42);
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
            print("warning: no whisper support found (geth --shh)");
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

        print("  contract abi data serialization") // no rpc => always synchronous
        tx = {
            to: constants.examples.ten,
            method: "ten",
            send: false,
            returns: "number"
        };
        abi_test(tx, "0x643ceff9");
        tx = {
            to: Augur.contracts.cash,
            method: "faucet",
            send: false
        };
        abi_test(tx, "0xde5f72fd");
        tx = {
            to: constants.examples.mul2,
            method: "double",
            signature: "i",
            params: [3],
            returns: "number"
        };
        abi_test(tx, "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003");
        tx = {
            to: constants.examples.multiplier,
            method: "multiply",
            signature: "ii",
            params: [2, 3],
            returns: "number"
        };
        abi_test(tx, "0x3c4308a800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003");
        tx = {
            to: Augur.contracts.branches,
            method: "getMarkets",
            signature: "i",
            params: 1010101,
            returns: "array"
        };
        abi_test(tx, "0xb3903c8a00000000000000000000000000000000000000000000000000000000000f69b5");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.createEvent,
            method: "createEvent",
            signature: "isiiii",
            params: [1010101, "augur ragefest 2015", 250000, 1, 2, 2],
            gas: 2500000
        };
        abi_test(tx, "0x74cd7d2000000000000000000000000000000000000000000000000000000000000001300000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000000000000000003d09000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000261756775722072616765666573742032303135");
        tx = {
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
        abi_test(tx, "0x45d96cd70000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000f69b50000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000000004000000000000006d61726b657420666f7220726167656665737473b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c4f37814757b7d0e2dde46de18bb4bf4a85e6716a06849d5cfcebf8f1d7270b12412b3c588f9be08d54e99bf5095ef910c5e84080f048e3af8a2718b7b693cb83");
        // negative hash
        tx = {
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
        abi_test(tx, "0x45d96cd70000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000f69b5000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a0000000000000000756e69636f726e7320617265207265616cd51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.branches,
            method: "getBranches"
        };
        abi_test(tx, "0xc3387858");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.branches,
            method: "getVotePeriod",
            signature: "i",
            params: 1010101
        };
        abi_test(tx, "0x7a66d7ca00000000000000000000000000000000000000000000000000000000000f69b5");
        tx = {
            to: Augur.contracts.info,
            method: "getDescription",
            signature: "i",
            send: false,
            params: "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        };
        abi_test(tx, "0x37e7ee00b2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");
        tx = {
            from: Augur.coinbase,
            to: Augur.contracts.events,
            method: "getEventInfo",
            signature: "i",
            params: "0xb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c"
        };
        abi_test(tx, "0x1aecdb5bb2a6de45f349b5ac384b01a785e640f519f0a8597ab2031c964c7f572d96b13c");

        if (!Augur.async) print("  example contract functions");
        else print("  invoke contract functions");
        // No parameters
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x3caf506cf3d5bb16ba2c8f89a6591c5160d69cf3","data":"0x643ceff9"}],"id":1}' http://127.0.0.1:8545
        tx = {
            to: constants.examples.ten,
            method: "ten",
            send: false,
            returns: "number"
        };
        test(tx, "10");
        tx.returns = "bignumber";
        test(tx, new BigNumber(10), String);
        // Single integer parameter
        // curl --data '{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89","to":"0x5204f18c652d1c31c6a5968cb65e011915285a50","data":"0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000003","gas":"0x2dc6c0"}],"id":1}' http://127.0.0.1:8545
        tx = {
            to: constants.examples.mul2,
            method: "double",
            signature: "i",
            params: [3],
            returns: "number"
        };
        test(tx, "6");
        tx.params = 100;
        test(tx, "200");
        tx.params = 22121;
        test(tx, "44242");
        // multiple integer parameters
        tx = {
            to: constants.examples.multiplier,
            method: "multiply",
            signature: "ii",
            params: [2, 3],
            returns: "number"
        };
        test(tx, "6");
        tx.params = [123, 321];
        test(tx, "39483");

        if (!Augur.async) print("  augur contract functions (invoke)");
        tx = {
            to: Augur.contracts.cash,
            method: "faucet",
            send: false
        };
        test(tx, "0x0000000000000000000000000000000000000000000000000000000000000001");
        tx.returns = "number";
        test(tx, "1");
        // Single integer parameter, array return value
        tx = {
            to: Augur.contracts.branches,
            method: "getMarkets",
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
        );

        if (Augur.async) {

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
            Augur.getCashBalance(Augur.coinbase, function (r) {
                print("   - getCashBalance(" + Augur.coinbase + ") -> " + r);
                is_not_zero(r);
                Augur.getCashBalance(receiving_account, function (r) {
                    print("   - getCashBalance(" + receiving_account + ") -> " + r);
                    Augur.tx.sendCash.send = false;
                    Augur.tx.sendCash.returns = "unfix";
                    Augur.sendCash(receiving_account, amount, function (r) {
                        print("   - sendCash(" + receiving_account + ", " + amount + ") [call] -> " + r);
                        is_not_zero(r);
                        assert(r === amount);
                        Augur.tx.sendCash.send = true;
                        Augur.tx.sendCash.returns = undefined;
                        Augur.sendCash(receiving_account, amount, function (r) {
                            print("   - sendCash(" + receiving_account + ", " + amount + ") [sendTx] -> " + r);
                            is_not_zero(r);
                            // TODO check that balances actually changed
                        });
                    });
                });
            });
            Augur.tx.cashFaucet.send = false;
            Augur.tx.cashFaucet.returns = "number";
            Augur.cashFaucet(function (r) {
                print("   - cashFaucet() [call]")
                assert(r === "1")
            });
            Augur.tx.cashFaucet.send = true;
            Augur.tx.cashFaucet.returns = undefined;
            Augur.cashFaucet(function (r) {
                print("   - cashFaucet() [sendTx]")
                is_not_zero(r);
            });

            // info.se
            Augur.getCreator(event_id, function (r) {
                print("   - getCreator(" + event_id + ") [event]");
                assert(r === "0x00000000000000000000000063524e3fe4791aefce1e932bbfb3fdf375bfad89");
            });
            Augur.getCreator(market_id, function (r) {
                print("   - getCreator(" + market_id + ") [market]");
                assert(r === "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70");
            });
            Augur.getCreationFee(event_id, function (r) {
                print("   - getCreationFee(" + event_id + ") [event]");
                assert(r === "0.00000000000000000244");
            });
            Augur.getCreationFee(market_id, function (r) {
                print("   - getCreationFee(" + market_id + ") [market]");
                assert(r === "10");
            });
            Augur.getDescription(event_id, function (r) {
                print("   - getDescription(" + event_id + ")");
                assert(r.slice(-9) === "ragefest!");
            });

            // branches.se
            Augur.getBranches(function (r) {
                print("   - getBranches");
                assert(r.length >= 3);
                is_array(r);
            });
            Augur.getMarkets(branch_id, function (r) {
                print("   - getMarkets(" + branch_id + ")");
                is_array(r);
                assert(r.length > 1);
                assert(r[0] === "0x00000000000000000000000000000000000000000000000000000000000000e8");
                assert(r[1] === "0x00000000000000000000000000000000000000000000000000000000000000e8");
            });
            Augur.getPeriodLength(branch_id, function (r) {
                print("   - getPeriodLength(" + branch_id + ") -> " + r);
                assert(r === "20");
            });
            Augur.getVotePeriod(branch_id, function (r) {
                print("   - getVotePeriod(" + branch_id + ") -> " + r);
                assert(parseInt(r) >= 2);
            });
            Augur.getStep(branch_id, function (r) {
                print("   - getStep(" + branch_id + ") -> " + r);
                assert(parseInt(r) >= 0 && parseInt(r) <= 9);
            });
            Augur.getNumMarkets(branch_id, function (r) {
                print("   - getNumMarkets(" + branch_id + ") -> " + r);
                assert(parseInt(r) >= 120);
            });
            Augur.getMinTradingFee(branch_id, function (r) {
                print("   - getMinTradingFee(" + branch_id + ") -> " + r);
                assert(parseFloat(r) >= 0.0 && parseFloat(r) <= 1.0);
            });
            Augur.getNumBranches(function (r) {
                print("   - getNumBranches() -> " + r);
                assert(parseInt(r) >= 3);
            });
            Augur.getBranch(branch_number, function (r) {
                print("   - getBranch(" + branch_number + ") -> " + r);
                assert(r === "0x7f5026f174d59f6f01ff3735773b5e3adef0b9c98f8a8e84e0000f034cfbf35a");
            });

            // events.se
            Augur.getEventInfo(event_id, function (r) {
                print("   - getEventInfo(" + event_id + ")");
                on_root_branch(r);
                assert(r.expirationDate === "250000");
                assert(r.description.slice(-9) === "ragefest!");
            });
            // TODO getEventBranch
            Augur.getExpiration(event_id, function (r) {
                print("   - getExpiration(" + event_id + ") -> " + r);
                assert(r === "250000");
            });
            // TODO getOutcome
            Augur.getMinValue(event_id, function (r) {
                print("   - getMinValue(" + event_id + ") -> " + r);
                assert(r === "1");
            });
            Augur.getMaxValue(event_id, function (r) {
                print("   - getMaxValue(" + event_id + ") -> " + r);
                assert(r === "2");
            });
            Augur.getNumOutcomes(event_id, function (r) {
                print("   - getNumOutcomes(" + event_id + ") -> " + r);
                assert(r === "2");
            });

            // expiringEvents.se
            Augur.getEvents(branch_id, vote_period, function (r) {
                print("   - getEvents(" + branch_id + ", " + vote_period + ") -> " + r);
            });

            // markets.se
            Augur.getSimulatedBuy(market_id, outcome, amount, function (r) {
                print("   - getSimulatedBuy(" + market_id + ", " + outcome + ", " + amount + ")");
                is_array(r);
                assert(r.length === 2);
                gteq0(r[0]);
                gteq0(r[1]);
            });
            Augur.getSimulatedSell(market_id, outcome, amount, function (r) {
                print("   - getSimulatedSell(" + market_id + ", " + outcome + ", " + amount + ")");
                assert(r.length === 2);
                is_array(r);
                gteq0(r[0]);
                gteq0(r[1]);
            });
            Augur.getMarketInfo(market_id, function (r) {
                print("   - getMarketInfo(" + market_id + ")");
                assert(r.description.slice(-7) === "unicorn");
            });
            Augur.getMarketInfo(market_id2, function (r) {
                print("   - getMarketInfo(" + market_id2 + ")");
                assert(r.description.slice(-3) === "lol");
            });
            Augur.getMarketEvents(market_id, function (r) {
                print("   - getMarketEvents(" + market_id + ")");
                assert(r.constructor === Array);
                assert(array_equal(r, ['0xd51ce0fe7b05c1ee5eae85ee1c039ce63483cef311c94df071fd9cfb64e0c591']));
            });
            Augur.getNumEvents(market_id, function (r) {
                print("   - getNumEvents(" + market_id + ") -> " + r);
                assert(r === "1");
            });
            Augur.getBranchID(market_id, function (r) {
                print("   - getBranchID(" + market_id + ") -> " + r);
                assert(r === "0x00000000000000000000000000000000000000000000000000000000000f69b5");
            });
            Augur.getCurrentParticipantNumber(market_id, function (r) {
                print("   - getCurrentParticipantNumber(" + market_id + ") -> " + r);
                gteq0(r);
            });
            Augur.getMarketNumOutcomes(market_id, function (r) {
                print("   - getMarketNumOutcomes(" + market_id + ") -> " + r);
                assert(r === "2");
            });
            Augur.getParticipantSharesPurchased(market_id, participant_number, outcome, function (r) {
                print("   - getParticipantSharesPurchased(" + market_id + ", " + participant_number + "," + outcome + ") -> " + r);
                gteq0(r);
            });
            Augur.getSharesPurchased(market_id, outcome, function (r) {
                print("   - getSharesPurchased(" + market_id + ", " + outcome + ") -> " + r);
                gteq0(r);
            });
            Augur.getWinningOutcomes(market_id, function (r) {
                print("   - getWinningOutcomes(" + market_id + ")");
                is_array(r);
            });
            Augur.price(market_id, outcome, function (r) {
                print("   - price(" + market_id + ", " + outcome + ") -> " + r);
                assert(parseFloat(r) >= 0.0 && parseFloat(r) <= 1.0);
            });
            Augur.getParticipantNumber(market_id, constants.accounts.jack, function (r) {
                print("   - getParticipantNumber(" + market_id + ", " + constants.accounts.jack + ") -> " + r);
                gteq0(r);
            });
            Augur.getParticipantID(market_id, participant_number, function (r) {
                print("   - getParticipantID(" + market_id + ", " + participant_number + ") -> " + r);
            });
            Augur.getAlpha(market_id, function (r) {
                print("   - getAlpha(" + market_id + ") -> " + r);
                assert(parseFloat(r).toFixed(6) === "0.078125");
            });
            Augur.getCumScale(market_id, function (r) {
                print("   - getCumScale(" + market_id + ") -> " + r);
                assert(r === "0.00000000000000000005");
            });
            Augur.getTradingPeriod(market_id, function (r) {
                print("   - getTradingPeriod(" + market_id + ") -> " + r);
                assert(r === "70779157");
            });
            Augur.getTradingFee(market_id, function (r) {
                print("   - getTradingFee(" + market_id + ") -> " + r);
                assert(r === "10");
            });

            // reporting.se
            Augur.getRepBalance(branch_id, Augur.coinbase, function (r) {
                print("   - getRepBalance(" + branch_id + ") -> " + r);
                gteq0(r);
            });
            Augur.getRepByIndex(branch_id, reporter_index, function (r) {
                print("   - getRepByIndex(" + branch_id + ", " + reporter_index + ") -> " + r);
                gteq0(r);
            });
            Augur.getReporterID(branch_id, reporter_index, function (r) {
                print("   - getReporterID(" + branch_id + ", " + reporter_index + ") -> " + r);
                assert(r === "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70");
            });
            Augur.getReputation(reporter_address, function (r) {
                print("   - getReputation(" + reporter_address + ")");
                is_array(r);
                assert(r.length >= 3); // why equal to 5...?
                for (var i = 0, len = r.length; i < len; ++i)
                    gteq0(r[i]);
            });
            Augur.getNumberReporters(branch_id, function (r) {
                print("   - getNumberReporters(" + branch_id + ") -> " + r);
                gteq0(r);
                assert(parseInt(r) >= 22);
            });
            Augur.repIDToIndex(branch_id, function (r) {
                print("   - repIDToIndex(" + branch_id + ") -> " + r);
                gteq0(r);
            });
            Augur.hashReport(ballot, salt, function (r) {
                print("   - hashReport([ballot], " + salt + ") -> " + r);
                // TODO double-check this
                assert(r === "0xa5ea8e72fa70be0521a240201dedd1376599a9a935be4977d798522bcfbc29de");
            });
            Augur.tx.reputationFaucet.send = false;
            Augur.tx.reputationFaucet.returns = "number";
            Augur.reputationFaucet(function (r) {
                print("   - reputationFaucet(" + branch_id + ") -> " + r);
                assert(r === "1");
            });

            // buy&sellShares.se
            Augur.getNonce(market_id, function (r) {
                print("   - getNonce(" + market_id + ") -> " + r);
                assert(r === "0");
            });
            Augur.tx.buyShares.send = false;
            Augur.buyShares({
                branchId: branch_id,
                marketId: market_id,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    print("   - buyShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [call] -> " + r);
                    is_not_zero(r);
                }
            });
            Augur.tx.sellShares.send = false;
            Augur.sellShares({
                branchId: branch_id,
                marketId: market_id,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    print("   - sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [call] -> " + r);
                    is_not_zero(r);
                }
            });
            Augur.tx.buyShares.send = true;
            Augur.buyShares({
                branchId: branch_id,
                marketId: market_id,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    print("   - buyShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [sendTx] -> " + r);
                    is_not_zero(r);
                }
            });
            Augur.tx.sellShares.send = true;
            Augur.sellShares({
                branchId: branch_id,
                marketId: market_id,
                outcome: outcome,
                amount: amount,
                nonce: null,
                onSent: function (r) {
                    print("   - sellShares(" + branch_id + ", " + market_id + ", " + outcome + ", " + amount + ", null) [sendTx] -> " + r);
                    is_not_zero(r);
                }
            });

            // createBranch.se

            // p2pWagers.se

            // sendReputation.se
            // call: returns rep amount sent
            Augur.tx.sendReputation.send = false;
            Augur.tx.sendReputation.returns = "unfix";
            Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                print("   - sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [call] -> " + r);
                is_not_zero(r);
                assert(r === amount);
                // sendTx: returns txhash
                Augur.tx.sendReputation.send = true;
                Augur.tx.sendReputation.returns = undefined;
                Augur.sendReputation(branch_id, receiving_account, amount, function (r) {
                    print("   - sendReputation(" + branch_id + ", " + receiving_account + ", " + amount + ") [sendTx] -> " + r);
                    is_not_zero(r);
                    var larger_amount = "9000"; // should fail
                    Augur.tx.sendReputation.send = false;
                    Augur.tx.sendReputation.returns = "number";
                    Augur.sendReputation(branch_id, receiving_account, larger_amount, function (r) {
                        print("   - sendReputation(" + branch_id + ", " + receiving_account + ", " + larger_amount + ") [call] -> " + r);
                        assert(r === "0");
                        Augur.tx.sendReputation.send = true;
                        Augur.tx.sendReputation.returns = undefined;
                    });
                });
            });

            // transferShares.se

            // makeReports.se

            // createEvent.se
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
                    print("   - createEvent: \"" + event_description + "\"");
                    print("     -> sent: " + JSON.stringify(r, null, 2));
                    is_object(r);
                    !is_empty(r);
                    is_not_zero(r.id);
                    is_not_zero(r.txhash);
                },
                onSuccess: function (r) {
                    print("   - createEvent: \"" + event_description + "\"");
                    print("     -> success: " + JSON.stringify(r, null, 2));
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

            // createMarket.se
            var alpha = "0.0079";
            var initialLiquidity = "100";
            var tradingFee = "0.01";
            var events = ["-0x2ae31f0184fa3e11a1517a11e3fc6319cb7c310cee36b20f8e0263049b1f3a6f"];
            Augur.createMarket({
                branchId: branch_id,
                description: market_description,
                alpha: alpha,
                initialLiquidity: initialLiquidity,
                tradingFee: tradingFee,
                events: events,
                onSent: function (r) {
                    print("   - createMarket: \"" + market_description + "\"");
                    print("     -> sent: " + JSON.stringify(r, null, 2));
                    is_object(r);
                    !is_empty(r);
                    is_not_zero(r.id);
                    is_not_zero(r.txhash);
                },
                onSuccess: function (r) {
                    print("   - createMarket: \"" + market_description + "\"");
                    print("     -> success: " + JSON.stringify(r, null, 2));
                    is_object(r);
                    !is_empty(r);
                    is_not_zero(r.id);
                    is_not_zero(r.txhash);
                    assert(r.numOutcomes === numOutcomes);
                    // assert(r.alpha === alpha); // rounding error WTF?
                    assert(r.numOutcomes === numOutcomes);
                    assert(r.tradingFee === tradingFee);
                    assert(r.description.slice(-5) === market_description.slice(-5));
                },
                onFailed: function (r) {
                    print("   - createMarket: \"" + market_description + "\"");
                    print("     -> failed: " + JSON.stringify(r, null, 2));
                    is_object(r);
                    !is_empty(r);
                }
            });

            // // closeMarket.se
            // Augur.tx.closeMarket.send = false;
            // Augur.tx.closeMarket.returns = "number";
            // Augur.closeMarket(branch_id, market_id, function (r) {
            //     print("   - closeMarket(" + branch_id + ", " + market_id + ") [call] -> " + r);
            // });
            // Augur.tx.closeMarket.send = true;
            // Augur.tx.closeMarket.returns = undefined;

            // // dispatch.se
            // Augur.tx.dispatch.send = false;
            // Augur.tx.dispatch.returns = "number";
            // Augur.dispatch(branch_number, function (r) {
            //     print("   - closeMarket(" + branch_id + ", " + market_id + ") [call] -> " + r);
            // });
            // Augur.tx.dispatch.send = true;
            // Augur.tx.dispatch.returns = undefined;
        }
    };
    // Tests(false);
    Tests(true);
})();
