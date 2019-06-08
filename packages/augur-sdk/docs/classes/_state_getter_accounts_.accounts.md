[@augurproject/sdk](../README.md) > ["state/getter/Accounts"](../modules/_state_getter_accounts_.md) > [Accounts](../classes/_state_getter_accounts_.accounts.md)

# Class: Accounts

## Type parameters
#### TBigNumber 
## Hierarchy

**Accounts**

## Index

### Properties

* [GetAccountTransactionHistoryParams](_state_getter_accounts_.accounts.md#getaccounttransactionhistoryparams)

### Methods

* [getAccountTransactionHistory](_state_getter_accounts_.accounts.md#getaccounttransactionhistory)
* [getMarketCreatedInfo](_state_getter_accounts_.accounts.md#getmarketcreatedinfo)

---

## Properties

<a id="getaccounttransactionhistoryparams"></a>

### `<Static>` GetAccountTransactionHistoryParams

**● GetAccountTransactionHistoryParams**: *`any`* =  t.intersection([GetAccountTransactionHistoryParamsSpecific, SortLimit])

*Defined in [state/getter/Accounts.ts:83](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L83)*

___

## Methods

<a id="getaccounttransactionhistory"></a>

### `<Static>` getAccountTransactionHistory

▸ **getAccountTransactionHistory**<`TBigNumber`>(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:86](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L86)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

___
<a id="getmarketcreatedinfo"></a>

### `<Static>` getMarketCreatedInfo

▸ **getMarketCreatedInfo**<`TBigNumber`>(db: *[DB](_state_db_db_.db.md)*, transactionLogs: *`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md) \| [TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md) \| [CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)>*): `Promise`<[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)>

*Defined in [state/getter/Accounts.ts:272](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L272)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](_state_db_db_.db.md) |
| transactionLogs | `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md) \| [TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md) \| [CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)> |

**Returns:** `Promise`<[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)>

___

