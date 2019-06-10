---
id: api-classes-api-trade-trade
title: Trade
sidebar_label: Trade
---

[@augurproject/sdk](api-readme.md) > [[api/Trade Module]](api-modules-api-trade-module.md) > [Trade](api-classes-api-trade-trade.md)

## Class

## Hierarchy

**Trade**

### Constructors

* [constructor](api-classes-api-trade-trade.md#constructor)

### Properties

* [augur](api-classes-api-trade-trade.md#augur)

### Methods

* [checkIfTradeValid](api-classes-api-trade-trade.md#checkiftradevalid)
* [getOnChainTradeParams](api-classes-api-trade-trade.md#getonchaintradeparams)
* [getTradeAmountRemaining](api-classes-api-trade-trade.md#gettradeamountremaining)
* [getTradeTransactionLimits](api-classes-api-trade-trade.md#gettradetransactionlimits)
* [placeOnChainTrade](api-classes-api-trade-trade.md#placeonchaintrade)
* [placeTrade](api-classes-api-trade-trade.md#placetrade)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Trade**(augur: *[Augur](api-classes-augur-augur.md)*): [Trade](api-classes-api-trade-trade.md)

*Defined in [api/Trade.ts:53](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |

**Returns:** [Trade](api-classes-api-trade-trade.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-augur.md)*

*Defined in [api/Trade.ts:53](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L53)*

___

## Methods

<a id="checkiftradevalid"></a>

###  checkIfTradeValid

▸ **checkIfTradeValid**(params: *[PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md)*): `Promise`<`string` \| `null`>

*Defined in [api/Trade.ts:100](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L100)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md) |

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getonchaintradeparams"></a>

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[PlaceTradeDisplayParams](api-interfaces-api-trade-placetradedisplayparams.md)*): [PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md)

*Defined in [api/Trade.ts:64](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L64)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-api-trade-placetradedisplayparams.md) |

**Returns:** [PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md)

___
<a id="gettradeamountremaining"></a>

### `<Private>` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(events: *`Array`<`Event`>*): `BigNumber`

*Defined in [api/Trade.ts:135](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| events | `Array`<`Event`> |

**Returns:** `BigNumber`

___
<a id="gettradetransactionlimits"></a>

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(params: *[PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md)*): [TradeTransactionLimits](api-interfaces-api-trade-tradetransactionlimits.md)

*Defined in [api/Trade.ts:119](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L119)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md) |

**Returns:** [TradeTransactionLimits](api-interfaces-api-trade-tradetransactionlimits.md)

___
<a id="placeonchaintrade"></a>

###  placeOnChainTrade

▸ **placeOnChainTrade**(params: *[PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md)*): `Promise`<`void`>

*Defined in [api/Trade.ts:76](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L76)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](api-interfaces-api-trade-placetradechainparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [api/Trade.ts:59](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/api/Trade.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___

