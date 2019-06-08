[@augurproject/sdk](../README.md) > ["state/db/SyncableDB"](../modules/_state_db_syncabledb_.md) > [SyncableDB](../classes/_state_db_syncabledb_.syncabledb.md)

# Class: SyncableDB

Stores event logs for non-user-specific events.

## Hierarchy

 [AbstractDB](_state_db_abstractdb_.abstractdb.md)

**↳ SyncableDB**

↳  [UserSyncableDB](_state_db_usersyncabledb_.usersyncabledb.md)

## Index

### Constructors

* [constructor](_state_db_syncabledb_.syncabledb.md#constructor)

### Properties

* [contractName](_state_db_syncabledb_.syncabledb.md#contractname)
* [db](_state_db_syncabledb_.syncabledb.md#db)
* [dbName](_state_db_syncabledb_.syncabledb.md#dbname)
* [eventName](_state_db_syncabledb_.syncabledb.md#eventname)
* [flexSearch](_state_db_syncabledb_.syncabledb.md#flexsearch)
* [idFields](_state_db_syncabledb_.syncabledb.md#idfields)
* [networkId](_state_db_syncabledb_.syncabledb.md#networkid)
* [syncStatus](_state_db_syncabledb_.syncabledb.md#syncstatus)

### Methods

* [addNewBlock](_state_db_syncabledb_.syncabledb.md#addnewblock)
* [allDocs](_state_db_syncabledb_.syncabledb.md#alldocs)
* [bulkUpsertDocuments](_state_db_syncabledb_.syncabledb.md#bulkupsertdocuments)
* [createIndex](_state_db_syncabledb_.syncabledb.md#createindex)
* [documentRollback](_state_db_syncabledb_.syncabledb.md#documentrollback)
* [find](_state_db_syncabledb_.syncabledb.md#find)
* [fullTextSearch](_state_db_syncabledb_.syncabledb.md#fulltextsearch)
* [getDocument](_state_db_syncabledb_.syncabledb.md#getdocument)
* [getIndexes](_state_db_syncabledb_.syncabledb.md#getindexes)
* [getInfo](_state_db_syncabledb_.syncabledb.md#getinfo)
* [getLogs](_state_db_syncabledb_.syncabledb.md#getlogs)
* [processLog](_state_db_syncabledb_.syncabledb.md#processlog)
* [revisionRollback](_state_db_syncabledb_.syncabledb.md#revisionrollback)
* [rollback](_state_db_syncabledb_.syncabledb.md#rollback)
* [sync](_state_db_syncabledb_.syncabledb.md#sync)
* [syncFullTextSearch](_state_db_syncabledb_.syncabledb.md#syncfulltextsearch)
* [upsertDocument](_state_db_syncabledb_.syncabledb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncableDB**(db: *[DB](_state_db_db_.db.md)*, networkId: *`number`*, eventName: *`string`*, dbName?: *`string`*, idFields?: *`Array`<`string`>*, fullTextSearchOptions?: *`undefined` \| `object`*): [SyncableDB](_state_db_syncabledb_.syncabledb.md)

*Overrides [AbstractDB](_state_db_abstractdb_.abstractdb.md).[constructor](_state_db_abstractdb_.abstractdb.md#constructor)*

*Defined in [state/db/SyncableDB.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L31)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| db | [DB](_state_db_db_.db.md) | - |
| networkId | `number` | - |
| eventName | `string` | - |
| `Default value` dbName | `string` |  db.getDatabaseName(eventName) |
| `Default value` idFields | `Array`<`string`> |  [] |
| `Optional` fullTextSearchOptions | `undefined` \| `object` | - |

**Returns:** [SyncableDB](_state_db_syncabledb_.syncabledb.md)

___

## Properties

<a id="contractname"></a>

### `<Protected>` contractName

**● contractName**: *`string`*

*Defined in [state/db/SyncableDB.ts:28](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L28)*

___
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
<a id="eventname"></a>

### `<Protected>` eventName

**● eventName**: *`string`*

*Defined in [state/db/SyncableDB.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L27)*

___
<a id="flexsearch"></a>

### `<Private>``<Optional>` flexSearch

**● flexSearch**: *`FlexSearch`*

*Defined in [state/db/SyncableDB.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L31)*

___
<a id="idfields"></a>

### `<Private>` idFields

**● idFields**: *`Array`<`string`>*

*Defined in [state/db/SyncableDB.ts:30](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L30)*

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

*Defined in [state/db/SyncableDB.ts:29](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L29)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blocknumber: *`number`*, logs: *`Array`<`ParsedLog`>*): `Promise`<`number`>

*Defined in [state/db/SyncableDB.ts:137](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L137)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blocknumber | `number` |
| logs | `Array`<`ParsedLog`> |

**Returns:** `Promise`<`number`>

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
<a id="createindex"></a>

###  createIndex

▸ **createIndex**(indexOptions: *`CreateIndexOptions`*): `Promise`<`CreateIndexResponse`<`__type`>>

*Defined in [state/db/SyncableDB.ts:59](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| indexOptions | `CreateIndexOptions` |

**Returns:** `Promise`<`CreateIndexResponse`<`__type`>>

___
<a id="documentrollback"></a>

### `<Private>` documentRollback

▸ **documentRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/SyncableDB.ts:177](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L177)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

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
<a id="fulltextsearch"></a>

###  fullTextSearch

▸ **fullTextSearch**(query: *`string`*): `Array`<`object`>

*Defined in [state/db/SyncableDB.ts:240](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L240)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` |

**Returns:** `Array`<`object`>

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
<a id="getindexes"></a>

###  getIndexes

▸ **getIndexes**(): `Promise`<`GetIndexesResponse`<`__type`>>

*Defined in [state/db/SyncableDB.ts:63](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L63)*

**Returns:** `Promise`<`GetIndexesResponse`<`__type`>>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getInfo](_state_db_abstractdb_.abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getlogs"></a>

### `<Protected>` getLogs

▸ **getLogs**(augur: *[Augur](_augur_.augur.md)*, startBlock: *`number`*, endBlock: *`number`*): `Promise`<`Array`<`ParsedLog`>>

*Defined in [state/db/SyncableDB.ts:218](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L218)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| startBlock | `number` |
| endBlock | `number` |

**Returns:** `Promise`<`Array`<`ParsedLog`>>

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](../interfaces/_state_logs_types_.log.md)*): [BaseDocument](../interfaces/_state_db_abstractdb_.basedocument.md)

*Defined in [state/db/SyncableDB.ts:222](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L222)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](../interfaces/_state_logs_types_.log.md) |

**Returns:** [BaseDocument](../interfaces/_state_db_abstractdb_.basedocument.md)

___
<a id="revisionrollback"></a>

### `<Private>` revisionRollback

▸ **revisionRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/SyncableDB.ts:193](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L193)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/SyncableDB.ts:169](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L169)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](_augur_.augur.md)*, chunkSize: *`number`*, blockStreamDelay: *`number`*, highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/SyncableDB.ts:67](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| chunkSize | `number` |
| blockStreamDelay | `number` |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="syncfulltextsearch"></a>

### `<Private>` syncFullTextSearch

▸ **syncFullTextSearch**(): `Promise`<`void`>

*Defined in [state/db/SyncableDB.ts:81](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L81)*

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

