[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/OnChainTrading"](../modules/_augur_sdk_src_state_getter_onchaintrading_.md) › [OnChainTrading](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md)

# Class: OnChainTrading

## Hierarchy

* **OnChainTrading**

## Index

### Properties

* [GetAllOrdersParams](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-getallordersparams)
* [GetOrdersParams](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-getordersparams)
* [GetTradingHistoryParams](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-gettradinghistoryparams)

### Methods

* [getOpenOnChainOrders](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-getopenonchainorders)
* [getOpenOrders](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-getopenorders)
* [getTradingHistory](_augur_sdk_src_state_getter_onchaintrading_.onchaintrading.md#static-gettradinghistory)

## Properties

### `Static` GetAllOrdersParams

▪ **GetAllOrdersParams**: *PartialC‹object›* = t.partial({
    account: t.string,
    filterFinalized: t.boolean,
  })

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:147](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L147)*

___

### `Static` GetOrdersParams

▪ **GetOrdersParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = t.intersection([sortOptions, OrdersParams])

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:151](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L151)*

___

### `Static` GetTradingHistoryParams

▪ **GetTradingHistoryParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = t.intersection([
    sortOptions,
    TradingHistoryParams,
  ])

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:143](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L143)*

## Methods

### `Static` getOpenOnChainOrders

▸ **getOpenOnChainOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetOrdersParams›): *Promise‹[Orders](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.orders.md)›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:267](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L267)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetOrdersParams› |

**Returns:** *Promise‹[Orders](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.orders.md)›*

___

### `Static` getOpenOrders

▸ **getOpenOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetOrdersParams›): *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:252](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L252)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetOrdersParams› |

**Returns:** *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

___

### `Static` getTradingHistory

▸ **getTradingHistory**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetTradingHistoryParams›): *Promise‹[MarketTradingHistory](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.markettradinghistory.md)›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:154](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetTradingHistoryParams› |

**Returns:** *Promise‹[MarketTradingHistory](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.markettradinghistory.md)›*
