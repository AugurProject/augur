---
id: api-interfaces-state-logs-types-tradingproceedsclaimedlog
title: TradingProceedsClaimedLog
sidebar_label: TradingProceedsClaimedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ TradingProceedsClaimedLog**

### Properties

* [_id](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#_rev)
* [blockHash](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#blocknumber)
* [fees](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#fees)
* [finalTokenBalance](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#finaltokenbalance)
* [logIndex](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#logindex)
* [market](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#market)
* [numPayoutTokens](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#numpayouttokens)
* [numShares](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#numshares)
* [outcome](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#outcome)
* [sender](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#sender)
* [shareToken](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#sharetoken)
* [timestamp](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-state-logs-types-doc.md).[_id](api-interfaces-state-logs-types-doc.md#_id)*

*Defined in [state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-state-logs-types-doc.md).[_rev](api-interfaces-state-logs-types-doc.md#_rev)*

*Defined in [state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[blockHash](api-interfaces-state-logs-types-log.md#blockhash)*

*Defined in [state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[blockNumber](api-interfaces-state-logs-types-log.md#blocknumber)*

*Defined in [state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="fees"></a>

###  fees

**● fees**: *`string`*

*Defined in [state/logs/types.ts:246](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L246)*

___
<a id="finaltokenbalance"></a>

###  finalTokenBalance

**● finalTokenBalance**: *`string`*

*Defined in [state/logs/types.ts:245](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L245)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[logIndex](api-interfaces-state-logs-types-log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:241](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L241)*

___
<a id="numpayouttokens"></a>

###  numPayoutTokens

**● numPayoutTokens**: *`string`*

*Defined in [state/logs/types.ts:244](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L244)*

___
<a id="numshares"></a>

###  numShares

**● numShares**: *`string`*

*Defined in [state/logs/types.ts:243](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L243)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`string`*

*Defined in [state/logs/types.ts:242](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L242)*

___
<a id="sender"></a>

###  sender

**● sender**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:240](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L240)*

___
<a id="sharetoken"></a>

###  shareToken

**● shareToken**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:239](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L239)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-state-logs-types-timestamped.md).[timestamp](api-interfaces-state-logs-types-timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[transactionHash](api-interfaces-state-logs-types-log.md#transactionhash)*

*Defined in [state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[transactionIndex](api-interfaces-state-logs-types-log.md#transactionindex)*

*Defined in [state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:238](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L238)*

___

