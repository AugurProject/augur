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

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:208](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L208)*

**Parameters:**

Name | Type |
------ | ------ |
`_rpcEndpoint?` | string |

**Returns:** *[ZeroX](_augur_sdk_src_api_zerox_.zerox.md)*

## Properties

### `Private` _client

• **_client**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:196](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L196)*

___

### `Private` `Optional` _mesh

• **_mesh**? : *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:171](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L171)*

___

### `Private` `Optional` _rpc

• **_rpc**? : *WSClient*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:146](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L146)*

## Accessors

###  client

• **get client**(): *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:197](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L197)*

**Returns:** *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

• **set client**(`client`: [Augur](_augur_sdk_src_augur_.augur.md)): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:200](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *void*

___

###  mesh

• **get mesh**(): *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:172](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L172)*

**Returns:** *[BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md)*

• **set mesh**(`mesh`: [BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md) | null): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:176](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L176)*

**Parameters:**

Name | Type |
------ | ------ |
`mesh` | [BrowserMesh](../interfaces/_augur_sdk_src_api_zerox_.browsermesh.md) &#124; null |

**Returns:** *void*

___

###  rpc

• **get rpc**(): *WSClient*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:147](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L147)*

**Returns:** *WSClient*

• **set rpc**(`client`: WSClient | null): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:151](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | WSClient &#124; null |

**Returns:** *void*

## Methods

###  addOrders

▸ **addOrders**(`orders`: any): *any*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:520](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L520)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |

**Returns:** *any*

___

###  batchCancelOrders

▸ **batchCancelOrders**(`orders`: any, `signatures`: any): *Promise‹Event[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:541](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L541)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | any |
`signatures` | any |

**Returns:** *Promise‹Event[]›*

___

###  cancelOrder

▸ **cancelOrder**(`order`: any, `signature`: any): *Promise‹Event[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:536](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L536)*

**Parameters:**

Name | Type |
------ | ------ |
`order` | any |
`signature` | any |

**Returns:** *Promise‹Event[]›*

___

###  checkIfTradeValid

▸ **checkIfTradeValid**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *Promise‹string | null›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:703](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L703)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *Promise‹string | null›*

___

###  createZeroXOrder

▸ **createZeroXOrder**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *Promise‹object›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:423](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L423)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *Promise‹object›*

___

###  disconnect

▸ **disconnect**(): *void*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:204](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L204)*

**Returns:** *void*

___

###  getMatchingOrders

▸ **getMatchingOrders**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md), `ignoreOrders?`: string[]): *Promise‹[MatchingOrders](../interfaces/_augur_sdk_src_api_zerox_.matchingorders.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:630](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L630)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |
`ignoreOrders?` | string[] |

**Returns:** *Promise‹[MatchingOrders](../interfaces/_augur_sdk_src_api_zerox_.matchingorders.md)›*

___

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *[ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:251](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L251)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *[ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)*

___

###  getOrders

▸ **getOrders**(): *Promise‹OrderInfo[]›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:216](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L216)*

**Returns:** *Promise‹OrderInfo[]›*

___

###  getStats

▸ **getStats**(): *Promise‹[ZeroXStats](../interfaces/_augur_sdk_src_api_zerox_.zeroxstats.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:232](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L232)*

**Returns:** *Promise‹[ZeroXStats](../interfaces/_augur_sdk_src_api_zerox_.zeroxstats.md)›*

___

### `Private` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(`account`: any, `tradeOnChainAmountRemaining`: BigNumber, `events`: Event[]): *BigNumber*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:742](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L742)*

**Parameters:**

Name | Type |
------ | ------ |
`account` | any |
`tradeOnChainAmountRemaining` | BigNumber |
`events` | Event[] |

**Returns:** *BigNumber*

___

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(`params`: [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)): *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:774](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L774)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [NativePlaceTradeChainParams](../interfaces/_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md) |

**Returns:** *[TradeTransactionLimits](../interfaces/_augur_sdk_src_api_onchaintrade_.tradetransactionlimits.md)*

___

###  isReady

▸ **isReady**(): *boolean*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:228](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L228)*

**Returns:** *boolean*

___

###  placeOnChainOrders

▸ **placeOnChainOrders**(`orders`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:406](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L406)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)[] |

**Returns:** *Promise‹void›*

___

###  placeOnChainTrade

▸ **placeOnChainTrade**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md), `ignoreOrders?`: string[]): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:279](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |
`ignoreOrders?` | string[] |

**Returns:** *Promise‹boolean›*

___

###  placeOrder

▸ **placeOrder**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:395](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L395)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹void›*

___

###  placeOrders

▸ **placeOrders**(`orders`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:399](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L399)*

**Parameters:**

Name | Type |
------ | ------ |
`orders` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[] |

**Returns:** *Promise‹void›*

___

###  placeTrade

▸ **placeTrade**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:246](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L246)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹boolean›*

___

###  safePlaceOrders

▸ **safePlaceOrders**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:348](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L348)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)[] |

**Returns:** *Promise‹void›*

___

###  signOrder

▸ **signOrder**(`signedOrder`: [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md), `orderHash`: string, `wallet`: boolean): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:471](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L471)*

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

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:509](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L509)*

**Parameters:**

Name | Type |
------ | ------ |
`orderHash` | string |

**Returns:** *Promise‹string›*

___

###  signWalletOrder

▸ **signWalletOrder**(`signedOrder`: [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md), `orderHash`: string): *Promise‹string›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:483](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L483)*

**Parameters:**

Name | Type |
------ | ------ |
`signedOrder` | [SignedOrder](../interfaces/_augur_sdk_src_api_zerox_.signedorder.md) |
`orderHash` | string |

**Returns:** *Promise‹string›*

___

###  simulateMakeOrder

▸ **simulateMakeOrder**(`params`: [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)): *BigNumber[]*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:611](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L611)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md) |

**Returns:** *BigNumber[]*

___

###  simulateTrade

▸ **simulateTrade**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹[ZeroXSimulateTradeData](../interfaces/_augur_sdk_src_api_zerox_.zeroxsimulatetradedata.md)›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:547](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L547)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹[ZeroXSimulateTradeData](../interfaces/_augur_sdk_src_api_zerox_.zeroxsimulatetradedata.md)›*

___

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(`params`: [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md)): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:795](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L795)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [ZeroXPlaceTradeDisplayParams](../interfaces/_augur_sdk_src_api_zerox_.zeroxplacetradedisplayparams.md) |

**Returns:** *Promise‹BigNumber›*
