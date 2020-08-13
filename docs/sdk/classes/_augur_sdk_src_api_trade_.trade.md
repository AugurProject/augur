[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Trade"](../modules/_augur_sdk_src_api_trade_.md) › [Trade](_augur_sdk_src_api_trade_.trade.md)

# Class: Trade

## Hierarchy

* **Trade**

## Implements

* [TradeAPI](../interfaces/_augur_sdk_src_api_trade_.tradeapi.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_api_trade_.trade.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_trade_.trade.md#private-augur)

### Accessors

* [onChain](_augur_sdk_src_api_trade_.trade.md#private-onchain)
* [zeroX](_augur_sdk_src_api_trade_.trade.md#private-zerox)

### Methods

* [getOnChainTradeParams](_augur_sdk_src_api_trade_.trade.md#private-getonchaintradeparams)
* [maxExpirationTime](_augur_sdk_src_api_trade_.trade.md#private-maxexpirationtime)
* [placeOnChainTrade](_augur_sdk_src_api_trade_.trade.md#private-placeonchaintrade)
* [placeTrade](_augur_sdk_src_api_trade_.trade.md#placetrade)
* [simulateTrade](_augur_sdk_src_api_trade_.trade.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_api_trade_.trade.md#simulatetradegaslimit)
* [useZeroX](_augur_sdk_src_api_trade_.trade.md#usezerox)

## Constructors

###  constructor

\+ **new Trade**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[Trade](_augur_sdk_src_api_trade_.trade.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[Trade](_augur_sdk_src_api_trade_.trade.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L34)*

## Accessors

### `Private` onChain

• **get onChain**(): *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:48](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L48)*

**Returns:** *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

___

### `Private` zeroX

• **get zeroX**(): *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:44](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L44)*

**Returns:** *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

## Methods

### `Private` getOnChainTradeParams

▸ **getOnChainTradeParams**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *[NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:62](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *[NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)*

___

### `Private` maxExpirationTime

▸ **maxExpirationTime**(): *BigNumber*

*Defined in [packages/augur-sdk/src/api/Trade.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L52)*

**Returns:** *BigNumber*

___

### `Private` placeOnChainTrade

▸ **placeOnChainTrade**(`params`: [PlaceTradeParams](../interfaces/_augur_sdk_src_api_trade_.placetradeparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/Trade.ts:74](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeParams](../interfaces/_augur_sdk_src_api_trade_.placetradeparams.md) |

**Returns:** *Promise‹boolean›*

___

###  placeTrade

▸ **placeTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹boolean›*

*Implementation of [TradeAPI](../interfaces/_augur_sdk_src_api_trade_.tradeapi.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:57](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

*Implementation of [TradeAPI](../interfaces/_augur_sdk_src_api_trade_.tradeapi.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:86](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹[SimulateTradeData](../interfaces/_augur_sdk_src_api_trade_.simulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/Trade.ts:98](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [PlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_trade_.placetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*

___

###  useZeroX

▸ **useZeroX**(): *boolean*

*Implementation of [TradeAPI](../interfaces/_augur_sdk_src_api_trade_.tradeapi.md)*

*Defined in [packages/augur-sdk/src/api/Trade.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/Trade.ts#L40)*

**Returns:** *boolean*
