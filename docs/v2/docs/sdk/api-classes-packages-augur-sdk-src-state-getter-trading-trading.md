---
id: api-classes-packages-augur-sdk-src-state-getter-trading-trading
title: Trading
sidebar_label: Trading
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Trading Module]](api-modules-packages-augur-sdk-src-state-getter-trading-module.md) > [Trading](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md)

## Class

## Hierarchy

**Trading**

### Properties

* [GetAllOrdersParams](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getallordersparams)
* [GetBetterWorseOrdersParams](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getbetterworseordersparams)
* [GetOrdersParams](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getordersparams)
* [GetTradingHistoryParams](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#gettradinghistoryparams)

### Methods

* [getAllOrders](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getallorders)
* [getBetterWorseOrders](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getbetterworseorders)
* [getOrders](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#getorders)
* [getTradingHistory](api-classes-packages-augur-sdk-src-state-getter-trading-trading.md#gettradinghistory)

---

## Properties

<a id="getallordersparams"></a>

### `<Static>` GetAllOrdersParams

**● GetAllOrdersParams**: *`PartialType`<`object`, `object`, `object`, `unknown`>* =  t.partial({
    account: t.string,
    ignoreReportingStates: t.array(t.string),
    makerTaker,
  })

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:153](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L153)*

___
<a id="getbetterworseordersparams"></a>

### `<Static>` GetBetterWorseOrdersParams

**● GetBetterWorseOrdersParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  BetterWorseOrdersParams

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:159](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L159)*

___
<a id="getordersparams"></a>

### `<Static>` GetOrdersParams

**● GetOrdersParams**: *`IntersectionType`<[`PartialType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([SortLimit, OrdersParams])

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:158](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L158)*

___
<a id="gettradinghistoryparams"></a>

### `<Static>` GetTradingHistoryParams

**● GetTradingHistoryParams**: *`IntersectionType`<[`PartialType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    SortLimit,
    TradingHistoryParams,
  ])

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:149](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L149)*

___

## Methods

<a id="getallorders"></a>

### `<Static>` getAllOrders

▸ **getAllOrders**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`PartialType`>*): `Promise`<[AllOrders](api-interfaces-packages-augur-sdk-src-state-getter-trading-allorders.md)>

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:258](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L258)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`PartialType`> |

**Returns:** `Promise`<[AllOrders](api-interfaces-packages-augur-sdk-src-state-getter-trading-allorders.md)>

___
<a id="getbetterworseorders"></a>

### `<Static>` getBetterWorseOrders

▸ **getBetterWorseOrders**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[BetterWorseResult](api-interfaces-packages-augur-sdk-src-state-getter-trading-betterworseresult.md)>

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:505](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L505)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[BetterWorseResult](api-interfaces-packages-augur-sdk-src-state-getter-trading-betterworseresult.md)>

___
<a id="getorders"></a>

### `<Static>` getOrders

▸ **getOrders**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[Orders](api-interfaces-packages-augur-sdk-src-state-getter-trading-orders.md)>

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:330](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L330)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[Orders](api-interfaces-packages-augur-sdk-src-state-getter-trading-orders.md)>

___
<a id="gettradinghistory"></a>

### `<Static>` getTradingHistory

▸ **getTradingHistory**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[MarketTradingHistory](api-interfaces-packages-augur-sdk-src-state-getter-trading-markettradinghistory.md)>

*Defined in [packages/augur-sdk/src/state/getter/Trading.ts:162](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Trading.ts#L162)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[MarketTradingHistory](api-interfaces-packages-augur-sdk-src-state-getter-trading-markettradinghistory.md)>

___

