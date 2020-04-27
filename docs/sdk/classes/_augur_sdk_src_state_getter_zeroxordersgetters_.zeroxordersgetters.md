[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/ZeroXOrdersGetters"](../modules/_augur_sdk_src_state_getter_zeroxordersgetters_.md) › [ZeroXOrdersGetters](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md)

# Class: ZeroXOrdersGetters

## Hierarchy

* **ZeroXOrdersGetters**

## Index

### Properties

* [GetZeroXOrderParams](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorderparams)
* [GetZeroXOrdersParams](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxordersparams)

### Methods

* [getZeroXOrder](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorder)
* [getZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorders)
* [mapStoredToZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-mapstoredtozeroxorders)
* [storedOrderToZeroXOrder](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-storedordertozeroxorder)

## Properties

### `Static` GetZeroXOrderParams

▪ **GetZeroXOrderParams**: *TypeC‹object›* = ZeroXOrderParams

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L63)*

___

### `Static` GetZeroXOrdersParams

▪ **GetZeroXOrdersParams**: *PartialC‹object›* = ZeroXOrdersParams

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:62](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L62)*

## Methods

### `Static` getZeroXOrder

▸ **getZeroXOrder**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetZeroXOrderParams›): *Promise‹[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)›*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:66](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetZeroXOrderParams› |

**Returns:** *Promise‹[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)›*

___

### `Static` getZeroXOrders

▸ **getZeroXOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetZeroXOrdersParams›): *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:79](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetZeroXOrdersParams› |

**Returns:** *Promise‹[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)›*

___

### `Static` mapStoredToZeroXOrders

▸ **mapStoredToZeroXOrders**(`markets`: Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)›, `storedOrders`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[], `ignoredOrderIds`: string[], `expirationCutoffSeconds`: number): *[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:141](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`markets` | Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)› |
`storedOrders` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[] |
`ignoredOrderIds` | string[] |
`expirationCutoffSeconds` | number |

**Returns:** *[ZeroXOrders](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorders.md)*

___

### `Static` storedOrderToZeroXOrder

▸ **storedOrderToZeroXOrder**(`markets`: Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)›, `storedOrder`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)): *[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:179](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L179)*

**Parameters:**

Name | Type |
------ | ------ |
`markets` | Dictionary‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)› |
`storedOrder` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md) |

**Returns:** *[ZeroXOrder](../interfaces/_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxorder.md)*
