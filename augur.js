/**
 * JavaScript bindings for the Augur API
 * @author Jack Peterson (jack@tinybike.net)
 */
var rpc = {
    protocol: "http",
    host: "127.0.0.1",
    port: 8545,
    async: true
};

var MODULAR = (typeof(module) != 'undefined');
var NODE_JS = MODULAR && process && !process.browser;
if (MODULAR) {
    if (NODE_JS) {
        var httpsync = require('http-sync');
        var XMLHttpRequest = require('xhr2');
    }
    var keccak_256 = require('js-sha3').keccak_256;
    var BigNumber = require('bignumber.js');
}

Array.prototype.loop = function (iterator) {
    var list = this;
    var n = list.length;
    var i = -1;
    var calls = 0;
    var looping = false;
    var iterate = function() {
        calls -= 1;
        i += 1;
        if (i === n) return;
        iterator(list[i], next);
    };
    var loop = function() {
        if (looping) return;
        looping = true;
        while (calls > 0) iterate();
        looping = false;
    };
    var next = function() {
        calls += 1;
        if (typeof setTimeout === 'undefined') loop();
        else setTimeout(iterate, 1);
    };
    next();
};

var Augur = (function (augur, async) {

    BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

    var rpc_url = rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString();

    // true for asynchronous (recommended), false for synchronous
    augur.async = (augur && augur.async) || async;
    
    // default gas: 3M
    augur.default_gas = "0x2dc6c0";

    // max number of tx verification attempts
    augur.PINGMAX = 12;

    // constants
    augur.MAXBITS = new BigNumber(2).toPower(256);
    augur.ONE = augur.NO = new BigNumber(2).toPower(64);
    augur.TWO = augur.YES = new BigNumber(2).toPower(65);
    augur.BAD = (new BigNumber(2).toPower(63)).mul(new BigNumber(3));
    augur.ETHER = new BigNumber(10).toPower(18);
    augur.AGAINST = 1; // against: "won't happen"
    augur.ON = 2;      // on: "will happen"

    augur.coinbase = json_rpc(postdata("coinbase"), false);
    augur.id = 1;
    augur.data = {};
    
    // createMarket error codes
    augur.ERRORS = {
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
            code: -1,
            message: "bad input or parent doesn't exist"
        },
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": {
            code: -2,
            message: "too many events"
        },
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": {
            code: -3,
            message: "too many outcomes"
        },
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc": {
            code: -4,
            message: "not enough money or market already exists"
        }
    };

    augur.contracts = {
        // Data and API
        cash: "0xf1d413688a330839177173ce98c86529d0da6e5c",
        info: "0x910b359bb5b2c2857c1d3b7f207a08f3f25c4a8b",
        branches: "0x13dc5836cd5638d0b81a1ba8377a7852d41b5bbe",
        events: "0xb71464588fc19165cbdd1e6e8150c40df544467b",
        expiringEvents: "0x61d90fd4c1c3502646153003ec4d5c177de0fb58",
        fxpFunctions: "0xdaf26192091449d14c03026f79272e410fce0908",
        markets: "0x75ee234fe5ef1cd493c2af38a2ae7d0d0cba01f5",
        reporting: "0xd1f7f020f24abca582366ec80ce2fef6c3c22233",
        whitelist: "0x21dbe4a05a9174e96e6c6bc1e05a7096338cb0d6",
        // Functions
        checkQuorum: "0x4eaa7a8b00107bbc11909e327e163b067fd3cfb9",
        buyAndsellShares: "0xfde83609d8bd5e4bfd6479af2b1cb28c85f0bce7",
        createBranch: "0x5c955b31ac72c83ffd7562aed4e2100b2ba09a3b",
        p2pWagers: "",
        sendReputation: "0x049487d32b727be98a4c8b58c4eab6521791f288",
        transferShares: "0x78da82256f5775df22eee51096d27666772b592d",
        makeReports: "0x72f249c06299308e5b7aaaa4d155ed61a1f66671",
        createEvent: "0xcae6d5912033d66650894e2ae8c2f7502eaba15c",
        createMarket: "0x386acc6b970aea7c6f9b87e7622d2ae7c18d377a",
        closeMarket: "",
        dispatch: "0x9bb646e3137f1d43e4a31bf8a6377c299f26727d",
        //Consensus
        statistics: "0x0cb1277671d162b2f5c81e9435744f63768398d0",
        interpolate: "0xeb51564b43068745ae80136fcefe3ca532617a87",
        center: "0xcff950797165df23550b6d79fa98e55d4c250fbe",
        score: "0x7e6a5373193e42e77133b44707e6dbce92adc6f4",
        adjust: "0xfd268b3d161e0af75e487950d44e23c91229eb7f",
        resolve: "0x82a0ce86301c4f1832f78a324c20dd981e21d57b",
        payout: "0x0a4184e2bc58669fb78a9bcee0cc1ab0da9d3ce3",
        redeem_interpolate: "0x6e87d29e2b80d1cfeff57f782dcb57cd2cc15d2d",
        redeem_center: "0x1f0571210c03efb7a616ed8a29d408a81cefe846",
        redeem_score: "0xcd2f28fe067ea3cdc3b55f1a1e62cb347118b04c",
        redeem_adjust: "0x562cc65e8d901f03bbeb6d83011bbd48ad1d377e",
        redeem_resolve: "0xa9b43b17ed17106f075960f9b9af38c330df9471",
        redeem_payout: "0xe995724195e58489f75c2e12247ce28bf50a5245"
    };

    function log(msg) {
        var output = "[augur.js] ";
        if (msg) {
            if (msg.constructor == Object || msg.constructor == Array) {
                output += JSON.stringify(msg, null, 2);
            } else {
                output += msg.toString();
            }
            console.log(output);
        }
    }

    function parse_array(string, stride, init, bignum) {
        stride = stride || 64;
        var elements = (string.length - 2) / stride;
        var array = Array(elements);
        var position = init || 2;
        for (var i = 0; i < elements; ++i) {
            array[i] = "0x" + string.slice(position, position + stride);
            if (bignum) {
                array[i] = new BigNumber(array[i]);
            }
            position += stride;
        }
        return array.slice(1);
    }

    function encode_int(value) {
        var cs = [];
        var x = new BigNumber(value);
        while (x.gt(new BigNumber(0))) {
            cs.push(String.fromCharCode(x.mod(new BigNumber(256))));
            x = x.dividedBy(new BigNumber(256)).floor();
        }
        return (cs.reverse()).join('');
    }

    function encode_hex(str) {
        var byte, hex = '';
        for (var i = 0, len = str.length; i < len; ++i) {
            byte = str.charCodeAt(i).toString(16);
            if (byte.length === 1) byte = "0" + byte;
            hex += byte;
        }
        return hex;
    }

    function decode_hex(hexx) {
        var hex = hexx.toString();
        var substr, str = '';
        var foundNonzero = 0;
        for (var i = 0; i < hex.length; i += 2) {
            substr = hex.substr(i, 2);
            if (foundNonzero > 1 || substr != '00') {
                str += String.fromCharCode(parseInt(substr, 16));
                foundNonzero++;
            }
        }
        return str;
    }

    function zeropad(r, ishex) {
        var output = r;
        if (!ishex) output = encode_hex(output);
        while (output.length < 64) {
            output = '0' + output;
        }
        return output;
    }

    function encode_abi(arg, base, sub, arrlist) {
        if (arrlist && arrlist.slice(-2) === "[]") {
            var res, o = '';
            for (var j = 0, l = arg.length; j < l; ++j) {
                res = encode_abi(arg[j], base, sub, arrlist.slice(0,-1));
                o += res.normal_args;
            }
            return {
                len_args: zeropad(encode_int(arg.length)),
                normal_args: '',
                var_args: o
            };
        } else {
            var len_args = normal_args = var_args = '';
            if (arg) {
                if (base === "string") {
                    len_args = zeropad(encode_int(arg.length));
                    var_args = encode_hex(arg);
                }
                if (base === "int") {
                    if (arg.constructor === Number) {
                        normal_args = zeropad(encode_int((new BigNumber(arg)).mod(augur.MAXBITS).toFixed()));
                    } else if (arg.constructor === String) {
                        if (arg.slice(0,1) === '-') {
                            normal_args = zeropad(encode_int((new BigNumber(arg)).mod(augur.MAXBITS).toFixed()));
                        } else if (arg.slice(0,2) === "0x") {
                            normal_args = zeropad(arg.slice(2), true);
                        } else {
                            normal_args = zeropad(encode_int(new BigNumber(arg).mod(augur.MAXBITS)));
                        }
                    }
                }
            }
            return {
                len_args: len_args,
                normal_args: normal_args,
                var_args: var_args
            }
        }
    }

    function get_prefix(funcname, signature) {
        signature = signature || "";
        var summary = funcname + "(";
        for (var i = 0, len = signature.length; i < len; ++i) {
            switch (signature[i]) {
                case 's':
                    summary += "string"; // change to bytes?
                    break;
                case 'i':
                    summary += "int256";
                    break;
                case 'a':
                    summary += "int256[]";
                    break;
                default:
                    summary += "weird";
            }
            if (i != len - 1) summary += ",";
        }
        var prefix = keccak_256(summary + ")").slice(0, 8);
        while (prefix.slice(0, 1) === '0') {
            prefix = prefix.slice(1);
        }
        return "0x" + prefix;
    }

    function format_result(returns, result) {
        var returns = returns.toLowerCase();
        try {
            if (returns === "array") {
                result = parse_array(result);
            } else if (returns === "int") {
                result = parseInt(result);
            } else if (returns === "bignumber") {
                result = new BigNumber(result);
            } else if (returns === "string") {
                result = decode_hex(result);
            }
        } catch (exc) {
            log(exc);
        }
        return result;
    }

    function parse(response, returns, async, callback) {
        var response = JSON.parse(response);
        if (response.error) {
            console.error(
                "[" + response.error.code + "]",
                response.error.message
            );
        } else {
            if (response.result) {
                if (returns) {
                    response = format_result(returns, response.result);
                } else {
                    response = response.result;
                }
            }
            if (async && response && callback) {
                callback(response);
            } else {
                if (response.result && callback) {
                    return callback(response);
                } else if (response.result) {
                    return response.result;
                } else {
                    return response;
                }
            }
        }
    }

    function strip_returns(tx) {
        var returns;
        if (tx && tx.params && tx.params[0] && tx.params[0].returns) {
            returns = tx.params[0].returns;
            delete tx.params[0].returns;
        }
        return returns;
    }

    // post json-rpc command to ethereum client
    function json_rpc(command, async, callback) {
        var returns, req = null;
        returns = strip_returns(command);
        var command = JSON.stringify(command);
        async = (async !== undefined) ? async : augur.async;
        if (NODE_JS) {
            if (async) {
                req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        parse(req.responseText, returns, async, callback);
                    }
                };
                req.open("POST", rpc_url, true);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
            } else {
                if (httpsync && httpsync.request && httpsync.request.constructor === Function) {
                    req = httpsync.request({
                        protocol: rpc.protocol,
                        host: rpc.host,
                        path: '/',
                        port: rpc.port,
                        method: 'POST'
                    });
                    req.write(command);
                    return parse((req.end()).body.toString(), returns, async, callback);
                }
            }
        } else {
            if (window.XMLHttpRequest) {
                req = new window.XMLHttpRequest();
            } else {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (async) {
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        parse(req.responseText, returns, async, callback);
                    }
                };
                req.open("POST", rpc_url, true);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
            } else {            
                req.open("POST", rpc_url, false);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
                return parse(req.responseText, returns, async, callback);
            }
        }
    }

    function postdata(command, params, prefix) {
        augur.data = {
            id: augur.id++,
            jsonrpc: "2.0"
        };
        if (prefix === "null") {
            augur.data.method = command.toString();
        } else {
            augur.data.method = (prefix || "eth_") + command.toString();
        }
        if (params) {
            if (params.constructor === Array) {
                augur.data.params = params;
            } else {
                augur.data.params = [params];
            }
        } else {
            augur.data.params = [];
        }
        return augur.data;
    }

    augur.clone = function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    augur.range = function (start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }

    // Ethereum RPC wrapper

    augur.rpc = function (command, params, f) {
        return json_rpc(postdata(command, params, "null"), augur.async, f);
    };
    augur.eth = function (command, params, f) {
        return json_rpc(postdata(command, params), augur.async, f);
    };
    augur.net = function (command, params, f) {
        return json_rpc(postdata(command, params, "net_"), augur.async, f);
    };
    augur.web3 = function (command, params, f) {
        return json_rpc(postdata(command, params, "web3_"), augur.async, f);
    };
    augur.db = function (command, params, f) {
        return json_rpc(postdata(command, params, "db_"), augur.async, f);
    };
    augur.shh = function (command, params, f) {
        return json_rpc(postdata(command, params, "shh_"), augur.async, f);
    };
    augur.sha3 = augur.hash = function (data, f) {
        if (data) {
            if (data.constructor === Array || data.constructor === Object) {
                data = JSON.stringify(data);
            }
            return json_rpc(postdata("sha3", data.toString(), "web3_"), augur.async, f);
        }
    };
    augur.gasPrice = function (f) {
        return json_rpc(postdata("gasPrice"), augur.async, function (data) {
            var gasPrice = parseInt(data.result);
            if (f) {
                return f(gasPrice);
            } else {
                return gasPrice;
            }
        });
    };
    augur.blockNumber = function (f) {
        return json_rpc(postdata("blockNumber"), augur.async, function (data) {
            var blocknum = parseInt(data.result);
            if (f) {
                return f(blocknum);
            } else {
                return blocknum;
            }
        });
    };
    augur.getBalance = augur.balance = function (address, block, f) {
        return json_rpc(postdata("getBalance", [address || augur.coinbase, block || "latest"]), augur.async, f || function (data) {
            var ether = (new BigNumber(data.result)).dividedBy(new BigNumber(10).toPower(18));
            if (augur.async) {
                log(ether);
            } else {
                return ether.toNumber();
            }
        });
    };
    augur.getTransactionCount = augur.txCount = function (address, f) {
        return json_rpc(postdata("getTransactionCount", address || augur.coinbase), augur.async, f);
    };
    augur.pay = function (from, to, value, f) {
        return this.sendTx({ from: from || augur.coinbase, to: to, value: value }, f);
    };
    augur.getTransactionByHash = augur.getTx = function (hash, f) {
        return json_rpc(postdata("getTransactionByHash", hash), augur.async, f);
    };
    augur.peerCount = function (f) {
        if (augur.async) {
            return json_rpc(postdata("peerCount", [], "net_"), augur.async, f);
        } else {
            return parseInt(json_rpc(postdata("peerCount", [], "net_"), augur.async, f));
        }
    };

    // execute functions on contracts on the blockchain
    augur.call = function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : augur.default_gas;
        return json_rpc(postdata("call", tx), augur.async, f);
    };
    augur.sendTransaction = augur.sendTx = function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : augur.default_gas;
        return json_rpc(postdata("sendTransaction", tx), augur.async, f);
    };

    // publish a new contract to the blockchain (from the coinbase account)
    augur.publish = function (compiled, f) {
        return this.sendTx({ from: augur.coinbase, data: compiled }, f);
    };

    // hex-encode a function's ABI data and return it
    augur.abi_data = function (tx, f) {
        tx.signature = tx.signature || "";
        var data_abi = get_prefix(tx.function, tx.signature);
        var types = [];
        for (var i = 0, len = tx.signature.length; i < len; ++i) {
            if (tx.signature[i] == 's') {
                types.push("string");
            } else if (tx.signature[i] == 'a') {
                types.push("int256[]");
            } else {
                types.push("int256");
            }
        }
        if (tx.params) {
            if (tx.params.constructor === String) {
                if (tx.params.slice(0,1) === "[" && tx.params.slice(-1) === "]") {
                    tx.params = JSON.parse(tx.params);
                }
                if (tx.params.constructor === String) {
                    tx.params = [tx.params];
                }
            } else if (tx.params.constructor === Number) {
                tx.params = [tx.params];
            }
        } else {
            tx.params = [];
        }
        var len_args = '';
        var normal_args = '';
        var var_args = '';
        var base, sub, arrlist;
        if (types.length == tx.params.length) {
            for (i = 0, len = types.length; i < len; ++i) {
                if (types[i] === "string") {
                    base = "string";
                    sub = '';
                } else if (types[i] === "int256[]") {
                    base = "int";
                    sub = 256;
                    arrlist = "[]";
                } else {
                    base = "int";
                    sub = 256;
                }
                res = encode_abi(tx.params[i], base, sub, arrlist);
                len_args += res.len_args;
                normal_args += res.normal_args;
                var_args += res.var_args;
            }
            data_abi += len_args + normal_args + var_args;
        } else {
            return console.error("wrong number of parameters");
        }
        return data_abi;
    };
    /**
     * Invoke a function from a contract on the blockchain.
     *
     * Input tx format:
     * {
     *    from: <sender's address> (hexstring; optional, coinbase default)
     *    to: <contract address> (hexstring)
     *    function: <function name> (string)
     *    signature: <function signature, e.g. "iia"> (string)
     *    params: <parameters passed to the function> (optional)
     *    returns: <"array", "int", "BigNumber", or "string" (default)>
     *    send: <true to sendTransaction, false to call (default)>
     * }
     */
    augur.run = augur.execute = augur.invoke = function (tx, f) {
        var packaged, invocation, result, invoked;
        if (tx) {
            var tx = augur.clone(tx);
            data_abi = this.abi_data(tx);
            if (data_abi) {
                packaged = {
                    from: tx.from || augur.coinbase,
                    to: tx.to,
                    data: data_abi,
                    returns: tx.returns
                };
                invocation = (tx.send) ? this.sendTx : this.call;
                invoked = true;
                return invocation(packaged, f);
            }
        }
        if (!invoked) {
            return "Error invoking " + tx.function + "@" + tx.to + "\n"+
                "Expected transaction format:" + JSON.stringify({
                    from: "<sender's address> (hexstring; optional, coinbase default)",
                    to: "<contract address> (hexstring)",
                    function: "<function name> (string)",
                    signature: '<function signature, e.g. "iia"> (string)',
                    params: "<parameters passed to the function> (optional)",
                    returns: '<"array", "int", "BigNumber", or "string" (default)>',
                    send: '<true to sendTransaction, false to call (default)>'
                });
        }
    };

    // Read the code in a contract on the blockchain
    augur.getCode = augur.read = function (address, block, f) {
        if (address) {
            return json_rpc(postdata("getCode", [address, block || "latest"]), augur.async, f);
        }
    };

    // Augur transaction objects
    augur.tx = {
        getCashBalance: {
            from: augur.coinbase,
            to: augur.contracts.cash,
            function: "balance",
            signature: "i",
            params: augur.coinbase,
            returns: "BigNumber"
        },
        getCreator: {
            from: augur.coinbase,
            to: augur.contracts.info,
            function: "getCreator",
            signature: "i"
        },
        getCreationFee: {
            from: augur.coinbase,
            to: augur.contracts.info,
            function: "getCreationFee",
            signature: "i"
        },
        getSimulatedBuy: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getSimulatedBuy",
            signature: "iii",
            returns: "array"
        },
        getSimulatedSell: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getSimulatedSell",
            signature: "iii",
            returns: "array"
        },
        getRepBalance: {
            from: augur.coinbase,
            to: augur.contracts.reporting,
            function: "getRepBalance",
            signature: "ii",
            returns: "BigNumber"
        },
        getBranches: {
            from: augur.coinbase,
            to: augur.contracts.branches,
            function: "getBranches",
            returns: "array"
        },
        getMarkets: {
            from: augur.coinbase,
            to: augur.contracts.branches,
            function: "getMarkets",
            signature: "i",
            returns: "array"
        },
        getMarketInfo: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getMarketInfo",
            signature: "i",
            returns: "array"
        },
        getMarketEvents: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getMarketEvents",
            signature: "i",
            returns: "array"
        },
        getNumEvents: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getNumEvents",
            signature: "i",
            returns: "int"
        },
        getExpiration: {
            from: augur.coinbase,
            to: augur.contracts.events,
            function: "getExpiration",
            signature: "i",
            returns: "BigNumber"
        },
        getEventInfo: {
            from: augur.coinbase,
            to: augur.contracts.events,
            function: "getEventInfo",
            signature: "i",
            returns: "array"
        },
        getMarketNumOutcomes: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getMarketNumOutcomes",
            signature: "i",
            returns: "int"
        },
        getBranchID: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getBranchID",
            signature: "i"
        },
        getNonce: {
            from: augur.coinbase,
            to: augur.contracts.buyAndSellShares,
            function: "getNonce",
            signature: "i"
        },
        getCurrentParticipantNumber: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getCurrentParticipantNumber",
            signature: "i"
        },
        getParticipantSharesPurchased: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getParticipantSharesPurchased",
            signature: "iii",
            returns: "BigNumber"
        },
        price: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "price",
            signature: "ii",
            returns: "BigNumber"
        },
        getSharesPurchased: {
            from: augur.coinbase,
            to: augur.contracts.markets,
            function: "getSharesPurchased",
            signature: "ii",
            returns: "BigNumber"
        },
        getEvents: {
            from: augur.coinbase,
            to: augur.contracts.expiringEvents,
            function: "getEvents",
            signature: "ii",
            returns: "array"
        },
        getVotePeriod: {
            from: augur.coinbase,
            to: augur.contracts.branches,
            function: "getVotePeriod",
            signature: "i",
            returns: "int"
        },
        getPeriodLength: {
            from: augur.coinbase,
            to: augur.contracts.branches,
            function: "getPeriodLength",
            signature: "i",
            returns: "int"
        },
        getBranch: {
            from: augur.coinbase,
            to: augur.contracts.events,
            function: "getBranch",
            signature: "i"
        },
        sendCash: {
            from: augur.coinbase,
            to: augur.contracts.cash,
            function: "send",
            send: true,
            signature: "ii"
        },
        cashFaucet: {
            from: augur.coinbase,
            to: augur.contracts.cash,
            function: "faucet",
            send: true
        },
        reputationFaucet: {
            from: augur.coinbase,
            to: augur.contracts.reporting,
            function: "faucet",
            send: true
        },
        getDescription: {
            from: augur.coinbase,
            to: augur.contracts.info,
            function: "getDescription",
            signature: "i",
            returns: "string"
        },
        createEvent: {
            from: augur.coinbase,
            to: augur.contracts.createEvent,
            function: "createEvent",
            signature: "isiiii",
            send: true
        },
        createMarket: {
            from: augur.coinbase,
            to: augur.contracts.createMarket,
            function: "createMarket",
            signature: "isiiia",
            send: true
        },
        buyShares: {
            from: augur.coinbase,
            to: augur.contracts.buyAndSellShares,
            function: "buyShares",
            signature: "iiiii",
            returns: "int",
            send: true
        },
        sellShares: {
            from: augur.coinbase,
            to: augur.contracts.buyAndSellShares,
            function: "sellShares",
            signature: "iiiii",
            returns: "int",
            send: true
        },
        sendReputation: {
            from: augur.coinbase,
            to: augur.contracts.sendReputation,
            function: "sendReputation",
            signature: "iii",
            send: true
        }
    };

    // Invoke Augur API functions (asynchronous only)
    augur.getCashBalance = function (account, f) {
        if (account) augur.tx.getCashBalance.params = account;
        augur.invoke(augur.tx.getCashBalance, f);
    };
    augur.getCreator = function (id, f) {
        augur.tx.getCreator.params = id;
        augur.invoke(augur.tx.getCreator, f);
    };
    augur.getCreationFee = function (id, f) {
        augur.tx.getCreationFee.params = id;
        augur.invoke(augur.tx.getCreationFee, f);
    };
    augur.getSimulatedBuy = function (market, outcome, amount, f) {
        augur.tx.getSimulatedBuy.params = [market, outcome, amount];
        augur.invoke(augur.tx.getSimulatedBuy, f);
    };
    augur.getSimulatedSell = function (market, outcome, amount, f) {
        augur.tx.getSimulatedSell.params = [market, outcome, amount];
        augur.invoke(augur.tx.getSimulatedSell, f);
    };
    augur.getRepBalance = function (branch, account, f) {
        augur.tx.getRepBalance.params = [branch, account];
        augur.invoke(augur.tx.getRepBalance, f);
    };
    augur.getBranches = function (f) {
        augur.invoke(augur.tx.getBranches, f);
    };
    augur.getMarkets = function (branch, f) {
        augur.tx.getMarkets.params = branch;
        augur.invoke(augur.tx.getMarkets, f);
    };
    augur.getMarketInfo = function (market, f) {
        augur.tx.getMarketInfo.params = market;
        augur.invoke(augur.tx.getMarketInfo, function (marketInfo) {
            if (marketInfo) {
                var info = {
                    currentParticipant: new BigNumber(marketInfo[0]),
                    alpha: new BigNumber(marketInfo[1]),
                    cumulativeScale: new BigNumber(marketInfo[2]),
                    numOutcomes: parseInt(marketInfo[3]),
                    tradingPeriod: new BigNumber(marketInfo[4]),
                    tradingFee: marketInfo[5]
                };
                augur.getDescription(market, function (description) {
                    if (description) info.description = description;
                    f(info);
                });
            }
        });
    };
    augur.getMarketEvents = function (market, f) {
        augur.tx.getMarketEvents.params = market;
        augur.invoke(augur.tx.getMarketEvents, f);
    };
    augur.getNumEvents = function (market, f) {
        augur.tx.getNumEvents.params = market;
        augur.invoke(augur.tx.getNumEvents, f);
    };
    augur.getExpiration = function (event, f) {
        augur.tx.getExpiration.params = event;
        augur.invoke(augur.tx.getExpiration, f);
    };
    augur.getEventInfo = function (event, f) {
        augur.tx.getEventInfo.params = event;
        augur.invoke(augur.tx.getEventInfo, function (eventInfo) {
            if (eventInfo) {
                var info = {
                    branch: parseInt(eventInfo[0]),
                    expirationDate: parseInt(eventInfo[1]),
                    outcome: parseInt(eventInfo[2]),
                    minValue: parseInt(eventInfo[3]),
                    maxValue: parseInt(eventInfo[4]),
                    numOutcomes: parseInt(eventInfo[5])
                };
                augur.getDescription(event, function (description) {
                    if (description) info.description = description;
                    f(info);
                });
            }
        });
    };
    augur.getMarketNumOutcomes = function (market, f) {
        augur.tx.getMarketNumOutcomes.params = market;
        augur.invoke(augur.tx.getMarketNumOutcomes, f);
    };
    augur.getDescription = function (item, f) {
        augur.tx.getDescription.params = item;
        augur.invoke(augur.tx.getDescription, f);
    };
    augur.getBranchID = function (branch, f) {
        augur.tx.getBranchID.params = branch;
        augur.invoke(augur.tx.getBranchID, f);
    }
    augur.getNonce = function (id, f) {
        augur.tx.getNonce.params = id;
        augur.invoke(augur.tx.getNonce, f);
    };
    augur.getCurrentParticipantNumber = function (market, f) {
        augur.tx.getCurrentParticipantNumber.params = market;
        augur.invoke(augur.tx.getCurrentParticipantNumber, f);
    };
    augur.getParticipantSharesPurchased = function (market, participationNumber, outcome, f) {
        augur.tx.getParticipantSharesPurchased.params = [market, participationNumber, outcome];
        augur.invoke(augur.gtx.getParticipantSharesPurchased, f);
    };
    augur.price = function (market, outcome, f) {
        augur.tx.price.params = [market, outcome];
        augur.invoke(augur.tx.price, f);
    };
    augur.getSharesPurchased = function (market, outcome, f) {
        augur.tx.getSharesPurchased.params = [market, outcome];
        augur.invoke(augur.tx.getSharesPurchased, f);
    };
    augur.getEvents = function (branch, votePeriod, f) {
        augur.tx.getEvents.params = [branch, votePeriod];
        augur.invoke(augur.tx.getEvents, f);
    };
    augur.getVotePeriod = function (branch, f) {
        augur.tx.getVotePeriod.params = branch;
        augur.invoke(augur.tx.getVotePeriod, f);
    };
    augur.getPeriodLength = function (branch, f) {
        augur.tx.getPeriodLength.params = branch;
        augur.invoke(augur.tx.getPeriodLength, f);
    };
    augur.getBranch = function (branchNumber, f) {
        augur.tx.getBranch.params = branchNumber;
        augur.invoke(augur.tx.getBranch, f);
    };
    augur.createEvent = function (branch, description, expDate, minValue, maxValue, numOutcomes, sentCallback, verifiedCallback) {
        augur.tx.createEvent.params = [branch, description, expDate, minValue, maxValue, numOutcomes];
        augur.tx.createEvent.send = false;
        augur.invoke(augur.tx.createEvent, function (eventID) {
            if (eventID) {
                var event = { id: eventID };
                if (sentCallback) sentCallback(event);
                augur.tx.createEvent.send = true;
                if (verifiedCallback) {
                    augur.invoke(augur.tx.createEvent, function (txhash) {
                        if (txhash) {
                            event.txhash = txhash;
                            var pings = 0;
                            var pingTx = function () {
                                augur.getTx(txhash, function (tx) {
                                    pings++;
                                    if (tx && (tx.result !== null)) {
                                        augur.getDescription(eventID, function (description) {
                                            if (description) event.description = description;
                                            verifiedCallback(event);
                                        });
                                    } else {
                                        if (pings < augur.PINGMAX) setTimeout(pingTx, 12000);
                                    }
                                });
                            };
                            pingTx();
                        }
                    });
                }
            }
        });
    };
    augur.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, sentCallback, verifiedCallback, failedCallback) {
        augur.tx.createMarket.params = [branch, description, alpha, liquidity, tradingFee, events];
        augur.tx.createMarket.send = false;
        augur.tx.createMarket.gas = 3000000;
        augur.invoke(augur.tx.createMarket, function (marketID) {
            if (marketID) {
                var market = { id: marketID };
                if (augur.ERRORS[marketID]) {
                    market.error = "error " + augur.ERRORS[marketID].code.toString() + ": " + augur.ERRORS[marketID].message;
                    if (failedCallback) failedCallback(market);
                } else {
                    if (sentCallback) sentCallback(market);
                    augur.tx.createMarket.send = true;
                    if (verifiedCallback) {
                        augur.invoke(augur.tx.createMarket, function (txhash) {
                            if (txhash) {
                                market.txhash = txhash;
                                var pings = 0;
                                var pingTx = function () {
                                    augur.getTx(txhash, function (tx) {
                                        pings++;
                                        if (tx && (tx.result !== null)) {
                                            augur.getDescription(marketID, function (description) {
                                                if (description) market.description = description;
                                                verifiedCallback(market);
                                            });
                                        } else {
                                            if (pings < augur.PINGMAX) setTimeout(pingTx, 12000);
                                        }
                                    });
                                };
                                pingTx();
                            }
                        });
                    }
                }
            }
        });
    };
    augur.buyShares = function (branch, market, outcome, amount, nonce, f) {
        augur.tx.buyShares.params = [branch, market, outcome, amount, nonce];
        augur.invoke(augur.tx.buyShares, f);
    };
    augur.sellShares = function (branch, market, outcome, amount, nonce, f) {
        augur.tx.sellShares.params = [branch, market, outcome, amount, nonce];
        augur.invoke(augur.tx.sellShares, f);
    };
    augur.sendCash = function (receiver, value, f) {
        augur.tx.sendCash.params = [receiver, value];
        augur.invoke(augur.tx.sendCash, f);
    };
    augur.cashFaucet = function (f) {
        augur.invoke(augur.tx.cashFaucet, f);
    };
    augur.reputationFaucet = function (f) { // should this take a branch parameter?
        augur.invoke(augur.tx.reputationFaucet, f);
    };
    augur.buyShares = function (branch, market, outcome, amount, nonce, f) {
        augur.tx.buyShares.params = [branch, market, outcome, amount, nonce];
        augur.invoke(augur.tx.buyShares, f);
    };
    augur.sellShares = function (branch, market, outcome, amount, nonce, f) {
        augur.tx.sellShares.params = [branch, market, outcome, amount, nonce];
        augur.invoke(augur.tx.sellShares, f);
    };
    augur.sendReputation = function (branch, receiver, value, f) {
        augur.tx.sendReputation.params = [branch, receiver, value];
        augur.invoke(augur.tx.sendReputation, f);
    };

    return augur;

})(Augur || {}, rpc.async);

delete rpc;

if (MODULAR) module.exports = Augur;
