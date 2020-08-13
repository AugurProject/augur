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

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:83](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L83)*

___

### `Static` GetOrdersParams

▪ **GetOrdersParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = t.intersection([sortOptions, OrdersParams])

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:87](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L87)*

___

### `Static` GetTradingHistoryParams

▪ **GetTradingHistoryParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = t.intersection([
    sortOptions,
    TradingHistoryParams,
  ])

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:79](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L79)*

## Methods

### `Static` getOpenOnChainOrders

▸ **getOpenOnChainOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetOrdersParams›): *Promise‹Orders›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:210](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetOrdersParams› |

**Returns:** *Promise‹Orders›*

___

### `Static` getOpenOrders

▸ **getOpenOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetOrdersParams›): *Promise‹ZeroXOrders›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:195](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetOrdersParams› |

**Returns:** *Promise‹ZeroXOrders›*

___

### `Static` getTradingHistory

▸ **getTradingHistory**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetTradingHistoryParams›): *Promise‹MarketTradingHistory›*

*Defined in [packages/augur-sdk/src/state/getter/OnChainTrading.ts:90](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetTradingHistoryParams› |

**Returns:** *Promise‹MarketTradingHistory›*
