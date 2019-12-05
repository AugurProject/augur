---
id: api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog
title: DisputeCrowdsourcerCreatedLog
sidebar_label: DisputeCrowdsourcerCreatedLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [DisputeCrowdsourcerCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

**↳ DisputeCrowdsourcerCreatedLog**

### Properties

* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#blocknumber)
* [disputeCrowdsourcer](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#disputecrowdsourcer)
* [disputeRound](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#disputeround)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#market)
* [payoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#payoutnumerators)
* [size](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#size)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md#universe)

---

## Properties

<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:76](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L76)*

___
<a id="disputeround"></a>

###  disputeRound

**● disputeRound**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:79](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L79)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:75](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L75)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-augur-sdk-src-state-logs-types-module.md#payoutnumerators)*

*Defined in [augur-sdk/src/state/logs/types.ts:77](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L77)*

___
<a id="size"></a>

###  size

**● size**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:78](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L78)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:74](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L74)*

___

