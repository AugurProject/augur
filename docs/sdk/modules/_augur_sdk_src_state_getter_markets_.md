[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Markets"](_augur_sdk_src_state_getter_markets_.md)

# Module: "augur-sdk/src/state/getter/Markets"

## Index

### Classes

* [Markets](../classes/_augur_sdk_src_state_getter_markets_.markets.md)

### Variables

* [GetMarketTypeFilterValue](_augur_sdk_src_state_getter_markets_.md#const-getmarkettypefiltervalue)
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
* [getOrderFilledLogsByMarket](_augur_sdk_src_state_getter_markets_.md#getorderfilledlogsbymarket)
* [getPeriodStartTime](_augur_sdk_src_state_getter_markets_.md#getperiodstarttime)

### Object literals

* [MaxLiquiditySpreadValue](_augur_sdk_src_state_getter_markets_.md#const-maxliquidityspreadvalue)

## Variables

### `Const` GetMarketTypeFilterValue

• **GetMarketTypeFilterValue**: *KeyofC‹MarketTypeName›* = t.keyof(MarketTypeName)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:68](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L68)*

___

### `Const` GetMaxLiquiditySpread

• **GetMaxLiquiditySpread**: *KeyofC‹object›* = t.keyof(MaxLiquiditySpreadValue)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:66](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L66)*

___

### `Const` GetTemplateFilterValue

• **GetTemplateFilterValue**: *KeyofC‹TemplateFilters›* = t.keyof(TemplateFilters)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:67](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L67)*

___

### `Const` extraInfoType

• **extraInfoType**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
  t.interface({
    description: t.string,
  }),
  t.partial({
    longDescription: t.string,
    _scalarDenomination: t.string,
    categories: t.array(t.string),
    tags: t.array(t.string),
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:969](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L969)*

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
    marketTypeFilter: GetMarketTypeFilterValue,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:70](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L70)*

___

### `Const` getMarketsSortBy

• **getMarketsSortBy**: *KeyofC‹GetMarketsSortBy›* = t.keyof(GetMarketsSortBy)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L65)*

___

### `Const` outcomeIdType

• **outcomeIdType**: *UnionC‹[KeyofC‹object›, NumberC‹›, NullC‹›, UndefinedC‹›]›* = t.union([OutcomeParam, t.number, t.null, t.undefined])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:93](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L93)*

## Functions

###  convertAttoDaiToDisplay

▸ **convertAttoDaiToDisplay**(`atto`: BigNumber, `decimalPlaces`: number): *string*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:965](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L965)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`atto` | BigNumber | - |
`decimalPlaces` | number | 2 |

**Returns:** *string*

___

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(`orderFilledLogs`: ParsedOrderEventLog[], `params`: t.TypeOf‹typeof getMarketPriceCandlestickParams›): *ParsedOrderEventLog[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:981](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L981)*

**Parameters:**

Name | Type |
------ | ------ |
`orderFilledLogs` | ParsedOrderEventLog[] |
`params` | t.TypeOf‹typeof getMarketPriceCandlestickParams› |

**Returns:** *ParsedOrderEventLog[]*

___

###  formatStakeDetails

▸ **formatStakeDetails**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `market`: MarketData, `stakeDetails`: DisputeDoc[]): *StakeDetails[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1345](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1345)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`market` | MarketData |
`stakeDetails` | DisputeDoc[] |

**Returns:** *StakeDetails[]*

___

###  getLiquidityOrderBook

▸ **getLiquidityOrderBook**(`augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `marketId`: string): *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1490](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1490)*

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

▸ **getMarketOutcomes**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `marketData`: MarketData, `scalarDenomination`: string, `tickSize`: BigNumber, `minPrice`: BigNumber, `parsedOrderEventLogs`: ParsedOrderEventLog[]): *MarketInfoOutcome[]*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1013](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1013)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`marketData` | MarketData |
`scalarDenomination` | string |
`tickSize` | BigNumber |
`minPrice` | BigNumber |
`parsedOrderEventLogs` | ParsedOrderEventLog[] |

**Returns:** *MarketInfoOutcome[]*

___

###  getMarketsCategoriesMeta

▸ **getMarketsCategoriesMeta**(`marketsResults`: MarketData[]): *MarketListMetaCategories*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1409](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1409)*

**Parameters:**

Name | Type |
------ | ------ |
`marketsResults` | MarketData[] |

**Returns:** *MarketListMetaCategories*

___

###  getMarketsInfo

▸ **getMarketsInfo**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `markets`: MarketData[], `reportingFeeDivisor`: BigNumber, `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹MarketInfo[]›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1155](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1155)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`markets` | MarketData[] |
`reportingFeeDivisor` | BigNumber |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹MarketInfo[]›*

___

###  getMarketsSearchResults

▸ **getMarketsSearchResults**(`universe`: string, `query`: string, `categories`: string[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1467](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1467)*

**Parameters:**

Name | Type |
------ | ------ |
`universe` | string |
`query` | string |
`categories` | string[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹Array‹SearchResults‹[MarketFields](../interfaces/_augur_sdk_src_state_db_syncableflexsearch_.marketfields.md)›››*

___

###  getOrderFilledLogsByMarket

▸ **getOrderFilledLogsByMarket**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `markets`: MarketData[]): *Promise‹object›*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1140](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1140)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`markets` | MarketData[] |

**Returns:** *Promise‹object›*

___

###  getPeriodStartTime

▸ **getPeriodStartTime**(`globalStarttime`: number, `periodStartime`: number, `period`: number): *number*

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1127](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L1127)*

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

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L57)*

###  0

• **0**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:62](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L62)*

###  10

• **10**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:61](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L61)*

###  100

• **100**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:58](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L58)*

###  15

• **15**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:60](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L60)*

###  20

• **20**: *null* = null

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Markets.ts#L59)*
