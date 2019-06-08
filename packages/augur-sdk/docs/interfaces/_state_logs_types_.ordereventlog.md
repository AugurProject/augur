[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md) > [OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)

# Interface: OrderEventLog

## Hierarchy

 [Log](_state_logs_types_.log.md)

 [Doc](_state_logs_types_.doc.md)

 [Timestamped](_state_logs_types_.timestamped.md)

**↳ OrderEventLog**

## Index

### Properties

* [_id](_state_logs_types_.ordereventlog.md#_id)
* [_rev](_state_logs_types_.ordereventlog.md#_rev)
* [addressData](_state_logs_types_.ordereventlog.md#addressdata)
* [blockHash](_state_logs_types_.ordereventlog.md#blockhash)
* [blockNumber](_state_logs_types_.ordereventlog.md#blocknumber)
* [eventType](_state_logs_types_.ordereventlog.md#eventtype)
* [logIndex](_state_logs_types_.ordereventlog.md#logindex)
* [market](_state_logs_types_.ordereventlog.md#market)
* [orderId](_state_logs_types_.ordereventlog.md#orderid)
* [orderType](_state_logs_types_.ordereventlog.md#ordertype)
* [timestamp](_state_logs_types_.ordereventlog.md#timestamp)
* [tradeGroupId](_state_logs_types_.ordereventlog.md#tradegroupid)
* [transactionHash](_state_logs_types_.ordereventlog.md#transactionhash)
* [transactionIndex](_state_logs_types_.ordereventlog.md#transactionindex)
* [uint256Data](_state_logs_types_.ordereventlog.md#uint256data)
* [universe](_state_logs_types_.ordereventlog.md#universe)

---

## Properties

<a id="_id"></a>

###  _id

**● _id**: *`string`*

*Inherited from [Doc](_state_logs_types_.doc.md).[_id](_state_logs_types_.doc.md#_id)*

*Defined in [state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L7)*

___
<a id="_rev"></a>

###  _rev

**● _rev**: *`string`*

*Inherited from [Doc](_state_logs_types_.doc.md).[_rev](_state_logs_types_.doc.md#_rev)*

*Defined in [state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L8)*

___
<a id="addressdata"></a>

###  addressData

**● addressData**: *`Array`<[Address](../modules/_state_logs_types_.md#address)>*

*Defined in [state/logs/types.ts:164](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L164)*

___
<a id="blockhash"></a>

###  blockHash

**● blockHash**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Inherited from [Log](_state_logs_types_.log.md).[blockHash](_state_logs_types_.log.md#blockhash)*

*Defined in [state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L17)*

___
<a id="blocknumber"></a>

###  blockNumber

**● blockNumber**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[blockNumber](_state_logs_types_.log.md#blocknumber)*

*Defined in [state/logs/types.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L16)*

___
<a id="eventtype"></a>

###  eventType

**● eventType**: *[OrderEventType](../enums/_state_logs_types_.ordereventtype.md)*

*Defined in [state/logs/types.ts:160](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L160)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[logIndex](_state_logs_types_.log.md#logindex)*

*Defined in [state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L20)*

___
<a id="market"></a>

###  market

**● market**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:159](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L159)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Defined in [state/logs/types.ts:162](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L162)*

___
<a id="ordertype"></a>

###  orderType

**● orderType**: *[OrderType](../enums/_state_logs_types_.ordertype.md)*

*Defined in [state/logs/types.ts:161](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L161)*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *[Timestamp](../modules/_state_logs_types_.md#timestamp)*

*Inherited from [Timestamped](_state_logs_types_.timestamped.md).[timestamp](_state_logs_types_.timestamped.md#timestamp)*

*Defined in [state/logs/types.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L12)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Defined in [state/logs/types.ts:163](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L163)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *[Bytes32](../modules/_state_logs_types_.md#bytes32)*

*Inherited from [Log](_state_logs_types_.log.md).[transactionHash](_state_logs_types_.log.md#transactionhash)*

*Defined in [state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L19)*

___
<a id="transactionindex"></a>

###  transactionIndex

**● transactionIndex**: *`number`*

*Inherited from [Log](_state_logs_types_.log.md).[transactionIndex](_state_logs_types_.log.md#transactionindex)*

*Defined in [state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L18)*

___
<a id="uint256data"></a>

###  uint256Data

**● uint256Data**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:165](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L165)*

___
<a id="universe"></a>

###  universe

**● universe**: *[Address](../modules/_state_logs_types_.md#address)*

*Defined in [state/logs/types.ts:158](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L158)*

___

