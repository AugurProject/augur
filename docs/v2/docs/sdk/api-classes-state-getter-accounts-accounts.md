---
id: api-classes-state-getter-accounts-accounts
title: Accounts
sidebar_label: Accounts
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Accounts Module]](api-modules-state-getter-accounts-module.md) > [Accounts](api-classes-state-getter-accounts-accounts.md)

## Class

## Type parameters
#### TBigNumber 
## Hierarchy

**Accounts**

### Properties

* [GetAccountTransactionHistoryParams](api-classes-state-getter-accounts-accounts.md#getaccounttransactionhistoryparams)

### Methods

* [getAccountTransactionHistory](api-classes-state-getter-accounts-accounts.md#getaccounttransactionhistory)
* [getMarketCreatedInfo](api-classes-state-getter-accounts-accounts.md#getmarketcreatedinfo)

---

## Properties

<a id="getaccounttransactionhistoryparams"></a>

### `<Static>` GetAccountTransactionHistoryParams

**● GetAccountTransactionHistoryParams**: *`any`* =  t.intersection([GetAccountTransactionHistoryParamsSpecific, SortLimit])

*Defined in [state/getter/Accounts.ts:83](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L83)*

___

## Methods

<a id="getaccounttransactionhistory"></a>

### `<Static>` getAccountTransactionHistory

▸ **getAccountTransactionHistory**<`TBigNumber`>(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:86](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L86)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

___
<a id="getmarketcreatedinfo"></a>

### `<Static>` getMarketCreatedInfo

▸ **getMarketCreatedInfo**<`TBigNumber`>(db: *[DB](api-classes-state-db-db-db.md)*, transactionLogs: *`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-state-logs-types-completesetssoldlog.md)>*): `Promise`<[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)>

*Defined in [state/getter/Accounts.ts:272](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L272)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| transactionLogs | `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-state-logs-types-completesetssoldlog.md)> |

**Returns:** `Promise`<[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)>

___

