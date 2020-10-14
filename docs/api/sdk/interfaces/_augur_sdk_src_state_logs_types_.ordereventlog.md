[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](../modules/_augur_sdk_src_state_logs_types_.md) › [OrderEventLog](_augur_sdk_src_state_logs_types_.ordereventlog.md)

# Interface: OrderEventLog

## Hierarchy

  ↳ [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md)

  ↳ **OrderEventLog**

## Index

### Properties

* [addressData](_augur_sdk_src_state_logs_types_.ordereventlog.md#addressdata)
* [blockHash](_augur_sdk_src_state_logs_types_.ordereventlog.md#blockhash)
* [blockNumber](_augur_sdk_src_state_logs_types_.ordereventlog.md#blocknumber)
* [eventType](_augur_sdk_src_state_logs_types_.ordereventlog.md#eventtype)
* [logIndex](_augur_sdk_src_state_logs_types_.ordereventlog.md#logindex)
* [market](_augur_sdk_src_state_logs_types_.ordereventlog.md#market)
* [orderId](_augur_sdk_src_state_logs_types_.ordereventlog.md#orderid)
* [orderType](_augur_sdk_src_state_logs_types_.ordereventlog.md#ordertype)
* [timestamp](_augur_sdk_src_state_logs_types_.ordereventlog.md#timestamp)
* [tradeGroupId](_augur_sdk_src_state_logs_types_.ordereventlog.md#tradegroupid)
* [transactionHash](_augur_sdk_src_state_logs_types_.ordereventlog.md#transactionhash)
* [transactionIndex](_augur_sdk_src_state_logs_types_.ordereventlog.md#transactionindex)
* [uint256Data](_augur_sdk_src_state_logs_types_.ordereventlog.md#uint256data)
* [universe](_augur_sdk_src_state_logs_types_.ordereventlog.md#universe)

## Properties

###  addressData

• **addressData**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:220](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L220)*

___

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockHash](_augur_sdk_src_state_logs_types_.log.md#blockhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L18)*

___

###  blockNumber

• **blockNumber**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[blockNumber](_augur_sdk_src_state_logs_types_.log.md#blocknumber)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L17)*

___

###  eventType

• **eventType**: *[OrderEventType](../enums/_augur_sdk_src_state_logs_types_.ordereventtype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:216](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L216)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[logIndex](_augur_sdk_src_state_logs_types_.log.md#logindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L21)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:215](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L215)*

___

###  orderId

• **orderId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:218](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L218)*

___

###  orderType

• **orderType**: *[OrderType](../enums/_augur_sdk_src_state_logs_types_.ordertype.md)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:217](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L217)*

___

###  timestamp

• **timestamp**: *[LogTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#logtimestamp)*

*Inherited from [TimestampedLog](_augur_sdk_src_state_logs_types_.timestampedlog.md).[timestamp](_augur_sdk_src_state_logs_types_.timestampedlog.md#timestamp)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L25)*

___

###  tradeGroupId

• **tradeGroupId**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:219](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L219)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_state_logs_types_.md#bytes32)*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionHash](_augur_sdk_src_state_logs_types_.log.md#transactionhash)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Inherited from [Log](_augur_sdk_src_state_logs_types_.log.md).[transactionIndex](_augur_sdk_src_state_logs_types_.log.md#transactionindex)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L19)*

___

###  uint256Data

• **uint256Data**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:221](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L221)*

___

###  universe

• **universe**: *[Address](../modules/_augur_sdk_src_state_logs_types_.md#address)*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:214](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L214)*
