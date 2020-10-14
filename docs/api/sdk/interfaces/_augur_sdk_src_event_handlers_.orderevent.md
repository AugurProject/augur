[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/event-handlers"](../modules/_augur_sdk_src_event_handlers_.md) › [OrderEvent](_augur_sdk_src_event_handlers_.orderevent.md)

# Interface: OrderEvent

## Hierarchy

  ↳ [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md)

  ↳ **OrderEvent**

## Index

### Properties

* [address](_augur_sdk_src_event_handlers_.orderevent.md#address)
* [addressData](_augur_sdk_src_event_handlers_.orderevent.md#addressdata)
* [blockHash](_augur_sdk_src_event_handlers_.orderevent.md#blockhash)
* [blockNumber](_augur_sdk_src_event_handlers_.orderevent.md#blocknumber)
* [contractName](_augur_sdk_src_event_handlers_.orderevent.md#contractname)
* [eventName](_augur_sdk_src_event_handlers_.orderevent.md#eventname)
* [eventType](_augur_sdk_src_event_handlers_.orderevent.md#eventtype)
* [logIndex](_augur_sdk_src_event_handlers_.orderevent.md#logindex)
* [market](_augur_sdk_src_event_handlers_.orderevent.md#market)
* [orderId](_augur_sdk_src_event_handlers_.orderevent.md#orderid)
* [orderType](_augur_sdk_src_event_handlers_.orderevent.md#ordertype)
* [removed](_augur_sdk_src_event_handlers_.orderevent.md#removed)
* [tradeGroupId](_augur_sdk_src_event_handlers_.orderevent.md#tradegroupid)
* [transactionHash](_augur_sdk_src_event_handlers_.orderevent.md#transactionhash)
* [transactionIndex](_augur_sdk_src_event_handlers_.orderevent.md#transactionindex)
* [uint256Data](_augur_sdk_src_event_handlers_.orderevent.md#uint256data)
* [universe](_augur_sdk_src_event_handlers_.orderevent.md#universe)

## Properties

###  address

• **address**: *[Address](../modules/_augur_sdk_src_event_handlers_.md#address)*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[address](_augur_sdk_src_event_handlers_.formattedeventlog.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L17)*

___

###  addressData

• **addressData**: *[Address](../modules/_augur_sdk_src_event_handlers_.md#address)[]*

*Defined in [packages/augur-sdk/src/event-handlers.ts:191](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L191)*

___

###  blockHash

• **blockHash**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[blockHash](_augur_sdk_src_event_handlers_.formattedeventlog.md#blockhash)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:23](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L23)*

___

###  blockNumber

• **blockNumber**: *number*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[blockNumber](_augur_sdk_src_event_handlers_.formattedeventlog.md#blocknumber)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L18)*

___

###  contractName

• **contractName**: *string*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[contractName](_augur_sdk_src_event_handlers_.formattedeventlog.md#contractname)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L22)*

___

###  eventName

• **eventName**: *string*

*Inherited from [Event](_augur_sdk_src_event_handlers_.event.md).[eventName](_augur_sdk_src_event_handlers_.event.md#eventname)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:9](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L9)*

___

###  eventType

• **eventType**: *string*

*Defined in [packages/augur-sdk/src/event-handlers.ts:187](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L187)*

___

###  logIndex

• **logIndex**: *number*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[logIndex](_augur_sdk_src_event_handlers_.formattedeventlog.md#logindex)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L19)*

___

###  market

• **market**: *[Address](../modules/_augur_sdk_src_event_handlers_.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:186](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L186)*

___

###  orderId

• **orderId**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:189](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L189)*

___

###  orderType

• **orderType**: *string*

*Defined in [packages/augur-sdk/src/event-handlers.ts:188](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L188)*

___

###  removed

• **removed**: *boolean*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[removed](_augur_sdk_src_event_handlers_.formattedeventlog.md#removed)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L24)*

___

###  tradeGroupId

• **tradeGroupId**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:190](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L190)*

___

###  transactionHash

• **transactionHash**: *[Bytes32](../modules/_augur_sdk_src_event_handlers_.md#bytes32)*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[transactionHash](_augur_sdk_src_event_handlers_.formattedeventlog.md#transactionhash)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L20)*

___

###  transactionIndex

• **transactionIndex**: *number*

*Inherited from [FormattedEventLog](_augur_sdk_src_event_handlers_.formattedeventlog.md).[transactionIndex](_augur_sdk_src_event_handlers_.formattedeventlog.md#transactionindex)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L21)*

___

###  uint256Data

• **uint256Data**: *string[]*

*Defined in [packages/augur-sdk/src/event-handlers.ts:192](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L192)*

___

###  universe

• **universe**: *[Address](../modules/_augur_sdk_src_event_handlers_.md#address)*

*Defined in [packages/augur-sdk/src/event-handlers.ts:185](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/event-handlers.ts#L185)*
