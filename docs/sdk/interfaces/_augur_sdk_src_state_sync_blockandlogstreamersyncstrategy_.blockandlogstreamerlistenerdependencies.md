[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy"](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md) › [BlockAndLogStreamerListenerDependencies](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerdependencies.md)

# Interface: BlockAndLogStreamerListenerDependencies

## Hierarchy

* **BlockAndLogStreamerListenerDependencies**

## Index

### Properties

* [blockAndLogStreamer](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerdependencies.md#blockandlogstreamer)
* [getLogs](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerdependencies.md#getlogs)
* [listenForNewBlocks](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerdependencies.md#listenfornewblocks)
* [onLogsAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerdependencies.md#onlogsadded)

## Properties

###  blockAndLogStreamer

• **blockAndLogStreamer**: *[BlockAndLogStreamerInterface](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md)‹Block, ExtendedLog›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:40](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L40)*

___

###  getLogs

• **getLogs**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:39](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L39)*

#### Type declaration:

▸ (`filter`: [Filter](_augur_types_types_logs_.filter.md)): *Promise‹[Log](_augur_types_types_logs_.log.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](_augur_types_types_logs_.filter.md) |

___

###  listenForNewBlocks

• **listenForNewBlocks**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L41)*

#### Type declaration:

▸ (`callback`: function): *void*

**Parameters:**

▪ **callback**: *function*

▸ (`block`: Block): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

___

###  onLogsAdded

• **onLogsAdded**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:42](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L42)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [Log](_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](_augur_types_types_logs_.log.md)[] |
