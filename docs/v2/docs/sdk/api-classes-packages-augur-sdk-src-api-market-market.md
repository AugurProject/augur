---
id: api-classes-packages-augur-sdk-src-api-market-market
title: Market
sidebar_label: Market
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Market Module]](api-modules-packages-augur-sdk-src-api-market-module.md) > [Market](api-classes-packages-augur-sdk-src-api-market-market.md)

## Class

## Hierarchy

**Market**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-market-market.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-api-market-market.md#augur)

### Methods

* [createCategoricalMarket](api-classes-packages-augur-sdk-src-api-market-market.md#createcategoricalmarket)
* [createScalarMarket](api-classes-packages-augur-sdk-src-api-market-market.md#createscalarmarket)
* [createYesNoMarket](api-classes-packages-augur-sdk-src-api-market-market.md#createyesnomarket)
* [extractMarketIdFromEvents](api-classes-packages-augur-sdk-src-api-market-market.md#extractmarketidfromevents)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Market**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*): [Market](api-classes-packages-augur-sdk-src-api-market-market.md)

*Defined in [packages/augur-sdk/src/api/Market.ts:34](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |

**Returns:** [Market](api-classes-packages-augur-sdk-src-api-market-market.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/api/Market.ts:34](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L34)*

___

## Methods

<a id="createcategoricalmarket"></a>

###  createCategoricalMarket

▸ **createCategoricalMarket**(params: *[CreateCategoricalMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createcategoricalmarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/api/Market.ts:54](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateCategoricalMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createcategoricalmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createscalarmarket"></a>

###  createScalarMarket

▸ **createScalarMarket**(params: *[CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/api/Market.ts:69](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateScalarMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createscalarmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createyesnomarket"></a>

###  createYesNoMarket

▸ **createYesNoMarket**(params: *[CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md)*): `Promise`<`Market`>

*Defined in [packages/augur-sdk/src/api/Market.ts:40](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateYesNoMarketParams](api-interfaces-packages-augur-sdk-src-api-market-createyesnomarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="extractmarketidfromevents"></a>

###  extractMarketIdFromEvents

▸ **extractMarketIdFromEvents**(events: *`any`*): `string`

*Defined in [packages/augur-sdk/src/api/Market.ts:85](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Market.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| events | `any` |

**Returns:** `string`

___

