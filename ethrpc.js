/**
 * Send JSON-RPC commands to Ethereum from the safety and convenience of
 * your browser!
 * 
 * @author Jack Peterson (jack@augur.net)
 * @date 4/12/2015
 * @license MIT
 */

var primary_account = "0x63524e3fe4791aefce1e932bbfb3fdf375bfad89";
var rpc = {
    protocol: "http",
    host: "127.0.0.1",
    port: 8545
};

var NODE_JS = typeof(module) != 'undefined';
if (NODE_JS) {
    var http = require('http');
    var httpsync = require('http-sync');
    var keccak_256 = require('js-sha3').keccak_256;
} else {
    /*
     * js-sha3 v0.2.0
     * https://github.com/emn178/js-sha3
     *
     * Copyright 2015, emn178@gmail.com
     *
     * Licensed under the MIT license:
     * http://www.opensource.org/licenses/MIT
     */
    (function(e,za){var E="undefined"!=typeof module;E&&(e=global,e.JS_SHA3_TEST&&(e.navigator={userAgent:"Chrome"}));var Aa=(e.JS_SHA3_TEST||!E)&&-1!=navigator.userAgent.indexOf("Chrome"),b="0123456789abcdef".split(""),H=[1,256,65536,16777216],B=[6,1536,393216,100663296],C=[0,8,16,24],sa=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,
2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648],f=[],a=[],G=function(a){return A(a,224,H)},ta=function(a){return A(a,256,H)},ua=function(a){return A(a,384,H)},va=function(a){return A(a,224,B)},wa=function(a){return A(a,256,B)},xa=function(a){return A(a,384,B)},ya=function(a){return A(a,512,B)},A=function(v,e,A){e===za&&(e=512,A=H);var B,g,E=!1,D=0,G=0,qa=v.length,c,d,h,k,l,m,n,p,q,r,t,u,w,x,y,z,I,J,K,L,M,N,O,P,Q,R,
S,T,U,V,W,X,Y,Z,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,F=(1600-2*e)/32,ra=4*F;for(c=0;50>c;++c)a[c]=0;B=0;do{f[0]=B;for(c=1;c<F+1;++c)f[c]=0;for(c=G;D<qa&&c<ra;++D)g=v.charCodeAt(D),128>g?f[c>>2]|=g<<C[c++&3]:(2048>g?f[c>>2]|=(192|g>>6)<<C[c++&3]:(55296>g||57344<=g?f[c>>2]|=(224|g>>12)<<C[c++&3]:(g=65536+((g&1023)<<10|v.charCodeAt(++D)&1023),f[c>>2]|=(240|g>>18)<<C[c++&3],f[c>>2]|=(128|g>>12&63)<<C[c++&3]),f[c>>2]|=(128|g>>6&63)<<C[c++&3]),f[c>>2]|=(128|g&63)<<C[c++&3]);G=c-ra;D==qa&&(f[c>>
2]|=A[c&3],++D);B=f[F];D>qa&&c<ra&&(f[F-1]|=2147483648,E=!0);for(c=0;c<F;++c)a[c]^=f[c];for(g=0;48>g;g+=2)h=a[0]^a[10]^a[20]^a[30]^a[40],k=a[1]^a[11]^a[21]^a[31]^a[41],l=a[2]^a[12]^a[22]^a[32]^a[42],m=a[3]^a[13]^a[23]^a[33]^a[43],n=a[4]^a[14]^a[24]^a[34]^a[44],p=a[5]^a[15]^a[25]^a[35]^a[45],q=a[6]^a[16]^a[26]^a[36]^a[46],r=a[7]^a[17]^a[27]^a[37]^a[47],t=a[8]^a[18]^a[28]^a[38]^a[48],u=a[9]^a[19]^a[29]^a[39]^a[49],d=t^(l<<1|m>>>31),c=u^(m<<1|l>>>31),a[0]^=d,a[1]^=c,a[10]^=d,a[11]^=c,a[20]^=d,a[21]^=
c,a[30]^=d,a[31]^=c,a[40]^=d,a[41]^=c,d=h^(n<<1|p>>>31),c=k^(p<<1|n>>>31),a[2]^=d,a[3]^=c,a[12]^=d,a[13]^=c,a[22]^=d,a[23]^=c,a[32]^=d,a[33]^=c,a[42]^=d,a[43]^=c,d=l^(q<<1|r>>>31),c=m^(r<<1|q>>>31),a[4]^=d,a[5]^=c,a[14]^=d,a[15]^=c,a[24]^=d,a[25]^=c,a[34]^=d,a[35]^=c,a[44]^=d,a[45]^=c,d=n^(t<<1|u>>>31),c=p^(u<<1|t>>>31),a[6]^=d,a[7]^=c,a[16]^=d,a[17]^=c,a[26]^=d,a[27]^=c,a[36]^=d,a[37]^=c,a[46]^=d,a[47]^=c,d=q^(h<<1|k>>>31),c=r^(k<<1|h>>>31),a[8]^=d,a[9]^=c,a[18]^=d,a[19]^=c,a[28]^=d,a[29]^=c,a[38]^=
d,a[39]^=c,a[48]^=d,a[49]^=c,d=a[0],c=a[1],Y=a[11]<<4|a[10]>>>28,Z=a[10]<<4|a[11]>>>28,y=a[20]<<3|a[21]>>>29,z=a[21]<<3|a[20]>>>29,ma=a[31]<<9|a[30]>>>23,na=a[30]<<9|a[31]>>>23,U=a[40]<<18|a[41]>>>14,V=a[41]<<18|a[40]>>>14,M=a[2]<<1|a[3]>>>31,N=a[3]<<1|a[2]>>>31,h=a[13]<<12|a[12]>>>20,k=a[12]<<12|a[13]>>>20,aa=a[22]<<10|a[23]>>>22,ba=a[23]<<10|a[22]>>>22,I=a[33]<<13|a[32]>>>19,J=a[32]<<13|a[33]>>>19,oa=a[42]<<2|a[43]>>>30,pa=a[43]<<2|a[42]>>>30,ga=a[5]<<30|a[4]>>>2,ha=a[4]<<30|a[5]>>>2,O=a[14]<<6|
a[15]>>>26,P=a[15]<<6|a[14]>>>26,l=a[25]<<11|a[24]>>>21,m=a[24]<<11|a[25]>>>21,ca=a[34]<<15|a[35]>>>17,da=a[35]<<15|a[34]>>>17,K=a[45]<<29|a[44]>>>3,L=a[44]<<29|a[45]>>>3,t=a[6]<<28|a[7]>>>4,u=a[7]<<28|a[6]>>>4,ia=a[17]<<23|a[16]>>>9,ja=a[16]<<23|a[17]>>>9,Q=a[26]<<25|a[27]>>>7,R=a[27]<<25|a[26]>>>7,n=a[36]<<21|a[37]>>>11,p=a[37]<<21|a[36]>>>11,ea=a[47]<<24|a[46]>>>8,fa=a[46]<<24|a[47]>>>8,W=a[8]<<27|a[9]>>>5,X=a[9]<<27|a[8]>>>5,w=a[18]<<20|a[19]>>>12,x=a[19]<<20|a[18]>>>12,ka=a[29]<<7|a[28]>>>25,
la=a[28]<<7|a[29]>>>25,S=a[38]<<8|a[39]>>>24,T=a[39]<<8|a[38]>>>24,q=a[48]<<14|a[49]>>>18,r=a[49]<<14|a[48]>>>18,a[0]=d^~h&l,a[1]=c^~k&m,a[10]=t^~w&y,a[11]=u^~x&z,a[20]=M^~O&Q,a[21]=N^~P&R,a[30]=W^~Y&aa,a[31]=X^~Z&ba,a[40]=ga^~ia&ka,a[41]=ha^~ja&la,a[2]=h^~l&n,a[3]=k^~m&p,a[12]=w^~y&I,a[13]=x^~z&J,a[22]=O^~Q&S,a[23]=P^~R&T,a[32]=Y^~aa&ca,a[33]=Z^~ba&da,a[42]=ia^~ka&ma,a[43]=ja^~la&na,a[4]=l^~n&q,a[5]=m^~p&r,a[14]=y^~I&K,a[15]=z^~J&L,a[24]=Q^~S&U,a[25]=R^~T&V,a[34]=aa^~ca&ea,a[35]=ba^~da&fa,a[44]=
ka^~ma&oa,a[45]=la^~na&pa,a[6]=n^~q&d,a[7]=p^~r&c,a[16]=I^~K&t,a[17]=J^~L&u,a[26]=S^~U&M,a[27]=T^~V&N,a[36]=ca^~ea&W,a[37]=da^~fa&X,a[46]=ma^~oa&ga,a[47]=na^~pa&ha,a[8]=q^~d&h,a[9]=r^~c&k,a[18]=K^~t&w,a[19]=L^~u&x,a[28]=U^~M&O,a[29]=V^~N&P,a[38]=ea^~W&Y,a[39]=fa^~X&Z,a[48]=oa^~ga&ia,a[49]=pa^~ha&ja,a[0]^=sa[g],a[1]^=sa[g+1]}while(!E);v="";if(Aa)d=a[0],c=a[1],h=a[2],k=a[3],l=a[4],m=a[5],n=a[6],p=a[7],q=a[8],r=a[9],t=a[10],u=a[11],w=a[12],x=a[13],y=a[14],z=a[15],v+=b[d>>4&15]+b[d&15]+b[d>>12&15]+b[d>>
8&15]+b[d>>20&15]+b[d>>16&15]+b[d>>28&15]+b[d>>24&15]+b[c>>4&15]+b[c&15]+b[c>>12&15]+b[c>>8&15]+b[c>>20&15]+b[c>>16&15]+b[c>>28&15]+b[c>>24&15]+b[h>>4&15]+b[h&15]+b[h>>12&15]+b[h>>8&15]+b[h>>20&15]+b[h>>16&15]+b[h>>28&15]+b[h>>24&15]+b[k>>4&15]+b[k&15]+b[k>>12&15]+b[k>>8&15]+b[k>>20&15]+b[k>>16&15]+b[k>>28&15]+b[k>>24&15]+b[l>>4&15]+b[l&15]+b[l>>12&15]+b[l>>8&15]+b[l>>20&15]+b[l>>16&15]+b[l>>28&15]+b[l>>24&15]+b[m>>4&15]+b[m&15]+b[m>>12&15]+b[m>>8&15]+b[m>>20&15]+b[m>>16&15]+b[m>>28&15]+b[m>>24&15]+
b[n>>4&15]+b[n&15]+b[n>>12&15]+b[n>>8&15]+b[n>>20&15]+b[n>>16&15]+b[n>>28&15]+b[n>>24&15],256<=e&&(v+=b[p>>4&15]+b[p&15]+b[p>>12&15]+b[p>>8&15]+b[p>>20&15]+b[p>>16&15]+b[p>>28&15]+b[p>>24&15]),384<=e&&(v+=b[q>>4&15]+b[q&15]+b[q>>12&15]+b[q>>8&15]+b[q>>20&15]+b[q>>16&15]+b[q>>28&15]+b[q>>24&15]+b[r>>4&15]+b[r&15]+b[r>>12&15]+b[r>>8&15]+b[r>>20&15]+b[r>>16&15]+b[r>>28&15]+b[r>>24&15]+b[t>>4&15]+b[t&15]+b[t>>12&15]+b[t>>8&15]+b[t>>20&15]+b[t>>16&15]+b[t>>28&15]+b[t>>24&15]+b[u>>4&15]+b[u&15]+b[u>>12&
15]+b[u>>8&15]+b[u>>20&15]+b[u>>16&15]+b[u>>28&15]+b[u>>24&15]),512==e&&(v+=b[w>>4&15]+b[w&15]+b[w>>12&15]+b[w>>8&15]+b[w>>20&15]+b[w>>16&15]+b[w>>28&15]+b[w>>24&15]+b[x>>4&15]+b[x&15]+b[x>>12&15]+b[x>>8&15]+b[x>>20&15]+b[x>>16&15]+b[x>>28&15]+b[x>>24&15]+b[y>>4&15]+b[y&15]+b[y>>12&15]+b[y>>8&15]+b[y>>20&15]+b[y>>16&15]+b[y>>28&15]+b[y>>24&15]+b[z>>4&15]+b[z&15]+b[z>>12&15]+b[z>>8&15]+b[z>>20&15]+b[z>>16&15]+b[z>>28&15]+b[z>>24&15]);else for(c=0,g=e/32;c<g;++c)d=a[c],v+=b[d>>4&15]+b[d&15]+b[d>>12&
15]+b[d>>8&15]+b[d>>20&15]+b[d>>16&15]+b[d>>28&15]+b[d>>24&15];return v};!e.JS_SHA3_TEST&&E?module.exports={sha3_512:ya,sha3_384:xa,sha3_256:wa,sha3_224:va,keccak_512:A,keccak_384:ua,keccak_256:ta,keccak_224:G}:e&&(e.sha3_512=ya,e.sha3_384=xa,e.sha3_256=wa,e.sha3_224=va,e.keccak_512=A,e.keccak_384=ua,e.keccak_256=ta,e.keccak_224=G)})(this);
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

