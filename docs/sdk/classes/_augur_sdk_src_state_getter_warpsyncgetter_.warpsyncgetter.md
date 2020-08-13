[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/WarpSyncGetter"](../modules/_augur_sdk_src_state_getter_warpsyncgetter_.md) › [WarpSyncGetter](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md)

# Class: WarpSyncGetter

## Hierarchy

* **WarpSyncGetter**

## Index

### Properties

* [getMostRecentWarpSyncParams](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getmostrecentwarpsyncparams)
* [getWarpSyncStatusParams](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getwarpsyncstatusparams)

### Methods

* [getMostRecentWarpSync](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getmostrecentwarpsync)
* [getWarpSyncStatus](_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncgetter.md#static-getwarpsyncstatus)

## Properties

### `Static` getMostRecentWarpSyncParams

▪ **getMostRecentWarpSyncParams**: *UndefinedC‹›* = t.undefined

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L17)*

___

### `Static` getWarpSyncStatusParams

▪ **getWarpSyncStatusParams**: *UndefinedC‹›* = t.undefined

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L18)*

## Methods

### `Static` getMostRecentWarpSync

▸ **getMostRecentWarpSync**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getMostRecentWarpSyncParams›): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getMostRecentWarpSyncParams› |

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

___

### `Static` getWarpSyncStatus

▸ **getWarpSyncStatus**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getWarpSyncStatusParams›): *Promise‹[WarpSyncStatusResponse](../interfaces/_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncstatusresponse.md)›*

*Defined in [packages/augur-sdk/src/state/getter/WarpSyncGetter.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/WarpSyncGetter.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getWarpSyncStatusParams› |

**Returns:** *Promise‹[WarpSyncStatusResponse](../interfaces/_augur_sdk_src_state_getter_warpsyncgetter_.warpsyncstatusresponse.md)›*
