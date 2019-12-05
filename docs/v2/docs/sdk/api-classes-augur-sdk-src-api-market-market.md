---
id: api-classes-augur-sdk-src-api-market-market
title: Market
sidebar_label: Market
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Market Module]](api-modules-augur-sdk-src-api-market-module.md) > [Market](api-classes-augur-sdk-src-api-market-market.md)

## Class

## Hierarchy

**Market**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-market-market.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-market-market.md#augur)

### Methods

* [createCategoricalMarket](api-classes-augur-sdk-src-api-market-market.md#createcategoricalmarket)
* [createScalarMarket](api-classes-augur-sdk-src-api-market-market.md#createscalarmarket)
* [createYesNoMarket](api-classes-augur-sdk-src-api-market-market.md#createyesnomarket)
* [extractMarketIdFromEvents](api-classes-augur-sdk-src-api-market-market.md#extractmarketidfromevents)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Market**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [Market](api-classes-augur-sdk-src-api-market-market.md)

*Defined in [augur-sdk/src/api/Market.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [Market](api-classes-augur-sdk-src-api-market-market.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/Market.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L37)*

___

## Methods

<a id="createcategoricalmarket"></a>

###  createCategoricalMarket

▸ **createCategoricalMarket**(params: *[CreateCategoricalMarketParams](api-interfaces-augur-sdk-src-api-market-createcategoricalmarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/api/Market.ts:60](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L60)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateCategoricalMarketParams](api-interfaces-augur-sdk-src-api-market-createcategoricalmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createscalarmarket"></a>

###  createScalarMarket

▸ **createScalarMarket**(params: *[CreateScalarMarketParams](api-interfaces-augur-sdk-src-api-market-createscalarmarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/api/Market.ts:78](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateScalarMarketParams](api-interfaces-augur-sdk-src-api-market-createscalarmarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="createyesnomarket"></a>

###  createYesNoMarket

▸ **createYesNoMarket**(params: *[CreateYesNoMarketParams](api-interfaces-augur-sdk-src-api-market-createyesnomarketparams.md)*): `Promise`<`Market`>

*Defined in [augur-sdk/src/api/Market.ts:43](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateYesNoMarketParams](api-interfaces-augur-sdk-src-api-market-createyesnomarketparams.md) |

**Returns:** `Promise`<`Market`>

___
<a id="extractmarketidfromevents"></a>

###  extractMarketIdFromEvents

▸ **extractMarketIdFromEvents**(events: *`any`*): `string`

*Defined in [augur-sdk/src/api/Market.ts:97](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Market.ts#L97)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| events | `any` |

**Returns:** `string`

___

