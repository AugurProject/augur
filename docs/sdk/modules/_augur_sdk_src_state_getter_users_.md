[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Users"](_augur_sdk_src_state_getter_users_.md)

# Module: "augur-sdk/src/state/getter/Users"

## Index

### Classes

* [Users](../classes/_augur_sdk_src_state_getter_users_.users.md)

### Interfaces

* [AccountTimeRangedStatsResult](../interfaces/_augur_sdk_src_state_getter_users_.accounttimerangedstatsresult.md)
* [MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)
* [ProfitLossResult](../interfaces/_augur_sdk_src_state_getter_users_.profitlossresult.md)
* [TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)
* [UserAccountDataResult](../interfaces/_augur_sdk_src_state_getter_users_.useraccountdataresult.md)
* [UserOpenOrders](../interfaces/_augur_sdk_src_state_getter_users_.useropenorders.md)
* [UserPositionTotals](../interfaces/_augur_sdk_src_state_getter_users_.userpositiontotals.md)
* [UserPositionsPlusResult](../interfaces/_augur_sdk_src_state_getter_users_.userpositionsplusresult.md)
* [UserTotalOnChainFrozenFunds](../interfaces/_augur_sdk_src_state_getter_users_.usertotalonchainfrozenfunds.md)
* [UserTradingPositions](../interfaces/_augur_sdk_src_state_getter_users_.usertradingpositions.md)

### Variables

* [DAYS_IN_MONTH](_augur_sdk_src_state_getter_users_.md#const-days_in_month)
* [DEFAULT_NUMBER_OF_BUCKETS](_augur_sdk_src_state_getter_users_.md#const-default_number_of_buckets)
* [ONE_DAY](_augur_sdk_src_state_getter_users_.md#const-one_day)
* [getProfitLossParams](_augur_sdk_src_state_getter_users_.md#const-getprofitlossparams)
* [getProfitLossSummaryParams](_augur_sdk_src_state_getter_users_.md#const-getprofitlosssummaryparams)
* [getUserAccountParams](_augur_sdk_src_state_getter_users_.md#const-getuseraccountparams)
* [userTradingPositionsParams](_augur_sdk_src_state_getter_users_.md#const-usertradingpositionsparams)

### Functions

* [addEscrowedAmountsDecrementShares](_augur_sdk_src_state_getter_users_.md#addescrowedamountsdecrementshares)
* [bucketRangeByInterval](_augur_sdk_src_state_getter_users_.md#bucketrangebyinterval)
* [getDisplayValuesForPosition](_augur_sdk_src_state_getter_users_.md#getdisplayvaluesforposition)
* [getFullMarketPositionLoss](_augur_sdk_src_state_getter_users_.md#getfullmarketpositionloss)
* [getLastDocBeforeTimestamp](_augur_sdk_src_state_getter_users_.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](_augur_sdk_src_state_getter_users_.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#groupdocumentsbymarketandoutcome)
* [reduceMarketAndOutcomeDocsToOnlyLatest](_augur_sdk_src_state_getter_users_.md#reducemarketandoutcomedocstoonlylatest)
* [reduceMarketAndOutcomeDocsToOnlyPriorLatest](_augur_sdk_src_state_getter_users_.md#reducemarketandoutcomedocstoonlypriorlatest)
* [sumTradingPositions](_augur_sdk_src_state_getter_users_.md#sumtradingpositions)

## Variables

### `Const` DAYS_IN_MONTH

• **DAYS_IN_MONTH**: *30* = 30

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:42](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L42)*

___

### `Const` DEFAULT_NUMBER_OF_BUCKETS

• **DEFAULT_NUMBER_OF_BUCKETS**: *30* = DAYS_IN_MONTH

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:43](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L43)*

___

### `Const` ONE_DAY

• **ONE_DAY**: *1* = 1

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L41)*

___

### `Const` getProfitLossParams

• **getProfitLossParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = t.intersection([
  getProfitLossSummaryParams,
  t.partial({
    startTime: t.number,
    periodInterval: t.number,
    outcome: t.number,
    ignoreAwaitingAndFinalizedMarkets: t.boolean,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:68](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L68)*

___

### `Const` getProfitLossSummaryParams

• **getProfitLossSummaryParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
  ignoreAwaitingAndFinalizedMarkets: t.boolean
})

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L61)*

___

### `Const` getUserAccountParams

• **getUserAccountParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L56)*

___

### `Const` userTradingPositionsParams

• **userTradingPositionsParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
  t.type({
    account: t.string,
  }),
  t.partial({
    universe: t.string,
    marketId: t.string,
    outcome: t.number,
  }),
])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:45](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L45)*

## Functions

###  addEscrowedAmountsDecrementShares

▸ **addEscrowedAmountsDecrementShares**(`order`: [Order](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.order.md), `outcome`: string, `orderType`: number, `market`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `userSharesBalances`: object): *void*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1490](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1490)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | [Order](../interfaces/_augur_sdk_src_state_getter_onchaintrading_.order.md) |
`outcome` | string |
`orderType` | number |
`market` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`userSharesBalances` | object |

**Returns:** *void*

___

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(`startTime`: number, `endTime`: number, `periodInterval`: number | null): *BigNumber[]*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1359](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1359)*

**Parameters:**

Name | Type |
------ | ------ |
`startTime` | number |
`endTime` | number |
`periodInterval` | number &#124; null |

**Returns:** *BigNumber[]*

___

###  getDisplayValuesForPosition

▸ **getDisplayValuesForPosition**(`profitLossFrame`: [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md), `marketDoc`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)): *object*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1691](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1691)*

**Parameters:**

Name | Type |
------ | ------ |
`profitLossFrame` | [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md) |
`marketDoc` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |

**Returns:** *object*

* **avgPrice**: *string* = avgPrice.toFixed()

* **netPosition**: *string* = netPosition.toFixed()

* **unrealizedCost**: *string* = onChainUnrealizedCost.dividedBy(10 ** 18).toFixed()

___

###  getFullMarketPositionLoss

▸ **getFullMarketPositionLoss**(`db`: any, `allProfitLossResults`: any, `shareTokenBalancesByMarketAndOutcome`: any): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1725](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1725)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | any |
`allProfitLossResults` | any |
`shareTokenBalancesByMarketAndOutcome` | any |

**Returns:** *Promise‹string[]›*

___

###  getLastDocBeforeTimestamp

▸ **getLastDocBeforeTimestamp**<**TDoc**>(`docs`: TDoc[], `timestamp`: BigNumber): *TDoc | undefined*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1477](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1477)*

**Type parameters:**

▪ **TDoc**: *object*

**Parameters:**

Name | Type |
------ | ------ |
`docs` | TDoc[] |
`timestamp` | BigNumber |

**Returns:** *TDoc | undefined*

___

###  getOrderFilledRecordsByMarketAndOutcome

▸ **getOrderFilledRecordsByMarketAndOutcome**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `orders`: [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]): *Promise‹Dictionary‹Dictionary‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]›››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1405](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1405)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`orders` | [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[] |

**Returns:** *Promise‹Dictionary‹Dictionary‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[]›››*

___

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `account`: string, `profitLossResult`: [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[]): *Promise‹Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[]›››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1395](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1395)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`account` | string |
`profitLossResult` | [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[] |

**Returns:** *Promise‹Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[]›››*

___

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(`profitLossFrame`: [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md), `marketDoc`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `onChainOutcomeValue`: BigNumber, `onChain24HrOutcomeValue`: BigNumber | undefined, `timestamp`: number, `shareTokenBalancesByMarketAndOutcome`: any, `finalized`: boolean): *[TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1551](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1551)*

**Parameters:**

Name | Type |
------ | ------ |
`profitLossFrame` | [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md) |
`marketDoc` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`onChainOutcomeValue` | BigNumber |
`onChain24HrOutcomeValue` | BigNumber &#124; undefined |
`timestamp` | number |
`shareTokenBalancesByMarketAndOutcome` | any |
`finalized` | boolean |

**Returns:** *[TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)*

___

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**<**TDoc**>(`docs`: TDoc[], `outcomeField`: string): *Dictionary‹Dictionary‹TDoc[]››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1415](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1415)*

