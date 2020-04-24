[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/AbstractSyncStrategy"](../modules/_augur_sdk_src_state_sync_abstractsyncstrategy_.md) › [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md)

# Class: AbstractSyncStrategy

## Hierarchy

* **AbstractSyncStrategy**

  ↳ [BlockAndLogStreamerSyncStrategy](_augur_sdk_src_state_sync_blockandlogstreamersyncstrategy_.blockandlogstreamersyncstrategy.md)

  ↳ [BulkSyncStrategy](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#constructor)

### Properties

* [contractAddresses](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-contractaddresses)
* [getLogs](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-getlogs)
* [onLogsAdded](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-onlogsadded)

### Methods

* [start](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#abstract-start)

## Constructors

###  constructor

\+ **new AbstractSyncStrategy**(`getLogs`: function, `contractAddresses`: string[], `onLogsAdded`: function): *[AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L8)*

**Parameters:**

▪ **getLogs**: *function*

▸ (`filter`: [Filter](../interfaces/_augur_types_types_logs_.filter.md)): *Promise‹[Log](../interfaces/_augur_types_types_logs_.log.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](../interfaces/_augur_types_types_logs_.filter.md) |

▪ **contractAddresses**: *string[]*

▪ **onLogsAdded**: *function*

▸ (`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *[AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md)*

## Properties

### `Protected` contractAddresses

• **contractAddresses**: *string[]*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L11)*

___

### `Protected` getLogs

• **getLogs**: *function*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L10)*

#### Type declaration:

▸ (`filter`: [Filter](../interfaces/_augur_types_types_logs_.filter.md)): *Promise‹[Log](../interfaces/_augur_types_types_logs_.log.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](../interfaces/_augur_types_types_logs_.filter.md) |

___

### `Protected` onLogsAdded

• **onLogsAdded**: *function*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L12)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

## Methods

### `Abstract` start

▸ **start**(`blockNumber`: number, `endBlockNumber?`: number): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`endBlockNumber?` | number |

**Returns:** *Promise‹number›*
