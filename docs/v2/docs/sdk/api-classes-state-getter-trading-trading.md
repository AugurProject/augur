---
id: api-classes-state-getter-trading-trading
title: Trading
sidebar_label: Trading
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Trading Module]](api-modules-state-getter-trading-module.md) > [Trading](api-classes-state-getter-trading-trading.md)

## Class

## Hierarchy

**Trading**

### Properties

* [GetBetterWorseOrdersParams](api-classes-state-getter-trading-trading.md#getbetterworseordersparams)
* [GetOrdersParams](api-classes-state-getter-trading-trading.md#getordersparams)
* [GetTradingHistoryParams](api-classes-state-getter-trading-trading.md#gettradinghistoryparams)

### Methods

* [getBetterWorseOrders](api-classes-state-getter-trading-trading.md#getbetterworseorders)
* [getOrders](api-classes-state-getter-trading-trading.md#getorders)
* [getTradingHistory](api-classes-state-getter-trading-trading.md#gettradinghistory)

---

## Properties

<a id="getbetterworseordersparams"></a>

### `<Static>` GetBetterWorseOrdersParams

**● GetBetterWorseOrdersParams**: *`any`* =  BetterWorseOrdersParams

*Defined in [state/getter/Trading.ts:117](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L117)*

___
<a id="getordersparams"></a>

### `<Static>` GetOrdersParams

**● GetOrdersParams**: *`any`* =  t.intersection([SortLimit, OrdersParams])

*Defined in [state/getter/Trading.ts:116](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L116)*

___
<a id="gettradinghistoryparams"></a>

### `<Static>` GetTradingHistoryParams

**● GetTradingHistoryParams**: *`any`* =  t.intersection([SortLimit, TradingHistoryParams])

*Defined in [state/getter/Trading.ts:115](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L115)*

___

## Methods

<a id="getbetterworseorders"></a>

### `<Static>` getBetterWorseOrders

▸ **getBetterWorseOrders**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[BetterWorseResult](api-interfaces-state-getter-trading-betterworseresult.md)>

*Defined in [state/getter/Trading.ts:277](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L277)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[BetterWorseResult](api-interfaces-state-getter-trading-betterworseresult.md)>

___
<a id="getorders"></a>

### `<Static>` getOrders

▸ **getOrders**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[Orders](api-interfaces-state-getter-trading-orders.md)>

*Defined in [state/getter/Trading.ts:185](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L185)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[Orders](api-interfaces-state-getter-trading-orders.md)>

___
<a id="gettradinghistory"></a>

### `<Static>` getTradingHistory

▸ **getTradingHistory**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<`any`>>

*Defined in [state/getter/Trading.ts:120](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L120)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<`any`>>

___

