---
id: api-modules-augur-sdk-src-state-getter-liquidity-module
title: augur-sdk/src/state/getter/Liquidity Module
sidebar_label: augur-sdk/src/state/getter/Liquidity
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Liquidity Module]](api-modules-augur-sdk-src-state-getter-liquidity-module.md)

## Module

### Classes

* [Liquidity](api-classes-augur-sdk-src-state-getter-liquidity-liquidity.md)

### Interfaces

* [MarketLiquidityRanking](api-interfaces-augur-sdk-src-state-getter-liquidity-marketliquidityranking.md)

### Variables

* [GetMarketLiquidityRankingParams](api-modules-augur-sdk-src-state-getter-liquidity-module.md#getmarketliquidityrankingparams)
* [Order](api-modules-augur-sdk-src-state-getter-liquidity-module.md#order)
* [OrderBook](api-modules-augur-sdk-src-state-getter-liquidity-module.md#orderbook)
* [OutcomeOrderBook](api-modules-augur-sdk-src-state-getter-liquidity-module.md#outcomeorderbook)

---

## Variables

<a id="getmarketliquidityrankingparams"></a>

### `<Const>` GetMarketLiquidityRankingParams

**● GetMarketLiquidityRankingParams**: *`TypeC`<`object`>* =  t.type({
    orderBook: OrderBook,
    numTicks: t.string,
    marketType: t.number,
    reportingFeeDivisor: t.string,
    feePerCashInAttoCash: t.string,
    numOutcomes: t.number,
    spread: t.number,
})

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L24)*

___
<a id="order"></a>

### `<Const>` Order

**● Order**: *`TypeC`<`object`>* =  t.type({
    price: t.string,
    amount: t.string,
})

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:8](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L8)*

___
<a id="orderbook"></a>

### `<Const>` OrderBook

**● OrderBook**: *`RecordC`<`StringC`, `TypeC`<`object`>>* =  t.dictionary(
    t.string,
    OutcomeOrderBook,
)

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L19)*

___
<a id="outcomeorderbook"></a>

### `<Const>` OutcomeOrderBook

**● OutcomeOrderBook**: *`TypeC`<`object`>* =  t.type({
    bids: t.array(Order),
    asks: t.array(Order),
})

*Defined in [augur-sdk/src/state/getter/Liquidity.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Liquidity.ts#L13)*

___

