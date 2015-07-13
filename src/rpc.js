/**
 * JSON RPC methods
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

if (NODE_JS) {
    var request = require("sync-request");
    var XHR2 = require("xhr2");
}
var BigNumber = require("bignumber.js");
var numeric = require("./numeric");

module.exports = function (options) {

    return {

        BigNumberOnly: options.BigNumberOnly,

        url: options.RPC,

        nodes: [options.RPC].concat(options.nodes),

        id: 1,

        data: {},

        parse_array: function (string, returns, stride, init) {
            var elements, array, position;
            if (string.length >= 66) {
                stride = stride || 64;
                elements = Math.ceil((string.length - 2) / stride);
                array = new Array(elements);
                position = init || 2;
                for (var i = 0; i < elements; ++i) {
                    array[i] = numeric.prefix_hex(string.slice(position, position + stride));
                    position += stride;
                }
                if (array.length) {
                    if (parseInt(array[0]) === array.length - 1) {
                        array.splice(0, 1);
                    } else if (parseInt(array[1]) === array.length - 2 ||
                        parseInt(array[1]) / 32 === array.length - 2) {
                        array.splice(0, 2);
                    }
                }
                for (i = 0; i < array.length; ++i) {
                    if (returns === "hash[]" && this.BigNumberOnly) {
                        array[i] = numeric.bignum(array[i]);
                    } else {
                        if (returns === "number[]") {
                            array[i] = numeric.bignum(array[i]).toFixed();
                        } else if (returns === "unfix[]") {
                            if (this.BigNumberOnly) {
                                array[i] = numeric.unfix(array[i]);
                            } else {
                                array[i] = numeric.unfix(array[i], "string");
                            }
                        }
                    }
                }
                return array;
            } else {
                return string;
            }
        },

        format_result: function (returns, result) {
            returns = returns.toLowerCase();
            if (result && result !== "0x") {
                if (returns && returns.slice(-2) === "[]") {
                    result = this.parse_array(result, returns);
                } else if (returns === "string") {
                    result = numeric.decode_hex(result, true);
                } else {
                    if (this.BigNumberOnly) {
                        if (returns === "unfix") {
                            result = numeric.unfix(result);
                        }
                        if (result.constructor !== BigNumber) {
                            result = numeric.bignum(result);
                        }
                    } else {
                        if (returns === "number") {
                            result = numeric.bignum(result).toFixed();
                        } else if (returns === "bignumber") {
                            result = numeric.bignum(result);
                        } else if (returns === "unfix") {
                            result = numeric.unfix(result, "string");
                        }
                    }
                }
            }
            return result;
        },

        parse: function (response, returns, callback) {
            var results, len;
            try {
                if (response !== undefined) {
                    response = JSON.parse(response);
                    if (response.error) {
                        response = {
                            error: response.error.code,
                            message: response.error.message
                        };
                        if (callback) {
                            callback(response);
                        } else {
                            return response;
                        }
                    } else if (response.result !== undefined) {
                        if (returns) {
                            response.result = this.format_result(returns, response.result);
                        } else {
                            if (response.result && response.result.length > 2 && response.result.slice(0,2) === "0x") {
                                response.result = numeric.remove_leading_zeros(response.result);
                                response.result = numeric.prefix_hex(response.result);
                            }
                        }
                        if (callback) {
                            callback(response.result);
                        } else {
                            return response.result;
                        }
                    } else if (response.constructor === Array && response.length) {
                        len = response.length;
                        results = new Array(len);
                        for (var i = 0; i < len; ++i) {
                            results[i] = response[i].result;
                            if (response.error) {
                                console.error(
                                    "[" + response.error.code + "]",
                                    response.error.message
                                );
                            } else if (response[i].result !== undefined) {
                                if (returns[i]) {
                                    results[i] = this.format_result(returns[i], response[i].result);
                                } else {
                                    results[i] = numeric.remove_leading_zeros(results[i]);
                                    results[i] = numeric.prefix_hex(results[i]);
                                }
                            }
                        }
                        if (callback) {
                            callback(results);
                        } else {
                            return results;
                        }
                    // no result or error field
                    } else {
                        if (callback) {
                            callback(response);
                        } else {
                            return response;
                        }
                    }
                }
            } catch (e) {
                if (callback) {
                    callback(e);
                } else {
                    return e;
                }
            }
        },

        strip_returns: function (tx) {
            var returns;
            if (tx.params !== undefined && tx.params.length && tx.params[0] && tx.params[0].returns) {
                returns = tx.params[0].returns;
                delete tx.params[0].returns;
            }
            return returns;
        },

        postSync: function (rpc_url, command, returns) {
            var req = null;
            if (NODE_JS) {
                return this.parse(request('POST', rpc_url, {
                    json: command
                }).getBody().toString(), returns);
            } else {
                if (window.XMLHttpRequest) {
                    req = new window.XMLHttpRequest();
                } else {
                    req = new window.ActiveXObject("Microsoft.XMLHTTP");
                }
                req.open("POST", rpc_url, false);
                req.setRequestHeader("Content-type", "application/json");
                req.send(command);
                return this.parse(req.responseText, returns);
            }
        },

        post: function (rpc_url, command, returns, callback) {
            var req = null;
            if (NODE_JS) {
                req = new XHR2();
            } else {
                if (window.XMLHttpRequest) {
                    req = new window.XMLHttpRequest();
                } else {
                    req = new window.ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    this.parse(req.responseText, returns, callback);
                }
            }.bind(this);
            req.open("POST", rpc_url, true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
        },

        // Post JSON-RPC command to Ethereum node
        json_rpc: function (command, callback) {
            var i, j, num_nodes, num_commands, returns, result;

            num_nodes = this.nodes.length;

            // parse batched commands and strip "returns" fields
            if (command.constructor === Array) {
                num_commands = command.length;
                returns = new Array(num_commands);
                for (i = 0; i < num_commands; ++i) {
                    returns[i] = this.strip_returns(command[i]);
                }
            } else {
                returns = this.strip_returns(command);
            }

            // asynchronous request if callback exists
            if (callback && callback.constructor === Function) {
                command = JSON.stringify(command);
                for (j = 0; j < num_nodes; ++j) {
                    this.post(this.nodes[j], command, returns, callback);
                }

            // use synchronous http if no callback provided
            } else {
                if (!NODE_JS) command = JSON.stringify(command);
                for (j = 0; j < num_nodes; ++j) {
                    result = this.postSync(this.nodes[j], command, returns);
                    if (result && result !== "0x") return result;
                }
            }
        },

        postdata: function (command, params, prefix) {
            this.data = {
                id: this.id++,
                jsonrpc: "2.0"
            };
            if (prefix === "null") {
                this.data.method = command.toString();
            } else {
                this.data.method = (prefix || "eth_") + command.toString();
            }
            if (params !== undefined && params !== null) {
                if (params.constructor === Array) {
                    this.data.params = params;
                } else {
                    this.data.params = [params];
                }
            } else {
                this.data.params = [];
            }
            return this.data;
        }

    };
};
