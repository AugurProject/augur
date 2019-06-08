[@augurproject/sdk](../README.md) > ["api/Trade"](../modules/_api_trade_.md) > [Trade](../classes/_api_trade_.trade.md)

# Class: Trade

## Hierarchy

**Trade**

## Index

### Constructors

* [constructor](_api_trade_.trade.md#constructor)

### Properties

* [augur](_api_trade_.trade.md#augur)

### Methods

* [checkIfTradeValid](_api_trade_.trade.md#checkiftradevalid)
* [getOnChainTradeParams](_api_trade_.trade.md#getonchaintradeparams)
* [getTradeAmountRemaining](_api_trade_.trade.md#gettradeamountremaining)
* [getTradeTransactionLimits](_api_trade_.trade.md#gettradetransactionlimits)
* [placeOnChainTrade](_api_trade_.trade.md#placeonchaintrade)
* [placeTrade](_api_trade_.trade.md#placetrade)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Trade**(augur: *[Augur](_augur_.augur.md)*): [Trade](_api_trade_.trade.md)

*Defined in [api/Trade.ts:53](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L53)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |

**Returns:** [Trade](_api_trade_.trade.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](_augur_.augur.md)*

*Defined in [api/Trade.ts:53](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L53)*

___

## Methods

<a id="checkiftradevalid"></a>

###  checkIfTradeValid

▸ **checkIfTradeValid**(params: *[PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md)*): `Promise`<`string` \| `null`>

*Defined in [api/Trade.ts:100](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L100)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md) |

**Returns:** `Promise`<`string` \| `null`>

___
<a id="getonchaintradeparams"></a>

###  getOnChainTradeParams

▸ **getOnChainTradeParams**(params: *[PlaceTradeDisplayParams](../interfaces/_api_trade_.placetradedisplayparams.md)*): [PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md)

*Defined in [api/Trade.ts:64](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L64)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](../interfaces/_api_trade_.placetradedisplayparams.md) |

**Returns:** [PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md)

___
<a id="gettradeamountremaining"></a>

### `<Private>` getTradeAmountRemaining

▸ **getTradeAmountRemaining**(events: *`Array`<`Event`>*): `BigNumber`

*Defined in [api/Trade.ts:135](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L135)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| events | `Array`<`Event`> |

**Returns:** `BigNumber`

___
<a id="gettradetransactionlimits"></a>

###  getTradeTransactionLimits

▸ **getTradeTransactionLimits**(params: *[PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md)*): [TradeTransactionLimits](../interfaces/_api_trade_.tradetransactionlimits.md)

*Defined in [api/Trade.ts:119](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L119)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md) |

**Returns:** [TradeTransactionLimits](../interfaces/_api_trade_.tradetransactionlimits.md)

___
<a id="placeonchaintrade"></a>

###  placeOnChainTrade

▸ **placeOnChainTrade**(params: *[PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md)*): `Promise`<`void`>

*Defined in [api/Trade.ts:76](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L76)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeChainParams](../interfaces/_api_trade_.placetradechainparams.md) |

**Returns:** `Promise`<`void`>

___
<a id="placetrade"></a>

###  placeTrade

▸ **placeTrade**(params: *[PlaceTradeDisplayParams](../interfaces/_api_trade_.placetradedisplayparams.md)*): `Promise`<`void`>

*Defined in [api/Trade.ts:59](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/api/Trade.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [PlaceTradeDisplayParams](../interfaces/_api_trade_.placetradedisplayparams.md) |

**Returns:** `Promise`<`void`>

___

