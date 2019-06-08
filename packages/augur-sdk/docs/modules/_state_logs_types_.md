[@augurproject/sdk](../README.md) > ["state/logs/types"](../modules/_state_logs_types_.md)

# External module: "state/logs/types"

## Index

### Enumerations

* [MarketType](../enums/_state_logs_types_.markettype.md)
* [OrderEventAddressValue](../enums/_state_logs_types_.ordereventaddressvalue.md)
* [OrderEventType](../enums/_state_logs_types_.ordereventtype.md)
* [OrderEventUint256Value](../enums/_state_logs_types_.ordereventuint256value.md)
* [OrderType](../enums/_state_logs_types_.ordertype.md)

### Interfaces

* [CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md)
* [CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)
* [DisputeCrowdsourcerCompletedLog](../interfaces/_state_logs_types_.disputecrowdsourcercompletedlog.md)
* [DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)
* [DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)
* [DisputeWindowCreatedLog](../interfaces/_state_logs_types_.disputewindowcreatedlog.md)
* [Doc](../interfaces/_state_logs_types_.doc.md)
* [InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)
* [InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md)
* [Log](../interfaces/_state_logs_types_.log.md)
* [MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)
* [MarketCreatedLogExtraInfo](../interfaces/_state_logs_types_.marketcreatedlogextrainfo.md)
* [MarketFinalizedLog](../interfaces/_state_logs_types_.marketfinalizedlog.md)
* [MarketMigratedLog](../interfaces/_state_logs_types_.marketmigratedlog.md)
* [MarketVolumeChangedLog](../interfaces/_state_logs_types_.marketvolumechangedlog.md)
* [OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)
* [ParticipationTokensRedeemedLog](../interfaces/_state_logs_types_.participationtokensredeemedlog.md)
* [ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)
* [TimestampSetLog](../interfaces/_state_logs_types_.timestampsetlog.md)
* [Timestamped](../interfaces/_state_logs_types_.timestamped.md)
* [TokenBalanceChangedLog](../interfaces/_state_logs_types_.tokenbalancechangedlog.md)
* [TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md)
* [UniverseForkedLog](../interfaces/_state_logs_types_.universeforkedlog.md)

### Type aliases

