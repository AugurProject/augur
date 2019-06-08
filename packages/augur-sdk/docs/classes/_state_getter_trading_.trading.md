[@augurproject/sdk](../README.md) > ["state/getter/Trading"](../modules/_state_getter_trading_.md) > [Trading](../classes/_state_getter_trading_.trading.md)

# Class: Trading

## Hierarchy

**Trading**

## Index

### Properties

* [GetBetterWorseOrdersParams](_state_getter_trading_.trading.md#getbetterworseordersparams)
* [GetOrdersParams](_state_getter_trading_.trading.md#getordersparams)
* [GetTradingHistoryParams](_state_getter_trading_.trading.md#gettradinghistoryparams)

### Methods

* [getBetterWorseOrders](_state_getter_trading_.trading.md#getbetterworseorders)
* [getOrders](_state_getter_trading_.trading.md#getorders)
* [getTradingHistory](_state_getter_trading_.trading.md#gettradinghistory)

---

## Properties

<a id="getbetterworseordersparams"></a>

### `<Static>` GetBetterWorseOrdersParams

**● GetBetterWorseOrdersParams**: *`any`* =  BetterWorseOrdersParams

*Defined in [state/getter/Trading.ts:117](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L117)*

___
<a id="getordersparams"></a>

### `<Static>` GetOrdersParams

**● GetOrdersParams**: *`any`* =  t.intersection([SortLimit, OrdersParams])

*Defined in [state/getter/Trading.ts:116](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L116)*

___
<a id="gettradinghistoryparams"></a>

### `<Static>` GetTradingHistoryParams

**● GetTradingHistoryParams**: *`any`* =  t.intersection([SortLimit, TradingHistoryParams])

*Defined in [state/getter/Trading.ts:115](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L115)*

___

## Methods

<a id="getbetterworseorders"></a>

### `<Static>` getBetterWorseOrders

▸ **getBetterWorseOrders**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[BetterWorseResult](../interfaces/_state_getter_trading_.betterworseresult.md)>

*Defined in [state/getter/Trading.ts:277](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L277)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[BetterWorseResult](../interfaces/_state_getter_trading_.betterworseresult.md)>

___
<a id="getorders"></a>

### `<Static>` getOrders

▸ **getOrders**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[Orders](../interfaces/_state_getter_trading_.orders.md)>

*Defined in [state/getter/Trading.ts:185](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L185)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[Orders](../interfaces/_state_getter_trading_.orders.md)>

___
<a id="gettradinghistory"></a>

### `<Static>` getTradingHistory

▸ **getTradingHistory**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<`Array`<`any`>>

*Defined in [state/getter/Trading.ts:120](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Trading.ts#L120)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<`Array`<`any`>>

___

