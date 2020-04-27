[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy"](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md) › [BlockAndLogStreamerListenerInterface](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerinterface.md)

# Interface: BlockAndLogStreamerListenerInterface

## Hierarchy

* **BlockAndLogStreamerListenerInterface**

## Implemented by

* [BlockAndLogStreamerSyncStrategy](../classes/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)

## Index

### Methods

* [listenForBlockAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerinterface.md#listenforblockadded)
* [listenForBlockRemoved](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerinterface.md#listenforblockremoved)

## Methods

###  listenForBlockAdded

▸ **listenForBlockAdded**(`callback`: function): *void*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:49](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L49)*

**Parameters:**

▪ **callback**: *function*

▸ (`block`: Block): *void*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *void*

___

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(`callback`: function): *void*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L48)*

**Parameters:**

▪ **callback**: *function*

▸ (`blockNumber`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *void*
