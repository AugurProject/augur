[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/ZeroXOrdersGetters"](../modules/_augur_sdk_src_state_getter_zeroxordersgetters_.md) › [ZeroXOrdersGetters](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md)

# Class: ZeroXOrdersGetters

## Hierarchy

* **ZeroXOrdersGetters**

## Index

### Properties

* [GetMarketInvalidBestBidParams](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getmarketinvalidbestbidparams)
* [GetZeroXOrderParams](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorderparams)
* [GetZeroXOrdersParams](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxordersparams)

### Methods

* [getZeroXOrder](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorder)
* [getZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-getzeroxorders)
* [mapStoredToZeroXOrders](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-mapstoredtozeroxorders)
* [storedOrderToZeroXOrder](_augur_sdk_src_state_getter_zeroxordersgetters_.zeroxordersgetters.md#static-storedordertozeroxorder)

## Properties

### `Static` GetMarketInvalidBestBidParams

▪ **GetMarketInvalidBestBidParams**: *TypeC‹object›* = MarketInvalidBestBidParams

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:41](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L41)*

___

### `Static` GetZeroXOrderParams

▪ **GetZeroXOrderParams**: *TypeC‹object›* = ZeroXOrderParams

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L40)*

___

### `Static` GetZeroXOrdersParams

▪ **GetZeroXOrdersParams**: *PartialC‹object›* = ZeroXOrdersParams

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:39](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L39)*

## Methods

### `Static` getZeroXOrder

▸ **getZeroXOrder**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetZeroXOrderParams›): *Promise‹ZeroXOrder›*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:44](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetZeroXOrderParams› |

**Returns:** *Promise‹ZeroXOrder›*

___

### `Static` getZeroXOrders

▸ **getZeroXOrders**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof GetZeroXOrdersParams›): *Promise‹ZeroXOrders›*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof GetZeroXOrdersParams› |

**Returns:** *Promise‹ZeroXOrders›*

___

### `Static` mapStoredToZeroXOrders

▸ **mapStoredToZeroXOrders**(`markets`: Dictionary‹MarketData›, `storedOrders`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[], `ignoredOrderIds`: string[], `expirationCutoffSeconds`: number): *ZeroXOrders*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:127](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`markets` | Dictionary‹MarketData› |
`storedOrders` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)[] |
`ignoredOrderIds` | string[] |
`expirationCutoffSeconds` | number |

**Returns:** *ZeroXOrders*

___

### `Static` storedOrderToZeroXOrder

▸ **storedOrderToZeroXOrder**(`markets`: Dictionary‹MarketData›, `storedOrder`: [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md)): *ZeroXOrder*

*Defined in [packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:182](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L182)*

**Parameters:**

Name | Type |
------ | ------ |
`markets` | Dictionary‹MarketData› |
`storedOrder` | [StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md) |

**Returns:** *ZeroXOrder*
