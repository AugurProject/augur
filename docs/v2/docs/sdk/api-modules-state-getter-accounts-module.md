---
id: api-modules-state-getter-accounts-module
title: state/getter/Accounts Module
sidebar_label: state/getter/Accounts
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Accounts Module]](api-modules-state-getter-accounts-module.md)

## Module

### Enumerations

* [Action](api-enums-state-getter-accounts-action.md)
* [Coin](api-enums-state-getter-accounts-coin.md)

### Classes

* [Accounts](api-classes-state-getter-accounts-accounts.md)

### Interfaces

* [AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)
* [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)

### Variables

* [GetAccountTransactionHistoryParamsSpecific](api-modules-state-getter-accounts-module.md#getaccounttransactionhistoryparamsspecific)
* [KeyOfAction](api-modules-state-getter-accounts-module.md#keyofaction)
* [KeyOfCoin](api-modules-state-getter-accounts-module.md#keyofcoin)

### Functions

* [formatCompleteSetsPurchasedLogs](api-modules-state-getter-accounts-module.md#formatcompletesetspurchasedlogs)
* [formatCompleteSetsSoldLogs](api-modules-state-getter-accounts-module.md#formatcompletesetssoldlogs)
* [formatCrowdsourcerRedeemedLogs](api-modules-state-getter-accounts-module.md#formatcrowdsourcerredeemedlogs)
* [formatDisputeCrowdsourcerContributionLogs](api-modules-state-getter-accounts-module.md#formatdisputecrowdsourcercontributionlogs)
* [formatInitialReportSubmittedLogs](api-modules-state-getter-accounts-module.md#formatinitialreportsubmittedlogs)
* [formatMarketCreatedLogs](api-modules-state-getter-accounts-module.md#formatmarketcreatedlogs)
* [formatOrderCanceledLogs](api-modules-state-getter-accounts-module.md#formatordercanceledlogs)
* [formatOrderFilledLogs](api-modules-state-getter-accounts-module.md#formatorderfilledlogs)
* [formatParticipationTokensRedeemedLogs](api-modules-state-getter-accounts-module.md#formatparticipationtokensredeemedlogs)
* [formatTradingProceedsClaimedLogs](api-modules-state-getter-accounts-module.md#formattradingproceedsclaimedlogs)
* [getOutcomeDescriptionFromOutcome](api-modules-state-getter-accounts-module.md#getoutcomedescriptionfromoutcome)
* [getOutcomeFromPayoutNumerators](api-modules-state-getter-accounts-module.md#getoutcomefrompayoutnumerators)

---

## Variables

<a id="getaccounttransactionhistoryparamsspecific"></a>

### `<Const>` GetAccountTransactionHistoryParamsSpecific

**● GetAccountTransactionHistoryParamsSpecific**: *`any`* =  t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([KeyOfCoin, t.null, t.undefined]),
  action: t.union([KeyOfAction, t.null, t.undefined])
})

*Defined in [state/getter/Accounts.ts:54](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L54)*

___
<a id="keyofaction"></a>

### `<Const>` KeyOfAction

**● KeyOfAction**: *`any`* =  t.keyof(Action)

*Defined in [state/getter/Accounts.ts:51](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L51)*

___
<a id="keyofcoin"></a>

### `<Const>` KeyOfCoin

**● KeyOfCoin**: *`any`* =  t.keyof(Coin)

*Defined in [state/getter/Accounts.ts:52](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L52)*

___

## Functions

<a id="formatcompletesetspurchasedlogs"></a>

###  formatCompleteSetsPurchasedLogs

▸ **formatCompleteSetsPurchasedLogs**(transactionLogs: *`Array`<[CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md)>*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:576](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L576)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md)> |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formatcompletesetssoldlogs"></a>

###  formatCompleteSetsSoldLogs

▸ **formatCompleteSetsSoldLogs**(transactionLogs: *`Array`<[CompleteSetsSoldLog](api-interfaces-state-logs-types-completesetssoldlog.md)>*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:599](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L599)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[CompleteSetsSoldLog](api-interfaces-state-logs-types-completesetssoldlog.md)> |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formatcrowdsourcerredeemedlogs"></a>

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(transactionLogs: *`Array`<[InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md)> \| `Array`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-state-logs-types-disputecrowdsourcerredeemedlog.md)>*, augur: *[Augur](api-classes-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:450](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L450)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md)> \| `Array`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-state-logs-types-disputecrowdsourcerredeemedlog.md)> |
| augur | [Augur](api-classes-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

___
<a id="formatdisputecrowdsourcercontributionlogs"></a>

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(transactionLogs: *`Array`<[DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md)>*, augur: *[Augur](api-classes-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:523](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L523)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md)> |
| augur | [Augur](api-classes-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

___
<a id="formatinitialreportsubmittedlogs"></a>

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(transactionLogs: *`Array`<[InitialReportSubmittedLog](api-interfaces-state-logs-types-initialreportsubmittedlog.md)>*, augur: *[Augur](api-classes-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:549](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L549)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[InitialReportSubmittedLog](api-interfaces-state-logs-types-initialreportsubmittedlog.md)> |
| augur | [Augur](api-classes-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

___
<a id="formatmarketcreatedlogs"></a>

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(transactionLogs: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)[]*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:500](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L500)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)[] |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formatordercanceledlogs"></a>

###  formatOrderCanceledLogs

▸ **formatOrderCanceledLogs**(transactionLogs: *`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:369](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L369)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)> |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formatorderfilledlogs"></a>

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(transactionLogs: *`Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)>*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:315](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L315)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)> |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formatparticipationtokensredeemedlogs"></a>

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(transactionLogs: *`Array`<[ParticipationTokensRedeemedLog](api-interfaces-state-logs-types-participationtokensredeemedlog.md)>*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:392](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L392)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[ParticipationTokensRedeemedLog](api-interfaces-state-logs-types-participationtokensredeemedlog.md)> |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>

___
<a id="formattradingproceedsclaimedlogs"></a>

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(transactionLogs: *`Array`<[TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md)>*, marketInfo: *[MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:415](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L415)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md)> |
| marketInfo | [MarketCreatedInfo](api-interfaces-state-getter-accounts-marketcreatedinfo.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](api-interfaces-state-getter-accounts-accounttransaction.md)>>

___
<a id="getoutcomedescriptionfromoutcome"></a>

###  getOutcomeDescriptionFromOutcome

▸ **getOutcomeDescriptionFromOutcome**(outcome: *`number`*, market: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*): `string`

*Defined in [state/getter/Accounts.ts:283](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L283)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |
| market | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |

**Returns:** `string`

___
<a id="getoutcomefrompayoutnumerators"></a>

###  getOutcomeFromPayoutNumerators

▸ **getOutcomeFromPayoutNumerators**(payoutNumerators: *`Array`<`BigNumber`>*, market: *[MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)*): `number`

*Defined in [state/getter/Accounts.ts:305](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Accounts.ts#L305)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payoutNumerators | `Array`<`BigNumber`> |
| market | [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md) |

**Returns:** `number`

___

