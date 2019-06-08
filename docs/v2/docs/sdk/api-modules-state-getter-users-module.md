---
id: api-modules-state-getter-users-module
title: state/getter/Users Module
sidebar_label: state/getter/Users
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Users Module]](api-modules-state-getter-users-module.md)

## Module

### Classes

* [Users](api-classes-state-getter-users-users.md)

### Interfaces

* [MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)
* [ProfitLossResult](api-interfaces-state-getter-users-profitlossresult.md)
* [TradingPosition](api-interfaces-state-getter-users-tradingposition.md)
* [UserTradingPositions](api-interfaces-state-getter-users-usertradingpositions.md)

### Variables

* [DEFAULT_NUMBER_OF_BUCKETS](api-modules-state-getter-users-module.md#default_number_of_buckets)
* [GetProfitLossParams](api-modules-state-getter-users-module.md#getprofitlossparams)
* [GetProfitLossSummaryParams](api-modules-state-getter-users-module.md#getprofitlosssummaryparams)
* [UserTradingPositionsParams](api-modules-state-getter-users-module.md#usertradingpositionsparams)

### Functions

* [bucketRangeByInterval](api-modules-state-getter-users-module.md#bucketrangebyinterval)
* [getLastDocBeforeTimestamp](api-modules-state-getter-users-module.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](api-modules-state-getter-users-module.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](api-modules-state-getter-users-module.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](api-modules-state-getter-users-module.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](api-modules-state-getter-users-module.md#groupdocumentsbymarketandoutcome)
* [reduceMarketAndOutcomeDocsToOnlyLatest](api-modules-state-getter-users-module.md#reducemarketandoutcomedocstoonlylatest)
* [sumTradingPositions](api-modules-state-getter-users-module.md#sumtradingpositions)

---

## Variables

<a id="default_number_of_buckets"></a>

### `<Const>` DEFAULT_NUMBER_OF_BUCKETS

**● DEFAULT_NUMBER_OF_BUCKETS**: *`30`* = 30

*Defined in [state/getter/Users.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L12)*

___
<a id="getprofitlossparams"></a>

### `<Const>` GetProfitLossParams

**● GetProfitLossParams**: *`any`* =  t.intersection([GetProfitLossSummaryParams, t.partial({
  startTime: t.number,
  periodInterval: t.number,
  outcome: t.number,
})])

*Defined in [state/getter/Users.ts:28](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L28)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Const>` GetProfitLossSummaryParams

**● GetProfitLossSummaryParams**: *`any`* =  t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
})

*Defined in [state/getter/Users.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L22)*

___
<a id="usertradingpositionsparams"></a>

### `<Const>` UserTradingPositionsParams

**● UserTradingPositionsParams**: *`any`* =  t.intersection([t.type({
  account: t.string,
}), t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: t.number,
})])

*Defined in [state/getter/Users.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L14)*

___

## Functions

<a id="bucketrangebyinterval"></a>

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(startTime: *`number`*, endTime: *`number`*, periodInterval: *`number` \| `null`*): `Array`<`BigNumber`>

*Defined in [state/getter/Users.ts:381](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L381)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startTime | `number` |
| endTime | `number` |
| periodInterval | `number` \| `null` |

**Returns:** `Array`<`BigNumber`>

___
<a id="getlastdocbeforetimestamp"></a>

###  getLastDocBeforeTimestamp

▸ **getLastDocBeforeTimestamp**<`TDoc`>(docs: *`Array`<`TDoc`>*, timestamp: *`BigNumber`*): `TDoc` \| `undefined`

*Defined in [state/getter/Users.ts:431](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L431)*

**Type parameters:**

#### TDoc :  [Timestamped](api-interfaces-state-logs-types-timestamped.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `Array`<`TDoc`> |
| timestamp | `BigNumber` |

**Returns:** `TDoc` \| `undefined`

___
<a id="getorderfilledrecordsbymarketandoutcome"></a>

###  getOrderFilledRecordsByMarketAndOutcome

▸ **getOrderFilledRecordsByMarketAndOutcome**(db: *[DB](api-classes-state-db-db-db.md)*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>>>>

*Defined in [state/getter/Users.ts:403](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L403)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>>>>

___
<a id="getprofitlossrecordsbymarketandoutcome"></a>

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(db: *[DB](api-classes-state-db-db-db.md)*, account: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md)>>>>

*Defined in [state/getter/Users.ts:398](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L398)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| account | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md)>>>>

___
<a id="gettradingpositionfromprofitlossframe"></a>

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(profitLossFrame: *[ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md)*, marketDoc: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*, onChainOutcomeValue: *`BigNumber`*, timestamp: *`number`*): [TradingPosition](api-interfaces-state-getter-users-tradingposition.md)

*Defined in [state/getter/Users.ts:439](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L439)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| profitLossFrame | [ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md) |
| marketDoc | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |
| onChainOutcomeValue | `BigNumber` |
| timestamp | `number` |

**Returns:** [TradingPosition](api-interfaces-state-getter-users-tradingposition.md)

___
<a id="groupdocumentsbymarketandoutcome"></a>

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**<`TDoc`>(docs: *`Array`<`TDoc`>*, outcomeField?: *`string`*): `_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>>

*Defined in [state/getter/Users.ts:408](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L408)*

**Type parameters:**

#### TDoc :  [Doc](api-interfaces-state-logs-types-doc.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| docs | `Array`<`TDoc`> | - |
| `Default value` outcomeField | `string` | &quot;outcome&quot; |

**Returns:** `_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>>

___
<a id="reducemarketandoutcomedocstoonlylatest"></a>

###  reduceMarketAndOutcomeDocsToOnlyLatest

▸ **reduceMarketAndOutcomeDocsToOnlyLatest**<`TDoc`>(docs: *`_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>>*): `_.Dictionary`<`_.Dictionary`<`TDoc`>>

*Defined in [state/getter/Users.ts:418](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L418)*

**Type parameters:**

#### TDoc :  [Doc](api-interfaces-state-logs-types-doc.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>> |

**Returns:** `_.Dictionary`<`_.Dictionary`<`TDoc`>>

___
<a id="sumtradingpositions"></a>

###  sumTradingPositions

▸ **sumTradingPositions**(tradingPositions: *`Array`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)>*): [MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)

*Defined in [state/getter/Users.ts:323](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Users.ts#L323)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradingPositions | `Array`<[MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)> |

**Returns:** [MarketTradingPosition](api-interfaces-state-getter-users-markettradingposition.md)

___

