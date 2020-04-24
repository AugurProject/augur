[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/AbstractTable"](../modules/_augur_sdk_src_state_db_abstracttable_.md) › [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)

# Class: AbstractTable

## Hierarchy

* **AbstractTable**

  ↳ [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md)

  ↳ [WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)

  ↳ [SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)

  ↳ [ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-constructor)

### Properties

* [dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#dbname)
* [idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)
* [networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)
* [syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)
* [table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)

### Methods

* [allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)
* [bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocuments)
* [clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)
* [find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)
* [getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#getdocumentcount)
* [getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)
* [saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)
* [upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)

## Constructors

### `Protected` constructor

\+ **new AbstractTable**(`networkId`: number, `dbName`: string, `db`: Dexie): *[AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | number |
`dbName` | string |
`db` | Dexie |

**Returns:** *[AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md)*

## Properties

###  dbName

• **dbName**: *string*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L17)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L18)*

___

### `Protected` networkId

• **networkId**: *number*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L19)*

___

###  table

• **table**: *Table‹any, any›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L35)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:94](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

### `Protected` getDocument

▸ **getDocument**<**Document**>(`id`: string): *Promise‹Document | undefined›*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L48)*

**Returns:** *Promise‹number›*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:98](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:81](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*
