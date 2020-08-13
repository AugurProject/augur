[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Users"](_augur_sdk_src_state_getter_users_.md)

# Module: "augur-sdk/src/state/getter/Users"

## Index

### Classes

* [Users](../classes/_augur_sdk_src_state_getter_users_.users.md)

### Interfaces

* [AccountTimeRangedStatsResult](../interfaces/_augur_sdk_src_state_getter_users_.accounttimerangedstatsresult.md)
* [FrozenFundsBreakdown](../interfaces/_augur_sdk_src_state_getter_users_.frozenfundsbreakdown.md)
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
* [getFrozenFundsPerMarket](_augur_sdk_src_state_getter_users_.md#getfrozenfundspermarket)
* [getFullMarketPositionLoss](_augur_sdk_src_state_getter_users_.md#getfullmarketpositionloss)
* [getLastDocBeforeTimestamp](_augur_sdk_src_state_getter_users_.md#getlastdocbeforetimestamp)
* [getOrderFilledRecordsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#getorderfilledrecordsbymarketandoutcome)
* [getProfitLossRecordsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#getprofitlossrecordsbymarketandoutcome)
* [getTradingPositionFromProfitLossFrame](_augur_sdk_src_state_getter_users_.md#gettradingpositionfromprofitlossframe)
* [groupDocumentsByMarketAndOutcome](_augur_sdk_src_state_getter_users_.md#groupdocumentsbymarketandoutcome)
* [populateUserShareBalances](_augur_sdk_src_state_getter_users_.md#populateusersharebalances)
* [reduceMarketAndOutcomeDocsToOnlyLatest](_augur_sdk_src_state_getter_users_.md#reducemarketandoutcomedocstoonlylatest)
* [reduceMarketAndOutcomeDocsToOnlyPriorLatest](_augur_sdk_src_state_getter_users_.md#reducemarketandoutcomedocstoonlypriorlatest)
* [sumTradingPositions](_augur_sdk_src_state_getter_users_.md#sumtradingpositions)

## Variables

### `Const` DAYS_IN_MONTH

• **DAYS_IN_MONTH**: *30* = 30

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:48](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L48)*

___

### `Const` DEFAULT_NUMBER_OF_BUCKETS

• **DEFAULT_NUMBER_OF_BUCKETS**: *30* = DAYS_IN_MONTH

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:49](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L49)*

___

### `Const` ONE_DAY

• **ONE_DAY**: *1* = 1

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:47](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L47)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:74](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L74)*

___

### `Const` getProfitLossSummaryParams

• **getProfitLossSummaryParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
  ignoreAwaitingAndFinalizedMarkets: t.boolean,
})

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:67](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L67)*

___

### `Const` getUserAccountParams

• **getUserAccountParams**: *PartialC‹object›* = t.partial({
  universe: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:62](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L62)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:51](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L51)*

## Functions

###  addEscrowedAmountsDecrementShares

▸ **addEscrowedAmountsDecrementShares**(`order`: Order, `outcome`: string, `orderType`: number, `market`: MarketData, `userSharesBalances`: object, `position?`: [TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)): *void*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1651](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1651)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | Order |
`outcome` | string |
`orderType` | number |
`market` | MarketData |
`userSharesBalances` | object |
`position?` | [TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md) |

**Returns:** *void*

___

###  bucketRangeByInterval

▸ **bucketRangeByInterval**(`startTime`: number, `endTime`: number, `periodInterval`: number | null): *BigNumber[]*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1491](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1491)*

**Parameters:**

Name | Type |
------ | ------ |
`startTime` | number |
`endTime` | number |
`periodInterval` | number &#124; null |

**Returns:** *BigNumber[]*

___

###  getDisplayValuesForPosition

▸ **getDisplayValuesForPosition**(`profitLossFrame`: ProfitLossChangedLog, `marketDoc`: MarketData): *object*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1859](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1859)*

**Parameters:**

Name | Type |
------ | ------ |
`profitLossFrame` | ProfitLossChangedLog |
`marketDoc` | MarketData |

**Returns:** *object*

* **avgPrice**: *string* = avgPrice.toFixed()

* **netPosition**: *string* = netPosition.toFixed()

* **unrealizedCost**: *string* = onChainUnrealizedCost.dividedBy(10 ** 18).toFixed()

___

###  getFrozenFundsPerMarket

▸ **getFrozenFundsPerMarket**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `account`: string, `universe`: string): *Promise‹object›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1930](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1930)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`account` | string |
`universe` | string |

**Returns:** *Promise‹object›*

___

###  getFullMarketPositionLoss

▸ **getFullMarketPositionLoss**(`db`: any, `allProfitLossResults`: any, `shareTokenBalancesByMarketAndOutcome`: any): *Promise‹string[]›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1893](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1893)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | any |
`allProfitLossResults` | any |
`shareTokenBalancesByMarketAndOutcome` | any |

