Transaction API
================
```javascript
// Transaction API example:

// Internally, Augur uses an ERC-20 token called Cash as a wrapper for ETH. 
// Many of Augur's transactions require the Augur.sol contract to be able 
// to spend Cash on behalf of the account executing the transaction. 
// However, the account must first approve Augur to spend that amount of 
// Cash on its behalf by calling `augur.api.Cash.approve`.

// The Ethereum contract addresses for Augur.sol and Cash.sol 
// can be obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
var cashContractAddress = "0xec28e64edbce62bde48a14b04f0b557b974a22a9";

// Amount of Cash (in attotokens) to approve the Augur.sol contract to 
// spend on this Ethereum account's behalf.
// This example approves the maximum amount, which is 
// augur.constants.ETERNAL_APPROVAL_VALUE, or 2^256 - 1.
var _attoCashTokens = augur.constants.ETERNAL_APPROVAL_VALUE;

// The Augur API is organized by Contract and then Method like so:
// augur.api.<Contract>.<Method>(<argument object>);
augur.api.Cash.approve({
  _spender: _augurContractAddress,
  _value: _attoCashTokens,
  tx: { 
    to: cashContractAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

// example onSent output:
{
  callReturn: null,
  hash: '0x3cd4a2eb35cc0cd3449c252737255863e60aa521d757d615cefbf280b54313fb'
}
// example onSuccess output:
{
  blockHash: "0xb1379380e458710f25fea54ae03358832076eadc17825edef482efca3c43a9de",
  blockNumber: 1707928,
  callReturn: null,
  from: "0x8fa56abe36d8dc76cf85fecb6a3026733e0a12ac",
  gas: "0x632ea0",
  gasFees: "0.000206912",
  gasPrice: "0xee6b2800",
  hash: "0x3cd4a2eb35cc0cd3449c252737255863e60aa521d757d615cefbf280b54313fb",
  input: "0x095ea7b300000000000000000000000067cbf60a24ab922af99e6f335c0ff2b084d5bdbeffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  nonce: "0x97",
  r: "0x804b2a14352d3fa9844c296eb8b9a6b8fed45ca5d56550d1eb558c6571abbaf4",
  s: "0x3793c21fd315e14950b48a2200e8368ca0d25a2b6291eca9b5bb19753026859f",
  timestamp: 1517688651,
  to: "0xec28e64edbce62bde48a14b04f0b557b974a22a9",
  transactionIndex: "0x1",
  v: "0x2b",
  value: "0x0"
}
// example onFailed output:
{
  error: '0x',
  message: 'no response or bad input'
}
```
Augur's Transaction API ("Tx API" for short) is made up of "setter" methods that can both read from and write to the blockchain using Ethereum's `eth_sendTransaction` RPC. Under the hood, the API uses augur.js's convenience wrapper for `eth_sendTransaction` which can be accessed using `augur.rpc.transact`. Although it is possible to call `augur.rpc.transact` directly (which is discussed in greater detail below), it is generally better and easier to use the built-in API functions. The API functions are attached to the `augur.api` object and follow a pattern of `augur.api.<Contract>.<Method>(<Argument Object>)`. The API method name, as well as its parameters as keys in the params object, are generally identical to those of the underlying smart contract method.

### Arguments

All Transaction API methods accept a single object argument, containing the following:

* All required parameters for the smart contract function as key/value pairs.
* A `tx` object (sometimes referred to as the `payload` object), which contains details about how the transaction should be made.
* A `meta` object, which contains information for signing the transaction.
* `onSent`, `onSuccess`, and `onFailed` callback functions.

### The `tx` Object

The `tx` object must contain a `to` property, which is the Ethereum address of the contract containing the transaction function, as a 20-byte hexadecimal string. This allows augur.js to know which contract to run the transaction on. A `gas` property can also be specified for Transaction API functions (though this should not be specified for Call API functions). The `gas` property represents the gas limit to use when executing the transaction. The `gasPrice` property represents the gas price (in attoETH, or wei) to use. For Transaction API functions that have the `payable` modifier in Augur's Solidity smart contracts, a `value` property must also be specified, which is the amount of [attoETH](#atto-prefix) to send to the function. Some of the Transaction API functions can either be made as a call (which will return a cached value and not use gas) or as a transaction (which will calculate the value and use gas to do so). By default, augur.js will call these functions as transactions, but they can be made as calls instead by specifying the `send` property as `false`.

