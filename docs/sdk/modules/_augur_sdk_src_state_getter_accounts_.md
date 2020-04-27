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

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:60](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L60)*

___

### `Const` coinDeserializer

• **coinDeserializer**: *KeyofC‹[Coin](../enums/_augur_sdk_src_state_getter_accounts_.coin.md)›* = t.keyof(Coin)

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L61)*

___

### `Const` getAccountRepStakeSummaryParamsSpecific

• **getAccountRepStakeSummaryParamsSpecific**: *TypeC‹object›* = t.type({
  universe: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:72](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L72)*

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

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L63)*

___

### `Const` getUserCurrentDisputeStakeParams

• **getUserCurrentDisputeStakeParams**: *TypeC‹object›* = t.type({
  marketId: t.string,
  account: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:77](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L77)*

## Functions

###  formatCrowdsourcerRedeemedLogs

▸ **formatCrowdsourcerRedeemedLogs**(`transactionLogs`: [InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md)[] | [DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md)[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md), `params`: t.TypeOf‹typeof getAccountTransactionHistoryParams›): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:782](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L782)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md)[] &#124; [DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md)[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |
`params` | t.TypeOf‹typeof getAccountTransactionHistoryParams› |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatDisputeCrowdsourcerContributionLogs

▸ **formatDisputeCrowdsourcerContributionLogs**(`transactionLogs`: [DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md)[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:860](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L860)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md)[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatInitialReportSubmittedLogs

▸ **formatInitialReportSubmittedLogs**(`transactionLogs`: [InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md)[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:897](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L897)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md)[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatMarketCreatedLogs

▸ **formatMarketCreatedLogs**(`transactionLogs`: [MarketCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlog.md)[]): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:831](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L831)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [MarketCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlog.md)[] |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatOrderFilledLogs

▸ **formatOrderFilledLogs**(`transactionLogs`: [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:607](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L607)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatParticipationTokensRedeemedLogs

▸ **formatParticipationTokensRedeemedLogs**(`transactionLogs`: [ParticipationTokensRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.participationtokensredeemedlog.md)[]): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:727](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L727)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [ParticipationTokensRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.participationtokensredeemedlog.md)[] |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatTradingProceedsClaimedLogs

▸ **formatTradingProceedsClaimedLogs**(`transactionLogs`: [TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md)[], `augur`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:752](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L752)*

**Parameters:**

Name | Type |
------ | ------ |
`transactionLogs` | [TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md)[] |
`augur` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *Promise‹[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]›*

___

###  formatZeroXCancelledOrders

▸ **formatZeroXCancelledOrders**(`storedOrders`: [CancelZeroXOrderLog](../interfaces/_augur_sdk_src_state_logs_types_.cancelzeroxorderlog.md)[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:687](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L687)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrders` | [CancelZeroXOrderLog](../interfaces/_augur_sdk_src_state_logs_types_.cancelzeroxorderlog.md)[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  formatZeroXOrders

▸ **formatZeroXOrders**(`storedOrders`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[], `marketInfo`: [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md)): *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:651](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L651)*

**Parameters:**

Name | Type |
------ | ------ |
`storedOrders` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[] |
`marketInfo` | [MarketCreatedInfo](../interfaces/_augur_sdk_src_state_getter_accounts_.marketcreatedinfo.md) |

**Returns:** *[AccountTransaction](../interfaces/_augur_sdk_src_state_getter_accounts_.accounttransaction.md)[]*

___

###  outcomeFromMarketLog

▸ **outcomeFromMarketLog**(`market`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `payoutNumerators`: Array‹BigNumber | string›): *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

*Defined in [packages/augur-sdk/src/state/getter/Accounts.ts:940](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Accounts.ts#L940)*

**Parameters:**

Name | Type |
------ | ------ |
`market` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`payoutNumerators` | Array‹BigNumber &#124; string› |

**Returns:** *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*
