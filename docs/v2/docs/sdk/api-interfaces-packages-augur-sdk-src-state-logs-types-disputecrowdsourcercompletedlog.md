---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog
title: DisputeCrowdsourcerCompletedLog
sidebar_label: DisputeCrowdsourcerCompletedLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [DisputeCrowdsourcerCompletedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

**↳ DisputeCrowdsourcerCompletedLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#blocknumber)
* [disputeCrowdsourcer](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#disputecrowdsourcer)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#market)
* [nextWindowStartTime](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#nextwindowstarttime)
* [pacingOn](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#pacingon)
* [size](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#size)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:44](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L44)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:43](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L43)*

___
<a id="nextwindowstarttime"></a>

###  nextWindowStartTime

**● nextWindowStartTime**: *[Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:46](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L46)*

___
<a id="pacingon"></a>

###  pacingOn

**● pacingOn**: *`boolean`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:47](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L47)*

___
<a id="size"></a>

###  size

**● size**: *`string`*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:45](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L45)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:42](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/logs/types.ts#L42)*

___

