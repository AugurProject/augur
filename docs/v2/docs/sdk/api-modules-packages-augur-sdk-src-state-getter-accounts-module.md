---
id: api-modules-packages-augur-sdk-src-state-getter-accounts-module
title: packages/augur-sdk/src/state/getter/Accounts Module
sidebar_label: packages/augur-sdk/src/state/getter/Accounts
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Accounts Module]](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md)

## Module

### Enumerations

* [Action](api-enums-packages-augur-sdk-src-state-getter-accounts-action.md)
* [Coin](api-enums-packages-augur-sdk-src-state-getter-accounts-coin.md)

### Classes

* [Accounts](api-classes-packages-augur-sdk-src-state-getter-accounts-accounts.md)

### Interfaces

* [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)
* [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)

### Variables

* [actionnDeserializer](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#actionndeserializer)
* [coinDeserializer](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#coindeserializer)
* [getAccountTransactionHistoryParamsSpecific](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#getaccounttransactionhistoryparamsspecific)

### Functions

* [formatCompleteSetsPurchasedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatcompletesetspurchasedlogs)
* [formatCompleteSetsSoldLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatcompletesetssoldlogs)
* [formatCrowdsourcerRedeemedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatcrowdsourcerredeemedlogs)
* [formatDisputeCrowdsourcerContributionLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatdisputecrowdsourcercontributionlogs)
* [formatInitialReportSubmittedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatinitialreportsubmittedlogs)
* [formatMarketCreatedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatmarketcreatedlogs)
* [formatOrderCanceledLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatordercanceledlogs)
* [formatOrderFilledLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatorderfilledlogs)
* [formatParticipationTokensRedeemedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formatparticipationtokensredeemedlogs)
* [formatTradingProceedsClaimedLogs](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#formattradingproceedsclaimedlogs)
* [getOutcomeDescriptionFromOutcome](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#getoutcomedescriptionfromoutcome)
* [getOutcomeFromPayoutNumerators](api-modules-packages-augur-sdk-src-state-getter-accounts-module.md#getoutcomefrompayoutnumerators)

---

## Variables

<a id="actionndeserializer"></a>

### `<Const>` actionnDeserializer

**● actionnDeserializer**: *`KeyofType`<[Action](api-enums-packages-augur-sdk-src-state-getter-accounts-action.md)>* =  t.keyof(Action)

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:45](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L45)*

___
<a id="coindeserializer"></a>

### `<Const>` coinDeserializer

**● coinDeserializer**: *`KeyofType`<[Coin](api-enums-packages-augur-sdk-src-state-getter-accounts-coin.md)>* =  t.keyof(Coin)

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:46](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L46)*

___
<a id="getaccounttransactionhistoryparamsspecific"></a>

### `<Const>` getAccountTransactionHistoryParamsSpecific

**● getAccountTransactionHistoryParamsSpecific**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([coinDeserializer, t.null, t.undefined]),
  action: t.union([actionnDeserializer, t.null, t.undefined]),
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:48](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L48)*

___

## Functions

<a id="formatcompletesetspurchasedlogs"></a>

###  formatCompleteSetsPurchasedLogs

▸ **formatCompleteSetsPurchasedLogs**(transactionLogs: *[CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:839](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L839)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatcompletesetssoldlogs"></a>

###  formatCompleteSetsSoldLogs

▸ **formatCompleteSetsSoldLogs**(transactionLogs: *[CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:870](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L870)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatcrowdsourcerredeemedlogs"></a>

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(transactionLogs: *[InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[] \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:657](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L657)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[] \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatdisputecrowdsourcercontributionlogs"></a>

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(transactionLogs: *[DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[]*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:756](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L756)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[] |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatinitialreportsubmittedlogs"></a>

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(transactionLogs: *[InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[]*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:796](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L796)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[] |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatmarketcreatedlogs"></a>

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(transactionLogs: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)[]*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:729](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L729)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)[] |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatordercanceledlogs"></a>

###  formatOrderCanceledLogs

▸ **formatOrderCanceledLogs**(transactionLogs: *[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:554](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L554)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatorderfilledlogs"></a>

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(transactionLogs: *[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`IntersectionType`>*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:472](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L472)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatparticipationtokensredeemedlogs"></a>

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(transactionLogs: *[ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[]*): [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:586](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L586)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[] |

**Returns:** [AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formattradingproceedsclaimedlogs"></a>

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(transactionLogs: *[TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*): `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:611](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L611)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-packages-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-packages-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="getoutcomedescriptionfromoutcome"></a>

###  getOutcomeDescriptionFromOutcome

▸ **getOutcomeDescriptionFromOutcome**(outcome: *`number`*, market: *[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)*): `string`

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:437](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L437)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |
| market | [MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md) |

**Returns:** `string`

___
<a id="getoutcomefrompayoutnumerators"></a>

###  getOutcomeFromPayoutNumerators

▸ **getOutcomeFromPayoutNumerators**(payoutNumerators: *`BigNumber`[]*): `number`

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:462](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/Accounts.ts#L462)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payoutNumerators | `BigNumber`[] |

**Returns:** `number`

___

