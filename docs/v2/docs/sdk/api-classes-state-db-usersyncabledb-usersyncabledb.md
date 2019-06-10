---
id: api-classes-state-db-usersyncabledb-usersyncabledb
title: UserSyncableDB
sidebar_label: UserSyncableDB
---

[@augurproject/sdk](api-readme.md) > [[state/db/UserSyncableDB Module]](api-modules-state-db-usersyncabledb-module.md) > [UserSyncableDB](api-classes-state-db-usersyncabledb-usersyncabledb.md)

## Class

Stores event logs for user-specific events.

## Hierarchy

↳  [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md)

**↳ UserSyncableDB**

### Constructors

* [constructor](api-classes-state-db-usersyncabledb-usersyncabledb.md#constructor)

### Properties

* [additionalTopics](api-classes-state-db-usersyncabledb-usersyncabledb.md#additionaltopics)
* [contractName](api-classes-state-db-usersyncabledb-usersyncabledb.md#contractname)
* [db](api-classes-state-db-usersyncabledb-usersyncabledb.md#db)
* [dbName](api-classes-state-db-usersyncabledb-usersyncabledb.md#dbname)
* [eventName](api-classes-state-db-usersyncabledb-usersyncabledb.md#eventname)
* [networkId](api-classes-state-db-usersyncabledb-usersyncabledb.md#networkid)
* [user](api-classes-state-db-usersyncabledb-usersyncabledb.md#user)

### Methods

* [addNewBlock](api-classes-state-db-usersyncabledb-usersyncabledb.md#addnewblock)
* [allDocs](api-classes-state-db-usersyncabledb-usersyncabledb.md#alldocs)
* [bulkUpsertDocuments](api-classes-state-db-usersyncabledb-usersyncabledb.md#bulkupsertdocuments)
* [createIndex](api-classes-state-db-usersyncabledb-usersyncabledb.md#createindex)
* [find](api-classes-state-db-usersyncabledb-usersyncabledb.md#find)
* [fullTextSearch](api-classes-state-db-usersyncabledb-usersyncabledb.md#fulltextsearch)
* [getDocument](api-classes-state-db-usersyncabledb-usersyncabledb.md#getdocument)
* [getIndexes](api-classes-state-db-usersyncabledb-usersyncabledb.md#getindexes)
* [getInfo](api-classes-state-db-usersyncabledb-usersyncabledb.md#getinfo)
* [getLogs](api-classes-state-db-usersyncabledb-usersyncabledb.md#getlogs)
* [processLog](api-classes-state-db-usersyncabledb-usersyncabledb.md#processlog)
* [rollback](api-classes-state-db-usersyncabledb-usersyncabledb.md#rollback)
* [sync](api-classes-state-db-usersyncabledb-usersyncabledb.md#sync)
* [upsertDocument](api-classes-state-db-usersyncabledb-usersyncabledb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new UserSyncableDB**(dbController: *[DB](api-classes-state-db-db-db.md)*, networkId: *`number`*, eventName: *`string`*, user: *`string`*, numAdditionalTopics: *`number`*, userTopicIndicies: *`Array`<`number`>*, idFields?: *`Array`<`string`>*): [UserSyncableDB](api-classes-state-db-usersyncabledb-usersyncabledb.md)

*Overrides [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[constructor](api-classes-state-db-syncabledb-syncabledb.md#constructor)*

*Defined in [state/db/UserSyncableDB.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L11)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| dbController | [DB](api-classes-state-db-db-db.md) | - |
| networkId | `number` | - |
| eventName | `string` | - |
| user | `string` | - |
| numAdditionalTopics | `number` | - |
| userTopicIndicies | `Array`<`number`> | - |
| `Default value` idFields | `Array`<`string`> |  [] |

**Returns:** [UserSyncableDB](api-classes-state-db-usersyncabledb-usersyncabledb.md)

___

## Properties

<a id="additionaltopics"></a>

### `<Private>` additionalTopics

**● additionalTopics**: *`Array`<`Array`<`string` \| `Array`<`string`>>>*

*Defined in [state/db/UserSyncableDB.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L11)*

___
<a id="contractname"></a>

### `<Protected>` contractName

**● contractName**: *`string`*

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[contractName](api-classes-state-db-syncabledb-syncabledb.md#contractname)*

*Defined in [state/db/SyncableDB.ts:28](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L28)*

___
<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[db](api-classes-state-db-abstractdb-abstractdb.md#db)*

*Defined in [state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[dbName](api-classes-state-db-abstractdb-abstractdb.md#dbname)*

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="eventname"></a>

### `<Protected>` eventName

**● eventName**: *`string`*

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[eventName](api-classes-state-db-syncabledb-syncabledb.md#eventname)*

*Defined in [state/db/SyncableDB.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L27)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[networkId](api-classes-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___
<a id="user"></a>

###  user

**● user**: *`string`*

*Defined in [state/db/UserSyncableDB.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L10)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blocknumber: *`number`*, logs: *`Array`<`ParsedLog`>*): `Promise`<`number`>

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[addNewBlock](api-classes-state-db-syncabledb-syncabledb.md#addnewblock)*

*Defined in [state/db/SyncableDB.ts:137](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L137)*

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

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[allDocs](api-classes-state-db-abstractdb-abstractdb.md#alldocs)*

*Defined in [state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[bulkUpsertDocuments](api-classes-state-db-abstractdb-abstractdb.md#bulkupsertdocuments)*

*Defined in [state/db/AbstractDB.ts:55](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L55)*

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

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[createIndex](api-classes-state-db-syncabledb-syncabledb.md#createindex)*

*Defined in [state/db/SyncableDB.ts:59](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| indexOptions | `CreateIndexOptions` |

**Returns:** `Promise`<`CreateIndexResponse`<`__type`>>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[find](api-classes-state-db-abstractdb-abstractdb.md#find)*

*Defined in [state/db/AbstractDB.ts:84](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>

___
<a id="fulltextsearch"></a>

###  fullTextSearch

▸ **fullTextSearch**(query: *`string`*): `Array`<`object`>

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[fullTextSearch](api-classes-state-db-syncabledb-syncabledb.md#fulltextsearch)*

*Defined in [state/db/SyncableDB.ts:240](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L240)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` |

**Returns:** `Array`<`object`>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[getDocument](api-classes-state-db-abstractdb-abstractdb.md#getdocument)*

*Defined in [state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

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

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[getIndexes](api-classes-state-db-syncabledb-syncabledb.md#getindexes)*

*Defined in [state/db/SyncableDB.ts:63](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L63)*

**Returns:** `Promise`<`GetIndexesResponse`<`__type`>>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getlogs"></a>

### `<Protected>` getLogs

▸ **getLogs**(augur: *[Augur](api-classes-augur-augur.md)*, startBlock: *`number`*, endBlock: *`number`*): `Promise`<`Array`<`ParsedLog`>>

*Overrides [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[getLogs](api-classes-state-db-syncabledb-syncabledb.md#getlogs)*

*Defined in [state/db/UserSyncableDB.ts:26](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/UserSyncableDB.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| startBlock | `number` |
| endBlock | `number` |

**Returns:** `Promise`<`Array`<`ParsedLog`>>

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](api-interfaces-state-logs-types-log.md)*): [BaseDocument](api-interfaces-state-db-abstractdb-basedocument.md)

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[processLog](api-classes-state-db-syncabledb-syncabledb.md#processlog)*

*Defined in [state/db/SyncableDB.ts:222](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L222)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](api-interfaces-state-logs-types-log.md) |

**Returns:** [BaseDocument](api-interfaces-state-db-abstractdb-basedocument.md)

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[rollback](api-classes-state-db-syncabledb-syncabledb.md#rollback)*

*Defined in [state/db/SyncableDB.ts:169](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L169)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](api-classes-augur-augur.md)*, chunkSize: *`number`*, blockStreamDelay: *`number`*, highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Inherited from [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md).[sync](api-classes-state-db-syncabledb-syncabledb.md#sync)*

*Defined in [state/db/SyncableDB.ts:67](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncableDB.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| chunkSize | `number` |
| blockStreamDelay | `number` |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

