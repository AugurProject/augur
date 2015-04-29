EthRPC
======

Asynchronous, browser-compatible JSON-RPC for Ethereum.

Usage
-----

EthRPC requires you to be running a local Ethereum node.  By default, it expects your Ethereum client to be listening on port 8545.  Note that I've only tested with [geth](https://github.com/ethereum/go-ethereum) so far; use with [eth](https://github.com/ethereum/cpp-ethereum) or [pyethapp](https://github.com/ethereum/pyethapp) at your own risk.

To use "send" RPC commands, you will need to unlock your client.  The easiest way to do this is to start geth with the `--unlock` option:
```
geth --rpc --rpccorsdomain "http://localhost:8545" --unlock primary
```

### Installation

EthRPC can be installed using npm:
```
npm install ethrpc.js
```
After installing, to use it with Node, just require it:
```javascript
> var EthRPC = require('ethrpc.js');
```

### Basic RPC commands

The `raw` method allows you to send in raw commands (similar to sending in via cURL):
```
> EthRPC.raw("net_peerCount")
"0x10"

> EthRPC.eth("gasPrice")
"0x015f90"
```
Many of the commonly used functions have named wrappers.  For example, `coinbase` fetches your coinbase account:
```javascript
> EthRPC.coinbase()
"0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
```

### Uploading and downloading contracts

`publish` broadcasts (uploads) a compiled contract to the network, and returns the contract's address:
```javascript
> EthRPC.publish("0x603980600b6000396044567c01000000000000000000000000000000000000000000000000000000006000350463643ceff9811415603757600a60405260206040f35b505b6000f3")
"0xf4549459f9ef8c8898c054a7fc37c286831c2ced"
```
`read` downloads code from a contract already on the Ethereum network:
```javascript
> EthRPC.read("0x5204f18c652d1c31c6a5968cb65e011915285a50")
"0x7c010000000000000000000000000000000000000000000000000000000060003504636ffa1caa81141560415760043560405260026040510260605260206060f35b50"
```

### Running contract functions

`invoke` executes a function in a contract already on the network:
```javascript
> tx = {
...   to: "0x5204f18c652d1c31c6a5968cb65e011915285a50",
...   function: "double",
...   signature: "i",
...   params: 22121,
...   send: false,
...   returns: "int"
... };

> EthRPC.invoke(tx)
44242
```
(`execute` and `run` are both aliases for `invoke`.) The function called here `double(22121)` simply doubles its input argument, so the result is as expected.  The transaction fields are as follows:
```
Required:
    - to: <contract address> (hexstring)
    - function: <function name> (string)
    - signature: <function signature, e.g. "iia"> (string)
    - params: <parameters passed to the function>
Optional:
    - send: <true to sendTransaction, false to call (default)>
    - from: <sender's address> (hexstring; defaults to the coinbase account)
    - returns: <"array", "int", "BigNumber", or "string" (default)>
```
The `params` and `signature` fields are required if your function accepts parameters; otherwise, these fields can be excluded.  The `returns` field is used only to format the output, and has no effect on the actual RPC command.

*`invoke` currently only works for Serpent contracts.*  I haven't (yet) included all the different datatypes that Solidity supports in EthRPC's encoder -- all parameters are strings, int256, or int256 arrays.  If you need a more flexible ABI encoder, I recommend [pyepm](https://github.com/etherex/pyepm), specifically the `pyepm.api.abi_data` method.

### Asynchronous RPC and callbacks

By default, EthRPC is fully asynchronous, although by changing `rpc.async` to `true` it can be forced to make synchronous HTTP RPC requests.  This is generally not recommended, especially if EthRPC is running in the browser, as synchronous RPC requests block the main JS thread (which essentially freezes the browser).  Because EthRPC is primarily asynchronous, all of its methods that involve an HTTP RPC request take an optional callback function as their last parameter.

### From the browser

EthRPC can be used from the browser (although the Ethereum client must be set to accept RPC calls from the browser's address).  To use EthRPC in the browser, just include `ethrpc.js`, as well as the [bignumber.js](https://github.com/MikeMcl/bignumber.js) and [js-sha3](https://github.com/emn178/js-sha3) libraries.

Tests
-----

The tests included with EthRPC are in the `test/runtests.js` file, and can be run using npm:
```
npm test
```
