[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/WarpSyncCheckpointsDB"](../modules/_augur_sdk_src_state_db_warpsynccheckpointsdb_.md) › [WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)

# Class: WarpSyncCheckpointsDB

## Hierarchy

* [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)

  ↳ **WarpSyncCheckpointsDB**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#constructor)

### Properties

* [dbName](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#dbname)
* [idFields](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-networkid)
* [syncing](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-syncing)
* [table](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#table)

### Methods

* [allDocs](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-bulkadddocuments)
* [bulkPutDocuments](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-bulkputdocuments)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-bulkupsertdocuments)
* [clearDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#cleardb)
* [createCheckpoint](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#createcheckpoint)
* [createInitialCheckpoint](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#createinitialcheckpoint)
* [find](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#find)
* [getDocument](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#getdocumentcount)
* [getIDValue](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-getidvalue)
* [getMostRecentCheckpoint](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#getmostrecentcheckpoint)
* [getMostRecentWarpSync](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#getmostrecentwarpsync)
* [saveDocuments](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-savedocuments)
* [upsertDocument](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md#protected-upsertdocument)

## Constructors

###  constructor

\+ **new WarpSyncCheckpointsDB**(`networkId`: number, `db`: [DB](_augur_sdk_src_state_db_db_.db.md)): *[WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)*

*Defined in [packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | number |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *[WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)*

## Properties

###  dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L17)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L18)*

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L19)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L35)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** *Promise‹void›*

___

###  createCheckpoint

▸ **createCheckpoint**(`end`: Block, `hash`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts:43](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`end` | Block |
`hash` | string |

**Returns:** *Promise‹void›*

___

###  createInitialCheckpoint

▸ **createInitialCheckpoint**(`initialBlock`: Block, `market`: Market): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`initialBlock` | Block |
`market` | Market |

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:94](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

### `Protected` getDocument

▸ **getDocument**<**Document**>(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L52)*

**Type parameters:**

▪ **Document**

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹Document | undefined›*

___

###  getDocumentCount

▸ **getDocumentCount**(): *Promise‹number›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocumentCount](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#getdocumentcount)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L48)*

**Returns:** *Promise‹number›*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:98](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

###  getMostRecentCheckpoint

▸ **getMostRecentCheckpoint**(): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md) | undefined›*

*Defined in [packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts#L27)*

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md) | undefined›*

___

###  getMostRecentWarpSync

▸ **getMostRecentWarpSync**(): *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md) | undefined›*

*Defined in [packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts:31](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/WarpSyncCheckpointsDB.ts#L31)*

**Returns:** *Promise‹[WarpCheckpointDocument](../interfaces/_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpcheckpointdocument.md) | undefined›*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:81](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*
