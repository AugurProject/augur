/**
 * Send JSON-RPC commands to Ethereum from the safety and convenience of
 * your browser!
 * 
 * @author Jack Peterson (jack@augur.net)
 * @date 4/12/2015
 * @license MIT
 */

var rpc = {
    protocol: "http",
    host: "127.0.0.1",
    port: 8545,
    async: false
};

var NODE_JS = typeof(module) != 'undefined';
if (NODE_JS) {
    var http = require('http');
    var httpsync = require('http-sync');
    var keccak_256 = require('js-sha3').keccak_256;
    var BigNumber = require('bignumber.js');
    var XMLHttpRequest = require('xhr2');
}

var pdata, id = 1;
var rpc_url = rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString();
var default_gas = "0x2dc6c0";

function log(msg) {
    var output = "[ethrpc.js] ";
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
    return array;
}

function encode_int(value) {
    var cs = [];
    while (value > 0) {
        cs.push(String.fromCharCode(value % 256));
        value = Math.floor(value / 256);
    }
    return (cs.reverse()).join('');
}

function encode_hex(str) {
    var result = '';
    for (var i = 0, len = str.length; i < len; ++i) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
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
    if (arrlist) {
        var res;
        var o = '';
        for (var j = 0, l = arg.length; j < l; ++j) {
            res = encode_any(arg[j], base, sub, arrlist.slice(0,-1));
            o += res.normal_args;
        }
        return {
            len_args: zeropad(encode_int(arg.length)),
            normal_args: '',
            var_args: o
        }
    } else {
        var len_args = '';
        var normal_args = '';
        var var_args = '';
        if (base === "string") {
            len_args = zeropad(encode_int(arg.length));
            var_args = arg;
        }
        if (base === "int") {
            if (arg.constructor === Number) {
                normal_args = zeropad(encode_int(arg % Math.pow(2, sub)));
            } else if (arg.constructor === String) {
                if (arg.slice(0,2) === "0x") {
                    normal_args = zeropad(arg.slice(2), true);
                } else {
                    normal_args = zeropad(encode_int(parseInt(arg) % Math.pow(2, sub)));
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
                summary += "string";
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
    summary += ")";
    return "0x" + keccak_256(summary).slice(0, 8);
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function parse(response, callback) {
    response = JSON.parse(response);
    if (response.error) {
        console.error(
            "[" + response.error.code + "]",
            response.error.message
        );
    } else {
        if (rpc.async) {
            if (response.result && callback) {
                callback(response);
            } else if (response.result) {
                log(response.result);
            } else {
                log(response);
            }
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

function postdata(command, params, prefix) {
    pdata = {
        id: id++,
        jsonrpc: "2.0"
    };
    if (prefix === "null") {
        pdata.method = command.toString();
    } else {
        pdata.method = (prefix || "eth_") + command.toString();
    }
    if (params) {
        if (params.constructor === Array) {
            pdata.params = params;
        } else {
            pdata.params = [params];
        }
    } else {
        pdata.params = [];
    }
    return JSON.stringify(pdata);
}

// post json-rpc command to ethereum client
function json_rpc(command, callback) {
    var req = null;
    if (NODE_JS) {
        if (rpc.async) {
            req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    parse(req.responseText, callback);
                }
            };
            req.open("POST", rpc_url, true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
        } else {
            req = httpsync.request({
                protocol: rpc.protocol,
                host: rpc.host,
                path: '/',
                port: rpc.port,
                method: 'POST'
            });
            req.write(command);
            return parse((req.end()).body.toString(), callback);
        }
    } else {
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (rpc.async) {
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    parse(req.responseText, callback);
                }
            };
            req.open("POST", rpc_url, true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
        } else {            
            req.open("POST", rpc_url, false);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
            return parse(req.responseText, callback);
        }
    }
}

var EthRPC = {
    rpc: function (command, params, f) {
        return json_rpc(postdata(command, params, "null"), f);
    },
    eth: function (command, params, f) {
        return json_rpc(postdata(command, params), f);
    },
    net: function (command, params, f) {
        return json_rpc(postdata(command, params, "net_"), f);
    },
    web3: function (command, params, f) {
        return json_rpc(postdata(command, params, "web3_"), f);
    },
    db: function (command, params, f) {
        return json_rpc(postdata(command, params, "db_"), f);
    },
    shh: function (command, params, f) {
        return json_rpc(postdata(command, params, "shh_"), f);
    },
    hash: function (data, small, f) {
        if (data) {
            if (data.constructor === Array || data.constructor === Object) {
                data = JSON.stringify(data);
            }
            return json_rpc(postdata("sha3", data.toString(), "web3_"), function (data) {
                var hash = (small) ? data.result.slice(0, 10) : data.result;
                if (f) {
                    return f(hash);
                } else {
                    return hash;
                }
            });
        }
    },
    gasPrice: function (f) {
        return json_rpc(postdata("gasPrice"), function (data) {
            var gasPrice = parseInt(data.result);
            if (f) {
                return f(gasPrice);
            } else {
                return gasPrice;
            }
        });
    },
    blockNumber: function (f) {
        return json_rpc(postdata("blockNumber"), function (data) {
            var blocknum = parseInt(data.result);
            if (f) {
                return f(blocknum);
            } else {
                return blocknum;
            }
        });
    },
    balance: function (address, block, f) {
        return json_rpc(postdata("getBalance", [address, block || "latest"]), f || function (data) {
            return parseInt(data.result, 16) / 1e18;
        });
    },
    txCount: function (address, f) {
        return json_rpc(postdata("getTransactionCount", address), f);
    },
    call: function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : default_gas;
        return json_rpc(postdata("call", tx), f);
    },
    sendTx: function (tx, f) {
        tx.to = tx.to || "";
        tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : default_gas;
        return json_rpc(postdata("sendTransaction", tx), f);
    },
    pay: function (to, value, f) {
        return this.sendTx({ from: this.coinbase(), to: to, value: value }, f);
    },
    getTx: function (hash, f) {
        return json_rpc(postdata("getTransactionByHash", hash), f);
    },
    peerCount: function (f) {
        return parseInt(json_rpc(postdata("peerCount", [], "net_"), f));
    },
    coinbase: function (f) {
        return json_rpc(postdata("coinbase"), f);
    },
    // publish a new contract to the blockchain (from the coinbase account)
    publish: function (compiled, f) {
        return this.sendTx({ from: this.coinbase(), data: compiled }, f);
    },
    // hex-encode a function's ABI data and return it
    abi_data: function (tx, f) {
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
    },
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
    invoke: function (tx, f) {
        var tx = clone(tx);
        data_abi = this.abi_data(tx);
        if (tx && data_abi) {
            var packaged = {
                from: tx.from || this.coinbase(),
                to: tx.to,
                data: data_abi
            };
            var invocation = (tx.send) ? this.sendTx : this.call;
            var result = invocation(packaged, f);
            if (tx.returns) {
                try {
                    if (tx.returns.toLowerCase() === "array") {
                        result = parse_array(result);
                    } else if (tx.returns.toLowerCase() === "int") {
                        result = parseInt(result);
                    } else if (tx.returns.toLowerCase() === "bignumber") {
                        result = new BigNumber(result);
                    }
                } catch (exc) {
                    log(exc);
                }
            }
            return result;
        }
    },
    // read the code in a contract on the blockchain
    read: function (address, block, f) {
        if (address) {
            return json_rpc(postdata("getCode", [address, block || "latest"]), f);
        }
    },
    id: function () { return id; },
    data: function () { return pdata; },
    // aliases
    sha3: function (data, f) { return this.hash(data, f); },
    getBalance: function (address, block, f) { return this.balance(address, block, f); },
    getTransactionCount: function (address, f) { return this.txCount(address, f); },
    sendTransaction: function (tx, f) { return this.sendTx(tx, f); },
    getTransactionByHash: function (hash, f) { return this.getTx(hash, f); },
    getCode: function (address, block, f) { return this.read(address, block, f); },
    run: function (tx, f) { this.invoke(tx, f); },
    execute: function (tx, f) { this.invoke(tx, f); }
};

if (NODE_JS) module.exports = EthRPC;
