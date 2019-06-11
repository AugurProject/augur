---
id: api-interfaces-state-logs-types-ordereventlog
title: OrderEventLog
sidebar_label: OrderEventLog
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md) > [OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-state-logs-types-log.md)

 [Doc](api-interfaces-state-logs-types-doc.md)

 [Timestamped](api-interfaces-state-logs-types-timestamped.md)

**↳ OrderEventLog**

### Properties

* [_id](api-interfaces-state-logs-types-ordereventlog.md#_id)
* [_rev](api-interfaces-state-logs-types-ordereventlog.md#_rev)
* [addressData](api-interfaces-state-logs-types-ordereventlog.md#addressdata)
* [blockHash](api-interfaces-state-logs-types-ordereventlog.md#blockhash)
* [blockNumber](api-interfaces-state-logs-types-ordereventlog.md#blocknumber)
* [eventType](api-interfaces-state-logs-types-ordereventlog.md#eventtype)
* [logIndex](api-interfaces-state-logs-types-ordereventlog.md#logindex)
* [market](api-interfaces-state-logs-types-ordereventlog.md#market)
* [orderId](api-interfaces-state-logs-types-ordereventlog.md#orderid)
* [orderType](api-interfaces-state-logs-types-ordereventlog.md#ordertype)
* [timestamp](api-interfaces-state-logs-types-ordereventlog.md#timestamp)
* [tradeGroupId](api-interfaces-state-logs-types-ordereventlog.md#tradegroupid)
* [transactionHash](api-interfaces-state-logs-types-ordereventlog.md#transactionhash)
* [transactionIndex](api-interfaces-state-logs-types-ordereventlog.md#transactionindex)
* [uint256Data](api-interfaces-state-logs-types-ordereventlog.md#uint256data)
* [universe](api-interfaces-state-logs-types-ordereventlog.md#universe)

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
<a id="addressdata"></a>

###  addressData

**● addressData**: *`Array`<[Address](api-modules-state-logs-types-module.md#address)>*

*Defined in [state/logs/types.ts:164](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L164)*

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
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](api-enums-state-logs-types-ordereventtype.md)*

*Defined in [state/logs/types.ts:160](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L160)*

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

*Defined in [state/logs/types.ts:159](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L159)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Defined in [state/logs/types.ts:162](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L162)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](api-enums-state-logs-types-ordertype.md)*

*Defined in [state/logs/types.ts:161](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L161)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-state-logs-types-timestamped.md).[timestamp](api-interfaces-state-logs-types-timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-state-logs-types-module.md#bytes32)*

*Defined in [state/logs/types.ts:163](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L163)*

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
<a id="uint256data"></a>

###  uint256Data

**● uint256Data**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:165](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L165)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-state-logs-types-module.md#address)*

*Defined in [state/logs/types.ts:158](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L158)*

___

