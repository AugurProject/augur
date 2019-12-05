---
id: api-modules-augur-sdk-src-state-getter-accounts-module
title: augur-sdk/src/state/getter/Accounts Module
sidebar_label: augur-sdk/src/state/getter/Accounts
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Accounts Module]](api-modules-augur-sdk-src-state-getter-accounts-module.md)

## Module

### Enumerations

* [Action](api-enums-augur-sdk-src-state-getter-accounts-action.md)
* [Coin](api-enums-augur-sdk-src-state-getter-accounts-coin.md)

### Classes

* [Accounts](api-classes-augur-sdk-src-state-getter-accounts-accounts.md)

### Interfaces

* [AccountReportingHistory](api-interfaces-augur-sdk-src-state-getter-accounts-accountreportinghistory.md)
* [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)
* [ContractInfo](api-interfaces-augur-sdk-src-state-getter-accounts-contractinfo.md)
* [ContractOverview](api-interfaces-augur-sdk-src-state-getter-accounts-contractoverview.md)
* [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)
* [ParticipationContract](api-interfaces-augur-sdk-src-state-getter-accounts-participationcontract.md)
* [ParticipationOverview](api-interfaces-augur-sdk-src-state-getter-accounts-participationoverview.md)
* [UserCurrentOutcomeDisputeStake](api-interfaces-augur-sdk-src-state-getter-accounts-usercurrentoutcomedisputestake.md)

### Variables

* [actionnDeserializer](api-modules-augur-sdk-src-state-getter-accounts-module.md#actionndeserializer)
* [coinDeserializer](api-modules-augur-sdk-src-state-getter-accounts-module.md#coindeserializer)
* [getAccountRepStakeSummaryParamsSpecific](api-modules-augur-sdk-src-state-getter-accounts-module.md#getaccountrepstakesummaryparamsspecific)
* [getAccountTransactionHistoryParamsSpecific](api-modules-augur-sdk-src-state-getter-accounts-module.md#getaccounttransactionhistoryparamsspecific)
* [getUserCurrentDisputeStakeParams](api-modules-augur-sdk-src-state-getter-accounts-module.md#getusercurrentdisputestakeparams)

### Functions

* [formatCompleteSetsPurchasedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatcompletesetspurchasedlogs)
* [formatCompleteSetsSoldLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatcompletesetssoldlogs)
* [formatCrowdsourcerRedeemedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatcrowdsourcerredeemedlogs)
* [formatDisputeCrowdsourcerContributionLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatdisputecrowdsourcercontributionlogs)
* [formatInitialReportSubmittedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatinitialreportsubmittedlogs)
* [formatMarketCreatedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatmarketcreatedlogs)
* [formatOrderCanceledLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatordercanceledlogs)
* [formatOrderFilledLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatorderfilledlogs)
* [formatParticipationTokensRedeemedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formatparticipationtokensredeemedlogs)
* [formatTradingProceedsClaimedLogs](api-modules-augur-sdk-src-state-getter-accounts-module.md#formattradingproceedsclaimedlogs)
* [outcomeFromMarketLog](api-modules-augur-sdk-src-state-getter-accounts-module.md#outcomefrommarketlog)

---

## Variables

<a id="actionndeserializer"></a>

### `<Const>` actionnDeserializer

**● actionnDeserializer**: *`KeyofC`<`object`>* =  t.keyof(Action)

*Defined in [augur-sdk/src/state/getter/Accounts.ts:54](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L54)*

___
<a id="coindeserializer"></a>

### `<Const>` coinDeserializer

**● coinDeserializer**: *`KeyofC`<`object`>* =  t.keyof(Coin)

*Defined in [augur-sdk/src/state/getter/Accounts.ts:55](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L55)*

___
<a id="getaccountrepstakesummaryparamsspecific"></a>

### `<Const>` getAccountRepStakeSummaryParamsSpecific

**● getAccountRepStakeSummaryParamsSpecific**: *`TypeC`<`object`>* =  t.type({
  universe: t.string,
  account: t.string,
})

*Defined in [augur-sdk/src/state/getter/Accounts.ts:66](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L66)*

___
<a id="getaccounttransactionhistoryparamsspecific"></a>

### `<Const>` getAccountTransactionHistoryParamsSpecific

**● getAccountTransactionHistoryParamsSpecific**: *`TypeC`<`object`>* =  t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([coinDeserializer, t.null, t.undefined]),
  action: t.union([actionnDeserializer, t.null, t.undefined]),
})

*Defined in [augur-sdk/src/state/getter/Accounts.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L57)*

___
<a id="getusercurrentdisputestakeparams"></a>

### `<Const>` getUserCurrentDisputeStakeParams

**● getUserCurrentDisputeStakeParams**: *`TypeC`<`object`>* =  t.type({
  marketId: t.string,
  account: t.string,
})

*Defined in [augur-sdk/src/state/getter/Accounts.ts:71](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L71)*

___

## Functions

<a id="formatcompletesetspurchasedlogs"></a>

###  formatCompleteSetsPurchasedLogs

▸ **formatCompleteSetsPurchasedLogs**(transactionLogs: *[CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:899](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L899)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatcompletesetssoldlogs"></a>

###  formatCompleteSetsSoldLogs

▸ **formatCompleteSetsSoldLogs**(transactionLogs: *[CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:928](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L928)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatcrowdsourcerredeemedlogs"></a>

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(transactionLogs: *[InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[] \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:728](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L728)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[] \| [DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatdisputecrowdsourcercontributionlogs"></a>

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(transactionLogs: *[DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:821](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L821)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[] |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatinitialreportsubmittedlogs"></a>

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(transactionLogs: *[InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:857](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L857)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[] |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="formatmarketcreatedlogs"></a>

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(transactionLogs: *[MarketCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-marketcreatedlog.md)[]*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:792](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L792)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [MarketCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-marketcreatedlog.md)[] |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatordercanceledlogs"></a>

###  formatOrderCanceledLogs

▸ **formatOrderCanceledLogs**(transactionLogs: *[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:644](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L644)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatorderfilledlogs"></a>

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(transactionLogs: *[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, params: *`t.TypeOf`<`IntersectionC`>*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:573](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L573)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md)[] |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formatparticipationtokensredeemedlogs"></a>

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(transactionLogs: *[ParticipationTokensRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[]*): [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

*Defined in [augur-sdk/src/state/getter/Accounts.ts:673](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L673)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [ParticipationTokensRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[] |

**Returns:** [AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]

___
<a id="formattradingproceedsclaimedlogs"></a>

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(transactionLogs: *[TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, marketInfo: *[MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

*Defined in [augur-sdk/src/state/getter/Accounts.ts:698](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L698)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[] |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| marketInfo | [MarketCreatedInfo](api-interfaces-augur-sdk-src-state-getter-accounts-marketcreatedinfo.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** `Promise`<[AccountTransaction](api-interfaces-augur-sdk-src-state-getter-accounts-accounttransaction.md)[]>

___
<a id="outcomefrommarketlog"></a>

###  outcomeFromMarketLog

▸ **outcomeFromMarketLog**(market: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, payoutNumerators: *`Array`<`BigNumber` \| `string`>*): [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

*Defined in [augur-sdk/src/state/getter/Accounts.ts:957](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Accounts.ts#L957)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| market | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| payoutNumerators | `Array`<`BigNumber` \| `string`> |

**Returns:** [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

___

