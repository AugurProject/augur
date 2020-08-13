[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Market"](../modules/_augur_sdk_src_api_market_.md) › [Market](_augur_sdk_src_api_market_.market.md)

# Class: Market

## Hierarchy

* **Market**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_market_.market.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_market_.market.md#private-readonly-augur)

### Methods

* [createCategoricalMarket](_augur_sdk_src_api_market_.market.md#createcategoricalmarket)
* [createScalarMarket](_augur_sdk_src_api_market_.market.md#createscalarmarket)
* [createYesNoMarket](_augur_sdk_src_api_market_.market.md#createyesnomarket)
* [extractMarketIdFromEvents](_augur_sdk_src_api_market_.market.md#extractmarketidfromevents)

## Constructors

###  constructor

\+ **new Market**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[Market](_augur_sdk_src_api_market_.market.md)*

*Defined in [packages/augur-sdk/src/api/Market.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[Market](_augur_sdk_src_api_market_.market.md)*

## Properties

### `Private` `Readonly` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/Market.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L37)*

## Methods

###  createCategoricalMarket

▸ **createCategoricalMarket**(`params`: [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/api/Market.ts:62](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateCategoricalMarketParams](../interfaces/_augur_sdk_src_api_market_.createcategoricalmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createScalarMarket

▸ **createScalarMarket**(`params`: [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/api/Market.ts:82](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateScalarMarketParams](../interfaces/_augur_sdk_src_api_market_.createscalarmarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  createYesNoMarket

▸ **createYesNoMarket**(`params`: [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md)): *Promise‹Market›*

*Defined in [packages/augur-sdk/src/api/Market.ts:43](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CreateYesNoMarketParams](../interfaces/_augur_sdk_src_api_market_.createyesnomarketparams.md) |

**Returns:** *Promise‹Market›*

___

###  extractMarketIdFromEvents

▸ **extractMarketIdFromEvents**(`events`: any): *string*

*Defined in [packages/augur-sdk/src/api/Market.ts:103](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Market.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`events` | any |

**Returns:** *string*
