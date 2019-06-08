[@augurproject/sdk](../README.md) > ["state/db/MetaDB"](../modules/_state_db_metadb_.md) > [MetaDB](../classes/_state_db_metadb_.metadb.md)

# Class: MetaDB

Associates block numbers with event DB sequence IDs. Used for doing syncing/rolling back of derived DBs.

TODO Remove this class if derived DBs are not used.

## Hierarchy

 [AbstractDB](_state_db_abstractdb_.abstractdb.md)

**↳ MetaDB**

## Index

### Constructors

* [constructor](_state_db_metadb_.metadb.md#constructor)

### Properties

* [db](_state_db_metadb_.metadb.md#db)
* [dbName](_state_db_metadb_.metadb.md#dbname)
* [networkId](_state_db_metadb_.metadb.md#networkid)
* [syncStatus](_state_db_metadb_.metadb.md#syncstatus)

### Methods

* [addNewBlock](_state_db_metadb_.metadb.md#addnewblock)
* [allDocs](_state_db_metadb_.metadb.md#alldocs)
* [bulkUpsertDocuments](_state_db_metadb_.metadb.md#bulkupsertdocuments)
* [find](_state_db_metadb_.metadb.md#find)
* [getDocument](_state_db_metadb_.metadb.md#getdocument)
* [getInfo](_state_db_metadb_.metadb.md#getinfo)
* [rollback](_state_db_metadb_.metadb.md#rollback)
* [upsertDocument](_state_db_metadb_.metadb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MetaDB**(dbController: *[DB](_state_db_db_.db.md)*, networkId: *`number`*, dbFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*): [MetaDB](_state_db_metadb_.metadb.md)

*Overrides [AbstractDB](_state_db_abstractdb_.abstractdb.md).[constructor](_state_db_abstractdb_.abstractdb.md#constructor)*

*Defined in [state/db/MetaDB.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/MetaDB.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbController | [DB](_state_db_db_.db.md) |
| networkId | `number` |
| dbFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |

**Returns:** [MetaDB](_state_db_metadb_.metadb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[db](_state_db_abstractdb_.abstractdb.md#db)*

*Defined in [state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[dbName](_state_db_abstractdb_.abstractdb.md#dbname)*

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[networkId](_state_db_abstractdb_.abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___
<a id="syncstatus"></a>

### `<Private>` syncStatus

**● syncStatus**: *[SyncStatus](_state_db_syncstatus_.syncstatus.md)*

*Defined in [state/db/MetaDB.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/MetaDB.ts#L16)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blockNumber: *`number`*, sequenceIds: *[SequenceIds](../interfaces/_state_db_metadb_.sequenceids.md)*): `Promise`<`void`>

*Defined in [state/db/MetaDB.ts:28](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/MetaDB.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| sequenceIds | [SequenceIds](../interfaces/_state_db_metadb_.sequenceids.md) |

**Returns:** `Promise`<`void`>

___
<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[allDocs](_state_db_abstractdb_.abstractdb.md#alldocs)*

*Defined in [state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[bulkUpsertDocuments](_state_db_abstractdb_.abstractdb.md#bulkupsertdocuments)*

*Defined in [state/db/AbstractDB.ts:55](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L55)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startkey | `string` |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[find](_state_db_abstractdb_.abstractdb.md#find)*

*Defined in [state/db/AbstractDB.ts:84](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getDocument](_state_db_abstractdb_.abstractdb.md#getdocument)*

*Defined in [state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

**Type parameters:**

#### Document 
**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`Document` \| `undefined`>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getInfo](_state_db_abstractdb_.abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/MetaDB.ts:39](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/MetaDB.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[upsertDocument](_state_db_abstractdb_.abstractdb.md#upsertdocument)*

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

