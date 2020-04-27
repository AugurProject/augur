[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/BulkSyncStrategy"](../modules/_augur_sdk_src_state_sync_bulksyncstrategy_.md) › [BulkSyncStrategy](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md)

# Class: BulkSyncStrategy

## Hierarchy

* [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md)

  ↳ **BulkSyncStrategy**

## Implements

* [SyncStrategy](../interfaces/_augur_sdk_src_state_sync_index_.syncstrategy.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#constructor)

### Properties

* [chunkSize](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#protected-chunksize)
* [contractAddresses](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#protected-contractaddresses)
* [getLogs](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#protected-getlogs)
* [onLogsAdded](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#protected-onlogsadded)
* [parseLogs](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#protected-parselogs)

### Methods

* [start](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md#start)

## Constructors

###  constructor

\+ **new BulkSyncStrategy**(`getLogs`: function, `contractAddresses`: string[], `onLogsAdded`: function, `parseLogs`: function, `chunkSize`: number): *[BulkSyncStrategy](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md)*

*Overrides [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[constructor](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#constructor)*

*Defined in [packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts:8](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts#L8)*

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

▪ **parseLogs**: *function*

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

▪`Default value`  **chunkSize**: *number*= 100000

**Returns:** *[BulkSyncStrategy](_augur_sdk_src_state_sync_bulksyncstrategy_.bulksyncstrategy.md)*

## Properties

### `Protected` chunkSize

• **chunkSize**: *number*

*Defined in [packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts#L14)*

___

### `Protected` contractAddresses

• **contractAddresses**: *string[]*

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[contractAddresses](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-contractaddresses)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L11)*

___

### `Protected` getLogs

• **getLogs**: *function*

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[getLogs](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-getlogs)*

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

*Inherited from [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[onLogsAdded](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#protected-onlogsadded)*

*Defined in [packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/AbstractSyncStrategy.ts#L12)*

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

*Defined in [packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts:13](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts#L13)*

#### Type declaration:

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

## Methods

###  start

▸ **start**(`startBlockNumber`: number, `endBlockNumber`: number): *Promise‹number›*

*Implementation of [SyncStrategy](../interfaces/_augur_sdk_src_state_sync_index_.syncstrategy.md)*

*Overrides [AbstractSyncStrategy](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md).[start](_augur_sdk_src_state_sync_abstractsyncstrategy_.abstractsyncstrategy.md#abstract-start)*

*Defined in [packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/BulkSyncStrategy.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`startBlockNumber` | number |
`endBlockNumber` | number |

**Returns:** *Promise‹number›*
