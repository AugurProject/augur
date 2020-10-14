[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy"](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md) › [BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)

# Class: BlockAndLogStreamerSyncStrategy

## Hierarchy

* [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md)

  ↳ **BlockAndLogStreamerSyncStrategy**

## Implements

* [BlockAndLogStreamerListenerInterface](../interfaces/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerlistenerinterface.md)
* [SyncStrategy](../interfaces/_augur_sdk_src_state_sync_index_.syncstrategy.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#constructor)

### Properties

* [blockAndLogStreamer](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#private-blockandlogstreamer)
* [blockQueue](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#private-blockqueue)
* [blockWindowWidth](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#private-blockwindowwidth)
* [contractAddresses](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#protected-contractaddresses)
* [currentSuspectBlocks](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#private-currentsuspectblocks)
* [getLogs](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#protected-getlogs)
* [listenForNewBlocks](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#private-listenfornewblocks)
* [onLogsAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#protected-onlogsadded)
* [parseLogs](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#protected-parselogs)

### Methods

* [listenForBlockAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#listenforblockadded)
* [listenForBlockRemoved](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#listenforblockremoved)
* [onBlockAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#onblockadded)
* [onBlockRemoved](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#onblockremoved)
* [onNewBlock](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#onnewblock)
* [processBlockAdded](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#processblockadded)
* [start](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#start)
* [create](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md#static-create)

## Constructors

###  constructor

\+ **new BlockAndLogStreamerSyncStrategy**(`getLogs`: function, `contractAddresses`: string[], `onLogsAdded`: function, `blockAndLogStreamer`: [BlockAndLogStreamerInterface](../interfaces/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md)‹Block, [ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md)›, `listenForNewBlocks`: function, `parseLogs`: function, `blockWindowWidth`: number): *[BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)*

*Overrides [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[constructor](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#constructor)*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:60](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L60)*

**Parameters:**

▪ **getLogs**: *function*

▸ (`filter`: [Filter](../interfaces/_augur_types_types_logs_.filter.md)): *Promise‹[Log](../interfaces/_augur_types_types_logs_.log.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](../interfaces/_augur_types_types_logs_.filter.md) |

▪ **contractAddresses**: *string[]*

▪ **onLogsAdded**: *function*

▸ (`blockNumber`: number, `logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

▪ **blockAndLogStreamer**: *[BlockAndLogStreamerInterface](../interfaces/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md)‹Block, [ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md)›*

▪ **listenForNewBlocks**: *function*

▸ (`callback`: function): *void*

**Parameters:**

▪ **callback**: *function*

▸ (`block`: Block): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

▪ **parseLogs**: *function*

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

▪`Default value`  **blockWindowWidth**: *number*= 5

**Returns:** *[BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)*

## Properties

### `Private` blockAndLogStreamer

• **blockAndLogStreamer**: *[BlockAndLogStreamerInterface](../interfaces/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamerinterface.md)‹Block, [ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md)›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:66](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L66)*

___

### `Private` blockQueue

• **blockQueue**: *AsyncQueue‹[BlockQueueTask](../interfaces/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockqueuetask.md)›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:60](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L60)*

___

### `Private` blockWindowWidth

• **blockWindowWidth**: *number*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:74](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L74)*

___

### `Protected` contractAddresses

• **contractAddresses**: *string[]*

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[contractAddresses](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-contractaddresses)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L11)*

___

### `Private` currentSuspectBlocks

• **currentSuspectBlocks**: *Block[]* = []

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L59)*

___

### `Protected` getLogs

• **getLogs**: *function*

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[getLogs](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-getlogs)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:10](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L10)*

#### Type declaration:

▸ (`filter`: [Filter](../interfaces/_augur_types_types_logs_.filter.md)): *Promise‹[Log](../interfaces/_augur_types_types_logs_.log.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](../interfaces/_augur_types_types_logs_.filter.md) |

___

### `Private` listenForNewBlocks

• **listenForNewBlocks**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:70](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L70)*

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

### `Protected` onLogsAdded

• **onLogsAdded**: *function*

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[onLogsAdded](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-onlogsadded)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L12)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

___

### `Protected` parseLogs

• **parseLogs**: *function*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:73](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L73)*

#### Type declaration:

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

## Methods

###  listenForBlockAdded

▸ **listenForBlockAdded**(`callback`: [BlockCallback](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md#blockcallback)): *void*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:115](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`callback` | [BlockCallback](../modules/_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.md#blockcallback) |

**Returns:** *void*

___

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(`callback`: function): *void*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:122](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L122)*

**Parameters:**

▪ **callback**: *function*

▸ (`blockNumber`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *void*

___

###  onBlockAdded

▸ **onBlockAdded**(`block`: Block): *Promise‹unknown›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:146](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L146)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *Promise‹unknown›*

___

###  onBlockRemoved

▸ **onBlockRemoved**(`block`: Block): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:202](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L202)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *Promise‹void›*

___

###  onNewBlock

▸ **onNewBlock**(`block`: Block): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:140](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *Promise‹void›*

___

###  processBlockAdded

▸ **processBlockAdded**(`block`: Block): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:157](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(`blockNumber`: number): *Promise‹number›*

*Overrides [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[start](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#abstract-start)*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:132](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹number›*

___

### `Static` create

▸ **create**(`provider`: EthersProvider, `contractAddresses`: string[], `logFilterAggregator`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md), `parseLogs`: function): *[BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)‹›*

*Defined in [packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts:86](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/BlockAndLogStreamerSyncStrategy.ts#L86)*

**Parameters:**

▪ **provider**: *EthersProvider*

▪ **contractAddresses**: *string[]*

▪ **logFilterAggregator**: *[LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

▪ **parseLogs**: *function*

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *[BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)‹›*
