---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog
title: MarketCreatedLog
sidebar_label: MarketCreatedLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

 [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md)

**↳ MarketCreatedLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#blocknumber)
* [designatedReporter](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#designatedreporter)
* [endTime](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#endtime)
* [extraInfo](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#extrainfo)
* [feeDivisor](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#feedivisor)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#market)
* [marketCreator](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#marketcreator)
* [marketType](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#markettype)
* [numTicks](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#numticks)
* [outcomes](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#outcomes)
* [prices](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#prices)
* [timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#timestamp)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:123](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L123)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:119](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L119)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:120](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L120)*

___
<a id="feedivisor"></a>

###  feeDivisor

**● feeDivisor**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:124](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L124)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:121](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L121)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:122](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L122)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](api-enums-packages-augur-sdk-src-state-logs-types-markettype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:126](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L126)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:127](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L127)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:128](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L128)*

___
<a id="prices"></a>

###  prices

**● prices**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:125](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L125)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Overrides [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:129](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L129)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:118](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L118)*

___

