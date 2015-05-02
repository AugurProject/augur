augur.js
========

JavaScript bindings for the Augur API.

Installation
------------

augur.js requires you to be running a local Ethereum node.  By default, it expects your Ethereum client to be listening on port 8545.  Note that I've only tested with [geth](https://github.com/ethereum/go-ethereum) so far; use with [eth](https://github.com/ethereum/cpp-ethereum) or [pyethapp](https://github.com/ethereum/pyethapp) at your own risk.

To use "send" RPC commands, you will need to unlock your client.  The easiest way to do this is to start geth with the `--unlock` option:
```
geth --rpc --rpccorsdomain "http://localhost:8545" --shh --unlock primary
```
augur.js can be installed using npm:
```
npm install augur.js
```
After installing, to use it with Node, just require it:
```javascript
> var Augur = require('augur.js');
```
To use augur.js from the browser, include [augur.min.js](https://github.com/AugurProject/augur.js/blob/master/augur.min.js), as well as the [bignumber.js](https://github.com/MikeMcl/bignumber.js) and [js-sha3](https://github.com/emn178/js-sha3) libraries.

Usage
-----

### Augur API

augur.js is a set of (hopefully convenient, easy-to-use) JavaScript bindings for the Augur API.  The augur.js function name, as well as the order of parameters, are generally the same as those of the underlying [augur-core](https://github.com/AugurProject/augur-core) Serpent functions.  (A few function names have been changed to avoid ambiguity, e.g. `faucet`.)

All Augur functions have an optional callback (or callbacks; see below) as their final parameter.  augur.js currently implements the following Augur API functions:

- getCashBalance(address[, callback])
- getRepBalance(branch, address[, callback])
- getBranches([callback])
- getMarkets(branch[, callback])
- getMarketInfo(market[, callback])
- getMarketEvents(market[, callback])
- getNumEvents(market[, callback])
- getEventInfo(event[, callback])
- getBranchID(branch[, callback])
- getNonce(id[, callback])
- getCurrentParticipantNumber(market[, callback])
- getParticipantSharesPurchased(market, participantNumber, outcome[, callback])
- getSharesPurchased(market, outcome[, callback])
- getEvents(branch, votePeriod[, callback])
- getVotePeriod(branch[, callback])
- getPeriodLength(branch[, callback])
- getBranch(branchNumber[, callback])
- sendCash(receiver, value[, callback])
- cashFaucet([callback])
- reputationFaucet([callback])
- getDescription(id[, callback])
- createEvent(branch, description, expDate, minValue, maxValue, numOutcomes[, sentCallback, verifiedCallback])
    - `sentCallback` fires when the transaction is initially broadcast and you receive a txhash
    - `verifiedCallback` fires when augur.js is able to see your transaction on the network using `eth_getTransactionByHash` (asynchronous check every 12 seconds)
- createMarket(branch, description, alpha, liquidity, tradingFee, events[, sentCallback, verifiedCallback, failedCallback])
    - `sentCallback` fires when the transaction is initially broadcast and you receive a txhash
    - `verifiedCallback` fires when augur.js is able to see your transaction on the network using `eth_getTransactionByHash` (asynchronous check every 12 seconds)
    - `failedCallback` fires if the initial `sendTransaction` fails
- buyShares(branch, market, outcome, amount, nonce[, callback])
- sellShares(branch, market, outcome, amount, nonce[, callback])
- sendReputation(branch, receiver, value[, callback])
- getSimulatedBuy(market, outcome, amount[, callback])
    ```javascript
    > function print(s) { console.log(s); }; // quality-of-life improvement :)
    > Augur.getSimulatedBuy("0xb13d98f933cbd602a3d9d4626260077678ab210d1e63b3108b231c1758ff9971", 1, Augur.ONE.toString(16), print)
    ["0x0000000000000000000000000000000000000000000000000013b073172aceb2",
     "0x0000000000000000000000000000000000000000000000008de39f2500000000"]
    ```
- getSimulatedSell(market, outcome, amount[, callback])
    ```javascript
    > Augur.getSimulatedSell("0xb13d98f933cbd602a3d9d4626260077678ab210d1e63b3108b231c1758ff9971", 1, Augur.ONE.toString(16), print)
    ["0x0000000000000000000000000000000000000000000000000013af84d04feba9",
     "0x0000000000000000000000000000000000000000000000008dd635b900000000"]
     ```
- getCreator(id[, callback])
    ```javascript
    > var marketID = "0xb13d98f933cbd602a3d9d4626260077678ab210d1e63b3108b231c1758ff9971";
    > Augur.getCreator(marketID, print);
    "0x0000000000000000000000001c11aa45c792e202e9ffdc2f12f99d0d209bef70"
    ```
- getCreationFee(id[, callback])
    ```javascript
    > Augur.getCreationFee(marketID, print)
    "0x00000000000000000000000000000000000000000000000a0000000000000000"
    ```

Examples and more API functions coming soon :)

If you need more flexibility, please refer to the `invoke` function below, which allows you to build a transaction object manually, then broadcast it to the network with `sendTransaction` and/or capture its return value with `call`.

### Asynchronous RPC

By default, augur.js is fully asynchronous, although by setting `Augur.async = false` it can be forced to make synchronous HTTP RPC requests.  This is generally not recommended, especially if augur.js is running in the browser, as synchronous RPC requests block the main JS thread (which essentially freezes the browser).  All of augur.js's methods that involve an RPC request take an optional callback function as their last parameter.

### Ethereum JSON-RPC bindings

augur.js sends [JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) commands to Ethereum.  Its lower-level RPC functions are described here. 

#### Basic RPC commands

The `raw` method allows you to send in raw commands (similar to sending in via cURL):
```
> Augur.raw("net_peerCount")
"0x10"

> Augur.eth("gasPrice")
"0x015f90"
```
Many of the commonly used functions have named wrappers.  For example, `blockNumber` fetches the current block number:
```javascript
> Augur.blockNumber()
217153
```

#### Uploading and downloading contracts

`publish` broadcasts (uploads) a compiled contract to the network, and returns the contract's address:
```javascript
> Augur.publish("0x603980600b6000396044567c01000000000000000000000000000000000000000000000000000000006000350463643ceff9811415603757600a60405260206040f35b505b6000f3")
"0xf4549459f9ef8c8898c054a7fc37c286831c2ced"
```
`read` downloads code from a contract already on the Ethereum network:
```javascript
> Augur.read("0x5204f18c652d1c31c6a5968cb65e011915285a50")
"0x7c010000000000000000000000000000000000000000000000000000000060003504636ffa1caa81141560415760043560405260026040510260605260206060f35b50"
```

#### Running contract functions

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

> Augur.invoke(tx)
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

*`invoke` currently only works for Serpent contracts.*  I haven't (yet) included all the different datatypes that Solidity supports in augur.js's encoder -- all parameters are type string, int256, or int256[].  If you need a more flexible ABI encoder, I recommend [pyepm](https://github.com/etherex/pyepm), specifically the `pyepm.api.abi_data` method.

Tests
-----

The tests included with augur.js are in `test/runtests.js`, and can be run using npm:
```
npm test
```
