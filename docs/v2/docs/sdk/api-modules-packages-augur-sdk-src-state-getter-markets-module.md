---
id: api-modules-packages-augur-sdk-src-state-getter-markets-module
title: packages/augur-sdk/src/state/getter/Markets Module
sidebar_label: packages/augur-sdk/src/state/getter/Markets
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Markets Module]](api-modules-packages-augur-sdk-src-state-getter-markets-module.md)

## Module

### Enumerations

* [MarketInfoReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketinforeportingstate.md)

### Classes

* [Markets](api-classes-packages-augur-sdk-src-state-getter-markets-markets.md)

### Interfaces

* [DisputeInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-disputeinfo.md)
* [MarketInfo](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfo.md)
* [MarketInfoOutcome](api-interfaces-packages-augur-sdk-src-state-getter-markets-marketinfooutcome.md)
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
* [outcomeIdType](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#outcomeidtype)

### Functions

* [filterOrderFilledLogs](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#filterorderfilledlogs)
* [formatStakeDetails](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#formatstakedetails)
* [getMarketDisputeInfo](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketdisputeinfo)
* [getMarketOutcomes](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketoutcomes)
* [getMarketReportingState](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getmarketreportingstate)
* [getPeriodStartTime](api-modules-packages-augur-sdk-src-state-getter-markets-module.md#getperiodstarttime)

---

## Variables

<a id="seconds_in_a_day"></a>

### `<Const>` SECONDS_IN_A_DAY

**● SECONDS_IN_A_DAY**: *`BigNumber`* =  new BigNumber(86400, 10)

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:48](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L48)*

___
<a id="getmarketsparamsspecific"></a>

### `<Const>` getMarketsParamsSpecific

**● getMarketsParamsSpecific**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
  t.type({
    universe: t.string,
  }),
  t.partial({
    creator: t.string,
    category: t.string,
    search: t.string,
    reportingState: t.union([t.string, t.array(t.string)]),
    disputeWindow: t.string,
    designatedReporter: t.string,
    maxFee: t.string,
    maxEndTime: t.number,
    hasOrders: t.boolean,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:31](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L31)*

___
<a id="outcomeidtype"></a>

### `<Const>` outcomeIdType

**● outcomeIdType**: *`UnionType`<(`NumberType` \| `KeyofType`<`object`> \| `NullType` \| `UndefinedType`)[], `number`, `number`, `unknown`>* =  t.union([OutcomeParam, t.number, t.null, t.undefined])

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:165](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L165)*

___

## Functions

<a id="filterorderfilledlogs"></a>

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(orderFilledLogs: *[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, params: *`t.TypeOf`<`InterfaceType`>*): [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:814](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L814)*

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

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1146](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L1146)*

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

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1065](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L1065)*

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

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:845](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L845)*

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

▸ **getMarketReportingState**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)*, marketFinalizedLogs: *[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[]*): `Promise`<[MarketInfoReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketinforeportingstate.md)>

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:974](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L974)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md) |
| marketFinalizedLogs | [MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[] |

**Returns:** `Promise`<[MarketInfoReportingState](api-enums-packages-augur-sdk-src-state-getter-markets-marketinforeportingstate.md)>

___
<a id="getperiodstarttime"></a>

###  getPeriodStartTime

▸ **getPeriodStartTime**(globalStarttime: *`number`*, periodStartime: *`number`*, period: *`number`*): `number`

*Defined in [packages/augur-sdk/src/state/getter/Markets.ts:1052](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Markets.ts#L1052)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| globalStarttime | `number` |
| periodStartime | `number` |
| period | `number` |

**Returns:** `number`

___

