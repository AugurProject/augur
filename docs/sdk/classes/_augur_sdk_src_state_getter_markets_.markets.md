[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Markets"](../modules/_augur_sdk_src_state_getter_markets_.md) › [Markets](_augur_sdk_src_state_getter_markets_.markets.md)

# Class: Markets

## Hierarchy

* **Markets**

## Index

### Properties

* [MaxLiquiditySpread](_augur_sdk_src_state_getter_markets_.markets.md#static-maxliquidityspread)
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

### `Static` MaxLiquiditySpread

▪ **MaxLiquiditySpread**: *[MaxLiquiditySpread](../enums/_augur_sdk_src_state_getter_markets_.maxliquidityspread.md)* = MaxLiquiditySpread

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:267](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L267)*

___

### `Static` getCategoriesParams

▪ **getCategoriesParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      reportingStates: t.array(t.string)
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:292](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L292)*

___

### `Static` getCategoryStatsParams

▪ **getCategoryStatsParams**: *TypeC‹object›* = t.type({
    universe: t.string,
    categories: t.array(t.string),
  })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:301](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L301)*

___

### `Static` getMarketOrderBookParams

▪ **getMarketOrderBookParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({ marketId: t.string }),
    t.partial({
      outcomeId: t.union([outcomeIdType, t.array(outcomeIdType)]),
      account: t.string,
      onChain: t.boolean, // if false or not present, use 0x orderbook
      expirationCutoffSeconds: t.number,
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:282](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L282)*

___

### `Static` getMarketPriceCandlestickParams

▪ **getMarketPriceCandlestickParams**: *TypeC‹object›* = t.type({
    marketId: t.string,
    outcome: outcomeIdType,
    start: t.union([t.number, t.null, t.undefined]),
    end: t.union([t.number, t.null, t.undefined]),
    period: t.union([t.number, t.null, t.undefined]),
  })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:269](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L269)*

___

### `Static` getMarketPriceHistoryParams

▪ **getMarketPriceHistoryParams**: *TypeC‹object›* = t.type({ marketId: t.string })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:276](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L276)*

___

### `Static` getMarketsInfoParams

▪ **getMarketsInfoParams**: *TypeC‹object›* = t.type({ marketIds: t.array(t.string) })

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:281](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L281)*

___

### `Static` getMarketsParams

▪ **getMarketsParams**: *IntersectionC‹[IntersectionC‹[TypeC‹object›, PartialC‹object›]›, PartialC‹object›]›* = t.intersection([
    getMarketsParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:277](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L277)*

## Methods

### `Static` getCategories

▸ **getCategories**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getCategoriesParams›): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:810](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L810)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getCategoriesParams› |

**Returns:** *Promise‹string[]›*

___

### `Static` getCategoryStats

▸ **getCategoryStats**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getCategoryStatsParams›): *Promise‹[CategoryStats](../interfaces/_augur_sdk_src_state_getter_markets_.categorystats.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:838](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L838)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getCategoryStatsParams› |

**Returns:** *Promise‹[CategoryStats](../interfaces/_augur_sdk_src_state_getter_markets_.categorystats.md)›*

___

### `Static` getMarketOrderBook

▸ **getMarketOrderBook**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketOrderBookParams›): *Promise‹[MarketOrderBook](../interfaces/_augur_sdk_src_state_getter_markets_.marketorderbook.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:656](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L656)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketOrderBookParams› |

**Returns:** *Promise‹[MarketOrderBook](../interfaces/_augur_sdk_src_state_getter_markets_.marketorderbook.md)›*

___

### `Static` getMarketPriceCandlesticks

▸ **getMarketPriceCandlesticks**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketPriceCandlestickParams›): *Promise‹[MarketPriceCandlesticks](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricecandlesticks.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:307](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L307)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketPriceCandlestickParams› |

**Returns:** *Promise‹[MarketPriceCandlesticks](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricecandlesticks.md)›*

___

### `Static` getMarketPriceHistory

▸ **getMarketPriceHistory**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketPriceHistoryParams›): *Promise‹[MarketPriceHistory](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricehistory.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:441](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L441)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketPriceHistoryParams› |

**Returns:** *Promise‹[MarketPriceHistory](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricehistory.md)›*

___

### `Static` getMarkets

▸ **getMarkets**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketsParams›): *Promise‹[MarketList](../interfaces/_augur_sdk_src_state_getter_markets_.marketlist.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:472](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L472)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketsParams› |

**Returns:** *Promise‹[MarketList](../interfaces/_augur_sdk_src_state_getter_markets_.marketlist.md)›*

___

### `Static` getMarketsInfo

▸ **getMarketsInfo**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketsInfoParams›): *Promise‹[MarketInfo](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfo.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:796](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L796)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketsInfoParams› |

**Returns:** *Promise‹[MarketInfo](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfo.md)[]›*
