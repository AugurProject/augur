[@augurproject/sdk](../README.md) > ["state/db/UserSyncableDB"](../modules/_state_db_usersyncabledb_.md) > [UserSyncableDB](../classes/_state_db_usersyncabledb_.usersyncabledb.md)

# Class: UserSyncableDB

Stores event logs for user-specific events.

## Hierarchy

↳  [SyncableDB](_state_db_syncabledb_.syncabledb.md)

**↳ UserSyncableDB**

## Index

### Constructors

* [constructor](_state_db_usersyncabledb_.usersyncabledb.md#constructor)

### Properties

* [additionalTopics](_state_db_usersyncabledb_.usersyncabledb.md#additionaltopics)
* [contractName](_state_db_usersyncabledb_.usersyncabledb.md#contractname)
* [db](_state_db_usersyncabledb_.usersyncabledb.md#db)
* [dbName](_state_db_usersyncabledb_.usersyncabledb.md#dbname)
* [eventName](_state_db_usersyncabledb_.usersyncabledb.md#eventname)
* [networkId](_state_db_usersyncabledb_.usersyncabledb.md#networkid)
* [user](_state_db_usersyncabledb_.usersyncabledb.md#user)

### Methods

* [addNewBlock](_state_db_usersyncabledb_.usersyncabledb.md#addnewblock)
* [allDocs](_state_db_usersyncabledb_.usersyncabledb.md#alldocs)
* [bulkUpsertDocuments](_state_db_usersyncabledb_.usersyncabledb.md#bulkupsertdocuments)
* [createIndex](_state_db_usersyncabledb_.usersyncabledb.md#createindex)
* [find](_state_db_usersyncabledb_.usersyncabledb.md#find)
* [fullTextSearch](_state_db_usersyncabledb_.usersyncabledb.md#fulltextsearch)
* [getDocument](_state_db_usersyncabledb_.usersyncabledb.md#getdocument)
* [getIndexes](_state_db_usersyncabledb_.usersyncabledb.md#getindexes)
* [getInfo](_state_db_usersyncabledb_.usersyncabledb.md#getinfo)
* [getLogs](_state_db_usersyncabledb_.usersyncabledb.md#getlogs)
* [processLog](_state_db_usersyncabledb_.usersyncabledb.md#processlog)
* [rollback](_state_db_usersyncabledb_.usersyncabledb.md#rollback)
* [sync](_state_db_usersyncabledb_.usersyncabledb.md#sync)
* [upsertDocument](_state_db_usersyncabledb_.usersyncabledb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new UserSyncableDB**(dbController: *[DB](_state_db_db_.db.md)*, networkId: *`number`*, eventName: *`string`*, user: *`string`*, numAdditionalTopics: *`number`*, userTopicIndicies: *`Array`<`number`>*, idFields?: *`Array`<`string`>*): [UserSyncableDB](_state_db_usersyncabledb_.usersyncabledb.md)

*Overrides [SyncableDB](_state_db_syncabledb_.syncabledb.md).[constructor](_state_db_syncabledb_.syncabledb.md#constructor)*

*Defined in [state/db/UserSyncableDB.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L11)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| dbController | [DB](_state_db_db_.db.md) | - |
| networkId | `number` | - |
| eventName | `string` | - |
| user | `string` | - |
| numAdditionalTopics | `number` | - |
| userTopicIndicies | `Array`<`number`> | - |
| `Default value` idFields | `Array`<`string`> |  [] |

**Returns:** [UserSyncableDB](_state_db_usersyncabledb_.usersyncabledb.md)

___

## Properties

<a id="additionaltopics"></a>

### `<Private>` additionalTopics

**● additionalTopics**: *`Array`<`Array`<`string` \| `Array`<`string`>>>*

*Defined in [state/db/UserSyncableDB.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L11)*

___
<a id="contractname"></a>

### `<Protected>` contractName

**● contractName**: *`string`*

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[contractName](_state_db_syncabledb_.syncabledb.md#contractname)*

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[eventName](_state_db_syncabledb_.syncabledb.md#eventname)*

*Defined in [state/db/SyncableDB.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L27)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[networkId](_state_db_abstractdb_.abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___
<a id="user"></a>

###  user

**● user**: *`string`*

*Defined in [state/db/UserSyncableDB.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L10)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blocknumber: *`number`*, logs: *`Array`<`ParsedLog`>*): `Promise`<`number`>

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[addNewBlock](_state_db_syncabledb_.syncabledb.md#addnewblock)*

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[createIndex](_state_db_syncabledb_.syncabledb.md#createindex)*

*Defined in [state/db/SyncableDB.ts:59](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| indexOptions | `CreateIndexOptions` |

**Returns:** `Promise`<`CreateIndexResponse`<`__type`>>

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[fullTextSearch](_state_db_syncabledb_.syncabledb.md#fulltextsearch)*

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[getIndexes](_state_db_syncabledb_.syncabledb.md#getindexes)*

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

*Overrides [SyncableDB](_state_db_syncabledb_.syncabledb.md).[getLogs](_state_db_syncabledb_.syncabledb.md#getlogs)*

*Defined in [state/db/UserSyncableDB.ts:26](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L26)*

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[processLog](_state_db_syncabledb_.syncabledb.md#processlog)*

*Defined in [state/db/SyncableDB.ts:222](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncableDB.ts#L222)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](../interfaces/_state_logs_types_.log.md) |

**Returns:** [BaseDocument](../interfaces/_state_db_abstractdb_.basedocument.md)

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[rollback](_state_db_syncabledb_.syncabledb.md#rollback)*

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

*Inherited from [SyncableDB](_state_db_syncabledb_.syncabledb.md).[sync](_state_db_syncabledb_.syncabledb.md#sync)*

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

