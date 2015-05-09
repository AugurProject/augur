/**
 * JavaScript bindings for the Augur API
 * @author Jack Peterson (jack@tinybike.net)
 */
var rpc = {
    protocol: "http",
    host: "localhost",
    port: 8545
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

var Augur = (function (augur) {

    BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

    var rpc_url = rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString();

    // default gas: 3M
    augur.default_gas = "0x2dc6c0";

    // if set to true, all numerical results (including hashes)
    // are returned as BigNumber objects
    augur.BigNumberOnly = true;

    // max number of tx verification attempts
    augur.PINGMAX = 12;

    // constants
    augur.MAXBITS = new BigNumber(2).toPower(256);
    augur.ONE = new BigNumber(2).toPower(64);
    augur.TWO = new BigNumber(2).toPower(65);
    augur.BAD = (new BigNumber(2).toPower(63)).mul(new BigNumber(3));
    augur.ETHER = new BigNumber(10).toPower(18);
    augur.AGAINST = augur.NO = 1; // against: "won't happen"
    augur.ON = augur.YES = 2;     // on: "will happen"
    
    augur.id = 1;
    augur.data = {};

    // contract error codes
    augur.ERRORS = {
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": -1,
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": -2,
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd": -3,
        "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc": -4,
        closeMarket: {
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                code: -1,
                message: "market has no cash anyway"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": {
                code: -2,
                message: "0 outcome"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd": {
                code: -3,
                message: "outcome indeterminable"
            }
        },
        createMarket: {
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                code: -1,
                message: "bad input or parent doesn't exist"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": {
                code: -2,
                message: "too many events"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd": {
                code: -3,
                message: "too many outcomes"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc": {
                code: -4,
                message: "not enough money or market already exists"
            }
        },
        sendReputation: {

        },
        buyShares: {
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                code: -1,
                message: "invalid outcome or trading closed"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe": {
                code: -2,
                message: "entered a negative number of shares"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd": {
                code: -3,
                message: "not enough money"
            },
            "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc": {
                code: -4,
                message: "bad nonce/hash"
            }
        }
    };
    augur.ERRORS.sellShares = augur.ERRORS.buyShares;

    /**********************
     * Contract addresses *
     **********************/

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
        checkQuorum: "0xe9aaab4aff0cf06e62d2442ae0f68660882e5a67",
        buyAndSellShares: "0x9dff8b4278f05e37f00d7461b175e092ae611380",
        createBranch: "0x5c955b31ac72c83ffd7562aed4e2100b2ba09a3b",
        p2pWagers: "0x7c2bbb3045fd8b39d28f4b4a5682dbec9a710771",
        sendReputation: "0x049487d32b727be98a4c8b58c4eab6521791f288",
        transferShares: "0x78da82256f5775df22eee51096d27666772b592d",
        makeReports: "0x32bfb5724874b209193aa0fca45b1f337b27e9b5",
        createEvent: "0xcae6d5912033d66650894e2ae8c2f7502eaba15c",
        createMarket: "0x386acc6b970aea7c6f9b87e7622d2ae7c18d377a",
        closeMarket: "0xb0e93253a008ce80f4c26152da3869225c716ce3",
        dispatch: "0x6c2af20ef783f0f16bc0eb499462b888e57c9fbf",

        // Consensus
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

    /***********************************
     * Fixed-point conversion routines *
     ***********************************/

    function fixed_string(fixed, encode) {
        if (encode === "string") {
            fixed = fixed.toFixed();
        } else if (encode === "hex") {
            if (fixed.s === -1) {
                fixed = "-0x" + fixed.toString(16).slice(1);
            } else {
                fixed = "0x" + fixed.toString(16);
            }
        }
        return fixed;
    }
    augur.prefix_hex = function (hex) {
        if (hex.slice(0,2) !== "0x" && hex.slice(0,3) !== "-0x") {
            if (hex.slice(0,1) == '-') {
                hex = "-0x" + hex.slice(1);
            } else {
                hex = "0x" + hex;
            }
        }
        return hex;
    };
    augur.bignum = function (n) {
        var bn;
        if (n && n !== "0x") {
            if (n.constructor === Number) {
                if (Math.floor(Math.log(n) / Math.log(10) + 1) <= 15) {
                    bn = new BigNumber(n);
                } else {
                    n = n.toString();
                    try {
                        bn = new BigNumber(n);
                    } catch (exc) {
                        if (n.slice(0,1) === '-') {
                            bn = new BigNumber("-0x" + n.slice(1));
                        }
                        bn = new BigNumber("0x" + n);
                    }
                }
            } else if (n.constructor === String) {
                try {
                    bn = new BigNumber(n);
                } catch (exc) {
                    if (n.slice(0,1) === '-') {
                        bn = new BigNumber("-0x" + n.slice(1));
                    }
                    bn = new BigNumber("0x" + n);
                }
            }
            return bn;
        }
    };
    augur.fix = function (n, encode) {
        var fixed;
        if (n && n !== "0x") {
            encode = (encode) ? encode.toLowerCase() : "string";
            if (n.constructor === BigNumber) {
                fixed = fixed_string(n.mul(augur.ONE).round(), encode);
            } else if (n.constructor === Number || n.constructor === String) {
                fixed = fixed_string(augur.bignum(n).mul(augur.ONE).round(), encode);
            } else if (n.constructor === Array) {
                var len = n.length;
                fixed = Array(len);
                for (var i = 0; i < len; ++i) {
                    fixed[i] = augur.fix(n[i], encode);
                }
            } else {
                log("could not convert " + n.toString() + " to fixed-point");
            }
            return fixed;
        }
    };
    augur.unfix = function (n, encode) {
        var unfixed;
        if (n && n !== "0x") {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === BigNumber) {
                unfixed = n.dividedBy(augur.ONE);
                if (encode) {
                    if (encode === "hex") {
                        unfixed = unfixed.toString(16);
                        if (unfixed.slice(0,1) === '-') {
                            unfixed = "-0x" + unfixed.slice(1);
                        } else {
                            unfixed = "0x" + unfixed;
                        }
                    } else if (encode === "string") {
                        unfixed = unfixed.toFixed();
                    } else if (encode === "number") {
                        unfixed = unfixed.toNumber();
                    }
                }
            } else if (n.constructor === Number || n.constructor === String) {
                unfixed = augur.bignum(n).dividedBy(augur.ONE);
                if (encode) {
                    if (encode === "hex") {
                        unfixed = unfixed.toString(16);
                        if (unfixed.slice(0,1) === '-') {
                            unfixed = "-0x" + unfixed.slice(1);
                        } else {
                            unfixed = "0x" + unfixed;
                        }
                    } else if (encode === "string") {
                        unfixed = unfixed.toFixed();
                    } else if (encode === "number") {
                        unfixed = unfixed.toNumber();
                    }
                }
            } else if (n.constructor === Array) {
                var len = n.length;
                unfixed = Array(len);
                for (var i = 0; i < len; ++i) {
                    unfixed[i] = augur.unfix(n[i], encode);
                }
            } else {
                log("could not convert " + n.toString() + " from fixed-point");
            }
            return unfixed;
        }
    };

    /***********************************
     * Contract ABI data serialization *
     ***********************************/

    function encode_int(value) {
        var cs = [];
        var x = new BigNumber(value);
        while (x.gt(new BigNumber(0))) {
            cs.push(String.fromCharCode(x.mod(new BigNumber(256))));
            x = x.dividedBy(new BigNumber(256)).floor();
        }
        return (cs.reverse()).join('');
    }

    augur.encode_hex = function (str) {
        var hexbyte, hex = '';
        for (var i = 0, len = str.length; i < len; ++i) {
            hexbyte = str.charCodeAt(i).toString(16);
            if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
            hex += hexbyte;
        }
        return hex;
    };

    augur.decode_hex = function (h) {
        var hex = h.toString();
        var str = '';
        if (hex.slice(0, 2) === "0x") {
            hex = hex.slice(2);
        }
        for (var i = 0, len = hex.length; i < len; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    };

    function zeropad(r, ishex) {
        var output = r;
        if (!ishex) output = augur.encode_hex(output);
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
                    var_args = augur.encode_hex(arg);
                }
                if (base === "int") {
                    if (arg.constructor === Number) {
                        normal_args = zeropad(encode_int(augur.bignum(arg).mod(augur.MAXBITS).toFixed()));
                    } else if (arg.constructor === String) {
                        if (arg.slice(0,1) === '-') {
                            normal_args = zeropad(encode_int(augur.bignum(arg).mod(augur.MAXBITS).toFixed()));
                        } else if (arg.slice(0,2) === "0x") {
                            normal_args = zeropad(arg.slice(2), true);
                        } else {
                            normal_args = zeropad(encode_int(augur.bignum(arg).mod(augur.MAXBITS)));
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

    /********************************
     * Parse Ethereum response JSON *
     ********************************/

    function strip_returns(tx) {
        var returns;
        if (tx && tx.params && tx.params[0] && tx.params[0].returns) {
            returns = tx.params[0].returns;
            delete tx.params[0].returns;
        }
        return returns;
    }

    function parse_array(string, returns, stride, init) {
        stride = stride || 64;
        var elements = (string.length - 2) / stride;
        var array = Array(elements);
        var position = init || 2;
        for (var i = 0; i < elements; ++i) {
            array[i] = string.slice(position, position + stride);
            if (array[i].slice(0,1) === '-') {
                array[i] = "-0x" + array[i].slice(1);
            } else {
                array[i] = "0x" + array[i];
            }
            if (returns === "number[]") {
                if (augur.BigNumbersOnly) {
                    array[i] = augur.unfix(array[i]);
                } else {
                    array[i] = augur.unfix(array[i], "string");
                }
            }
            position += stride;
        }
        return array.slice(1);
    }

    function format_result(returns, result) {
        var returns = returns.toLowerCase();
        if (result && result !== "0x") {
            if (returns.slice(-2) === "[]") {
                result = parse_array(result, returns);
            } else if (returns === "string") {
                result = augur.decode_hex(result);
            } else {
                if (augur.BigNumberOnly) {
                    if (returns === "number" || returns === "bignumber") {
                        result = augur.bignum(result);
                    } else if (returns === "unfix") {
                        result = augur.unfix(result);
                    }    
                } else {
                    if (returns === "number") {
                        result = augur.bignum(result).toFixed();
                    } else if (returns === "bignumber") {
                        result = augur.bignum(result);
                    } else if (returns === "unfix") {
                        result = augur.unfix(result, "string");
                    }
                }
            }
        }
        return result;
    }

    function parse(response, returns, callback) {
        // log(response);
        if (response !== undefined) {
            var response = JSON.parse(response);
            if (response.result && augur.ERRORS[response.result]) {
                log("contract returned error code: " + augur.ERRORS[response.result]);
                if (callback) {
                    callback(augur.ERRORS[response.result]);
                } else {
                    return augur.ERRORS[response.result];
                }
            } else if (response.error) {
                console.error(
                    "[" + response.error.code + "]",
                    response.error.message
                );
            } else if (response.result !== undefined) {
                if (returns) {
                    response.result = format_result(returns, response.result);
                }
                if (callback) {
                    callback(response.result);
                } else {
                    return response.result;
                }
            } else { // no result or error field :(
                return response;
            }
        }
    }

    augur.clone = function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };
    augur.range = function (start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    };

    /********************************************
     * Post JSON-RPC command to Ethereum client *
     ********************************************/

    function json_rpc(command, callback) {
        var returns, req = null;
        returns = strip_returns(command);
        var command = JSON.stringify(command);
        if (NODE_JS) {
            // asynchronous if callback exists
            if (callback && callback.constructor === Function) {
                req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        parse(req.responseText, returns, callback);
                    }
                };
                req.open("POST", rpc_url, true);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
            } else {
                // TODO replace httpsync (?)
                req = httpsync.request({
                    protocol: rpc.protocol,
                    host: rpc.host,
                    path: '/',
                    port: rpc.port,
                    method: 'POST'
                });
                req.write(command);
                return parse((req.end()).body.toString(), returns);
            }
        } else {
            if (window.XMLHttpRequest) {
                req = new window.XMLHttpRequest();
            } else {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (callback && callback.constructor === Function) {
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        parse(req.responseText, returns, callback);
                    }
                };
                req.open("POST", rpc_url, true);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
            } else {
                req.open("POST", rpc_url, false);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
                return parse(req.responseText, returns);
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

    /******************************
     * Ethereum JSON-RPC bindings *
     ******************************/

    augur.rpc = function (command, params, f) {
        return json_rpc(postdata(command, params, "null"), f);
    };
    augur.eth = function (command, params, f) {
        return json_rpc(postdata(command, params), f);
    };
    augur.net = function (command, params, f) {
        return json_rpc(postdata(command, params, "net_"), f);
    };
    augur.web3 = function (command, params, f) {
        return json_rpc(postdata(command, params, "web3_"), f);
    };
    augur.db = function (command, params, f) {
        return json_rpc(postdata(command, params, "db_"), f);
    };
    augur.shh = function (command, params, f) {
        return json_rpc(postdata(command, params, "shh_"), f);
    };

    augur.sha3 = augur.hash = function (data, f) {
        if (data) {
            if (data.constructor === Array || data.constructor === Object) {
                data = JSON.stringify(data);
            }
            return json_rpc(postdata("sha3", data.toString(), "web3_"), f);
        }
    };
    augur.gasPrice = function (f) {
        return json_rpc(postdata("gasPrice"), f);
    };
    augur.blockNumber = function (f) {
        return json_rpc(postdata("blockNumber"), f);
    };
    augur.getBalance = augur.balance = function (address, block, f) {
        return json_rpc(postdata("getBalance", [address || augur.coinbase, block || "latest"]), f);
    };
    augur.getTransactionCount = augur.txCount = function (address, f) {
        return json_rpc(postdata("getTransactionCount", address || augur.coinbase), f);
    };
    augur.pay = function (from, to, value, f) {
        return this.sendTx({ from: from || augur.coinbase, to: to, value: value }, f);
    };
    augur.getTransactionByHash = augur.getTx = function (hash, f) {
        return json_rpc(postdata("getTransactionByHash", hash), f);
    };
    augur.peerCount = function (f) {
        return json_rpc(postdata("peerCount", [], "net_"), f);
    };

    // execute functions on contracts on the blockchain
    augur.call = function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : augur.default_gas;
        return json_rpc(postdata("call", tx), f);
    };
    augur.sendTransaction = augur.sendTx = function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : augur.default_gas;
        return json_rpc(postdata("sendTransaction", tx), f);
    };

    // publish a new contract to the blockchain (from the coinbase account)
    augur.publish = function (compiled, f) {
        return this.sendTx({ from: augur.coinbase, data: compiled }, f);
    };

    // hex-encode a function's ABI data and return it
    augur.abi_data = function (tx, f) {
        tx.signature = tx.signature || "";
        var data_abi = get_prefix(tx.method, tx.signature);
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
     *    method: <function name> (string)
     *    signature: <function signature, e.g. "iia"> (string)
     *    params: <parameters passed to the function> (optional)
     *    returns: <"number[]", "int", "BigNumber", or "string" (default)>
     *    send: <true to sendTransaction, false to call (default)>
     * }
     */
    augur.run = augur.execute = augur.invoke = function (tx, f) {
        var data_abi, packaged, invocation, result, invoked;
        if (tx) {
            var tx = augur.clone(tx);
            if (tx.params) {
                if (tx.params.constructor === Array) {
                    for (var i = 0, len = tx.params.length; i < len; ++i) {
                        if (tx.params[i].constructor === BigNumber) {
                            tx.params[i] = tx.params[i].toFixed();
                        }
                    }
                } else {
                    if (tx.params.constructor === BigNumber) {
                        tx.params = tx.params.toFixed();
                    }
                }
            }
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
            return "Error invoking " + tx.method + "@" + tx.to + "\n"+
                "Expected transaction format:" + JSON.stringify({
                    from: "<sender's address> (hexstring; optional, coinbase default)",
                    to: "<contract address> (hexstring)",
                    method: "<function name> (string)",
                    signature: '<function signature, e.g. "iia"> (string)',
                    params: "<parameters passed to the function> (optional)",
                    returns: '<"number[]", "int", "BigNumber", or "string" (default)>',
                    send: '<true to sendTransaction, false to call (default)>'
                });
        }
    };

    // Read the code in a contract on the blockchain
    augur.getCode = augur.read = function (address, block, f) {
        if (address) {
            return json_rpc(postdata("getCode", [address, block || "latest"]), f);
        }
    };

    /***********************
     * Augur API functions *
     ***********************/

    // Augur transaction objects
    augur.tx = {};

    // cash.se
    augur.tx.getCashBalance = {
        from: augur.coinbase,
        to: augur.contracts.cash,
        method: "balance",
        signature: "i",
        params: augur.coinbase,
        returns: "number"
    };
    augur.tx.sendCash = {
        from: augur.coinbase,
        to: augur.contracts.cash,
        method: "send",
        send: true,
        signature: "ii"
    };
    augur.tx.cashFaucet = {
        from: augur.coinbase,
        to: augur.contracts.cash,
        method: "faucet",
        send: true
    };
    augur.getCashBalance = function (account, onSent) {
        // account: ethereum address (hexstring)
        if (account) augur.tx.getCashBalance.params = account;
        augur.invoke(augur.tx.getCashBalance, onSent);
    };
    augur.sendCash = function (receiver, value, onSent) {
        // receiver: sha256
        // value: number -> fixed-point
        augur.tx.sendCash.params = [receiver, augur.fix(value)];
        augur.invoke(augur.tx.sendCash, onSent);
    };
    augur.cashFaucet = function (onSent) {
        augur.invoke(augur.tx.cashFaucet, onSent);
    };

    // info.se
    augur.tx.getCreator = {
        from: augur.coinbase,
        to: augur.contracts.info,
        method: "getCreator",
        signature: "i"
    };
    augur.tx.getCreationFee = {
        from: augur.coinbase,
        to: augur.contracts.info,
        method: "getCreationFee",
        signature: "i",
        returns: "unfix"
    };
    augur.tx.getDescription = {
        from: augur.coinbase,
        to: augur.contracts.info,
        method: "getDescription",
        signature: "i",
        returns: "string"
    };
    augur.getCreator = function (id, onSent) {
        // id: sha256 hash id
        augur.tx.getCreator.params = id;
        augur.invoke(augur.tx.getCreator, onSent);
    };
    augur.getCreationFee = function (id, onSent) {
        // id: sha256 hash id
        augur.tx.getCreationFee.params = id;
        augur.invoke(augur.tx.getCreationFee, onSent);
    };
    augur.getDescription = function (item, onSent) {
        // item: sha256 hash id
        augur.tx.getDescription.params = item;
        augur.invoke(augur.tx.getDescription, onSent);
    };

    // branches.se
    augur.tx.getBranches = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getBranches",
        returns: "hash[]"
    };
    augur.tx.getMarkets = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getMarkets",
        signature: "i",
        returns: "hash[]"
    };
    augur.tx.getPeriodLength = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getPeriodLength",
        signature: "i",
        returns: "number"
    };
    augur.tx.getVotePeriod = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getVotePeriod",
        signature: "i",
        returns: "number"
    };
    augur.tx.getStep = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getStep",
        signature: "i",
        returns: "number"
    };
    augur.tx.getNumMarkets = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getNumMarkets",
        signature: "i",
        returns: "number"
    };
    augur.tx.getMinTradingFee = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getMinTradingFee",
        signature: "i",
        returns: "unfix"
    };
    augur.tx.getNumBranches = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getNumBranches",
        returns: "number"
    };
    augur.tx.getBranch = {
        from: augur.coinbase,
        to: augur.contracts.branches,
        method: "getBranch",
        signature: "i"
    };
    augur.getBranches = function (onSent) {
        augur.invoke(augur.tx.getBranches, onSent);
    };
    augur.getMarkets = function (branch, onSent) {
        // branch: sha256 hash id
        augur.tx.getMarkets.params = branch;
        augur.invoke(augur.tx.getMarkets, onSent);
    };
    augur.getPeriodLength = function (branch, onSent) {
        // branch: sha256 hash id
        augur.tx.getPeriodLength.params = branch;
        augur.invoke(augur.tx.getPeriodLength, onSent);
    };
    augur.getVotePeriod = function (branch, onSent) {
        // branch: sha256 hash id
        augur.tx.getVotePeriod.params = branch;
        augur.invoke(augur.tx.getVotePeriod, onSent);
    };
    augur.getStep = function (branch, onSent) {
        // branch: sha256
        augur.tx.getStep.params = branch;
        augur.invoke(augur.tx.getStep, onSent);
    };
    augur.getNumMarkets = function (branch, onSent) {
        // branch: sha256
        augur.tx.getNumMarkets.params = branch;
        augur.invoke(augur.tx.getNumMarkets, onSent);
    };
    augur.getMinTradingFee = function (branch, onSent) {
        // branch: sha256
        augur.tx.getMinTradingFee.params = branch;
        augur.invoke(augur.tx.getMinTradingFee, onSent);
    };
    augur.getNumBranches = function (onSent) {
        augur.invoke(augur.tx.getNumBranches, onSent);
    };
    augur.getBranch = function (branchNumber, onSent) {
        // branchNumber: integer
        augur.tx.getBranch.params = branchNumber;
        augur.invoke(augur.tx.getBranch, onSent);
    };

    // events.se
    augur.tx.getEventInfo = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getEventInfo",
        signature: "i",
        returns: "mixed[]"
    };
    augur.getEventInfo = function (event, onSent) {
        // event: sha256 hash id
        augur.tx.getEventInfo.params = event;
        augur.invoke(augur.tx.getEventInfo, function (eventInfo) {
            if (eventInfo && eventInfo.length) {
                var info = {
                    branch: augur.bignum(eventInfo[0]).toFixed(),
                    expirationDate: augur.bignum(eventInfo[1]).toFixed(),
                    outcome: augur.bignum(eventInfo[2]).toFixed(),
                    minValue: augur.bignum(eventInfo[3]).toFixed(),
                    maxValue: augur.bignum(eventInfo[4]).toFixed(),
                    numOutcomes: augur.bignum(eventInfo[5]).toFixed()
                };
                augur.getDescription(event, function (description) {
                    if (description) info.description = description;
                    onSent(info);
                });
            }
        });
    };

    augur.tx.getEventBranch = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getEventBranch",
        signature: "i"
    };
    augur.tx.getExpiration = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getExpiration",
        signature: "i",
        returns: "number"
    };
    augur.tx.getOutcome = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getOutcome",
        signature: "i",
        returns: "number"
    };
    augur.tx.getMinValue = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getMinValue",
        signature: "i",
        returns: "number"
    };
    augur.tx.getMaxValue = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getMaxValue",
        signature: "i",
        returns: "number"
    };
    augur.tx.getNumOutcomes = {
        from: augur.coinbase,
        to: augur.contracts.events,
        method: "getNumOutcomes",
        signature: "i",
        returns: "number"
    };
    augur.getEventBranch = function (branchNumber, onSent) {
        // branchNumber: integer branch index (?)
        augur.tx.getEventBranch.params = branchNumber;
        augur.invoke(augur.tx.getEventBranch, onSent);
    };
    augur.getExpiration = function (event, onSent) {
        // event: sha256
        augur.tx.getExpiration.params = event;
        augur.invoke(augur.tx.getExpiration, onSent);
    };
    augur.getOutcome = function (event, onSent) {
        // event: sha256
        augur.tx.getOutcome.params = event;
        augur.invoke(augur.tx.getOutcome, onSent);
    };
    augur.getMinValue = function (event, onSent) {
        // event: sha256
        augur.tx.getMinValue.params = event;
        augur.invoke(augur.tx.getMinValue, onSent);
    };
    augur.getMaxValue = function (event, onSent) {
        // event: sha256
        augur.tx.getMaxValue.params = event;
        augur.invoke(augur.tx.getMaxValue, onSent);
    };
    augur.getNumOutcomes = function (event, onSent) {
        // event: sha256
        augur.tx.getNumOutcomes.params = event;
        augur.invoke(augur.tx.getNumOutcomes, onSent);
    };

    // expiringEvents.se
    augur.tx.getEvents = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getEvents",
        signature: "ii",
        returns: "hash[]"
    };
    augur.tx.getNumberEvents = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getNumberEvents",
        signature: "ii",
        returns: "number"
    };
    augur.tx.getEvent = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getEvent",
        signature: "iii"
    };
    augur.tx.getTotalRepReported = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getTotalRepReported",
        signature: "ii",
        returns: "unfix"
    };
    augur.tx.getReporterBallot = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getReporterBallot",
        signature: "iii",
        returns: "number[]"
    };
    augur.tx.getReport = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getReport",
        signature: "iiii",
        returns: "unfix"
    };
    augur.tx.getReportHash = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getReportHash",
        signature: "iii"
    };
    augur.tx.getVSize = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getVSize",
        signature: "ii",
        returns: "number"
    };
    augur.tx.getReportsFilled = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getReportsFilled",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getReportsMask = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getReportsMask",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getWeightedCenteredData = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getWeightedCenteredData",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getCovarianceMatrixRow = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getCovarianceMatrixRow",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getDeflated = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getDeflated",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getLoadingVector = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getLoadingVector",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getLatent = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getLatent",
        signature: "ii",
        returns: "unfix"
    };
    augur.tx.getScores = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getScores",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getSetOne = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getSetOne",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getSetTwo = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getSetTwo",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.returnOld = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "returnOld",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getNewOne = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getNewOne",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getNewTwo = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getNewTwo",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getAdjPrinComp = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getAdjPrinComp",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getSmoothRep = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getSmoothRep",
        signature: "ii",
        returns: "number[]"
    };
    augur.tx.getOutcomesFinal = {
        from: augur.coinbase,
        to: augur.contracts.expiringEvents,
        method: "getOutcomesFinal",
        signature: "ii",
        returns: "number[]"
    };
    augur.getEvents = function (branch, votePeriod, onSent) {
        // branch: sha256 hash id
        // votePeriod: integer
        augur.tx.getEvents.params = [branch, votePeriod];
        augur.invoke(augur.tx.getEvents, onSent);
    };
    augur.getNumberEvents = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getNumberEvents.params = [branch, votePeriod];
        augur.invoke(augur.tx.getNumberEvents, onSent);
    };
    augur.getEvent = function (branch, votePeriod, eventIndex, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getEvent.params = [branch, votePeriod, eventIndex];
        augur.invoke(augur.tx.getEvent, onSent);
    };
    augur.getTotalRepReported = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getTotalRepReported.params = [branch, votePeriod];
        augur.invoke(augur.tx.getTotalRepReported, onSent);
    };
    augur.getReporterBallot = function (branch, votePeriod, reporterID, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getReporterBallot.params = [branch, votePeriod, reporterID];
        augur.invoke(augur.tx.getReporterBallot, onSent);
    };
    augur.getReport = function (branch, votePeriod, reporter, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getReport.params = [branch, votePeriod, reporter];
        augur.invoke(augur.tx.getReport, onSent);
    };
    augur.getReportHash = function (branch, votePeriod, reporter, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getReportHash.params = [branch, votePeriod, reporter];
        augur.invoke(augur.tx.getReportHash, onSent);
    };
    augur.getVSize = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getVSize.params = [branch, votePeriod];
        augur.invoke(augur.tx.getVSize, onSent);
    };
    augur.getReportsFilled = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getReportsFilled.params = [branch, votePeriod];
        augur.invoke(augur.tx.getReportsFilled, onSent);
    };
    augur.getReportsMask = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getReportsMask.params = [branch, votePeriod];
        augur.invoke(augur.tx.getReportsMask, onSent);
    };
    augur.getWeightedCenteredData = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getWeightedCenteredData.params = [branch, votePeriod];
        augur.invoke(augur.tx.getWeightedCenteredData, onSent);
    };
    augur.getCovarianceMatrixRow = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getCovarianceMatrixRow.params = [branch, votePeriod];
        augur.invoke(augur.tx.getCovarianceMatrixRow, onSent);
    };
    augur.getDeflated = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getDeflated.params = [branch, votePeriod];
        augur.invoke(augur.tx.getDeflated, onSent);
    };
    augur.getLoadingVector = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getLoadingVector.params = [branch, votePeriod];
        augur.invoke(augur.tx.getLoadingVector, onSent);
    };
    augur.getLatent = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getLatent.params = [branch, votePeriod];
        augur.invoke(augur.tx.getLatent, onSent);
    };
    augur.getScores = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getScores.params = [branch, votePeriod];
        augur.invoke(augur.tx.getScores, onSent);
    };
    augur.getSetOne = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getSetOne.params = [branch, votePeriod];
        augur.invoke(augur.tx.getSetOne, onSent);
    };
    augur.getSetTwo = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getSetTwo.params = [branch, votePeriod];
        augur.invoke(augur.tx.getSetTwo, onSent);
    };
    augur.returnOld = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.returnOld.params = [branch, votePeriod];
        augur.invoke(augur.tx.returnOld, onSent);
    };
    augur.getNewOne = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getNewOne.params = [branch, votePeriod];
        augur.invoke(augur.tx.getNewOne, onSent);
    };
    augur.getNewTwo = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getNewTwo.params = [branch, votePeriod];
        augur.invoke(augur.tx.getNewTwo, onSent);
    };
    augur.getAdjPrinComp = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getAdjPrinComp.params = [branch, votePeriod];
        augur.invoke(augur.tx.getAdjPrinComp, onSent);
    };
    augur.getSmoothRep = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getSmoothRep.params = [branch, votePeriod];
        augur.invoke(augur.tx.getSmoothRep, onSent);
    };
    augur.getOutcomesFinal = function (branch, votePeriod, onSent) {
        // branch: sha256
        // votePeriod: integer
        augur.tx.getOutcomesFinal.params = [branch, votePeriod];
        augur.invoke(augur.tx.getOutcomesFinal, onSent);
    };

    // markets.se
    augur.tx.getSimulatedBuy = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getSimulatedBuy",
        signature: "iii",
        returns: "number[]"
    };
    augur.tx.getSimulatedSell = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getSimulatedSell",
        signature: "iii",
        returns: "number[]"
    };
    augur.getSimulatedBuy = function (market, outcome, amount, onSent) {
        // market: sha256 hash id
        // outcome: integer (1 or 2 for binary events)
        // amount: base 10 number -> base 2^64 number
        augur.tx.getSimulatedBuy.params = [market, outcome, augur.fix(amount)];
        augur.invoke(augur.tx.getSimulatedBuy, onSent);
    };
    augur.getSimulatedSell = function (market, outcome, amount, onSent) {
        // market: sha256 hash id
        // outcome: integer (1 or 2 for binary events)
        // amount: number -> fixed-point
        augur.tx.getSimulatedSell.params = [market, outcome, augur.fix(amount)];
        augur.invoke(augur.tx.getSimulatedSell, onSent);
    };

    augur.filters = {}; // key: marketId => {filterId: hexstring, polling: bool}

    augur.tx.getMarketInfo = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getMarketInfo",
        signature: "i",
        returns: "mixed[]"
    };
    augur.getMarketInfo = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getMarketInfo.params = market;
        augur.invoke(augur.tx.getMarketInfo, function (marketInfo) {
            if (marketInfo && marketInfo.length) {
                var info = {
                    currentParticipant: augur.bignum(marketInfo[0]).toFixed(),
                    alpha: augur.unfix(marketInfo[1], "string"),
                    cumulativeScale: augur.bignum(marketInfo[2]).toFixed(),
                    numOutcomes: augur.bignum(marketInfo[3]).toFixed(),
                    tradingPeriod: augur.bignum(marketInfo[4]).toFixed(),
                    tradingFee: augur.unfix(marketInfo[5], "string")
                };
                augur.getDescription(market, function (description) {
                    if (description) {
                        info.description = description;
                    }
                    onSent(info);

                    // make sure there's only one filter per market
                    // if (augur.filters[market] && augur.filters[market].filterId) {
                    //     log("existing filter found");
                    //     pollFilter(market, augur.filters[market].filterId);
                    // } else {
                    
                    //     // create filter for this market
                    //     augur.commentFilter(market, function (filter) {
                    //         if (filter && filter !== "0x") {
                    //             log("creating new filter");
                    //             augur.filters[market] = {
                    //                 filterId: filter,
                    //                 polling: false
                    //             };
                    //             augur.filters[market].polling = true;
                    
                    //             // get and send all comments in local leveldb
                    //             augur.getString(market, function (comments) {
                    //                 if (comments) {
                    //                     info.comments = comments;
                    //                     augur.comment(market, comments, function (ok) {
                    //                         if (ok) onSent(info);
                    //                     });
                    //                 }
                    //             });
                    //             pollFilter(market, filter);
                    //         }
                    //     });
                    // }
                });
            }
        });
    };

    augur.tx.getMarketEvents = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getMarketEvents",
        signature: "i",
        returns: "hash[]"
    };
    augur.tx.getNumEvents = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getNumEvents",
        signature: "i",
        returns: "number"
    };
    augur.getMarketEvents = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getMarketEvents.params = market;
        augur.invoke(augur.tx.getMarketEvents, onSent);
    };
    augur.getNumEvents = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getNumEvents.params = market;
        augur.invoke(augur.tx.getNumEvents, onSent);
    };

    augur.tx.getBranchID = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getBranchID",
        signature: "i"
    };
    augur.tx.getCurrentParticipantNumber = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getCurrentParticipantNumber",
        signature: "i",
        returns: "unfix"
    };
    augur.tx.getMarketNumOutcomes = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getMarketNumOutcomes",
        signature: "i",
        returns: "number"
    };
    augur.tx.getParticipantSharesPurchased = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getParticipantSharesPurchased",
        signature: "iii",
        returns: "unfix"
    };
    augur.tx.getSharesPurchased = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getSharesPurchased",
        signature: "ii",
        returns: "unfix"
    };
    augur.tx.getWinningOutcomes = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getWinningOutcomes",
        signature: "i",
        returns: "hash[]"
    };
    augur.tx.price = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "price",
        signature: "ii",
        returns: "unfix"
    };
    augur.getBranchID = function (branch, onSent) {
        // branch: sha256 hash id
        augur.tx.getBranchID.params = branch;
        augur.invoke(augur.tx.getBranchID, onSent);
    };
    augur.getCurrentParticipantNumber = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getCurrentParticipantNumber.params = market;
        augur.invoke(augur.tx.getCurrentParticipantNumber, onSent);
    };
    augur.getMarketNumOutcomes = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getMarketNumOutcomes.params = market;
        augur.invoke(augur.tx.getMarketNumOutcomes, onSent);
    };
    augur.getParticipantSharesPurchased = function (market, participationNumber, outcome, onSent) {
        // market: sha256 hash id
        augur.tx.getParticipantSharesPurchased.params = [market, participationNumber, outcome];
        augur.invoke(augur.tx.getParticipantSharesPurchased, onSent);
    };
    augur.getSharesPurchased = function (market, outcome, onSent) {
        // market: sha256 hash id
        augur.tx.getSharesPurchased.params = [market, outcome];
        augur.invoke(augur.tx.getSharesPurchased, onSent);
    };
    augur.getWinningOutcomes = function (market, onSent) {
        // market: sha256 hash id
        augur.tx.getWinningOutcomes.params = market;
        augur.invoke(augur.tx.getWinningOutcomes, onSent);
    };
    augur.price = function (market, outcome, onSent) {
        // market: sha256 hash id
        augur.tx.price.params = [market, outcome];
        augur.invoke(augur.tx.price, onSent);
    };

    augur.tx.getParticipantNumber = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getParticipantNumber",
        signature: "ii",
        returns: "number"
    };
    augur.tx.getParticipantID = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getParticipantID",
        signature: "ii"
    };
    augur.getParticipantNumber = function (market, address, onSent) {
        // market: sha256
        // address: ethereum account
        augur.tx.getParticipantNumber.params = [market, address];
        augur.invoke(augur.tx.getParticipantNumber, onSent);
    };
    augur.getParticipantID = function (market, participantNumber, onSent) {
        // market: sha256
        augur.tx.getParticipantID.params = [market, participantNumber];
        augur.invoke(augur.tx.getParticipantID, onSent);
    };

    augur.tx.getAlpha = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getAlpha",
        signature: "i",
        returns: "unfix"
    };
    augur.tx.getCumScale = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getCumScale",
        signature: "i",
        returns: "unfix"
    };
    augur.tx.getTradingPeriod = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getTradingPeriod",
        signature: "i",
        returns: "number"
    };
    augur.tx.getTradingFee = {
        from: augur.coinbase,
        to: augur.contracts.markets,
        method: "getTradingFee",
        signature: "i",
        returns: "unfix"
    };
    augur.getAlpha = function (market, onSent) {
        // market: sha256
        augur.tx.getAlpha.params = market;
        augur.invoke(augur.tx.getAlpha, onSent);
    };
    augur.getCumScale = function (market, onSent) {
        // market: sha256
        augur.tx.getCumScale.params = market;
        augur.invoke(augur.tx.getCumScale, onSent);
    };
    augur.getTradingPeriod = function (market, onSent) {
        // market: sha256
        augur.tx.getTradingPeriod.params = market;
        augur.invoke(augur.tx.getTradingPeriod, onSent);
    };
    augur.getTradingFee = function (market, onSent) {
        // market: sha256
        augur.tx.getTradingFee.params = market;
        augur.invoke(augur.tx.getTradingFee, onSent);
    };

    // reporting.se
    augur.tx.getRepBalance = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "getRepBalance",
        signature: "ii",
        returns: "unfix"
    };
    augur.tx.getRepByIndex = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "getRepByIndex",
        signature: "ii",
        returns: "unfix"
    };
    augur.tx.getReporterID = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "getReporterID",
        signature: "ii"
    };
    augur.tx.getReputation = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "getReputation",
        signature: "i",
        returns: "number[]"
    };
    augur.tx.getNumberReporters = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "getNumberReporters",
        signature: "i",
        returns: "number"
    };
    augur.tx.repIDToIndex = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "repIDToIndex",
        signature: "ii",
        returns: "number"
    };
    augur.getRepBalance = function (branch, account, onSent) {
        // branch: sha256 hash id
        // account: ethereum address (hexstring)
        augur.tx.getRepBalance.params = [branch, account];
        augur.invoke(augur.tx.getRepBalance, onSent);
    };
    augur.getRepByIndex = function (branch, repIndex, onSent) {
        // branch: sha256
        // repIndex: integer
        augur.tx.getRepByIndex.params = [branch, repIndex];
        augur.invoke(augur.tx.getRepByIndex, onSent);
    };
    augur.getReporterID = function (branch, index, onSent) {
        // branch: sha256
        // index: integer
        augur.tx.getReporterID.params = [branch, index];
        augur.invoke(augur.tx.getReporterID, onSent);
    };
    // reputation of a single address over all branches
    augur.getReputation = function (address, onSent) {
        // address: ethereum account
        augur.tx.getReputation.params = address;
        augur.invoke(augur.tx.getReputation, onSent);
    };
    augur.getNumberReporters = function (branch, onSent) {
        // branch: sha256
        augur.tx.getNumberReporters.params = branch;
        augur.invoke(augur.tx.getNumberReporters, onSent);
    };
    augur.repIDToIndex = function (branch, repID, onSent) {
        // branch: sha256
        // repID: ethereum account
        augur.tx.repIDToIndex.params = [branch, repID];
        augur.invoke(augur.tx.repIDToIndex, onSent);
    };

    augur.tx.hashReport = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "hashReport",
        signature: "ai"
    };
    augur.tx.reputationFaucet = {
        from: augur.coinbase,
        to: augur.contracts.reporting,
        method: "faucet",
        send: true
    };
    augur.hashReport = function (ballot, salt, onSent) {
        // ballot: number[]
        // salt: integer
        if (ballot.constructor === Array) {
            augur.tx.hashReport.params = [ballot, salt];
            augur.invoke(augur.tx.hashReport, onSent);
        }
    };
    augur.reputationFaucet = function (onSent) { // should this take a branch parameter?
        augur.invoke(augur.tx.reputationFaucet, onSent);
    };    

    // buy&sellShares.se
    augur.tx.getNonce = {
        from: augur.coinbase,
        to: augur.contracts.buyAndSellShares,
        method: "getNonce",
        signature: "i",
        returns: "number"
    };
    augur.tx.buyShares = {
        from: augur.coinbase,
        to: augur.contracts.buyAndSellShares,
        method: "buyShares",
        signature: "iiiii",
        returns: "number",
        send: true
    };
    augur.tx.sellShares = {
        from: augur.coinbase,
        to: augur.contracts.buyAndSellShares,
        method: "sellShares",
        signature: "iiiii",
        returns: "number",
        send: true
    };
    augur.getNonce = function (id, onSent) {
        // id: sha256 hash id
        augur.tx.getNonce.params = id;
        augur.invoke(augur.tx.getNonce, onSent);
    };
    augur.buyShares = function (branch, market, outcome, amount, nonce, onSent) {
        if (branch.constructor === Object && branch.branchId) {
            var market = branch.marketId; // sha256
            var outcome = branch.outcome; // integer (1 or 2 for binary)
            var amount = branch.amount;   // number -> fixed-point
            var nonce;                    // integer (optional)
            if (branch.nonce) {
                nonce = branch.nonce;
            }
            var branch = branch.branchId; // sha256
        }
        if (!nonce) {
            augur.getNonce(market, function (nonce) {
                augur.tx.buyShares.params = [branch, market, outcome, augur.fix(amount), nonce];
                augur.invoke(augur.tx.buyShares, onSent);
            });
        } else {
            augur.tx.buyShares.params = [branch, market, outcome, augur.fix(amount), nonce];
            augur.invoke(augur.tx.buyShares, onSent);
        }
    };
    augur.sellShares = function (branch, market, outcome, amount, nonce, onSent) {
        if (branch.constructor === Object && branch.branchId) {
            var market = branch.marketId; // sha256
            var outcome = branch.outcome; // integer (1 or 2 for binary)
            var amount = branch.amount;   // number -> fixed-point
            var nonce;                    // integer (optional)
            if (branch.nonce) {
                nonce = branch.nonce;
            }
            var branch = branch.branchId; // sha256
        }
        if (!nonce) {
            augur.getNonce(market, function (nonce) {
                augur.tx.sellShares.params = [branch, market, outcome, augur.fix(amount), nonce];
                augur.invoke(augur.tx.sellShares, onSent);
            });
        } else {
            augur.tx.sellShares.params = [branch, market, outcome, augur.fix(amount), nonce];
            augur.invoke(augur.tx.sellShares, onSent);
        }
    };

    // createBranch.se

    // p2pWagers.se

    // sendReputation.se
    augur.tx.sendReputation = {
        from: augur.coinbase,
        to: augur.contracts.sendReputation,
        method: "sendReputation",
        signature: "iii",
        send: true
    };
    augur.sendReputation = function (branch, receiver, value, onSent) {
        // branch: sha256
        // receiver: sha256
        // value: number -> fixed-point
        augur.tx.sendReputation.params = [branch, receiver, augur.fix(value)];
        augur.invoke(augur.tx.sendReputation, onSent);
    };

    // transferShares.se

    // makeReports.se

    // createEvent.se
    augur.tx.createEvent = {
        from: augur.coinbase,
        to: augur.contracts.createEvent,
        method: "createEvent",
        signature: "isiiii",
        send: true
    };
    augur.createEvent = function (branch, description, expDate, minValue, maxValue, numOutcomes, onSent, onSuccess) {
        // first parameter can optionally be a transaction object
        if (branch.constructor === Object && branch.branchId) {
            var description = branch.description; // string
            var minValue = branch.minValue;       // integer (1 for binary)
            var maxValue = branch.maxValue;       // integer (2 for binary)
            var numOutcomes = branch.numOutcomes; // integer (2 for binary)
            var expDate = branch.expDate;         // integer
            var onSent = branch.onSent;           // function({id, txhash})
            var onSuccess = branch.onSuccess;     // function({id, txhash})
            var branch = branch.branchId;         // sha256 hash
        }
        augur.tx.createEvent.params = [branch, description, expDate, minValue, maxValue, numOutcomes];
        augur.tx.createEvent.send = false;
        augur.invoke(augur.tx.createEvent, function (eventID) {
            if (eventID) {
                var event = { id: eventID };
                augur.tx.createEvent.send = true;
                augur.invoke(augur.tx.createEvent, function (txhash) {
                    if (txhash) {
                        event.txhash = txhash;
                        if (onSent) onSent(event);
                        if (onSuccess) {
                            var pings = 0;
                            var pingTx = function () {
                                augur.getEventInfo(eventID, function (eventInfo) {
                                    pings++;
                                    if (eventInfo && eventInfo.branch && eventInfo.branch != 0 && eventInfo.branch != "0") {
                                        event.branch = eventInfo.branch;
                                        event.expirationDate = eventInfo.expirationDate;
                                        event.outcome = eventInfo.outcome;
                                        event.minValue = eventInfo.minValue;
                                        event.maxValue = eventInfo.maxValue;
                                        event.numOutcomes = eventInfo.numOutcomes;
                                        event.description = eventInfo.description;
                                        onSuccess(event);
                                    } else {
                                        if (pings < augur.PINGMAX) setTimeout(pingTx, 12000);
                                    }
                                });
                            };
                            pingTx();
                        }
                    }
                });
            }
        });
    };

    // createMarket.se
    augur.tx.createMarket = {
        from: augur.coinbase,
        to: augur.contracts.createMarket,
        method: "createMarket",
        signature: "isiiia",
        send: true
    };
    augur.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, onSent, onSuccess, onFailed) {
        // first parameter can optionally be a transaction object
        if (branch.constructor === Object && branch.branchId) {
            var alpha = branch.alpha;                // number -> fixed-point
            var description = branch.description;    // string
            var liquidity = branch.initialLiquidity; // number -> fixed-point
            var tradingFee = branch.tradingFee;      // number -> fixed-point
            var events = branch.events;              // array [sha256, ...]
            var onSent = branch.onSent;              // function({id, txhash})
            var onSuccess = branch.onSuccess;        // function({id, txhash})
            var onFailed = branch.onFailed;          // function({id, txhash})
            var branch = branch.branchId;            // sha256 hash
        }
        augur.tx.createMarket.params = [
            branch,
            description,
            augur.fix(alpha, "hex"),
            augur.fix(liquidity, "hex"),
            augur.fix(tradingFee, "hex"),
            events
        ];
        augur.tx.createMarket.send = false;
        augur.invoke(augur.tx.createMarket, function (marketID) {
            if (marketID) {
                var market = { id: marketID };
                if (augur.ERRORS[marketID]) {
                    market.error = "error " + augur.ERRORS[marketID].code.toString() + ": " + augur.ERRORS[marketID].message;
                    if (onFailed) onFailed(market);
                } else {
                    augur.tx.createMarket.send = true;
                    augur.invoke(augur.tx.createMarket, function (txhash) {
                        if (txhash) {
                            market.txhash = txhash;
                            if (onSent) onSent(market);
                            if (onSuccess) {
                                var pings = 0;
                                var pingTx = function () {
                                    augur.getMarketInfo(marketID, function (marketInfo) {
                                        pings++;
                                        if (marketInfo && marketInfo.numOutcomes && marketInfo.numOutcomes != 0 && marketInfo.numOutcomes != "0") {
                                            market.numOutcomes = marketInfo.numOutcomes;
                                            market.currentParticipant = marketInfo.currentParticipant;
                                            market.alpha = marketInfo.alpha;
                                            market.cumulativeScale = marketInfo.cumulativeScale;
                                            market.numOutcomes = marketInfo.numOutcomes;
                                            market.tradingPeriod = marketInfo.tradingPeriod;
                                            market.tradingFee = marketInfo.tradingFee;
                                            market.description = marketInfo.description;
                                            onSuccess(market);
                                        } else {
                                            if (pings < augur.PINGMAX) setTimeout(pingTx, 12000);
                                        }
                                    });
                                };
                                pingTx();
                            }
                        }
                    });
                }
            }
        });
    };

    // closeMarket.se
    augur.tx.closeMarket = {
        from: augur.coinbase,
        to: augur.contracts.closeMarket,
        method: "closeMarket",
        signature: "ii",
        returns: "number",
        send: true
    };
    augur.closeMarket = function (branch, market, onSent) {
        // branch: sha256
        // market: sha256
        augur.tx.closeMarket.params = [branch, market];
        augur.invoke(augur.tx.closeMarket, onSent);
    };

    // dispatch.se
    augur.tx.dispatch = {
        from: augur.coinbase,
        to: augur.contracts.dispatch,
        method: "dispatch",
        signature: "i",
        returns: "number",
        send: true
    };
    augur.dispatch = function (branchNumber, onSent) {
        // branchNumber: integer
        augur.tx.dispatch.params = branchNumber;
        augur.invoke(augur.tx.dispatch, onSent);
    };

    /***************************
     * Whisper comments system *
     ***************************/

    augur.getMessages = function (filter, f) {
        return json_rpc(postdata("getMessages", filter, "shh_"), f);
    };
    augur.getFilterChanges = function (filter, f) {
        return json_rpc(postdata("getFilterChanges", filter, "shh_"), f);
    };
    augur.putString = function (key, string, f) {
        return json_rpc(postdata("putString", ["augur", key, string], "db_"), f);
    };
    augur.getString = function (key, f) {
        return json_rpc(postdata("getString", ["augur", key], "db_"), f);
    };
    augur.newIdentity = function (f) {
        return json_rpc(postdata("newIdentity", null, "shh_"), f);
    };
    augur.post = function (params, f) {
        return json_rpc(postdata("post", params, "shh_"), f);
    };
    augur.whisperFilter = function (params, f) {
        return json_rpc(postdata("newFilter", params, "shh_"), f);
    };
    augur.commentFilter = function (market, f) {
        return augur.whisperFilter({ topics: [ market ]}, f);
    };
    augur.uninstallFilter = function (filter, f) {
        return json_rpc(postdata("uninstallFilter", filter, "shh_"), f);
    };
    /**
     * Incoming comment filter:
     *  - compare comment string length, write the longest to leveldb
     *  - 10 second ethereum network polling interval
     */
    function pollFilter(market_id, filter_id) {
        augur.getFilterChanges(filter_id, function (message) {
            log(message);
            if (message && message.length && message[0].payload) {
                var incoming_comments = augur.decode_hex(message[0].payload);
                if (incoming_comments) {
                    var updated_comments = JSON.stringify([{
                        whisperId: message[0].from, // whisper ID
                        from: augur.coinbase, // ethereum account
                        comment: incoming_comments,
                        time: message[0].sent
                    }]);
                    incoming_comments = JSON.parse(incoming_comments);
        
                    // get existing comment(s) stored locally
                    augur.getString(market_id, function (stored_comments) {

                        // check if incoming comments length > stored
                        if (stored_comments && stored_comments.length) {
                            stored_comments = JSON.parse(stored_comments);
                            if (incoming_comments.length > stored_comments.length ) {
                                log("[" + filter_id + "] overwriting comments for market: " + market_id);
                                augur.putString(market_id, incoming_comments, function (put_ok) {
                                    if (put_ok) {
                                        log("[" + filter_id + "] updated comments for market: " + market_id);
                                    }
                                });
                                log(incoming_comments.length.toString() + " comments found");
                                log(incoming_comments);
                            } else {
                                log(stored_comments.length.toString() + " comments found");
                                log("[" + filter_id + "] retaining comments for market: " + market_id);
                                log(stored_comments);
                            }
                        }

                        augur.putString(market_id, updated_comments, function (put_ok) {
                            if (put_ok) {
                                log("[" + filter_id + "] updated comments for market: " + market_id);
                            }
                        });
                    });
                }
            } else {
                // log("[" + filter_id + "] no new comments for market: " + market_id);
            }
            setTimeout(function () { pollFilter(market_id, filter_id); }, 10000);
        });
    }
    augur.comment = function (market_id, comment_text, f) {

        // get existing comment(s) stored locally
        // (note: build with DFATDB=1 if DBUNDLE=minimal)
        augur.newIdentity(function (whisper_id) {
            if (whisper_id) {
                var updated = JSON.stringify([{
                    whisperId: whisper_id, // whisper ID
                    from: augur.coinbase, // ethereum account
                    comment: comment_text,
                    time: Math.floor((new Date).getTime() / 1000)
                }]);
                augur.getString(market_id, function (comments) {
                    if (comments) {
                        updated = updated.slice(0,-1) + "," + comments.slice(1);
                    }
                    augur.putString(market_id, updated, function (put_ok) {
                        if (put_ok) log("comment added to leveldb");
                    });
                    var transmission = {
                        from: whisper_id,
                        topics: [market_id],
                        payload: augur.prefix_hex(augur.encode_hex(updated)),
                        priority: "0x64",
                        ttl: "0x500" // time-to-live (until expiration) in seconds
                    };
                    augur.post(transmission, function (post_ok) {
                        if (post_ok) log("comment sent successfully");
                    });
                    if (f) f(JSON.parse(augur.decode_hex(transmission.payload)));
                });
            }
        });
    };

    augur.getCoinbase = function (repeat) {
        try {
            augur.coinbase = json_rpc(postdata("coinbase"));
        } catch (e) {
            var delay = 5000 * repeat;
            log("connection error, retrying in " + parseInt(delay / 1000).toString() + " seconds");
            if (repeat) {
                setTimeout(function () { augur.getCoinbase(repeat + 1); }, delay);
            }
        }
    };
    augur.getCoinbase(1);

    return augur;

})(Augur || {});

delete rpc;

if (MODULAR) module.exports = Augur;
