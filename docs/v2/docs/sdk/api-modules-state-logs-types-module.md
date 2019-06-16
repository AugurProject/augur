---
id: api-modules-state-logs-types-module
title: state/logs/types Module
sidebar_label: state/logs/types
---

[@augurproject/sdk](api-readme.md) > [[state/logs/types Module]](api-modules-state-logs-types-module.md)

## Module

### Enumerations

* [MarketType](api-enums-state-logs-types-markettype.md)
* [OrderEventAddressValue](api-enums-state-logs-types-ordereventaddressvalue.md)
* [OrderEventType](api-enums-state-logs-types-ordereventtype.md)
* [OrderEventUint256Value](api-enums-state-logs-types-ordereventuint256value.md)
* [OrderType](api-enums-state-logs-types-ordertype.md)

### Interfaces

* [CompleteSetsPurchasedLog](api-interfaces-state-logs-types-completesetspurchasedlog.md)
* [CompleteSetsSoldLog](api-interfaces-state-logs-types-completesetssoldlog.md)
* [DisputeCrowdsourcerCompletedLog](api-interfaces-state-logs-types-disputecrowdsourcercompletedlog.md)
* [DisputeCrowdsourcerContributionLog](api-interfaces-state-logs-types-disputecrowdsourcercontributionlog.md)
* [DisputeCrowdsourcerRedeemedLog](api-interfaces-state-logs-types-disputecrowdsourcerredeemedlog.md)
* [DisputeWindowCreatedLog](api-interfaces-state-logs-types-disputewindowcreatedlog.md)
* [Doc](api-interfaces-state-logs-types-doc.md)
* [InitialReportSubmittedLog](api-interfaces-state-logs-types-initialreportsubmittedlog.md)
* [InitialReporterRedeemedLog](api-interfaces-state-logs-types-initialreporterredeemedlog.md)
* [Log](api-interfaces-state-logs-types-log.md)
* [MarketCreatedLog](api-interfaces-state-logs-types-marketcreatedlog.md)
* [MarketCreatedLogExtraInfo](api-interfaces-state-logs-types-marketcreatedlogextrainfo.md)
* [MarketFinalizedLog](api-interfaces-state-logs-types-marketfinalizedlog.md)
* [MarketMigratedLog](api-interfaces-state-logs-types-marketmigratedlog.md)
* [MarketVolumeChangedLog](api-interfaces-state-logs-types-marketvolumechangedlog.md)
* [OrderEventLog](api-interfaces-state-logs-types-ordereventlog.md)
* [ParticipationTokensRedeemedLog](api-interfaces-state-logs-types-participationtokensredeemedlog.md)
* [ProfitLossChangedLog](api-interfaces-state-logs-types-profitlosschangedlog.md)
* [TimestampSetLog](api-interfaces-state-logs-types-timestampsetlog.md)
* [Timestamped](api-interfaces-state-logs-types-timestamped.md)
* [TokenBalanceChangedLog](api-interfaces-state-logs-types-tokenbalancechangedlog.md)
* [TradingProceedsClaimedLog](api-interfaces-state-logs-types-tradingproceedsclaimedlog.md)
* [UniverseForkedLog](api-interfaces-state-logs-types-universeforkedlog.md)

### Type aliases

