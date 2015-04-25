/**
 * Send JSON-RPC commands to Ethereum from the safety and convenience of
 * your browser!
 * 
 * @author Jack Peterson (jack@augur.net)
 * @date 4/12/2015
 * @license MIT
 */

var primary_account = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
var rpc = { protocol: "http", host: "127.0.0.1", port: 8545 };

function encode_int(value) {
    var cs = [];
    while (value > 0) {
        cs.push(String.fromCharCode(value % 256));
        value = Math.floor(value / 256);
    }
    return (cs.reverse()).join('');
}

function zeropad(r) {
    var nzeros = Math.max(0, 32 - r.length);
    var padding = [];
    while (nzeros--) {
        padding[nzeros] = "\x00";
    }
    return encode_utf8(padding.join('') + r);
}

function encode_single(arg, base, sub) {
    var normal_args, len_args, var_args;
    normal_args = '';
    len_args = '';
    var_args = '';
    if (base === "int") {
        normal_args = zeropad(encode_int(arg % Math.pow(2, sub)));
    } else if (base === "string") {
        len_args = zeropad(encode_int(arg.length));
        var_args = arg;
    }
    return {
        len_args: len_args,
        normal_args: normal_args,
        var_args: var_args
    }
}

function encode_any(arg, base, sub, arrlist) {
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
            normal_args = zeropad(encode_int(arg % Math.pow(2, 256)));
        }
        return {
            len_args: len_args,
            normal_args: normal_args,
            var_args: var_args
        }
    }
}

function encode_utf8(str) {
    var length, char;
    var bytes = [];
    var offset = 0;

    str = encodeURI(str);
    length = str.length;

    while (offset < length) {
        char = str[offset];
        offset += 1;

        if ('%' !== char) {
            bytes.push(char.charCodeAt(0));
        } else {
            char = str[offset] + str[offset + 1];
            bytes.push(parseInt(char, 16));
            offset += 2;
        }
    }
    return bytes.join('');
}

var EthRPC = (function (rpc_url, primary) {

    var pdata, id = 1;

    function parse(response, callback) {
        if (response.error) {
            console.error(
                "[" + response.error.code + "]",
                response.error.message
            );
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

    // post json-rpc command to ethereum client
    function json_rpc(command, callback, async) {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (async) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    parse(JSON.parse(xhr.responseText), callback);
                }
            };
            xhr.open("POST", rpc_url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(command));
        } else {            
            xhr.open("POST", rpc_url, false);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(command));
            return parse(JSON.parse(xhr.responseText), callback);
        }
    }

    function postdata(command, params, prefix) {
        pdata = {
            id: id++,
            jsonrpc: "2.0",
            method: (prefix || "eth_") + command.toString()
        };
        if (params) {
            if (params.constructor === Array) {
                pdata.params = params;
            } else {
                pdata.params = [params];
            }
        } else {
            pdata.params = null;
        }
        return pdata;
    }

    return {
        rpc: function (command, params, f) {
            return json_rpc(postdata(command, params, ""), f);
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
        blockNumber: function (f) {
            return json_rpc(postdata("blockNumber"), function (data) {
                var blocknum = parseInt(data.result, 16);
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
            tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : "0x989680";
            return json_rpc(postdata("call", tx), f);
        },
        sendTx: function (tx, f) {
            tx.to = tx.to || "";
            tx.gas = (tx.gas) ? "0x" + tx.gas.toString(16) : "0x989680";
            return json_rpc(postdata("sendTransaction", tx), f);
        },
        getTx: function (hash, f) {
            return json_rpc(postdata("getTransactionByHash", hash), f);
        },
        peerCount: function (f) {
            return json_rpc(postdata("peerCount", [], "net_"), f);
        },
        // publish a new contract to the blockchain (from the primary account)
        publish: function (compiled, f) {
            return this.sendTx({ from: primary, data: compiled }, f);
        },
        // invoke a function from a contract on the blockchain
        invoke: function (address, funcname, sig, data, f) {
            address = "0x0cb1277671d162b2f5c81e9435744f63768398d0"; // mul2
            funcname = "double";
            sig = "i";
            data = "[3]";
            child_process.exec("serpent get_prefix " + funcname + " '" + sig + "'", function (err, prefix) {
                if (err) return console.error(err);
                var data_abi = parseInt(prefix.slice(0,-1)).toString(16);
                var types = [];
                for (var i = 0, len = sig.length; i < len; ++i) {
                    if (sig[i] == 's') {
                        types.push("string");
                    } else if (sig[i] == 'a') {
                        types.push("int256[]");
                    } else {
                        types.push("int256");
                    }
                }
                var len_args = '';
                var normal_args = '';
                var var_args = '';
                var base, sub, arrlist;
                data = JSON.parse(data);
                console.log("types: ", types);
                console.log("data: ", data);
                if (types.length == data.length) {
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
                        res = encode_any(data[i], base, sub, arrlist);
                        len_args += res.len_args;
                        normal_args += res.normal_args;
                        var_args += res.var_args;
                    }
                    data_abi += len_args + normal_args + var_args;
                    console.log("ABI data: ", data_abi);
                    return this.call({ from: primary, to: address, data: data_abi }, f);
                } else {
                    return console.error("Wrong number of arguments");
                }
            });
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
        getCode: function (address, block, f) { return this.read(address, block, f); }
    };
})(rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString(), primary_account);
