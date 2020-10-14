[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Markets"](../modules/_augur_sdk_src_state_getter_markets_.md) › [Markets](_augur_sdk_src_state_getter_markets_.markets.md)

# Class: Markets

## Hierarchy

* **Markets**

## Index

### Properties

* [MaxLiquiditySpread](_augur_sdk_src_state_getter_markets_.markets.md#static-readonly-maxliquidityspread)
* [getCategoriesParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getcategoriesparams)
* [getCategoryStatsParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getcategorystatsparams)
* [getMarketOrderBookParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketorderbookparams)
* [getMarketPriceCandlestickParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketpricecandlestickparams)
* [getMarketPriceHistoryParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketpricehistoryparams)
* [getMarketsInfoParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketsinfoparams)
* [getMarketsParams](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketsparams)

### Methods

* [getCategories](_augur_sdk_src_state_getter_markets_.markets.md#static-getcategories)
* [getCategoryStats](_augur_sdk_src_state_getter_markets_.markets.md#static-getcategorystats)
* [getMarketOrderBook](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketorderbook)
* [getMarketPriceCandlesticks](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketpricecandlesticks)
* [getMarketPriceHistory](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketpricehistory)
* [getMarkets](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarkets)
* [getMarketsInfo](_augur_sdk_src_state_getter_markets_.markets.md#static-getmarketsinfo)

## Properties

### `Static` `Readonly` MaxLiquiditySpread

▪ **MaxLiquiditySpread**: *MaxLiquiditySpread* = MaxLiquiditySpread

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:96](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L96)*

___

### `Static` getCategoriesParams

▪ **getCategoriesParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      reportingStates: t.array(t.string),
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:123](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L123)*

___

### `Static` getCategoryStatsParams

▪ **getCategoryStatsParams**: *TypeC‹object›* = t.type({
    universe: t.string,
    categories: t.array(t.string),
  })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:132](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L132)*

___

### `Static` getMarketOrderBookParams

▪ **getMarketOrderBookParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
      account: t.string,
      onChain: t.boolean, // if false or not present, use 0x orderbook
      orderType: t.string,
      expirationCutoffSeconds: t.number,
      ignoreCrossOrders: t.boolean,
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:111](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L111)*

___

### `Static` getMarketPriceCandlestickParams

▪ **getMarketPriceCandlestickParams**: *TypeC‹object›* = t.type({
    marketId: t.string,
    outcome: outcomeIdType,
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:98](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L98)*

___

### `Static` getMarketPriceHistoryParams

▪ **getMarketPriceHistoryParams**: *TypeC‹object›* = t.type({ marketId: t.string })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:105](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L105)*

___

### `Static` getMarketsInfoParams

▪ **getMarketsInfoParams**: *TypeC‹object›* = t.type({ marketIds: t.array(t.string) })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:110](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L110)*

___

### `Static` getMarketsParams

▪ **getMarketsParams**: *IntersectionC‹[IntersectionC‹[TypeC‹object›, PartialC‹object›]›, PartialC‹object›]›* = t.intersection([
    getMarketsParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:106](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L106)*

## Methods

### `Static` getCategories

▸ **getCategories**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getCategoriesParams›): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:828](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L828)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getCategoriesParams› |

**Returns:** *Promise‹string[]›*

___

### `Static` getCategoryStats

▸ **getCategoryStats**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getCategoryStatsParams›): *Promise‹CategoryStats›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:863](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L863)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getCategoryStatsParams› |

**Returns:** *Promise‹CategoryStats›*

___

### `Static` getMarketOrderBook

▸ **getMarketOrderBook**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketOrderBookParams›): *Promise‹MarketOrderBook›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:645](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L645)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketOrderBookParams› |

**Returns:** *Promise‹MarketOrderBook›*

___

### `Static` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketPriceCandlestickParams›): *Promise‹MarketPriceCandlesticks›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:138](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L138)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketPriceCandlestickParams› |

**Returns:** *Promise‹MarketPriceCandlesticks›*

___

### `Static` getMarketPriceHistory

▸ **getMarketPriceHistory**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketPriceHistoryParams›): *Promise‹MarketPriceHistory›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:274](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L274)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketPriceHistoryParams› |

**Returns:** *Promise‹MarketPriceHistory›*

___

### `Static` getMarkets

▸ **getMarkets**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketsParams›): *Promise‹MarketList›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:309](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L309)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketsParams› |

**Returns:** *Promise‹MarketList›*

___

### `Static` getMarketsInfo

▸ **getMarketsInfo**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketsInfoParams›): *Promise‹MarketInfo[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:792](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L792)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketsInfoParams› |

**Returns:** *Promise‹MarketInfo[]›*
