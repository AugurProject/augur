---
id: api-modules-augur-sdk-src-state-getter-markets-module
title: augur-sdk/src/state/getter/Markets Module
sidebar_label: augur-sdk/src/state/getter/Markets
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Markets Module]](api-modules-augur-sdk-src-state-getter-markets-module.md)

## Module

### Enumerations

* [GetMarketsSortBy](api-enums-augur-sdk-src-state-getter-markets-getmarketssortby.md)
* [MaxLiquiditySpread](api-enums-augur-sdk-src-state-getter-markets-maxliquidityspread.md)
* [TemplateFilters](api-enums-augur-sdk-src-state-getter-markets-templatefilters.md)

### Classes

* [Markets](api-classes-augur-sdk-src-state-getter-markets-markets.md)

### Interfaces

* [CategoryStat](api-interfaces-augur-sdk-src-state-getter-markets-categorystat.md)
* [CategoryStats](api-interfaces-augur-sdk-src-state-getter-markets-categorystats.md)
* [DisputeInfo](api-interfaces-augur-sdk-src-state-getter-markets-disputeinfo.md)
* [LiquidityOrderBookInfo](api-interfaces-augur-sdk-src-state-getter-markets-liquidityorderbookinfo.md)
* [MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)
* [MarketInfoOutcome](api-interfaces-augur-sdk-src-state-getter-markets-marketinfooutcome.md)
* [MarketList](api-interfaces-augur-sdk-src-state-getter-markets-marketlist.md)
* [MarketListMeta](api-interfaces-augur-sdk-src-state-getter-markets-marketlistmeta.md)
* [MarketListMetaCategories](api-interfaces-augur-sdk-src-state-getter-markets-marketlistmetacategories.md)
* [MarketOrderBook](api-interfaces-augur-sdk-src-state-getter-markets-marketorderbook.md)
* [MarketOrderBookOrder](api-interfaces-augur-sdk-src-state-getter-markets-marketorderbookorder.md)
* [MarketPriceCandlestick](api-interfaces-augur-sdk-src-state-getter-markets-marketpricecandlestick.md)
* [MarketPriceCandlesticks](api-interfaces-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)
* [MarketPriceHistory](api-interfaces-augur-sdk-src-state-getter-markets-marketpricehistory.md)
* [OutcomeOrderBook](api-interfaces-augur-sdk-src-state-getter-markets-outcomeorderbook.md)
* [StakeDetails](api-interfaces-augur-sdk-src-state-getter-markets-stakedetails.md)
* [TimestampedPriceAmount](api-interfaces-augur-sdk-src-state-getter-markets-timestampedpriceamount.md)

### Variables

