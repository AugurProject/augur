[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/SyncStatus"](../modules/_augur_sdk_src_state_db_syncstatus_.md) › [SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)

# Class: SyncStatus

## Hierarchy

* [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)

  ↳ **SyncStatus**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#constructor)

### Properties

* [dbName](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#dbname)
* [defaultStartSyncBlockNumber](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#defaultstartsyncblocknumber)
* [idFields](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-networkid)
* [syncing](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-syncing)
* [table](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#table)

### Methods

* [allDocs](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-bulkadddocuments)
* [bulkPutDocuments](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-bulkputdocuments)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-bulkupsertdocuments)
* [clearDB](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#cleardb)
* [find](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#find)
* [getDocument](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#getdocumentcount)
* [getHighestSyncBlock](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#gethighestsyncblock)
* [getIDValue](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-getidvalue)
* [getLowestSyncingBlockForAllDBs](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#getlowestsyncingblockforalldbs)
* [saveDocuments](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-savedocuments)
* [setHighestSyncBlock](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#sethighestsyncblock)
* [updateSyncingToFalse](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#updatesyncingtofalse)
* [upsertDocument](_augur_sdk_src_state_db_syncstatus_.syncstatus.md#protected-upsertdocument)

## Constructors

###  constructor

\+ **new SyncStatus**(`networkId`: number, `defaultStartSyncBlockNumber`: number, `db`: [DB](_augur_sdk_src_state_db_db_.db.md)): *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | number |
`defaultStartSyncBlockNumber` | number |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |

**Returns:** *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

## Properties

###  dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L17)*

___

###  defaultStartSyncBlockNumber

• **defaultStartSyncBlockNumber**: *number*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

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

###  getHighestSyncBlock

▸ **getHighestSyncBlock**(`dbName`: string): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | string |

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

###  getLowestSyncingBlockForAllDBs

▸ **getLowestSyncingBlockForAllDBs**(): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:32](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L32)*

**Returns:** *Promise‹number›*

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

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(`eventName`: string, `blockNumber`: number, `syncing`: boolean): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |
`blockNumber` | number |
`syncing` | boolean |

**Returns:** *Promise‹void›*

___

###  updateSyncingToFalse

▸ **updateSyncingToFalse**(`dbName`: string): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:42](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/SyncStatus.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | string |

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
