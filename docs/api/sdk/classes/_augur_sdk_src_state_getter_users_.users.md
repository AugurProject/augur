[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Users"](../modules/_augur_sdk_src_state_getter_users_.md) › [Users](_augur_sdk_src_state_getter_users_.users.md)

# Class: Users

## Hierarchy

* **Users**

## Index

### Properties

* [getAccountTimeRangedStatsParams](_augur_sdk_src_state_getter_users_.users.md#static-getaccounttimerangedstatsparams)
* [getProfitLossParams](_augur_sdk_src_state_getter_users_.users.md#static-getprofitlossparams)
* [getProfitLossSummaryParams](_augur_sdk_src_state_getter_users_.users.md#static-getprofitlosssummaryparams)
* [getTotalOnChainFrozenFundsParams](_augur_sdk_src_state_getter_users_.users.md#static-gettotalonchainfrozenfundsparams)
* [getUserAccountParams](_augur_sdk_src_state_getter_users_.users.md#static-getuseraccountparams)
* [getUserFrozenFundsBreakdownParams](_augur_sdk_src_state_getter_users_.users.md#static-getuserfrozenfundsbreakdownparams)
* [getUserPositionsPlusParams](_augur_sdk_src_state_getter_users_.users.md#static-getuserpositionsplusparams)
* [getUserTradingPositionsParams](_augur_sdk_src_state_getter_users_.users.md#static-getusertradingpositionsparams)

### Methods

* [getAccountTimeRangedStats](_augur_sdk_src_state_getter_users_.users.md#static-getaccounttimerangedstats)
* [getProfitLoss](_augur_sdk_src_state_getter_users_.users.md#static-getprofitloss)
* [getProfitLossSummary](_augur_sdk_src_state_getter_users_.users.md#static-getprofitlosssummary)
* [getTotalOnChainFrozenFunds](_augur_sdk_src_state_getter_users_.users.md#static-gettotalonchainfrozenfunds)
* [getUserAccountData](_augur_sdk_src_state_getter_users_.users.md#static-getuseraccountdata)
* [getUserFrozenFundsBreakdown](_augur_sdk_src_state_getter_users_.users.md#static-getuserfrozenfundsbreakdown)
* [getUserOpenOrders](_augur_sdk_src_state_getter_users_.users.md#static-getuseropenorders)
* [getUserPositionsPlus](_augur_sdk_src_state_getter_users_.users.md#static-getuserpositionsplus)
* [getUserTradingPositions](_augur_sdk_src_state_getter_users_.users.md#static-getusertradingpositions)

## Properties

### `Static` getAccountTimeRangedStatsParams

▪ **getAccountTimeRangedStatsParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({
      universe: t.string,
      account: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    }),
  ])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:227](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L227)*

___

### `Static` getProfitLossParams

▪ **getProfitLossParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = getProfitLossParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:242](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L242)*

___

### `Static` getProfitLossSummaryParams

▪ **getProfitLossSummaryParams**: *PartialC‹object›* = getProfitLossSummaryParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:243](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L243)*

___

### `Static` getTotalOnChainFrozenFundsParams

▪ **getTotalOnChainFrozenFundsParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:246](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L246)*

___

### `Static` getUserAccountParams

▪ **getUserAccountParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:244](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L244)*

___

### `Static` getUserFrozenFundsBreakdownParams

▪ **getUserFrozenFundsBreakdownParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:245](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L245)*

___

### `Static` getUserPositionsPlusParams

▪ **getUserPositionsPlusParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:247](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L247)*

___

### `Static` getUserTradingPositionsParams

▪ **getUserTradingPositionsParams**: *IntersectionC‹[IntersectionC‹[TypeC‹object›, PartialC‹object›]›, PartialC‹object›]›* = t.intersection([
    userTradingPositionsParams,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:238](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L238)*

## Methods

### `Static` getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountTimeRangedStatsParams›): *Promise‹[AccountTimeRangedStatsResult](../interfaces/_augur_sdk_src_state_getter_users_.accounttimerangedstatsresult.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:596](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L596)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getAccountTimeRangedStatsParams› |

**Returns:** *Promise‹[AccountTimeRangedStatsResult](../interfaces/_augur_sdk_src_state_getter_users_.accounttimerangedstatsresult.md)›*

___

### `Static` getProfitLoss

▸ **getProfitLoss**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getProfitLossParams›): *Promise‹[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1164](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1164)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getProfitLossParams› |

**Returns:** *Promise‹[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)[]›*

___

### `Static` getProfitLossSummary

▸ **getProfitLossSummary**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getProfitLossSummaryParams›): *Promise‹NumericDictionary‹[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)››*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1354](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1354)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getProfitLossSummaryParams› |

**Returns:** *Promise‹NumericDictionary‹[MarketTradingPosition](../interfaces/_augur_sdk_src_state_getter_users_.markettradingposition.md)››*

___

### `Static` getTotalOnChainFrozenFunds

▸ **getTotalOnChainFrozenFunds**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getTotalOnChainFrozenFundsParams›): *Promise‹[UserTotalOnChainFrozenFunds](../interfaces/_augur_sdk_src_state_getter_users_.usertotalonchainfrozenfunds.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1132](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L1132)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getTotalOnChainFrozenFundsParams› |

**Returns:** *Promise‹[UserTotalOnChainFrozenFunds](../interfaces/_augur_sdk_src_state_getter_users_.usertotalonchainfrozenfunds.md)›*

___

### `Static` getUserAccountData

▸ **getUserAccountData**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserAccountParams›): *Promise‹[UserAccountDataResult](../interfaces/_augur_sdk_src_state_getter_users_.useraccountdataresult.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:250](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L250)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserAccountParams› |

**Returns:** *Promise‹[UserAccountDataResult](../interfaces/_augur_sdk_src_state_getter_users_.useraccountdataresult.md)›*

___

### `Static` getUserFrozenFundsBreakdown

▸ **getUserFrozenFundsBreakdown**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserFrozenFundsBreakdownParams›): *Promise‹[FrozenFundsBreakdown](../interfaces/_augur_sdk_src_state_getter_users_.frozenfundsbreakdown.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:437](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L437)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserFrozenFundsBreakdownParams› |

**Returns:** *Promise‹[FrozenFundsBreakdown](../interfaces/_augur_sdk_src_state_getter_users_.frozenfundsbreakdown.md)›*

___

### `Static` getUserOpenOrders

▸ **getUserOpenOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserAccountParams›): *Promise‹[UserOpenOrders](../interfaces/_augur_sdk_src_state_getter_users_.useropenorders.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:526](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L526)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserAccountParams› |

**Returns:** *Promise‹[UserOpenOrders](../interfaces/_augur_sdk_src_state_getter_users_.useropenorders.md)›*

___

### `Static` getUserPositionsPlus

▸ **getUserPositionsPlus**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserAccountParams›): *Promise‹[UserPositionsPlusResult](../interfaces/_augur_sdk_src_state_getter_users_.userpositionsplusresult.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:385](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L385)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserAccountParams› |

**Returns:** *Promise‹[UserPositionsPlusResult](../interfaces/_augur_sdk_src_state_getter_users_.userpositionsplusresult.md)›*

___

### `Static` getUserTradingPositions

▸ **getUserTradingPositions**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserTradingPositionsParams›): *Promise‹[UserTradingPositions](../interfaces/_augur_sdk_src_state_getter_users_.usertradingpositions.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:754](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Users.ts#L754)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserTradingPositionsParams› |

**Returns:** *Promise‹[UserTradingPositions](../interfaces/_augur_sdk_src_state_getter_users_.usertradingpositions.md)›*