function zeropad(r) {
    var output = encode_hex(r);
    while (output.length < 64) {
        output = '0' + output;
    }
    return output;
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

var EthRPC = (function (rpc, primary) {

    var pdata, id = 1;
    var rpc_url = rpc.protocol + "://" + rpc.host + ":" + rpc.port.toString()

    function parse(response, callback) {
        response = JSON.parse(response);
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
        var req, xhr = null;
        if (NODE_JS) {
            if (async) {
                req = http.request({
                    protocol: rpc.protocol,
                    host: rpc.host,
                    path: '/',
                    port: rpc.port,
                    method: 'POST'
                }, function (response) {
                    var body = '';
                    response.on('data', function (d) {
                        body += d;
                    });
                    response.on('end', function () {
                        parse(body, callback);
                    });
                });
                req.write(command);
                req.end();
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
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (async) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        parse(xhr.responseText, callback);
                    }
                };
                xhr.open("POST", rpc_url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(command));
            } else {            
                xhr.open("POST", rpc_url, false);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(command));
                return parse(xhr.responseText, callback);
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
            pdata.params = null;
        }
        return pdata;
    }

    return {
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
            var prefix = get_prefix(funcname, sig);
            var data_abi = prefix;
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
            if (data && data.constructor === String) {
                data = JSON.parse(data);
            }
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
                // console.log("ABI data: ", data_abi);
                return this.call({ from: primary, to: address, data: data_abi }, f);
            } else {
                return console.error("Wrong number of arguments");
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
        getCode: function (address, block, f) { return this.read(address, block, f); }
    };
})(rpc, primary_account);
