---
id: api-modules-packages-augur-sdk-src-state-getter-users-module
title: packages/augur-sdk/src/state/getter/Users Module
sidebar_label: packages/augur-sdk/src/state/getter/Users
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Users Module]](api-modules-packages-augur-sdk-src-state-getter-users-module.md)

## Module

### Classes

* [Users](api-classes-packages-augur-sdk-src-state-getter-users-users.md)

### Interfaces

* [MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)
* [ProfitLossResult](api-interfaces-packages-augur-sdk-src-state-getter-users-profitlossresult.md)
* [TradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-tradingposition.md)
* [UserTradingPositions](api-interfaces-packages-augur-sdk-src-state-getter-users-usertradingpositions.md)

### Variables

* [DEFAULT_NUMBER_OF_BUCKETS](api-modules-packages-augur-sdk-src-state-getter-users-module.md#default_number_of_buckets)
* [getProfitLossParams](api-modules-packages-augur-sdk-src-state-getter-users-module.md#getprofitlossparams)
* [getProfitLossSummaryParams](api-modules-packages-augur-sdk-src-state-getter-users-module.md#getprofitlosssummaryparams)
* [userTradingPositionsParams](api-modules-packages-augur-sdk-src-state-getter-users-module.md#usertradingpositionsparams)

### Functions

* [bucketRangeByInterval](api-modules-packages-augur-sdk-src-state-getter-users-module.md#bucketrangebyinterval)
* [getLastDocBeforeTimestamp](api-modules-packages-augur-sdk-src-state-getter-users-module.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](api-modules-packages-augur-sdk-src-state-getter-users-module.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](api-modules-packages-augur-sdk-src-state-getter-users-module.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](api-modules-packages-augur-sdk-src-state-getter-users-module.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](api-modules-packages-augur-sdk-src-state-getter-users-module.md#groupdocumentsbymarketandoutcome)
* [reduceMarketAndOutcomeDocsToOnlyLatest](api-modules-packages-augur-sdk-src-state-getter-users-module.md#reducemarketandoutcomedocstoonlylatest)
* [sumTradingPositions](api-modules-packages-augur-sdk-src-state-getter-users-module.md#sumtradingpositions)

---

## Variables

<a id="default_number_of_buckets"></a>

### `<Const>` DEFAULT_NUMBER_OF_BUCKETS

**● DEFAULT_NUMBER_OF_BUCKETS**: *`30`* = 30

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:24](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L24)*

___
<a id="getprofitlossparams"></a>

### `<Const>` getProfitLossParams

**● getProfitLossParams**: *`IntersectionType`<[`PartialType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
  getProfitLossSummaryParams,
  t.partial({
    startTime: t.number,
    periodInterval: t.number,
    outcome: t.number,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:43](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L43)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Const>` getProfitLossSummaryParams

**● getProfitLossSummaryParams**: *`PartialType`<`object`, `object`, `object`, `unknown`>* =  t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
})

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:37](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L37)*

___
<a id="usertradingpositionsparams"></a>

### `<Const>` userTradingPositionsParams

**● userTradingPositionsParams**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
  t.type({
    account: t.string,
  }),
  t.partial({
    universe: t.string,
    marketId: t.string,
    outcome: t.number,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:26](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L26)*

___

## Functions

<a id="bucketrangebyinterval"></a>

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(startTime: *`number`*, endTime: *`number`*, periodInterval: *`number` \| `null`*): `BigNumber`[]

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:559](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L559)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:652](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L652)*

**Type parameters:**

#### TDoc :  [Timestamped](api-interfaces-packages-augur-sdk-src-state-logs-types-timestamped.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `TDoc`[] |
| timestamp | `BigNumber` |

**Returns:** `TDoc` \| `undefined`

___
<a id="getorderfilledrecordsbymarketandoutcome"></a>

###  getOrderFilledRecordsByMarketAndOutcome

▸ **getOrderFilledRecordsByMarketAndOutcome**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>>>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:606](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L606)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>>>

___
<a id="getprofitlossrecordsbymarketandoutcome"></a>

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, account: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>>>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:595](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L595)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| account | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>>>

___
<a id="gettradingpositionfromprofitlossframe"></a>

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(profitLossFrame: *[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)*, marketDoc: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)*, onChainOutcomeValue: *`BigNumber`*, timestamp: *`number`*, shareTokenBalancesByMarketandOutcome: *`any`*): [TradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-tradingposition.md)

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:665](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L665)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| profitLossFrame | [ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md) |
| marketDoc | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md) |
| onChainOutcomeValue | `BigNumber` |
| timestamp | `number` |
| shareTokenBalancesByMarketandOutcome | `any` |

**Returns:** [TradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-tradingposition.md)

___
<a id="groupdocumentsbymarketandoutcome"></a>

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**<`TDoc`>(docs: *`TDoc`[]*, outcomeField?: *`string`*): `_.Dictionary`<`_.Dictionary`<`TDoc`[]>>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:617](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L617)*

**Type parameters:**

#### TDoc :  [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| docs | `TDoc`[] | - |
| `Default value` outcomeField | `string` | &quot;outcome&quot; |

**Returns:** `_.Dictionary`<`_.Dictionary`<`TDoc`[]>>

___
<a id="reducemarketandoutcomedocstoonlylatest"></a>

###  reduceMarketAndOutcomeDocsToOnlyLatest

▸ **reduceMarketAndOutcomeDocsToOnlyLatest**<`TDoc`>(docs: *`_.Dictionary`<`_.Dictionary`<`TDoc`[]>>*): `_.Dictionary`<`_.Dictionary`<`TDoc`>>

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:630](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L630)*

**Type parameters:**

#### TDoc :  [Doc](api-interfaces-packages-augur-sdk-src-state-logs-types-doc.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `_.Dictionary`<`_.Dictionary`<`TDoc`[]>> |

**Returns:** `_.Dictionary`<`_.Dictionary`<`TDoc`>>

___
<a id="sumtradingpositions"></a>

###  sumTradingPositions

▸ **sumTradingPositions**(tradingPositions: *[MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)[]*): [MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:479](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/getter/Users.ts#L479)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradingPositions | [MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)[] |

**Returns:** [MarketTradingPosition](api-interfaces-packages-augur-sdk-src-state-getter-users-markettradingposition.md)

___

