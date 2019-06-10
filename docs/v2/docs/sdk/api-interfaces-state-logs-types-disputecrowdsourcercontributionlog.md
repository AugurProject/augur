---
id: api-interfaces-state-logs-types-disputecrowdsourcercontributionlog
title: DisputeCrowdsourcerContributionLog
sidebar_label: DisputeCrowdsourcerContributionLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ DisputeCrowdsourcerContributionLog**

### Properties

* [_id](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#_id)
* [_rev](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#_rev)
* [amountStaked](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#amountstaked)
* [blockHash](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#blocknumber)
* [description](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#description)
* [disputeCrowdsourcer](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#disputecrowdsourcer)
* [logIndex](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#logindex)
* [market](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#market)
* [payoutNumerators](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#payoutnumerators)
* [reporter](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#reporter)
* [timestamp](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md#universe)

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
<a id="amountstaked"></a>

###  amountStaked

**● amountStaked**: *`string`*

*Defined in [state/logs/types.ts:55](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L55)*

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
<a id="description"></a>

###  description

**● description**: *`string`*

*Defined in [state/logs/types.ts:56](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L56)*

___
<a id="disputecrowdsourcer"></a>

###  disputeCrowdsourcer

**● disputeCrowdsourcer**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:53](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L53)*

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

*Defined in [state/logs/types.ts:52](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L52)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *[PayoutNumerators](api-modules-state-logs-types-module.md#payoutnumerators)*

*Defined in [state/logs/types.ts:54](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L54)*

___
<a id="reporter"></a>

###  reporter

**● reporter**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:51](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L51)*

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

*Defined in [state/logs/types.ts:50](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L50)*

___

