[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/ZeroXOrdersGetters"](_augur_sdk_src_state_getter_zeroxordersgetters_.md)

# Module: "augur-sdk/src/state/getter/ZeroXOrdersGetters"

## Index

### Classes

* [ZeroXOrdersGetters](../classes/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md)

### Variables

* [MarketInvalidBestBidParams](_augur_sdk_src_state_getter_zeroxordersgetters_.md#const-marketinvalidbestbidparams)
* [ZeroXOrderParams](_augur_sdk_src_state_getter_zeroxordersgetters_.md#const-zeroxorderparams)
* [ZeroXOrdersParams](_augur_sdk_src_state_getter_zeroxordersgetters_.md#const-zeroxordersparams)

### Functions

* [collapseZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.md#collapsezeroxorders)
* [flattenZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.md#flattenzeroxorders)

## Variables

### `Const` MarketInvalidBestBidParams

• **MarketInvalidBestBidParams**: *TypeC‹object›* = t.type({
  marketId: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L35)*

___

### `Const` ZeroXOrderParams

• **ZeroXOrderParams**: *TypeC‹object›* = t.type({
  orderHash: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:31](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L31)*

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
  ignoreCrossOrders: t.boolean,
})

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L19)*

## Functions

###  collapseZeroXOrders

▸ **collapseZeroXOrders**(`orders`: any): *ZeroXOrder[]*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:256](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L256)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |

**Returns:** *ZeroXOrder[]*

___

###  flattenZeroXOrders

▸ **flattenZeroXOrders**(`orders`: any): *ZeroXOrder[]*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:242](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |

**Returns:** *ZeroXOrder[]*
