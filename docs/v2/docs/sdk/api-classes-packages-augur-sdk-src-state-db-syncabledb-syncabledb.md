---
id: api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb
title: SyncableDB
sidebar_label: SyncableDB
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/SyncableDB Module]](api-modules-packages-augur-sdk-src-state-db-syncabledb-module.md) > [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

## Class

Stores event logs for non-user-specific events.

## Hierarchy

 [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

**↳ SyncableDB**

↳  [UserSyncableDB](api-classes-packages-augur-sdk-src-state-db-usersyncabledb-usersyncabledb.md)

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#augur)
* [db](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#dbname)
* [eventName](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#eventname)
* [idFields](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#idfields)
* [networkId](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#networkid)
* [rollingBack](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#rollingback)
* [syncStatus](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#syncstatus)
* [syncing](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#syncing)

### Methods

* [addNewBlock](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#addnewblock)
* [allDocs](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#alldocs)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#bulkupsertunordereddocuments)
* [find](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#find)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#getdocument)
* [getFullEventName](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#getfulleventname)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#getinfo)
* [getLogs](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#getlogs)
* [getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#getpouchrevfromid)
* [parseLogArrays](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#parselogarrays)
* [processLog](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#processlog)
* [rollback](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#rollback)
* [sync](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#sync)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncableDB**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, eventName: *`string`*, dbName?: *`string`*, idFields?: *`string`[]*): [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:22](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L22)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) | - |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) | - |
| networkId | `number` | - |
| eventName | `string` | - |
| `Default value` dbName | `string` |  db.getDatabaseName(eventName) |
| `Default value` idFields | `string`[] |  [] |

**Returns:** [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___

## Properties

<a id="augur"></a>

### `<Protected>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L17)*

___
<a id="db"></a>

###  db

**● db**: *`Database`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[db](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#db)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:24](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L24)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[dbName](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:26](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L26)*

___
<a id="eventname"></a>

### `<Protected>` eventName

**● eventName**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:18](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L18)*

___
<a id="idfields"></a>

### `<Private>` idFields

**● idFields**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:20](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L20)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:25](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L25)*

___
<a id="rollingback"></a>

### `<Private>` rollingBack

**● rollingBack**: *`boolean`*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:22](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L22)*

___
<a id="syncstatus"></a>

### `<Private>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:19](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L19)*

___
<a id="syncing"></a>

### `<Private>` syncing

**● syncing**: *`boolean`*

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:21](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L21)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]*): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:106](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L106)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blocknumber | `number` |
| logs | [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[] |

**Returns:** `Promise`<`number`>

___
<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[allDocs](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:34](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L34)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertordereddocuments"></a>

### `<Protected>` bulkUpsertOrderedDocuments

▸ **bulkUpsertOrderedDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertordereddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:65](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startkey | `string` |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="bulkupsertunordereddocuments"></a>

### `<Protected>` bulkUpsertUnorderedDocuments

▸ **bulkUpsertUnorderedDocuments**(documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertunordereddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:56](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[find](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:98](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L98)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:38](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L38)*

**Type parameters:**

#### Document 
**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`Document` \| `undefined`>

___
<a id="getfulleventname"></a>

###  getFullEventName

▸ **getFullEventName**(): `string`

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:211](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L211)*

**Returns:** `string`

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:94](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L94)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getlogs"></a>

### `<Protected>` getLogs

▸ **getLogs**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, startBlock: *`number`*, endBlock: *`number`*): `Promise`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:190](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L190)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| startBlock | `number` |
| endBlock | `number` |

**Returns:** `Promise`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]>

___
<a id="getpouchrevfromid"></a>

### `<Protected>` getPouchRevFromId

▸ **getPouchRevFromId**(id: *`string`*): `Promise`<`string` \| `undefined`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getpouchrevfromid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:102](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`string` \| `undefined`>

___
<a id="parselogarrays"></a>

### `<Private>` parseLogArrays

▸ **parseLogArrays**(logs: *[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]*): `void`

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:83](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L83)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[] |

**Returns:** `void`

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)*): [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:194](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L194)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md) |

**Returns:** [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:170](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L170)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, chunkSize: *`number`*, blockStreamDelay: *`number`*, highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/SyncableDB.ts:56](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/SyncableDB.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| chunkSize | `number` |
| blockStreamDelay | `number` |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`UpsertResponse`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:49](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/AbstractDB.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`UpsertResponse`>

___

