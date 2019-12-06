---
id: api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog
title: DisputeCrowdsourcerContributionLog
sidebar_label: DisputeCrowdsourcerContributionLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

 [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)

**↳ DisputeCrowdsourcerContributionLog**

### Properties

* [amountStaked](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#amountstaked)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#blocknumber)
* [description](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#description)
* [disputeCrowdsourcer](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#disputecrowdsourcer)
* [disputeRound](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#disputeround)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#market)
* [payoutNumerators](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#payoutnumerators)
* [reporter](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#reporter)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#timestamp)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md#universe)

---

## Properties

<a id="amountstaked"></a>

###  amountStaked

**● amountStaked**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L68)*

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
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:69](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L69)*

___
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:66](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L66)*

___
<a id="disputeround"></a>

###  disputeRound

**● disputeRound**: *`string`*

*Defined in [augur-sdk/src/state/logs/types.ts:70](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L70)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L65)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-augur-sdk-src-state-logs-types-module.md#payoutnumerators)*

*Defined in [augur-sdk/src/state/logs/types.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L67)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:64](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L64)*

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

*Defined in [augur-sdk/src/state/logs/types.ts:63](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L63)*

___

