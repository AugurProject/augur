---
id: api-interfaces-augur-sdk-src-event-handlers-universeforked
title: UniverseForked
sidebar_label: UniverseForked
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [UniverseForked](api-interfaces-augur-sdk-src-event-handlers-universeforked.md)

## Interface

## Hierarchy

↳  [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ UniverseForked**

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#address)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#blocknumber)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#contractname)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#eventname)
* [forkingMarket](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#forkingmarket)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#logindex)
* [removed](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#removed)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#transactionindex)
* [universe](api-interfaces-augur-sdk-src-event-handlers-universeforked.md#universe)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Overrides [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[address](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:283](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L283)*

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
<a id="forkingmarket"></a>

###  forkingMarket

**● forkingMarket**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:285](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L285)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L23)*

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
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:284](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L284)*

___

