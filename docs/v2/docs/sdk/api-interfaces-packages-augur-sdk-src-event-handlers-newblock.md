---
id: api-interfaces-packages-augur-sdk-src-event-handlers-newblock
title: NewBlock
sidebar_label: NewBlock
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/event-handlers Module]](api-modules-packages-augur-sdk-src-event-handlers-module.md) > [NewBlock](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md)

## Interface

## Hierarchy

 [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ NewBlock**

### Properties

* [address](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#address)
* [blockHash](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#blocknumber)
* [blocksBehindCurrent](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#blocksbehindcurrent)
* [contractName](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#contractname)
* [eventName](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#eventname)
* [highestAvailableBlockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#highestavailableblocknumber)
* [lastSyncedBlockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#lastsyncedblocknumber)
* [logIndex](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#logindex)
* [percentSynced](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#percentsynced)
* [removed](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#removed)
* [timestamp](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#timestamp)
* [transactionHash](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-event-handlers-newblock.md#transactionindex)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-packages-augur-sdk-src-event-handlers-module.md#address)*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[address](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:9](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L9)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[blockHash](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#blockhash)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[blockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#blocknumber)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:10](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L10)*

___
<a id="blocksbehindcurrent"></a>

###  blocksBehindCurrent

**● blocksBehindCurrent**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:169](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L169)*

___
<a id="contractname"></a>

###  contractName

**● contractName**: *`string`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[contractName](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#contractname)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:14](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L14)*

___
<a id="eventname"></a>

###  eventName

**● eventName**: *`string`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[eventName](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#eventname)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:15](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L15)*

___
<a id="highestavailableblocknumber"></a>

###  highestAvailableBlockNumber

**● highestAvailableBlockNumber**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:170](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L170)*

___
<a id="lastsyncedblocknumber"></a>

###  lastSyncedBlockNumber

**● lastSyncedBlockNumber**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:171](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L171)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:11](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L11)*

___
<a id="percentsynced"></a>

###  percentSynced

**● percentSynced**: *`string`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:172](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L172)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L17)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`number`*

*Defined in [packages/augur-sdk/src/event-handlers.ts:173](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L173)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionHash](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#transactionhash)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L12)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#transactionindex)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:13](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L13)*

___

