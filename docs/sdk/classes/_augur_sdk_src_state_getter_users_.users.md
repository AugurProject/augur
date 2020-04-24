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
* [getUserPositionsPlusParams](_augur_sdk_src_state_getter_users_.users.md#static-getuserpositionsplusparams)
* [getUserTradingPositionsParams](_augur_sdk_src_state_getter_users_.users.md#static-getusertradingpositionsparams)

### Methods

* [getAccountTimeRangedStats](_augur_sdk_src_state_getter_users_.users.md#static-getaccounttimerangedstats)
* [getProfitLoss](_augur_sdk_src_state_getter_users_.users.md#static-getprofitloss)
* [getProfitLossSummary](_augur_sdk_src_state_getter_users_.users.md#static-getprofitlosssummary)
* [getTotalOnChainFrozenFunds](_augur_sdk_src_state_getter_users_.users.md#static-gettotalonchainfrozenfunds)
* [getUserAccountData](_augur_sdk_src_state_getter_users_.users.md#static-getuseraccountdata)
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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:200](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L200)*

___

### `Static` getProfitLossParams

▪ **getProfitLossParams**: *IntersectionC‹[PartialC‹object›, PartialC‹object›]›* = getProfitLossParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:215](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L215)*

___

### `Static` getProfitLossSummaryParams

▪ **getProfitLossSummaryParams**: *PartialC‹object›* = getProfitLossSummaryParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:216](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L216)*

___

### `Static` getTotalOnChainFrozenFundsParams

▪ **getTotalOnChainFrozenFundsParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:218](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L218)*

___

### `Static` getUserAccountParams

▪ **getUserAccountParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:217](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L217)*

___

### `Static` getUserPositionsPlusParams

▪ **getUserPositionsPlusParams**: *PartialC‹object›* = getUserAccountParams

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:219](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L219)*

___

### `Static` getUserTradingPositionsParams

▪ **getUserTradingPositionsParams**: *IntersectionC‹[IntersectionC‹[TypeC‹object›, PartialC‹object›]›, PartialC‹object›]›* = t.intersection([
    userTradingPositionsParams,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:211](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L211)*

## Methods

### `Static` getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountTimeRangedStatsParams›): *Promise‹[AccountTimeRangedStatsResult](../interfaces/_augur_sdk_src_state_getter_users_.accounttimerangedstatsresult.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:460](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L460)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1033](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1033)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:1205](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L1205)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:962](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L962)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:222](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L222)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserAccountParams› |

**Returns:** *Promise‹[UserAccountDataResult](../interfaces/_augur_sdk_src_state_getter_users_.useraccountdataresult.md)›*

___

### `Static` getUserOpenOrders

▸ **getUserOpenOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserAccountParams›): *Promise‹[UserOpenOrders](../interfaces/_augur_sdk_src_state_getter_users_.useropenorders.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:399](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L399)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:347](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L347)*

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

*Defined in [packages/augur-sdk/src/state/getter/Users.ts:618](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Users.ts#L618)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserTradingPositionsParams› |

**Returns:** *Promise‹[UserTradingPositions](../interfaces/_augur_sdk_src_state_getter_users_.usertradingpositions.md)›*
