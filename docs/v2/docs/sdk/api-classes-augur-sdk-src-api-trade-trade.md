---
id: api-classes-augur-sdk-src-api-trade-trade
title: Trade
sidebar_label: Trade
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Trade Module]](api-modules-augur-sdk-src-api-trade-module.md) > [Trade](api-classes-augur-sdk-src-api-trade-trade.md)

## Class

## Hierarchy

**Trade**

## Implements

* [TradeAPI](api-interfaces-augur-sdk-src-api-trade-tradeapi.md)

### Constructors

* [constructor](api-classes-augur-sdk-src-api-trade-trade.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-trade-trade.md#augur)

### Methods

* [getOnChainTradeParams](api-classes-augur-sdk-src-api-trade-trade.md#getonchaintradeparams)
* [maxExpirationTime](api-classes-augur-sdk-src-api-trade-trade.md#maxexpirationtime)
* [onChain](api-classes-augur-sdk-src-api-trade-trade.md#onchain)
* [placeOnChainTrade](api-classes-augur-sdk-src-api-trade-trade.md#placeonchaintrade)
* [placeTrade](api-classes-augur-sdk-src-api-trade-trade.md#placetrade)
* [simulateTrade](api-classes-augur-sdk-src-api-trade-trade.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-augur-sdk-src-api-trade-trade.md#simulatetradegaslimit)
* [useZeroX](api-classes-augur-sdk-src-api-trade-trade.md#usezerox)
* [zeroX](api-classes-augur-sdk-src-api-trade-trade.md#zerox)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Trade**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [Trade](api-classes-augur-sdk-src-api-trade-trade.md)

*Defined in [augur-sdk/src/api/Trade.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [Trade](api-classes-augur-sdk-src-api-trade-trade.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/Trade.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L32)*

___

## Methods

<a id="getonchaintradeparams"></a>

### `<Private>` getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)

*Defined in [augur-sdk/src/api/Trade.ts:59](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)

___
<a id="maxexpirationtime"></a>

### `<Private>` maxExpirationTime

▸ **maxExpirationTime**(): `BigNumber`

*Defined in [augur-sdk/src/api/Trade.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L50)*

**Returns:** `BigNumber`

___
<a id="onchain"></a>

### `<Private>` onChain

▸ **onChain**(): [OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)

*Defined in [augur-sdk/src/api/Trade.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L46)*

**Returns:** [OnChainTrade](api-classes-augur-sdk-src-api-onchaintrade-onchaintrade.md)

___
<a id="placeonchaintrade"></a>

### `<Private>` placeOnChainTrade

▸ **placeOnChainTrade**(params: *[PlaceTradeParams](api-interfaces-augur-sdk-src-api-trade-placetradeparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/Trade.ts:71](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeParams](api-interfaces-augur-sdk-src-api-trade-placetradeparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Implementation of [TradeAPI](api-interfaces-augur-sdk-src-api-trade-tradeapi.md).[placeTrade](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#placetrade)*

*Defined in [augur-sdk/src/api/Trade.ts:54](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

*Implementation of [TradeAPI](api-interfaces-augur-sdk-src-api-trade-tradeapi.md).[simulateTrade](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#simulatetrade)*

*Defined in [augur-sdk/src/api/Trade.ts:82](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L82)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/api/Trade.ts:93](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="usezerox"></a>

###  useZeroX

▸ **useZeroX**(): `boolean`

*Implementation of [TradeAPI](api-interfaces-augur-sdk-src-api-trade-tradeapi.md).[useZeroX](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#usezerox)*

*Defined in [augur-sdk/src/api/Trade.ts:38](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L38)*

**Returns:** `boolean`

___
<a id="zerox"></a>

### `<Private>` zeroX

▸ **zeroX**(): [ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)

*Defined in [augur-sdk/src/api/Trade.ts:42](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L42)*

**Returns:** [ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)

___

