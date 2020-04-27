[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/WarpSyncGetter"](../modules/_augur_sdk_src_state_getter_warpsyncgetter_.md) › [WarpSyncGetter](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md)

# Class: WarpSyncGetter

## Hierarchy

* **WarpSyncGetter**

## Index

### Properties

* [getMostRecentWarpSyncParams](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getmostrecentwarpsyncparams)

### Methods

* [getMostRecentWarpSync](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getmostrecentwarpsync)

## Properties

### `Static` getMostRecentWarpSyncParams

▪ **getMostRecentWarpSyncParams**: *UndefinedC‹›* = t.undefined

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L8)*

## Methods

### `Static` getMostRecentWarpSync

▸ **getMostRecentWarpSync**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMostRecentWarpSyncParams›): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMostRecentWarpSyncParams› |

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*
