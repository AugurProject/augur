---
id: api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog
title: DisputeCrowdsourcerRedeemedLog
sidebar_label: DisputeCrowdsourcerRedeemedLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

 [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)

**↳ DisputeCrowdsourcerRedeemedLog**

### Properties

* [amountRedeemed](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#amountredeemed)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#blocknumber)
* [disputeCrowdsourcer](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#disputecrowdsourcer)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#market)
* [payoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#payoutnumerators)
* [repReceived](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#repreceived)
* [reporter](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#reporter)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#timestamp)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md#universe)

---

## Properties

<a id="amountredeemed"></a>

###  amountRedeemed

**● amountRedeemed**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:87](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L87)*

___
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

*Defined in [augur-sdk/src/state/logs/types.ts:86](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L86)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:85](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L85)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-augur-sdk-src-state-logs-types-module.md#payoutnumerators)*

*Defined in [augur-sdk/src/state/logs/types.ts:89](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L89)*

___
<a id="repreceived"></a>

###  repReceived

**● repReceived**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:88](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L88)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:84](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L84)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L16)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:83](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L83)*

___

