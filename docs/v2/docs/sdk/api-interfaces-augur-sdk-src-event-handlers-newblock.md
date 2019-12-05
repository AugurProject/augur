---
id: api-interfaces-augur-sdk-src-event-handlers-newblock
title: NewBlock
sidebar_label: NewBlock
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [NewBlock](api-interfaces-augur-sdk-src-event-handlers-newblock.md)

## Interface

## Hierarchy

↳  [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ NewBlock**

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-newblock.md#address)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-newblock.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-newblock.md#blocknumber)
* [blocksBehindCurrent](api-interfaces-augur-sdk-src-event-handlers-newblock.md#blocksbehindcurrent)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-newblock.md#contractname)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-newblock.md#eventname)
* [highestAvailableBlockNumber](api-interfaces-augur-sdk-src-event-handlers-newblock.md#highestavailableblocknumber)
* [lastSyncedBlockNumber](api-interfaces-augur-sdk-src-event-handlers-newblock.md#lastsyncedblocknumber)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-newblock.md#logindex)
* [percentSynced](api-interfaces-augur-sdk-src-event-handlers-newblock.md#percentsynced)
* [removed](api-interfaces-augur-sdk-src-event-handlers-newblock.md#removed)
* [timestamp](api-interfaces-augur-sdk-src-event-handlers-newblock.md#timestamp)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-newblock.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-newblock.md#transactionindex)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[address](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[blockHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blockhash)*

*Defined in [augur-sdk/src/event-handlers.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L22)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[blockNumber](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#blocknumber)*

*Defined in [augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L17)*

___
<a id="blocksbehindcurrent"></a>

###  blocksBehindCurrent

**● blocksBehindCurrent**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:174](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L174)*

___
<a id="contractname"></a>

###  contractName

**● contractName**: *`string`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[contractName](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#contractname)*

*Defined in [augur-sdk/src/event-handlers.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L21)*

___
<a id="eventname"></a>

###  eventName

**● eventName**: *`string`*

*Inherited from [Event](api-interfaces-augur-sdk-src-event-handlers-event.md).[eventName](api-interfaces-augur-sdk-src-event-handlers-event.md#eventname)*

*Defined in [augur-sdk/src/event-handlers.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L8)*

___
<a id="highestavailableblocknumber"></a>

###  highestAvailableBlockNumber

**● highestAvailableBlockNumber**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:175](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L175)*

___
<a id="lastsyncedblocknumber"></a>

###  lastSyncedBlockNumber

**● lastSyncedBlockNumber**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:176](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L176)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="percentsynced"></a>

###  percentSynced

**● percentSynced**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:177](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L177)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L23)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`number`*

*Defined in [augur-sdk/src/event-handlers.ts:178](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L178)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionHash](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionhash)*

*Defined in [augur-sdk/src/event-handlers.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[transactionIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#transactionindex)*

*Defined in [augur-sdk/src/event-handlers.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L20)*

___

