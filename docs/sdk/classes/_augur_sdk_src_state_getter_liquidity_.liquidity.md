[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Liquidity"](../modules/_augur_sdk_src_state_getter_liquidity_.md) › [Liquidity](_augur_sdk_src_state_getter_liquidity_.liquidity.md)

# Class: Liquidity

## Hierarchy

* **Liquidity**

## Index

### Properties

* [getMarketLiquidityRankingParams](_augur_sdk_src_state_getter_liquidity_.liquidity.md#static-getmarketliquidityrankingparams)

### Methods

* [getMarketLiquidityRanking](_augur_sdk_src_state_getter_liquidity_.liquidity.md#static-getmarketliquidityranking)

## Properties

### `Static` getMarketLiquidityRankingParams

▪ **getMarketLiquidityRankingParams**: *TypeC‹object›* = GetMarketLiquidityRankingParams

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L41)*

## Methods

### `Static` getMarketLiquidityRanking

▸ **getMarketLiquidityRanking**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMarketLiquidityRankingParams›): *Promise‹[MarketLiquidityRanking](../interfaces/_augur_sdk_src_state_getter_liquidity_.marketliquidityranking.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:44](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMarketLiquidityRankingParams› |

**Returns:** *Promise‹[MarketLiquidityRanking](../interfaces/_augur_sdk_src_state_getter_liquidity_.marketliquidityranking.md)›*
