---
id: api-interfaces-augur-sdk-src-api-trade-tradeapi
title: TradeAPI
sidebar_label: TradeAPI
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Trade Module]](api-modules-augur-sdk-src-api-trade-module.md) > [TradeAPI](api-interfaces-augur-sdk-src-api-trade-tradeapi.md)

## Interface

## Hierarchy

**TradeAPI**

## Implemented by

* [Trade](api-classes-augur-sdk-src-api-trade-trade.md)

### Methods

* [placeTrade](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#placetrade)
* [simulateTrade](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#simulatetrade)
* [simulateTradeGasLimit](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#simulatetradegaslimit)
* [useZeroX](api-interfaces-augur-sdk-src-api-trade-tradeapi.md#usezerox)

---

## Methods

<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/Trade.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md)*): `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

*Defined in [augur-sdk/src/api/Trade.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-trade-placetradedisplayparams.md) |

**Returns:** `Promise`<[SimulateTradeData](api-interfaces-augur-sdk-src-api-trade-simulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/api/Trade.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="usezerox"></a>

###  useZeroX

▸ **useZeroX**(): `boolean`

*Defined in [augur-sdk/src/api/Trade.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Trade.ts#L13)*

**Returns:** `boolean`

___

