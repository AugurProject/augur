---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog
title: MarketOIChangedLog
sidebar_label: MarketOIChangedLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [MarketOIChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

**↳ MarketOIChangedLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#blocknumber)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#market)
* [marketOI](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#marketoi)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:165](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L165)*

___
<a id="marketoi"></a>

###  marketOI

**● marketOI**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:166](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L166)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:164](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L164)*

___

