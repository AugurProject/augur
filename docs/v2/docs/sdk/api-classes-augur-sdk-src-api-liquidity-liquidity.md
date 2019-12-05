---
id: api-classes-augur-sdk-src-api-liquidity-liquidity
title: Liquidity
sidebar_label: Liquidity
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Liquidity Module]](api-modules-augur-sdk-src-api-liquidity-module.md) > [Liquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md)

## Class

## Hierarchy

**Liquidity**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-liquidity-liquidity.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-liquidity-liquidity.md#augur)

### Methods

* [getHorizontalLiquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md#gethorizontalliquidity)
* [getLiquidityForSpread](api-classes-augur-sdk-src-api-liquidity-liquidity.md#getliquidityforspread)
* [getVerticalLiquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md#getverticalliquidity)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Liquidity**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [Liquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md)

*Defined in [augur-sdk/src/api/Liquidity.ts:51](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Liquidity.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [Liquidity](api-classes-augur-sdk-src-api-liquidity-liquidity.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/Liquidity.ts:51](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Liquidity.ts#L51)*

___

## Methods

<a id="gethorizontalliquidity"></a>

###  getHorizontalLiquidity

▸ **getHorizontalLiquidity**(orderBook: *[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)*, numTicks: *`BigNumber`*, feeMultiplier: *`BigNumber`*, numOutcomes: *`number`*, spread: *`number`*): [HorizontalLiquidity](api-interfaces-augur-sdk-src-api-liquidity-horizontalliquidity.md)

*Defined in [augur-sdk/src/api/Liquidity.ts:75](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Liquidity.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderBook | [OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md) |
| numTicks | `BigNumber` |
| feeMultiplier | `BigNumber` |
| numOutcomes | `number` |
| spread | `number` |

**Returns:** [HorizontalLiquidity](api-interfaces-augur-sdk-src-api-liquidity-horizontalliquidity.md)

___
<a id="getliquidityforspread"></a>

###  getLiquidityForSpread

▸ **getLiquidityForSpread**(params: *[GetLiquidityParams](api-interfaces-augur-sdk-src-api-liquidity-getliquidityparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/api/Liquidity.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Liquidity.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetLiquidityParams](api-interfaces-augur-sdk-src-api-liquidity-getliquidityparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getverticalliquidity"></a>

###  getVerticalLiquidity

▸ **getVerticalLiquidity**(orderBook: *[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)*, numTicks: *`BigNumber`*, marketType: *[MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md)*, feeMultiplier: *`BigNumber`*, numOutcomes: *`number`*, spread: *`number`*): [VerticalLiquidity](api-interfaces-augur-sdk-src-api-liquidity-verticalliquidity.md)

*Defined in [augur-sdk/src/api/Liquidity.ts:134](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Liquidity.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderBook | [OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md) |
| numTicks | `BigNumber` |
| marketType | [MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md) |
| feeMultiplier | `BigNumber` |
| numOutcomes | `number` |
| spread | `number` |

**Returns:** [VerticalLiquidity](api-interfaces-augur-sdk-src-api-liquidity-verticalliquidity.md)

___

