[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Liquidity"](../modules/_augur_sdk_src_api_liquidity_.md) › [Liquidity](_augur_sdk_src_api_liquidity_.liquidity.md)

# Class: Liquidity

## Hierarchy

* **Liquidity**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_liquidity_.liquidity.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_liquidity_.liquidity.md#private-augur)

### Methods

* [getHorizontalLiquidity](_augur_sdk_src_api_liquidity_.liquidity.md#gethorizontalliquidity)
* [getLiquidityForSpread](_augur_sdk_src_api_liquidity_.liquidity.md#getliquidityforspread)
* [getVerticalLiquidity](_augur_sdk_src_api_liquidity_.liquidity.md#getverticalliquidity)

## Constructors

###  constructor

\+ **new Liquidity**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[Liquidity](_augur_sdk_src_api_liquidity_.liquidity.md)*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:73](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Liquidity.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[Liquidity](_augur_sdk_src_api_liquidity_.liquidity.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:73](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Liquidity.ts#L73)*

## Methods

###  getHorizontalLiquidity

▸ **getHorizontalLiquidity**(`orderBook`: [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md), `numTicks`: BigNumber, `feeMultiplier`: BigNumber, `numOutcomes`: number, `spread`: number): *[HorizontalLiquidity](../interfaces/_augur_sdk_src_api_liquidity_.horizontalliquidity.md)*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:108](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Liquidity.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`orderBook` | [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md) |
`numTicks` | BigNumber |
`feeMultiplier` | BigNumber |
`numOutcomes` | number |
`spread` | number |

**Returns:** *[HorizontalLiquidity](../interfaces/_augur_sdk_src_api_liquidity_.horizontalliquidity.md)*

___

###  getLiquidityForSpread

▸ **getLiquidityForSpread**(`params`: [GetLiquidityParams](../interfaces/_augur_sdk_src_api_liquidity_.getliquidityparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:79](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Liquidity.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [GetLiquidityParams](../interfaces/_augur_sdk_src_api_liquidity_.getliquidityparams.md) |

**Returns:** *Promise‹BigNumber›*

___

###  getVerticalLiquidity

▸ **getVerticalLiquidity**(`orderBook`: [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md), `numTicks`: BigNumber, `marketType`: [MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md), `feeMultiplier`: BigNumber, `numOutcomes`: number, `spread`: number): *[VerticalLiquidity](../interfaces/_augur_sdk_src_api_liquidity_.verticalliquidity.md)*

*Defined in [packages/augur-sdk/src/api/Liquidity.ts:197](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Liquidity.ts#L197)*

**Parameters:**

Name | Type |
------ | ------ |
`orderBook` | [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md) |
`numTicks` | BigNumber |
`marketType` | [MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md) |
`feeMultiplier` | BigNumber |
`numOutcomes` | number |
`spread` | number |

**Returns:** *[VerticalLiquidity](../interfaces/_augur_sdk_src_api_liquidity_.verticalliquidity.md)*
