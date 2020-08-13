[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Liquidity"](_augur_sdk_src_state_getter_liquidity_.md)

# Module: "augur-sdk/src/state/getter/Liquidity"

## Index

### Classes

* [Liquidity](../classes/_augur_sdk_src_state_getter_liquidity_.liquidity.md)

### Interfaces

* [MarketLiquidityRanking](../interfaces/_augur_sdk_src_state_getter_liquidity_.marketliquidityranking.md)

### Variables

* [GetMarketLiquidityRankingParams](_augur_sdk_src_state_getter_liquidity_.md#const-getmarketliquidityrankingparams)

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

*Defined in [packages/augur-sdk/src/state/getter/Liquidity.ts:13](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Liquidity.ts#L13)*
