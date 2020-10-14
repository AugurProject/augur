[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/events"](_augur_sdk_src_events_.md)

# Module: "augur-sdk/src/events"

## Index

### Classes

* [EventNameEmitter](../classes/_augur_sdk_src_events_.eventnameemitter.md)

### Type aliases

* [Callback](_augur_sdk_src_events_.md#callback)
* [TXStatusCallback](_augur_sdk_src_events_.md#txstatuscallback)

## Type aliases

###  Callback

Ƭ **Callback**: *function*

*Defined in [packages/augur-sdk/src/events.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/events.ts#L16)*

#### Type declaration:

▸ (...`args`: SubscriptionType[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | SubscriptionType[] |

___

###  TXStatusCallback

Ƭ **TXStatusCallback**: *function*

*Defined in [packages/augur-sdk/src/events.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/events.ts#L17)*

#### Type declaration:

▸ (...`args`: TXStatus[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | TXStatus[] |
