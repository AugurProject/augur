[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Accounts"](_augur_sdk_src_state_getter_accounts_.md)

# Module: "augur-sdk/src/state/getter/Accounts"

## Index

### Enumerations

* [Action](../enums/_augur_sdk_src_state_getter_accounts_.action.md)
* [Coin](../enums/_augur_sdk_src_state_getter_accounts_.coin.md)

### Classes

* [Accounts](../classes/_augur_sdk_src_state_getter_accounts_.accounts.md)

### Interfaces

* [AccountReportingHistory](../interfaces/_augur_sdk_src_state_getter_accounts_.accountreportinghistory.md)
* [AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)
* [ContractInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.contractinfo.md)
* [ContractOverview](../interfaces/_augur_sdk_src_state_getter_accounts_.contractoverview.md)
* [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)
* [ParticipationContract](../interfaces/_augur_sdk_src_state_getter_accounts_.participationcontract.md)
* [ParticipationOverview](../interfaces/_augur_sdk_src_state_getter_accounts_.participationoverview.md)
* [UserCurrentOutcomeDisputeStake](../interfaces/_augur_sdk_src_state_getter_accounts_.usercurrentoutcomedisputestake.md)

### Variables

* [actionnDeserializer](_augur_sdk_src_state_getter_accounts_.md#const-actionndeserializer)
* [coinDeserializer](_augur_sdk_src_state_getter_accounts_.md#const-coindeserializer)
* [getAccountRepStakeSummaryParamsSpecific](_augur_sdk_src_state_getter_accounts_.md#const-getaccountrepstakesummaryparamsspecific)
* [getAccountTransactionHistoryParamsSpecific](_augur_sdk_src_state_getter_accounts_.md#const-getaccounttransactionhistoryparamsspecific)
* [getUserCurrentDisputeStakeParams](_augur_sdk_src_state_getter_accounts_.md#const-getusercurrentdisputestakeparams)

### Functions

* [formatCrowdsourcerRedeemedLogs](_augur_sdk_src_state_getter_accounts_.md#formatcrowdsourcerredeemedlogs)
* [formatDisputeCrowdsourcerContributionLogs](_augur_sdk_src_state_getter_accounts_.md#formatdisputecrowdsourcercontributionlogs)
* [formatInitialReportSubmittedLogs](_augur_sdk_src_state_getter_accounts_.md#formatinitialreportsubmittedlogs)
* [formatMarketCreatedLogs](_augur_sdk_src_state_getter_accounts_.md#formatmarketcreatedlogs)
* [formatOrderFilledLogs](_augur_sdk_src_state_getter_accounts_.md#formatorderfilledlogs)
* [formatParticipationTokensRedeemedLogs](_augur_sdk_src_state_getter_accounts_.md#formatparticipationtokensredeemedlogs)
* [formatTradingProceedsClaimedLogs](_augur_sdk_src_state_getter_accounts_.md#formattradingproceedsclaimedlogs)
* [formatZeroXCancelledOrders](_augur_sdk_src_state_getter_accounts_.md#formatzeroxcancelledorders)
* [formatZeroXOrders](_augur_sdk_src_state_getter_accounts_.md#formatzeroxorders)
* [outcomeFromMarketLog](_augur_sdk_src_state_getter_accounts_.md#outcomefrommarketlog)

## Variables

### `Const` actionnDeserializer

• **actionnDeserializer**: *KeyofC‹[Action](../enums/_augur_sdk_src_state_getter_accounts_.action.md)›* = t.keyof(Action)

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:64](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L64)*

___

### `Const` coinDeserializer

• **coinDeserializer**: *KeyofC‹[Coin](../enums/_augur_sdk_src_state_getter_accounts_.coin.md)›* = t.keyof(Coin)

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:65](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L65)*

___

### `Const` getAccountRepStakeSummaryParamsSpecific

• **getAccountRepStakeSummaryParamsSpecific**: *TypeC‹object›* = t.type({
  universe: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:76](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L76)*

___

### `Const` getAccountTransactionHistoryParamsSpecific

• **getAccountTransactionHistoryParamsSpecific**: *TypeC‹object›* = t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([coinDeserializer, t.null, t.undefined]),
  action: t.union([actionnDeserializer, t.null, t.undefined]),
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:67](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L67)*

___

### `Const` getUserCurrentDisputeStakeParams

• **getUserCurrentDisputeStakeParams**: *TypeC‹object›* = t.type({
  marketId: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:81](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L81)*

## Functions

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(`transactionLogs`: InitialReporterRedeemedLog[] | DisputeCrowdsourcerRedeemedLog[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md), `params`: t.TypeOf‹typeof getAccountTransactionHistoryParams›): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1072](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1072)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | InitialReporterRedeemedLog[] &#124; DisputeCrowdsourcerRedeemedLog[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |
`params` | t.TypeOf‹typeof getAccountTransactionHistoryParams› |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(`transactionLogs`: DisputeCrowdsourcerContributionLog[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1154](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1154)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | DisputeCrowdsourcerContributionLog[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(`transactionLogs`: InitialReportSubmittedLog[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1201](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1201)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | InitialReportSubmittedLog[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(`transactionLogs`: MarketCreatedLog[]): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1123](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1123)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | MarketCreatedLog[] |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(`transactionLogs`: ParsedOrderEventLog[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:830](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L830)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | ParsedOrderEventLog[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(`transactionLogs`: ParticipationTokensRedeemedLog[]): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:996](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L996)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | ParticipationTokensRedeemedLog[] |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(`transactionLogs`: TradingProceedsClaimedLog[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1030](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1030)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | TradingProceedsClaimedLog[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatZeroXCancelledOrders

▸ **formatZeroXCancelledOrders**(`storedOrders`: CancelZeroXOrderLog[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:945](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L945)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrders` | CancelZeroXOrderLog[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatZeroXOrders

▸ **formatZeroXOrders**(`storedOrders`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:896](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L896)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrders` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  outcomeFromMarketLog

▸ **outcomeFromMarketLog**(`market`: MarketData, `payoutNumerators`: Array‹BigNumber | string›): *PayoutNumeratorValue*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:1243](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Accounts.ts#L1243)*

**Parameters:**

Name | Type |
------ | ------ |
`market` | MarketData |
`payoutNumerators` | Array‹BigNumber &#124; string› |

**Returns:** *PayoutNumeratorValue*
