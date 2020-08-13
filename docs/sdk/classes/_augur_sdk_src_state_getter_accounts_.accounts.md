[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Accounts"](../modules/_augur_sdk_src_state_getter_accounts_.md) › [Accounts](_augur_sdk_src_state_getter_accounts_.accounts.md)

# Class: Accounts ‹**TBigNumber**›

## Type parameters

▪ **TBigNumber**

## Hierarchy

* **Accounts**

## Index

### Properties

* [getAccountRepStakeSummaryParams](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getaccountrepstakesummaryparams)
* [getAccountTransactionHistoryParams](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getaccounttransactionhistoryparams)
* [getUserCurrentDisputeStakeParams](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getusercurrentdisputestakeparams)

### Methods

* [getAccountRepStakeSummary](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getaccountrepstakesummary)
* [getAccountTransactionHistory](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getaccounttransactionhistory)
* [getMarketCreatedInfo](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getmarketcreatedinfo)
* [getMarketCreatedInfoByIds](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getmarketcreatedinfobyids)
* [getUserCurrentDisputeStake](_augur_sdk_src_state_getter_accounts_.accounts.md#static-getusercurrentdisputestake)

## Properties

### `Static` getAccountRepStakeSummaryParams

▪ **getAccountRepStakeSummaryParams**: *TypeC‹object›* = getAccountRepStakeSummaryParamsSpecific

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:154](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L154)*

___

### `Static` getAccountTransactionHistoryParams

▪ **getAccountTransactionHistoryParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    getAccountTransactionHistoryParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:149](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L149)*

___

### `Static` getUserCurrentDisputeStakeParams

▪ **getUserCurrentDisputeStakeParams**: *TypeC‹object›* = getUserCurrentDisputeStakeParams

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:156](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L156)*

## Methods

### `Static` getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**‹**TBigNumber**›(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountRepStakeSummaryParams›): *Promise‹[AccountReportingHistory](../interfaces/_augur_sdk_src_state_getter_accounts_.accountreportinghistory.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:159](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L159)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getAccountRepStakeSummaryParams› |

**Returns:** *Promise‹[AccountReportingHistory](../interfaces/_augur_sdk_src_state_getter_accounts_.accountreportinghistory.md)›*

___

### `Static` getAccountTransactionHistory

▸ **getAccountTransactionHistory**‹**TBigNumber**›(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountTransactionHistoryParams›): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:443](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L443)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getAccountTransactionHistoryParams› |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

### `Static` getMarketCreatedInfo

▸ **getMarketCreatedInfo**‹**TBigNumber**›(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `transactionLogs`: Array‹ParsedOrderEventLog | TradingProceedsClaimedLog | DisputeCrowdsourcerRedeemedLog | InitialReporterRedeemedLog | DisputeCrowdsourcerContributionLog | InitialReportSubmittedLog | CompleteSetsPurchasedLog | CompleteSetsSoldLog›): *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:798](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L798)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`transactionLogs` | Array‹ParsedOrderEventLog &#124; TradingProceedsClaimedLog &#124; DisputeCrowdsourcerRedeemedLog &#124; InitialReporterRedeemedLog &#124; DisputeCrowdsourcerContributionLog &#124; InitialReportSubmittedLog &#124; CompleteSetsPurchasedLog &#124; CompleteSetsSoldLog› |

**Returns:** *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

___

### `Static` getMarketCreatedInfoByIds

▸ **getMarketCreatedInfoByIds**‹**TBigNumber**›(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `marketIds`: string[]): *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:815](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L815)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`marketIds` | string[] |

**Returns:** *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

___

### `Static` getUserCurrentDisputeStake

▸ **getUserCurrentDisputeStake**‹**TBigNumber**›(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserCurrentDisputeStakeParams›): *Promise‹[UserCurrentOutcomeDisputeStake](../interfaces/_augur_sdk_src_state_getter_accounts_.usercurrentoutcomedisputestake.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:734](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L734)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserCurrentDisputeStakeParams› |

**Returns:** *Promise‹[UserCurrentOutcomeDisputeStake](../interfaces/_augur_sdk_src_state_getter_accounts_.usercurrentoutcomedisputestake.md)[]›*
