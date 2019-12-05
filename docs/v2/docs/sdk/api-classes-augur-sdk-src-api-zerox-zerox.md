---
id: api-classes-augur-sdk-src-api-zerox-zerox
title: ZeroX
sidebar_label: ZeroX
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/ZeroX Module]](api-modules-augur-sdk-src-api-zerox-module.md) > [ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)

## Class

## Hierarchy

**ZeroX**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-zerox-zerox.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-zerox-zerox.md#augur)
* [browserMesh](api-classes-augur-sdk-src-api-zerox-zerox.md#browsermesh)
* [meshClient](api-classes-augur-sdk-src-api-zerox-zerox.md#meshclient)
* [providerEngine](api-classes-augur-sdk-src-api-zerox-zerox.md#providerengine)

### Methods

* [checkIfTradeValid](api-classes-augur-sdk-src-api-zerox-zerox.md#checkiftradevalid)
* [getMatchingOrders](api-classes-augur-sdk-src-api-zerox-zerox.md#getmatchingorders)
* [getOnChainTradeParams](api-classes-augur-sdk-src-api-zerox-zerox.md#getonchaintradeparams)
* [getOrders](api-classes-augur-sdk-src-api-zerox-zerox.md#getorders)
* [getTradeAmountRemaining](api-classes-augur-sdk-src-api-zerox-zerox.md#gettradeamountremaining)
* [getTradeTransactionLimits](api-classes-augur-sdk-src-api-zerox-zerox.md#gettradetransactionlimits)
* [placeOnChainOrder](api-classes-augur-sdk-src-api-zerox-zerox.md#placeonchainorder)
* [placeOnChainTrade](api-classes-augur-sdk-src-api-zerox-zerox.md#placeonchaintrade)
* [placeOrder](api-classes-augur-sdk-src-api-zerox-zerox.md#placeorder)
* [placeTrade](api-classes-augur-sdk-src-api-zerox-zerox.md#placetrade)
* [signOrderHash](api-classes-augur-sdk-src-api-zerox-zerox.md#signorderhash)
* [simulateMakeOrder](api-classes-augur-sdk-src-api-zerox-zerox.md#simulatemakeorder)
* [simulateTrade](api-classes-augur-sdk-src-api-zerox-zerox.md#simulatetrade)
* [simulateTradeGasLimit](api-classes-augur-sdk-src-api-zerox-zerox.md#simulatetradegaslimit)
* [subscribeToMeshEvents](api-classes-augur-sdk-src-api-zerox-zerox.md#subscribetomeshevents)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ZeroX**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, meshClient?: *`WSClient`*, browserMesh?: *[BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md)*): [ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)

*Defined in [augur-sdk/src/api/ZeroX.ts:124](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L124)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| `Optional` meshClient | `WSClient` |
| `Optional` browserMesh | [BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md) |

**Returns:** [ZeroX](api-classes-augur-sdk-src-api-zerox-zerox.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/ZeroX.ts:121](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L121)*

___
<a id="browsermesh"></a>

### `<Private>` browserMesh

**● browserMesh**: *[BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md)*

*Defined in [augur-sdk/src/api/ZeroX.ts:123](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L123)*

___
<a id="meshclient"></a>

### `<Private>` meshClient

**● meshClient**: *`WSClient`*

*Defined in [augur-sdk/src/api/ZeroX.ts:122](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L122)*

___
<a id="providerengine"></a>

### `<Private>` providerEngine

**● providerEngine**: *`Web3ProviderEngine`*

*Defined in [augur-sdk/src/api/ZeroX.ts:124](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L124)*

___

## Methods

<a id="checkiftradevalid"></a>

###  checkIfTradeValid

▸ **checkIfTradeValid**(params: *[ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)*): `Promise`<`string` \| `null`>

*Defined in [augur-sdk/src/api/ZeroX.ts:444](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L444)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md) |

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getmatchingorders"></a>

###  getMatchingOrders

▸ **getMatchingOrders**(params: *[ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)*, ignoreOrders?: *`string`[]*): `Promise`<[MatchingOrders](api-interfaces-augur-sdk-src-api-zerox-matchingorders.md)>

*Defined in [augur-sdk/src/api/ZeroX.ts:384](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L384)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md) |
| `Optional` ignoreOrders | `string`[] |

**Returns:** `Promise`<[MatchingOrders](api-interfaces-augur-sdk-src-api-zerox-matchingorders.md)>

___
<a id="getonchaintradeparams"></a>

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md)*): [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)

*Defined in [augur-sdk/src/api/ZeroX.ts:169](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L169)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md) |

**Returns:** [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)

___
<a id="getorders"></a>

###  getOrders

▸ **getOrders**(): `Promise`<`OrderInfo`[]>

*Defined in [augur-sdk/src/api/ZeroX.ts:156](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L156)*

**Returns:** `Promise`<`OrderInfo`[]>

___
<a id="gettradeamountremaining"></a>

### `<Private>` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(tradeOnChainAmountRemaining: *`BigNumber`*, events: *`Event`[]*): `BigNumber`

*Defined in [augur-sdk/src/api/ZeroX.ts:482](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L482)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tradeOnChainAmountRemaining | `BigNumber` |
| events | `Event`[] |

**Returns:** `BigNumber`

___
<a id="gettradetransactionlimits"></a>

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(params: *[NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)*): [TradeTransactionLimits](api-interfaces-augur-sdk-src-api-onchaintrade-tradetransactionlimits.md)

*Defined in [augur-sdk/src/api/ZeroX.ts:504](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L504)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md) |

**Returns:** [TradeTransactionLimits](api-interfaces-augur-sdk-src-api-onchaintrade-tradetransactionlimits.md)

___
<a id="placeonchainorder"></a>

###  placeOnChainOrder

▸ **placeOnChainOrder**(params: *[ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/ZeroX.ts:247](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L247)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md) |

**Returns:** `Promise`<`string`>

___
<a id="placeonchaintrade"></a>

###  placeOnChainTrade

▸ **placeOnChainTrade**(params: *[ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)*, ignoreOrders?: *`string`[]*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/ZeroX.ts:197](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L197)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md) |
| `Optional` ignoreOrders | `string`[] |

**Returns:** `Promise`<`void`>

___
<a id="placeorder"></a>

###  placeOrder

▸ **placeOrder**(params: *[ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md)*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/ZeroX.ts:242](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L242)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md) |

**Returns:** `Promise`<`string`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/ZeroX.ts:164](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L164)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="signorderhash"></a>

###  signOrderHash

▸ **signOrderHash**(orderHash: *`string`*, maker: *`string`*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/ZeroX.ts:302](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L302)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderHash | `string` |
| maker | `string` |

**Returns:** `Promise`<`string`>

___
<a id="simulatemakeorder"></a>

###  simulateMakeOrder

▸ **simulateMakeOrder**(params: *[ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)*): `BigNumber`[]

*Defined in [augur-sdk/src/api/ZeroX.ts:365](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L365)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md) |

**Returns:** `BigNumber`[]

___
<a id="simulatetrade"></a>

###  simulateTrade

▸ **simulateTrade**(params: *[ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md)*): `Promise`<[ZeroXSimulateTradeData](api-interfaces-augur-sdk-src-api-zerox-zeroxsimulatetradedata.md)>

*Defined in [augur-sdk/src/api/ZeroX.ts:314](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L314)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md) |

**Returns:** `Promise`<[ZeroXSimulateTradeData](api-interfaces-augur-sdk-src-api-zerox-zeroxsimulatetradedata.md)>

___
<a id="simulatetradegaslimit"></a>

###  simulateTradeGasLimit

▸ **simulateTradeGasLimit**(params: *[ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md)*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/api/ZeroX.ts:533](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L533)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [ZeroXPlaceTradeDisplayParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradedisplayparams.md) |

**Returns:** `Promise`<`BigNumber`>

___
<a id="subscribetomeshevents"></a>

###  subscribeToMeshEvents

▸ **subscribeToMeshEvents**(callback: *`function`*): `Promise`<`void`>

*Defined in [augur-sdk/src/api/ZeroX.ts:146](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L146)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `Promise`<`void`>

___

