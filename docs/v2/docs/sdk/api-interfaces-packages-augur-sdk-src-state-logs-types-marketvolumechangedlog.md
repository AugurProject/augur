---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog
title: MarketVolumeChangedLog
sidebar_label: MarketVolumeChangedLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

**↳ MarketVolumeChangedLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#blocknumber)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#market)
* [outcomeVolumes](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#outcomevolumes)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#universe)
* [volume](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md#volume)

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

*Defined in [packages/augur-sdk/src/state/logs/types.ts:158](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L158)*

___
<a id="outcomevolumes"></a>

###  outcomeVolumes

**● outcomeVolumes**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:160](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L160)*

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

*Defined in [packages/augur-sdk/src/state/logs/types.ts:157](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L157)*

___
<a id="volume"></a>

###  volume

**● volume**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:159](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/logs/types.ts#L159)*

___

