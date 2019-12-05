---
id: api-interfaces-augur-sdk-src-event-handlers-universecreated
title: UniverseCreated
sidebar_label: UniverseCreated
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [UniverseCreated](api-interfaces-augur-sdk-src-event-handlers-universecreated.md)

## Interface

## Hierarchy

↳  [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ UniverseCreated**

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#address)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#blocknumber)
* [childUniverse](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#childuniverse)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#contractname)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#eventname)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#logindex)
* [parentUniverse](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#parentuniverse)
* [payoutNumerators](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#payoutnumerators)
* [removed](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#removed)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-universecreated.md#transactionindex)

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
<a id="childuniverse"></a>

###  childUniverse

**● childUniverse**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:278](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L278)*

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
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="parentuniverse"></a>

###  parentUniverse

**● parentUniverse**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:277](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L277)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *`string`[]*

*Defined in [augur-sdk/src/event-handlers.ts:279](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L279)*

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

