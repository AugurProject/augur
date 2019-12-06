---
id: api-classes-augur-sdk-src-state-getter-liquidity-liquidity
title: Liquidity
sidebar_label: Liquidity
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Liquidity Module]](api-modules-augur-sdk-src-state-getter-liquidity-module.md) > [Liquidity](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md)

## Class

## Hierarchy

**Liquidity**

### Properties

* [getMarketLiquidityRankingParams](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md#getmarketliquidityrankingparams)

### Methods

* [getMarketLiquidityRanking](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md#getmarketliquidityranking)

---

## Properties

<a id="getmarketliquidityrankingparams"></a>

### `<Static>` getMarketLiquidityRankingParams

**● getMarketLiquidityRankingParams**: *`TypeC`<`object`>* =  GetMarketLiquidityRankingParams

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:41](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L41)*

___

## Methods

<a id="getmarketliquidityranking"></a>

### `<Static>` getMarketLiquidityRanking

▸ **getMarketLiquidityRanking**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[MarketLiquidityRanking](api-interfaces-augur-sdk-src-state-getter-liquidity-marketliquidityranking.md)>

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:44](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L44)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[MarketLiquidityRanking](api-interfaces-augur-sdk-src-state-getter-liquidity-marketliquidityranking.md)>

___

