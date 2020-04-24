[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Accounts"](../modules/_augur_sdk_src_state_getter_accounts_.md) › [Accounts](_augur_sdk_src_state_getter_accounts_.accounts.md)

# Class: Accounts <**TBigNumber**>

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

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:150](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L150)*

___

### `Static` getAccountTransactionHistoryParams

▪ **getAccountTransactionHistoryParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    getAccountTransactionHistoryParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:145](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L145)*

___

### `Static` getUserCurrentDisputeStakeParams

▪ **getUserCurrentDisputeStakeParams**: *TypeC‹object›* = getUserCurrentDisputeStakeParams

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:152](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L152)*

## Methods

### `Static` getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**<**TBigNumber**>(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountRepStakeSummaryParams›): *Promise‹[AccountReportingHistory](../interfaces/_augur_sdk_src_state_getter_accounts_.accountreportinghistory.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:155](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L155)*

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

▸ **getAccountTransactionHistory**<**TBigNumber**>(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getAccountTransactionHistoryParams›): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:301](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L301)*

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

▸ **getMarketCreatedInfo**<**TBigNumber**>(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `transactionLogs`: Array‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md) | [TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md) | [DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md) | [InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md) | [DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md) | [InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md) | [CompleteSetsPurchasedLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetspurchasedlog.md) | [CompleteSetsSoldLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetssoldlog.md)›): *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:576](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L576)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`transactionLogs` | Array‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md) &#124; [TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md) &#124; [DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md) &#124; [InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md) &#124; [DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md) &#124; [InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md) &#124; [CompleteSetsPurchasedLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetspurchasedlog.md) &#124; [CompleteSetsSoldLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetssoldlog.md)› |

**Returns:** *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

___

### `Static` getMarketCreatedInfoByIds

▸ **getMarketCreatedInfoByIds**<**TBigNumber**>(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `marketIds`: string[]): *Promise‹[MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:593](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L593)*

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

▸ **getUserCurrentDisputeStake**<**TBigNumber**>(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getUserCurrentDisputeStakeParams›): *Promise‹[UserCurrentOutcomeDisputeStake](../interfaces/_augur_sdk_src_state_getter_accounts_.usercurrentoutcomedisputestake.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:537](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L537)*

**Type parameters:**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getUserCurrentDisputeStakeParams› |

**Returns:** *Promise‹[UserCurrentOutcomeDisputeStake](../interfaces/_augur_sdk_src_state_getter_accounts_.usercurrentoutcomedisputestake.md)[]›*
