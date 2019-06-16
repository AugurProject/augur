API Overview
===========
[augur.js](https://github.com/AugurProject/augur.js) is a JavaScript SDK that is the developer-facing component of Augur's [middleware](#architecture). It is the recommended way to interact with Augur from a custom application, and it can be used to query for information about Augur's [Markets](#market) and interact with Augur's back-end Solidity smart contracts, which can be found in the [augur-core repository](https://github.com/AugurProject/augur-core).

The documentation for augur.js is divided into four sections: the [Simplified API](#simplified-api), the [Call API](#call-api), the [Transaction API](#transaction-api), and the [Events API](#events-api). The Simplified API provides general information about Markets within Augur, and many of its functions require a connection to an [Augur Node](#augur-node). The Call and Transaction APIs provide direct mappings to Augur's smart contract functions via the `augur.api` object. The Call API uses `eth_call` to make "get" requests for information stored on the blockchain. The Transaction API uses `eth_sendTransaction` to make "set" requests to the blockchain in order to modify the blockchain's information in some way, like creating a new [Order](#order) on the [Order Book](#order-book). The Events API enables listening for certain logged events and searching for them. The Call, Transaction, and Events APIs do not require a connection to an Augur Node. Each of these four components of augur.js is covered in greater detail in their respective sections below.

This API Overview section explains how to add augur.js to a custom application and how to connect it to an Ethereum node and an Augur Node. It also covers how augur.js' account management works, how numbers should be used in augur.js, how to load and create Markets, and debugging options.

Augur Node
---------------------------
Anyone wishing to query for information about Augur's markets will need to use the augur.js [Simplified API](#simplified-api), which requires a connection to an Augur Node for many of its functions. Augur Node is a standalone application that scans the Ethereum blockchain for all Augur event logs and stores them to a SQLite or PostgresSQL database.

Instead of looking up information about Augur-related events directly on the Ethereum blockchain, the Simplified API sends query requests to an Augur Node's database. This is because looking up information directly on the blockchain can be a slow and difficult process, especially when sorting is required. For example, to run a query for all [Markets](#markets) created by a specific user, sorted by volume and limited to 100 results, would require scanning the blockchain for all Market creation events by that user, saving the results locally, querying each Market to obtain its volume, saving those results locally, and then sorting the Markets created by the user and discarding everything after the first 100 results. This would require a large number of RPC requests and would take a long time to complete.

To alleviate this problem, the Simplified API executes queries by submitting an RPC request to an Augur Node that is either running locally or remotely (hosted). The Augur Node then runs the request against its database and returns the result. This allows queries to be run on Augur much more quickly than would otherwise be possible.

It should be noted that batch RPC calls are not supported yet on incoming requests to Augur Node, and therefore batch RPC calls currently are not supported by augur.js.

To set up a local Augur Node, follow the instructions described in the [Augur Node GitHub repository](https://github.com/AugurProject/augur-node#augur-node). Once a local Augur Node is running (or if the WebSocket address of a hosted node is known), a connection to it can be established by specifying the WebSocket address as shown by the JavaScript sample code in the [Getting Started with augur.js](#getting-started-with-augur-js) section.

Getting Started with augur.js
---------------------------
```javascript
// After installing, just require augur.js to use it.
var Augur = require('augur.js');
var augur = new Augur();

var ethereumNode = { 
  httpAddresses: [
    "http://127.0.0.1:8545", // local HTTP address for Geth node
    "https://rinkeby.augur.net/ethereum-http" // hosted http address for Geth node on the Rinkeby test network
  ],
  wsAddresses: [
    "ws://127.0.0.1:8546", // local WebSocket address for Geth node
    "wss://rinkeby.augur.net/ethereum-ws" // hosted WebSocket address for Geth node on the Rinkeby test network
  ]
  // ipc addresses can also be specified as:
  // ipcAddresses: [ ... ]
};
// To connect to a hosted Augur Node instead of a local Augur Node, substitute its WebSocket address below.
var augurNode = "ws://127.0.0.1:9001"; // local WebSocket address for an Augur Node

// Attempt to connect to a local Ethereum node
// If that fails, fall back to the hosted Ethereum node
augur.connect({ ethereumNode, augurNode }, function (err, connectionInfo) { /* ... */ });
// example connectionInfo object:
{
  augurNode: "ws://127.0.0.1:9001",
  ethereumNode: {
    contracts: {
      Controller: "0xb1772d9e581e5a245ff429cca3e06c57d567c58c",
      Universe: "0xaa88b74da9e08d44c996f037ce13cb2711053cea",
      Augur: "0xdddc5d40979660308e8017d048b04782f17af4af",
      OrdersFinder: "0x01f2aba090b5fa26a64ea9e5afd32f6aab6ba3df",
      LegacyReputationToken: "0x59c98505653f68e8cc2a0ac1e84380a0393fd04e",
      CancelOrder: "0x4c0f599bdd8f9eac10cdfd152c3110ea9b803088",
      Cash: "0x5754d0bcb36b7f30999199031d1f323c4079d58d",
      ClaimTradingProceeds: "0xe408a58ff3eb050f39728fc45644f64e8e379e3d",
      CompleteSets: "0xb51a3aab3d5009f21cd9b47ae856aa780460b78c",
      CreateOrder: "0x19ef3d62d49e95e1b92c1fe12986a24a42c4f3c3",
      FillOrder: "0x57972b23e4e97cf33b456d292411308b1053d835",
      Order: "0x86416fd9eb6ca7797f799ccc2e08a4da4083ac17",
      Orders: "0x452cbdba8559a9b0199bb15105a42fc7ae373983",
      OrdersFetcher: "0xc9d0126e1aa921056af5981016904690ad73c0d3",
      ShareToken: "0x5c8b3117b65af65405980f3700542c03709a6436",
      Trade: "0x8d0677ee9f5330fd65db56da6c31711fd6810434",
      TradingEscapeHatch: "0x867d606553c3fc24b35e3b02d228dc1647786f88"
    },
    abi: {
      events: { /* ... */ },
      functions: { /* ... */ }
    },
  }
}
```
The easiest way to install augur.js is using [npm](https://www.npmjs.com/package/augur.js):

`$ npm install augur.js`

Alternatively, this can be done using [yarn](https://yarnpkg.com/en/package/augur.js), as follows:

`$ yarn add augur.js`

Once augur.js has been installed, it will need to be connected to an Ethereum node and an [Augur node](#augur-node). These can be running locally or remotely (hosted). 

To connect to the desired Ethereum node and Augur node, call the function [`augur.connect`](#connect-function) as shown to the right. Upon doing so, augur.js will iterate through the list of addresses provided in the `ethereumNode` argument and attempt to connect to each one until a successful connection is established or all attempts have failed. The Ethereum node may have multiple HTTP, WebSocket, or IPC addresses specified as arrays.  The connection will be chosen automatically based on a preference of IPC > WS > HTTP.  Note: if there is a global `web3` object present, such as that injected by MetaMask, that global `web3` will be automatically used in preference to any other connections available.  So, if you're using MetaMask, make sure it's connected to the right network!

Similarly, augur.js will attempt to use the `augurNode` parameter to connect to an Augur Node. However, `augurNode` may only be specified as a single-address string, not as an object containing an array of addresses.

The Augur development team hosts Augur Nodes and Ethereum nodes on the Ethereum test networks. The addresses for these hosted nodes are as follows:

**dev.augur.net Augur Node (WSS):** wss://dev.augur.net/augur-node <br />
**dev.augur.net Ethereum Node (HTTPS):** https://rinkeby.augur.net/ethereum-http <br />
**dev.augur.net Ethereum Node (WSS):** wss://rinkeby.augur.net/ethereum-ws <br />

**Kovan Augur Node (WSS):** Must connect to a locally-running augur-node (e.g., ws://127.0.0.1:9001) <br />
**Kovan Ethereum Node (HTTPS):** https://kovan.augur.net/ethereum-http <br />
**Kovan Ethereum Node (WSS):** wss://kovan.augur.net/ethereum-ws <br />

**Rinkeby Augur Node (WSS):** wss://rinkeby.augur.net/augur-node <br />
**Rinkeby Ethereum Node (HTTPS):** https://rinkeby.augur.net/ethereum-http <br />
**Rinkeby Ethereum Node (WSS):** wss://rinkeby.augur.net/ethereum-ws <br />

**Ropsten Augur Node (WSS):** Must connect to a locally-running augur-node (e.g., ws://127.0.0.1:9001) <br />
**Ropsten Ethereum Node (HTTPS):** https://ropsten.augur.net/ethereum-http <br />
**Ropsten Ethereum Node (WSS):** wss://ropsten.augur.net/ethereum-ws <br />

**srt.augur.net Augur Node (WSS):** Must connect to a locally-running augur-node (e.g., ws://127.0.0.1:9001) <br />
**srt.augur.net Ethereum Node (HTTPS):** https://srt.augur.net/ethereum-http <br />
**srt.augur.net Ethereum Node (WSS):** wss://srt.augur.net/ethereum-ws <br />

The Augur development team does not host any Augur Nodes or Ethereum nodes for the Ethereum main network. However, a list of these nodes that are hosted by trusted community members can be found at https://predictions.global/augur-public-ethereum-nodes.

In the example on the right, the first connection that will be tried is `http://127.0.0.1:8545`, which is a local Ethereum node being run using the Geth client. If a connection to the local Geth node cannot be established, the next provided address will be tried. In this case, we have provided a single hosted node on the Ethereum Rinkeby test network (`rinkeby.ethereum.nodes.augur.net`) as another attempt to make after the local Geth node. If a connection is successfully established, then the `vitals` object will be returned; otherwise an error message will be returned.

It should be noted that Augur's back-end Solidity smart contracts are deployed from the perspective of augur.js, which means that augur.js contains a list of Augur's smart contract addresses in the file [`augur.js/src/contracts/addresses.json`](https://github.com/AugurProject/augur.js/blob/master/src/contracts/addresses.json).

The each group of addresses in the file maps to an Ethereum network ID or to the network ID of a local Ethereum node in a Docker image:

* 1 - Main network
* 3 - Ropsten test network
* 4 - Rinkeby test network
* 19 - Thunder network
* 42 - Kovan test network
* 101 - Network ID for a local node (used when running Docker image `dev-node-geth` in augur.js)
* 102 - Network ID for local node (used when running Docker image `dev-pop-geth` in augur.js)
* 103 - Network ID for local node (used when running Docker image `dev-pop-normtime-geth` in augur.js)
* 104 - Network ID for local node (used when running Docker image `dev-pop-geth-45` in augur.js)
* 8995 - Network ID for local node (used when running Docker image `dev-node-parity` in augur.js)

The file [`augur.js/src/contracts/addresses.json`](https://github.com/AugurProject/augur.js/blob/master/src/contracts/addresses.json) is generated by the script `augur-core/source/libraries/ContractCompiler.ts` in the [augur-core repository](https://github.com/AugurProject/augur-core).

Augur's smart contract ABIs are generated and output to `augur-core/output/contracts/abi.json` in the [augur-core repository](https://github.com/AugurProject/augur-core) by the script `augur-core/source/libraries/ContractCompiler.ts`. For further details on Augur's smart contracts and their compiling/deployment process, please refer to the README file in the [augur-core repository](https://github.com/AugurProject/augur-core).

Numbers
-------
<b>It is strongly recommended that all numerical input values be passed into Call API functions and Transaction API functions as hexadecimal strings.</b> This is because these API functions are direct bindings to the functions on Augur's smart contracts, and passing in very large numbers in decimal form can result in the functions on Augur's smart contracts failing.

The Simplified API functions, however, automatically convert numerical input values to hexadecimal form before passing them into Augur's smart contracts.

For the Simplified API, there are three acceptable ways to pass numerical inputs:

- primitive JS numbers (e.g., `1010101`): ok for integers, but use strings for floating point numbers (see below)

- stringified numbers (e.g., `"1010101"`)

- hexadecimal strings (e.g., `"0xf69b5"`)

Floating-point (decimal) values should be passed to augur.js as strings (e.g., instead of `0.07`, use `"0.07"`), for reasons described in [enormous detail](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) elsewhere.

<aside class="notice"><b>All numerical parameters passed to augur.js must be either base 10 (decimal) or base 16 (hexadecimal).</b> Do <b>not</b> use the base 10<sup>18</sup> fixed-point representation that Augur uses internally for decimals!  augur.js handles all fixed-point conversions for you.</aside>

Initial Market Loading
----------------------
To get a list of all [Markets](#market), first call `augur.markets.getMarkets`. More detailed market info (including prices) for each market can then be loaded using `augur.markets.getMarketsInfo`. `augur.markets.getMarketsInfo` does not return the [Open Orders](#order-book) for the Market; to get the Open Orders, call `augur.trading.getOrders`.

Debugging Options
----------------------------
```javascript
augur.rpc.setDebugOptions({ broadcast: true });
augur.api.Universe.getCurrentFeeWindow();
// example output:
packaged: {
  from: "0x56ddb80fe4e5aa05182d794526ab1eff78c90688", 
  to: "0xa1d76546015cfe50183497ca65fcbd5c656f7813", 
  data: "0x6235eef3", 
  gas: "0x2fd618", 
  returns: "address"
}
Blockchain RPC to http://127.0.0.1:8545 via SyncTransport with payload: 
{
  "id":429,
  "jsonrpc":"2.0",
  "method":"eth_call",
  "params":[{"from":"0x56ddb80fe4e5aa05182d794526ab1eff78c90688",
             "to":"0xa1d76546015cfe50183497ca65fcbd5c656f7813",
             "data":"0x6235eef3",
             "gas":"0x2fd618"},
             "latest"]
}
"0x54d134699764375417e4b5dda1e2ac62f62e9725"

augur.rpc.setDebugOptions({ connect: true });
augur.connect({ 'ethereumNode': { http: "http://rinkeby.augur.net:8545", ws: "ws://rinkeby.augur.net:8546" }, 'augurNode': "ws://127.0.0.1:9001"}, function (err, vitals) { console.log(err); console.log(vitals); });
// example output:
connecting to augur node... 
{ 
  augurNode: "ws://127.0.0.1:9001",
  ethereumNode: { http: "http://rinkeby.augur.net:8545", ws: "ws://rinkeby.augur.net:8546" }
}
connecting to ethereum node... 
{ 
  augurNode: "ws://127.0.0.1:9001",
  ethereumNode: { http: "http://rinkeby.augur.net:8545", ws: "ws://rinkeby.augur.net:8546" }
}
connected to augur
Web3: not connected
Sync: http://rinkeby.augur.net:8545
HTTP: http://rinkeby.augur.net:8545
WS: ws://rinkeby.augur.net:8546
IPC: not connected
connected to ethereum
{
  augurNode: "ws://127.0.0.1:9001",
  ethereumNode: {
    abi: {events: {...}, functions: {...}},
    blockNumber: "0x133773",
    coinbase: null,
    contracts: {...},
    gasPrice: 20000000000,
    networkId: "4",
    rpc: {...}
  }
}

augur.rpc.setDebugOptions({ tx: true });
augur.api.Universe.getOrCacheMarketCreationCost({
  onSent: function (result) {...},
  onSuccess: function (result) {...},
  onFailed: function (result) {...}
});
// example output:
payload transact: 
{
  constant: false,  
  from: "0x40485264986740c8fb3d11e814bd94cf86012d29"
  name: "getOrCacheMarketCreationCost"
  params: [],
  returns: "uint256",
  send: true,
  to: "0xa282b625053e80da550098fdb325a8ece6dfe8ac"
}
callReturn: 10000000006000000
txHash: 0x26f731c948568d9c0a4983fa134431f3fba0c68248f95d35536c9157cafa785a
```
The function `augur.rpc.setDebugOptions` allows several debugging options to be enabled:

* `broadcast` - When set to true, this enables printing of verbose, low-level information related to sending/receiving transactions, such as the transaction JSON that gets sent out over the wire, incoming eth_subscription messages, etc.

* `connect` - When set to true, this enables printing of the result of the initial connection of ethrpc to the underlying Ethereum node, as well as which endpoints are connected, on which protocols

* `tx` - When set to true, this enables printing of information related to transaction construction/submission/confirmation. This information includes the intermediate "transaction" object with human-readable parameters, the (best-guess) return value fetched from the follow-up eth_call when a transaction gets resubmitted, and the transaction hash once the transaction is submitted.
