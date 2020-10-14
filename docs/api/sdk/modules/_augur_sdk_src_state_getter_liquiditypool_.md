[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/LiquidityPool"](_augur_sdk_src_state_getter_liquiditypool_.md)

# Module: "augur-sdk/src/state/getter/LiquidityPool"

## Index

### Classes

* [LiquidityPool](../classes/_augur_sdk_src_state_getter_liquiditypool_.liquiditypool.md)

### Interfaces

* [BestOfferOrder](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.bestofferorder.md)
* [MarketLiquidityPool](../interfaces/_augur_sdk_src_state_getter_liquiditypool_.marketliquiditypool.md)

### Variables

* [CAT_MIN_PRICE](_augur_sdk_src_state_getter_liquiditypool_.md#const-cat_min_price)
* [CAT_TICK_SIZE](_augur_sdk_src_state_getter_liquiditypool_.md#const-cat_tick_size)
* [MarketOutcomeBestOfferParam](_augur_sdk_src_state_getter_liquiditypool_.md#const-marketoutcomebestofferparam)
* [MarketPoolBestOfferParam](_augur_sdk_src_state_getter_liquiditypool_.md#const-marketpoolbestofferparam)

## Variables

### `Const` CAT_MIN_PRICE

• **CAT_MIN_PRICE**: *BigNumber‹›* = new BigNumber(0)

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:36](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L36)*

___

### `Const` CAT_TICK_SIZE

• **CAT_TICK_SIZE**: *BigNumber‹›* = new BigNumber(0.01)

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L35)*

___

### `Const` MarketOutcomeBestOfferParam

• **MarketOutcomeBestOfferParam**: *TypeC‹object›* = t.type({
  marketId: t.string,
  outcome: t.string,
})

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L30)*

___

### `Const` MarketPoolBestOfferParam

• **MarketPoolBestOfferParam**: *TypeC‹object›* = t.type({
  liquidityPools: t.array(t.string),
})

*Defined in [packages/augur-sdk/src/state/getter/LiquidityPool.ts:26](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/LiquidityPool.ts#L26)*
