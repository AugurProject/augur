---
id: api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog
title: OrderEventLog
sidebar_label: OrderEventLog
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/logs/types Module]](api-modules-packages-augur-sdk-src-state-logs-types-module.md) > [OrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md)

 [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)

 [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md)

**↳ OrderEventLog**

### Properties

* [_id](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#_id)
* [_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#_rev)
* [addressData](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#addressdata)
* [blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#blockhash)
* [blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#blocknumber)
* [eventType](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#eventtype)
* [logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#logindex)
* [market](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#market)
* [orderId](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#orderid)
* [orderType](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#ordertype)
* [timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#timestamp)
* [tradeGroupId](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#tradegroupid)
* [transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#transactionhash)
* [transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#transactionindex)
* [uint256Data](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#uint256data)
* [universe](api-interfaces-packages-augur-sdk-src-state-logs-types-ordereventlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_id](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_id)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md).[_rev](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md#_rev)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="addressdata"></a>

###  addressData

**● addressData**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:190](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L190)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](api-enums-packages-augur-sdk-src-state-logs-types-ordereventtype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:186](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L186)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:185](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L185)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:188](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L188)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](api-enums-packages-augur-sdk-src-state-logs-types-ordertype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:187](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L187)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-packages-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:189](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L189)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-packages-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-packages-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="uint256data"></a>

###  uint256Data

**● uint256Data**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:191](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L191)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-packages-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:184](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/logs/types.ts#L184)*

___

