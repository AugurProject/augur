---
id: api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading
title: OnChainTrading
sidebar_label: OnChainTrading
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/OnChainTrading Module]](api-modules-augur-sdk-src-state-getter-onchaintrading-module.md) > [OnChainTrading](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md)

## Class

## Hierarchy

**OnChainTrading**

### Properties

* [GetAllOrdersParams](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getallordersparams)
* [GetBetterWorseOrdersParams](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getbetterworseordersparams)
* [GetOrdersParams](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getordersparams)
* [GetTradingHistoryParams](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#gettradinghistoryparams)

### Methods

* [getAllOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getallorders)
* [getBetterWorseOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getbetterworseorders)
* [getOrders](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#getorders)
* [getTradingHistory](api-classes-augur-sdk-src-state-getter-onchaintrading-onchaintrading.md#gettradinghistory)

---

## Properties

<a id="getallordersparams"></a>

### `<Static>` GetAllOrdersParams

**● GetAllOrdersParams**: *`PartialC`<`object`>* =  t.partial({
    account: t.string,
    filterFinalized: t.boolean,
  })

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:155](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L155)*

___
<a id="getbetterworseordersparams"></a>

### `<Static>` GetBetterWorseOrdersParams

**● GetBetterWorseOrdersParams**: *`TypeC`<`object`>* =  BetterWorseOrdersParams

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:160](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L160)*

___
<a id="getordersparams"></a>

### `<Static>` GetOrdersParams

**● GetOrdersParams**: *`IntersectionC`<[`PartialC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([sortOptions, OrdersParams])

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:159](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L159)*

___
<a id="gettradinghistoryparams"></a>

### `<Static>` GetTradingHistoryParams

**● GetTradingHistoryParams**: *`IntersectionC`<[`PartialC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    sortOptions,
    TradingHistoryParams,
  ])

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:151](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L151)*

___

## Methods

<a id="getallorders"></a>

### `<Static>` getAllOrders

▸ **getAllOrders**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`PartialC`>*): `Promise`<[AllOrders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-allorders.md)>

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:261](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L261)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`PartialC`> |

**Returns:** `Promise`<[AllOrders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-allorders.md)>

___
<a id="getbetterworseorders"></a>

### `<Static>` getBetterWorseOrders

▸ **getBetterWorseOrders**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[BetterWorseResult](api-interfaces-augur-sdk-src-state-getter-onchaintrading-betterworseresult.md)>

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:447](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L447)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[BetterWorseResult](api-interfaces-augur-sdk-src-state-getter-onchaintrading-betterworseresult.md)>

___
<a id="getorders"></a>

### `<Static>` getOrders

▸ **getOrders**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[Orders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-orders.md)>

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:309](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L309)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[Orders](api-interfaces-augur-sdk-src-state-getter-onchaintrading-orders.md)>

___
<a id="gettradinghistory"></a>

### `<Static>` getTradingHistory

▸ **getTradingHistory**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[MarketTradingHistory](api-interfaces-augur-sdk-src-state-getter-onchaintrading-markettradinghistory.md)>

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:163](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L163)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[MarketTradingHistory](api-interfaces-augur-sdk-src-state-getter-onchaintrading-markettradinghistory.md)>

___

