[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Liquidity"](_augur_sdk_src_state_getter_liquidity_.md)

# Module: "augur-sdk/src/state/getter/Liquidity"

## Index

### Classes

* [Liquidity](../classes/_augur_sdk_src_state_getter_liquidity_.liquidity.md)

### Interfaces

* [MarketLiquidityRanking](../interfaces/_augur_sdk_src_state_getter_liquidity_.marketliquidityranking.md)

### Variables

* [GetMarketLiquidityRankingParams](_augur_sdk_src_state_getter_liquidity_.md#const-getmarketliquidityrankingparams)
* [Order](_augur_sdk_src_state_getter_liquidity_.md#const-order)
* [OrderBook](_augur_sdk_src_state_getter_liquidity_.md#const-orderbook)
* [OutcomeOrderBook](_augur_sdk_src_state_getter_liquidity_.md#const-outcomeorderbook)

## Variables

### `Const` GetMarketLiquidityRankingParams

• **GetMarketLiquidityRankingParams**: *TypeC‹object›* = t.type({
    orderBook: OrderBook,
    numTicks: t.string,
    marketType: t.number,
    reportingFeeDivisor: t.string,
    feePerCashInAttoCash: t.string,
    numOutcomes: t.number,
    spread: t.number,
})

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L24)*

___

### `Const` Order

• **Order**: *TypeC‹object›* = t.type({
    price: t.string,
    amount: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L8)*

___

### `Const` OrderBook

• **OrderBook**: *RecordC‹StringC‹›, TypeC‹object››* = t.dictionary(
    t.string,
    OutcomeOrderBook,
)

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L19)*

___

### `Const` OutcomeOrderBook

• **OutcomeOrderBook**: *TypeC‹object›* = t.type({
    bids: t.array(Order),
    asks: t.array(Order),
})

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:13](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Liquidity.ts#L13)*
