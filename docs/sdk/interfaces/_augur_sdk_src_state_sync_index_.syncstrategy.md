[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/index"](../modules/_augur_sdk_src_state_sync_index_.md) › [SyncStrategy](_augur_sdk_src_state_sync_index_.syncstrategy.md)

# Interface: SyncStrategy

## Hierarchy

* **SyncStrategy**

## Implemented by

* [BlockAndLogStreamerSyncStrategy](../classes/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)
* [BulkSyncStrategy](../classes/_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md)

## Index

### Methods

* [start](_augur_sdk_src_state_sync_index_.syncstrategy.md#start)

## Methods

###  start

▸ **start**(`blockNumber`: number, `endBlockNumber?`: number): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/sync/index.ts:4](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`endBlockNumber?` | number |

**Returns:** *Promise‹number›*
