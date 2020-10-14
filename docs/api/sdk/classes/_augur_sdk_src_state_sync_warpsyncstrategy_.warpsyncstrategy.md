[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/WarpSyncStrategy"](../modules/_augur_sdk_src_state_sync_warpsyncstrategy_.md) › [WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)

# Class: WarpSyncStrategy

## Hierarchy

* **WarpSyncStrategy**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#constructor)

### Properties

* [db](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-db)
* [onLogsAdded](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-onlogsadded)
* [provider](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-provider)
* [warpSyncController](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-warpsynccontroller)

### Methods

* [loadCheckpoints](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#loadcheckpoints)
* [pinHashByGatewayUrl](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#pinhashbygatewayurl)
* [processFile](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#processfile)
* [start](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#start)

## Constructors

###  constructor

\+ **new WarpSyncStrategy**(`warpSyncController`: [WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md), `onLogsAdded`: function, `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `provider`: EthersProvider): *[WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L12)*

**Parameters:**

▪ **warpSyncController**: *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

▪ **onLogsAdded**: *function*

▸ (`blockNumber`: number, `logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

▪ **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

▪ **provider**: *EthersProvider*

**Returns:** *[WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)*

## Properties

### `Protected` db

• **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L16)*

___

### `Protected` onLogsAdded

• **onLogsAdded**: *function*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L15)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

___

### `Protected` provider

• **provider**: *EthersProvider*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L17)*

___

### `Protected` warpSyncController

• **warpSyncController**: *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L14)*

## Methods

###  loadCheckpoints

▸ **loadCheckpoints**(`ipfsRootHash`: string, `currentBlock?`: Block): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:42](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsRootHash` | string |
`currentBlock?` | Block |

**Returns:** *Promise‹number | undefined›*

___

###  pinHashByGatewayUrl

▸ **pinHashByGatewayUrl**(`url`: string): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *Promise‹boolean›*

___

###  processFile

▸ **processFile**(`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:82](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *Promise‹number | undefined›*

___

###  start

▸ **start**(`currentBlock`: Block, `ipfsRootHash?`: string): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:24](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`currentBlock` | Block |
`ipfsRootHash?` | string |

**Returns:** *Promise‹number | undefined›*