The other properties that can be specified in the `tx` object are discussed in the [Using Transact Directly](#using-transact-directly) section.

### The `meta` Object

All Transaction API functions accept a `meta` object as a parameter in order to sign the transaction. The `meta` object contains a `signer` property, which should be set to the private key buffer or a signing function, provided by a hardware wallet, of the account that wishes to initiate the transaction. (When logged in using an Edge account, the private key buffer can be obtained by outputting the value `state.loginAccount.meta.signer`.) The `meta` object also contains an `accountType` property, which should be set to "privateKey", "ledger", "trezor", "edge", or "unlockedEthereumNode". The Transaction API functions attempt to modify information on the blockchain, which requires the transaction to be signed. The `meta` parameter is not required when calling Transaction API functions while using MetaMask (which will pop up a separate window asking to confirm the transaction).

### Callbacks

Whereas the callback function parameter used by [Call API](#call-api) is optional, but **strongly recommended**, the three callback function parameters used by the Transaction API functions are required. The following keys are used for each callback:

#### onSent(sentResponse)

Fires when the initial `eth_sendTransaction` response is received.  If the transaction was broadcast to the network without problems, `sentResponse` will have two fields: `txHash` (the transaction hash as a hex string) and `callReturn` (the value returned by the invoked contract method). The optional `returns` field in the `tx` object sent to `augur.rpc.transact` can be used to specify the format of the `callReturn` value.

#### onSuccess(successResponse)

Fires when the transaction is successfully incorporated into a block and added to the blockchain, as indicated by a nonzero `blockHash` value. `successResponse` is structured the same way as `eth_getTransactionByHash` responses (see code example for details), with the addition of a `callReturn` field which contains the contract function's return value.

#### onFailed(failedResponse)

Fires if the transaction is unsuccessful. `failedResponse` has `error` (error code) and `message` (error description) fields, describing the way in which the transaction failed.

### Approving Augur's ERC-20 Tokens

Developers will need to grant the Augur.sol contract approval to spend [Cash](#cash) (which is an [ERC-20](https://en.wikipedia.org/wiki/ERC20) wrapper for ETH) before many of the Transaction API functions can be called. This can be done by calling the `augur.api.Cash.approve` function, as shown to the right. <b>Attempting to call many of Augur's Transaction API functions without doing this first will result in these transactions failing.</b>

### Transaction Return Values

It is important to note that Ethereum nodes discard all transaction return values, which causes the `callReturn` property of the object passed into a transaction's `onSuccess` callback to always be `null`. As a result, there is no way to get a transaction's return value.

There is, however, a workaround for this issue when calling functions that create [Markets](#market), such as `augur.api.Universe.createYesNoMarket`, `augur.api.Universe.createCategoricalMarket`, and `augur.api.Universe.createScalarMarket`. The function `augur.createMarket.getMarketFromCreateMarketReceipt` can be called in the `onSuccess` callback of these functions to retrieve the Ethereum contract address of the newly-created Market. `augur.createMarket.getMarketFromCreateMarketReceipt` does this by querying the Augur Node for the event log associated with the new Market's creation.

<aside class="notice">Augur's Transaction API has been updated to return promises. Passing in callbacks still works the same as before; however, now the underlying promise is returned directly to the caller for `onSuccess` and `onFailed`. (`onSent` is still a callback.)</aside>

Using Transact Directly
-----------------------
```javascript
// Example using `augur.rpc.transact` directly
// `tx` object (generated by transfer method of the ReputationToken contract):
var tx = {
  constant: false,  
  from: "0x40485264986740c8fb3d11e814bd94cf86012d29",
  name: "getOrCacheMarketCreationCost",
  params: [],
  returns: "uint256",
  send: true,
  to: "0x6eabb9367012c0a84473e1e6d7a7ce39a54d77bb"
};

// privateKeyorSigner is either the privateKey buffer of the account trying to send the transaction or a function to sign a transaction (generally from a hardware wallet). This example uses the Buffer returned from the `augur.accounts.login` function.
var privateKeyOrSigner = [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25];

// accountType is a string set to "privateKey", "ledger", "trezor", "edge", or "unlockedEthereumNode".
var accountType = "privateKey";

// onSent callback fires when the initial eth_sendTransaction response is received
var onSent = function (sentResponse) { console.log("Transaction sent: ", sentResponse); };

// onSuccess callback fires
var onSuccess = function (successResponse) { console.log("Transaction successful: ", successResponse); };

// onFailed callback fires when the transaction is malformed, fails to confirm,
// or an object with an error field is received
var onFailed = function (failedResponse) { console.error("Transaction failed: ", failedResponse); };

augur.rpc.transact(tx, privateKeyOrSigner, accountType, onSent, onSuccess, onFailed);
// example onSent output:
Transaction sent: {
  callReturn: null,
  hash: "0x269011fe4ed9c7370f8e8237c525062988e8fcce485d93a1a6a419bb3a8e70d3"
}
// example onSuccess output:
Transaction successful: {
  blockHash: "0x5090c1a25a2accf4cb47a1d99f4fa4215146ac29402688ad3e554169af332e4c",
  blockNumber: 1348278,
  callReturn: null,
  from: "0x40485264986740c8fb3d11e814bd94cf86012d29",
  gas: "0x2fd618",
  gasFees: "0.001882121837379",
  gasPrice: "0x5b793ccec",
  hash: "0x0f8e4cdf3de1aa3c01bea8b12cbde32b2bc7701d2bc1b6403634cdd5999ad729",
  input: "0xec86fdbd",
  nonce: "0x12",
  r: "0x3bedf73900da86c9afb6721e472a268108c66694a589b3083935a3c3cc0cc764",
  s: "0x2c9c24f3bbdd63ba2218de2eddb120f52e966d36fa82989ef6b1e3df0b205ce2",
  timestamp: 1512278406,
  to: "0x6eabb9367012c0a84473e1e6d7a7ce39a54d77bb",
  transactionIndex: "0x1",
  v: "0x2c",
  value: "0x0"
}
//example onFailed output:
Transaction failed: {
  error: 501,
  message: 'polled network but could not confirm transaction'
}
```
<aside class="warning">While it is possible to use <code>augur.rpc.transact</code> directly, it is generally easier and less error-prone to use one of the named API functions documented in the following sections. Readers who want to use the Transaction API and aren't terribly curious about the augur.js/ethrpc plumbing under the hood should skip to the next section!</aside>

#### augur.rpc.transact(payload, privateKeyOrSigner, accountType, onSent, onSuccess, onFailed)

Transactions can be broadcast to the Ethereum Network by calling `augur.rpc.transact` directly. When calling this function directly, the `payload` object (also known as the `tx` object) must be constructed carefully as follows:

**Required:**

- to: `<contract address> (hexstring)`
- name: `<function name> (string)`
- signature: `<function signature, e.g. ["int256", "bytes", "int256[]"]> (array)`
- params: `<parameters passed to the function>`

**Optional:**

- gas: `<gas limit (in attoETH, or wei) to use for transaction (defaults to "0x2fd618")> (hexstring)`
- gasPrice: `<gas price (in attoETH, or wei) to use for transaction (default value varies). If transactions are taking a while, using 40-50 gwei as the gas price is recommended.> (hexstring)`
- send: `<true to sendTransaction, false to call (default)>`
- from: `<sender's address> (hexstring; defaults to the coinbase account)`
- returns: `<"int256" (default), "int", "number", "int256[]", "number[]", or "string">`

The `signature` and `params` fields are required if the transaction function being called accepts parameters; otherwise, these fields can be excluded. The `returns` field is used only to format the output, and does not affect the actual RPC request.

The `privateKeyOrSigner` is required when attempting to execute a transaction that will modify the blockchain (`eth_sendTransaction`). If the function is simply getting information (`eth_call`) `privateKeyOrSigner` can be null. Otherwise, `privateKeyOrSigner` should be the Private Key Buffer for the logged-in account or a function to sign transactions provided by a hardware wallet.

The `accountType` is a string that can be "privateKey", "ledger", "trezor", "edge", or "unlockedEthereumNode", depending on the type of account that is sending the transaction.

**Under the hood, `augur.rpc.transact` carries out the following sequence:**

1. `augur.rpc.transact` first attempts to use `eth_call` on the transaction submitted in order to determine if there is enough gas to perform the transaction and that the transaction is properly formed. If the transaction is malformed, does not provide enough gas, or will fail, an error is passed to the `onFailed` handler, and the `augur.rpc.transact` sequence terminates.

2. After confirming that the Transaction is valid, `augur.rpc.transact` sends an `eth_sendTransaction` RPC request (or `eth_sendRawTransaction` for transactions which are already signed), which broadcasts the transaction to the Ethereum Network. If no transaction hash is received or there is an error, the error is passed to the `onFailed` handler, and the `augur.rpc.transact` sequence terminates. Otherwise, the `onSent` handler is called and returns an object containing the `txHash` and `callReturn`.

3. After calling the `onSent` handler, Augur adds the transaction to the `transactions` object (which is indexed by transaction hash, e.g. `transactions[txHash]`) and assigns the transaction a `status` of `"pending"`. The function `augur.rpc.getTransactions` can be used to access the `transactions` object.

4. Augur then uses `eth_getTransactionByHash` to determine if the transaction has been mined or not, indicated by a `null` response. A `null` response means that the transaction has been (silently) removed from Geth's transaction pool. This can happen if the transaction is a duplicate of another transaction that has not yet cleared the transaction pool (and therefore Geth does not fire a duplicate transaction error), or if the transaction's nonce (but not its other fields) is a duplicate. If a `null` response is received from `eth_getTransactionByHash`, Augur will attempt to re-submit the transaction to `augur.rpc.transact` as long as the number of attempts has not exceeded `augur.constants.TX_RETRY_MAX`. Once the number of attempts exceeds this threshold, a `TRANSACTION_RETRY_MAX_EXCEEDED` error is sent to the `onFailed` handler, and the `augur.rpc.transact` sequence will terminate.

5. Once the transaction has been successfully mined (`eth_getTransactionByHash` successfully returns the transaction object) the transaction is updated to include the `blockNumber` and `blockHash` and its `status` is changed to `"sealed"`.

6. When the number of confirmations of the transaction exceeds `augur.constants.REQUIRED_CONFIRMATIONS`, the transaction's status is updated to `"confirmed"`. A `callReturn` field is added to the transaction object, which is then passed to the `onSuccess` handler, completing the sequence.

<aside class="notice">The <code>augur.rpc</code> object is simply an instance of <a href="https://github.com/AugurProject/ethrpc">ethrpc</a> that has its state synchronized with the <code>augur</code> object.</aside>

Augur Tx API
----------------------------
```javascript
// Augur Transaction API Examples:

// The Ethereum address of Augur's default Augur contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var augurAddress = "0x852684b374fe03ab77d06931f1b2831028fd58f5";

augur.api.Augur.createGenesisUniverse({
  tx: { 
    to: augurAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [Augur Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/Augur.sol), which handles [Universe](#universe) creation and event logging.

### augur.api.Augur.createGenesisUniverse(p)

Allows the caller to create a new [Genesis Universe](#genesis-universe). Users may wish to create a new Genesis Universe if, for example, they would like to create a separate [Universe](#universe) to compete with an existing Universe. Whenever a new Genesis Universe is created, it does not initially contain any [Markets](#market) or [REP](#rep) supply. In order to add a supply of REP, users must migrate their [Legacy REP](#legacy-rep) from the [Legacy REP smart contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/LegacyReputationToken.sol) into the [Reputation Token smart contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/ReputationToken.sol) of the new Genesis Universe using the function `augur.api.ReputationToken.migrateFromLegacyReputationToken`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Cancel Order Tx API
----------------------------
```javascript
// Cancel Order Transaction API Examples:

// The Ethereum address of Augur's default CancelOrder contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var cancelOrderAddress = "0x389c0b3f0d51cfba9e4d214712a1142f5685814d";

var _orderId = "0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870";
augur.api.CancelOrder.cancelOrder({
  _orderId: _orderId,
  tx: { 
    to: cancelOrderAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [CancelOrder Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/CancelOrder.sol), which allows for cancellation of [Orders](#order) on the [Order Book](#order-book).

### augur.api.CancelOrder.cancelOrder(p)

Cancels and refunds an existing [Order](#order) on the [Order Book](#order-book) with ID `p._orderId`. This transaction will trigger an [`OrderCanceled`](#OrderCanceled) event if the Order is canceled without any errors.

This function will fail if:

* `msg.sender` isn't the owner of the Order.
* `p._orderId` is undefined.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) ID of the Order to cancel, as a 32-byte hexadecimal value. (To get the order ID for a specific order, call the function `augur.api.Order.getOrderId`.)
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Cash Tx API
----------------------------
```javascript
// Cash Transaction API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
// The Ethereum address of Augur's Cash contract can be 
// obtained by calling `augur.augurNode.getSyncData`.
var cashContractAddress = "0xec28e64edbce62bde48a14b04f0b557b974a22a9";

// Amount of Cash (in attoCash) to approve the Augur.sol 
// contract to spend on this Ethereum account's behalf.
// This example approves the maximum amount, which is 
// augur.constants.ETERNAL_APPROVAL_VALUE, or 2^256 - 1.
var _attoCash = augur.constants.ETERNAL_APPROVAL_VALUE;

augur.api.Cash.approve({
  _spender: _augurContractAddress,
  _value: _attoCash,
  tx: { 
    to: cashContractAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Cash.decreaseApproval({
  _spender: _augurContractAddress,
  _subtractedValue: "0x3e8",
  tx: { 
    to: cashContractAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Cash.increaseApproval({
  _spender: "",
  _addedValue: "0x3e8",
  tx: { 
    to: cashContractAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Cash.withdrawEtherToIfPossible({
  _to: "0x555e64edbce62bde48a14b04f0b557b974a25555",
  _amount: "0x3e8",
  tx: { 
    to: cashContractAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [Cash Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol), which is used internally by Augur as an ERC-20 wrapper for ETH.

### augur.api.Cash.approve(p)

Many of the transaction functions in Augur's smart contracts will only work if the Augur.sol contract has been approved to spend [Cash](#cash) on behalf of the account executing the transaction. This function allows `p._spender` to spend up to `p._value` Cash for the `msg.sender` of this transaction. This transaction will trigger an [`Approval`](#Approval) event, which will record the owner address (`msg.sender`), `p._spender`, and `p._value` in [attoCash](#atto-prefix) approved. The amount that `p.spender` is approved to spend can be increased or decreased later by calling `augur.api.Cash.increaseApproval` or `augur.api.Cash.decreaseApproval`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of attoCash to allow `p._spender` to spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Cash.decreaseApproval(p)

Decreases the amount of [Cash](#cash) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._subtractedValue`**  (string) Number of [attoCash](#atto-prefix) by which to decrease the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Cash.increaseApproval(p)

Increases the amount of [Cash](#cash) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._addedValue`**  (string) Number of [attoCash](#atto-prefix) by which to increase the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Cash.withdrawEtherToIfPossible(p)

Withdraws a certain amount of the user's [Cash](#cash) to a particular address as ETH (as long as the user has the amount of Cash specified).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._to`**  (string) Ethereum address to transfer attoETH to, as a 20-byte hexadecimal value.
    * **`p._amount`**  (string) Amount of [attoETH](#atto-prefix) to transfer, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Claim Trading Proceeds Tx API
------------------------------
```javascript
// Claim Trading Proceeds Transaction API Examples:

// The Ethereum address of Augur's default ClaimTradingProceeds contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var claimTradingProceedsAddress = "0x53ebdf8b5babda8e59a217436266696efcd8d166";

var _market = "0xc4ba20cbafe3a3655a2f2e4df4ac7f942a722017";

augur.api.ClaimTradingProceeds.calculateReportingFee({
  _market: _market,
  _amount: "0xc3280e4b4b",
  tx: { 
    to: claimTradingProceedsAddress,
    send: false,
  }
}, function (error, reportingFee) { 
    console.log(reportingFee); 
});
// example output:
"83819064"

var _shareHolder = "0x5678ff3e9ce1c0459b309fac6dd4e69229b91567";
augur.api.ClaimTradingProceeds.claimTradingProceeds({
  _market: _market,
  _shareHolder: _shareHolder,
  tx: { 
    to: claimTradingProceedsAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [ClaimTradingProceeds Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/ClaimTradingProceeds.sol), which allows profits earned from trading to be claimed.

### augur.api.ClaimTradingProceeds.calculateReportingFee(p)

Calculates the [Reporting Fee](#reporting-fee) that will be paid when settling a specific number of [Shares](#share) in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to claim trading proceeds, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit), as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `true`, this function will be executed as a transaction, which will calculate the value (and thus uses gas). When set to `false`, this function will be executed as a call, which will return the Reporting Fee amount and will not use any gas. 
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will be executed as a call and will return the Reporting Fee amount, in attoETH, as a stringified unsigned integer.

### augur.api.ClaimTradingProceeds.claimTradingProceeds(p)

Collects trading profits from outstanding [Shares](#share) in [Finalized Market](#finalized-market) `p._market` owned by `p._shareHolder`. This transaction will trigger a [`TradingProceedsClaimed`](#TradingProceedsClaimed) event if the trading proceeds are claimed without any errors.

This transaction will fail if:

* `p._market` has not been Finalized.
* The [Post-Finalization Waiting Period](#post-finalization-waiting-period) has not passed.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to claim trading proceeds, as a 20-byte hexadecimal value.
    * **`p._shareHolder`** (string) Ethereum address of the Share holder for which to claim trading proceeds, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Complete Sets Tx API
-----------------------------
```javascript
// Complete Sets Transaction API Examples:

// The Ethereum address of Augur's default CompleteSets contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var completeSetsAddress = "0x8aa774927fb928ee1df0d0d3f94c8217658e0bce";

var _market = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";
var _amount = "0x2b5e3af16b1880000"; // 50.0 shares
augur.api.CompleteSets.publicBuyCompleteSets({
  _market: _market,
  _amount: _amount,
  tx: { 
    to: completeSetsAddress,
    value: "0x16345785d8a0000",
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.CompleteSets.publicBuyCompleteSetsWithCash({
  _market: _market,
  _amount: _amount,
  tx: { 
    to: completeSetsAddress,
    value: "0x16345785d8a0000",
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.CompleteSets.publicSellCompleteSets({
  _market: _market,
  _amount: _amount,
  tx: { 
    to: completeSetsAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.CompleteSets.publicSellCompleteSetsWithCash({
  _market: _market,
  _amount: _amount,
  tx: { 
    to: completeSetsAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [CompleteSets Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/CompleteSets.sol), which allows for buying and selling of [Complete Sets](#complete-set).

### augur.api.CompleteSets.publicBuyCompleteSets(p)

Purchases `p._amount` worth of [Shares](#share) in all [Outcomes](#outcome) of [Market](#market) `p._market`.

This transaction will fail if:

* `msg.sender` doesn't have enough of `p._market`'s denomination token to be able to afford `p._amount` Shares in all Outcomes.
* `p._amount` is not a number between 1 and 2<sup>254</sup>.

When successful, this transaction will trigger a [`CompleteSetsPurchased`](#CompleteSetsPurchased) event, which will record to the Ethereum blockchain `msg.sender`, `p._market`, the Universe in which `p._market` exists, and `p._amount` purchased.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to buy Complete Sets, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit) to purchase of each Outcome, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy a [Complete Set](#complete-set), as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.CompleteSets.publicBuyCompleteSetsWithCash(p)

This function is not fully implemented yet, but is a intended to be a point-of-contact that would work similarly to `augur.api.CompleteSets.publicBuyCompleteSets` and allow for a [0x](https://0xproject.com/)-style trading system.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to buy Complete Sets, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit) to purchase of each Outcome, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy a [Complete Set](#complete-set), as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.CompleteSets.publicSellCompleteSets(p)

Sell `p._amount` worth of [Shares](#share) in all [Outcomes](#outcome) of [Market](#market) `p._market`.

This transaction will fail if:

* `msg.sender` doesn't own `p._amount` Shares of all Outcomes in `p._market`.
* `p._amount` is not a number between 1 and 2<sup>254</sup>.

When successful, this transaction will trigger a [`CompleteSetsSold`](#CompleteSetsSold) event, which will record to the Ethereum blockchain `msg.sender`, `p._market`, the Universe in which `p._market` exists, and `p._amount` sold.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to sell Complete Sets, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit) to sell of each Outcome, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.CompleteSets.publicSellCompleteSetsWithCash(p)

This function is not fully implemented yet, but is a intended to be a point-of-contact that would work similarly to `augur.api.CompleteSets.publicSellCompleteSets` and allow for a [0x](https://0xproject.com/)-style trading system.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`** (string) Ethereum address of the Market in which to sell Complete Sets, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit) to sell of each Outcome, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Create Order Tx API
--------------------------
```javascript
// Create Order Transaction API Examples:

// The Ethereum address of Augur's default CreateOrder contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var createOrderAddress = "0xdadc071ecc3b7e97b139d2ef692defdc398c8211";

// The _betterOrderId/_worseOrderId to use when creating an Order 
// can be obtained by calling `augur.trading.getBetterWorseOrders`. 
// In the example below, `augur.trading.getBetterWorseOrders` returned
var _betterOrderId = "0x12328a31378e925ea122ea73e8c81baaf5c731d408487f6884d2e4c81baa3456";
var _worseOrderId = "0x91c28a31378e925ea122ea73e8c81baaf5c731d408487f6884d2e4c81baa39dd";

augur.api.CreateOrder.publicCreateOrder({
  _type: "0x0",
  _attoshares: "0x5af3107a4000",
  _displayPrice: "0x64",
  _market: "0xc4ba20cbafe3a3655a2f2e4df4ac7f942a722017",
  _outcome: "0x0",
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: "0x0000000000000000000000000000000000000000000000000000000000000000",
  tx: { 
    to: createOrderAddress,
    value: "0x470de4df820000", 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [CreateOrder Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/CreateOrder.sol), which enables new [Orders](#order) to be created.

### augur.api.CreateOrder.publicCreateOrder(p)

Creates a new [Bid Order](#bid-order) or [Ask Order](#ask-order) on the [Order Book](#order-book). The parameters `p._betterOrderId` and `p._worseOrderId` are the [Orders](#order) with the next best/next worse price after `p._displayPrice`, and they are used to optimize the process of sorting the new Order on the Order Book. Their IDs can be obtained by calling `augur.trading.getBetterWorseOrders`. This transaction will trigger an [`OrderCreated`](#OrderCreated) event if the Order is created without any errors.

This transaction will fail if:

* `p._type` is not a valid value of 0 or 1.
* `p._attoshares` is less than 0.
* `p._market` is undefined.
* `p._outcome` is less than 0 or greater than the total number of Outcomes for `p._market`.
* `p._displayPrice` is below the `p._market`'s [Minimum Display Price](#minimum-display-price) or above the `market`'s [Maximum Display Price](#maximum-display-price).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._type`** (string) Type of Order to create, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)).
    * **`p._attoshares`** (string) Number of [Share Units](#share-unit) to buy or sell, as a hexadecimal string.
    * **`p._displayPrice`** (string) Desired price at which to purchase Shares, in [attoETH](#atto-prefix).
    * **`p._market`** (string) Market contract address in which to place the Order, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. The Order ID for `p._betterOrderId` can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. The Order ID for `p._worseOrderId` can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to create the Order, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Dispute Crowdsourcer Tx API
----------------------------
```javascript
// Dispute Crowdsourcer Transaction API Examples:

// Dispute Crowdsourcer contract addresses for a Market can be 
// obtained by calling `augur.api.Market.getReportingParticipant` 
// or `augur.api.Market.derivePayoutDistributionHash`, followed 
// by `augur.api.Market.getCrowdsourcer`.
var disputeCrowdsourcerAddress = "0xe5d6eaefcfaf7ea1e17c4768a554d57800699ea4";

augur.api.DisputeCrowdsourcer.forkAndRedeem({
  tx: { 
    to: disputeCrowdsourcerAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

var _redeemer = "0x55d6eaefcfaf7ea1e17c4768a554d57800699ae4";
augur.api.DisputeCrowdsourcer.redeem({
  _redeemer: _redeemer,
  tx: { 
    to: disputeCrowdsourcerAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.DisputeCrowdsourcer.withdrawInEmergency({
  tx: { 
    to: disputeCrowdsourcerAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [DisputeCrowdsourcer Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/DisputeCrowdsourcer.sol), which allows users to [Stake](#dispute-stake) and redeem [REP](#rep) on [Outcomes](#outcome) other than a [Market's](#market) [Tentative Outcome](#tentative-outcome).

### augur.api.DisputeCrowdsourcer.forkAndRedeem(p)

Causes a [Child Universe](#child-universe) to be created for the [Outcome](#outcome) of the [Dispute Crowdsourcer](#crowdsourcer) and migrates the [REP](#rep) in the Crowdsourcer to the Child Universe. This function can be called only on the Crowdsourcers of a [Forked Market](#forked-market), and it can be called at any time after the [Fork](#fork) has begun (including after the [Market](#market) has been [Finalized](#finalized-market)). When called by a user who [Staked](#dispute-stake) on the Dispute Crowdsourcer's Outcome, it will redeem their Staked REP and collect any [Reporting Fees](#reporting-fee) (in Ether) that they are owed.

This transaction will trigger a [ReportingParticipantDisavowed](#ReportingParticipantDisavowed) event if the DisputeCrowdsourcer was forked without any errors.

This transaction will fail if:

* The DisputeCrowdsourcer belongs to a Market that is not Forked.

This transaction will trigger a [ReportingParticipantDisavowed](#ReportingParticipantDisavowed) event if the DisputeCrowdsourcer was forked without any errors.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.DisputeCrowdsourcer.redeem(p)

Redeems [REP](#rep) that `p._redeemer` [Staked](#dispute-stake) on a particular Dispute Crowdsourcer, as well as any [Reporting Fees](#reporting-fee) (in Ether) that `p._redeemer` is owed.

If the Dispute Crowdsourcer's [Market](#market) has been [Finalized](#finalized), and the Dispute Crowdsourcer filled its [Dispute Bond](#dispute-bond), the user will receive their Reporting Fees for the [Fee Window](#fee-window) plus 1.5 times the amount of REP they Staked (if the Outcome of the Dispute Crowdsourcer is the [Final Outcome](#final-outcome) of the Market), or the user will just receive Reporting Fees for the Fee Window (if the Outcome of the Dispute Crowdsourcer is not the Final Outcome of the Market).

If the Dispute Crowdsourcer's [Market](#market) has been [Finalized](#finalized), and the Dispute Crowdsourcer did not fill its [Dispute Bond](#dispute-bond), the user will receive Reporting Fees for the Fee Window (but not the REP they originally Staked).

If a Fork has occurred, all non-[Forked Markets](#forked-market) will have their [Tentative Outcome](#tentative-outcome) reset to the Outcome submitted in the [Initial Report](#initial-report) and be put back in the [Waiting for the Next Fee Window to Begin Phase](#waiting-for-the-next-fee-window-to-begin-phase). All non-[Forked Markets](#forked-market) will need to have `augur.api.Market.disavowCrowdsourcers` called before the `redeem` transaction can be called on any of their Dispute Crowdsourcers. Furthermore, all Dispute Crowdsourcers of the Forked Market will need to have `augur.api.DisputeCrowdsourcer.forkAndRedeem` called on them.

When `redeem` is called on Dispute Crowdsourcers of non-Forked Markets, this transaction will redeem any [REP](#rep) that `p._redeemer` [Staked](#dispute-stake) on that Crowdsourcer, as well as any [Reporting Fees](#reporting-fee) (in Ether) that `p._redeemer` is owed, to the [Universe](#universe) containing the Forked Market.

When `redeem` is called on Dispute Crowdsourcers of a Forked Market, it will redeem any REP that `p._redeemer` Staked on that Crowdsourcer, as well as any Reporting Fees (in Ether) that `p._redeemer` is owed, to the [Child Universe](#child-universe) for the [Outcome](#outcome) of that Crowdsourcer.

This transaction will trigger a [`DisputeCrowdsourcerRedeemed`](#DisputeCrowdsourcerRedeemed) event if the REP/Ether was redeemed without any errors.

This transaction will fail if:

* The DisputeCrowdsourcer belongs to a non-Forked Market in the same Universe as the Forked Market, and that non-Forked Market has not had `augur.api.Market.disavowCrowdsourcers` called on it.
* The DisputeCrowdsourcer belongs to the Forked Market and has not had `augur.api.DisputeCrowdsourcer.forkAndRedeem` called on it.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._redeemer`** (string) Ethereum address to send redeemed REP/Ether to, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.DisputeCrowdsourcer.withdrawInEmergency(p)

If a critical bug or vulnerability is found in Augur, the Augur development team can put Augur into a [halted](#developer-mode) state until the issue is resolved. In such instances, most regularly-used functions in Augur's backend will become unuseable until the system is returned to its normal state. When this happens, users can call the `withdrawInEmergency` function to withdraw the [REP](#rep) they [Staked](#dispute-stake) on the [Dispute Crowdsourcer's](#dispute-crowdsourcer) [Outcome](#outcome). Calling this function will not redeem any [Reporting Fees](#reporting-fee) because the total amount of Reporting Fees is not known until the end of the [Fee Window](#fee-window).

This transaction will fail if:

* Augur is not currently in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Fee Window Tx API
-----------------
```javascript
// Fee Window Transaction API Examples:

// Fee Window contract addresses can be obtained using a variety of Call API functions, 
// including `augur.api.Universe.getCurrentFeeWindow` and `augur.api.Universe.getFeeWindowByTimestamp`.
var feeWindowAddress = "0xe5d6eaefcfaf7ea1e17c4768a554d57800699ea4";

var _attotokens = "0x64";
augur.api.FeeWindow.buy({
  _attotokens: _attotokens,
  tx: { 
    to: feeWindowAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

var _sender = "0x8886eaefcfaf7ea1e17c4768a554d57800699888";
augur.api.FeeWindow.redeem({
  _sender: _sender,
  tx: { 
    to: feeWindowAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.FeeWindow.withdrawInEmergency({
  tx: { 
    to: feeWindowAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [FeeWindow Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/FeeWindow.sol), which allows for the buying and redeeming of [Participation Tokens](#participation-token).

### augur.api.FeeWindow.buy(p)

Purchases the number of [Participation Tokens](#participation-token) specified by `p._attotokens`.

This transaction will fail if:

* `p._attotokens` is <= 0.
* Reporting is not currently active in the [Fee Window](#fee-window).
* The [Fee Window's](#fee-window) [Universe](#universe) has a [Forked Market](#forked-market).

These Participation Tokens can be redeemed later once the Fee Window is no longer active using the function `augur.api.FeeWindow.redeem`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._attotokens`** (string) Number of Participation Tokens to purchase, in [attotokens](#atto-prefix), as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.FeeWindow.redeem(p)

Converts any [Participation Tokens](#participation-token) `p._sender` has in the specified [Fee Window](#fee-window) to [Reputation Tokens](#rep), and gives the user any [Reporting Fees](#reporting-fee) he or she is owed in Ether. The parameter `p._sender` is the Ethereum address of the user redeeming the Participation Tokens, as a 20-byte hexadecimal string.

This transaction will trigger a [`FeeWindowRedeemed`](#FeeWindowRedeemed) event if the REP/Ether was redeemed without any errors.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._sender`** (string) Ethereum address to send redeemed REP/Ether to, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.FeeWindow.withdrawInEmergency(p)

If a critical bug or vulnerability is found in Augur, the Augur development team can put Augur into a [halted](#developer-mode) state until the issue is resolved. In such instances, most regularly-used functions in Augur's backend will become unuseable until the system is returned to its normal state. When this happens, users can call the `withdrawInEmergency` function to withdraw their Participation Tokens and convert them into Reputation Tokens.

This transaction will fail if:

* Augur is not currently in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Fill Order Tx API
--------------------------
```javascript
// Fill Order Transaction API Examples:

// The Ethereum address of Augur's default FillOrder contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var fillOrderAddress = "0x0c77f6af7b3b5fed8ca980414a97c62da283098a";

var _orderId = "0xea2c7476e61f5e2625e57df17fcce74741d3c2004ac657675f686a23d06e6091";
var _amountFillerWants = "0x8ac7230489e80000"; // 10.0 shares
var _tradeGroupId = "0x0000000000000000000000000000000000000000000000000000000000000002";

augur.api.FillOrder.publicFillOrder({
  _orderId: _orderId,
  _amountFillerWants: _amountFillerWants,
  _tradeGroupId: _tradeGroupId,
  tx: { 
    to: fillOrderAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [FillOrder Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/FillOrder.sol), which allows for the [Filling](#fill-order) of [Orders](#order) on the [Order Book](#order-book).

### augur.api.FillOrder.publicFillOrder(p)

Attempts to Fill `p._amountFillerWants` [Share Units](#share-unit) for [Order](#order) `p._orderId`. If `p._amountFillerWants` is enough to [Fill](#fill-order) the Order completely, the Order will be removed from the [Order Book](#order-book). Otherwise, it will be adjusted to only include the remaining amount after Filling the `p._amountFillerWants` value that the [Filler](#order-filler) requests. This transaction will trigger an [`OrderFilled`](#OrderFilled) event if the Order is Filled without any errors.

This transaction will fail if:

* `p._orderId` or `p._amountFillerWants` is `undefined`.
* `msg.sender` of this transaction is the [Creator](#order-creator) of `p._orderId`.

#### **Parameters:**

* **`p`** (Object) Parameters object.    
    * **`p._orderId`** (string) Ethereum address of an Order on the Order Book, as a 32-byte hexadecimal value.
    * **`p._amountFillerWants`** (string) Number of [Shares](#share) to Fill, as a hexadecimal string.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to fill the Order, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Initial Reporter Tx API
----------------------
```javascript
// Initial Reporter Transaction API Examples:

// The Ethereum address of a Market's InitialReporter contract 
// can be obtained by calling `augur.api.Market.getInitialReporter`.
var initialReporterAddress = "0x0c77f6af7b3b5fed8ca980414a97c62da283098a";

augur.api.InitialReporter.forkAndRedeem({
  tx: { 
    to: initialReporterAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.InitialReporter.redeem({
  "": initialReporterAddress, // This parameter's key must be the empty string, and its value can be any address-length string.
  tx: { 
    to: initialReporterAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.InitialReporter.transferOwnership({
  _newOwner: "0x9998ff3e9ce1c0459b309fac6dd4e69229b91777",
  tx: { 
    to: initialReporterAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.InitialReporter.withdrawInEmergency({
  tx: { 
    to: initialReporterAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [InitialReporter Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/InitialReporter.sol), which enables functionality related to [Initial Reports](#initial-report).

### augur.api.InitialReporter.forkAndRedeem(p)

Causes a [Child Universe](#child-universe) to be created for the [Outcome](#outcome) of the [Initial Report](#initial-report) and migrates the [REP](#rep) [Staked](#dispute-stake) by the [Initial Reporter](#initial-reporter) to the Child Universe. This transaction can be called at any time after the [Fork](#fork) has begun (including after the [Market](#market) has been [Finalized](#finalized-market)). When called by a user who who submitted the Initial Report, it will also transfer the REP Staked on the Initial Report's Outcome to the Initial Reporter of the Forked Market. 

This transaction will trigger a [ReportingParticipantDisavowed](#ReportingParticipantDisavowed) event if the InitialReporter was forked without any errors.

This transaction will fail if:

* The InitialReporter does not belong to a [Forked Market](#forked-market).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.InitialReporter.redeem(p)

Redeems the [REP](#rep) that the [Designated Reporter](#designated-reporter) or [First Public Reporter](#first-public-reporter) Staked on the [Outcome](#outcome) of the [Initial Report](#initial-report).

This transaction will trigger an [`InitialReporterRedeemed`](#InitialReporterRedeemed) event if the REP/Ether was redeemed without any errors.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p[""]` (string) The `redeem` function in `InitialReporter.sol` requires an unnamed parameter to be passed in so that it can fulfill an interface. When calling `augur.api.InitialReporter.redeem`, this parameter should be passed using the empty string as the key. Since this function does not actually use this parameter, it's value can be any address-length string. (Please refer to example code for this function.)
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.InitialReporter.transferOwnership(p)

Changes the owner of the Initial Reporter contract from the existing owner to `p._newOwner`.

This function will fail if:

* `msg.sender` isn't the owner of the InitialReporter.

This transaction will trigger an [`InitialReporterTransferred`](#InitialReporterTransferred) event if the REP/Ether was transferred without any errors.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._newOwner`** (string) Ethereum address of the desired new owner for the InitialReporter, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.InitialReporter.withdrawInEmergency(p)

If a critical bug or vulnerability is found in Augur, the Augur development team can put Augur into a [halted](#developer-mode) state until the issue is resolved. In such instances, most regularly-used functions in Augur's backend will become unuseable until the system is returned to its normal state. When this happens, [Initial Reporters](#initial-reporter) can call the `withdrawInEmergency` function to withdraw the [REP](#rep) they [Staked](#dispute-stake) on the [Initial Report](#dispute-crowdsourcer) [Outcome](#outcome) (in cases where the [First Public Reporter](#first-public-reporter) submitted the Initial Report instead of the [Designated Reporter](#designated-reporter)).

This transaction will fail if:

* Augur is not currently in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Mailbox Tx API
----------------------
```javascript
// Mailbox Transaction API Examples:

// The Ethereum address of a Market Creator's mailbox can be obtained
// by calling `augur.api.Market.getMarketCreatorMailbox`.
var mailboxAddress = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";

augur.api.Mailbox.transferOwnership({
  _newOwner: "0x8fa56abe36d8dc76cf85fecb6a3026733e0a12ac",
  tx: { 
    to: mailboxAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Mailbox.withdrawEther({
  tx: { 
    to: mailboxAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

var _repTokenAddress = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";
augur.api.Mailbox.withdrawTokens({
  _token: _repTokenAddress,
  tx: { 
    to: mailboxAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [Mailbox Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Mailbox.sol), which enables the functionality of the [Market Creator Mailbox](#market-creator-mailbox).

### augur.api.Mailbox.transferOwnership(p)

Changes the current owner of [Market Creator Mailbox](#market-creator-mailbox) to  `p._newOwner`. This transaction will trigger a [`MarketMailboxTransferred`](#MarketMailboxTransferred) event, which will record the Market Creator Mailbox, the [Market](#market) & [Universe](#universe) it belongs to, as well as the old owner's address and the new owner's address.

This transaction will fail if:

* `msg.sender` isn't the owner of the Market Creator Mailbox.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._newOwner`** (string) Ethereum address of the desired new owner of the Mailbox, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Mailbox.withdrawEther(p)

Transfers all Ether in the [Market Creator Mailbox](#market-creator-mailbox) to the [Market Creator's](#market-creator) Ethereum address.  

This transaction will fail if:

* `msg.sender` isn't the owner of the specified Mailbox.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Mailbox.withdrawTokens(p)

Transfers all tokens of type `p._token` in the [Market Creator Mailbox](#market-creator-mailbox) to the [Market Creator's](#market-creator) Ethereum address.  

This transaction will fail if:

* `msg.sender` isn't the owner of the specified Mailbox.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._token`** (string) Ethereum address of an [ERC20Basic](https://github.com/AugurProject/augur-core/blob/master/source/contracts/libraries/token/ERC20Basic.sol) token contract, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Market Tx API
----------------------
```javascript
// Market Transaction API Examples:
var marketAddress = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";

var _payoutNumerators = [ "0x0", "0x2710" ];
var _invalid = false;
var _amount = "0x64";
augur.api.Market.contribute({
  _payoutNumerators: _payoutNumerators,
  _invalid: _invalid,
  _amount: _amount,
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.disavowCrowdsourcers({
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.doInitialReport({
  _payoutNumerators: _payoutNumerators,
  _invalid: _invalid,
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.finalize({
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.finalizeFork({
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.migrateThroughOneFork({
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.transferOwnership({
  _newOwner: "0x8fa56abe36d8dc76cf85fecb6a3026733e0a12ac",
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Market.withdrawInEmergency({
  tx: { 
    to: marketAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [Market Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Market.sol), which enables functionality for Augur's [Markets](#market).

### augur.api.Market.contribute(p)

Contributes `p._amount` [REP](#rep) to the [Dispute Crowdsourcer](#crowdsourcer) represented by [Payout Set](#payout-set) `p._payoutNumerators` and `p._invalid` in order to help [Challenge](#challenge) the [Market](#market)'s [Tentative Outcome](#tentative-outcome). If the amount of REP in the Dispute Crowdsourcer plus `p._amount` is greater than the total REP required to fill the [Dispute Bond](#dispute-bond), this function will only contribute the remaining amount of REP required to fill the Dispute Bond on behalf of the caller.

This transaction will trigger a [`DisputeCrowdsourcerContribution`](#DisputeCrowdsourcerContribution) event if it executes without any errors. It will also trigger a `DisputeCrowdsourcerCompleted` event if the Dispute Bond is successfullly filled, and it will trigger a [`UniverseForked`](#UniverseForked) event if enough REP has been [Staked](#dispute-stake) in the Dispute Crowdsourcer to cause the Market to [Fork](#fork).

This function will fail if:

* The Market is in a [Fee Window](#fee-window) that is not active.
* The [Market's](#market) [Universe](#universe) has a [Forked Market](#forked-market).
* The [Outcome](#outcome) specified by `p._payoutNumerators` and `p._invalid` is already the Tentative Outcome of the Market.
* `p._invalid` is true and the Numerators in `p._payoutNumerators` are not all the same value. (For information about what the Payout Set should look like for an Invalid Market, refer to the [Invalid Outcome glossary entry](#invalid-outcome).)

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._payoutNumerators`**  (Array.&lt;number>|Array.&lt;string>) Array representing the Market's Payout Set.
    * **`p._invalid`**  (boolean) Whether the Outcome of the Market is Invalid.
    * **`p._amount`**  (string) Amount to contribute to the Dispute Crowdsourcer, in [attoREP](#atto-prefix).
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.disavowCrowdsourcers(p)

"Disavows" all [Dispute Crowdsourcers](#dispute-crowdsourcer) of a Market, meaning the Market's [Tentative Outcome](#tentative-outcome) is reset back to the [Outcome](#outcome) of the [Initial Report](#initial-report), and all [REP](#rep) [Staked](#dispute-stake) in the Crowdsourcers are redeemable by users who contributed to them using the function `augur.api.DisputeCrowdsourcer.redeem`. This transaction may only be called on non-[Forked Markets](#forked-market) in the event that another [Market](#market) in the same [Universe](#universe) [Forks](#fork).

This transaction will trigger a [MarketParticipantsDisavowed](#MarketParticipantsDisavowed) event if the Market's InitialReporter and DisputeCrowdsourcers were disavowed without any errors.

This function will fail if:

* There is not a Forked Market in the Market's Universe.
* The Market is a Forked Market.
* The Market is [Finalized](#finalized-market).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.doInitialReport(p)

Submits an [Initial Report](#initial-report) for the [Market](#market). This transaction will trigger an [`InitialReportSubmitted`](#InitialReportSubmitted) event if it submits the Initial Report successfully.

This transaction will fail if:

  * The Market's event end time has not passed.
  * The caller of the function is not the [Designated Reporter](#designated-reporter) and the [Designated Reporting Phase](#designated-reporting-phase) has not ended.
  * `p._invalid` is true and the Numerators in `p._payoutNumerators` are not all the same value. (For information about what the [Payout Set](#payout-set) should look like for an Invalid Market, refer to the [Invalid Outcome glossary entry](#invalid-outcome).)

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._payoutNumerators`**  (Array.&lt;number>|Array.&lt;string>) Array representing the Market's Payout Set.
    * **`p._invalid`**  (boolean) Whether the Outcome of the Market is Invalid.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.finalize(p)

[Finalizes](#finalized-market) the [Market](#market), meaning it sets the winning [Payout Distribution Hash](#payout-distribution-hash) for the Market, redistributes [REP](#rep) Staked on non-winning [Outcomes](#outcome) to REP holders who Staked on the winning Outcome, and distributes the [Validity Bond](#validity-bond) based on whether the Market resolved as [Invalid](#invalid-outcome). Then, once the [Post-Finalization Waiting Period](#post-finalization-waiting-period) has elapsed, users can [Settle](#settlement) their [Shares](#share). This transaction will trigger a [`MarketFinalized`](#MarketFinalized) event if the Market Finalized without any errors.

This transaction will fail if:

* The [Initial Report](#initial-report) has not been submitted.
* The [Fee Window](#fee-window) has not ended.
* The Market is a Forked Market.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.finalizeFork(p)

[Finalizes](#finalized-market) the [Forked Market](#forked-market), meaning it sets the winning [Payout Distribution Hash](#payout-distribution-hash) for the [Market](#market). Then, once the [Post-Finalization Waiting Period](#post-finalization-waiting-period) has elapsed, users can [Settle](#settlement) their [Shares](#share).

This transaction will fail if:

* The Market is not a Forked Market.
* The [Fork Threshold](#fork-threshold) has not been reached, and the [Fork Period](#fork-period) is not over.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.migrateThroughOneFork(p)

Migrates the [Market](#market) into a winning [Child Universe](#child-universe) from a [Forked](#fork) [Parent Universe](#parent-universe). When a Fork occurs, there is a [Fork Period](#fork-period), wherein [REP](#rep) holders migrate their REP to the [Universe](#universe) they want to continue in. Once the Fork Period ends, the Child Universe with the most REP migrated to it is declared the [Winning Universe](#winning-universe). Calling this function attempts to move the Market from a Parent Universe to the Winning Universe after it's been decided. This function also migrates the [No-Show Bond](#no-show-bond) to the winning Universe and migrates REP staked in the InitialReporter contract to the ReputationToken contract associated with the Child Universe.

This transaction will fail if:

* The Market is [Finalized](#finalized-market).
* The [Forked Market](#forked-market) is not Finalized (i.e., the Fork Period is not over, so there is no Winning Universe to migrate to).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.transferOwnership(p)

Changes the owner of the [Market](#market) from the current owner to `p._newOwner`. This transaction will trigger a [`MarketTransferred`](#MarketTransferred) event, which will record the [Market](#market) and [Universe](#universe) it belongs to, as well as the old owner's address and the new owner's address.

This transaction will fail if:

* `msg.sender` isn't the owner of the Market.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._newOwner`**  (string) Ethereum address of the desired new owner of the Market, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Market.withdrawInEmergency(p)

If a critical bug or vulnerability is found in Augur, the development team can put it the system into a [halted](#developer-mode) state until the issue is resolved. In such instances, most regularly-used functions in Augur's backend will become unuseable until the system is returned to its normal state. When this happens, users can call the `withdrawInEmergency` function to withdraw their Reputation Tokens from a particular Market.

This transaction will fail if:

* Augur is not currently in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Reputation Token Tx API
--------------------------------
```javascript
// Reputation Token Transaction API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
// The Ethereum contract address for a Universe's Reputation Token 
// can be obtained by calling `augur.api.Universe.getReputationToken`.
var reputationTokenAddress = "0xd2ee83a8a2a904181ccfddd8292f178614062aa0";

augur.api.ReputationToken.approve({
  _spender: _augurContractAddress,
  _value: "0xff",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.decreaseApproval({
  _spender: _augurContractAddress,
  _subtractedValue: "0x3e8",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.increaseApproval({
  _spender: _augurContractAddress,
  _addedValue: "0x3e8",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.migrateFromLegacyReputationToken({
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

var _destination = "0x73295d3c0ca46113ca226222c81c79adabf9f391";
augur.api.ReputationToken.migrateOut({
  _destination: _destination,
  _attotokens: "0xa",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.migrateOutByPayout({
  _payoutNumerators: ["0x1", "0x270F"],
  _invalid: false,
  _attotokens: "0xa",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.transfer({
  _to: "0x8fa56abe36d8dc76cf85fecb6a3026733e0a12ac",
  _value: "0xff",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.transferFrom({
  _from: "0x1a05071893b764109f0bbc5b75d78e3e38b69ab3",
  _to: "0x8fa56abe36d8dc76cf85fecb6a3026733e0a12ac",
  _value: "0xff",
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.updateParentTotalTheoreticalSupply({
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ReputationToken.updateSiblingMigrationTotal({
  tx: { 
    to: reputationTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [ReputationToken Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/ReputationToken.sol), which handles the approval, migration, and transfering of [Reputation Tokens](#rep).

The Reputation Token, or REP, is an ERC-20 token that implements all of the required functions listed in the [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20). It does not, however, implement the optional functions.

### augur.api.ReputationToken.approve(p)

Allows `p._spender` to spend up to `p._value` [REP](#rep) for the `msg.sender` of this transaction. This transaction will trigger an [`Approval`](#Approval) event, which will record the owner address (`msg.sender`), `p._spender`, and `p._value` in [attoREP](#atto-prefix) approved. The amount that `p.spender` is approved to spend can be increased or decreased later by calling `augur.api.ReputationToken.increaseApproval` or `augur.api.ReputationToken.decreaseApproval`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of attoREP to allow `p._spender` to spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.decreaseApproval(p)

Decreases the amount of [REP](#rep) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._subtractedValue`**  (string) Number of [attoREP](#atto-prefix) by which to decrease the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.increaseApproval(p)

Increases the amount of [REP](#rep) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._addedValue`**  (string) Number of [attoREP](#atto-prefix) by which to increase the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.migrateFromLegacyReputationToken(p)

Migrates [Legacy REP](#legacy-rep) tokens owned by `msg.sender` from the [Legacy REP contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/LegacyReputationToken.sol) to the `reputationToken` provided. This transaction will add whatever `msg.sender`'s balance was for the Legacy REP contract to the `reputationToken` contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.migrateOut(p)

This transaction migrates `p._attotokens` of `msg.sender`'s [REP](#rep) from contract address `p.tx.to` to `p._destination` contract address in the case of a [Fork](#fork).

This transaction will fail if:

* `p._attotokens` is not greater than 0.
* `p._destination`'s [Universe](#universe) is not a [Child Universe](#child-universe) of `p.tx.to`'s Universe.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._destination`**  (string) Ethereum address of the destination [Reputation Token](#reputation-token) contract to migrate REP to, as a 20-byte hexadecimal value.
    * **`p._attotokens`**  (string) Number of REP to migrate, in [attoREP](#atto-prefix), as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.migrateOutByPayout(p)

Creates a [Child Universe](#child-universe) (if it does not already exist) for the ReputationToken contract's [Universe](#universe), where the [Forked Market](#forked-market) has the [Payout Set](#payout-set) `p._payoutNumerators`. If the Forked Market is deemed to have an [Invalid Outcome](#invalid-outcome), `p._invalid` should be set to `true`; otherwise, it should be set to `false`. Once the Child Universe exists, the function will migrate `p._attotokens` REP from the ReputationToken contract of the Parent Universe to the ReputationToken contract of the Child Universe.

This transaction will fail if:

* `p._attotokens` is not greater than 0.
* The Universe the ReputationToken contract belongs to does not have a Forked Market.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._payoutNumerators`**  (Array.&lt;string>) Payout Set of the Forked Market in the Child Universe.
    * **`p._invalid`**  (boolean) Whether the Forked Market is deemed to have an Invalid Outomce in the Child Universe.
    * **`p._attotokens`**  (string) Number of REP to migrate to the Child Universe's ReputationToken contract, in [attoREP](#atto-prefix), as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.transfer(p)

Sends `p._value` worth of [attoREP](#atto-prefix) to the Ethereum address `p._to`. If this transaction transfers without any errors, it will trigger a [`Transfer`](#Transfer) event, which will record the from address (`msg.sender`), `p._to` address, and `p._value` amount transferred.

This transaction will fail if:

* `msg.sender` does not have enough REP to be able to transfer `p._value` attoREP to the `p._to` address.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._to`**  (string) Ethereum address to send REP to, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of attoREP to send, between 1 and 2<sup>254</sup>, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.transferFrom(p)

Sends `p._value` worth of [attoREP](#atto-prefix) from the Ethereum addres `p._from` to the Ethereum address `p._to`. If this transaction transfers without any errors, it will trigger a `Transfer` event, which will record the `p._from` address, `p._to` address, and `p._value` (in attoREP) amount transferred.

This transaction will fail if:

* `p._from` does not have enough REP to be able to transfer `p._value` attoREP to the `p._to` address.
* `msg.sender` does not have the approval (see `augur.api.ReputationToken.approve`) to spend at least `p._value` worth of REP for the `p._from` address.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._from`**  (string) Ethereum address to send REP from, as a 20-byte hexadecimal value.
    * **`p._to`**  (string) Ethereum address to send REP to, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of attoREP to send, between 1 and 2<sup>254</sup>, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.updateParentTotalTheoreticalSupply(p)

Gets the current [Theoretical REP Supply](#theoretical-rep-supply) for this ReputationToken contract's [Parent Universe](#parent-universe), and updates this ReputationToken contract's Theoretical REP Supply accordingly.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ReputationToken.updateSiblingMigrationTotal(p)

Gets the current [Theoretical REP Supply](#theoretical-rep-supply) for a ReputationToken contract sharing the same [Parent Universe](#parent-universe) as the specified ReputationToken, and updates the specified ReputationToken contract's Theoretical REP Supply accordingly.

This transaction will fail if:

* `p._token` is the same ReputationToken contract as one this transaction is being called on.
* `p._token` does not have the same Parent Universe as the ReputationToken contract this transaction is being called on.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._token`**  (string) Ethereum contract address of a ReputationToken contract that has the same Parent Universe as the one this transaction is being called on.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Share Token Tx API
---------------------------
```javascript
// Share Token Transaction API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
// Share Token contract addresses for a Market can be 
// obtained by calling `augur.api.Market.getShareToken`.
var shareTokenAddress = "0x925bee44fec28deb228d2251e1a9d32f7c73ebed";

var _attotokens = "0x56bc75e2d63100000";

augur.api.ShareToken.approve({
  _spender: _augurContractAddress,
  _value: _attotokens,
  tx: { 
    to: shareTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ShareToken.decreaseApproval({
  _spender: _augurContractAddress,
  _subtractedValue: "0x3e8",
  tx: { 
    to: shareTokenAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ShareToken.increaseApproval({
  _spender: _augurContractAddress,
  _addedValue: "0x3e8",
  tx: { 
    to: shareTokenAddress,
    gas: "0x632ea0" 
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ShareToken.transfer({
  _to: "0x01f50356c280cd886dd058210937160c73700a4b",
  _value: _attotokens,
  tx: { 
    to: shareTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.ShareToken.transferFrom({
  _from: "0x4b01721f0244e7c5b5f63c20942850e447f5a5ee",
  _to: "0xa1f50356c280cd886dd058210937160c73700a4b",
  _value: _attotokens,
  tx: { 
    to: shareTokenAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [ShareToken Solidity Code](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/ShareToken.sol), which handles the approval and transferring of [Shares](#share) in Augur. 

The Share Token is an ERC-20 token that implements all of the required functions listed in the [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20). It does not, however, implement the optional functions. Within Augur, it represents [Shares](#share) in [Market](#market) [Outcomes](#outcome).

### augur.api.ShareToken.approve(p)

Allows `p._spender` to spend up to `p._value` [Shares](#share) for the `msg.sender` of this transaction. This transaction will trigger an [`Approval`](#Approval) event, which will record the owner address (`msg.sender`), `p._spender`, and `p._value`, in [Share Units](#share-unit), approved. The amount that `p.spender` is approved to spend can be increased or decreased later by calling `augur.api.ShareToken.increaseApproval` or `augur.api.ShareToken.decreaseApproval`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of [Share Units](#share-unit) to allow `p._spender` to spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ShareToken.decreaseApproval(p)

Decreases the amount of [Shares](#share) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._subtractedValue`**  (string) Number of [Share Units](#share-unit) by which to decrease the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ShareToken.increaseApproval(p)

Increases the amount of [Shares](#share) `p._spender` is approved to spend on behalf of `msg.sender`.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._spender`**  (string) Ethereum address of the desired spender, as a 20-byte hexadecimal value.
    * **`p._addedValue`**  (string) Number of [Share Units](#share-unit) by which to increase the amount `p._spender` may spend on behalf of `msg.sender`, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ShareToken.transfer(p)

Sends `p._value` worth of [Share Units](#share-unit) to the Ethereum address `p._to`. If this transaction transfers without any errors, it will trigger a [`Transfer`](#Transfer) event, which will record the from address (`msg.sender`), `p._to` address, and `p._value` amount transferred.

This transaction will fail if:

* `msg.sender` does not have enough Share Units to be able to transfer `p._value` Share Units to the `p._to` address.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._to`**  (string) Ethereum address to send Shares to, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of Share Units to send, between 1 and 2<sup>254</sup>, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.ShareToken.transferFrom(p)

Sends `p._value` worth of [Share Units](#share-unit) from the Ethereum addres `p._from` to the Ethereum address `p._to`. If this transaction transfers without any errors, it will trigger a [`Transfer`](#Transfer) event, which will record the `p._from` address, `p._to` address, and `p._value` (in Share Units) amount transferred.

This transaction will fail if:

* `p._from` does not have enough Shares to be able to transfer `p._value` Share Units to the `p._to` address.
* `msg.sender` does not have the approval (see `augur.api.ShareToken.approve`) to spend at least `p._value` worth of Share Tokens for the `p._from` address.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._from`**  (string) Ethereum address to send Shares from, as a 20-byte hexadecimal value.
    * **`p._to`**  (string) Ethereum address to send Shares to, as a 20-byte hexadecimal value.
    * **`p._value`**  (string) Number of Share Units to send, between 1 and 2<sup>254</sup>, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Trade Tx API
---------------------
```javascript
// Trade Transaction API Examples:

// The Ethereum address of Augur's default Trade contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var tradeAddress = "0x0dec7fd04933b8673cef99b64978113065b03926";

var _market = "0x7e8e07364ccde43ba5159537404924e86ca53c92";
var _outcome = "0x1";
var _fxpAmount = "0x8ac7230489e80000"; // 10.0
var _price = "0x6f05b59d3b20000"; // 0.5
var _betterOrderId = "0xea2c7476e61f5e2625e57df17fcce74741d3c2004ac657675f686a23d06e6091";
var _worseOrderId = "0xed42c0fab97ee6fbde7c47dc62dc3ad09e8d3af53517245c77c659f7cd561426";
var _tradeGroupId = "0x0000000000000000000000000000000000000000000000000000000000000003";
var _loopLimit = "0x2";
augur.api.Trade.publicBuy({
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicBuyWithLimit({
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  _loopLimit: _loopLimit,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicFillBestOrder({
  _direction: "0x1",
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _tradeGroupId: _tradeGroupId,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicFillBestOrderWithLimit({
  _direction: "0x1",
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _tradeGroupId: _tradeGroupId,
  _loopLimit: _loopLimit,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicSell({
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicSellWithLimit({
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  _loopLimit: _loopLimit,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicTrade({
  _direction: "0x0",
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.Trade.publicTradeWithLimit({
  _direction: "0x0",
  _market: _market,
  _outcome: _outcome,
  _fxpAmount: _fxpAmount,
  _price: _price,
  _betterOrderId: _betterOrderId,
  _worseOrderId: _worseOrderId,
  _tradeGroupId: _tradeGroupId,
  _loopLimit: _loopLimit,
  tx: { 
    to: tradeAddress,
    value: "0x16345785d8a0000", 
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [Trade Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Trade.sol), which allows for the buying and selling of [Shares](#share) of a particular [Outcome](#outcome) in a [Market](#market).

### augur.api.Trade.publicBuy(p)

Buys `p._fxpAmount` number of [Shares](#share) in [Outcome](#outcome) `p._outcome` of [Market](#market) `p._market` at `p._price` [attoETH](#atto-prefix) per Share. This transaction takes [Orders](#order) off the [Order Book](#order-book) that can be [Filled](#fill-order) with this request, otherwise it creates a new Order to buy `p._fxpAmount` of [Share Units](#share-unit) at `p._price`. The parameters `p._betterOrderId` and `p._worseOrderId` are the Orders with the next best/next worse price after `p._price`, and they are used to optimize the process of sorting the new Order on the Order Book. Their IDs can be obtained by calling `augur.trading.getBetterWorseOrders`. This transaction will trigger an [`OrderCreated`](#OrderCreated) event if the Order is created without any errors.

This transaction will fail if:

* The value of the order (calculated as `p._price` * `p._fxpAmount`) is less than the minimum value for a Buy order, which is 10**14 attoETH.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of the Market in which to buy Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to buy Shares, in attoETH, as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy the desired amount of Share Units, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicBuyWithLimit(p)

Works like `augur.api.Trade.publicBuy`, but uses the parameter `_loopLimit` to determine how many [Fill Order](#fill-order) operations to perform. The function `augur.api.Trade.publicBuy` will do as many Fill Order operations as the amount of gas passed to it will permit, based on a hard-coded value for how much gas is needed to Fill an Order. If the gas cost drops significantly from where it is at Augur's launch, the Trade contract would require far more gas than is actually needed. Therefore, in such a scenario, `augur.api.Trade.publicBuyWithLimit` could be used instead.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of the Market in which to buy Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to buy Shares, in attoETH, as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p._loopLimit`** (string) Maximum number of Fill Order operations to make.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy the desired amount of Share Units, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicFillBestOrder(p)

Works similarly to `augur.api.Trade.publicTrade`, except it does not create an [Order](#order) if the request can't be [Filled](#fill-order). Instead, it will take the best Order available on the [Order Book](#order-book).

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._direction`** (string) Direction of the trade, as a hexadecimal string. ("0x0" for long or "0x1" for short.)
    * **`p._market`**  (string) Ethereum address of the Market in which to buy/sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy/sell, as a hexadecimal string
    * **`p._price`**  (string) Price at which to buy/sell Shares, in [attoETH](#atto-prefix), as a hexadecimal string.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [Share Units](#share-unit) to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicFillBestOrderWithLimit(p)

Works like `augur.api.Trade.publicFillBestOrder`, but uses the parameter `_loopLimit` to determine how many [Fill Order](#fill-order) operations to perform. The function `augur.api.Trade.publicFillBestOrder` will do as many Fill Order operations as the amount of gas passed to it will permit, based on a hard-coded value for how much gas is needed to Fill an Order. If the gas cost drops significantly from where it is at Augur's launch, the Trade contract would require far more gas than is actually needed. Therefore, in such a scenario, `augur.api.Trade.publicFillBestOrderWithLimit` could be used instead.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._direction`** (string) Direction of the trade, as a hexadecimal string. ("0x0" for long or "0x1" for short.)
    * **`p._market`**  (string) Ethereum address of the Market in which to buy/sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy/sell, as a hexadecimal string
    * **`p._price`**  (string) Price at which to buy/sell Shares, in [attoETH](#atto-prefix), as a hexadecimal string.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p._loopLimit`** (string) Maximum number of Fill Order operations to make.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [Share Units](#share-unit) to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicSell(p)

Sells `p._fxpAmount` number of [Share Units](#share-unit) in [Outcome](#outcome) `p._outcome` of [Market](#market) `p._market` at `p._price` [attoETH](#atto-prefix) per Share. This transaction takes [Orders](#order) off the [Order Book](#order-book) that can be [Filled](#fill-order) with this request, otherwise it creates a new Order to sell `p._fxpAmount` of Share Units. The parameters `p._betterOrderId` and `p._worseOrderId` are the Orders with the next best/next worse price with respect to `p._price`, and they are used to optimize the process of sorting the new Order on the Order Book. Their IDs can be obtained by calling `augur.trading.getBetterWorseOrders`. This transaction will trigger an [`OrderCreated`](#OrderCreated) event if the Order is created without any errors.

This transaction will fail if:

* The value of the Order (calculated as `p._price` * (Market's number of Ticks - `p._fxpAmount`)) is less than the minimum value for a Sell Order, which is 10**14 attoETH.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of the Market in which to sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of Share Units to sell, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to sell Share Units, in attoETH, as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [Share Units](#share-unit) to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicSellWithLimit(p)

Works like `augur.api.Trade.publicSell`, but uses the parameter `_loopLimit` to determine how many [Fill Order](#fill-order) operations to perform. The function `augur.api.Trade.publicSell` will do as many Fill Order operations as the amount of gas passed to it will permit, based on a hard-coded value for how much gas is needed to Fill an Order. If the gas cost drops significantly from where it is at Augur's launch, the Trade contract would require far more gas than is actually needed. Therefore, in such a scenario, `augur.api.Trade.publicSellWithLimit` could be used instead.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of the Market in which to sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of Shares Units to sell, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to sell Share Units, in attoETH, as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p._loopLimit`** (string) Maximum number of Fill Order operations to make.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [Share Units](#share-unit) to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicTrade(p)

Works similarly to `augur.api.Trade.publicBuy` and `augur.api.Trade.publicSell`; however a direction must be specified. The `p._direction` must be either "0x0" for long or "0x1" for short. This transaction will trigger an [`OrderCreated`](#OrderCreated) event if the [Order](#order) is created without any errors.

This transaction will fail if:

The value of the Order (calculated as p._price * (Market’s number of Ticks - p._fxpAmount) for a sell Order and `p._price` * `p._fxpAmount` for a buy Order) is less than the minimum value for an Order, which is 10**14 attoETH.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._direction`** (string) Direction of the trade, as a hexadecimal string. ("0x0" for long or "0x1" for short.)
    * **`p._market`**  (string) Ethereum address of the Market in which to buy/sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy/sell, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to buy/sell Shares, in [attoETH](#atto-prefix), as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy the desired amount of Share Units, or number of Share Units to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Trade.publicTradeWithLimit(p)

Works like `augur.api.Trade.publicTrade`, but uses the parameter `_loopLimit` to determine how many [Fill Order](#fill-order) operations to perform. The function `augur.api.Trade.publicTrade` will do as many Fill Order operations as the amount of gas passed to it will permit, based on a hard-coded value for how much gas is needed to Fill an Order. If the gas cost drops significantly from where it is at Augur's launch, the Trade contract would require far more gas than is actually needed. Therefore, in such a scenario, `augur.api.Trade.publicTradeWithLimit` could be used instead.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._direction`** (string) Direction of the trade, as a hexadecimal string. ("0x0" for long or "0x1" for short.)
    * **`p._market`**  (string) Ethereum address of the Market in which to buy/sell Shares, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to place the Order, as a hexadecimal string.
    * **`p._fxpAmount`**  (string) Number of [Share Units](#share-unit) to buy/sell, as a hexadecimal string.
    * **`p._price`**  (string) Price at which to buy/sell Shares, in [attoETH](#atto-prefix), as a hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID of an existing Order on the Order Book with the next-best price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._worseOrderId`** (string) Order ID of an existing Order on the Order Book with the next-worse price with respect to the Order this transaction is intending to create, as a 32-byte hexadecimal value. Can be obtained by calling `augur.trading.getBetterWorseOrders`.
    * **`p._tradeGroupId`** (string) &lt;optional> ID used by the Augur UI to group transactions, as a 32-byte hexadecimal value.
    * **`p._loopLimit`** (string) Maximum number of Fill Order operations to make.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to buy the desired amount of Share Units, or number of Share Units to sell, as a hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

Trading Escape Hatch Tx API
---------------------
```javascript
// Trading Escape Hatch Transaction API Examples:

// The Ethereum address of Augur's default TradingEscapeHatch contract
// can be obtained by calling `augur.augurNode.getSyncData`.
var tradingEscapeHatch = "0x157a8998f5470a2be3917aab31d334109f56c30c";

var _market = "0x465407364ccde43ba5159537404924e86ca53aaa";
augur.api.TradingEscapeHatch.claimSharesInUpdate({
  _market: _market,
  tx: { 
    to: tradingEscapeHatch,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});

augur.api.TradingEscapeHatch.getFrozenShareValueInMarket({
  _market: _market,
  tx: { 
    to: tradingEscapeHatch,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log(result); },
  onSuccess: function (result) { console.log(result); },
  onFailed: function (result) { console.log(result); }
});
```
Provides JavaScript bindings for the [TradingEscapeHatch Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/TradingEscapeHatch.sol), which allows funds to be withdrawn from Augur in the event that Augur needs to be [halted](#developer-mode) by the development team.

### augur.api.TradingEscapeHatch.claimSharesInUpdate(p)

If Augur needs to be [halted](#developer-mode) by the development team (for example, if a vulnerability is discovered), calling this function on the specified [Market](#market) will cash out the caller's [Shares](#share) to the Market's denomination token and send the cashed-out funds to the caller's Ethereum address. (Currently, Augur only denominates Markets in [attoETH](#atto-prefix).)

This transaction will fail if:

* Augur is not in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of a Market to claim Shares from, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.TradingEscapeHatch.getFrozenShareValueInMarket(p)

If Augur needs to be [halted](#developer-mode) by the development team (for example, if a vulnerability is discovered), calling this function on the specified [Market](#market) will return the value of the user's [Shares](#share) in that Market, in the Market's denomination token. (Currently, Augur only denominates Markets in [attoETH](#atto-prefix).)

This transaction will fail if:

* Augur is not in a halted state.

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._market`**  (string) Ethereum address of a Market to claim Shares from, as a 20-byte hexadecimal value.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `true`, this function will be executed as a transaction, which will calculate the value (and thus uses gas). When set to `false`, this function will be executed as a call, which will return the value of the user's Shares in the Market, in that Market's denomination token.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the value of the user's Shares in the Market, in that Market's denomination token, as a stringified unsigned integer.

Universe Tx API
---------------------
```javascript
// Universe Transaction API Examples:

// The Ethereum contract address of Augur's current default Universe 
// can be obtained by calling `augur.augurNode.getSyncData`.
var universeAddress = "0x1f732847fbbcc46ffe859f28e916d993b2b08831";

// The cost of creating a Market (in attoETH) can be obtained by calling
// the function `augur.createMarket.getMarketCreationCost` and multiplying
// the `etherRequiredToCreateMarket` value that's returned by 10^18 .
var ethCostToCreateMarket = "0x58d15e17628000"; 
// Use the Cash contract for `p._denominationToken` when creating new Markets.
var cashAddress = "0xd2ee83a8a2a904181ccfddd8292f178614062aa0";

var _extraInfo = {
  resolutionSource: "http://www.espn.com",
  tags: ["college football", "football"],
  outcomeNames: ["Georgia", "Florida"],
  longDescription: ""
};
augur.api.Universe.createCategoricalMarket({
  _endTime: "0x5bd7e550",
  _feePerEthInWei: "0x123456",
  _denominationToken: cashAddress,
  _designatedReporterAddress: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
  _outcomes: ["outcome1","outcome2"],
  _topic: "sports",
  _description: "Who will win the University of Georgia vs. University of Florida football game in 2018?",
  _extraInfo: JSON.stringify(_extraInfo),
  tx: {
    to: universeAddress,
    value: ethCostToCreateMarket,
    gas: augur.constants.CREATE_CATEGORICAL_MARKET_GAS
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log("onSent result:", result); },
  onSuccess: function (result) {
    console.log("onSuccess result:", result);
    // Call the function `augur.createMarket.getMarketFromCreateMarketReceipt` 
    // to retrieve new Market's address
  },
  onFailed: function (result) { console.log("onFailed result:", result); },
});

var _parentPayoutNumerators = [ "0x0", "0x2710" ];
var _parentInvalid = false;
augur.api.Universe.createChildUniverse({
  _parentPayoutNumerators: _parentPayoutNumerators,
  _parentInvalid: _parentInvalid,
  tx: { 
    to: universeAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log("onSent result:", result); },
  onSuccess: function (result) { console.log("onSuccess result:", result); },
  onFailed: function (result) { console.log("onFailed result:", result); }
});

var _extraInfo = {
  resolutionSource: "https://forecast.weather.gov",
  tags: ["San Francisco", "weather"],
  longDescription: "",
  _scalarDenomination: "degrees Fahrenheit",
};
augur.api.Universe.createScalarMarket({
  _endTime: "0x5b39b150",
  _feePerEthInWei: "0x123456",
  _denominationToken: cashAddress,
  _designatedReporterAddress: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
  _minPrice: "-10",
  _maxPrice: "0x78",
  _numTicks: "0xa",
  _topic: "temperature",
  _description: "High temperature (in degrees Fahrenheit) in San Francisco, California, on July 1, 2018",
  _extraInfo: JSON.stringify(_extraInfo),
  tx: {
    to: universeAddress,
    value: ethCostToCreateMarket,
    gas: augur.constants.CREATE_SCALAR_MARKET_GAS
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log("onSent result:", result); },
  onSuccess: function (result) {
    console.log("onSuccess result:", result);
    // Call the function `augur.createMarket.getMarketFromCreateMarketReceipt` 
    // to retrieve new Market's address
  },
  onFailed: function (result) { console.log("onFailed result:", result); },
});

var _extraInfo = {
  resolutionSource: "https://www.spacex.com",
  tags: [ "SpaceX", "spaceflight" ],
  longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017."
};
augur.api.Universe.createYesNoMarket({
  _endTime: "0x5c2b1e00",
  _feePerEthInWei: "0x123456",
  _denominationToken: cashAddress,
  _designatedReporterAddress: "0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a",
  _topic: "space",
  _description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
  _extraInfo: JSON.stringify(_extraInfo),
  tx: {
    to: universeAddress,
    value: ethCostToCreateMarket,
    gas: augur.constants.CREATE_YES_NO_MARKET_GAS
  },
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log("onSent result:", result); },
  onSuccess: function (result) {
    console.log("onSuccess result:", result);
    // Call the function `augur.createMarket.getMarketFromCreateMarketReceipt` 
    // to retrieve new Market's address
  },
  onFailed: function (result) { console.log("onFailed result:", result); },
});

augur.api.Universe.getInitialReportStakeSize({ 
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, initialReportStakeSize) { 
    console.log(initialReportStakeSize); 
});
// example output:
"349680582682291667"

augur.api.Universe.getOrCacheDesignatedReportNoShowBond({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, designatedReportNoShowBond) { 
    console.log(designatedReportNoShowBond); 
});
// example output:
"349680582682291667"

augur.api.Universe.getOrCacheDesignatedReportStake({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, designatedReportStake) { 
    console.log(designatedReportStake); 
});
// example output:
"349680582682291667"

augur.api.Universe.getOrCacheMarketCreationCost({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, marketCreationCost) { 
    console.log(marketCreationCost); 
});
// example output:
"19000000000000000"

augur.api.Universe.getOrCacheReportingFeeDivisor({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, reportingFeeDivisor) { 
    console.log(reportingFeeDivisor); 
});
// example output:
"10000"

augur.api.Universe.getOrCacheValidityBond({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, validityBond) { 
    console.log(validityBond); 
});
// example output:
"10000000000000000"

augur.api.Universe.getOrCreateCurrentFeeWindow({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, currentFeeWindowAddress) { 
    console.log(currentFeeWindowAddress); 
});
// example output:
"0x90b2a6a6c5a0e7b572cc3745328a74abbfed31d0"

var _timestamp = 1401003133;
augur.api.Universe.getOrCreateFeeWindowByTimestamp({
  _timestamp: _timestamp,
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, feeWindowAddress) { 
    console.log(feeWindowAddress); 
});
// example output:
"0x90b2a6a6c5a0e7b572cc3745328a74abbfed31d0"

augur.api.Universe.getOrCreateNextFeeWindow({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, feeWindowAddress) { 
    console.log(feeWindowAddress); 
});
// example output:
"0x90b2a6a6c5a0e7b572cc3745328a74abbfed31d0"

augur.api.Universe.getOrCreatePreviousFeeWindow({
  tx: { 
    to: universeAddress,
    send: false
  }
}, function (error, feeWindowAddress) { 
    console.log(feeWindowAddress); 
});
// example output:
"0x4844c13d539fe040ded440a9f9947f14b2b4c423"

var _reportingParticipants = [ "0xd1b8f991589174315015a7a000638891ab3cd52a" ];
var _feeWindows = [ "0x59d919af0c79c2fdbb7af29627642bddbfcd2178" ];
augur.api.Universe.redeemStake({
  _reportingParticipants: _reportingParticipants,
  _feeWindows: _feeWindows,
  tx: { 
    to: universeAddress,
    gas: "0x632ea0" 
  }, 
  meta: {
    accountType: "privateKey",
    address: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Ec",
    signer: [252, 111, 32, 94, 233, 213, 105, 71, 89, 162, 243, 247, 56, 81, 213, 103, 239, 75, 212, 240, 234, 95, 8, 201, 217, 55, 225, 0, 85, 109, 158, 25],
  },
  onSent: function (result) { console.log("onSent result:", result); },
  onSuccess: function (result) { console.log("onSuccess result:", result); },
  onFailed: function (result) { console.log("onFailed result:", result); }
});
```
Provides JavaScript bindings for the [Universe Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Universe.sol), which allows for the creation of [Markets](#market) and provides functions for obtaining information about a given [Universe](#universe).

<!-- #### Notes: Transaction will fail if: the sender does not have enough ETH/REP to pay for the [Validity Bond](#validity-bond) & [No-Show Bond](#no-show-bond), `p._endTime` has already passed, `p._feesPerEthInWei` is less than 0 or greater than/equal to 0.5 ETH (5 * 10^18), `p._designatedReporterAddress` is the null address (0x0000000000000000000000000000000000000000), the length of `p._description` is not greater than 0 bytes, `value` in the `tx` object is not enough to cover the Market's Validity Bond and the estimated gas cost for the target amount of reporters to report. -->

### augur.api.Universe.createCategoricalMarket(p)

Creates a new [Categorical Market](#categorical-market). This transaction will trigger a [`MarketCreated`](#MarketCreated) event if the [Market](#market) is created successfully. After the transaction has completed successfully, the Market address can be obtained by calling `augur.createMarket.getMarketFromCreateMarketReceipt`.

This transaction will fail if:

* `p._outcomes` contains fewer than 2 outcomes or more than 8 outcomes.
* `p._designatedReporterAddress` is set to the null address.
* `p._feePerEthInWei` is greater than the maximum fee (0.5 ETH).
* `p._endTime` has already passed.
* The Universe is Forking.

NOTE: The account attempting to create the new market must have sufficient REP in order for the market to be created. This is also true when calling `eth_estimateGas`, which essentially does a trial run of the transaction to determine what the gas cost would be to actually run it. 

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p._endTime`**  (string) Unix timestamp for the [End Time](#end-time) of the [Market](#market), as a hexadecimal string.
    * **`p._feePerEthInWei`**  (string) [Creator Fee](#creator-fee) (in Wei) that is collected for every 1 Ether worth of [Shares](#share) [Settled](#settlement), as a hexadecimal string.
    * **`p._denominationToken`**  (string) Ethereum address of the token the Market is denominated in. Currently, Markets are only denominated in Ether (i.e., the [Cash](#cash) [contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol) in Augur's smart contracts), but Augur is expected to support other tokens in the future.
    * **`p._designatedReporterAddress`**  (string) Ethereum address of the [Designated Reporter](#designated-reporter).
    * **`p._outcomes`**  (Array.&lt;string>) Array of names for all possible outcomes for the Market event.
    * **`p._topic`**  (string) Market [Topic](#topic).
    * **`p._description`**  (string) Description of the Market event.
    * **`p._extraInfo`**  (string) Stringified JSON object. (See the explanation above for more details.)
        * **`p._extraInfo.resolutionSource`**  (string) Source that should be referenced when determining the [Outcome](#outcome) of a Market.
        * **`p._extraInfo.tags`**  (Array.&lt;string>) Keywords used to tag the Market (maximum of 2).
        * **`p._extraInfo.longDescription`**  (string) Additional information not included in `p._description`.
        * **`p._extraInfo.outcomeNames`**  (Array.&lt;string>) Names for possible Outcomes of the Market. (Only used when creating a [Categorical Market](#categorical-market).)
    * **`p.tx`**  (Object) Transaction object.
        * **`p.tx.to`**  (string) Ethereum address of the Universe contract to run the transaction on, as a 20-byte hexadecimal value.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to create the Market, as a hexadecimal string. This can be obtained by calling `augur.createMarket.getMarketCreationCost` and multiplying the `etherRequiredToCreateMarket` value that's returned by 10<sup>18</sup>.
        * **`p.tx.gas`**  (string) Gas limit to use when submitting this transaction, as a hexadecimal string. This can be obtained from the constant `augur.constants.CREATE_CATEGORICAL_MARKET_GAS`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, `augur.createMarket.getMarketFromCreateMarketReceipt` can be called from within the `onSuccess` callback to retrieve the Ethereum address of the newly-created Market. (See example code.)

### augur.api.Universe.createChildUniverse(p)

Creates a new [Child Universe](#child-universe) (if it does not already exist) with the given [Payout Set](#payout-set) `p._parentPayoutNumerators` and `p._parentInvalid`. This transaction will trigger a [`UniverseCreated`](#UniverseCreated) event if the Child Universe has not been created yet.

This transaction will fail if:

* The Universe does not have a [Forked Market](#forked-market).
* `p._parentInvalid` is true and the Numerators in `p._parentPayoutNumerators` are not all the same value. (For information about what the Payout Set should look like for an Invalid [Market](#market), refer to the [Invalid Outcome glossary entry](#invalid-outcome).)

#### **Parameters:**

* **`p`** (Object) Parameters object.
    * **`p._parentPayoutNumerators`**  (Array.&lt;number>) Payout Set of the Parent Universe's Parent Universe's Forked Market.
    * **`p._parentInvalid`**  (boolean) Whether the Parent Universe's Forked Market is [Invalid](#invalid-outcome).
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.

### augur.api.Universe.createScalarMarket(p)

Creates a new [Scalar Market](#scalar-market). This transaction will trigger a [`MarketCreated`](#MarketCreated) event if the [Market](#market) is created successfully. After the transaction has completed successfully, the Market address can be obtained by calling `augur.createMarket.getMarketFromCreateMarketReceipt`.

This transaction will fail if:

* `p._designatedReporterAddress` is set to the null address.
* `p._numTicks` is less than 2.
* `p._feePerEthInWei` is greater than the maximum fee (0.5 ETH).
* `p._endTime` has already passed.
* The Universe is Forking.

NOTE: The account attempting to create the new market must have sufficient REP in order for the market to be created. This is also true when calling `eth_estimateGas`, which essentially does a trial run of the transaction to determine what the gas cost would be to actually run it. 

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p._endTime`**  (string) Unix timestamp for the [End Time](#end-time) of the [Market](#market), as a hexadecimal string.
    * **`p._feePerEthInWei`**  (string) [Creator Fee](#creator-fee) (in [attoETH](atto-prefix)) that is collected for every 1 Ether worth of [Shares](#share) [Settled](#settlement).
    * **`p._denominationToken`**  (string) Ethereum address of the token the Market is denominated in. Currently, Markets are only denominated in Ether (i.e., the [Cash](#cash) [contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol) in Augur's smart contracts), but Augur is expected to support other tokens in the future.
    * **`p._designatedReporterAddress`**  (string) Ethereum address of the [Designated Reporter](#designated-reporter).
    * **`p._minPrice`**  (string) [Minimum Display Price](#minimum-display-price) for the Market, as a hexadecimal string.
    * **`p._maxPrice`**  (string) [Maximum Display Price](#maximum-display-price) for the Market, as a hexadecimal string.
    * **`p._numTicks`**  (string) [Number of Ticks](#number-of-ticks) for the Market, as a hexadecimal string.
    * **`p._topic`**  (string) Market [Topic](#topic).
    * **`p._description`**  (string) Description of the Market event.
    * **`p._extraInfo`**  (string) Stringified JSON object. (See the explanation above for more details.)
        * **`p._extraInfo.resolutionSource`**  (string) Source that should be referenced when determining the [Outcome](#outcome) of a Market.
        * **`p._extraInfo.tags`**  (Array.&lt;string>) Keywords used to tag the Market (maximum of 2).
        * **`p._extraInfo.longDescription`**  (string) Additional information not included in `p._description`.
    * **`p.tx`**  (Object) Transaction object.
        * **`p.tx.to`**  (string) Ethereum address of the Universe contract to run the transaction on, as a 20-byte hexadecimal value.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to create the Market, as a hexadecimal string. This can be obtained by calling `augur.createMarket.getMarketCreationCost` and multiplying the `etherRequiredToCreateMarket` value that's returned by 10<sup>18</sup>.
        * **`p.tx.gas`**  (string) Gas limit to use when submitting this transaction, as a hexadecimal string. This can be obtained from the constant `augur.constants.CREATE_SCALAR_MARKET_GAS`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, `augur.createMarket.getMarketFromCreateMarketReceipt` can be called from within the `onSuccess` callback to retrieve the Ethereum address of the newly-created Market.

### augur.api.Universe.createYesNoMarket(p)

Creates a new [Yes/No Market](#yes-no-market). This transaction will trigger a [`MarketCreated`](#MarketCreated) event if the [Market](#market) is created successfully. After the transaction has completed successfully, the Market address can be obtained by calling `augur.createMarket.getMarketFromCreateMarketReceipt`.

This transaction will fail if:

* `p._outcomes` contains fewer than 2 outcomes or more than 8 outcomes.
* `p._designatedReporterAddress` is set to the null address.
* `p._feePerEthInWei` is greater than the maximum fee (0.5 ETH).
* `p._endTime` has already passed.
* The Universe is Forking.

NOTE: The account attempting to create the new market must have sufficient REP in order for the market to be created. This is also true when calling `eth_estimateGas`, which essentially does a trial run of the transaction to determine what the gas cost would be to actually run it. 

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p._endTime`**  (string) Unix timestamp for the [End Time](#end-time) of the [Market](#market), as a hexadecimal string.
    * **`p._feePerEthInWei`**  (string) [Creator Fee](#creator-fee) (in Wei) that is collected for every 1 Ether worth of [Shares](#share) [Settled](#settlement), as a hexadecimal string.
    * **`p._denominationToken`**  (string) Ethereum address of the token the Market is denominated in. Currently, Markets are only denominated in Ether (i.e., the [Cash](#cash) [contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol) in Augur's smart contracts), but Augur is expected to support other tokens in the future.
    * **`p._designatedReporterAddress`**  (string) Ethereum address of the [Designated Reporter](#designated-reporter).
    * **`p._topic`**  (string) Market [Topic](#topic).
    * **`p._description`**  (string) Description of the Market event.
    * **`p._extraInfo`**  (string) Stringified JSON object containing the following keys:
        * **`p._extraInfo.resolutionSource`**  (string) Source that should be referenced when determining the [Outcome](#outcome) of a Market.
        * **`p._extraInfo.tags`**  (Array.&lt;string>) Keywords used to tag the Market (maximum of 2).
        * **`p._extraInfo.longDescription`**  (string) Additional information not included in `p._description`.
    * **`p.tx`**  (Object) Transaction object.
        * **`p.tx.to`**  (string) Ethereum address of the Universe contract to run the transaction on, as a 20-byte hexadecimal value.
        * **`p.tx.value`**  (string) Number of [attoETH](atto-prefix) required to create the Market, as a hexadecimal string. This can be obtained by calling `augur.createMarket.getMarketCreationCost` and multiplying the `etherRequiredToCreateMarket` value that's returned by 10<sup>18</sup>.
        * **`p.tx.gas`**  (string) Gas limit to use when submitting this transaction, as a hexadecimal string. This can be obtained from the constant `augur.constants.CREATE_YES_NO_MARKET_GAS`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.    
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, `augur.createMarket.getMarketFromCreateMarketReceipt` can be called from within the `onSuccess` callback to retrieve the Ethereum address of the newly-created Market. (See example code.)

### augur.api.Universe.getInitialReportStakeSize(p, callback)

Returns either the size of the [No-Show Bond](#no-show-bond) or the size of the Stake placed on the [Designated Report](#designated-report) (whichever is greater).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `true`, this function will be executed as a transaction, which will calculate the value (and thus uses gas). When set to `false`, this function will be executed as a call, which will return the [Initial Report](#initial-report) Stake size and will not use any gas. 
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will be executed as a call and will return the Initial Report Stake size, in attoREP, as a stringified unsigned integer.

### augur.api.Universe.getOrCacheDesignatedReportNoShowBond(p)

Gets the [No-Show Bond](#no-show-bond) for [Markets](#market) in the specified [Universe](#universe). If the value of the No-Show Bond for the current [Fee Window](#fee-window) has not already been cached in the Universe contract, this function will cache it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the cached value for the No-Show Bond, in [attoREP](#atto-prefix), as a stringified unsigned integer.

### augur.api.Universe.getOrCacheDesignatedReportStake(p)

Gets the amount of Staked [REP](#rep) the [Designated Reporter](#designated-reporter) must put up when submitting a [Designated Report](#designated-report) in the [Universe](#universe). If this value for the current [Fee Window](#fee-window) has not already been cached in the Universe contract, this function will cache it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the cached amount of REP the Designated Reporter must Stake when submitting a Designated Report, in [attoREP](#atto-prefix), as a stringified unsigned integer.

### augur.api.Universe.getOrCacheMarketCreationCost(p)

Gets the estimated amount of [attoETH](#atto-prefix) required to create a [Market](#market) in the specified [Universe](#universe). The amount returned by this function is equivalent to the value returned by the transaction `augur.api.Universe.getOrCacheValidityBond`. If the value of the [Validity Bond](#validity-bond) for the current [Fee Window](#fee-window) has not already been cached in the Universe contract, this function will cache it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the estimated amount of [attoETH](#atto-prefix) required to create a Market, as a stringified unsigned integer.

### augur.api.Universe.getOrCacheReportingFeeDivisor(p)

Gets the number by which the total payout amount for a [Market](#market) is divided in order to calculate the [Reporting Fee](#reporting-fee). If this value for the current [Fee Window](#fee-window) has not already been cached in the Universe contract, this function will cache it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the number by which the total payout amount for a Market is divided in order to calculate the Reporting Fee, as a stringified unsigned integer.

### augur.api.Universe.getOrCacheValidityBond(p)

Gets the amount the [Market Creator](#market-creator) must pay for the [Validity Bond](#validity-bond) when creating a [Market](#market). If the Validity Bond for the current [Fee Window](#fee-window) has not already been cached in the Universe contract, this function will cache it. (This amount will be refunded to the Market Creator if the [Final Outcome](#final-outcome) of the Market is not invalid.)

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the number of [attoETH](#atto-prefix) the Market Creator must pay for the Validity Bond when creating a Market, as a stringified unsigned integer.

### augur.api.Universe.getOrCreateCurrentFeeWindow(p)

Gets the Ethereum contract address of the [Fee Window](#fee-window) that is currently active in the specified [Universe](#universe). If the contract address for the Fee Window does not exist yet, this function will create it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the Ethereum contract address of the Fee Window that is currently active in the specified Universe, as a 20-byte hexadecimal string.

### augur.api.Universe.getOrCreateFeeWindowByTimestamp(p)

Gets the Ethereum contract address of the active [Fee Window](#fee-window) at the specified Unix timestamp in a given [Universe](#universe). If the Ethereum contract address for the Fee Window does not already exist, this function will create it. This transaction will trigger a [`FeeWindowCreated`](#FeeWindowCreated) event if the Fee Window is created without any errors.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p._timestamp`**  (string) Unix timestamp that falls within the desired Fee Window, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the Ethereum contract address of the Fee Window for the specified timestamp, as a 20-byte hexadecimal string.

### augur.api.Universe.getOrCreateNextFeeWindow(p)

Gets the Ethereum contract address of the [Fee Window](#fee-window) that will be active after the current Fee Window ends in the specified [Universe](#universe). If the contract address for the Fee Window does not exist yet, this function will create it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the Ethereum contract address of the Fee Window that will be active after the current Fee Window ends in the specified Universe, as a 20-byte hexadecimal string.

### augur.api.Universe.getOrCreatePreviousFeeWindow(p)

Gets the Ethereum contract address of the [Fee Window](#fee-window) that was active just before the current Fee Window in the specified [Universe](#universe). If the contract address for the Fee Window does not exist yet, this function will create it.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.send`** (boolean) &lt;optional> Whether this function should be executed as a transaction. When set to `false`, this function will be executed as a call, which will simply return the last value that was cached (and will not use any gas). When set to `true`, this function will be executed as a transaction, which will use gas to re-calculate the value and cache it. (However, the return value will not be [obtainable](#transaction-return-values).)
        * **`p.tx.gas`** (string) &lt;optional> Gas limit to use when submitting this transaction, as a hexadecimal string. This does not need to be set if `p.tx.send` is `false`.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* (null|string) Return value cannot be obtained when executed as a transaction because Ethereum nodes [discard](#transaction-return-values) transaction return values. However, if `p.tx.send` is set to `false`, this function will return the Ethereum contract address of the Fee Window that was active just before the current Fee Window in the specified Universe, as a 20-byte hexadecimal string.

### augur.api.Universe.redeemStake(p)

Calls the `redeem` function for all Ethereum contract addresses in the arrays `p._reportingParticipants` and `p._feeWindows` using the caller's Ethereum address as the redeemer. `p._reportingParticipants` can contain Ethereum contract addresses for [DisputeCrowdsourcers](#dispute-crowdsourcer-tx-api), [InitialReporters](#initial-reporter-tx-api), or both, as hexadecimal strings. `p._feeWindows` can only contain the Ethereum contract addresses of [Fee Windows](#fee-window). This function is intended as easy way to redeem Staked REP and/or Ether in multiple [Dispute Crowdsourcers](#dispute-crowdsourcer), [Initial Reports](#initial-report), and Fee Windows at once.

#### Parameters:

* **`p`** (Object) Parameters object.
    * **`p._reportingParticipants`**  (Array.&lt;string>) Ethereum contract addresses of DisputeCrowdsourcers and/or InitialReporters, as 20-byte hexadecimal values.
    * **`p._feeWindows`**  (Array.&lt;string>) Ethereum contract addresses of FeeWindows, as 20-byte hexadecimal values.
    * **`p.tx`** (Object) Object containing details about how this transaction should be made.
        * **`p.tx.to`** (string) Ethereum contract address on which to call this function, as a 20-byte hexadecimal string.
        * **`p.tx.gas`** (string) Gas limit to use when submitting this transaction, as a hexadecimal string.
    * **`p.meta`**  (<a href="#Meta">Meta</a>) &lt;optional> Authentication metadata for raw transactions.
    * **`p.onSent`**  (function) Callback function that executes once the transaction has been sent.
    * **`p.onSuccess`**  (function) &lt;optional> Callback function that executes if the transaction returned successfully.
    * **`p.onFailed`**  (function) &lt;optional> Callback function that executes if the transaction failed.

#### **Returns:**

* Return value cannot be obtained because Ethereum nodes [discard](#transaction-return-values) transaction return values.