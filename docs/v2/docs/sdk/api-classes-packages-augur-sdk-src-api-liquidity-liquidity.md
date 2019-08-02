---
id: api-classes-packages-augur-sdk-src-api-liquidity-liquidity
title: Liquidity
sidebar_label: Liquidity
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Liquidity Module]](api-modules-packages-augur-sdk-src-api-liquidity-module.md) > [Liquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md)

## Class

## Hierarchy

**Liquidity**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md#augur)

### Methods

* [getHorizontalLiquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md#gethorizontalliquidity)
* [getLiquidityForSpread](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md#getliquidityforspread)
* [getVerticalLiquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md#getverticalliquidity)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Liquidity**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*): [Liquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md)

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:50](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Liquidity.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |

**Returns:** [Liquidity](api-classes-packages-augur-sdk-src-api-liquidity-liquidity.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:50](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Liquidity.ts#L50)*

___

## Methods

<a id="gethorizontalliquidity"></a>

###  getHorizontalLiquidity

▸ **getHorizontalLiquidity**(orderbook: *[Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md)*, numTicks: *`BigNumber`*, feeMultiplier: *`BigNumber`*, numOutcomes: *`number`*, spread: *`number`*): [HorizontalLiquidity](api-interfaces-packages-augur-sdk-src-api-liquidity-horizontalliquidity.md)

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:73](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Liquidity.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderbook | [Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md) |
| numTicks | `BigNumber` |
| feeMultiplier | `BigNumber` |
| numOutcomes | `number` |
| spread | `number` |

**Returns:** [HorizontalLiquidity](api-interfaces-packages-augur-sdk-src-api-liquidity-horizontalliquidity.md)

___
<a id="getliquidityforspread"></a>

###  getLiquidityForSpread

▸ **getLiquidityForSpread**(params: *[GetLiquidityParams](api-interfaces-packages-augur-sdk-src-api-liquidity-getliquidityparams.md)*): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:56](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Liquidity.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetLiquidityParams](api-interfaces-packages-augur-sdk-src-api-liquidity-getliquidityparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getverticalliquidity"></a>

###  getVerticalLiquidity

▸ **getVerticalLiquidity**(orderbook: *[Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md)*, numTicks: *`BigNumber`*, marketType: *[MarketType](api-enums-packages-augur-sdk-src-state-logs-types-markettype.md)*, feeMultiplier: *`BigNumber`*, numOutcomes: *`number`*, spread: *`number`*): [VerticalLiquidity](api-interfaces-packages-augur-sdk-src-api-liquidity-verticalliquidity.md)

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:132](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/api/Liquidity.ts#L132)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderbook | [Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md) |
| numTicks | `BigNumber` |
| marketType | [MarketType](api-enums-packages-augur-sdk-src-state-logs-types-markettype.md) |
| feeMultiplier | `BigNumber` |
| numOutcomes | `number` |
| spread | `number` |

**Returns:** [VerticalLiquidity](api-interfaces-packages-augur-sdk-src-api-liquidity-verticalliquidity.md)

___

