---
id: api-classes-augur-sdk-src-state-getter-accounts-accounts
title: Accounts
sidebar_label: Accounts
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Accounts Module]](api-modules-augur-sdk-src-state-getter-accounts-module.md) > [Accounts](api-classes-augur-sdk-src-state-getter-accounts-accounts.md)

## Class

## Type parameters
#### TBigNumber 
## Hierarchy

**Accounts**

### Properties

* [getAccountRepStakeSummaryParams](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccountrepstakesummaryparams)
* [getAccountTransactionHistoryParams](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistoryparams)
* [getUserCurrentDisputeStakeParams](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getusercurrentdisputestakeparams)

### Methods

* [getAccountRepStakeSummary](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccountrepstakesummary)
* [getAccountTransactionHistory](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getaccounttransactionhistory)
* [getMarketCreatedInfo](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getmarketcreatedinfo)
* [getUserCurrentDisputeStake](api-classes-augur-sdk-src-state-getter-accounts-accounts.md#getusercurrentdisputestake)

---

## Properties

<a id="getaccountrepstakesummaryparams"></a>

### `<Static>` getAccountRepStakeSummaryParams

**● getAccountRepStakeSummaryParams**: *`TypeC`<`object`>* =  getAccountRepStakeSummaryParamsSpecific

*Defined in [augur-sdk/src/state/getter/Accounts.ts:143](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L143)*

___
<a id="getaccounttransactionhistoryparams"></a>

### `<Static>` getAccountTransactionHistoryParams

**● getAccountTransactionHistoryParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    getAccountTransactionHistoryParamsSpecific,
    sortOptions,
  ])

*Defined in [augur-sdk/src/state/getter/Accounts.ts:138](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L138)*

___
<a id="getusercurrentdisputestakeparams"></a>

### `<Static>` getUserCurrentDisputeStakeParams

**● getUserCurrentDisputeStakeParams**: *`TypeC`<`object`>* =  getUserCurrentDisputeStakeParams

*Defined in [augur-sdk/src/state/getter/Accounts.ts:145](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L145)*

___

## Methods

<a id="getaccountrepstakesummary"></a>

### `<Static>` getAccountRepStakeSummary

▸ **getAccountRepStakeSummary**<`TBigNumber`>(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[AccountReportingHistory](api-interfaces-augur-sdk-src-state-getter-accounts-accountreportinghistory.md)>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:148](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L148)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[AccountReportingHistory](api-interfaces-augur-sdk-src-state-getter-accounts-accountreportinghistory.md)>

___
<a id="getaccounttransactionhistory"></a>

### `<Static>` getAccountTransactionHistory

▸ **getAccountTransactionHistory**<`TBigNumber`>(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:274](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L274)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="getmarketcreatedinfo"></a>

### `<Static>` getMarketCreatedInfo

▸ **getMarketCreatedInfo**<`TBigNumber`>(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, transactionLogs: *`Array`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md)>*): `Promise`<[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:548](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L548)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| transactionLogs | `Array`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md) \| [TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md) \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md) \| [InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md) \| [DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md) \| [InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md) \| [CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md) \| [CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md)> |

**Returns:** `Promise`<[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)>

___
<a id="getusercurrentdisputestake"></a>

### `<Static>` getUserCurrentDisputeStake

▸ **getUserCurrentDisputeStake**<`TBigNumber`>(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[UserCurrentOutcomeDisputeStake](api-interfaces-augur-sdk-src-state-getter-accounts-usercurrentoutcomedisputestake.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:509](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L509)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[UserCurrentOutcomeDisputeStake](api-interfaces-augur-sdk-src-state-getter-accounts-usercurrentoutcomedisputestake.md)[]>

___

