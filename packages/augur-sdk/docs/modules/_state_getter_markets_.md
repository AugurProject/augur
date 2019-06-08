[@augurproject/sdk](../README.md) > ["state/getter/Markets"](../modules/_state_getter_markets_.md)

# External module: "state/getter/Markets"

## Index

### Enumerations

* [MarketInfoReportingState](../enums/_state_getter_markets_.marketinforeportingstate.md)

### Classes

* [Markets](../classes/_state_getter_markets_.markets.md)

### Interfaces

* [MarketInfo](../interfaces/_state_getter_markets_.marketinfo.md)
* [MarketInfoOutcome](../interfaces/_state_getter_markets_.marketinfooutcome.md)
* [MarketPriceCandlestick](../interfaces/_state_getter_markets_.marketpricecandlestick.md)
* [MarketPriceCandlesticks](../interfaces/_state_getter_markets_.marketpricecandlesticks.md)
* [MarketPriceHistory](../interfaces/_state_getter_markets_.marketpricehistory.md)
* [TimestampedPriceAmount](../interfaces/_state_getter_markets_.timestampedpriceamount.md)

### Variables

* [GetMarketsParamsSpecific](_state_getter_markets_.md#getmarketsparamsspecific)
* [OutcomeParam](_state_getter_markets_.md#outcomeparam)
* [SECONDS_IN_A_DAY](_state_getter_markets_.md#seconds_in_a_day)

### Functions

* [filterOrderFilledLogs](_state_getter_markets_.md#filterorderfilledlogs)
* [getMarketOpenInterest](_state_getter_markets_.md#getmarketopeninterest)
* [getMarketOutcomes](_state_getter_markets_.md#getmarketoutcomes)
* [getMarketReportingState](_state_getter_markets_.md#getmarketreportingstate)
* [getPeriodStartTime](_state_getter_markets_.md#getperiodstarttime)

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

*Defined in [state/getter/Markets.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L22)*

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

*Defined in [state/getter/Markets.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L35)*

___
<a id="seconds_in_a_day"></a>

### `<Const>` SECONDS_IN_A_DAY

**● SECONDS_IN_A_DAY**: *`86400`* = 86400

*Defined in [state/getter/Markets.ts:46](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L46)*

___

## Functions

<a id="filterorderfilledlogs"></a>

###  filterOrderFilledLogs

▸ **filterOrderFilledLogs**(orderFilledLogs: *`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>*, params: *`t.TypeOf`<`any`>*): `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>

*Defined in [state/getter/Markets.ts:415](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L415)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderFilledLogs | `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)> |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>

___
<a id="getmarketopeninterest"></a>

###  getMarketOpenInterest

▸ **getMarketOpenInterest**(db: *[DB](../classes/_state_db_db_.db.md)*, marketCreatedLog: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*): `Promise`<`string`>

*Defined in [state/getter/Markets.ts:436](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L436)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](../classes/_state_db_db_.db.md) |
| marketCreatedLog | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |

**Returns:** `Promise`<`string`>

___
<a id="getmarketoutcomes"></a>

###  getMarketOutcomes

▸ **getMarketOutcomes**(db: *[DB](../classes/_state_db_db_.db.md)*, marketCreatedLog: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*): `Promise`<`Array`<[MarketInfoOutcome](../interfaces/_state_getter_markets_.marketinfooutcome.md)>>

*Defined in [state/getter/Markets.ts:457](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L457)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](../classes/_state_db_db_.db.md) |
| marketCreatedLog | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |

**Returns:** `Promise`<`Array`<[MarketInfoOutcome](../interfaces/_state_getter_markets_.marketinfooutcome.md)>>

___
<a id="getmarketreportingstate"></a>

###  getMarketReportingState

▸ **getMarketReportingState**(db: *[DB](../classes/_state_db_db_.db.md)*, marketCreatedLog: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*, marketFinalizedLogs: *`Array`<[MarketFinalizedLog](../interfaces/_state_logs_types_.marketfinalizedlog.md)>*): `Promise`<[MarketInfoReportingState](../enums/_state_getter_markets_.marketinforeportingstate.md)>

*Defined in [state/getter/Markets.ts:498](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L498)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](../classes/_state_db_db_.db.md) |
| marketCreatedLog | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |
| marketFinalizedLogs | `Array`<[MarketFinalizedLog](../interfaces/_state_logs_types_.marketfinalizedlog.md)> |

**Returns:** `Promise`<[MarketInfoReportingState](../enums/_state_getter_markets_.marketinforeportingstate.md)>

___
<a id="getperiodstarttime"></a>

###  getPeriodStartTime

▸ **getPeriodStartTime**(globalStarttime: *`number`*, periodStartime: *`number`*, period: *`number`*): `number`

*Defined in [state/getter/Markets.ts:552](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Markets.ts#L552)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| globalStarttime | `number` |
| periodStartime | `number` |
| period | `number` |

**Returns:** `number`

___

