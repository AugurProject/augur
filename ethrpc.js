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
        // invoke: function (address, funcname, f) {
        //     var data = funcname;
        //     return this.call({ from: primary, to: address, data: data }, f);
        // },
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
