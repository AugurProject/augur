[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/warp/WarpController"](../modules/_augur_sdk_src_warp_warpcontroller_.md) › [WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)

# Class: WarpController

## Hierarchy

* **WarpController**

## Index

### Constructors

* [constructor](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#constructor)

### Properties

* [_fileRetrievalFn](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-_fileretrievalfn)
* [augur](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-augur)
* [checkpointCreationInProgress](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-checkpointcreationinprogress)
* [checkpoints](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#checkpoints)
* [db](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-db)
* [ipfs](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-ipfs)
* [provider](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-provider)
* [uploadBlockNumber](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#private-uploadblocknumber)

### Methods

* [createCheckpoint](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#createcheckpoint)
* [createInitialCheckpoint](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#createinitialcheckpoint)
* [destroyAndRecreateDB](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#destroyandrecreatedb)
* [getCheckpointFile](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#getcheckpointfile)
* [getFile](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#getfile)
* [getIpfs](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#getipfs)
* [getMostRecentCheckpoint](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#getmostrecentcheckpoint)
* [getMostRecentWarpSync](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#getmostrecentwarpsync)
* [hasMostRecentCheckpoint](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#hasmostrecentcheckpoint)
* [onNewBlock](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#onnewblock)
* [pinHashByGatewayUrl](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#pinhashbygatewayurl)

### Object literals

* [DEFAULT_NODE_TYPE](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md#static-private-default_node_type)

## Constructors

###  constructor

\+ **new WarpController**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›, `provider`: [Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md), `uploadBlockNumber`: number, `ipfs?`: Promise‹IPFS›, `_fileRetrievalFn`: function): *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:101](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L101)*

**Parameters:**

▪ **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

▪ **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

▪ **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

▪ **uploadBlockNumber**: *number*

▪`Optional`  **ipfs**: *Promise‹IPFS›*

▪`Default value`  **_fileRetrievalFn**: *function*= (
      ipfsPath: string
    ) => fetch(`https://cloudflare-ipfs.com/ipfs/${ipfsPath}`).then(item =>
        item.json()
      )

▸ (`ipfsPath`: string): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsPath` | string |

**Returns:** *[WarpController](_augur_sdk_src_warp_warpcontroller_.warpcontroller.md)*

## Properties

### `Private` _fileRetrievalFn

• **_fileRetrievalFn**: *function*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:110](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L110)*

#### Type declaration:

▸ (`ipfsPath`: string): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsPath` | string |

___

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)‹[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:105](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L105)*

___

### `Private` checkpointCreationInProgress

• **checkpointCreationInProgress**: *boolean* = false

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:98](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L98)*

___

###  checkpoints

• **checkpoints**: *[Checkpoints](_augur_sdk_src_warp_checkpoints_.checkpoints.md)*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:100](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L100)*

___

### `Private` db

• **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:104](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L104)*

___

### `Private` ipfs

• **ipfs**: *Promise‹IPFS›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:101](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L101)*

___

### `Private` provider

• **provider**: *[Provider](../interfaces/_augur_sdk_src_ethereum_provider_.provider.md)*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:106](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L106)*

___

### `Private` uploadBlockNumber

• **uploadBlockNumber**: *number*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:107](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L107)*

## Methods

###  createCheckpoint

▸ **createCheckpoint**(`endBlock`: Block): *Promise‹[IpfsInfo](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.ipfsinfo.md)›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:242](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`endBlock` | Block |

**Returns:** *Promise‹[IpfsInfo](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.ipfsinfo.md)›*

___

###  createInitialCheckpoint

▸ **createInitialCheckpoint**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:216](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L216)*

**Returns:** *Promise‹void›*

___

###  destroyAndRecreateDB

▸ **destroyAndRecreateDB**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:237](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L237)*

**Returns:** *Promise‹void›*

___

###  getCheckpointFile

▸ **getCheckpointFile**(`ipfsRootHash`: string): *Promise‹[CheckpointInterface](../interfaces/_augur_sdk_src_warp_warpcontroller_.checkpointinterface.md)›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:306](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L306)*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsRootHash` | string |

**Returns:** *Promise‹[CheckpointInterface](../interfaces/_augur_sdk_src_warp_warpcontroller_.checkpointinterface.md)›*

___

###  getFile

▸ **getFile**(`ipfsPath`: string): *Promise‹any›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:300](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L300)*

**Parameters:**

Name | Type |
------ | ------ |
`ipfsPath` | string |

**Returns:** *Promise‹any›*

___

###  getIpfs

▸ **getIpfs**(): *Promise‹IPFS›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:126](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L126)*

**Returns:** *Promise‹IPFS›*

___

###  getMostRecentCheckpoint

▸ **getMostRecentCheckpoint**(): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:327](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L327)*

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

___

###  getMostRecentWarpSync

▸ **getMostRecentWarpSync**(): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:323](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L323)*

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md)›*

___

###  hasMostRecentCheckpoint

▸ **hasMostRecentCheckpoint**(): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:331](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L331)*

**Returns:** *Promise‹boolean›*

___

###  onNewBlock

▸ **onNewBlock**(`newBlock`: Block): *Promise‹string | void›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:130](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`newBlock` | Block |

**Returns:** *Promise‹string | void›*

___

###  pinHashByGatewayUrl

▸ **pinHashByGatewayUrl**(`urlString`: string): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:312](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L312)*

**Parameters:**

Name | Type |
------ | ------ |
`urlString` | string |

**Returns:** *Promise‹boolean›*

## Object literals

### `Static` `Private` DEFAULT_NODE_TYPE

### ▪ **DEFAULT_NODE_TYPE**: *object*

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:99](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L99)*

###  format

• **format**: *string* = "dag-pb"

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:99](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L99)*

###  hashAlg

• **hashAlg**: *string* = "sha2-256"

*Defined in [packages/augur-sdk/src/warp/WarpController.ts:99](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/warp/WarpController.ts#L99)*
