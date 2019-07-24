---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog
title: MarketFinalizedLog
sidebar_label: MarketFinalizedLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

 [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md)

**↳ MarketFinalizedLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#_rev)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#blocknumber)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#market)
* [timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#timestamp)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#transactionindex)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#universe)
* [winningPayoutNumerators](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md#winningpayoutnumerators)

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
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:134](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L134)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L12)*

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

*Defined in [packages/augur-sdk/src/state/logs/types.ts:133](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L133)*

___
<a id="winningpayoutnumerators"></a>

###  winningPayoutNumerators

**● winningPayoutNumerators**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:135](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/logs/types.ts#L135)*

___

