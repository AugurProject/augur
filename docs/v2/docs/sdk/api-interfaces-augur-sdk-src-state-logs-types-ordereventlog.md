---
id: api-interfaces-augur-sdk-src-state-logs-types-ordereventlog
title: OrderEventLog
sidebar_label: OrderEventLog
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/logs/types Module]](api-modules-augur-sdk-src-state-logs-types-module.md) > [OrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md)

## Interface

## Hierarchy

 [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)

 [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)

**↳ OrderEventLog**

### Properties

* [addressData](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#addressdata)
* [blockHash](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#blockhash)
* [blockNumber](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#blocknumber)
* [eventType](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#eventtype)
* [logIndex](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#logindex)
* [market](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#market)
* [orderId](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#orderid)
* [orderType](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#ordertype)
* [timestamp](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#timestamp)
* [tradeGroupId](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#tradegroupid)
* [transactionHash](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#transactionhash)
* [transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#transactionindex)
* [uint256Data](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#uint256data)
* [universe](api-interfaces-augur-sdk-src-state-logs-types-ordereventlog.md#universe)

---

## Properties

<a id="addressdata"></a>

###  addressData

**● addressData**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)[]*

*Defined in [augur-sdk/src/state/logs/types.ts:213](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L213)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#blockhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L21)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[blockNumber](api-interfaces-augur-sdk-src-state-logs-types-log.md#blocknumber)*

*Defined in [augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](api-enums-augur-sdk-src-state-logs-types-ordereventtype.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:209](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L209)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[logIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#logindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L24)*

___
<a id="market"></a>

###  market

**● market**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:208](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L208)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [augur-sdk/src/state/logs/types.ts:211](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L211)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](api-enums-augur-sdk-src-state-logs-types-ordertype.md)*

*Defined in [augur-sdk/src/state/logs/types.ts:210](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L210)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](api-modules-augur-sdk-src-state-logs-types-module.md#timestamp)*

*Inherited from [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md).[timestamp](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md#timestamp)*

*Defined in [augur-sdk/src/state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Defined in [augur-sdk/src/state/logs/types.ts:212](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L212)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](api-modules-augur-sdk-src-state-logs-types-module.md#bytes32)*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionHash](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionhash)*

*Defined in [augur-sdk/src/state/logs/types.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L23)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md).[transactionIndex](api-interfaces-augur-sdk-src-state-logs-types-log.md#transactionindex)*

*Defined in [augur-sdk/src/state/logs/types.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L22)*

___
<a id="uint256data"></a>

###  uint256Data

**● uint256Data**: *`string`[]*

*Defined in [augur-sdk/src/state/logs/types.ts:214](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L214)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*

*Defined in [augur-sdk/src/state/logs/types.ts:207](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/logs/types.ts#L207)*

___

