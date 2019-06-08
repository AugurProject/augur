[@augurproject/sdk](../README.md) > ["state/getter/Accounts"](../modules/_state_getter_accounts_.md)

# External module: "state/getter/Accounts"

## Index

### Enumerations

* [Action](../enums/_state_getter_accounts_.action.md)
* [Coin](../enums/_state_getter_accounts_.coin.md)

### Classes

* [Accounts](../classes/_state_getter_accounts_.accounts.md)

### Interfaces

* [AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)
* [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)

### Variables

* [GetAccountTransactionHistoryParamsSpecific](_state_getter_accounts_.md#getaccounttransactionhistoryparamsspecific)
* [KeyOfAction](_state_getter_accounts_.md#keyofaction)
* [KeyOfCoin](_state_getter_accounts_.md#keyofcoin)

### Functions

* [formatCompleteSetsPurchasedLogs](_state_getter_accounts_.md#formatcompletesetspurchasedlogs)
* [formatCompleteSetsSoldLogs](_state_getter_accounts_.md#formatcompletesetssoldlogs)
* [formatCrowdsourcerRedeemedLogs](_state_getter_accounts_.md#formatcrowdsourcerredeemedlogs)
* [formatDisputeCrowdsourcerContributionLogs](_state_getter_accounts_.md#formatdisputecrowdsourcercontributionlogs)
* [formatInitialReportSubmittedLogs](_state_getter_accounts_.md#formatinitialreportsubmittedlogs)
* [formatMarketCreatedLogs](_state_getter_accounts_.md#formatmarketcreatedlogs)
* [formatOrderCanceledLogs](_state_getter_accounts_.md#formatordercanceledlogs)
* [formatOrderFilledLogs](_state_getter_accounts_.md#formatorderfilledlogs)
* [formatParticipationTokensRedeemedLogs](_state_getter_accounts_.md#formatparticipationtokensredeemedlogs)
* [formatTradingProceedsClaimedLogs](_state_getter_accounts_.md#formattradingproceedsclaimedlogs)
* [getOutcomeDescriptionFromOutcome](_state_getter_accounts_.md#getoutcomedescriptionfromoutcome)
* [getOutcomeFromPayoutNumerators](_state_getter_accounts_.md#getoutcomefrompayoutnumerators)

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

*Defined in [state/getter/Accounts.ts:54](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L54)*

___
<a id="keyofaction"></a>

### `<Const>` KeyOfAction

**● KeyOfAction**: *`any`* =  t.keyof(Action)

*Defined in [state/getter/Accounts.ts:51](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L51)*

___
<a id="keyofcoin"></a>

### `<Const>` KeyOfCoin

**● KeyOfCoin**: *`any`* =  t.keyof(Coin)

*Defined in [state/getter/Accounts.ts:52](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L52)*

___

## Functions

<a id="formatcompletesetspurchasedlogs"></a>

###  formatCompleteSetsPurchasedLogs

▸ **formatCompleteSetsPurchasedLogs**(transactionLogs: *`Array`<[CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md)>*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:576](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L576)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md)> |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formatcompletesetssoldlogs"></a>

###  formatCompleteSetsSoldLogs

▸ **formatCompleteSetsSoldLogs**(transactionLogs: *`Array`<[CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)>*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:599](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L599)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)> |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formatcrowdsourcerredeemedlogs"></a>

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(transactionLogs: *`Array`<[InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md)> \| `Array`<[DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)>*, augur: *[Augur](../classes/_augur_.augur.md)*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:450](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L450)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md)> \| `Array`<[DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)> |
| augur | [Augur](../classes/_augur_.augur.md) |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

___
<a id="formatdisputecrowdsourcercontributionlogs"></a>

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(transactionLogs: *`Array`<[DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)>*, augur: *[Augur](../classes/_augur_.augur.md)*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:523](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L523)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)> |
| augur | [Augur](../classes/_augur_.augur.md) |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

___
<a id="formatinitialreportsubmittedlogs"></a>

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(transactionLogs: *`Array`<[InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)>*, augur: *[Augur](../classes/_augur_.augur.md)*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:549](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L549)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)> |
| augur | [Augur](../classes/_augur_.augur.md) |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

___
<a id="formatmarketcreatedlogs"></a>

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(transactionLogs: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)[]*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:500](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L500)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)[] |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formatordercanceledlogs"></a>

###  formatOrderCanceledLogs

▸ **formatOrderCanceledLogs**(transactionLogs: *`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:369](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L369)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)> |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formatorderfilledlogs"></a>

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(transactionLogs: *`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:315](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L315)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)> |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formatparticipationtokensredeemedlogs"></a>

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(transactionLogs: *`Array`<[ParticipationTokensRedeemedLog](../interfaces/_state_logs_types_.participationtokensredeemedlog.md)>*, params: *`t.TypeOf`<`any`>*): `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

*Defined in [state/getter/Accounts.ts:392](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L392)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[ParticipationTokensRedeemedLog](../interfaces/_state_logs_types_.participationtokensredeemedlog.md)> |
| params | `t.TypeOf`<`any`> |

**Returns:** `Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>

___
<a id="formattradingproceedsclaimedlogs"></a>

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(transactionLogs: *`Array`<[TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md)>*, marketInfo: *[MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md)*, db: *[DB](../classes/_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

*Defined in [state/getter/Accounts.ts:415](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L415)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| transactionLogs | `Array`<[TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md)> |
| marketInfo | [MarketCreatedInfo](../interfaces/_state_getter_accounts_.marketcreatedinfo.md) |
| db | [DB](../classes/_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<[AccountTransaction](../interfaces/_state_getter_accounts_.accounttransaction.md)>>

___
<a id="getoutcomedescriptionfromoutcome"></a>

###  getOutcomeDescriptionFromOutcome

▸ **getOutcomeDescriptionFromOutcome**(outcome: *`number`*, market: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*): `string`

*Defined in [state/getter/Accounts.ts:283](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L283)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |
| market | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |

**Returns:** `string`

___
<a id="getoutcomefrompayoutnumerators"></a>

###  getOutcomeFromPayoutNumerators

▸ **getOutcomeFromPayoutNumerators**(payoutNumerators: *`Array`<`BigNumber`>*, market: *[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)*): `number`

*Defined in [state/getter/Accounts.ts:305](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Accounts.ts#L305)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payoutNumerators | `Array`<`BigNumber`> |
| market | [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md) |

**Returns:** `number`

___

