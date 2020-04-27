[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/sync/WarpSyncStrategy"](../modules/_augur_sdk_src_state_sync_warpsyncstrategy_.md) › [WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)

# Class: WarpSyncStrategy

## Hierarchy

* **WarpSyncStrategy**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#constructor)

### Properties

* [onLogsAdded](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-onlogsadded)
* [warpSyncController](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#protected-warpsynccontroller)

### Methods

* [loadCheckpoints](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#loadcheckpoints)
* [pinHashByGatewayUrl](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#pinhashbygatewayurl)
* [processFile](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#processfile)
* [start](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md#start)

## Constructors

###  constructor

\+ **new WarpSyncStrategy**(`warpSyncController`: [WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md), `onLogsAdded`: function): *[WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:9](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L9)*

**Parameters:**

▪ **warpSyncController**: *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

▪ **onLogsAdded**: *function*

▸ (`blockNumber`: number, `logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *[WarpSyncStrategy](_augur_sdk_src_state_sync_warpsyncstrategy_.warpsyncstrategy.md)*

## Properties

### `Protected` onLogsAdded

• **onLogsAdded**: *function*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L12)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

___

### `Protected` warpSyncController

• **warpSyncController**: *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L11)*

## Methods

###  loadCheckpoints

▸ **loadCheckpoints**(`ipfsRootHash`: string, `highestSyncedBlock?`: Block): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:31](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsRootHash` | string |
`highestSyncedBlock?` | Block |

**Returns:** *Promise‹number | undefined›*

___

###  pinHashByGatewayUrl

▸ **pinHashByGatewayUrl**(`url`: string): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *Promise‹boolean›*

___

###  processFile

▸ **processFile**(`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:43](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *Promise‹number | undefined›*

___

###  start

▸ **start**(`ipfsRootHash?`: string, `highestSyncedBlock?`: Block): *Promise‹number | undefined›*

*Defined in [packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/sync/WarpSyncStrategy.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsRootHash?` | string |
`highestSyncedBlock?` | Block |

**Returns:** *Promise‹number | undefined›*
