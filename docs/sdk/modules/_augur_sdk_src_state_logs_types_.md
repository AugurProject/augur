[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/types"](_augur_sdk_src_state_logs_types_.md)

# Module: "augur-sdk/src/state/logs/types"

## Index

### Enumerations

* [CommonOutcomes](../enums/_augur_sdk_src_state_logs_types_.commonoutcomes.md)
* [MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)
* [MarketTypeName](../enums/_augur_sdk_src_state_logs_types_.markettypename.md)
* [OrderEventAddressValue](../enums/_augur_sdk_src_state_logs_types_.ordereventaddressvalue.md)
* [OrderEventType](../enums/_augur_sdk_src_state_logs_types_.ordereventtype.md)
* [OrderEventUint256Value](../enums/_augur_sdk_src_state_logs_types_.ordereventuint256value.md)
* [OrderState](../enums/_augur_sdk_src_state_logs_types_.orderstate.md)
* [OrderType](../enums/_augur_sdk_src_state_logs_types_.ordertype.md)
* [OrderTypeHex](../enums/_augur_sdk_src_state_logs_types_.ordertypehex.md)
* [TokenType](../enums/_augur_sdk_src_state_logs_types_.tokentype.md)
* [YesNoOutcomes](../enums/_augur_sdk_src_state_logs_types_.yesnooutcomes.md)

### Interfaces

* [CancelZeroXOrderLog](../interfaces/_augur_sdk_src_state_logs_types_.cancelzeroxorderlog.md)
* [CompleteSetsPurchasedLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetspurchasedlog.md)
* [CompleteSetsSoldLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetssoldlog.md)
* [CurrentOrder](../interfaces/_augur_sdk_src_state_logs_types_.currentorder.md)
* [DisputeCrowdsourcerCompletedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercompletedlog.md)
* [DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md)
* [DisputeCrowdsourcerCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercreatedlog.md)
* [DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md)
* [DisputeDoc](../interfaces/_augur_sdk_src_state_logs_types_.disputedoc.md)
* [DisputeWindowCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputewindowcreatedlog.md)
* [ExtraInfo](../interfaces/_augur_sdk_src_state_logs_types_.extrainfo.md)
* [GenericEventDBDescription](../interfaces/_augur_sdk_src_state_logs_types_.genericeventdbdescription.md)
* [InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md)
* [InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md)
* [InitialReporterTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportertransferredlog.md)
* [LiquidityData](../interfaces/_augur_sdk_src_state_logs_types_.liquiditydata.md)
* [Log](../interfaces/_augur_sdk_src_state_logs_types_.log.md)
* [MarketCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlog.md)
* [MarketCreatedLogExtraInfo](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlogextrainfo.md)
* [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)
* [MarketFinalizedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketfinalizedlog.md)
* [MarketMigratedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketmigratedlog.md)
* [MarketOIChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketoichangedlog.md)
* [MarketParticipantsDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketparticipantsdisavowedlog.md)
* [MarketTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.markettransferredlog.md)
* [MarketVolumeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketvolumechangedlog.md)
* [MarketsUpdatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketsupdatedlog.md)
* [OrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.ordereventlog.md)
* [ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md)
* [ParticipationTokensRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.participationtokensredeemedlog.md)
* [ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md)
* [ReportingFeeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingfeechangedlog.md)
* [ReportingParticipantDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingparticipantdisavowedlog.md)
* [ShareTokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.sharetokenbalancechangedlog.md)
* [TimestampSetLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampsetlog.md)
* [TimestampedLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampedlog.md)
* [TokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenbalancechangedlog.md)
* [TokensMinted](../interfaces/_augur_sdk_src_state_logs_types_.tokensminted.md)
* [TokensTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenstransferredlog.md)
* [TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md)
* [TransferBatchLog](../interfaces/_augur_sdk_src_state_logs_types_.transferbatchlog.md)
* [TransferSingleLog](../interfaces/_augur_sdk_src_state_logs_types_.transfersinglelog.md)
* [UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md)
* [UniverseForkedLog](../interfaces/_augur_sdk_src_state_logs_types_.universeforkedlog.md)

### Type aliases

* [Address](_augur_sdk_src_state_logs_types_.md#address)
* [Bytes32](_augur_sdk_src_state_logs_types_.md#bytes32)
* [LogTimestamp](_augur_sdk_src_state_logs_types_.md#logtimestamp)
* [NumOutcomes](_augur_sdk_src_state_logs_types_.md#numoutcomes)
* [OutcomeNumber](_augur_sdk_src_state_logs_types_.md#outcomenumber)
* [PayoutNumerators](_augur_sdk_src_state_logs_types_.md#payoutnumerators)
* [TradeDirection](_augur_sdk_src_state_logs_types_.md#tradedirection)
* [UnixTimestamp](_augur_sdk_src_state_logs_types_.md#unixtimestamp)

### Variables

* [ORDER_EVENT_AMOUNT](_augur_sdk_src_state_logs_types_.md#const-order_event_amount)
* [ORDER_EVENT_AMOUNT_FILLED](_augur_sdk_src_state_logs_types_.md#const-order_event_amount_filled)
* [ORDER_EVENT_CREATOR](_augur_sdk_src_state_logs_types_.md#const-order_event_creator)
* [ORDER_EVENT_FEES](_augur_sdk_src_state_logs_types_.md#const-order_event_fees)
* [ORDER_EVENT_FILLER](_augur_sdk_src_state_logs_types_.md#const-order_event_filler)
* [ORDER_EVENT_OUTCOME](_augur_sdk_src_state_logs_types_.md#const-order_event_outcome)
* [ORDER_EVENT_PRICE](_augur_sdk_src_state_logs_types_.md#const-order_event_price)
* [ORDER_EVENT_SHARES_ESCROWED](_augur_sdk_src_state_logs_types_.md#const-order_event_shares_escrowed)
* [ORDER_EVENT_SHARES_REFUND](_augur_sdk_src_state_logs_types_.md#const-order_event_shares_refund)
* [ORDER_EVENT_TIMESTAMP](_augur_sdk_src_state_logs_types_.md#const-order_event_timestamp)
* [ORDER_EVENT_TOKENS_ESCROWED](_augur_sdk_src_state_logs_types_.md#const-order_event_tokens_escrowed)
* [ORDER_EVENT_TOKEN_REFUND](_augur_sdk_src_state_logs_types_.md#const-order_event_token_refund)

## Type aliases

###  Address

Ƭ **Address**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:4](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L4)*

___

###  Bytes32

Ƭ **Bytes32**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:5](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L5)*

___

###  LogTimestamp

Ƭ **LogTimestamp**: *string*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:7](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L7)*

___

###  NumOutcomes

Ƭ **NumOutcomes**: *3 | 4 | 5 | 6 | 7 | 8*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:184](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L184)*

___

###  OutcomeNumber

Ƭ **OutcomeNumber**: *0 | 1 | 2 | 3 | 4 | 5 | 6 | 7*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:185](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L185)*

___

###  PayoutNumerators

Ƭ **PayoutNumerators**: *string[]*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:6](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L6)*

___

###  TradeDirection

Ƭ **TradeDirection**: *0 | 1*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:183](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L183)*

___

###  UnixTimestamp

Ƭ **UnixTimestamp**: *number*

*Defined in [packages/augur-sdk/src/state/logs/types.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L8)*

## Variables

### `Const` ORDER_EVENT_AMOUNT

• **ORDER_EVENT_AMOUNT**: *"uint256Data.1"* = "uint256Data.1"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:305](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L305)*

___

### `Const` ORDER_EVENT_AMOUNT_FILLED

• **ORDER_EVENT_AMOUNT_FILLED**: *"uint256Data.6"* = "uint256Data.6"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:310](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L310)*

___

### `Const` ORDER_EVENT_CREATOR

• **ORDER_EVENT_CREATOR**: *"addressData.0"* = "addressData.0"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:302](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L302)*

___

### `Const` ORDER_EVENT_FEES

• **ORDER_EVENT_FEES**: *"uint256Data.5"* = "uint256Data.5"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:309](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L309)*

___

### `Const` ORDER_EVENT_FILLER

• **ORDER_EVENT_FILLER**: *"addressData.1"* = "addressData.1"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:303](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L303)*

___

### `Const` ORDER_EVENT_OUTCOME

• **ORDER_EVENT_OUTCOME**: *"uint256Data.2"* = "uint256Data.2"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:306](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L306)*

___

### `Const` ORDER_EVENT_PRICE

• **ORDER_EVENT_PRICE**: *"uint256Data.0"* = "uint256Data.0"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:304](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L304)*

___

### `Const` ORDER_EVENT_SHARES_ESCROWED

• **ORDER_EVENT_SHARES_ESCROWED**: *"uint256Data.8"* = "uint256Data.8"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:312](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L312)*

___

### `Const` ORDER_EVENT_SHARES_REFUND

• **ORDER_EVENT_SHARES_REFUND**: *"uint256Data.4"* = "uint256Data.4"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:308](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L308)*

___

### `Const` ORDER_EVENT_TIMESTAMP

• **ORDER_EVENT_TIMESTAMP**: *"uint256Data.7"* = "uint256Data.7"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:311](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L311)*

___

### `Const` ORDER_EVENT_TOKENS_ESCROWED

• **ORDER_EVENT_TOKENS_ESCROWED**: *"uint256Data.9"* = "uint256Data.9"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:313](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L313)*

___

### `Const` ORDER_EVENT_TOKEN_REFUND

• **ORDER_EVENT_TOKEN_REFUND**: *"uint256Data.3"* = "uint256Data.3"

*Defined in [packages/augur-sdk/src/state/logs/types.ts:307](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/types.ts#L307)*