* [GetMaxLiquiditySpread](api-modules-augur-sdk-src-state-getter-markets-module.md#getmaxliquidityspread)
* [GetTemplateFilterValue](api-modules-augur-sdk-src-state-getter-markets-module.md#gettemplatefiltervalue)
* [extraInfoType](api-modules-augur-sdk-src-state-getter-markets-module.md#extrainfotype)
* [getMarketsParamsSpecific](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketsparamsspecific)
* [getMarketsSortBy](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketssortby-1)
* [outcomeIdType](api-modules-augur-sdk-src-state-getter-markets-module.md#outcomeidtype)

### Functions

* [convertAttoDaiToDisplay](api-modules-augur-sdk-src-state-getter-markets-module.md#convertattodaitodisplay)
* [filterOrderFilledLogs](api-modules-augur-sdk-src-state-getter-markets-module.md#filterorderfilledlogs)
* [formatStakeDetails](api-modules-augur-sdk-src-state-getter-markets-module.md#formatstakedetails)
* [getLiquidityOrderBook](api-modules-augur-sdk-src-state-getter-markets-module.md#getliquidityorderbook)
* [getMarketOutcomes](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketoutcomes)
* [getMarketsCategoriesMeta](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketscategoriesmeta)
* [getMarketsInfo](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketsinfo)
* [getMarketsSearchResults](api-modules-augur-sdk-src-state-getter-markets-module.md#getmarketssearchresults)
* [getPeriodStartTime](api-modules-augur-sdk-src-state-getter-markets-module.md#getperiodstarttime)

### Object literals

* [MaxLiquiditySpreadValue](api-modules-augur-sdk-src-state-getter-markets-module.md#maxliquidityspreadvalue)

---

## Variables

<a id="getmaxliquidityspread"></a>

### `<Const>` GetMaxLiquiditySpread

**● GetMaxLiquiditySpread**: *`KeyofC`<`object`>* =  t.keyof(MaxLiquiditySpreadValue)

*Defined in [augur-sdk/src/state/getter/Markets.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L68)*

___
<a id="gettemplatefiltervalue"></a>

### `<Const>` GetTemplateFilterValue

**● GetTemplateFilterValue**: *`KeyofC`<`object`>* =  t.keyof(TemplateFilters)

*Defined in [augur-sdk/src/state/getter/Markets.ts:69](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L69)*

___
<a id="extrainfotype"></a>

### `<Const>` extraInfoType

**● extraInfoType**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
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

*Defined in [augur-sdk/src/state/getter/Markets.ts:836](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L836)*

___
<a id="getmarketsparamsspecific"></a>

### `<Const>` getMarketsParamsSpecific

**● getMarketsParamsSpecific**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
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
    categories: t.array(t.string),
    sortBy: getMarketsSortBy,
    userPortfolioAddress: t.string,
    templateFilter: GetTemplateFilterValue,
  }),
])

*Defined in [augur-sdk/src/state/getter/Markets.ts:71](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L71)*

___
<a id="getmarketssortby-1"></a>

### `<Const>` getMarketsSortBy

**● getMarketsSortBy**: *`KeyofC`<`object`>* =  t.keyof(GetMarketsSortBy)

*Defined in [augur-sdk/src/state/getter/Markets.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L67)*

___
<a id="outcomeidtype"></a>

### `<Const>` outcomeIdType

**● outcomeIdType**: *`UnionC`<[`KeyofC`<`object`>, `NumberC`, `NullC`, `UndefinedC`]>* =  t.union([OutcomeParam, t.number, t.null, t.undefined])

*Defined in [augur-sdk/src/state/getter/Markets.ts:247](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L247)*

___

## Functions

<a id="convertattodaitodisplay"></a>

###  convertAttoDaiToDisplay

▸ **convertAttoDaiToDisplay**(atto: *`BigNumber`*, decimalPlaces?: *`number`*): `string`

*Defined in [augur-sdk/src/state/getter/Markets.ts:832](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L832)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| atto | `BigNumber` | - |
| `Default value` decimalPlaces | `number` | 2 |

**Returns:** `string`

___
<a id="filterorderfilledlogs"></a>

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(orderFilledLogs: *[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, params: *`t.TypeOf`<`TypeC`>*): [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]

*Defined in [augur-sdk/src/state/getter/Markets.ts:848](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L848)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderFilledLogs | [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]

___
<a id="formatstakedetails"></a>

###  formatStakeDetails

▸ **formatStakeDetails**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, market: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, stakeDetails: *[DisputeDoc](api-interfaces-augur-sdk-src-state-logs-types-disputedoc.md)[]*): [StakeDetails](api-interfaces-augur-sdk-src-state-getter-markets-stakedetails.md)[]

*Defined in [augur-sdk/src/state/getter/Markets.ts:1123](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L1123)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| market | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| stakeDetails | [DisputeDoc](api-interfaces-augur-sdk-src-state-logs-types-disputedoc.md)[] |

**Returns:** [StakeDetails](api-interfaces-augur-sdk-src-state-getter-markets-stakedetails.md)[]

___
<a id="getliquidityorderbook"></a>

###  getLiquidityOrderBook

▸ **getLiquidityOrderBook**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, marketId: *`string`*): `Promise`<[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)>

*Defined in [augur-sdk/src/state/getter/Markets.ts:1299](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L1299)*

Gets a MarketOrderBook for a market and converts it to an OrderBook object.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |  Augur object to use for getting MarketOrderBook |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |  DB to use for getting MarketOrderBook |
| marketId | `string` |  Market address for which to get order book info |

**Returns:** `Promise`<[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)>

___
<a id="getmarketoutcomes"></a>

###  getMarketOutcomes

▸ **getMarketOutcomes**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, marketData: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, scalarDenomination: *`string`*, tickSize: *`BigNumber`*, minPrice: *`BigNumber`*, parsedOrderEventLogs: *[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*): [MarketInfoOutcome](api-interfaces-augur-sdk-src-state-getter-markets-marketinfooutcome.md)[]

*Defined in [augur-sdk/src/state/getter/Markets.ts:880](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L880)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| marketData | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| scalarDenomination | `string` |
| tickSize | `BigNumber` |
| minPrice | `BigNumber` |
| parsedOrderEventLogs | [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |

**Returns:** [MarketInfoOutcome](api-interfaces-augur-sdk-src-state-getter-markets-marketinfooutcome.md)[]

___
<a id="getmarketscategoriesmeta"></a>

###  getMarketsCategoriesMeta

▸ **getMarketsCategoriesMeta**(marketsResults: *[MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[]*): [MarketListMetaCategories](api-interfaces-augur-sdk-src-state-getter-markets-marketlistmetacategories.md)

*Defined in [augur-sdk/src/state/getter/Markets.ts:1159](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L1159)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketsResults | [MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[] |

**Returns:** [MarketListMetaCategories](api-interfaces-augur-sdk-src-state-getter-markets-marketlistmetacategories.md)

___
<a id="getmarketsinfo"></a>

###  getMarketsInfo

▸ **getMarketsInfo**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, markets: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[]*, reportingFeeDivisor: *`BigNumber`*): `Promise`<[MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

*Defined in [augur-sdk/src/state/getter/Markets.ts:982](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L982)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| markets | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[] |
| reportingFeeDivisor | `BigNumber` |

**Returns:** `Promise`<[MarketInfo](api-interfaces-augur-sdk-src-state-getter-markets-marketinfo.md)[]>

___
<a id="getmarketssearchresults"></a>

###  getMarketsSearchResults

▸ **getMarketsSearchResults**(universe: *`string`*, query: *`string`*, categories: *`string`[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

*Defined in [augur-sdk/src/state/getter/Markets.ts:1202](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L1202)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universe | `string` |
| query | `string` |
| categories | `string`[] |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-augur-sdk-src-state-db-syncableflexsearch-marketfields.md)>>>

___
<a id="getperiodstarttime"></a>

###  getPeriodStartTime

▸ **getPeriodStartTime**(globalStarttime: *`number`*, periodStartime: *`number`*, period: *`number`*): `number`

*Defined in [augur-sdk/src/state/getter/Markets.ts:969](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L969)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| globalStarttime | `number` |
| periodStartime | `number` |
| period | `number` |

**Returns:** `number`

___

## Object literals

<a id="maxliquidityspreadvalue"></a>

### `<Const>` MaxLiquiditySpreadValue

**MaxLiquiditySpreadValue**: *`object`*

*Defined in [augur-sdk/src/state/getter/Markets.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L45)*

<a id="maxliquidityspreadvalue.0"></a>

####  0

**● 0**: *`null`* =  null

*Defined in [augur-sdk/src/state/getter/Markets.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L50)*

___
<a id="maxliquidityspreadvalue.10"></a>

####  10

**● 10**: *`null`* =  null

*Defined in [augur-sdk/src/state/getter/Markets.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L49)*

___
<a id="maxliquidityspreadvalue.100"></a>

####  100

**● 100**: *`null`* =  null

*Defined in [augur-sdk/src/state/getter/Markets.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L46)*

___
<a id="maxliquidityspreadvalue.15"></a>

####  15

**● 15**: *`null`* =  null

*Defined in [augur-sdk/src/state/getter/Markets.ts:48](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L48)*

___
<a id="maxliquidityspreadvalue.20"></a>

####  20

**● 20**: *`null`* =  null

*Defined in [augur-sdk/src/state/getter/Markets.ts:47](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Markets.ts#L47)*

___

___

