[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/OnChainTrade"](../modules/_augur_sdk_src_api_onchaintrade_.md) › [OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)

# Class: OnChainTrade

## Hierarchy

* **OnChainTrade**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#constructor)

### Properties

* [augur](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#private-readonly-augur)

### Methods

* [checkIfTradeValid](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#checkiftradevalid)
* [getOnChainTradeParams](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#getonchaintradeparams)
* [getTradeAmountRemaining](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#private-gettradeamountremaining)
* [getTradeTransactionLimits](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#gettradetransactionlimits)
* [placeOnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#placeonchaintrade)
* [placeTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#placetrade)
* [simulateTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_api_onchaintrade_.onchaintrade.md#simulatetradegaslimit)

## Constructors

###  constructor

\+ **new OnChainTrade**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:93](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[OnChainTrade](_augur_sdk_src_api_onchaintrade_.onchaintrade.md)*

## Properties

### `Private` `Readonly` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:93](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L93)*

## Methods

###  checkIfTradeValid

▸ **checkIfTradeValid**(`params`: [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)): *Promise‹string | null›*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:232](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L232)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md) |

**Returns:** *Promise‹string | null›*

___

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(`params`: [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)): *[NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:114](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md) |

**Returns:** *[NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)*

___

### `Private` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(`tradeOnChainAmountRemaining`: BigNumber, `events`: Event[]): *BigNumber*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:292](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L292)*

**Parameters:**

Name | Type |
------ | ------ |
`tradeOnChainAmountRemaining` | BigNumber |
`events` | Event[] |

**Returns:** *BigNumber*

___

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(`params`: [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)): *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:266](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L266)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md) |

**Returns:** *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

___

###  placeOnChainTrade

▸ **placeOnChainTrade**(`params`: [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:142](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md) |

**Returns:** *Promise‹boolean›*

___

###  placeTrade

▸ **placeTrade**(`params`: [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:99](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)): *Promise‹[NativeSimulateTradeData](../interfaces/_augur_sdk_src_api_onchaintrade_.nativesimulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:190](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L190)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md) |

**Returns:** *Promise‹[NativeSimulateTradeData](../interfaces/_augur_sdk_src_api_onchaintrade_.nativesimulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:104](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*