**Type parameters:**

▪ **TDoc**: *[Log](../interfaces/_augur_sdk_src_state_logs_types_.log.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`docs` | TDoc[] | - |
`outcomeField` | string | "outcome" |

**Returns:** *Dictionary‹Dictionary‹TDoc[]››*

___

###  reduceMarketAndOutcomeDocsToOnlyLatest

▸ **reduceMarketAndOutcomeDocsToOnlyLatest**<**TDoc**>(`docs`: Dictionary‹Dictionary‹TDoc[]››): *Dictionary‹Dictionary‹TDoc››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1428](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1428)*

**Type parameters:**

▪ **TDoc**: *[Log](../interfaces/_augur_sdk_src_state_logs_types_.log.md)*

**Parameters:**

Name | Type |
------ | ------ |
`docs` | Dictionary‹Dictionary‹TDoc[]›› |

**Returns:** *Dictionary‹Dictionary‹TDoc››*

___

###  reduceMarketAndOutcomeDocsToOnlyPriorLatest

▸ **reduceMarketAndOutcomeDocsToOnlyPriorLatest**<**TDoc**>(`docs`: Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[]››, `latest`: Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)››): *Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1452](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1452)*

**Type parameters:**

▪ **TDoc**: *[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)*

**Parameters:**

Name | Type |
------ | ------ |
`docs` | Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)[]›› |
`latest` | Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)›› |

**Returns:** *Dictionary‹Dictionary‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)››*

___

###  sumTradingPositions

▸ **sumTradingPositions**(`tradingPositions`: [MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[]): *[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1260](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1260)*

**Parameters:**

Name | Type |
------ | ------ |
`tradingPositions` | [MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[] |

**Returns:** *[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)*
