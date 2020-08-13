[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/SyncableDB"](../modules/_augur_sdk_src_state_db_syncabledb_.md) › [SyncableDB](_augur_sdk_src_state_db_syncabledb_.syncabledb.md)

# Class: SyncableDB

Stores event logs for non-user-specific events.

## Hierarchy

  ↳ [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md)

  ↳ **SyncableDB**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-augur)
* [db](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-db)
* [dbName](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#readonly-dbname)
* [eventName](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-eventname)
* [idFields](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-idfields)
* [isStandardRollback](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-isstandardrollback)
* [networkId](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-networkid)
* [rollbackTable](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-rollbacktable)
* [rollingBack](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-rollingback)
* [syncStatus](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-syncstatus)
* [syncing](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-syncing)
* [table](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#table)

### Methods

* [addNewBlock](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#addnewblock)
* [allDocs](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkadddocuments)
* [bulkAddDocumentsInternal](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkadddocumentsinternal)
* [bulkPutDocuments](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkputdocuments)
* [bulkPutDocumentsInternal](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkputdocumentsinternal)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkupsertdocuments)
* [bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-bulkupsertdocumentsinternal)
* [clear](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#clear)
* [clearDB](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#cleardb)
* [clearInternal](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-clearinternal)
* [delete](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#delete)
* [find](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#find)
* [getDocument](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#getdocumentcount)
* [getFullEventName](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#getfulleventname)
* [getIDValue](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-getidvalue)
* [prune](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#prune)
* [rollback](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#rollback)
* [rollupRollback](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#rolluprollback)
* [saveDocuments](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-savedocuments)
* [standardRollback](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#standardrollback)
* [sync](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#sync)
* [upsertDocument](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#protected-upsertdocument)
* [setConcurrency](_augur_sdk_src_state_db_syncabledb_.syncabledb.md#static-setconcurrency)

## Constructors

###  constructor

\+ **new SyncableDB**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `eventName`: string, `dbName`: string, `indexes`: string[]): *[SyncableDB](_augur_sdk_src_state_db_syncabledb_.syncabledb.md)*

*Overrides [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[constructor](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableDB.ts#L15)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) | - |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) | - |
`networkId` | number | - |
`eventName` | string | - |
`dbName` | string | eventName |
`indexes` | string[] | [] |

**Returns:** *[SyncableDB](_augur_sdk_src_state_db_syncabledb_.syncabledb.md)*

## Properties

### `Protected` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[augur](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-augur)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L16)*

___

### `Protected` db

• **db**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[db](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#protected-db)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L21)*

___

### `Readonly` dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#readonly-dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L33)*

___

### `Protected` eventName

• **eventName**: *string*

*Overrides [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[eventName](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#protected-eventname)*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:15](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/SyncableDB.ts#L15)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

___

### `Protected` isStandardRollback

• **isStandardRollback**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[isStandardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-isstandardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L20)*

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L32)*

___

### `Protected` rollbackTable

• **rollbackTable**: *Table‹any, any›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollbacktable)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L21)*

___

### `Protected` rollingBack

• **rollingBack**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollingBack](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollingback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L18)*

___

### `Protected` syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncStatus](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncstatus)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L19)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncing](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncing)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L17)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:31](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L31)*

## Methods

###  addNewBlock

▸ **addNewBlock**(`blocknumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹number›*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[addNewBlock](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#addnewblock)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:47](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`blocknumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹number›*

___

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:131](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkAddDocumentsInternal

▸ **bulkAddDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:149](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:135](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L135)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocumentsInternal

▸ **bulkPutDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[bulkPutDocumentsInternal](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-bulkputdocumentsinternal)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L32)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:139](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L139)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocumentsInternal

▸ **bulkUpsertDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:178](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clear

▸ **clear**(): *Promise‹void›*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[clear](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#clear)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clear](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#clear)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:38](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L38)*

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:78](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L78)*

**Returns:** *Promise‹void›*

___

### `Protected` clearInternal

▸ **clearInternal**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-clearinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:143](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L143)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(): *Promise‹void›*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[delete](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#delete)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[delete](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#delete)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L33)*

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:204](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

### `Protected` getDocument

▸ **getDocument**‹**Document**›(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:115](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L115)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:108](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L108)*

**Returns:** *Promise‹number›*

___

###  getFullEventName

▸ **getFullEventName**(): *string*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[getFullEventName](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#getfulleventname)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:106](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L106)*

**Returns:** *string*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:208](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L208)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

###  prune

▸ **prune**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[prune](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#prune)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:108](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  rollback

▸ **rollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:61](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  rollupRollback

▸ **rollupRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollupRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rolluprollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:79](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[saveDocuments](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#protected-savedocuments)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:43](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  standardRollback

▸ **standardRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[standardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#standardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:73](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  sync

▸ **sync**(`highestAvailableBlockNumber`: number): *Promise‹void›*

*Inherited from [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md).[sync](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md#sync)*

*Defined in [packages/augur-sdk/src/state/db/BaseSyncableDB.ts:102](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/BaseSyncableDB.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber` | number |

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:195](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*

___

### `Static` setConcurrency

▸ **setConcurrency**(`limit`: number): *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[setConcurrency](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#static-setconcurrency)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L37)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`limit` | number | DEFAULT_CONCURRENCY |

**Returns:** *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*
