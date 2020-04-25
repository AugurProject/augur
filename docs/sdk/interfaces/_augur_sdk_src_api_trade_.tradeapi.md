[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Trade"](../modules/_augur_sdk_src_api_trade_.md) › [TradeAPI](_augur_sdk_src_api_trade_.tradeapi.md)

# Interface: TradeAPI

## Hierarchy

* **TradeAPI**

## Implemented by

* [Trade](../classes/_augur_sdk_src_api_trade_.trade.md)

## Index

### Methods

* [placeTrade](_augur_sdk_src_api_trade_.tradeapi.md#placetrade)
* [simulateTrade](_augur_sdk_src_api_trade_.tradeapi.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_api_trade_.tradeapi.md#simulatetradegaslimit)
* [useZeroX](_augur_sdk_src_api_trade_.tradeapi.md#usezerox)

## Methods

###  placeTrade

▸ **placeTrade**(`params`: [PlaceTradeDisplayParams](_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/Trade.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Trade.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [PlaceTradeDisplayParams](_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹[SimulateTradeData](_augur_sdk_src_api_trade_.simulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/api/Trade.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Trade.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹[SimulateTradeData](_augur_sdk_src_api_trade_.simulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/Trade.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Trade.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*

___

###  useZeroX

▸ **useZeroX**(): *boolean*

*Defined in [packages/augur-sdk/src/api/Trade.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Trade.ts#L14)*

**Returns:** *boolean*
