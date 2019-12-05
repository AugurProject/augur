---
id: api-modules-augur-sdk-src-state-getter-onchaintrading-module
title: augur-sdk/src/state/getter/OnChainTrading Module
sidebar_label: augur-sdk/src/state/getter/OnChainTrading
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/OnChainTrading Module]](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md)

## Module

### Enumerations

* [OrderState](api-enums-augur-sdk-src-state-getter-onchaintrading-orderstate.md)

### Classes

* [OnChainTrading](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md)

### Interfaces

* [AllOrders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-allorders.md)
* [BetterWorseResult](api-interfaces-augur-sdk-src-state-getter-onchaintrading-betterworseresult.md)
* [MarketTrade](api-interfaces-augur-sdk-src-state-getter-onchaintrading-markettrade.md)
* [MarketTradingHistory](api-interfaces-augur-sdk-src-state-getter-onchaintrading-markettradinghistory.md)
* [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md)
* [Orders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-orders.md)

### Variables

* [BetterWorseOrdersParams](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#betterworseordersparams)
* [OrderType](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#ordertype)
* [OrdersParams](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#ordersparams)
* [OutcomeParam](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#outcomeparam)
* [TradingHistoryParams](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#tradinghistoryparams)
* [ZERO](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#zero)
* [makerTaker](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#makertaker)

### Functions

* [getMarkets](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#getmarkets)

### Object literals

* [makerTakerValues](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md#makertakervalues)

---

## Variables

<a id="betterworseordersparams"></a>

### `<Const>` BetterWorseOrdersParams

**● BetterWorseOrdersParams**: *`TypeC`<`object`>* =  t.type({
  marketId: t.string,
  outcome: t.number,
  orderType: OrderType,
  price: t.number,
})

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:138](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L138)*

___
<a id="ordertype"></a>

### `<Const>` OrderType

**● OrderType**: *`KeyofC`<`object`>* =  t.keyof({
  buy: null,
  sell: null,
})

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:133](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L133)*

___
<a id="ordersparams"></a>

### `<Const>` OrdersParams

**● OrdersParams**: *`PartialC`<`object`>* =  t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  filterFinalized: t.boolean,
  makerTaker
})

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:52](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L52)*

___
<a id="outcomeparam"></a>

### `<Const>` OutcomeParam

**● OutcomeParam**: *`KeyofC`<`object`>* =  t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
})

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:33](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L33)*

___
<a id="tradinghistoryparams"></a>

### `<Const>` TradingHistoryParams

**● TradingHistoryParams**: *`PartialC`<`object`>* =  t.partial({
  universe: t.string,
  account: t.string,
  marketIds: t.array(t.string),
  outcome: t.number,
  filterFinalized: t.boolean,
})

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L25)*

___
<a id="zero"></a>

### `<Const>` ZERO

**● ZERO**: *`BigNumber`* =  new BigNumber(0)

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L23)*

___
<a id="makertaker"></a>

### `<Const>` makerTaker

**● makerTaker**: *`KeyofC`<`object`>* =  t.keyof(makerTakerValues)

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L50)*

___

## Functions

<a id="getmarkets"></a>

###  getMarkets

▸ **getMarkets**(marketIds: *`string`[]*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, filterFinalized: *`boolean`*): `Promise`<`Dictionary`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)>>

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:504](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L504)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketIds | `string`[] |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| filterFinalized | `boolean` |

**Returns:** `Promise`<`Dictionary`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)>>

___

## Object literals

<a id="makertakervalues"></a>

### `<Const>` makerTakerValues

**makerTakerValues**: *`object`*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:44](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L44)*

<a id="makertakervalues.either"></a>

####  either

**● either**: *`string`* = "either"

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L45)*

___
<a id="makertakervalues.maker"></a>

####  maker

**● maker**: *`string`* = "maker"

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L46)*

___
<a id="makertakervalues.taker"></a>

####  taker

**● taker**: *`string`* = "taker"

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:47](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L47)*

___

___

