[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy"](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md) › [BlockAndLogStreamerInterface](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md)

# Interface: BlockAndLogStreamerInterface <**TBlock, TLog**>

## Type parameters

▪ **TBlock**: *Block*

▪ **TLog**: *BlockStreamLog*

## Hierarchy

* **BlockAndLogStreamerInterface**

## Index

### Properties

* [reconcileNewBlock](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md#reconcilenewblock)
* [subscribeToOnBlockAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md#subscribetoonblockadded)
* [subscribeToOnBlockRemoved](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md#subscribetoonblockremoved)

## Properties

###  reconcileNewBlock

• **reconcileNewBlock**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:31](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L31)*

#### Type declaration:

▸ (`block`: TBlock): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | TBlock |

___

###  subscribeToOnBlockAdded

• **subscribeToOnBlockAdded**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:32](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L32)*

#### Type declaration:

▸ (`onBlockAdded`: function): *string*

**Parameters:**

▪ **onBlockAdded**: *function*

▸ (`block`: TBlock): *void*

**Parameters:**

Name | Type |
------ | ------ |
`block` | TBlock |

___

###  subscribeToOnBlockRemoved

• **subscribeToOnBlockRemoved**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:33](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L33)*

#### Type declaration:

▸ (`onBlockRemoved`: function): *string*

**Parameters:**

▪ **onBlockRemoved**: *function*

▸ (`block`: TBlock): *void*

**Parameters:**

Name | Type |
------ | ------ |
`block` | TBlock |
