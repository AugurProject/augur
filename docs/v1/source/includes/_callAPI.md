Call API
========
```javascript
// Call API Example
/**
* Get the Number of Outcomes for the Market at address:
* 0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42
*/

var market = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";

// augur.api.<Contract Name>.<Contract Method>(<Params Object>, <Callback Function>);

augur.api.Market.getNumberOfOutcomes({ 
  tx: { to: market } 
}, function (error, numberOfOutcomes) {
  console.log(error);
  console.log(numberOfOutcomes);
});
// console prints 2
```
The Call API of augur.js is made up of "getter" functions that retrieve information from Augur's Solidity smart contracts using Ethereum's `eth_call` RPC; however, these functions do not write any information to the Ethereum blockchain. The Call API is intended for more granular "gets" than the [Simplified API](#simplified-api) allows, and its functions are mapped directly to the public functions of Augur's Solidity smart contracts. 

All functions in the Call API accept two arguments: 

1. `p`, a parameters object containing any key/value pairs matching the input parameters for the contract method, and (in some cases) a `tx` object with the Ethereum contract address to call. The `tx` object is described in more detail in the [Transaction API](#transaction-api) section. 
2. A callback function. 

The Call API functions are part of the `augur.api` object and follow a pattern of `augur.api.<Contract Name>.<Contract Function>(<Parameters Object>, <Callback Function>)`.

<aside class="notice">Augur's Call API has been updated to return promises. Passing in a callback still works the same as before; however, now the underlying promise is returned directly to the caller.</aside>

Augur Call API
---------------------------
```javascript
augur.api.Augur.isKnownCrowdsourcer({ 
  _universe: "0x3336eaefcfaf7ea1e17c4768a554d57800699555"
}, function (error, isKnownCrowdsourcer) { 
  console.log(isKnownCrowdsourcer); 
});
// example output:
true

augur.api.Augur.isKnownUniverse({ 
  _universe: "0x22d6eaefcfaf7ea1e17c4768a554d57800699ecc"
}, function (error, isKnownUniverse) { 
  console.log(isKnownUniverse); 
});
// example output:
true
```
Provides JavaScript bindings for the [Augur Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/Augur.sol), which handles [Universe](#universe) creation and event logging.

### augur.api.Augur.isKnownCrowdsourcer(p, callback)

Augur keeps track of its [Crowdsourcers](#crowdsourcer) internally. This function returns whether the specified Crowdsourcer is a contract address that is known to Augur.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
  * **`p._crowdsourcer`** (string) Crowdsourcer contract address, as a 20-byte hexadecimal value.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the specified Crowdsourcer is in Augur's list of known Crowdsoucers, or `false` otherwise.

### augur.api.Augur.isKnownUniverse(p, callback)

Augur keeps track of its [Genesis Universes](#genesis-universe) and all [Child Universes](#child-universe) internally. This function returns whether the specified [Universe](#universe) is a Universe contract address that is known to Augur.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
  * **`p._universe`** (string) Universe contract address, as a 20-byte hexadecimal value.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the specified Universe is in Augur's list of known Universe, or `false` otherwise.

Cash Call API
---------------
```javascript
// Cash Call API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";

augur.api.Cash.allowance({
  _owner: "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb",
  _spender: _augurContractAddress,
}, function(error, allowance) {
  console.log(allowance); 
});
// example output:
"115792089237316195423570985008687907853269984665640564039457584007913129639935"
```
Provides JavaScript bindings for the [Cash Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol), which is used internally by Augur as an ERC-20 wrapper for ETH.

### augur.api.Cash.allowance(p, callback)

Returns the amount of [attoCash](#atto-prefix) that a given Ethereum contract is allowed to spend on behalf of a particular user.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._owner`** (string) Ethereum address of the owner of the [Cash](#cash), as a 20-byte hexadecimal value.
    * **`p._spender`** (string) Ethereum address of the contract allowed to spend on behalf of `p._owner`, as a 20-byte hexadecimal string. (This should be the address of the Augur.sol contract.)
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

(string) Amount of attoCash the contract is allowed to spend on behalf of the specified user.

Claim Trading Proceeds Call API
---------------
```javascript
// Claim Trading Proceeds Call API Examples:
var _market = "0xc4ba20cbafe3a3655a2f2e4df4ac7f942a722017";

augur.api.ClaimTradingProceeds.calculateCreatorFee({
  _market: _market,
  _amount: "0xc3280e4b4b",
}, function(error, creatorFee) {
  console.log(creatorFee); 
});
// example output:
"1"

augur.api.ClaimTradingProceeds.calculateProceeds({
  _market: _market,
  _outcome: "0x0",
  _numberOfShares: "0x2b5e3af16b1880000"
}, function(error, proceeds) {
  console.log(proceeds); 
});
// example output:
"122"
```
Provides JavaScript bindings for the [ClaimTradingProceeds Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/ClaimTradingProceeds.sol), which allows profits earned from trading to be claimed.

### augur.api.ClaimTradingProceeds.calculateCreatorFee(p, callback)

Calculates the [Creator Fee](#creator-fee) that will be paid when settling a specific number of [Shares](#share) in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._market`** (string) Ethereum address of the Market in which to calculate the Creator Fee, as a 20-byte hexadecimal value.
    * **`p._amount`** (string) Number of [Share Units](#share-unit), as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Creator Fee, in attoETH, as a stringified unsigned integer.

### augur.api.ClaimTradingProceeds.calculateProceeds(p, callback)

Calculates the amount of [attoETH](#atto-prefix) that a number of [Shares](#share) in a particular [Outcome](#outcome) of a given [Market](#market) are worth. (NOTE: This calculation does not deduct [Reporting Fees](#reporting-fee).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._market`** (string) Ethereum address of the Market in which to calculate trading proceeds, as a 20-byte hexadecimal value.
    * **`p._outcome`** (string) Outcome for which to calculate trading proceeds, as a hexadecimal string.
    * **`p._numberOfShares`** (string) Quantity of [Share Units](#share-unit) for which to calculate trading proceeds, as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of attoETH that a number of Shares in a particular Outcome of a given Market are worth, as a stringified unsigned integer.

Controller Call API
---------------
```javascript
// Controller Contract Call API Examples:
augur.api.Controller.getTimestamp({
}, function (error, timestamp) { 
  console.log(timestamp); 
});
// example output:
"1516744206"
```
Provides JavaScript bindings for the [Controller Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/Controller.sol), which is used to manage whitelisting of contracts and and [halt](#developer-mode) the normal use of Augur’s contracts (e.g., if there is a vulnerability found in Augur). From a developer standpoint, it can be used to get Augur's internal timestamp.

### augur.api.Controller.getTimestamp(p, callback)

Returns Augur's internal Unix timestamp.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Augur's internal Unix timestamp, as a stringified unsigned integer.

Dispute Crowdsourcer Call API
-------------------------
```javascript
// Dispute Crowdsourcer Contract Call API Examples:

// Dispute Crowdsourcer contract addresses for a Market can be 
// obtained by calling `augur.api.Market.getReportingParticipant` 
// or `augur.api.Market.derivePayoutDistributionHash`, followed 
// by `augur.api.Market.getCrowdsourcer`.
var disputeCrowdsourcer = "0xafa6eaefcfaf7ea1e17c4768a554d57800699ec5";

augur.api.DisputeCrowdsourcer.getFeeWindow({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.DisputeCrowdsourcer.getMarket({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, market) { 
  console.log(market); 
});
// example output:
"0xaa90cc6b4e89303e451c9b852827b5791667f5aa"

augur.api.DisputeCrowdsourcer.getPayoutDistributionHash({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, payoutDistributionHash) { 
  console.log(payoutDistributionHash); 
});
// example output:
"0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a"

augur.api.DisputeCrowdsourcer.getPayoutNumerator({ 
  _outcome: "0x0",
  tx: { to: disputeCrowdsourcer }, 
}, function (error, payoutNumerator) { 
  console.log(payoutNumerator); 
});
// example output:
"1000"

augur.api.DisputeCrowdsourcer.getReputationToken({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, reputationToken) { 
  console.log(reputationToken); 
});
// example output:
"0xff90cc6b4e89303e451c9b852827b5791667f5ff"

augur.api.DisputeCrowdsourcer.getSize({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, size) { 
  console.log(size); 
});
// example output:
"174435000000000000"

augur.api.DisputeCrowdsourcer.getStake({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, stake) { 
  console.log(stake); 
});
// example output:
"78123523"

augur.api.DisputeCrowdsourcer.isDisavowed({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, isDisavowed) { 
  console.log(isDisavowed); 
});
// example output:
true

augur.api.DisputeCrowdsourcer.isInvalid({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, isInvalid) { 
  console.log(isInvalid); 
});
// example output:
true
```
Provides JavaScript bindings for the [DisputeCrowdsourcer Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/DisputeCrowdsourcer.sol), which allows users to [Stake](#dispute-stake) and redeem [REP](#rep) on [Outcomes](#outcome) other than a [Market's](#market) [Tentative Outcome](#tentative-outcome).

### augur.api.DisputeCrowdsourcer.getFeeWindow(p, callback)

Gets the [Fee Window](#fee-window) to which a [Dispute Crowdsourcer](#crowdsourcer) belongs.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  Ethereum contract address of the Dispute Crowdsourcer's Fee Window, as a 20-byte hexadecimal string.

### augur.api.DisputeCrowdsourcer.getMarket(p, callback)

Gets the [Market](#market) to which a [Dispute Crowdsourcer](#crowdsourcer) belongs.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  Ethereum contract address of the Dispute Crowdsourcer's Market, as a 20-byte hexadecimal string.

### augur.api.DisputeCrowdsourcer.getPayoutDistributionHash(p, callback)

Gets the [Payout Distribution Hash](#payout-distribution-hash) for a [Dispute Crowdsourcer](#crowdsourcer).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  Payout Distribution Hash for the Dispute Crowdsourcer, as a 32-byte hexadecimal string.

### augur.api.DisputeCrowdsourcer.getPayoutNumerator(p, callback)

Gets the [Payout Numerator](#payout-set) of a given [Outcome](#outcome) for a [Dispute Crowdsourcer](#crowdsourcer).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._outcome`** (string) Outcome for which to get the Payout Numerator, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  Payout Numerator for the Dispute Crowdsourcer, as a stringified unsigned integer.

### augur.api.DisputeCrowdsourcer.getReputationToken(p, callback)

Gets the [Reputation Token](#reputation-token) in which a [Dispute Crowdsourcer](#crowdsourcer) is denominated.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  Ethereum contract address of the Dispute Crowdsourcer's Reputation Token, as a 20-byte hexadecimal string.

### augur.api.DisputeCrowdsourcer.getSize(p, callback)

Gets the total amount of [attoREP](#atto-prefix) that must to be [Staked](#dispute-stake) on a [Dispute Crowdsourcer's](#crowdsourcer) [Outcome](#outcome) in order to [Challenge](#challenge) the [Tentative Outcome](#tentative-outcome) of its [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  attoREP required by the Dispute Crowdsourcer to Challenge the Tentative Outcome of its Market, as a stringified unsigned integer.

### augur.api.DisputeCrowdsourcer.getStake(p, callback)

Gets the amount of [attoREP](#atto-prefix) that has been [Staked](#dispute-stake) on a [Dispute Crowdsourcer](#crowdsourcer).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string)  attoREP Staked on the Dispute Crowdsourcer, as a stringified unsigned integer.

### augur.api.DisputeCrowdsourcer.isDisavowed(p, callback)

Returns whether a [Dispute Crowdsourcer](#crowdsourcer) has been "disavowed". A disavowed Dispute Crowdsourcer is one from which [Staked](#dispute-stake) [REP](#rep) and/or [Reporting Fees](#reporting-fee) can be redeemed (by calling `augur.api.DisputeCrowdsourcer.redeem`) and whose [Market](#market) has not necessarily been [Finalized](#finalized-market). A Dispute Crowdsourcer can become disavowed if any of the following occurs:

1. Another Dispute Crowdsourcer belonging to the same Market and in the same [Fee Window](#fee-window) successfully fills its [Dispute Bond](#dispute-bond).
2. A Market other than the Dispute Crowdsourcer's Market causes a [Fork](#fork), and `augur.api.Market.disavowCrowdsourcers` is called on the Dispute Crowdsourcer's Market.
3. The Dispute Crowdsourcer's Market Forks, and `augur.api.DisputeCrowdsourcer.fork` is called on the Dispute Crowdsourcer.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Dispute Crowdsourcer has been disavowed, or `false` otherwise.

### augur.api.DisputeCrowdsourcer.isInvalid(p, callback)

Returns whether a [Dispute Crowdsourcer](#crowdsourcer) represents the [Invalid Outcome](#invalid-outcome) for its [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Dispute Crowdsourcer on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean)  `true` if the Dispute Crowdsourcer represents the Invalid Outcome for its Market, or `false` otherwise.

Fee Window Call API
-------------------------
```javascript
// Fee Window Contract Call API Examples:

// Fee Window contract addresses can be obtained using a variety of Call API functions, 
// including `augur.api.Universe.getCurrentFeeWindow` and `augur.api.Universe.getFeeWindowByTimestamp`.
var feeWindow = "0x37a809f8139e5637fd94c7d34912cb15c6496111";

augur.api.FeeWindow.getEndTime({ 
  tx: { to: feeWindow } 
}, function (error, endTime) { 
  console.log(endTime); 
});
// example output:
"1517443200"

augur.api.FeeWindow.getNumDesignatedReportNoShows({ 
  tx: { to: feeWindow } 
}, function (error, numDesignatedReportNoShows) { 
  console.log(numDesignatedReportNoShows); 
});
// example output:
"2"

augur.api.FeeWindow.getNumIncorrectDesignatedReportMarkets({ 
  tx: { to: feeWindow } 
}, function (error, numIncorrectDesignatedReportMarkets) { 
  console.log(numIncorrectDesignatedReportMarkets); 
});
// example output:
"10"

augur.api.FeeWindow.getNumInvalidMarkets({ 
  tx: { to: feeWindow } 
}, function (error, numInvalidMarkets) { 
  console.log(numInvalidMarkets); 
});
// example output:
"3"

augur.api.FeeWindow.getNumMarkets({ 
  tx: { to: feeWindow } 
}, function (error, numMarkets) { 
  console.log(numMarkets); 
});
// example output:
"65"

augur.api.FeeWindow.getReputationToken({ 
  tx: { to: feeWindow } 
}, function (error, reputationToken) { 
  console.log(reputationToken); 
});
// example output:
"0x2a73cec0b62fcb8c3120bc80bdb2b1351c8c2d1e"

augur.api.FeeWindow.getStartTime({ 
  tx: { to: feeWindow } 
}, function (error, startTime) { 
  console.log(startTime); 
});
// example output:
"1516838400"

augur.api.FeeWindow.getUniverse({ 
  tx: { to: feeWindow } 
}, function (error, universe) { 
  console.log(universe); 
});
// example output:
"0x0920d1513057572be46580b7ef75d1d01a99a3e5"

augur.api.FeeWindow.isActive({ 
  tx: { to: feeWindow } 
}, function (error, isActive) { 
  console.log(isActive); 
});
// example output:
true

augur.api.FeeWindow.isOver({ 
  tx: { to: feeWindow } 
}, function (error, isOver) { 
  console.log(isOver); 
});
// example output:
false
```
Provides JavaScript bindings for the [FeeWindow Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/FeeWindow.sol), which allows for the buying and redeeming of [Participation Tokens](#participation-token).

### augur.api.FeeWindow.getEndTime(p, callback)

Returns a Unix timestamp for when the specified [Fee Window](#fee-window) will end. A Fee Window is considered active for a total of 7 days, then ends, and is no longer considered to be active.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp at which the Fee Window ends, as a stringified unsigned integer.

### augur.api.FeeWindow.getNumDesignatedReportNoShows(p, callback)

Returns the number of [Markets](#market) belonging to the specified [Fee Window](#fee-window), in which the [Designated Reporter](#designated-reporter) failed to [Report](#report) during the [Designated Reporting Phase](#designated-reporting-phase). These Markets will have a [No-Show Bond](#no-show-bond) up for grabs for the [First Public Reporter](#first-public-reporter) because these Markets have yet to receive a [Report](#report). This only includes Markets where Designated Reporters failed to Report, and does not include Markets where the Designated Reporter's [Tentative Outcome](#tentative-outcome) was [Challenged](#challenge).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Markets belonging to the Fee Window, where the Designated Reporter failed to Report during the Designated Reporting Phase, as a stringified unsigned integer.

### augur.api.FeeWindow.getNumIncorrectDesignatedReportMarkets(p, callback)

Returns the number of [Unfinalized Markets](#finalized-market) belonging to the specified [Fee Window](#fee-window) in which [Designated Reporter's](#designated-reporter) [Tentative Outcome](#tentative-outcome) was [Challenged](#challenge) during the current [Dispute Round Phase](#dispute-round-phase), or the [Designated Reporter](#designated-reporter) failed to submit a [Designated Report](#designated-report).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Markets in the Fee Window, where the Designated Report was Challenged in the current Dispute Round Phase or the Designated Reporter did not Report, as a stringified unsigned integer.

### augur.api.FeeWindow.getNumInvalidMarkets(p, callback)

Returns the number of [Markets](#market) that were [Reported](#report) to be [Invalid](#invalid-outcome) during the specified [Fee Window](#fee-window). [Invalid](#invalid-outcome) Markets are Markets that aren't clearly defined or do not fit one of the [Outcomes](#outcome) set for this Market. [Reporters](#reporter) are encouraged to [Report](#report) the Market as Invalid if they can't confidently Stake their [REP](#rep) into a single Outcome for the Market.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Markets Reported as Invalid in the Fee Window, as a stringified unsigned integer.

### augur.api.FeeWindow.getNumMarkets(p, callback)

Returns the total number of [Markets](#market) that are in the [Dispute Round Phase](#dispute-round-phase) for the specified [Fee Window](#fee-window).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Markets in the Dispute Round Phase for the Fee Window, as a stringified unsigned integer.

### augur.api.FeeWindow.getReputationToken(p, callback)

Returns the [Reputation Token (REP)](#rep) used by the specified [Fee Window](#fee-window). Every Fee Window has a [Dispute Phase](#dispute-phase) where [Reporters](#reporter) can [Challenge](#challenge) the [Tentative Outcome](#tentative-outcome) of [Markets](#market). In order to Challenge a Tentative Outcome, Reporters need to [Stake](#dispute-stake) REP. A Fee Window only accepts one REP contract as the source of Staked REP, and this function returns that contract's address.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Reputation Token used by the Fee Window, as a 20-byte hexadecimal string.

### augur.api.FeeWindow.getStartTime(p, callback)

Returns a Unix timestamp of when a [Fee Window](#fee-window) becomes active and starts. A Fee Window is considered active for a total of 7 days, then ends, and is no longer considered to be active. Only active Fee Windows allow [Reporters](#reporter) to [Challenge](#challenge) the [Tentative Outcomes](#tentative-outcome) of [Markets](#market) contained in the Fee Window.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp at which the Fee Window starts, as a stringified unsigned integer.

### augur.api.FeeWindow.getUniverse(p, callback)

Returns the [Universe](#universe) to which the specified [Fee Window](#fee-window) belongs. Every Fee Window belongs to a specific Universe in which they were created and can operate.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Universe to which the Fee Window belongs, as a 20-byte hexadecimal string.

### augur.api.FeeWindow.isActive(p, callback)

Returns whether the specified [Fee Window](#fee-window) is currently active. Fee Windows are considered active during the Window's [Dispute Round Phase](#dispute-round-phase), which last a total of 7 days. 

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* `true` if the specified Fee Window is active, or `false` otherwise.

### augur.api.FeeWindow.isOver(p, callback)

Returns whether the 7-day [Fee Window](#fee-window) specified has ended.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Fee Window on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Fee Window has ended, or `false` otherwise.

Initial Reporter Call API
-------------------------
```javascript
// Initial Reporter Contract Call API Examples:

// The Ethereum address of a Market's InitialReporter contract 
// can be obtained by calling `augur.api.Market.getInitialReporter`.
var initialReporter = "0xbcb6eaefcfaf7ea1e17c4768a554d57800699ed3";

augur.api.InitialReporter.designatedReporterShowed({ 
  tx: { to: initialReporter } 
}, function (error, designatedReporterShowed) { 
  console.log(designatedReporterShowed); 
});
// example output:
true

augur.api.InitialReporter.designatedReporterWasCorrect({ 
  tx: { to: initialReporter } 
}, function (error, designatedReporterWasCorrect) { 
  console.log(designatedReporterWasCorrect); 
});
// example output:
true

augur.api.InitialReporter.getDesignatedReporter({ 
  tx: { to: initialReporter } 
}, function (error, designatedReporter) { 
  console.log(designatedReporter); 
});
// example output:
"0xca3edca4ed326bbcb77e914b379913b12d49654d"

augur.api.InitialReporter.getFeeWindow({ 
  tx: { to: initialReporter } 
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.InitialReporter.getMarket({ 
  tx: { to: initialReporter } 
}, function (error, market) { 
  console.log(market); 
});
// example output:
"0xaa90cc6b4e89303e451c9b852827b5791667f5aa"

augur.api.InitialReporter.getPayoutDistributionHash({ 
  tx: { to: disputeCrowdsourcer } 
}, function (error, payoutDistributionHash) { 
  console.log(payoutDistributionHash); 
});
// example output:
"0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a"

augur.api.InitialReporter.getPayoutNumerator({ 
  _outcome: "0x0",
  tx: { to: initialReporter }, 
}, function (error, payoutNumerator) { 
  console.log(payoutNumerator); 
});
// example output:
"1000"

augur.api.InitialReporter.getReportTimestamp({ 
  tx: { to: initialReporter } 
}, function (error, reportTimestamp) { 
  console.log(reportTimestamp); 
});
// example output:
"1514956848"

augur.api.InitialReporter.getReputationToken({ 
  tx: { to: initialReporter } 
}, function (error, reputationToken) { 
  console.log(reputationToken); 
});
// example output:
"0x2a73cec0b62fcb8c3120bc80bdb2b1351c8c2d1e"

augur.api.InitialReporter.getSize({ 
  tx: { to: initialReporter } 
}, function (error, size) { 
  console.log(size); 
});
// example output:
"87443500000000000"

augur.api.InitialReporter.getStake({ 
  tx: { to: initialReporter } 
}, function (error, stake) { 
  console.log(stake); 
});
// example output:
"78000"

augur.api.InitialReporter.isInvalid({ 
  tx: { to: initialReporter } 
}, function (error, isInvalid) { 
  console.log(isInvalid); 
});
// example output:
true
```
Provides JavaScript bindings for the [InitialReporter Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/InitialReporter.sol), which enables functionality related to [Initial Reports](#initial-report).

### augur.api.InitialReporter.designatedReporterShowed(p, callback)

Returns whether the [Designated Reporter](#designated-reporter) submitted a [Report](#report) within the [Designated Reporting Phase](#designated-reporting-phase).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Designated Reporter submitted a Report within the Designated Reporting Phase, or `false` otherwise.

### augur.api.InitialReporter.designatedReporterWasCorrect(p, callback)

Returns whether the [Payout Distribution Hash](#payout-distribution-hash) submitted in the [Designated Report](#designated-report) is the same as the winning Payout Distribution Hash for the InitialReporter contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Payout Distribution Hash submitted in the Designated Report is the same as the winning Payout Distribution Hash for the InitialReporter contract, or `false` otherwise.

### augur.api.InitialReporter.getDesignatedReporter(p, callback)

Returns the Ethereum address for the [Designated Reporter](#designated-reporter) for the InitialReporter contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the Designated Reporter for the InitialReporter contract, as a 20-byte hexadecimal string.

### augur.api.InitialReporter.getFeeWindow(p, callback)

Returns the Ethereum contract address of the [Fee Window](#fee-window) to which the InitialReporter contract belongs.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Fee Window to which the InitialReporter contract belongs, as a 20-byte hexadecimal string.

### augur.api.InitialReporter.getMarket(p, callback)

Returns the Ethereum contract address of the [Market](#market) to which the InitialReporter contract belongs.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Market to which the InitialReporter contract belongs, as a 20-byte hexadecimal string.

### augur.api.InitialReporter.getPayoutDistributionHash(p, callback)

Returns the [Payout Distribution Hash](#payout-distribution-hash) for the InitialReporter contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Payout Distribution Hash for the InitialReporter contract, as a 32-byte hexadecimal string.

### augur.api.InitialReporter.getPayoutNumerator(p, callback)

Returns the [Payout Numerator](#payout-set) of a given [Outcome](#outcome) for the InitialReporter contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._outcome`** (string) Outcome for which to get the Payout Numerator, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Payout Numerator of a given Outcome for the InitialReporter contract, as a stringified unsigned integer.

### augur.api.InitialReporter.getReportTimestamp(p, callback)

Returns the Unix timestamp of when the [Initial Report](#initial-report) (either the [Designated Report](#designated-report) or the [First Public Report](#first-public-report)) was submitted.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp of when the Initial Report was submitted, as a stringified unsigned integer.

### augur.api.InitialReporter.getReputationToken(p, callback)

Returns the [Reputation Token (REP)](#rep) Ethereum contract address used by the InitialReporter contract.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Reputation Token Ethereum contract address used by the InitialReporter contract, as a 20-byte hexadecimal string.

### augur.api.InitialReporter.getSize(p, callback)

Returns the amount of [attoREP](#atto-prefix) required to be Staked on an [Outcome](#outcome) in order to submit the [Initial Report](#initial-report). For Initial Reports, this value will always be the same as the value returned by `augur.api.InitialReporter.getStake`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of attoREP Staked on the Reported Outcome of the Initial Report, as a stringified unsigned integer.

### augur.api.InitialReporter.getStake(p, callback)

Returns the amount of [attoREP](#atto-prefix) [Staked](#dispute-stake) on the [Reported](#report) [Outcome](#outcome) of the specified InitialReporter contract. For [Initial Reports](#initial-report), this value will always be the same as the value returned by `augur.api.InitialReporter.getSize`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of attoREP Staked on the Initial Report for the Market of the specified InitialReporter contract, as a stringified unsigned integer.

### augur.api.InitialReporter.isInvalid(p, callback)

Returns whether the submitted [Initial Report](#initial-report) said the[Market](#market) for the InitialReporter contract was [Invalid](#invalid-outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the InitialReporter contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Initial Report said the Market for the InitialReporter contract was Invalid, or `false` otherwise.

Market Call API
----------------
```javascript
// Market Contract Call API Examples:
var market = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";

augur.api.Market.deriveMarketCreatorFeeAmount({
  _amount: "0xc3280e4b4b",
  tx: { to: market }
}, function (error, isInvalid) { 
  console.log(isInvalid); 
});
// example output:
"1"

augur.api.Market.derivePayoutDistributionHash({
  _payoutNumerators: [ "0x0", "0x2710" ],
  _invalid: false,
  tx: { to: market },
}, function (error, payoutDistributionHash) { 
  console.log(payoutDistributionHash); 
});
// example output:
"0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a"

augur.api.Market.designatedReporterShowed({ 
  tx: { to: market } 
}, function (error, designatedReporterShowed) { 
  console.log(designatedReporterShowed); 
});
// example output:
true

augur.api.Market.designatedReporterWasCorrect({ 
  tx: { to: market } 
}, function (error, designatedReporterWasCorrect) { 
  console.log(designatedReporterWasCorrect); 
});
// example output:
true

augur.api.Market.getCrowdsourcer({ 
  _payoutDistributionHash: "0x5580ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a",
  tx: { to: market } 
}, function (error, crowdsourcer) { 
  console.log(crowdsourcer); 
});
// example output:
"0xbbb0cc6b4e89303e451c9b852827b5791667face"

augur.api.Market.getDenominationToken({ 
  tx: { to: market } 
}, function (error, denominationToken) { 
  console.log(denominationToken); 
});
// example output:
"0x30e3852448f4ab5d62bbf7544ca3c92daca5c957"

augur.api.Market.getDesignatedReporter({ 
  tx: { to: market } 
}, function (error, designatedReporter) { 
  console.log(designatedReporter); 
});
// example output:
"0xca3edca4ed326bbcb77e914b379913b12d49654d"

augur.api.Market.getEndTime({ 
  tx: { to: market } 
}, function (error, endTime) { 
  console.log(endTime); 
});
// example output:
"1500388730";

augur.api.Market.getFeeWindow({ 
  tx: { to: market }, 
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.Market.getFinalizationTime({ 
  tx: { to: market } 
}, function (error, finalizationTime) { 
  console.log(finalizationTime); 
});
// example output:
"1500647930";

augur.api.Market.getForkingMarket({ 
  tx: { to: market } 
}, function (error, forkedMarket) { 
  console.log(forkedMarket); 
});
// example output:
"0x1230cc6b4e89303e451c9b852827b5791667f234"

augur.api.Market.getInitialReporter({ 
  tx: { to: market } 
}, function (error, initialReporter) { 
  console.log(initialReporter); 
});
// example output:
"0xaad0cc6b4e89303e451c9b852827b5791667fddd"

augur.api.Market.getMarketCreatorMailbox({ 
  tx: { to: market } 
}, function (error, marketCreatorMailbox) { 
  console.log(marketCreatorMailbox); 
});
// example output:
"0xeabdeaefcfaf7ea1e17c4768a554d5780069eabd"

augur.api.Market.getMarketCreatorSettlementFeeDivisor({ 
  tx: { to: market } 
}, function (error, marketCreatorSettlementFee) { 
  console.log(marketCreatorSettlementFee); 
});
// example output:
"20000000000000000"

augur.api.Market.getNumberOfOutcomes({ 
  tx: { to: market } 
}, function (error, numOutcomes) { 
  console.log(numOutcomes); 
});
// example output:
"2"

augur.api.Market.getNumTicks({ 
  tx: { to: market } 
}, function (error, numTicks) { 
  console.log(numTicks); 
});
// example output:
"1000"

augur.api.Market.getReportingParticipant({ 
  _index: "0x0",
  tx: { to: market } 
}, function (error, reportingParticipant) { 
  console.log(reportingParticipant); 
});
// example output:
"0xdda0cc6b4e89303e451c9b852827b5791667faaa"

augur.api.Market.getReputationToken({ 
  tx: { to: market } 
}, function (error, reputationToken) { 
  console.log(reputationToken); 
});
// example output:
"0x23b17188ce3c491f6ab4427258d92452be5c8045"

augur.api.Market.getShareToken({
  _outcome: "0x1",
  tx: { to: market },
}, function (error, shareToken) { 
  console.log(shareToken); 
});
// example output:
"0x18b17188ce3c491f6ab4427258d92452be5c8054"

augur.api.Market.getStakeInOutcome({ 
  _payoutDistributionHash: "0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a",
  tx: { to: market }, 
}, function (error, stakeInOutcome) { 
  console.log(stakeInOutcome); 
});
// example output:
"12378786123"

augur.api.Market.getParticipantStake({ 
  tx: { to: market } 
}, function (error, totalStake) { 
  console.log(totalStake); 
});
// example output:
"161278368761238475"

augur.api.Market.getUniverse({ 
  tx: { to: market } 
}, function (error, universe) { 
  console.log(universe); 
});
// example output:
"0x0920d1513057572be46580b7ef75d1d01a99a3e5"

augur.api.Market.getValidityBondAttoeth(
  tx: { to: market } 
}, function (error, validityBondAttoeth) { 
  console.log(validityBondAttoeth); 
});
// example output:
"13570000000000000"

augur.api.Market.getWinningPayoutDistributionHash({ 
  tx: { to: market } 
}, function (error, winningDistributionHash) { 
  console.log(winningDistributionHash); 
});
// example output:
"0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a"

augur.api.Market.getWinningPayoutNumerator({
  _outcome: "0x0",
  tx: { to: market },
}, function (error, winningPayoutNumerator) { 
  console.log(winningPayoutNumerator); 
});
// example output:
"1000"

augur.api.Market.getWinningReportingParticipant({ 
  tx: { to: market } 
}, function (error, winningReportingParticipant) { 
  console.log(winningReportingParticipant); 
});
// example output:
"0xbbb0cc6b4e89303e451c9b852827b5791667face"

augur.api.Market.isContainerForReportingParticipant({
  _shadyReportingParticipant: "0x18b17188ce3c491f6ab4427258d92452be5c8054",
  tx: { to: market },
}, function (error, isContainerForReportingParticipant) { 
  console.log(isContainerForReportingParticipant); 
});
// example output:
true

augur.api.Market.isContainerForShareToken({
  _shadyShareToken: "0x18b17188ce3c491f6ab4427258d92452be5c8054",
  tx: { to: market },
}, function (error, isContainerForShareToken) { 
  console.log(isContainerForShareToken); 
});
// example output:
true

augur.api.Market.isFinalized({
  tx: { to: market },
}, function (error, isFinalized) { 
  console.log(isFinalized); 
});
// example output:
true

augur.api.Market.isInvalid({
  tx: { to: market }
}, function (error, isInvalid) { 
  console.log(isInvalid); 
});
// example output:
true
```
Provides JavaScript bindings for the [Market Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Market.sol), which enables functionality for Augur's [Markets](#market).

### augur.api.Market.deriveMarketCreatorFeeAmount(p, callback)

Calculates the [Creator Fee](#creator-fee) that will be paid when settling a specific number of [Shares](#share) in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._amount`** (string) Number of [Share Units](#share-unit), as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Creator Fee, in attoETH, as a stringified unsigned integer.

### augur.api.Market.derivePayoutDistributionHash(p, callback)

Returns the [Payout Distribution Hash](#payout-distribution-hash) of the specified [Market](#market) by hashing [Payout Numerators](#payout-set) `_payoutNumerators` and [Invalid](#invalid-outcome) status `_invalid` using the keccak256 algorithm.

This call will fail if:

* `p._invalid` is `true` and the values in `p._payoutNumerators` are not all the same.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._payoutNumerators`** (Array.&lt;string>) Payout Numerators, as hexadecimal strings, from which to derive the Payout Distribution Hash.
    * **`p._invalid`** (boolean) Whether the Market is Invalid.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Payout Distribution Hash of the specified Market, as a 32-byte hexadecimal string.

### augur.api.Market.designatedReporterShowed(p, callback) 

Returns whether the [Designated Reporter](#designated-reporter) submitted a [Report](#report) within the [Designated Reporting Phase](#designated-reporting-phase).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Designated Reporter submitted a Report within the Designated Reporting Phase, or `false` otherwise.

### augur.api.Market.designatedReporterWasCorrect(p, callback) 

Returns whether the [Payout Distribution Hash](#payout-distribution-hash) submitted in the [Designated Report](#designated-report) is the same as the winning Payout Distribution Hash for the specified [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Payout Distribution Hash submitted in the Designated Report is the same as the winning Payout Distribution Hash for the specified Market, or `false` otherwise.

### augur.api.Market.getCrowdsourcer(p, callback)

Returns the Ethereum address for the DisputeCrowdsourcer contract that corresponds to the given [Payout Distribution Hash](#payout-distribution-hash). 

Note: Calling this function only works for retrieving a DisputeCrowdsourcer if the [Dispute Round](#dispute-round) has not been completed yet.

#### **Parameters:**

* **`p`** (Object) Parameters object. 
    * **`p._payoutDistributionHash`** (string) Payout Distribution Hash for the Outcome of the Dispute Crowdsourcer, as a 32-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address for the DisputeCrowdsourcer contract that corresponds to the given Payout Distribution Hash, as a 20-byte hexadecimal string.

### augur.api.Market.getDenominationToken(p, callback)

Returns the Ethereum contract address of the token used to denominate the specified [Market](#market). A Denomination Token is the [ERC-20 Token](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md) used as the currency to trade on the [Outcome](#outcome) of a [Market](#market). Currently, this function will always return the address of a [Cash](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Cash.sol) contract; however, Augur will eventually support other types of Denomination Tokens.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the token used to denominate the specified [Market](#market), as a 20-byte hexadecimal string.

### augur.api.Market.getDesignatedReporter(p, callback)

Returns the Ethereum address of the [Designated Reporter](#designated-reporter) for the specified [Market](#market). Every [Market](#market) is required to have an assigned Designated Reporter, which is set by the [Market Creator](#market-creator) during Market creation.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the Designated Reporter for the Market, as a 20-byte hexadecimal string.

### augur.api.Market.getEndTime(p, callback)

Returns the Unix timestamp for when the specified [Market's](#market) event has come to pass. When the Market's [End Time](#end-time) passes, the Market enters the [Designated Reporting Phase](#designated-reporting-phase).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp for when the specified [Market's](#market) event has come to pass, as a stringified unsigned integer.

### augur.api.Market.getFeeWindow(p, callback)

Returns the Ethereum contract address of the [Market's](#market) [Fee Window](#fee-window).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Market's Fee Window, as a 20-byte hexadecimal string.

### augur.api.Market.getFinalizationTime(p, callback)

Returns the Unix timestamp for when the specified [Market](#market) was [Finalized](#finalized-market). A Finalized Market has a [Final Outcome](#final-outcome) set from successful [Market Resolution](#market-resolution) which cannot be [Challenged](#challenge), and the Market is considered [Settled](#settlement).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp for when the Market was Finalized, as a stringified unsigned integer. If the Market does not have a finalization time yet, "0" will be returned.

### augur.api.Market.getForkingMarket(p, callback)

Returns the Ethereum contract address of the [Forked Market](#forked-market) for the [Universe](#universe) that contains the specified [Market](#market) address. If the [Market](#market) address specified belongs in a Universe that hasn't had a [Fork](#fork) take place, this will return `0x0`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Forked Market for the Universe in which the specified Market exists, as a 20-byte hexadecimal string.

### augur.api.Market.getInitialReporter(p, callback)

Returns the Ethereum address of the InitialReporter contract for a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the Market's InitialReporter contract, as a 20-byte hexadecimal string.

### augur.api.Market.getMarketCreatorMailbox(p, callback)

Returns the Ethereum address of the [Market Creator Mailbox](#market-creator-mailbox) for the specified Market. [Market Creators](#market-creator) can use this address to collect their fees.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the Market Creator Mailbox for the Market, as a 20-byte hexadecimal string.

### augur.api.Market.getMarketCreatorSettlementFeeDivisor(p, callback)

Returns the [Creator Fee](#creator-fee) set by the [Market Creator](#market-creator), denominated in [attotokens](#atto-prefix) per [Settlement](#settlement) of a [Complete Set](#complete-set), for the specified [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Creator Fee set by the Market Creator, denominated in attotokens per Settlement of a Complete Set, as a stringified unsigned integer.

### augur.api.Market.getNumberOfOutcomes(p, callback)

Returns the number of [Outcomes](#outcome) for the specified [Market](#market). The number of Outcomes is the number of potential results for the [Market](#market) event.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Outcomes for the Market, as a stringified unsigned integer.

### augur.api.Market.getNumTicks(p, callback)

Returns the [Number of Ticks](#number-of-ticks) set for a specific [Market](#market). The Number of Ticks represents the number of valid price points between the [Market](#market)'s [Minimum Price](#minimum-display-price) and [Maximum Price](#maximum-display-price).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Ticks for the Market, as a stringified unsigned integer.

### augur.api.Market.getParticipantStake(p, callback)

Returns the total amount of [attoREP](#atto-prefix) Staked on all [Outcomes](#outcome) of the specified [Market](#market). This amount is combined total of attoREP Staked on the Initial Report and attoREP Staked on every successful [Dispute Crowdsourcer](#crowdsourcer).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Total attoREP Staked on the Market, as a stringified unsigned integer.

### augur.api.Market.getReportingParticipant(p, callback)

Within Augur's code, the InitialReporter class and DisputeCrowdsourcer class are child classes of a class called ReportingParticipant. When an [Initial Report](#initial-report) is submitted or a [Dispute Crowdsourcer](#crowdsourcer) fills its [Dispute Bond](#dispute-bond), the corresponding [Market](#market) pushes that InitialReporter contract or DisputeCrowdsourcer contract to an array that keeps track of all contracts that have ever been the [Tentative Outcome](#tentative-outcome). The function `augur.api.Market.getReportingParticipant` returns the Ethereum address of the contract at a specific index in that array.

Note: To get the address of the ReportingParticipant that is currently winning in a Market, call `augur.api.Market.getWinningReportingParticipant`.

#### **Parameters:**

* **`p`** (Object) Parameters object. 
    * **`p._index`** (string) Index of the ReportingParticipant in the Market's array of ReportingParticipant contracts, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of a ReportingParticipant contract for the Market, as a 20-byte hexadecimal string.

### augur.api.Market.getReputationToken(p, callback)

Returns the Ethereum contract address of the [Reputation Token (REP)](#rep) for the specified [Market](#market), as a 20-byte hexadecimal string. REP is Staked whenever an [Initial Report](#initial-report) is submitted or when users attempt to [Challenge](#challenge) the [Tentative Outcome](#tentative-outcome) of a [Market](#market). A Market only accepts one REP contract as the source of Staked REP, and this method returns that contract's address.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Reputation Token for the Market, as a 20-byte hexadecimal string.

### augur.api.Market.getShareToken(p, callback)

Returns the Ethereum contract address of the [Share Token](#share-token-call-api) for the specified [Market](#market) and [Outcome](#outcome). Every Outcome of a Market has a separate Share Token used to handle trading around that Outcome and this method returns the contract address of the Share Tokens for the specified Outcome. Share Tokens are used within Augur to represent [Shares](#share).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._outcome`** (string) Outcome for which to get the Share Token Ethereum contract address, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Share Token for the specified Market and Outcome, as a 20-byte hexadecimal string.

### augur.api.Market.getStakeInOutcome(p, callback)

Returns the amount of [attoREP](#atto-prefix) that has been Staked on the [Outcome](#outcome) with the specified [Payout Distribution Hash](#payout-distribution-hash) in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._payoutDistributionHash`** (string) Payout Distribution Hash for which to the the amount of attoREP Staked, as a 32-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of attoREP Staked on the Outcome with the specified Payout Distribution Hash in the Market, as a stringified unsigned integer.

### augur.api.Market.getUniverse(p, callback)

Returns the Etherem address of the [Universe](#universe) in which the specified Market exists. All [Markets](#market) are created in a specific Universe, and new Universes are created if a [Fork](#fork) occurs.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Etherem address of the Universe in which the Market exists, as a 20-byte hexadecimal string.

### augur.api.Market.getValidityBondAttoeth(p, callback)

Returns the amount the [Market Creator](#market-creator) must pay for the [Validity Bond](#validity-bond), denominated in [AttoETH](#atto-prefix), when creating a [Market](#market). (This amount will be refunded to the Market Creator if the [Final Outcome](#final-outcome) of the Market is not invalid.)

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount the Market Creator must pay for the Validity Bond, denominated in attoETH.

### augur.api.Market.getWinningPayoutDistributionHash(p, callback)

Returns the winning [Payout Distribution Hash](#payout-distribution-hash) for a particular [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Winning Payout Distribution Hash for the Market, as a 32-byte hexadecimal string.

### augur.api.Market.getWinningPayoutNumerator(p, callback)

Returns the winning [Payout Numerator](#payout-set) for an [Outcome](#outcome) in a particular [Market](#market).

This call will fail if:

* The specified Market is not [Finalized](#finalized-market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._outcome`** (string) Outcome for which to get the winning Payout Numerator, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Winning Payout Numerator for an Outcome in the Market, as a stringified unsigned integer.

### augur.api.Market.getWinningReportingParticipant(p, callback)

Within Augur's code, the InitialReporter class and DisputeCrowdsourcer class are child classes of a class called ReportingParticipant. When an [Initial Report](#initial-report) is submitted or a [Dispute Crowdsourcer](#crowdsourcer) fills its [Dispute Bond](#dispute-bond), the corresponding [Market](#market) pushes that InitialReporter contract or DisputeCrowdsourcer contract to an array that keeps track of all contracts that have ever been the [Tentative Outcome](#tentative-outcome). The function `augur.api.Market.getWinningReportingParticipant` returns the Ethereum address of the ReportingParticipant contract that corresponds to the Market's Tentative Outcome.

#### **Parameters:**

* **`p`** (Object) Parameters object. 
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the ReportingParticipant contract corresponding to the Market's Tentative Outcome, as a 20-byte hexadecimal string.

### augur.api.Market.isContainerForReportingParticipant(p, callback)

Returns whether the ReportingParticipant contract `_shadyReportingParticipant` belongs to the specified [Market](#market). (Both the [DisputeCrowdsourcer](#dispute-crowdsourcer-call-api) and [InitialReporter](#initial-reporter-call-api) classes in Augur's Solidity smart contracts are considered Reporting Participants, since they have the parent class `BaseReportingParticipant`.)

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyReportingParticipant`** (string) ReportingParticipant Ethereum contract address for which to check if the Market is a container, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Market is a container for the ReportingParticipant contract, or `false` otherwise.

### augur.api.Market.isContainerForShareToken(p, callback)

Returns whether the given [Market](#market) is a container for the specified [Share Token](#share-token-call-api) Ethereum contract address.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyShareToken`** (string) ShareToken Ethereum contract address for which to check if the Market is a container, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Market is a container for the specified Share Token, or `false` otherwise.

### augur.api.Market.isFinalized(p, callback)
Returns whether the [Market](#market) has been [Finalized](#finalized-market) (that is, its winning [Payout Distribution Hash](#payout-distribution-hash) is set).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Market has been Finalized, or `false` otherwise.

### augur.api.Market.isInvalid(p, callback)

Returns whether the specified [Market](#market) has been [Finalized](#finalized-market) as [Invalid](#invalid-outcome).

This call will fail if:

* The Market is not Finalized.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Market contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Market has been Finalized as Invalid, or returns `false` otherwise.

Orders Call API
---------------
```javascript
// Orders Contract Call API Examples:
var _orderId = "0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870";
var _type = "0x1";
var _market = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";
var _outcome = "0x1";

augur.api.Orders.getAmount({ 
  _orderId: _orderId 
}, function (error, amount) { 
  console.log(amount); 
});
// example output:
"15"

augur.api.Orders.getBestOrderId({
  _type: _type,
  _market: _market,
  _outcome: _outcome
}, function (error, bestOrderId) { 
  console.log(bestOrderdD); 
});
// example output:
"0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870"

augur.api.Orders.getBetterOrderId({ 
  _orderId: "0x49cb49f610b5f6e31ee163a8ad65f964af1088e38c8a1b07f1218177b5e006b5"
}, function (error, betterOrderId) { 
  console.log(betterOrderId); 
});
// example output:
"0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870"

augur.api.Orders.getLastOutcomePrice({
  _market: _market,
  _outcome: _outcome
}, function (error, lastOutcomePrice) { 
  console.log(lastOutcomePrice); 
});
// example output:
"490000000000000000"

augur.api.Orders.getMarket({ 
  _orderId: _orderId
}, function (error, market) { 
  console.log(market); 
});
// example output:
"0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";

augur.api.Orders.getOrderCreator({ 
  _orderId: _orderId 
}, function (error, creator) { 
  console.log(creator); 
});
// example output:
"0x438f2aeb8a16745b1cd711e168581ebce744ffaa";

augur.api.Orders.getOrderMoneyEscrowed({ 
  _orderId: _orderId 
}, function (error, orderMoneyEscrowed) { 
  console.log(orderMoneyEscrowed); 
});
// example output:
"5000000000000000000"

augur.api.Orders.getOrderSharesEscrowed({ 
  _orderId: _orderId
}, function (error, orderSharesEscrowed) { 
  console.log(orderSharesEscrowed); 
});
// example output:
"0"

augur.api.Orders.getOrderType({ 
  _orderId: _orderId 
}, function (error, orderType) { 
  console.log(orderType); 
});
// example output:
"1"

augur.api.Orders.getOutcome({ 
  _orderId: _orderId 
}, function (error, outcome) { 
  console.log(outcome); 
});
// example output:
"1"

augur.api.Orders.getPrice({ 
  _orderId: _orderId 
}, function (error, price) { 
  console.log(price); 
});
// example output:
"500000000000000000"

augur.api.Orders.getTotalEscrowed({ 
  _market: _market 
}, function (error, volume) { 
  console.log(volume); 
});
// example output:
"100000000000000000000000"

augur.api.Orders.getWorseOrderId({ 
  _orderId: "0x4b538f4de2517f7d7bbb227161981c51c40bf725da9941b3dc02e6c14cafd1f1" 
}, function (error, worseOrderId) { 
  console.log(worseOrderId); 
});
// example output:
"0x9a8d5523ed521813533d1f8469f5040fa1404fcf470b9da43bccfe38c80ad035"

augur.api.Orders.getWorstOrderId({
  _type: _type,
  _market: _market,
  _outcome: _outcome
}, function (error, worstOrderId) { 
  console.log(worstOrderId); 
});
// example output:
"0x9a8d5523ed521813533d1f8469f5040fa1404fcf470b9da43bccfe38c80ad035"

var _price = "0x63eb89da4ed0000"; // 0.45
augur.api.Orders.isBetterPrice({
  _type: _type,
  _price: _price,
  _orderId: _orderId
}, function (error, isBetterPrice) { 
  console.log(isBetterPrice); 
});
// example output:
false

augur.api.Orders.isWorsePrice({
  _type: _type,
  _price: _price,
  _orderId: _orderId
}, function (error, isWorsePrice) { 
  console.log(isWorsePrice); 
});
// example output:
true
```
Provides JavaScript bindings for the [Orders Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/Orders.sol), which handles functionality related to the [Order Book](#order-book).

### augur.api.Orders.getAmount(p, callback)

Returns the amount of [Shares](#share) requested when a particular [Order](#order) was placed.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) ID of the Order, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of Shares requested when the Order was placed, as a stringified unsigned integer.

### augur.api.Orders.getBestOrderId(p, callback)

Returns the [Order](#order) ID of the best Order of a particular type (either [Ask Orders](#ask-order) or [Bid Orders](#bid-order)), for a specific [Outcome](#outcome), in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a Bid Order, "0x1" for an Ask Order).
    * **`p._market`** (string) Ethereum contract address of the Market for which to get the best Order ID, as a 20-byte hexadecimal string.
    * **`p._outcome`** (string) [Outcome](#outcome) of the Market, as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Order ID with the best price, as a 32-byte hexadecimal string.

### augur.api.Orders.getBetterOrderId(p, callback)

Returns the [Order](#order) ID of an Order with a better price than the specified Order.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) ID of an Order with a better price than the specified Order, as a 32-byte hexadecimal string.

### augur.api.Orders.getLastOutcomePrice(p, callback)

Returns the last price traded for a specific [Outcome](#outcome) in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._market`** (string) Ethereum contract address of a Market, as a 20-byte hexadecimal string.
    * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Last price traded for a specific Outcome in a given Market, as a stringified unsigned integer.

### augur.api.Orders.getMarket(p, callback)

Returns the Ethereum contract address of the [Market](#market) for the specified [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Market for the specified Order, as a 20-byte hexadecimal string.

### augur.api.Orders.getOrderCreator(p, callback)

Returns the Ethereum address of the [Creator](#order-creator) of the specified [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum address of the Creator of the specified Order, as a 20-byte hexadecimal string.

### augur.api.Orders.getOrderMoneyEscrowed(p, callback)

Returns the amount of money escrowed by the [Order Creator](#order-creator) for a given [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Amount of money escrowed by the Order Creator for a given Order, as a stringified unsigned integer.

### augur.api.Orders.getOrderSharesEscrowed(p, callback)

Returns the number of [Shares](#share) escrowed by the [Order Creator](#order-creator) for a given [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of Shares escrowed by the Order Creator for a given Order, as a stringified unsigned integer.

### augur.api.Orders.getOrderType(p, callback)

Returns the order type ([Bid Order](#bid-order) or [Ask Order](#ask-order)) of a given [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Order type of the Order, as a stringified unsigned integer ("1" for Bid Orders, or "2" for Ask Orders).

### augur.api.Orders.getOutcome(p, callback)

Returns the [Outcome](#outcome) being traded on for the specified [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Outcome being traded on for the specified Order, as a stringified unsigned integer.

### augur.api.Orders.getPrice(p, callback)

Returns the price of a specified [Order](#order).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Price of the Order, as a stringified unsigned integer.

### augur.api.Orders.getTotalEscrowed(p, callback)

Returns the total amount of [attoETH](#atto-prefix) currently escrowed for open Orders in the specified [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._market`** (string) Ethereum contract address of a Market, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Volume of the Market, as a stringified unsigned integer.

### augur.api.Orders.getWorseOrderId(p, callback)

Returns the [Order](#order) ID of an Order with a worse price than the specified Order.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._orderId`** (string) Order ID, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) ID of an Order with a worse price than the specified Order, as a 32-byte hexadecimal string.

### augur.api.Orders.getWorstOrderId(p, callback)

Returns the [Order](#order) ID of the worst Order of a particular type (either [Ask Orders](#ask-order) or [Bid Orders](#bid-order)), for a specific [Outcome](#outcome), in a given [Market](#market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a Bid Order, "0x1" for an Ask Order). 
    * **`p._market`** (string) Ethereum contract address of the Market for which to get the worst Order ID, as a 20-byte hexadecimal string.
    * **`p._outcome`** (string) [Outcome](#outcome) of the Market, as a hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Order ID with the worst price, as a 32-byte hexadecimal string.

### augur.api.Orders.isBetterPrice(p, callback)

Returns whether a given price is greater than the price of a particular [Order](#order) (for Bid Orders), or whether the price is less than the price of the Order (for Ask Orders).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)). 
    * **`p._price`** (string) Price in [attoETH](#atto-prefix) to compare `p._orderId` to, as a hexadecimal string.
    * **`p._orderId`** (string) ID of Order to compare `p._price` to, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the price is greater than the Order price (for Bid Orders), or if the price is less than the Order price (for Ask Orders). Otherwise, the function will return `false`.

### augur.api.Orders.isWorsePrice(p, callback)

Returns whether a given price is less than/equal to the price of a particular [Order](#order) (for Bid Orders), or whether the price is greater than/equal to the price of the Order (for Ask Orders).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)). 
    * **`p._price`** (string) Price in [attoETH](#atto-prefix) to compare `p._orderId` to, as a hexadecimal string.
    * **`p._orderId`** (string) ID of Order to compare `p._price` to, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the price is less than the Order price (for Bid Orders), or if the price is greater than the Order price (for Ask Orders). Otherwise, the function will return `false`.

Orders Fetcher Call API
-----------------------
```javascript
// Orders Fetcher Contract Call API Examples:
var _orderId = "0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870";
var _type = "0x1";
var _market = "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42";
var _outcome = "0x1";
var _price = "0x63eb89da4ed0000"; // 0.45

augur.api.OrdersFetcher.ascendOrderList({
  _type: _type,
  _price: _price,
  _lowestOrderId: _orderId
}, function (error, ascendingOrderList) { console.log(ascendingOrderList); });
// example output:
[ "0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870",
  "0x4a8d07c2c9cd996484c04b7077d1fc4aeaeb8aa4750d7f26f2a896c4393fb6b0" ]

augur.api.OrdersFetcher.descendOrderList({
  _type: _type,
  _price: _price,
  _highestOrderId: _orderId
}, function (error, decendingOrderList) { console.log(decendingOrderList); });
// example output:
[ "0x09502d4c2765d61a8e47fd4ada696966f3bc3bce6b780ecedded035e616c272e",
  "0x7ca90ca9118db456d87e3d743b97782a857200b55039f7ffe8de94e5d920f870"]

augur.api.OrdersFetcher.findBoundingOrders({
  _type: _type,
  _price: _price,
  _bestOrderId: _orderId,
  _worstOrderId: "0x0",
  _betterOrderId: "0x0",
  _worseOrderId: "0x0"
}, function (error, boundingOrders) { console.log(boundingOrders); });
// example output:
[ "0x4a8d07c2c9cd996484c04b7077d1fc4aeaeb8aa4750d7f26f2a896c4393fb6b0",
  "0x09502d4c2765d61a8e47fd4ada696966f3bc3bce6b780ecedded035e616c272e" ]
```
Provides JavaScript bindings for the [OrdersFetcher Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/OrdersFetcher.sol), which handles functionality related retrieving [Orders](#order) from the [Order Book](#order-book).

### augur.api.OrdersFetcher.ascendOrderList(p, callback)

Traverses the [Order Book](#order-book) in ascending order and returns an array containing the better [Order](#order) ID and worse Order ID, respectively, for a specified price and Order type.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)). 
    * **`p._price`** (string) Price (in [attoETH](#atto-prefix)) in the Order Book for which to find a better Order ID and worse Order ID, as a hexadecimal string.
    * **`p._lowestOrderId`** (string) Order ID expected to be a worse price than `p._price`, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (Array.&lt;string>) Array containing the better Order ID and worse Order ID, respectively, for the specified price and Order type.

### augur.api.OrdersFetcher.descendOrderList(p, callback)

Traverses the [Order Book](#order-book) in descending order and returns an array containing the better [Order](#order) ID and worse Order ID, respectively, for a specified price and Order type.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)). 
    * **`p._price`** (string) Price (in [attoETH](#atto-prefix)) in the Order Book for which to find a better Order ID and worse Order ID, as a hexadecimal string.
    * **`p._highestOrderId`** (string) Order ID expected to be a better price than `p._price`, as a 32-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (Array.&lt;string>) Array containing the better Order ID and worse Order ID, respectively, for the specified price and Order type.

### augur.api.OrdersFetcher.findBoundingOrders(p, callback)

Returns an array containing the [Order](#order) IDs from the [Order Book](#order-book) that should be set to better Order ID and worse Order ID, respectively, for an Order placed with price `p._price`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._type`** (string) Type of Order, as a hexadecimal string ("0x0" for a [Bid Order](#bid-order), "0x1" for an [Ask Order](#ask-order)). 
    * **`p._price`** (string) Price (in [attoETH](#atto-prefix)) to compare `p._orderId` to, as a hexadecimal string.
    * **`p._bestOrderId`** (string) Best Order ID on the Order Book for `p._type`, as a 32-byte hexadecimal string.
    * **`p._worstOrderId`** (string) Worst Order ID on the Order Book for `p._type`, as a 32-byte hexadecimal string.
    * **`p._betterOrderId`** (string) Order ID with a better price than `p._price`, as a 32-byte-hexadecimal string.
    * **`p._worseOrderId`** (string) Order ID with a worse price than `p._price`, as a 32-byte-hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (Array.&lt;string>) Array containing the better Order ID and worse Order ID, respectively, for the specified price and Order type.

Orders Finder Call API
-----------------------
```javascript
// Orders Finder Contract Call API Examples:

// All OrdersFinder functions can be called like the example below, but return different array lengths.
var ordersFinder = "0xf28fc4b34a7c4534dd3e40e0ad5df6f2cb69aec0";
augur.api.OrdersFinder.getExistingOrders5({ 
  _type: "0x1",
  _market: "0xd8e090ac1282fd54d4f7ff5474f6e363cf30049e",
  _outcome: "0x1",
  tx: { to: ordersFinder } 
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
[
  "0xfa76427aaada4f319a831f6b2579557ee30579dac997cbe6d7737b438a788a2b",
  "0xf77843d1520fe797874779a2447cd8727a3ff985975cbe2e0f660e6aa27fff8f",
  "0x38e6d59a9d4953dbdda92de3561c044b86640236ed8398666155a031bfd77e69",
  "0x1673d59a9d497384dda92de3561c044b86640236ed8398666155a031bfd89263",
  "0x8245959a9d4953dbdda92de3561c044b86640236ed8398666155a031bfd09837"
]
```
Provides JavaScript bindings for the [OrdersFinder Solidity Contract](https://github.com/AugurProject/augur-core/blob/e7a5221be4dab7fc81c37c978919bc6ebad10266/source/contracts/external/OrdersFinder.sol), which retrieves [Orders](#order) from the [Order Book](#order-book).

### augur.api.OrdersFinder.getExistingOrders5(p, callback)

Returns the 5 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 5 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders10(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 10 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 10 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders20(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 20 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 20 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders50(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 50 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 50 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders100(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 100 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 100 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders200(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 200 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 200 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders500(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 500 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 500 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

### augur.api.OrdersFinder.getExistingOrders1000(p, callback)

Similar to `augur.api.OrdersFinder.getExistingOrders5`, but returns the 1000 best [Orders](#order) on the [Order Book](#order-book) for a particular [Market](#market), based on Order Type and [Outcome](#outcome).

#### **Parameters:**

* **`p`** (Object) Parameters object. 
  * **`p._type`** (string) Type of Order, as a hexadecimal string (“0x0” for a [Bid Order](#bid-order), “0x1” for an [Ask Order](#ask-order)).
  * **`p._market`** (string) Ethereum address of the Market for which to get Orders from the Order Book.
  * **`p._outcome`** (string) Outcome of the Market, as a hexadecimal string.

#### **Returns:**

* (Array.&lt;string>) Array of the 1000 best Order IDs for the specified Market, Order Type, and Outcome, as 32-byte hexadecimal strings.

Reputation Token Call API
-------------------------
```javascript
// Reputation Token Contract Call API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
// The Ethereum contract address for a Universe's Reputation Token 
// can be obtained by calling `augur.api.Universe.getReputationToken`.
var reputationToken = "0x13fa2334966b3cb6263ed56148323014c2ece753";

augur.api.ReputationToken.allowance({
  _owner: "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb",
  _spender: _augurContractAddress,
  tx: { to: reputationToken } 
}, function(error, allowance) {
  console.log(allowance); 
});
// example output:
"115792089237316195423570985008687907853269984665640564039457584007913129639935"

augur.api.ReputationToken.getUniverse({ 
  tx: { to: reputationToken } 
}, function (error, universe) { 
  console.log(universe); 
});
// example output:
"0x1f732847fbbcc46ffe859f28e916d993b2b08831"

augur.api.ReputationToken.getTotalMigrated({ 
  tx: { to: reputationToken } 
}, function (error, totalMigrated) { 
  console.log(totalMigrated); 
});
"0"

augur.api.ReputationToken.getTotalTheoreticalSupply({ 
  tx: { to: reputationToken } 
}, function (error, totalTheoreticalSupply) { 
  console.log(totalTheoreticalSupply); 
});
"11000000000000000000000000"
```
Provides JavaScript bindings for the [ReputationToken Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/ReputationToken.sol), which handles the approval, migration, and transfering of [Reputation Tokens](#rep). 

The Reputation Token, or REP, is an ERC-20 token that implements all of the required functions listed in the [ERC-20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md). It does not, however, implement the optional functions.

### augur.api.ReputationToken.allowance(p, callback)

Returns the amount of [attoREP](#atto-prefix) that a given Ethereum contract is allowed to spend on behalf of a particular user.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._owner`** (string) Ethereum address of the owner of the [REP](#rep), as a 20-byte hexadecimal value.
    * **`p._spender`** (string) Ethereum address of the contract allowed to spend on behalf of `p._owner`, as a 20-byte hexadecimal string. (This should be the address of the Augur.sol contract.)
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ReputationToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

(string) Amount of attoREP the contract is allowed to spend on behalf of the specified user.

### augur.api.ReputationToken.getUniverse(p, callback)

Returns the Ethereum contract address of the [Universe](#universe) in which the [REP](#rep) of the ReputationToken contract can be used.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ReputationToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Universe in which the REP of the ReputationToken contract can be used, as a 20-byte hexadecimal string.

### augur.api.ReputationToken.getTotalMigrated(p, callback)

Returns total amount of [REP](#rep) that has been migrated into the current ReputationToken contract from the ReputationToken contract of its [Universe's](#universe) [Parent Universe](#parent-universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ReputationToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Total amount of REP that has been migrated into the current ReputationToken contract from the ReputationToken contract of its Universe's Parent Universe, as a stringified unsigned integer.

### augur.api.ReputationToken.getTotalTheoreticalSupply(p, callback)

Returns the total [Theoretical REP Supply](#theoretical-rep-supply) for this ReputationToken contract. Note: To ensure this number is as accurate as possible, `augur.api.ReputationToken.updateParentTotalTheoreticalSupply` should first be called on the ReputationToken contract, and `augur.api.ReputationToken.updateSiblingMigrationTotal` should be called on any ReputationToken contracts that have the same [Parent Universe](#parent-universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ReputationToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Total Theoretical REP Supply for this ReputationToken contract, as a stringified unsigned integer.

Share Token Call API
--------------------
```javascript
// Share Token Contract Call API Examples:

// The Ethereum contract address for Augur.sol can be 
// obtained by calling `augur.augurNode.getSyncData`.
var _augurContractAddress = "0x67cbf60a24ab922af99e6f335c0ff2b084d5bdbe";
// Share Token contract addresses for a Market can be 
// obtained by calling `augur.api.Market.getShareToken`.
var shareToken = "0x18b17188ce3c491f6ab4427258d92452be5c8054";

augur.api.ShareToken.allowance({
  _owner: "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb",
  _spender: _augurContractAddress,
}, function(error, allowance) {
  console.log(allowance); 
});
// example output:
"115792089237316195423570985008687907853269984665640564039457584007913129639935"

augur.api.ShareToken.getMarket({ 
  tx: { to: shareToken } 
}, function (error, market) { 
  console.log(market); 
});
// example output:
"0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42"

augur.api.ShareToken.getOutcome({ 
  tx: { to: shareToken } 
}, function (error, outcome) { 
  console.log(outcome); 
});
// example output:
"1"
```
Provides JavaScript bindings for the [ShareToken Solidity Code](https://github.com/AugurProject/augur-core/blob/master/source/contracts/trading/ShareToken.sol), which handles the approval and transferring of [Shares](#share) in Augur. 

The Share Token is an ERC-20 token that implements all of the required functions listed in the [ERC-20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md). It does not, however, implement the optional functions. Within Augur, it represents [Shares](#share) in [Market](#market) [Outcomes](#outcome).

### augur.api.ShareToken.allowance(p, callback)

Returns the amount of [Share Units](#share-unit) that a given Ethereum contract is allowed to spend on behalf of a particular user.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._owner`** (string) Ethereum address of the owner of the [Shares](#share), as a 20-byte hexadecimal value.
    * **`p._spender`** (string) Ethereum address of the contract allowed to spend on behalf of `p._owner`, as a 20-byte hexadecimal string. (This should be the address of the Augur.sol contract.)
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

(string) Amount of Share Units the contract is allowed to spend on behalf of the specified user.

### augur.api.ShareToken.getMarket(p, callback)

Returns the Ethereum contract address of the [Market](#market) for the specified ShareToken.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ShareToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Returns the Ethereum contract address of the Market for the specified ShareToken, as a 20-byte hexadecimal string.

### augur.api.ShareToken.getOutcome(p, callback)

Returns the Outcome of the Market that the specified ShareToken is for.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the ShareToken contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Returns the Outcome of the Market that the specified ShareToken is for, as a stringified unsigned integer.

Universe Call API
---------------
```javascript
// Universe Contract Call API Examples:

// The Ethereum contract address of Augur's current default Universe 
// can be obtained by calling `augur.augurNode.getSyncData`.
var universe = "0x0920d1513057572be46580b7ef75d1d01a99a3e5";

augur.api.Universe.getChildUniverse({
  _parentPayoutDistributionHash: "0x4480ed40f94e2cb2ca244eb862df2d350300904a96039eb53cba0e34b8ace90a",
  tx: { to: universe },
}, function (error, childUniverse) { 
  console.log(childUniverse); 
});
// example output:
"0xb4e8c1f85c4382d64954aca187f9f386c8bb1a6c"

augur.api.Universe.getCurrentFeeWindow({ 
  tx: { to: universe } 
}, function (error, currFeeWindow) { 
  console.log(currFeeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.Universe.getDisputeRoundDurationInSeconds({ 
  tx: { to: universe } 
}, function (error, disputeRoundDuration) { 
  console.log(disputeRoundDuration); 
});
// example output:
"604800"

augur.api.Universe.getFeeWindow({ 
  _feeWindowId: "0x242",
  tx: { to: universe }, 
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.Universe.getFeeWindowByTimestamp({ 
  _timestamp: "0x5a45710f",
  tx: { to: universe },
}, function (error, feeWindow) { 
  console.log(feeWindow); 
});
// example output:
"0x1f90cc6b4e89303e451c9b852827b5791667f570"

augur.api.Universe.getFeeWindowId({ 
  _timestamp: "0x5a45710f",
  tx: { to: universe },
}, function (error, feeWindowId) {
  console.log(feeWindowId); 
});
// example output:
"578"

augur.api.Universe.getForkEndTime({ 
  tx: { to: universe } 
}, function (error, forkEndTime) { 
  console.log(forkEndTime); 
});
// example output:
"1489855429"

augur.api.Universe.getForkingMarket({ 
  tx: { to: universe } 
}, function (error, forkingMarket) { 
  console.log(forkingMarket); 
});
// example output:
"0x78f7b43150d27c464359e735781c16ac585f52a8"

augur.api.Universe.getForkReputationGoal({ 
  tx: { to: universe } 
}, function (error, forkReputationGoal) { 
  console.log(forkReputationGoal); 
});
// example output:
"5500000000000000000000000"

augur.api.Universe.getNextFeeWindow({ 
  tx: { to: universe } 
}, function (error, nextFeeWindow) { 
  console.log(nextFeeWindow); 
});
// example output:
"0x45659544b89cce1dd53b1b566862189b25adec49"

augur.api.Universe.getOpenInterestInAttoEth({ 
  tx: { to: universe } 
}, function (error, openInterestInAttoEth) { 
  console.log(openInterestInAttoEth); 
});
// example output:
"42250000000000000000"

augur.api.Universe.getParentPayoutDistributionHash({ 
  tx: { to: universe } 
}, function (error, universeParentPayoutDistributionHash) { 
  console.log(universeParentPayoutDistributionHash); 
});
// example output:
"0xa310ca2018af3cb2ca244eb862df2d350300904a96039eb53cbaff012c92d10c"

augur.api.Universe.getParentUniverse({ 
  tx: { to: universe } 
}, function (error, parentUniverse) { 
  console.log(parentUniverse); 
});
// example output:
"0x63c59544b89cce1dd53b1b566862189b25adec41"

augur.api.Universe.getPreviousFeeWindow({ 
  tx: { to: universe } 
}, function (error, previousFeeWindow) { 
  console.log(previousFeeWindow); 
});
// example output:
"0xc0adccd7c65ea05c2e91a148af988d776e683643"

augur.api.Universe.getRepMarketCapInAttoeth({ 
  tx: { to: universe } 
}, function (error, repMarketCapInAttoeth) { 
  console.log(repMarketCapInAttoeth); 
});
// example output:
"36000000000000000000000000000000000000000"

augur.api.Universe.getReputationToken({ 
  tx: { to: universe } 
}, function (error, reputationTokenAddress) { 
  console.log(reputationTokenAddress); 
});
// example output:
"0x2fb561b2bdbcd1ae1995bdd6aff6776d6f4292f2"

augur.api.Universe.getTargetRepMarketCapInAttoeth({ 
  tx: { to: universe } 
}, function (error, targetRepMarketCapInAttoeth) { 
  console.log(targetRepMarketCapInAttoeth); 
});
// example output:
"211250000000000000000"

augur.api.Universe.getWinningChildUniverse({ 
  tx: { to: universe } 
}, function (error, winningChildUniverse) { 
  console.log(winningChildUniverse); 
});
// example output:
"0x432561b2bdbcd1ae1995bdd6aff6776d6f4292f2"

augur.api.Universe.isContainerForFeeToken({
  _shadyFeeToken: "0x2a73cec0b62fcb8c3120bc80bdb2b1351c8c2d1e",
  tx: { to: universe },
}, function (error, isContainerForFeeToken) { 
  console.log(isContainerForFeeToken); 
});
// example output:
true

augur.api.Universe.isContainerForFeeWindow({
  _shadyFeeWindow: "0x1233cec0b62fcb8c3120bc80bdb2b1351c8c2d1e",
  tx: { to: universe },
}, function (error, isContainerForFeeWindow) { 
  console.log(isContainerForFeeWindow); 
});
// example output:
true

augur.api.Universe.isContainerForMarket({
  _shadyMarket: "0x9368ff3e9ce1c0459b309fac6dd4e69229b91a42",
  tx: { to: universe },
}, function (error, isContainerForMarket) { 
  console.log(isContainerForMarket); 
});
// example output:
false

augur.api.Universe.isContainerForReportingParticipant({
  _shadyReportingParticipant: "0x6788ff3e9ce1c0459b309fac6dd4e69229b91a41",
  tx: { to: universe },
}, function (error, isContainerForReportingParticipant) { 
  console.log(isContainerForReportingParticipant); 
});
// example output:
true

augur.api.Universe.isContainerForShareToken({
  _shadyShareToken: "0x9328ff3e9ce1c0459b309fac6dd4e69229b91a61",
  tx: { to: universe },
}, function (error, isContainerForShareToken) { 
  console.log(isContainerForShareToken); 
});
// example output:
true

augur.api.Universe.isForking({ 
  tx: { to: universe } 
}, function (error, isForking) { 
  console.log(isForking); 
});
// example output:
false

augur.api.Universe.isParentOf({
  _shadyChild: "0xb4e8c1f85c4382d64954aca187f9f386c8bb1a6c",
  tx: { to: universe },
}, function (error, isParentOf) { 
  console.log(isParentOf); 
});
// example output:
true
```
Provides JavaScript bindings for the [Universe Solidity Contract](https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Universe.sol), which allows for the creation of [Markets](#market) and provides functions for obtaining information about a given [Universe](#universe).

### augur.api.Universe.getChildUniverse(p, callback)

Returns the Ethereum contract address of a [Universe's](#universe) [Child Universe](#child-universe) that has [Final Outcome](#final-outcome) set to a specific [Payout Distribution Hash](#payout-distribution-hash).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._parentPayoutDistributionHash`** (string) Payout Distribution Hash for Final Outcome of the desired Child Universe, as a 32-byte hexadecimal string. 
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Universe's Child Universe that has its Final Outcome set to the specified Payout Distribution Hash, as a 20-byte hexadecimal string. If no such Child Universe exists, the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getCurrentFeeWindow(p, callback)

Returns the Ethereum contract address of the current running [Fee Window](#fee-window) of a [Universe](#universe). Every Universe has a Fee Window that runs for a duration of 7 days before immediately starting the next Window.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the current running Fee Window of the Universe, as a 20-byte hexadecimal string.

### augur.api.Universe.getDisputeRoundDurationInSeconds(p, callback)

Returns the number of seconds in a [Dispute Round](#dispute-round) within the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Number of seconds in a Universe's Dispute Round, as a stringified unsigned integer.

### augur.api.Universe.getFeeWindow(p, callback)

Returns the Ethereum contract address of a given [Fee Window](#fee-window) in the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._feeWindowId`** (string) Fee Window ID, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the given Fee Window in the Universe, as a 20-byte hexadecimal string. If a Fee Window with the specified ID does not exist, the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getFeeWindowByTimestamp(p, callback)

Returns the Ethereum contract address of the [Fee Window](#fee-window) running at a given timestamp in the [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._timestamp`** (string) Unix timestamp for which to get the corresponding Fee Window, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Fee Window running in the Universe at the specified timestamp, as a 20-byte hexadecimal string. If a Fee Window with the specified timestamp does not exist, the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getFeeWindowId(p, callback)

Returns the [Fee Window](#fee-window) ID for the [Universe](#universe) at the specified timestamp. This ID is calculated by dividing the timestamp by the [Universe's](#universe) Fee Window duration in seconds.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._timestamp`** (string) Unix timestamp for which to get the corresponding Fee Window, as a hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) ID of the Fee Window running the the Universe at the specified timestamp, as a stringified unsigned integer. If the Fee Window contract does not currently exist, "0" will be returned.

### augur.api.Universe.getForkEndTime(p, callback)

Returns the Unix timestamp for when the [Fork Phase](#fork-period) ends that was started on the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Unix timestamp when the Fork Phase ends that was started on the specified Universe, as a stringified unsigned integer. If a Fork has not occurred in the Universe, "0" will be returned.

### augur.api.Universe.getForkingMarket(p, callback)

Returns the Ethereum contract address of the [Market](#market) that the specified [Universe](#universe) is [Forking](#fork) over.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Market that the specified Universe is Forking over, as a 20-byte hexadecimal string. If the Universe does not contain a [Forked Market](#forked-market), the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getForkReputationGoal(p, callback)

Returns the estimated amount of [attoREP](#atto-prefix) that must be migrated to one [Child Universe](#child-universe) in order to allow a [Fork](#fork) in the specified [Universe](#universe) to be [Finalized](#finalized-market) before the end of the [Fork Phase](#fork-period).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Estimated amount of attoREP that must be migrated to one Child Universe in order to allow a Fork in the specified Universe to be Finalized before the end of the Fork Phase, as a stringified unsigned integer.

### augur.api.Universe.getNextFeeWindow(p, callback)

Returns the Ethereum contract address of the [Fee Window](#fee-window) coming up after the current Fee Window ends in the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Fee Window coming up after the current Fee Window ends in the specified Universe, as a 20-byte hexadecimal string. If the Fee Window contract for the next Fee Window does not exist yet, the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getOpenInterestInAttoEth(p, callback)

Returns the total value of all [Complete Sets](#complete-sets) that exist across all [Markets](#market) the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Total value of all Complete Sets that exist across all Markets the specified Universe, priced in [attoETH](#atto-prefix), as a stringified unsigned integer.

### augur.api.Universe.getParentPayoutDistributionHash(p, callback)

Returns the [Payout Distribution Hash](#payout-distribution-hash) of the specified [Universe's](#universe) [Parent Universe](#parent-universe). The Payout Distribution Hash is a hash of the winning [Outcome](#outcome) of the [Forked Market](#forked-market).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Payout Distribution Hash of the Universe's Parent Universe, as a 32-byte hexadecimal string.  If the Universe does not have a Parent Universe (that is, it is a [Genesis Universe](#genesis-universe)), the string "0x0000000000000000000000000000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getParentUniverse(p, callback)

Returns the Ethereum contract address of the [Parent Universe](#parent-universe) for the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Parent Universe for the specified Universe. If the Universe does not have a Parent Universe (that is, it is a [Genesis Universe](#genesis-universe)), the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getPreviousFeeWindow(p, callback)

Returns the Ethereum contract address of the previous [Fee Window](#fee-window) for the specified [Universe](#universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the previous Fee Window for the specified Universe, as a 20-byte hexadecimal string.  If the Fee Window contract for the previous Fee Window does not exist yet, the address "0x0000000000000000000000000000000000000000" will be returned.

### augur.api.Universe.getRepMarketCapInAttoeth(p, callback)

Returns an estimate for the REP market cap of the specified [Universe](#universe). This estimate is updated manually by the Augur development team, roughly once every [Fee Window](#fee-window). It is used by Augur to set the price of the [Reporting Fee](#reporting-fee).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Estimated REP market cap of the specified Universe, priced in attoETH, as a stringified unsigned integer.

### augur.api.Universe.getReputationToken(p, callback)

Returns the Ethereum contract address of the [Reputation Token](#rep) for the specified [Universe](#universe). REP associated with this contract address are usable only within this Universe.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Reputation Token for the specified Universe.

### augur.api.Universe.getTargetRepMarketCapInAttoeth(p, callback)

Returns the [REP](#rep) market cap that Augur targets when calculating [Reporting Fees](#reporting-fee). Augur attempts to set Reporting Fees such that the REP market cap equals 7.5 times the amount of [Open Interest](#open-interest). 

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) REP market cap that Augur targets when calculating Reporting Fees, in [attoETH](#atto-prefix), as a stringified unsigned integer.

### augur.api.Universe.getWinningChildUniverse(p, callback)

Returns the Ethereum contract address of the [Winning Universe](#winning-universe) for a particular [Universe](#universe) that has [Forked](#fork).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (string) Ethereum contract address of the Winning Universe for a Universe that has Forked, as a 20-byte hexadecimal string.

### augur.api.Universe.isContainerForFeeToken(p, callback)

Returns whether the given [Universe](#universe) is a container for a particular [Fee Token](#fee-token). Every Fee Token belongs to a [Universe](#universe), and this method is used to see if a specific Fee Token address belongs to the Universe in question.

This call will fail if:

* The Universe is not a container for the Fee Window of the Fee Token.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyFeeToken`** (string) Ethereum contract address of the Fee Token for which to check if it belongs to the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Fee Token belongs to the Universe, or `false` otherwise.

### augur.api.Universe.isContainerForFeeWindow(p, callback)

Returns whether the given [Universe](#universe) is a container for a particular [Fee Window](#fee-window). Every Fee Window belongs to a [Universe](#universe), and this method is used to see if a specific Fee Window address belongs to the Universe in question.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyFeeWindow`** (string) Ethereum contract address of the Fee Window for which to check if it belongs to the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Fee Window belongs to the Universe, or `false` otherwise.

### augur.api.Universe.isContainerForMarket(p, callback)

Returns whether the specific `universe` is a container for the [Market](#market) `_shadyMarket` Ethereum address. All Markets are created within a [Universe](#universe), and this function is used to confirm if a Market exists within the Universe in question.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyMarket`** (string) Ethereum contract address of the Market for which to check if it belongs to the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Market belongs to the Universe, or `false` otherwise.

### augur.api.Universe.isContainerForReportingParticipant(p, callback)

Returns whether the specified [Universe](#universe) is a container for a particular Reporting Participant. Both the `DisputeCrowdsourcers` and `InitialReporter` classes in Augur's Solidity smart contracts are considered Reporting Participants, since they have the parent class `BaseReportingParticipant`.

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyReportingParticipant`** (string) Ethereum contract address of the Reporting Participant for which to check if it belongs to the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Reporting Participant belongs to the Universe, or `false` otherwise.

### augur.api.Universe.isContainerForShareToken(p, callback)

Returns whether the specific [Universe](#universe) is a container for a given Share Token. ([Shares](#share) are represented within Augur's smart contracts as [ERC-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md) tokens called Share Tokens.)

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyShareToken`** (string) Ethereum contract address of the Share Token for which to check if it belongs to the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the Share Token belongs to the Universe, or `false` otherwise.

### augur.api.Universe.isForking(p, callback)

Returns whether the specified [Universe](#universe) has a [Market](#market) that has [Forked](#fork).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the specified Universe has a Market that has Forked, or `false` otherwise.

### augur.api.Universe.isParentOf(p, callback)

Returns whether the [Universe](#universe) is the [Parent Universe](#parent-universe) for the specified [Child Universe](#child-universe).

#### **Parameters:**

* **`p`** (Object) Parameters object.  
    * **`p._shadyChild`** (string) Ethereum contract address of the Universe for which to check if it is a Child Universe of the Universe, as a 20-byte hexadecimal string.
    * **`p.tx`** (Object) Object containing details about how this function call should be made.
        * **`p.tx.to`** (string) Ethereum contract address of the Universe contract on which to call this function, as a 20-byte hexadecimal string.
* **`callback`** (function) &lt;optional> Called after the function's result has been retrieved.

#### **Returns:**

* (boolean) `true` if the specified Universe is a Child Universe, or `false` otherwise.
