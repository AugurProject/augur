---
id: api-interfaces-state-logs-types-completesetspurchasedlog
title: CompleteSetsPurchasedLog
sidebar_label: CompleteSetsPurchasedLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ CompleteSetsPurchasedLog**

### Properties

* [_id](api-interfaces-state-logs-types-completesetspurchasedlog.md#_id)
* [_rev](api-interfaces-state-logs-types-completesetspurchasedlog.md#_rev)
* [account](api-interfaces-state-logs-types-completesetspurchasedlog.md#account)
* [blockHash](api-interfaces-state-logs-types-completesetspurchasedlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-completesetspurchasedlog.md#blocknumber)
* [logIndex](api-interfaces-state-logs-types-completesetspurchasedlog.md#logindex)
* [market](api-interfaces-state-logs-types-completesetspurchasedlog.md#market)
* [marketOI](api-interfaces-state-logs-types-completesetspurchasedlog.md#marketoi)
* [numCompleteSets](api-interfaces-state-logs-types-completesetspurchasedlog.md#numcompletesets)
* [timestamp](api-interfaces-state-logs-types-completesetspurchasedlog.md#timestamp)
* [transactionHash](api-interfaces-state-logs-types-completesetspurchasedlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-completesetspurchasedlog.md#transactionindex)
* [universe](api-interfaces-state-logs-types-completesetspurchasedlog.md#universe)

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
<a id="account"></a>

###  account

**● account**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:26](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L26)*

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
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-state-logs-types-log.md).[logIndex](api-interfaces-state-logs-types-log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:25](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L25)*

___
<a id="marketoi"></a>

###  marketOI

**● marketOI**: *`string`*

*Defined in [state/logs/types.ts:28](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L28)*

___
<a id="numcompletesets"></a>

###  numCompleteSets

**● numCompleteSets**: *`string`*

*Defined in [state/logs/types.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L27)*

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

*Defined in [state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L24)*

___

