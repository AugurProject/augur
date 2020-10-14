[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/LiquidityPool"](../modules/_augur_sdk_src_state_getter_liquiditypool_.md) › [LiquidityPool](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md)

# Class: LiquidityPool

## Hierarchy

* **LiquidityPool**

## Index

### Properties

* [GetMarketOutcomeBestOfferParams](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getmarketoutcomebestofferparams)
* [getMarketsLiquidityPoolsParams](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getmarketsliquiditypoolsparams)

### Methods

* [convertOrderToDisplayValues](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-convertordertodisplayvalues)
* [getLiquidityPoolBestOffers](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getliquiditypoolbestoffers)
* [getMarketOutcomeBestOffer](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getmarketoutcomebestoffer)
* [getMarketsLiquidityPools](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getmarketsliquiditypools)
* [getOutcomesBestOffer](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getoutcomesbestoffer)
* [getPoolsOfMarkets](_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md#static-getpoolsofmarkets)

## Properties

### `Static` GetMarketOutcomeBestOfferParams

▪ **GetMarketOutcomeBestOfferParams**: *TypeC‹object›* = MarketOutcomeBestOfferParam

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L40)*

___

### `Static` getMarketsLiquidityPoolsParams

▪ **getMarketsLiquidityPoolsParams**: *TypeC‹object›* = MarketPoolBestOfferParam

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:39](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L39)*

## Methods

### `Static` convertOrderToDisplayValues

▸ **convertOrderToDisplayValues**(`order`: any): *any*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:185](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | any |

**Returns:** *any*

___

### `Static` getLiquidityPoolBestOffers

▸ **getLiquidityPoolBestOffers**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `marketIds`: string[], `numOutcomes`: number): *Promise‹object›*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:73](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L73)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) | - |
`marketIds` | string[] | - |
`numOutcomes` | number | 3 |

**Returns:** *Promise‹object›*

___

### `Static` getMarketOutcomeBestOffer

▸ **getMarketOutcomeBestOffer**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetMarketOutcomeBestOfferParams›): *Promise‹[MarketLiquidityPool](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.marketliquiditypool.md)›*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:106](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L106)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetMarketOutcomeBestOfferParams› |

**Returns:** *Promise‹[MarketLiquidityPool](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.marketliquiditypool.md)›*

___

### `Static` getMarketsLiquidityPools

▸ **getMarketsLiquidityPools**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketsLiquidityPoolsParams›): *Promise‹[MarketLiquidityPool](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.marketliquiditypool.md)›*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:43](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketsLiquidityPoolsParams› |

**Returns:** *Promise‹[MarketLiquidityPool](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.marketliquiditypool.md)›*

___

### `Static` getOutcomesBestOffer

▸ **getOutcomesBestOffer**(`bucketsByPrice`: any): *any*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:156](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`bucketsByPrice` | any |

**Returns:** *any*

___

### `Static` getPoolsOfMarkets

▸ **getPoolsOfMarkets**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `marketIds`: string[]): *Promise‹Dictionary‹MarketData[]››*

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:139](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L139)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`marketIds` | string[] |

**Returns:** *Promise‹Dictionary‹MarketData[]››*
