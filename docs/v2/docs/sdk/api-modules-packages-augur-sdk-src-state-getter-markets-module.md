---
id: api-modules-packages-augur-sdk-src-state-getter-markets-module
title: packages/augur-sdk/src/state/getter/Markets Module
sidebar_label: packages/augur-sdk/src/state/getter/Markets
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Markets Module]](api-modules-packages-augur-sdk-src-state-getter-markets-module.md)

## Module

### Enumerations

* [GetMarketsSortBy](api-enums-packages-augur-sdk-src-state-getter-markets-getmarketssortby.md)
* [MarketReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketreportingstate.md)

### Classes

* [Markets](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md)

### Interfaces

* [DisputeInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md)
* [MarketInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfo.md)
* [MarketInfoOutcome](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfooutcome.md)
* [MarketList](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlist.md)
* [MarketListMeta](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlistmeta.md)
* [MarketListMetaCategories](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlistmetacategories.md)
* [MarketOrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketorderbook.md)
* [MarketPriceCandlestick](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricecandlestick.md)
* [MarketPriceCandlesticks](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricecandlesticks.md)
* [MarketPriceHistory](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketpricehistory.md)
* [OrderBook](api-interfaces-packages-augur-sdk-src-state-getter-markets-orderbook.md)
* [StakeDetails](api-interfaces-packages-augur-sdk-src-state-getter-markets-stakedetails.md)
* [TimestampedPriceAmount](api-interfaces-packages-augur-sdk-src-state-getter-markets-timestampedpriceamount.md)

### Variables

* [SECONDS_IN_A_DAY](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#seconds_in_a_day)
* [getMarketsParamsSpecific](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketsparamsspecific)
* [getMarketsSortBy](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketssortby-1)
* [outcomeIdType](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#outcomeidtype)

### Functions

* [filterOrderFilledLogs](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#filterorderfilledlogs)
* [formatStakeDetails](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#formatstakedetails)
* [getMarketDisputeInfo](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketdisputeinfo)
* [getMarketOutcomes](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketoutcomes)
* [getMarketReportingState](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketreportingstate)
* [getMarketsMeta](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketsmeta)
* [getMarketsSearchResults](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketssearchresults)
* [getPeriodStartTime](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getperiodstarttime)

---

## Variables

<a id="seconds_in_a_day"></a>

### `<Const>` SECONDS_IN_A_DAY

**● SECONDS_IN_A_DAY**: *`BigNumber`* =  new BigNumber(86400, 10)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:77](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L77)*

___
<a id="getmarketsparamsspecific"></a>

### `<Const>` getMarketsParamsSpecific

**● getMarketsParamsSpecific**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    search: t.string,
    reportingStates: t.array(t.string),
    disputeWindow: t.string,
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    maxLiquiditySpread: t.string,
    includeInvalidMarkets: t.boolean,
    categories: t.array(t.string),
    sortBy: getMarketsSortBy,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:58](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L58)*

___
<a id="getmarketssortby-1"></a>

### `<Const>` getMarketsSortBy

**● getMarketsSortBy**: *`KeyofType`<[GetMarketsSortBy](api-enums-packages-augur-sdk-src-state-getter-markets-getmarketssortby.md)>* =  t.keyof(GetMarketsSortBy)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:56](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L56)*

___
<a id="outcomeidtype"></a>

### `<Const>` outcomeIdType

**● outcomeIdType**: *`UnionType`<(`NumberType` \| `KeyofType`<`object`> \| `NullType` \| `UndefinedType`)[], `number`, `number`, `unknown`>* =  t.union([OutcomeParam, t.number, t.null, t.undefined])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:225](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L225)*

___

## Functions

<a id="filterorderfilledlogs"></a>

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(orderFilledLogs: *[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, params: *`t.TypeOf`<`InterfaceType`>*): [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:910](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L910)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderFilledLogs | [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]

___
<a id="formatstakedetails"></a>

###  formatStakeDetails

▸ **formatStakeDetails**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, marketId: *[Address](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md#address)*, stakeDetails: *`any`[]*): `Promise`<[StakeDetails](api-interfaces-packages-augur-sdk-src-state-getter-markets-stakedetails.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1256](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1256)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| marketId | [Address](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md#address) |
| stakeDetails | `any`[] |

**Returns:** `Promise`<[StakeDetails](api-interfaces-packages-augur-sdk-src-state-getter-markets-stakedetails.md)[]>

___
<a id="getmarketdisputeinfo"></a>

###  getMarketDisputeInfo

▸ **getMarketDisputeInfo**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, marketId: *[Address](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md#address)*): `Promise`<[DisputeInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1161](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1161)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| marketId | [Address](api-interfaces-packages-augur-sdk-src-event-handlers-tradingproceedsclaimed.md#address) |

**Returns:** `Promise`<[DisputeInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md)>

___
<a id="getmarketoutcomes"></a>

###  getMarketOutcomes

▸ **getMarketOutcomes**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)*, marketVolumeChangedLogs: *[MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)[]*, scalarDenomination: *`string`*, tickSize: *`BigNumber`*, minPrice: *`BigNumber`*): `Promise`<[MarketInfoOutcome](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfooutcome.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:941](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L941)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md) |
| marketVolumeChangedLogs | [MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)[] |
| scalarDenomination | `string` |
| tickSize | `BigNumber` |
| minPrice | `BigNumber` |

**Returns:** `Promise`<[MarketInfoOutcome](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfooutcome.md)[]>

___
<a id="getmarketreportingstate"></a>

###  getMarketReportingState

▸ **getMarketReportingState**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)*, marketFinalizedLogs: *[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[]*): `Promise`<[MarketReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketreportingstate.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1070](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1070)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md) |
| marketFinalizedLogs | [MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[] |

**Returns:** `Promise`<[MarketReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketreportingstate.md)>

___
<a id="getmarketsmeta"></a>

###  getMarketsMeta

▸ **getMarketsMeta**(marketsResults: *`any`[]*, filteredOutCount: *`number`*): [MarketListMeta](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlistmeta.md)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1296](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1296)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketsResults | `any`[] |
| filteredOutCount | `number` |

**Returns:** [MarketListMeta](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketlistmeta.md)

___
<a id="getmarketssearchresults"></a>

###  getMarketsSearchResults

▸ **getMarketsSearchResults**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, universe: *`string`*, query: *`string`*, categories: *`string`[]*): `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>>>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1334](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1334)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| universe | `string` |
| query | `string` |
| categories | `string`[] |

**Returns:** `Promise`<`Array`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>>>

___
<a id="getperiodstarttime"></a>

###  getPeriodStartTime

▸ **getPeriodStartTime**(globalStarttime: *`number`*, periodStartime: *`number`*, period: *`number`*): `number`

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1148](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Markets.ts#L1148)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| globalStarttime | `number` |
| periodStartime | `number` |
| period | `number` |

**Returns:** `number`

___

