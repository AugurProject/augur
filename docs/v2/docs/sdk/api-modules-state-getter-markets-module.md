---
id: api-modules-state-getter-markets-module
title: state/getter/Markets Module
sidebar_label: state/getter/Markets
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Markets Module]](api-modules-state-getter-markets-module.md)

## Module

### Enumerations

* [MarketInfoReportingState](api-enums-state-getter-markets-marketinforeportingstate.md)

### Classes

* [Markets](api-classes-state-getter-markets-markets.md)

### Interfaces

* [MarketInfo](api-interfaces-state-getter-markets-marketinfo.md)
* [MarketInfoOutcome](api-interfaces-state-getter-markets-marketinfooutcome.md)
* [MarketPriceCandlestick](api-interfaces-state-getter-markets-marketpricecandlestick.md)
* [MarketPriceCandlesticks](api-interfaces-state-getter-markets-marketpricecandlesticks.md)
* [MarketPriceHistory](api-interfaces-state-getter-markets-marketpricehistory.md)
* [TimestampedPriceAmount](api-interfaces-state-getter-markets-timestampedpriceamount.md)

### Variables

* [GetMarketsParamsSpecific](api-modules-state-getter-markets-module.md#getmarketsparamsspecific)
* [OutcomeParam](api-modules-state-getter-markets-module.md#outcomeparam)
* [SECONDS_IN_A_DAY](api-modules-state-getter-markets-module.md#seconds_in_a_day)

### Functions

* [filterOrderFilledLogs](api-modules-state-getter-markets-module.md#filterorderfilledlogs)
* [getMarketOpenInterest](api-modules-state-getter-markets-module.md#getmarketopeninterest)
* [getMarketOutcomes](api-modules-state-getter-markets-module.md#getmarketoutcomes)
* [getMarketReportingState](api-modules-state-getter-markets-module.md#getmarketreportingstate)
* [getPeriodStartTime](api-modules-state-getter-markets-module.md#getperiodstarttime)

---

## Variables

<a id="getmarketsparamsspecific"></a>

### `<Const>` GetMarketsParamsSpecific

**● GetMarketsParamsSpecific**: *`any`* =  t.intersection([t.type({
  universe: t.string,
}), t.partial({
  creator: t.string,
  category: t.string,
  search: t.string,
  reportingState: t.union([t.string, t.array(t.string)]),
  disputeWindow: t.string,
  designatedReporter: t.string,
  maxFee: t.string,
  hasOrders: t.boolean,
})])

*Defined in [state/getter/Markets.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L22)*

___
<a id="outcomeparam"></a>

### `<Const>` OutcomeParam

**● OutcomeParam**: *`any`* =  t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
})

*Defined in [state/getter/Markets.ts:35](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L35)*

___
<a id="seconds_in_a_day"></a>

### `<Const>` SECONDS_IN_A_DAY

**● SECONDS_IN_A_DAY**: *`86400`* = 86400

*Defined in [state/getter/Markets.ts:46](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L46)*

___

## Functions

<a id="filterorderfilledlogs"></a>

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(orderFilledLogs: *`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>*, params: *`t.TypeOf`<`any`>*): `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>

*Defined in [state/getter/Markets.ts:415](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L415)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderFilledLogs | `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)> |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>

___
<a id="getmarketopeninterest"></a>

###  getMarketOpenInterest

▸ **getMarketOpenInterest**(db: *[DB](api-classes-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*): `Promise`<`string`>

*Defined in [state/getter/Markets.ts:436](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L436)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |

**Returns:** `Promise`<`string`>

___
<a id="getmarketoutcomes"></a>

###  getMarketOutcomes

▸ **getMarketOutcomes**(db: *[DB](api-classes-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*): `Promise`<`Array`<[MarketInfoOutcome](api-interfaces-state-getter-markets-marketinfooutcome.md)>>

*Defined in [state/getter/Markets.ts:457](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L457)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |

**Returns:** `Promise`<`Array`<[MarketInfoOutcome](api-interfaces-state-getter-markets-marketinfooutcome.md)>>

___
<a id="getmarketreportingstate"></a>

###  getMarketReportingState

▸ **getMarketReportingState**(db: *[DB](api-classes-state-db-db-db.md)*, marketCreatedLog: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*, marketFinalizedLogs: *`Array`<[MarketFinalizedLog](api-interfaces-state-logs-types-marketfinalizedlog.md)>*): `Promise`<[MarketInfoReportingState](api-enums-state-getter-markets-marketinforeportingstate.md)>

*Defined in [state/getter/Markets.ts:498](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L498)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| marketCreatedLog | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |
| marketFinalizedLogs | `Array`<[MarketFinalizedLog](api-interfaces-state-logs-types-marketfinalizedlog.md)> |

**Returns:** `Promise`<[MarketInfoReportingState](api-enums-state-getter-markets-marketinforeportingstate.md)>

___
<a id="getperiodstarttime"></a>

###  getPeriodStartTime

▸ **getPeriodStartTime**(globalStarttime: *`number`*, periodStartime: *`number`*, period: *`number`*): `number`

*Defined in [state/getter/Markets.ts:552](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Markets.ts#L552)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| globalStarttime | `number` |
| periodStartime | `number` |
| period | `number` |

**Returns:** `number`

___

