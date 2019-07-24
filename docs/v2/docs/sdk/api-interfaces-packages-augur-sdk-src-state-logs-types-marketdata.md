---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata
title: MarketData
sidebar_label: MarketData
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

**↳ MarketData**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#blocknumber)
* [designatedReporter](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#designatedreporter)
* [endTime](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#endtime)
* [extraInfo](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#extrainfo)
* [feeDivisor](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#feedivisor)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#market)
* [marketCreator](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#marketcreator)
* [marketOI](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#marketoi)
* [marketType](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#markettype)
* [numTicks](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#numticks)
* [outcomeVolumes](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#outcomevolumes)
* [outcomes](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#outcomes)
* [prices](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#prices)
* [timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#timestamp)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#universe)
* [volume](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md#volume)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="designatedreporter"></a>

###  designatedReporter

**● designatedReporter**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:324](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L324)*

___
<a id="endtime"></a>

###  endTime

**● endTime**: *[Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:320](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L320)*

___
<a id="extrainfo"></a>

###  extraInfo

**● extraInfo**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:321](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L321)*

___
<a id="feedivisor"></a>

###  feeDivisor

**● feeDivisor**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:325](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L325)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:322](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L322)*

___
<a id="marketcreator"></a>

###  marketCreator

**● marketCreator**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:323](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L323)*

___
<a id="marketoi"></a>

###  marketOI

**● marketOI**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:333](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L333)*

___
<a id="markettype"></a>

###  marketType

**● marketType**: *[MarketType](api-enums-packages-augur-sdk-src-state-logs-types-markettype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:327](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L327)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:328](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L328)*

___
<a id="outcomevolumes"></a>

###  outcomeVolumes

**● outcomeVolumes**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:332](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L332)*

___
<a id="outcomes"></a>

###  outcomes

**● outcomes**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:329](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L329)*

___
<a id="prices"></a>

###  prices

**● prices**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:326](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L326)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:330](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L330)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:319](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L319)*

___
<a id="volume"></a>

###  volume

**● volume**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:331](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L331)*

___

