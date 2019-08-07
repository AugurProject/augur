---
id: api-classes-packages-augur-sdk-src-api-trade-trade
title: Trade
sidebar_label: Trade
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Trade Module]](api-modules-packages-augur-sdk-src-api-trade-module.md) > [Trade](api-classes-packages-augur-sdk-src-api-trade-trade.md)

## Class

## Hierarchy

**Trade**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-trade-trade.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-api-trade-trade.md#augur)

### Methods

* [checkIfTradeValid](api-classes-packages-augur-sdk-src-api-trade-trade.md#checkiftradevalid)
* [getOnChainTradeParams](api-classes-packages-augur-sdk-src-api-trade-trade.md#getonchaintradeparams)
* [getTradeAmountRemaining](api-classes-packages-augur-sdk-src-api-trade-trade.md#gettradeamountremaining)
* [getTradeTransactionLimits](api-classes-packages-augur-sdk-src-api-trade-trade.md#gettradetransactionlimits)
* [placeOnChainTrade](api-classes-packages-augur-sdk-src-api-trade-trade.md#placeonchaintrade)
* [placeTrade](api-classes-packages-augur-sdk-src-api-trade-trade.md#placetrade)
* [simulateTrade](api-classes-packages-augur-sdk-src-api-trade-trade.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-packages-augur-sdk-src-api-trade-trade.md#simulatetradegaslimit)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Trade**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*): [Trade](api-classes-packages-augur-sdk-src-api-trade-trade.md)

*Defined in [packages/augur-sdk/src/api/Trade.ts:75](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |

**Returns:** [Trade](api-classes-packages-augur-sdk-src-api-trade-trade.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:75](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L75)*

___

## Methods

<a id="checkiftradevalid"></a>

###  checkIfTradeValid

▸ **checkIfTradeValid**(params: *[PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md)*): `Promise`<`string` \| `null`>

*Defined in [packages/augur-sdk/src/api/Trade.ts:147](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L147)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md) |

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getonchaintradeparams"></a>

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): [PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md)

*Defined in [packages/augur-sdk/src/api/Trade.ts:93](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** [PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md)

___
<a id="gettradeamountremaining"></a>

### `<Private>` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(events: *`Event`[]*): `BigNumber`

*Defined in [packages/augur-sdk/src/api/Trade.ts:183](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L183)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| events | `Event`[] |

**Returns:** `BigNumber`

___
<a id="gettradetransactionlimits"></a>

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(params: *[PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md)*): [TradeTransactionLimits](api-interfaces-packages-augur-sdk-src-api-trade-tradetransactionlimits.md)

*Defined in [packages/augur-sdk/src/api/Trade.ts:167](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L167)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md) |

**Returns:** [TradeTransactionLimits](api-interfaces-packages-augur-sdk-src-api-trade-tradetransactionlimits.md)

___
<a id="placeonchaintrade"></a>

###  placeOnChainTrade

▸ **placeOnChainTrade**(params: *[PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md)*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/api/Trade.ts:105](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L105)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradechainparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/api/Trade.ts:81](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

*Defined in [packages/augur-sdk/src/api/Trade.ts:129](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L129)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-packages-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/api/Trade.ts:87](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Trade.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-packages-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___

