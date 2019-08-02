---
id: api-interfaces-packages-augur-sdk-src-event-handlers-universecreated
title: UniverseCreated
sidebar_label: UniverseCreated
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/event-handlers Module]](api-modules-packages-augur-sdk-src-event-handlers-module.md) > [UniverseCreated](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md)

## Interface

## Hierarchy

 [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ UniverseCreated**

### Properties

* [address](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#address)
* [blockHash](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#blocknumber)
* [childUniverse](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#childuniverse)
* [contractName](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#contractname)
* [eventName](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#eventname)
* [logIndex](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#logindex)
* [parentUniverse](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#parentuniverse)
* [payoutNumerators](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#payoutnumerators)
* [removed](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#removed)
* [transactionHash](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-event-handlers-universecreated.md#transactionindex)

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
<a id="childuniverse"></a>

###  childUniverse

**● childUniverse**: *[Address](api-modules-packages-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:274](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L274)*

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
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:11](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L11)*

___
<a id="parentuniverse"></a>

###  parentUniverse

**● parentUniverse**: *[Address](api-modules-packages-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:273](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L273)*

___
<a id="payoutnumerators"></a>

###  payoutNumerators

**● payoutNumerators**: *`string`[]*

*Defined in [packages/augur-sdk/src/event-handlers.ts:275](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L275)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-packages-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/event-handlers.ts#L17)*

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

