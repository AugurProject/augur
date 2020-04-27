[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/status"](../modules/_augur_sdk_src_state_getter_status_.md) › [Status](_augur_sdk_src_state_getter_status_.status.md)

# Class: Status

## Hierarchy

* **Status**

## Index

### Properties

* [getSyncDataParams](_augur_sdk_src_state_getter_status_.status.md#static-getsyncdataparams)

### Methods

* [getSyncData](_augur_sdk_src_state_getter_status_.status.md#static-getsyncdata)

## Properties

### `Static` getSyncDataParams

▪ **getSyncDataParams**: *TypeC‹object›* = t.type({})

*Defined in [packages/augur-sdk/src/state/getter/status.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/status.ts#L14)*

## Methods

### `Static` getSyncData

▸ **getSyncData**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getSyncDataParams›): *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*

*Defined in [packages/augur-sdk/src/state/getter/status.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/status.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getSyncDataParams› |

**Returns:** *Promise‹[SyncData](../interfaces/_augur_sdk_src_state_getter_status_.syncdata.md)›*
