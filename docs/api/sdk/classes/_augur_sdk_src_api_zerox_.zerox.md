[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ZeroX"](../modules/_augur_sdk_src_api_zerox_.md) › [ZeroX](_augur_sdk_src_api_zerox_.zerox.md)

# Class: ZeroX

## Hierarchy

* **ZeroX**

## Index

### Constructors

* [constructor](_augur_sdk_src_api_zerox_.zerox.md#constructor)

### Properties

* [_client](_augur_sdk_src_api_zerox_.zerox.md#private-_client)
* [_mesh](_augur_sdk_src_api_zerox_.zerox.md#private-optional-_mesh)
* [_rpc](_augur_sdk_src_api_zerox_.zerox.md#private-optional-_rpc)

### Accessors

* [client](_augur_sdk_src_api_zerox_.zerox.md#client)
* [mesh](_augur_sdk_src_api_zerox_.zerox.md#mesh)
* [rpc](_augur_sdk_src_api_zerox_.zerox.md#rpc)

### Methods

* [addOrders](_augur_sdk_src_api_zerox_.zerox.md#addorders)
* [batchCancelOrders](_augur_sdk_src_api_zerox_.zerox.md#batchcancelorders)
* [cancelOrder](_augur_sdk_src_api_zerox_.zerox.md#cancelorder)
* [checkIfTradeValid](_augur_sdk_src_api_zerox_.zerox.md#checkiftradevalid)
* [createZeroXOrder](_augur_sdk_src_api_zerox_.zerox.md#createzeroxorder)
* [disconnect](_augur_sdk_src_api_zerox_.zerox.md#disconnect)
* [getMatchingOrders](_augur_sdk_src_api_zerox_.zerox.md#getmatchingorders)
* [getOnChainTradeParams](_augur_sdk_src_api_zerox_.zerox.md#getonchaintradeparams)
* [getOrders](_augur_sdk_src_api_zerox_.zerox.md#getorders)
* [getStats](_augur_sdk_src_api_zerox_.zerox.md#getstats)
* [getTradeAmountRemaining](_augur_sdk_src_api_zerox_.zerox.md#private-gettradeamountremaining)
* [getTradeTransactionLimits](_augur_sdk_src_api_zerox_.zerox.md#gettradetransactionlimits)
* [isReady](_augur_sdk_src_api_zerox_.zerox.md#isready)
* [placeOnChainOrders](_augur_sdk_src_api_zerox_.zerox.md#placeonchainorders)
* [placeOnChainTrade](_augur_sdk_src_api_zerox_.zerox.md#placeonchaintrade)
* [placeOrder](_augur_sdk_src_api_zerox_.zerox.md#placeorder)
* [placeOrders](_augur_sdk_src_api_zerox_.zerox.md#placeorders)
* [placeTrade](_augur_sdk_src_api_zerox_.zerox.md#placetrade)
* [safePlaceOrders](_augur_sdk_src_api_zerox_.zerox.md#safeplaceorders)
* [signOrder](_augur_sdk_src_api_zerox_.zerox.md#signorder)
* [signSimpleOrder](_augur_sdk_src_api_zerox_.zerox.md#signsimpleorder)
* [signWalletOrder](_augur_sdk_src_api_zerox_.zerox.md#signwalletorder)
* [simulateMakeOrder](_augur_sdk_src_api_zerox_.zerox.md#simulatemakeorder)
* [simulateTrade](_augur_sdk_src_api_zerox_.zerox.md#simulatetrade)
* [simulateTradeGasLimit](_augur_sdk_src_api_zerox_.zerox.md#simulatetradegaslimit)

## Constructors

###  constructor

\+ **new ZeroX**(`_rpcEndpoint?`: string): *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:224](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L224)*

**Parameters:**

Name | Type |
------ | ------ |
`_rpcEndpoint?` | string |

**Returns:** *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

## Properties

### `Private` _client

• **_client**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:212](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L212)*

___

### `Private` `Optional` _mesh

• **_mesh**? : *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:186](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L186)*

___

### `Private` `Optional` _rpc

• **_rpc**? : *WSClient*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:161](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L161)*

## Accessors

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:213](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L213)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:216](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L216)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

___

###  mesh

• **get mesh**(): *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:187](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L187)*

**Returns:** *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

• **set mesh**(`mesh`: [BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md) | null): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:191](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`mesh` | [BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md) &#124; null |

**Returns:** *void*

___

###  rpc

• **get rpc**(): *WSClient*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:162](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L162)*

**Returns:** *WSClient*

• **set rpc**(`client`: WSClient | null): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:166](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L166)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | WSClient &#124; null |

**Returns:** *void*

## Methods

###  addOrders

▸ **addOrders**(`orders`: any): *any*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:546](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L546)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |

**Returns:** *any*

___

###  batchCancelOrders

▸ **batchCancelOrders**(`orders`: any, `signatures`: any): *Promise‹Event[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:571](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L571)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |
`signatures` | any |

**Returns:** *Promise‹Event[]›*

___

###  cancelOrder

▸ **cancelOrder**(`order`: any, `signature`: any): *Promise‹Event[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:566](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L566)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | any |
`signature` | any |

**Returns:** *Promise‹Event[]›*

___

###  checkIfTradeValid

▸ **checkIfTradeValid**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *Promise‹string | null›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:741](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L741)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *Promise‹string | null›*

___

###  createZeroXOrder

▸ **createZeroXOrder**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *Promise‹object›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:449](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L449)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *Promise‹object›*

___

###  disconnect

▸ **disconnect**(): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:220](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L220)*

**Returns:** *void*

___

###  getMatchingOrders

▸ **getMatchingOrders**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md), `ignoreOrders?`: string[]): *Promise‹[MatchingOrders](../interfaces/_augur_sdk_src_api_zerox_.matchingorders.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:666](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L666)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |
`ignoreOrders?` | string[] |

**Returns:** *Promise‹[MatchingOrders](../interfaces/_augur_sdk_src_api_zerox_.matchingorders.md)›*

___

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *[ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:267](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L267)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *[ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)*

___

###  getOrders

▸ **getOrders**(): *Promise‹OrderInfo[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:232](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L232)*

**Returns:** *Promise‹OrderInfo[]›*

___

###  getStats

▸ **getStats**(): *Promise‹[ZeroXStats](../interfaces/_augur_sdk_src_api_zerox_.zeroxstats.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:248](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L248)*

**Returns:** *Promise‹[ZeroXStats](../interfaces/_augur_sdk_src_api_zerox_.zeroxstats.md)›*

___

### `Private` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(`account`: any, `tradeOnChainAmountRemaining`: BigNumber, `events`: Event[]): *BigNumber*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:780](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L780)*

**Parameters:**

Name | Type |
------ | ------ |
`account` | any |
`tradeOnChainAmountRemaining` | BigNumber |
`events` | Event[] |

**Returns:** *BigNumber*

___

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(`params`: [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md), `numOrders`: number): *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:812](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L812)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md) |
`numOrders` | number |

**Returns:** *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

___

###  isReady

▸ **isReady**(): *boolean*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:244](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L244)*

**Returns:** *boolean*

___

###  placeOnChainOrders

▸ **placeOnChainOrders**(`orders`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:432](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L432)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)[] |

**Returns:** *Promise‹void›*

___

###  placeOnChainTrade

▸ **placeOnChainTrade**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md), `ignoreOrders?`: string[]): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:295](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L295)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |
`ignoreOrders?` | string[] |

**Returns:** *Promise‹boolean›*

___

###  placeOrder

▸ **placeOrder**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:421](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L421)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹void›*

___

###  placeOrders

▸ **placeOrders**(`orders`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:425](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L425)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[] |

**Returns:** *Promise‹void›*

___

###  placeTrade

▸ **placeTrade**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:262](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L262)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  safePlaceOrders

▸ **safePlaceOrders**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:374](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L374)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[] |

**Returns:** *Promise‹void›*

___

###  signOrder

▸ **signOrder**(`signedOrder`: [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md), `orderHash`: string, `wallet`: boolean): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:497](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L497)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`signedOrder` | [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md) | - |
`orderHash` | string | - |
`wallet` | boolean | true |

**Returns:** *Promise‹string›*

___

###  signSimpleOrder

▸ **signSimpleOrder**(`orderHash`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:535](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L535)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHash` | string |

**Returns:** *Promise‹string›*

___

###  signWalletOrder

▸ **signWalletOrder**(`signedOrder`: [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md), `orderHash`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:509](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L509)*

**Parameters:**

Name | Type |
------ | ------ |
`signedOrder` | [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md) |
`orderHash` | string |

**Returns:** *Promise‹string›*

___

###  simulateMakeOrder

▸ **simulateMakeOrder**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *BigNumber[]*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:647](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L647)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *BigNumber[]*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹[ZeroXSimulateTradeData](../interfaces/_augur_sdk_src_api_zerox_.zeroxsimulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:583](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L583)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹[ZeroXSimulateTradeData](../interfaces/_augur_sdk_src_api_zerox_.zeroxsimulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:836](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L836)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*