* [Address](api-modules-state-logs-types-module.md#address)
* [Bytes32](api-modules-state-logs-types-module.md#bytes32)
* [PayoutNumerators](api-modules-state-logs-types-module.md#payoutnumerators)
* [Timestamp](api-modules-state-logs-types-module.md#timestamp)

### Variables

* [ORDER_EVENT_AMOUNT](api-modules-state-logs-types-module.md#order_event_amount)
* [ORDER_EVENT_AMOUNT_FILLED](api-modules-state-logs-types-module.md#order_event_amount_filled)
* [ORDER_EVENT_CREATOR](api-modules-state-logs-types-module.md#order_event_creator)
* [ORDER_EVENT_FEES](api-modules-state-logs-types-module.md#order_event_fees)
* [ORDER_EVENT_FILLER](api-modules-state-logs-types-module.md#order_event_filler)
* [ORDER_EVENT_KYC_TOKEN](api-modules-state-logs-types-module.md#order_event_kyc_token)
* [ORDER_EVENT_OUTCOME](api-modules-state-logs-types-module.md#order_event_outcome)
* [ORDER_EVENT_PRICE](api-modules-state-logs-types-module.md#order_event_price)
* [ORDER_EVENT_SHARES_ESCROWED](api-modules-state-logs-types-module.md#order_event_shares_escrowed)
* [ORDER_EVENT_SHARES_REFUND](api-modules-state-logs-types-module.md#order_event_shares_refund)
* [ORDER_EVENT_TIMESTAMP](api-modules-state-logs-types-module.md#order_event_timestamp)
* [ORDER_EVENT_TOKENS_ESCROWED](api-modules-state-logs-types-module.md#order_event_tokens_escrowed)
* [ORDER_EVENT_TOKEN_REFUND](api-modules-state-logs-types-module.md#order_event_token_refund)

---

## Type aliases

<a id="address"></a>

###  Address

**Ƭ Address**: *`string`*

*Defined in [state/logs/types.ts:1](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L1)*

___
<a id="bytes32"></a>

###  Bytes32

**Ƭ Bytes32**: *`string`*

*Defined in [state/logs/types.ts:2](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L2)*

___
<a id="payoutnumerators"></a>

###  PayoutNumerators

**Ƭ PayoutNumerators**: *`Array`<`string`>*

*Defined in [state/logs/types.ts:3](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L3)*

___
<a id="timestamp"></a>

###  Timestamp

**Ƭ Timestamp**: *`string`*

*Defined in [state/logs/types.ts:4](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L4)*

___

## Variables

<a id="order_event_amount"></a>

### `<Const>` ORDER_EVENT_AMOUNT

**● ORDER_EVENT_AMOUNT**: *"uint256Data.1"* = "uint256Data.1"

*Defined in [state/logs/types.ts:203](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L203)*

___
<a id="order_event_amount_filled"></a>

### `<Const>` ORDER_EVENT_AMOUNT_FILLED

**● ORDER_EVENT_AMOUNT_FILLED**: *"uint256Data.6"* = "uint256Data.6"

*Defined in [state/logs/types.ts:208](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L208)*

___
<a id="order_event_creator"></a>

### `<Const>` ORDER_EVENT_CREATOR

**● ORDER_EVENT_CREATOR**: *"addressData.1"* = "addressData.1"

*Defined in [state/logs/types.ts:200](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L200)*

___
<a id="order_event_fees"></a>

### `<Const>` ORDER_EVENT_FEES

**● ORDER_EVENT_FEES**: *"uint256Data.5"* = "uint256Data.5"

*Defined in [state/logs/types.ts:207](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L207)*

___
<a id="order_event_filler"></a>

### `<Const>` ORDER_EVENT_FILLER

**● ORDER_EVENT_FILLER**: *"addressData.2"* = "addressData.2"

*Defined in [state/logs/types.ts:201](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L201)*

___
<a id="order_event_kyc_token"></a>

### `<Const>` ORDER_EVENT_KYC_TOKEN

**● ORDER_EVENT_KYC_TOKEN**: *"addressData.0"* = "addressData.0"

*Defined in [state/logs/types.ts:199](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L199)*

___
<a id="order_event_outcome"></a>

### `<Const>` ORDER_EVENT_OUTCOME

**● ORDER_EVENT_OUTCOME**: *"uint256Data.2"* = "uint256Data.2"

*Defined in [state/logs/types.ts:204](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L204)*

___
<a id="order_event_price"></a>

### `<Const>` ORDER_EVENT_PRICE

**● ORDER_EVENT_PRICE**: *"uint256Data.0"* = "uint256Data.0"

*Defined in [state/logs/types.ts:202](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L202)*

___
<a id="order_event_shares_escrowed"></a>

### `<Const>` ORDER_EVENT_SHARES_ESCROWED

**● ORDER_EVENT_SHARES_ESCROWED**: *"uint256Data.8"* = "uint256Data.8"

*Defined in [state/logs/types.ts:210](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L210)*

___
<a id="order_event_shares_refund"></a>

### `<Const>` ORDER_EVENT_SHARES_REFUND

**● ORDER_EVENT_SHARES_REFUND**: *"uint256Data.4"* = "uint256Data.4"

*Defined in [state/logs/types.ts:206](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L206)*

___
<a id="order_event_timestamp"></a>

### `<Const>` ORDER_EVENT_TIMESTAMP

**● ORDER_EVENT_TIMESTAMP**: *"uint256Data.7"* = "uint256Data.7"

*Defined in [state/logs/types.ts:209](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L209)*

___
<a id="order_event_tokens_escrowed"></a>

### `<Const>` ORDER_EVENT_TOKENS_ESCROWED

**● ORDER_EVENT_TOKENS_ESCROWED**: *"uint256Data.9"* = "uint256Data.9"

*Defined in [state/logs/types.ts:211](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L211)*

___
<a id="order_event_token_refund"></a>

### `<Const>` ORDER_EVENT_TOKEN_REFUND

**● ORDER_EVENT_TOKEN_REFUND**: *"uint256Data.3"* = "uint256Data.3"

*Defined in [state/logs/types.ts:205](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/logs/types.ts#L205)*

___