**Returns:** *Promise‹string[]›*

___

###  getLastDocBeforeTimestamp

▸ **getLastDocBeforeTimestamp**‹**TDoc**›(`docs`: TDoc[], `timestamp`: BigNumber): *TDoc | undefined*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1623](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1623)*

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

▸ **getOrderFilledRecordsByMarketAndOutcome**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `orders`: ParsedOrderEventLog[]): *Promise‹Dictionary‹Dictionary‹ParsedOrderEventLog[]›››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1537](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1537)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`orders` | ParsedOrderEventLog[] |

**Returns:** *Promise‹Dictionary‹Dictionary‹ParsedOrderEventLog[]›››*

___

###  getProfitLossRecordsByMarketAndOutcome

▸ **getProfitLossRecordsByMarketAndOutcome**(`db`: [DB](../classes/_augur_sdk_src_state_db_db_.db.md), `account`: string, `profitLossResult`: ProfitLossChangedLog[]): *Promise‹Dictionary‹Dictionary‹ProfitLossChangedLog[]›››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1527](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1527)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](../classes/_augur_sdk_src_state_db_db_.db.md) |
`account` | string |
`profitLossResult` | ProfitLossChangedLog[] |

**Returns:** *Promise‹Dictionary‹Dictionary‹ProfitLossChangedLog[]›››*

___

###  getTradingPositionFromProfitLossFrame

▸ **getTradingPositionFromProfitLossFrame**(`profitLossFrame`: ProfitLossChangedLog, `marketDoc`: MarketData, `onChainOutcomeValue`: BigNumber, `onChain24HrOutcomeValue`: BigNumber | undefined, `timestamp`: number, `shareTokenBalancesByMarketAndOutcome`: any, `finalized`: boolean): *[TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1711](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1711)*

**Parameters:**

Name | Type |
------ | ------ |
`profitLossFrame` | ProfitLossChangedLog |
`marketDoc` | MarketData |
`onChainOutcomeValue` | BigNumber |
`onChain24HrOutcomeValue` | BigNumber &#124; undefined |
`timestamp` | number |
`shareTokenBalancesByMarketAndOutcome` | any |
`finalized` | boolean |

**Returns:** *[TradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.tradingposition.md)*

___

###  groupDocumentsByMarketAndOutcome

▸ **groupDocumentsByMarketAndOutcome**‹**TDoc**›(`docs`: TDoc[], `outcomeField`: string): *Dictionary‹Dictionary‹TDoc[]››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1547](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1547)*

**Type parameters:**

▪ **TDoc**: *Log*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`docs` | TDoc[] | - |
`outcomeField` | string | "outcome" |

**Returns:** *Dictionary‹Dictionary‹TDoc[]››*

___

###  populateUserShareBalances

▸ **populateUserShareBalances**(`numOutcomes`: number, `userSharesBalances`: object): *object*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1636](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1636)*

**Parameters:**

Name | Type |
------ | ------ |
`numOutcomes` | number |
`userSharesBalances` | object |

**Returns:** *object*

* \[ **outcome**: *string*\]: string

___

###  reduceMarketAndOutcomeDocsToOnlyLatest

▸ **reduceMarketAndOutcomeDocsToOnlyLatest**‹**TDoc**›(`docs`: Dictionary‹Dictionary‹TDoc[]››): *Dictionary‹Dictionary‹TDoc››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1560](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1560)*

**Type parameters:**

▪ **TDoc**: *Log*

**Parameters:**

Name | Type |
------ | ------ |
`docs` | Dictionary‹Dictionary‹TDoc[]›› |

**Returns:** *Dictionary‹Dictionary‹TDoc››*

___

###  reduceMarketAndOutcomeDocsToOnlyPriorLatest

▸ **reduceMarketAndOutcomeDocsToOnlyPriorLatest**‹**TDoc**›(`docs`: Dictionary‹Dictionary‹ProfitLossChangedLog[]››, `latest`: Dictionary‹Dictionary‹ProfitLossChangedLog››): *Dictionary‹Dictionary‹ProfitLossChangedLog››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1584](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1584)*

**Type parameters:**

▪ **TDoc**: *ProfitLossChangedLog*

**Parameters:**

Name | Type |
------ | ------ |
`docs` | Dictionary‹Dictionary‹ProfitLossChangedLog[]›› |
`latest` | Dictionary‹Dictionary‹ProfitLossChangedLog›› |

**Returns:** *Dictionary‹Dictionary‹ProfitLossChangedLog››*

___

###  sumTradingPositions

▸ **sumTradingPositions**(`tradingPositions`: [MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[]): *[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1392](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1392)*

**Parameters:**

Name | Type |
------ | ------ |
`tradingPositions` | [MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[] |

**Returns:** *[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)*
