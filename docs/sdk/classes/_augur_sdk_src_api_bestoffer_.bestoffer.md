[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/BestOffer"](../modules/_augur_sdk_src_api_bestoffer_.md) › [BestOffer](_augur_sdk_src_api_bestoffer_.bestoffer.md)

# Class: BestOffer

## Hierarchy

* **BestOffer**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_bestoffer_.bestoffer.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_bestoffer_.bestoffer.md#private-readonly-augur)

### Methods

* [determineBestOfferForLiquidityPool](_augur_sdk_src_api_bestoffer_.bestoffer.md#determinebestofferforliquiditypool)
* [getBestPricePerOutcomeInMarket](_augur_sdk_src_api_bestoffer_.bestoffer.md#getbestpriceperoutcomeinmarket)

## Constructors

###  constructor

\+ **new BestOffer**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[BestOffer](_augur_sdk_src_api_bestoffer_.bestoffer.md)*

*Defined in [packages/augur-sdk/src/api/BestOffer.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/BestOffer.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[BestOffer](_augur_sdk_src_api_bestoffer_.bestoffer.md)*

## Properties

### `Private` `Readonly` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/BestOffer.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/BestOffer.ts#L34)*

## Methods

###  determineBestOfferForLiquidityPool

▸ **determineBestOfferForLiquidityPool**(`orders`: object): *void*

*Defined in [packages/augur-sdk/src/api/BestOffer.ts:44](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/BestOffer.ts#L44)*

**Parameters:**

▪ **orders**: *object*

Name | Type |
------ | ------ |
`logs` | ParsedOrderEventLog[] |

**Returns:** *void*

___

###  getBestPricePerOutcomeInMarket

▸ **getBestPricePerOutcomeInMarket**(`onlyOffers`: ParsedOrderEventLog[]): *object*

*Defined in [packages/augur-sdk/src/api/BestOffer.ts:98](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/BestOffer.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`onlyOffers` | ParsedOrderEventLog[] |

**Returns:** *object*
