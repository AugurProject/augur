---
id: api-classes-augur-sdk-src-api-onchaintrade-onchaintrade
title: OnChainTrade
sidebar_label: OnChainTrade
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/OnChainTrade Module]](api-modules-augur-sdk-src-api-onchaintrade-module.md) > [OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)

## Class

## Hierarchy

**OnChainTrade**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#augur)

### Methods

* [checkIfTradeValid](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#checkiftradevalid)
* [getOnChainTradeParams](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#getonchaintradeparams)
* [getTradeAmountRemaining](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#gettradeamountremaining)
* [getTradeTransactionLimits](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#gettradetransactionlimits)
* [placeOnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#placeonchaintrade)
* [placeTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#placetrade)
* [simulateTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md#simulatetradegaslimit)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new OnChainTrade**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)

*Defined in [augur-sdk/src/api/OnChainTrade.ts:74](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L74)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:74](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L74)*

___

## Methods

<a id="checkiftradevalid"></a>

###  checkIfTradeValid

▸ **checkIfTradeValid**(params: *[NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)*): `Promise`<`string` \| `null`>

*Defined in [augur-sdk/src/api/OnChainTrade.ts:147](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L147)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md) |

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getonchaintradeparams"></a>

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md)*): [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)

*Defined in [augur-sdk/src/api/OnChainTrade.ts:91](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md) |

**Returns:** [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)

___
<a id="gettradeamountremaining"></a>

### `<Private>` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(tradeOnChainAmountRemaining: *`BigNumber`*, events: *`Event`[]*): `BigNumber`

*Defined in [augur-sdk/src/api/OnChainTrade.ts:183](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L183)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradeOnChainAmountRemaining | `BigNumber` |
| events | `Event`[] |

**Returns:** `BigNumber`

___
<a id="gettradetransactionlimits"></a>

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(params: *[NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)*): [TradeTransactionLimits](api-interfaces-augur-sdk-src-api-onchaintrade-tradetransactionlimits.md)

*Defined in [augur-sdk/src/api/OnChainTrade.ts:167](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L167)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md) |

**Returns:** [TradeTransactionLimits](api-interfaces-augur-sdk-src-api-onchaintrade-tradetransactionlimits.md)

___
<a id="placeonchaintrade"></a>

###  placeOnChainTrade

▸ **placeOnChainTrade**(params: *[NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/OnChainTrade.ts:103](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L103)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/OnChainTrade.ts:80](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L80)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md)*): `Promise`<[NativeSimulateTradeData](api-interfaces-augur-sdk-src-api-onchaintrade-nativesimulatetradedata.md)>

*Defined in [augur-sdk/src/api/OnChainTrade.ts:127](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L127)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md) |

**Returns:** `Promise`<[NativeSimulateTradeData](api-interfaces-augur-sdk-src-api-onchaintrade-nativesimulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/api/OnChainTrade.ts:85](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___