* [Address](_state_logs_types_.md#address)
* [Bytes32](_state_logs_types_.md#bytes32)
* [PayoutNumerators](_state_logs_types_.md#payoutnumerators)
* [Timestamp](_state_logs_types_.md#timestamp)

### Variables

* [ORDER_EVENT_AMOUNT](_state_logs_types_.md#order_event_amount)
* [ORDER_EVENT_AMOUNT_FILLED](_state_logs_types_.md#order_event_amount_filled)
* [ORDER_EVENT_CREATOR](_state_logs_types_.md#order_event_creator)
* [ORDER_EVENT_FEES](_state_logs_types_.md#order_event_fees)
* [ORDER_EVENT_FILLER](_state_logs_types_.md#order_event_filler)
* [ORDER_EVENT_KYC_TOKEN](_state_logs_types_.md#order_event_kyc_token)
* [ORDER_EVENT_OUTCOME](_state_logs_types_.md#order_event_outcome)
* [ORDER_EVENT_PRICE](_state_logs_types_.md#order_event_price)
* [ORDER_EVENT_SHARES_ESCROWED](_state_logs_types_.md#order_event_shares_escrowed)
* [ORDER_EVENT_SHARES_REFUND](_state_logs_types_.md#order_event_shares_refund)
* [ORDER_EVENT_TIMESTAMP](_state_logs_types_.md#order_event_timestamp)
* [ORDER_EVENT_TOKENS_ESCROWED](_state_logs_types_.md#order_event_tokens_escrowed)
* [ORDER_EVENT_TOKEN_REFUND](_state_logs_types_.md#order_event_token_refund)

---

## Type aliases

<a id="address"></a>

###  Address

**Ƭ Address**: *`string`*

*Defined in [state/logs/types.ts:1](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L1)*

___
<a id="bytes32"></a>

###  Bytes32

**Ƭ Bytes32**: *`string`*

*Defined in [state/logs/types.ts:2](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L2)*

___
<a id="payoutnumerators"></a>

###  PayoutNumerators

**Ƭ PayoutNumerators**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:3](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L3)*

___
<a id="timestamp"></a>

###  Timestamp

**Ƭ Timestamp**: *`string`*

*Defined in [state/logs/types.ts:4](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L4)*

___

## Variables

<a id="order_event_amount"></a>

### `<Const>` ORDER_EVENT_AMOUNT

**● ORDER_EVENT_AMOUNT**: *"uint256Data.1"* = "uint256Data.1"

*Defined in [state/logs/types.ts:203](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L203)*

___
<a id="order_event_amount_filled"></a>

### `<Const>` ORDER_EVENT_AMOUNT_FILLED

**● ORDER_EVENT_AMOUNT_FILLED**: *"uint256Data.6"* = "uint256Data.6"

*Defined in [state/logs/types.ts:208](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L208)*

___
<a id="order_event_creator"></a>

### `<Const>` ORDER_EVENT_CREATOR

**● ORDER_EVENT_CREATOR**: *"addressData.1"* = "addressData.1"

*Defined in [state/logs/types.ts:200](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L200)*

___
<a id="order_event_fees"></a>

### `<Const>` ORDER_EVENT_FEES

**● ORDER_EVENT_FEES**: *"uint256Data.5"* = "uint256Data.5"

*Defined in [state/logs/types.ts:207](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L207)*

___
<a id="order_event_filler"></a>

### `<Const>` ORDER_EVENT_FILLER

**● ORDER_EVENT_FILLER**: *"addressData.2"* = "addressData.2"

*Defined in [state/logs/types.ts:201](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L201)*

___
<a id="order_event_kyc_token"></a>

### `<Const>` ORDER_EVENT_KYC_TOKEN

**● ORDER_EVENT_KYC_TOKEN**: *"addressData.0"* = "addressData.0"

*Defined in [state/logs/types.ts:199](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L199)*

___
<a id="order_event_outcome"></a>

### `<Const>` ORDER_EVENT_OUTCOME

**● ORDER_EVENT_OUTCOME**: *"uint256Data.2"* = "uint256Data.2"

*Defined in [state/logs/types.ts:204](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L204)*

___
<a id="order_event_price"></a>

### `<Const>` ORDER_EVENT_PRICE

**● ORDER_EVENT_PRICE**: *"uint256Data.0"* = "uint256Data.0"

*Defined in [state/logs/types.ts:202](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L202)*

___
<a id="order_event_shares_escrowed"></a>

### `<Const>` ORDER_EVENT_SHARES_ESCROWED

**● ORDER_EVENT_SHARES_ESCROWED**: *"uint256Data.8"* = "uint256Data.8"

*Defined in [state/logs/types.ts:210](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L210)*

___
<a id="order_event_shares_refund"></a>

### `<Const>` ORDER_EVENT_SHARES_REFUND

**● ORDER_EVENT_SHARES_REFUND**: *"uint256Data.4"* = "uint256Data.4"

*Defined in [state/logs/types.ts:206](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L206)*

___
<a id="order_event_timestamp"></a>

### `<Const>` ORDER_EVENT_TIMESTAMP

**● ORDER_EVENT_TIMESTAMP**: *"uint256Data.7"* = "uint256Data.7"

*Defined in [state/logs/types.ts:209](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L209)*

___
<a id="order_event_tokens_escrowed"></a>

### `<Const>` ORDER_EVENT_TOKENS_ESCROWED

**● ORDER_EVENT_TOKENS_ESCROWED**: *"uint256Data.9"* = "uint256Data.9"

*Defined in [state/logs/types.ts:211](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L211)*

___
<a id="order_event_token_refund"></a>

### `<Const>` ORDER_EVENT_TOKEN_REFUND

**● ORDER_EVENT_TOKEN_REFUND**: *"uint256Data.3"* = "uint256Data.3"

*Defined in [state/logs/types.ts:205](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/logs/types.ts#L205)*

___

