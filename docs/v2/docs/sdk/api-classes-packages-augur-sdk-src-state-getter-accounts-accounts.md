---
id: api-classes-packages-augur-sdk-src-state-getter-accounts-accounts
title: Accounts
sidebar_label: Accounts
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Accounts Module]](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md) > [Accounts](api-classes-packages-augur-sdk-src-state-getter-accounts-accounts.md)

## Class

## Type parameters
#### TBigNumber 
## Hierarchy

**Accounts**

### Properties

* [getAccountTransactionHistoryParams](api-classes-packages-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistoryparams)

### Methods

* [getAccountTransactionHistory](api-classes-packages-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistory)
* [getMarketCreatedInfo](api-classes-packages-augur-sdk-src-state-getter-accounts-accounts.md#getmarketcreatedinfo)

---

## Properties

<a id="getaccounttransactionhistoryparams"></a>

### `<Static>` getAccountTransactionHistoryParams

**● getAccountTransactionHistoryParams**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    getAccountTransactionHistoryParamsSpecific,
    sortOptions,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:77](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L77)*

___

## Methods

<a id="getaccounttransactionhistory"></a>

### `<Static>` getAccountTransactionHistory

▸ **getAccountTransactionHistory**<`TBigNumber`>(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:83](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L83)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="getmarketcreatedinfo"></a>

### `<Static>` getMarketCreatedInfo

▸ **getMarketCreatedInfo**<`TBigNumber`>(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, transactionLogs: *`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)>*): `Promise`<[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:410](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L410)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| transactionLogs | `Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)> |

**Returns:** `Promise`<[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)>

___

