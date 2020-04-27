[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/ZeroXOrdersGetters"](_augur_sdk_src_state_getter_zeroxordersgetters_.md)

# Module: "augur-sdk/src/state/getter/ZeroXOrdersGetters"

## Index

### Classes

* [ZeroXOrdersGetters](../classes/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md)

### Interfaces

* [ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)
* [ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)

### Variables

* [ZeroXOrderParams](_augur_sdk_src_state_getter_zeroxordersgetters_.md#const-zeroxorderparams)
* [ZeroXOrdersParams](_augur_sdk_src_state_getter_zeroxordersgetters_.md#const-zeroxordersparams)

### Functions

* [flattenZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.md#flattenzeroxorders)

## Variables

### `Const` ZeroXOrderParams

• **ZeroXOrderParams**: *TypeC‹object›* = t.type({
  orderHash: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L57)*

___

### `Const` ZeroXOrdersParams

• **ZeroXOrdersParams**: *PartialC‹object›* = t.partial({
  marketId: t.string,
  outcome: t.number,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  matchPrice: t.string,
  ignoreOrders: t.array(t.string),
  expirationCutoffSeconds: t.number,
})

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:46](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L46)*

## Functions

###  flattenZeroXOrders

▸ **flattenZeroXOrders**(`orders`: any): *[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:235](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L235)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |

**Returns:** *[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)[]*
