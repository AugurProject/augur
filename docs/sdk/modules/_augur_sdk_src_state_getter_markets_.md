[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Markets"](_augur_sdk_src_state_getter_markets_.md)

# Module: "augur-sdk/src/state/getter/Markets"

## Index

### Enumerations

* [GetMarketsSortBy](../enums/_augur_sdk_src_state_getter_markets_.getmarketssortby.md)
* [MaxLiquiditySpread](../enums/_augur_sdk_src_state_getter_markets_.maxliquidityspread.md)
* [TemplateFilters](../enums/_augur_sdk_src_state_getter_markets_.templatefilters.md)

### Classes

* [Markets](../classes/_augur_sdk_src_state_getter_markets_.markets.md)

### Interfaces

* [CategoryStat](../interfaces/_augur_sdk_src_state_getter_markets_.categorystat.md)
* [CategoryStats](../interfaces/_augur_sdk_src_state_getter_markets_.categorystats.md)
* [DisputeInfo](../interfaces/_augur_sdk_src_state_getter_markets_.disputeinfo.md)
* [LiquidityOrderBookInfo](../interfaces/_augur_sdk_src_state_getter_markets_.liquidityorderbookinfo.md)
* [MarketInfo](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfo.md)
* [MarketInfoOutcome](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfooutcome.md)
* [MarketList](../interfaces/_augur_sdk_src_state_getter_markets_.marketlist.md)
* [MarketListMeta](../interfaces/_augur_sdk_src_state_getter_markets_.marketlistmeta.md)
* [MarketListMetaCategories](../interfaces/_augur_sdk_src_state_getter_markets_.marketlistmetacategories.md)
* [MarketOrderBook](../interfaces/_augur_sdk_src_state_getter_markets_.marketorderbook.md)
* [MarketOrderBookOrder](../interfaces/_augur_sdk_src_state_getter_markets_.marketorderbookorder.md)
* [MarketPriceCandlestick](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricecandlestick.md)
* [MarketPriceCandlesticks](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricecandlesticks.md)
* [MarketPriceHistory](../interfaces/_augur_sdk_src_state_getter_markets_.marketpricehistory.md)
* [OutcomeOrderBook](../interfaces/_augur_sdk_src_state_getter_markets_.outcomeorderbook.md)
* [StakeDetails](../interfaces/_augur_sdk_src_state_getter_markets_.stakedetails.md)
* [TimestampedPriceAmount](../interfaces/_augur_sdk_src_state_getter_markets_.timestampedpriceamount.md)

### Variables

* [GetMaxLiquiditySpread](_augur_sdk_src_state_getter_markets_.md#const-getmaxliquidityspread)
* [GetTemplateFilterValue](_augur_sdk_src_state_getter_markets_.md#const-gettemplatefiltervalue)
* [extraInfoType](_augur_sdk_src_state_getter_markets_.md#const-extrainfotype)
* [getMarketsParamsSpecific](_augur_sdk_src_state_getter_markets_.md#const-getmarketsparamsspecific)
* [getMarketsSortBy](_augur_sdk_src_state_getter_markets_.md#const-getmarketssortby)
* [outcomeIdType](_augur_sdk_src_state_getter_markets_.md#const-outcomeidtype)

### Functions

* [convertAttoDaiToDisplay](_augur_sdk_src_state_getter_markets_.md#convertattodaitodisplay)
* [filterOrderFilledLogs](_augur_sdk_src_state_getter_markets_.md#filterorderfilledlogs)
* [formatStakeDetails](_augur_sdk_src_state_getter_markets_.md#formatstakedetails)
* [getLiquidityOrderBook](_augur_sdk_src_state_getter_markets_.md#getliquidityorderbook)
* [getMarketOutcomes](_augur_sdk_src_state_getter_markets_.md#getmarketoutcomes)
* [getMarketsCategoriesMeta](_augur_sdk_src_state_getter_markets_.md#getmarketscategoriesmeta)
* [getMarketsInfo](_augur_sdk_src_state_getter_markets_.md#getmarketsinfo)
* [getMarketsSearchResults](_augur_sdk_src_state_getter_markets_.md#getmarketssearchresults)
* [getPeriodStartTime](_augur_sdk_src_state_getter_markets_.md#getperiodstarttime)

### Object literals

* [MaxLiquiditySpreadValue](_augur_sdk_src_state_getter_markets_.md#const-maxliquidityspreadvalue)

## Variables

### `Const` GetMaxLiquiditySpread

• **GetMaxLiquiditySpread**: *KeyofC‹object›* = t.keyof(MaxLiquiditySpreadValue)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:78](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L78)*

___

### `Const` GetTemplateFilterValue

• **GetTemplateFilterValue**: *KeyofC‹[TemplateFilters](../enums/_augur_sdk_src_state_getter_markets_.templatefilters.md)›* = t.keyof(TemplateFilters)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:79](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L79)*

___

### `Const` extraInfoType

• **extraInfoType**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
  t.interface({
    description: t.string
  }),
  t.partial({
    longDescription: t.string,
    _scalarDenomination: t.string,
    categories: t.array(t.string),
    tags: t.array(t.string),
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:921](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L921)*

___

### `Const` getMarketsParamsSpecific

• **getMarketsParamsSpecific**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    search: t.string,
    reportingStates: t.array(t.string),
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    maxLiquiditySpread: GetMaxLiquiditySpread,
    includeInvalidMarkets: t.boolean,
    includeWarpSyncMarkets: t.boolean,
    categories: t.array(t.string),
    sortBy: getMarketsSortBy,
    userPortfolioAddress: t.string,
    templateFilter: GetTemplateFilterValue,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:81](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L81)*

___

### `Const` getMarketsSortBy

• **getMarketsSortBy**: *KeyofC‹[GetMarketsSortBy](../enums/_augur_sdk_src_state_getter_markets_.getmarketssortby.md)›* = t.keyof(GetMarketsSortBy)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:77](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L77)*

___

### `Const` outcomeIdType

• **outcomeIdType**: *UnionC‹[KeyofC‹object›, NumberC‹›, NullC‹›, UndefinedC‹›]›* = t.union([OutcomeParam, t.number, t.null, t.undefined])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:264](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L264)*

## Functions

###  convertAttoDaiToDisplay

▸ **convertAttoDaiToDisplay**(`atto`: BigNumber, `decimalPlaces`: number): *string*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:917](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L917)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`atto` | BigNumber | - |
`decimalPlaces` | number | 2 |

**Returns:** *string*

___

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(`orderFilledLogs`: [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[], `params`: t.TypeOf‹typeof getMarketPriceCandlestickParams›): *[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:933](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L933)*

**Parameters:**

Name | Type |
------ | ------ |
`orderFilledLogs` | [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[] |
`params` | t.TypeOf‹typeof getMarketPriceCandlestickParams› |

**Returns:** *[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]*

___

###  formatStakeDetails

▸ **formatStakeDetails**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `market`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `stakeDetails`: [DisputeDoc](../interfaces/_augur_sdk_src_state_logs_types_.disputedoc.md)[]): *[StakeDetails](../interfaces/_augur_sdk_src_state_getter_markets_.stakedetails.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1225](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1225)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`market` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`stakeDetails` | [DisputeDoc](../interfaces/_augur_sdk_src_state_logs_types_.disputedoc.md)[] |

**Returns:** *[StakeDetails](../interfaces/_augur_sdk_src_state_getter_markets_.stakedetails.md)[]*

___

###  getLiquidityOrderBook

▸ **getLiquidityOrderBook**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `marketId`: string): *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1345](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1345)*

Gets a MarketOrderBook for a market and converts it to an OrderBook object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) | Augur object to use for getting MarketOrderBook |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) | DB to use for getting MarketOrderBook |
`marketId` | string | Market address for which to get order book info  |

**Returns:** *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

___

###  getMarketOutcomes

▸ **getMarketOutcomes**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `marketData`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `scalarDenomination`: string, `tickSize`: BigNumber, `minPrice`: BigNumber, `parsedOrderEventLogs`: [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]): *[MarketInfoOutcome](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfooutcome.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:965](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L965)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`marketData` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`scalarDenomination` | string |
`tickSize` | BigNumber |
`minPrice` | BigNumber |
`parsedOrderEventLogs` | [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[] |

**Returns:** *[MarketInfoOutcome](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfooutcome.md)[]*

___

###  getMarketsCategoriesMeta

▸ **getMarketsCategoriesMeta**(`marketsResults`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]): *[MarketListMetaCategories](../interfaces/_augur_sdk_src_state_getter_markets_.marketlistmetacategories.md)*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1264](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1264)*

**Parameters:**

Name | Type |
------ | ------ |
`marketsResults` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[] |

**Returns:** *[MarketListMetaCategories](../interfaces/_augur_sdk_src_state_getter_markets_.marketlistmetacategories.md)*

___

###  getMarketsInfo

▸ **getMarketsInfo**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `markets`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[], `reportingFeeDivisor`: BigNumber, `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹[MarketInfo](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfo.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1072](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1072)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`markets` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[] |
`reportingFeeDivisor` | BigNumber |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹[MarketInfo](../interfaces/_augur_sdk_src_state_getter_markets_.marketinfo.md)[]›*

___

###  getMarketsSearchResults

▸ **getMarketsSearchResults**(`universe`: string, `query`: string, `categories`: string[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1322](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1322)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`query` | string |
`categories` | string[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

___

###  getPeriodStartTime

▸ **getPeriodStartTime**(`globalStarttime`: number, `periodStartime`: number, `period`: number): *number*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1059](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L1059)*

**Parameters:**

Name | Type |
------ | ------ |
`globalStarttime` | number |
`periodStartime` | number |
`period` | number |

**Returns:** *number*

## Object literals

### `Const` MaxLiquiditySpreadValue

### ▪ **MaxLiquiditySpreadValue**: *object*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:55](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L55)*

###  0

• **0**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:60](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L60)*

###  10

• **10**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:59](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L59)*

###  100

• **100**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L56)*

###  15

• **15**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:58](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L58)*

###  20

• **20**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Markets.ts#L57)*
