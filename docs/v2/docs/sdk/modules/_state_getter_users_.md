[@augurproject/sdk](../README.md) > ["state/getter/Users"](../modules/_state_getter_users_.md)

# External module: "state/getter/Users"

## Index

### Classes

* [Users](../classes/_state_getter_users_.users.md)

### Interfaces

* [MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)
* [ProfitLossResult](../interfaces/_state_getter_users_.profitlossresult.md)
* [TradingPosition](../interfaces/_state_getter_users_.tradingposition.md)
* [UserTradingPositions](../interfaces/_state_getter_users_.usertradingpositions.md)

### Variables

* [DEFAULT_NUMBER_OF_BUCKETS](_state_getter_users_.md#default_number_of_buckets)
* [GetProfitLossParams](_state_getter_users_.md#getprofitlossparams)
* [GetProfitLossSummaryParams](_state_getter_users_.md#getprofitlosssummaryparams)
* [UserTradingPositionsParams](_state_getter_users_.md#usertradingpositionsparams)

### Functions

* [bucketRangeByInterval](_state_getter_users_.md#bucketrangebyinterval)
* [getLastDocBeforeTimestamp](_state_getter_users_.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](_state_getter_users_.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](_state_getter_users_.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](_state_getter_users_.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](_state_getter_users_.md#groupdocumentsbymarketandoutcome)
* [reduceMarketAndOutcomeDocsToOnlyLatest](_state_getter_users_.md#reducemarketandoutcomedocstoonlylatest)
* [sumTradingPositions](_state_getter_users_.md#sumtradingpositions)

---

## Variables

<a id="default_number_of_buckets"></a>

### `<Const>` DEFAULT_NUMBER_OF_BUCKETS

**● DEFAULT_NUMBER_OF_BUCKETS**: *`30`* = 30

*Defined in [state/getter/Users.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L12)*

___
<a id="getprofitlossparams"></a>

### `<Const>` GetProfitLossParams

**● GetProfitLossParams**: *`any`* =  t.intersection([GetProfitLossSummaryParams, t.partial({
  startTime: t.number,
  periodInterval: t.number,
  outcome: t.number,
})])

*Defined in [state/getter/Users.ts:28](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L28)*

___
<a id="getprofitlosssummaryparams"></a>

### `<Const>` GetProfitLossSummaryParams

**● GetProfitLossSummaryParams**: *`any`* =  t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
})

*Defined in [state/getter/Users.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L22)*

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

*Defined in [state/getter/Users.ts:14](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L14)*

___

## Functions

<a id="bucketrangebyinterval"></a>

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(startTime: *`number`*, endTime: *`number`*, periodInterval: *`number` \| `null`*): `Array`<`BigNumber`>

*Defined in [state/getter/Users.ts:381](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L381)*

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

*Defined in [state/getter/Users.ts:431](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L431)*

**Type parameters:**

#### TDoc :  [Timestamped](../interfaces/_state_logs_types_.timestamped.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `Array`<`TDoc`> |
| timestamp | `BigNumber` |

**Returns:** `TDoc` \| `undefined`

___
<a id="getorderfilledrecordsbymarketandoutcome"></a>

###  getOrderFilledRecordsByMarketAndOutcome

▸ **getOrderFilledRecordsByMarketAndOutcome**(db: *[DB](../classes/_state_db_db_.db.md)*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>>>

*Defined in [state/getter/Users.ts:403](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L403)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](../classes/_state_db_db_.db.md) |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>>>

___
<a id="getprofitlossrecordsbymarketandoutcome"></a>

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(db: *[DB](../classes/_state_db_db_.db.md)*, account: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)>>>>

*Defined in [state/getter/Users.ts:398](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L398)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](../classes/_state_db_db_.db.md) |
| account | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`_.Dictionary`<`_.Dictionary`<`Array`<[ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)>>>>

___
<a id="gettradingpositionfromprofitlossframe"></a>

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(profitLossFrame: *[ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)*, marketDoc: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*, onChainOutcomeValue: *`BigNumber`*, timestamp: *`number`*): [TradingPosition](../interfaces/_state_getter_users_.tradingposition.md)

*Defined in [state/getter/Users.ts:439](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L439)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| profitLossFrame | [ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md) |
| marketDoc | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |
| onChainOutcomeValue | `BigNumber` |
| timestamp | `number` |

**Returns:** [TradingPosition](../interfaces/_state_getter_users_.tradingposition.md)

___
<a id="groupdocumentsbymarketandoutcome"></a>

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**<`TDoc`>(docs: *`Array`<`TDoc`>*, outcomeField?: *`string`*): `_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>>

*Defined in [state/getter/Users.ts:408](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L408)*

**Type parameters:**

#### TDoc :  [Doc](../interfaces/_state_logs_types_.doc.md)
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

*Defined in [state/getter/Users.ts:418](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L418)*

**Type parameters:**

#### TDoc :  [Doc](../interfaces/_state_logs_types_.doc.md)
**Parameters:**

| Name | Type |
| ------ | ------ |
| docs | `_.Dictionary`<`_.Dictionary`<`Array`<`TDoc`>>> |

**Returns:** `_.Dictionary`<`_.Dictionary`<`TDoc`>>

___
<a id="sumtradingpositions"></a>

###  sumTradingPositions

▸ **sumTradingPositions**(tradingPositions: *`Array`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)>*): [MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)

*Defined in [state/getter/Users.ts:323](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Users.ts#L323)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradingPositions | `Array`<[MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)> |

**Returns:** [MarketTradingPosition](../interfaces/_state_getter_users_.markettradingposition.md)

___

