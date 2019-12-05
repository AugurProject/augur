---
id: api-modules-augur-sdk-src-state-getter-users-module
title: augur-sdk/src/state/getter/Users Module
sidebar_label: augur-sdk/src/state/getter/Users
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Users Module]](api-modules-augur-sdk-src-state-getter-users-module.md)

## Module

### Classes

* [Users](api-classes-augur-sdk-src-state-getter-users-users.md)

### Interfaces

* [AccountTimeRangedStatsResult](api-interfaces-augur-sdk-src-state-getter-users-accounttimerangedstatsresult.md)
* [MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)
* [ProfitLossResult](api-interfaces-augur-sdk-src-state-getter-users-profitlossresult.md)
* [TradingPosition](api-interfaces-augur-sdk-src-state-getter-users-tradingposition.md)
* [UserAccountDataResult](api-interfaces-augur-sdk-src-state-getter-users-useraccountdataresult.md)
* [UserPositionTotals](api-interfaces-augur-sdk-src-state-getter-users-userpositiontotals.md)
* [UserTradingPositions](api-interfaces-augur-sdk-src-state-getter-users-usertradingpositions.md)

### Variables

* [DEFAULT_NUMBER_OF_BUCKETS](api-modules-augur-sdk-src-state-getter-users-module.md#default_number_of_buckets)
* [getProfitLossParams](api-modules-augur-sdk-src-state-getter-users-module.md#getprofitlossparams)
* [getProfitLossSummaryParams](api-modules-augur-sdk-src-state-getter-users-module.md#getprofitlosssummaryparams)
* [getUserAccountParams](api-modules-augur-sdk-src-state-getter-users-module.md#getuseraccountparams)
* [userTradingPositionsParams](api-modules-augur-sdk-src-state-getter-users-module.md#usertradingpositionsparams)

### Functions

* [bucketRangeByInterval](api-modules-augur-sdk-src-state-getter-users-module.md#bucketrangebyinterval)
* [getLastDocBeforeTimestamp](api-modules-augur-sdk-src-state-getter-users-module.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](api-modules-augur-sdk-src-state-getter-users-module.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](api-modules-augur-sdk-src-state-getter-users-module.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](api-modules-augur-sdk-src-state-getter-users-module.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](api-modules-augur-sdk-src-state-getter-users-module.md#groupdocumentsbymarketandoutcome)
* [reduceMarketAndOutcomeDocsToOnlyLatest](api-modules-augur-sdk-src-state-getter-users-module.md#reducemarketandoutcomedocstoonlylatest)
* [sumTradingPositions](api-modules-augur-sdk-src-state-getter-users-module.md#sumtradingpositions)

---

## Variables

<a id="default_number_of_buckets"></a>

### `<Const>` DEFAULT_NUMBER_OF_BUCKETS

**● DEFAULT_NUMBER_OF_BUCKETS**: *`30`* = 30

*Defined in [augur-sdk/src/state/getter/Users.ts:36](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L36)*

___
<a id="getprofitlossparams"></a>

### `<Const>` getProfitLossParams

**● getProfitLossParams**: *`IntersectionC`<[`PartialC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
  getProfitLossSummaryParams,
  t.partial({
    startTime: t.number,
    periodInterval: t.number,
    outcome: t.number,
  }),
])

*Defined in [augur-sdk/src/state/getter/Users.ts:60](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L60)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Const>` getProfitLossSummaryParams

**● getProfitLossSummaryParams**: *`PartialC`<`object`>* =  t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
})

*Defined in [augur-sdk/src/state/getter/Users.ts:54](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L54)*

___
<a id="getuseraccountparams"></a>

### `<Const>` getUserAccountParams

**● getUserAccountParams**: *`PartialC`<`object`>* =  t.partial({
  universe: t.string,
  account: t.string,
})

*Defined in [augur-sdk/src/state/getter/Users.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L49)*

___
<a id="usertradingpositionsparams"></a>

### `<Const>` userTradingPositionsParams

**● userTradingPositionsParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
  t.type({
    account: t.string,
  }),
  t.partial({
    universe: t.string,
    marketId: t.string,
    outcome: t.number,
  }),
])

*Defined in [augur-sdk/src/state/getter/Users.ts:38](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L38)*

___

## Functions

<a id="bucketrangebyinterval"></a>

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(startTime: *`number`*, endTime: *`number`*, periodInterval: *`number` \| `null`*): `BigNumber`[]

*Defined in [augur-sdk/src/state/getter/Users.ts:921](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L921)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startTime | `number` |
| endTime | `number` |
| periodInterval | `number` \| `null` |

**Returns:** `BigNumber`[]

___
<a id="getlastdocbeforetimestamp"></a>

###  getLastDocBeforeTimestamp

▸ **getLastDocBeforeTimestamp**<`TDoc`>(docs: *`TDoc`[]*, timestamp: *`BigNumber`*): `TDoc` \| `undefined`

*Defined in [augur-sdk/src/state/getter/Users.ts:1013](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L1013)*

**Type parameters:**

#### TDoc :  [Timestamped](api-interfaces-augur-sdk-src-state-logs-types-timestamped.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `TDoc`[] |
| timestamp | `BigNumber` |

**Returns:** `TDoc` \| `undefined`

___
<a id="getorderfilledrecordsbymarketandoutcome"></a>

###  getOrderFilledRecordsByMarketAndOutcome

▸ **getOrderFilledRecordsByMarketAndOutcome**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, orders: *[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*): `Promise`<`Dictionary`<`Dictionary`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>>>

*Defined in [augur-sdk/src/state/getter/Users.ts:967](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L967)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| orders | [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |

**Returns:** `Promise`<`Dictionary`<`Dictionary`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>>>

___
<a id="getprofitlossrecordsbymarketandoutcome"></a>

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, account: *`string`*, profitLossResult: *[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]*): `Promise`<`Dictionary`<`Dictionary`<[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>>>

*Defined in [augur-sdk/src/state/getter/Users.ts:957](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L957)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| account | `string` |
| profitLossResult | [ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[] |

**Returns:** `Promise`<`Dictionary`<`Dictionary`<[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>>>

___
<a id="gettradingpositionfromprofitlossframe"></a>

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(profitLossFrame: *[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md)*, marketDoc: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, onChainOutcomeValue: *`BigNumber`*, timestamp: *`number`*, shareTokenBalancesByMarketandOutcome: *`any`*): [TradingPosition](api-interfaces-augur-sdk-src-state-getter-users-tradingposition.md)

*Defined in [augur-sdk/src/state/getter/Users.ts:1026](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L1026)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| profitLossFrame | [ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md) |
| marketDoc | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| onChainOutcomeValue | `BigNumber` |
| timestamp | `number` |
| shareTokenBalancesByMarketandOutcome | `any` |

**Returns:** [TradingPosition](api-interfaces-augur-sdk-src-state-getter-users-tradingposition.md)

___
<a id="groupdocumentsbymarketandoutcome"></a>

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**<`TDoc`>(docs: *`TDoc`[]*, outcomeField?: *`string`*): `Dictionary`<`Dictionary`<`TDoc`[]>>

*Defined in [augur-sdk/src/state/getter/Users.ts:977](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L977)*

**Type parameters:**

#### TDoc :  [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| docs | `TDoc`[] | - |
| `Default value` outcomeField | `string` | &quot;outcome&quot; |

**Returns:** `Dictionary`<`Dictionary`<`TDoc`[]>>

___
<a id="reducemarketandoutcomedocstoonlylatest"></a>

###  reduceMarketAndOutcomeDocsToOnlyLatest

▸ **reduceMarketAndOutcomeDocsToOnlyLatest**<`TDoc`>(docs: *`Dictionary`<`Dictionary`<`TDoc`[]>>*): `Dictionary`<`Dictionary`<`TDoc`>>

*Defined in [augur-sdk/src/state/getter/Users.ts:990](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L990)*

**Type parameters:**

#### TDoc :  [Log](api-interfaces-augur-sdk-src-state-logs-types-log.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `Dictionary`<`Dictionary`<`TDoc`[]>> |

**Returns:** `Dictionary`<`Dictionary`<`TDoc`>>

___
<a id="sumtradingpositions"></a>

###  sumTradingPositions

▸ **sumTradingPositions**(tradingPositions: *[MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)[]*): [MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)

*Defined in [augur-sdk/src/state/getter/Users.ts:836](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Users.ts#L836)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradingPositions | [MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)[] |

**Returns:** [MarketTradingPosition](api-interfaces-augur-sdk-src-state-getter-users-markettradingposition.md)

___

