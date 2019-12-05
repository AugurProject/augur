---
id: api-interfaces-augur-sdk-src-event-handlers-orderevent
title: OrderEvent
sidebar_label: OrderEvent
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/event-handlers Module]](api-modules-augur-sdk-src-event-handlers-module.md) > [OrderEvent](api-interfaces-augur-sdk-src-event-handlers-orderevent.md)

## Interface

## Hierarchy

↳  [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md)

**↳ OrderEvent**

### Properties

* [address](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#address)
* [addressData](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#addressdata)
* [blockHash](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#blocknumber)
* [contractName](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#contractname)
* [eventName](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#eventname)
* [eventType](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#eventtype)
* [logIndex](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#logindex)
* [market](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#market)
* [orderId](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#orderid)
* [orderType](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#ordertype)
* [removed](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#removed)
* [tradeGroupId](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#tradegroupid)
* [transactionHash](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#transactionindex)
* [uint256Data](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#uint256data)
* [universe](api-interfaces-augur-sdk-src-event-handlers-orderevent.md#universe)

---

## Properties

<a id="address"></a>

###  address

**● address**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[address](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L16)*

___
<a id="addressdata"></a>

###  addressData

**● addressData**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)[]*

*Defined in [augur-sdk/src/event-handlers.ts:189](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L189)*

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
<a id="eventtype"></a>

###  eventType

**● eventType**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:185](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L185)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[logIndex](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#logindex)*

*Defined in [augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L18)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:184](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L184)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [augur-sdk/src/event-handlers.ts:187](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L187)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *`string`*

*Defined in [augur-sdk/src/event-handlers.ts:186](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L186)*

___
<a id="removed"></a>

###  removed

**● removed**: *`boolean`*

*Inherited from [FormattedEventLog](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md).[removed](api-interfaces-augur-sdk-src-event-handlers-formattedeventlog.md#removed)*

*Defined in [augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L23)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-augur-sdk-src-event-handlers-module.md#bytes32)*

*Defined in [augur-sdk/src/event-handlers.ts:188](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L188)*

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
<a id="uint256data"></a>

###  uint256Data

**● uint256Data**: *`string`[]*

*Defined in [augur-sdk/src/event-handlers.ts:190](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L190)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-event-handlers-module.md#address)*

*Defined in [augur-sdk/src/event-handlers.ts:183](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/event-handlers.ts#L183)*

___

