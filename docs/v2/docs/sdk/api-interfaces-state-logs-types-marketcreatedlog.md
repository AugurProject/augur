---
id: api-interfaces-state-logs-types-marketcreatedlog
title: MarketCreatedLog
sidebar_label: MarketCreatedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ MarketCreatedLog**

### Properties

* [_id](api-interfaces-state-logs-types-marketcreatedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-marketcreatedlog.md#_rev)
* [blockHash](api-interfaces-state-logs-types-marketcreatedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-marketcreatedlog.md#blocknumber)
* [designatedReporter](api-interfaces-state-logs-types-marketcreatedlog.md#designatedreporter)
* [endTime](api-interfaces-state-logs-types-marketcreatedlog.md#endtime)
* [extraInfo](api-interfaces-state-logs-types-marketcreatedlog.md#extrainfo)
* [feeDivisor](api-interfaces-state-logs-types-marketcreatedlog.md#feedivisor)
* [logIndex](api-interfaces-state-logs-types-marketcreatedlog.md#logindex)
* [market](api-interfaces-state-logs-types-marketcreatedlog.md#market)
* [marketCreator](api-interfaces-state-logs-types-marketcreatedlog.md#marketcreator)
* [marketType](api-interfaces-state-logs-types-marketcreatedlog.md#markettype)
* [numTicks](api-interfaces-state-logs-types-marketcreatedlog.md#numticks)
* [outcomes](api-interfaces-state-logs-types-marketcreatedlog.md#outcomes)
* [prices](api-interfaces-state-logs-types-marketcreatedlog.md#prices)
* [timestamp](api-interfaces-state-logs-types-marketcreatedlog.md#timestamp)
* [topic](api-interfaces-state-logs-types-marketcreatedlog.md#topic)
* [transactionHash](api-interfaces-state-logs-types-marketcreatedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-marketcreatedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-marketcreatedlog.md#universe)

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
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:111](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L111)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Timestamp](api-modules-state-logs-types-module.md#timestamp)*

*Defined in [state/logs/types.ts:106](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L106)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *`string`*

*Defined in [state/logs/types.ts:108](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L108)*

___
<a id="feedivisor"></a>

###  feeDivisor

**● feeDivisor**: *`string`*

*Defined in [state/logs/types.ts:112](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L112)*

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

*Defined in [state/logs/types.ts:109](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L109)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:110](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L110)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](api-enums-state-logs-types-markettype.md)*

*Defined in [state/logs/types.ts:114](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L114)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [state/logs/types.ts:115](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L115)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:116](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L116)*

___
<a id="prices"></a>

###  prices

**● prices**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:113](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L113)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-state-logs-types-timestamped.md).[timestamp](api-interfaces-state-logs-types-timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="topic"></a>

###  topic

**● topic**: *`string`*

*Defined in [state/logs/types.ts:107](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L107)*

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

*Defined in [state/logs/types.ts:105](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L105)*

___

