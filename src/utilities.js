"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var fs = (NODE_JS) ? require("fs") : null;
var path = (NODE_JS) ? require("path") : null;
var assert = (NODE_JS) ? require("assert") : console.assert;
var crypto = (NODE_JS) ? require("crypto") : require("crypto-browserify");
var BigNumber = require("bignumber.js");
var validator = require("validator");
var moment = require("moment");
var chalk = require("chalk");
var abi = require("augur-abi");
var constants = require("./constants");
var log = console.log;

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID });

module.exports = {

    pp: function (obj, indent) {
        var o = this.copy(obj);
        for (var k in o) {
            if (!o.hasOwnProperty(k)) continue;
            if (o[k] && o[k].constructor === Function) {
                o[k] = o[k].toString();
                if (o[k].length > 64) {
                    o[k] = o[k].match(/function (\w*)/).slice(0, 1).join('');
                }
            }
        }
        return chalk.green(JSON.stringify(o, null, indent || 4));
    },

    STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,

    ARGUMENT_NAMES: /([^\s,]+)/g,

    labels: function (func) {
        var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
        if (result === null) result = [];
        return result;
    },

    unpack: function (o, labels, args) {
        var params = [], cb = [];

        // unpack object argument
        if (o !== undefined && o !== null && o.constructor === Object &&
            labels && labels.constructor === Array && labels.length)
        {
            for (var i = 0, len = labels.length; i < len; ++i) {
                if (o[labels[i]] !== undefined) {
                    if (o[labels[i]].constructor === Function) {
                        cb.push(o[labels[i]]);
                    } else {
                        params.push(o[labels[i]]);
                    }
                } else {
                    return null;
                }
            }

        // unpack positional arguments
        } else {
            for (var j = 0, arglen = args.length; j < arglen; ++j) {
                if (args[j] !== undefined) {
                    if (args[j] && args[j].constructor === Function) {
                        cb.push(args[j]);
                    } else {
                        params.push(args[j]);
                    }
                } else {
                    return null;
                }
            }
        }

        return { params: params, cb: cb };
    },

    // calculate date from block number
    block_to_date: function (augur, block) {
        var current_block = augur.rpc.blockNumber();
        var seconds = (block - current_block) * constants.SECONDS_PER_BLOCK;
        var date = moment().add(seconds, 'seconds');
        return date;
    },

    // calculate block number from date
    date_to_block: function (augur, date) {
        date = moment(new Date(date));
        var current_block = augur.rpc.blockNumber();
        var now = moment();
        var seconds_delta = date.diff(now, 'seconds');
        var block_delta = parseInt(seconds_delta / constants.SECONDS_PER_BLOCK);
        return current_block + block_delta;
    },

    // a few handy conversion functions, mostly from
    // http://michael-rushanan.blogspot.ca/2014/03/javascript-uint8array-hacks-and-cheat.html

    str2ua: function (s) {
        var ua = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            ua[i] = s.charCodeAt(i);
        }
        return ua;
    },
     
    ua2str: function (ua) {
        var s = '';
        for (var i = 0; i < ua.length; i++) {
            s += String.fromCharCode(ua[i]);
        }
        return s;
    },

    ua2hex: function (ua) {
        var h = '';
        for (var i = 0; i < ua.length; i++) {
            h += "\\0x" + ua[i].toString(16);
        }
        return h;
    },

    ua2b64: function (ua) {
        return this.btoa(String.fromCharCode.apply(null, ua));
    },

    b642ua: function (b64) {
        return new Uint8Array(this.atob(b64).split('').map(function (c) {
            return c.charCodeAt(0);
        }));
    },

    hex2b64: function (str) {
        return new Buffer(str, "hex").toString("base64");
    },

    b642hex: function (str) {
        return new Buffer(str, "base64").toString("hex");
    },

    btoa: function (str) {
        var buffer;
        if (str instanceof Buffer) {
            buffer = str;
        } else {
            buffer = new Buffer(str.toString(), "binary");
        }
        return buffer.toString("base64");
    },

    atob: function (str) {
        return new Buffer(str, "base64").toString("binary");
    },

    escape_unicode: function (str) {
        return str.replace(/[\s\S]/g, function (escape) {
            return '\\u' + ('0000' + escape.charCodeAt().toString(16)).slice(-4);
        });
    },

    str2buf: function (str, enc) {
        if (str.constructor === String) {
            if (enc) {
                str = new Buffer(str, enc);
            } else {
                if (validator.isHexadecimal(str)) {
                    str = new Buffer(str, "hex");
                } else if (validator.isBase64(str)) {
                    str = new Buffer(str, "base64");
                } else {
                    str = new Buffer(str);
                }
            }
        }
        return str;
    },

    hex2utf16le: function (input) {
        var output = '';
        for (var i = 0, l = input.length; i < l; i += 4) {
            output += '\\u' + input.slice(i+2, i+4) + input.slice(i, i+2);
        }
        return JSON.parse('"' + output + '"');
    },

    has_value: function (o, v) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                if (o[p] === v) return p;
            }
        }
    },

    setup: function (augur, args, rpcinfo, bignum) {
        var gospel, contracts;
        if (NODE_JS && args &&
            (args.indexOf("--gospel") > -1 || args.indexOf("--reset") > -1))
        {
            gospel = path.join(__dirname, "..", "data", "gospel.json");
            contracts = fs.readFileSync(gospel);
            augur.contracts = JSON.parse(contracts.toString());
        }
        if (!bignum) augur.bignumbers = false;
        if (augur.connect(rpcinfo) && rpcinfo) {
            log(chalk.magenta("augur"), "connected:", chalk.cyan(augur.nodes[0]));
        }
        return augur;
    },

    reset: function (mod) {
        mod = path.join(__dirname, path.parse(mod).name);
        delete require.cache[require.resolve(mod)];
        return require(mod);
    },

    urlstring: function (obj) {
        return (obj.protocol || "http") + "://" + (obj.host || "127.0.0.1") + ":" + (obj.port || 8545);
    },

    gteq0: function (n) { return (new BigNumber(n)).toNumber() >= 0; },

    print_matrix: function (m) {
        for (var i = 0, rows = m.length; i < rows; ++i) {
            process.stdout.write("\t");
            for (var j = 0, cols = m[0].length; j < cols; ++j) {
                process.stdout.write(chalk.cyan(m[i][j] + "\t"));
            }
            process.stdout.write("\n");
        }
    },

    wait: function (seconds) {
        var start, delay;
        start = new Date();
        delay = seconds * 1000;
        while ((new Date()) - start <= delay) {}
        return true;
    },

    get_test_accounts: function (augur, max_accounts) {
        var accounts;
        if (augur) {
            if (typeof augur === "object") {
                accounts = augur.rpc.accounts();
            } else if (typeof augur === "string") {
                accounts = require("fs").readdirSync(require("path").join(augur, "keystore"));
                for (var i = 0, len = accounts.length; i < len; ++i) {
                    accounts[i] = abi.prefix_hex(accounts[i]);
                }
            }
            if (max_accounts && accounts.length > max_accounts) {
                accounts = accounts.slice(0, max_accounts);
            }
            return accounts;
        }
    },

    get_balances: function (augur, account, branch) {
        if (augur) {
            branch = branch || augur.branches.dev;
            account = account || augur.coinbase;
            return {
                cash: augur.getCashBalance(account),
                reputation: augur.getRepBalance(branch || augur.branches.dev, account),
                ether: abi.bignum(augur.balance(account)).dividedBy(constants.ETHER).toFixed()
            };
        }
    },

    read_ballots: function (augur, address, branch, period) {
        var ballot, num_events;
        log("Looking up ballots for", chalk.green(address));
        for (var i = 0; i < period; ++i) {
            ballot = augur.getReporterBallot(branch, i, address);
            if (ballot.length && ballot[0] !== undefined) {
                num_events = augur.getNumberEvents(branch, i);
                log("Period", chalk.cyan(i), "\t",
                    chalk.green(abi.fix(ballot.slice(0, num_events), "hex")));
            }
        }
    },

    // chop a string up into an array of smaller strings
    chunk32: function (string, stride, offset) {
        var elements, chunked, position;
        if (string.length >= 66) {
            stride = stride || 64;
            if (offset) {
                elements = Math.ceil(string.slice(offset).length / stride) + 1;
            } else {
                elements = Math.ceil(string.length / stride);
            }
            chunked = new Array(elements);
            position = 0;
            for (var i = 0; i < elements; ++i) {
                if (offset && i === 0) {
                    chunked[i] = string.slice(position, position + offset);
                    position += offset;
                } else {
                    chunked[i] = string.slice(position, position + stride);
                    position += stride;
                }
            }
            return chunked;
        } else {
            return string;
        }
    },

    sha256: function (x) {
        return crypto.createHash("sha256").update(x).digest("hex");
    },

    copy: function (obj) {
        if (null === obj || "object" !== typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },

    loop: function (list, iterator) {
        var n = list.length;
        var i = -1;
        var calls = 0;
        var looping = false;
        var iterate = function (quit, breaker) {
            calls -= 1;
            i += 1;
            if (i === n || quit) {
                if (breaker) {
                    return breaker();
                } else {
                    return;
                }
            }
            iterator(list[i], next);
        };
        var runloop = function () {
            if (looping) return;
            looping = true;
            while (calls > 0) iterate();
            looping = false;
        };
        var next = function (quit, breaker) {
            calls += 1;
            if (typeof setTimeout === "undefined") {
                runloop();
            } else {
                setTimeout(function () { iterate(quit, breaker); }, 1);
            }
        };
        next();
    },

    fold: function (arr, num_cols) {
        var i, j, folded, num_rows, row;
        folded = [];
        num_cols = parseInt(num_cols);
        num_rows = arr.length / num_cols;
        num_rows = parseInt(num_rows);
        for (i = 0; i < parseInt(num_rows); ++i) {
            row = [];
            for (j = 0; j < num_cols; ++j) {
                row.push(arr[i*num_cols + j]);
            }
            folded.push(row);
        }
        return folded;
    }

};
