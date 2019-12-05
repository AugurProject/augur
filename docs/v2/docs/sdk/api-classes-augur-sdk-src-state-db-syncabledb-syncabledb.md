---
id: api-classes-augur-sdk-src-state-db-syncabledb-syncabledb
title: SyncableDB
sidebar_label: SyncableDB
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/SyncableDB Module]](api-modules-augur-sdk-src-state-db-syncabledb-module.md) > [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

## Class

Stores event logs for non-user-specific events.

## Hierarchy

↳  [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md)

**↳ SyncableDB**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#augur)
* [dbName](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#dbname)
* [eventName](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#eventname)
* [idFields](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#idfields)
* [isStandardRollback](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#isstandardrollback)
* [networkId](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#networkid)
* [rollbackTable](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#rollbacktable)
* [rollingBack](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#rollingback)
* [syncStatus](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#syncstatus)
* [syncing](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#syncing)
* [table](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#table)

### Methods

* [addNewBlock](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#addnewblock)
* [allDocs](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#cleardb)
* [find](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#getdocumentcount)
* [getFullEventName](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#getfulleventname)
* [getIDValue](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#getidvalue)
* [getLogs](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#getlogs)
* [parseLogArrays](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#parselogarrays)
* [rollback](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#rollback)
* [rollupRollback](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#rolluprollback)
* [standardRollback](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#standardrollback)
* [sync](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#sync)
* [upsertDocument](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncableDB**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, eventName: *`string`*, dbName?: *`string`*, indexes?: *`string`[]*): [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

*Overrides [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[constructor](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#constructor)*

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L18)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) | - |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) | - |
| networkId | `number` | - |
| eventName | `string` | - |
| `Default value` dbName | `string` |  eventName |
| `Default value` indexes | `string`[] |  [] |

**Returns:** [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___

## Properties

<a id="augur"></a>

### `<Protected>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[augur](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#augur)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L16)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

___
<a id="eventname"></a>

### `<Protected>` eventName

**● eventName**: *`string`*

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L18)*

___
<a id="idfields"></a>

### `<Protected>` idFields

**● idFields**: *`string`[]*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[idFields](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#idfields)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___
<a id="isstandardrollback"></a>

### `<Protected>` isStandardRollback

**● isStandardRollback**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[isStandardRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#isstandardrollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L20)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[networkId](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#networkid)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L14)*

___
<a id="rollbacktable"></a>

### `<Protected>` rollbackTable

**● rollbackTable**: *`Table`<`any`, `any`>*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollbacktable)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L21)*

___
<a id="rollingback"></a>

### `<Protected>` rollingBack

**● rollingBack**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollingBack](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollingback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L18)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[syncStatus](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#syncstatus)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L19)*

___
<a id="syncing"></a>

### `<Protected>` syncing

**● syncing**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[syncing](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#syncing)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L17)*

___
<a id="table"></a>

###  table

**● table**: *`Table`<`any`, `any`>*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[table](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#table)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L13)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:88](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blocknumber | `number` |
| logs | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[] |

**Returns:** `Promise`<`number`>

___
<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`any`[]>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[allDocs](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#alldocs)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** `Promise`<`any`[]>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(documents: *`Array`<[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)>*): `Promise`<`void`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#bulkupsertdocuments)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:42](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)> |

**Returns:** `Promise`<`void`>

___
<a id="cleardb"></a>

###  clearDB

▸ **clearDB**(): `Promise`<`void`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[clearDB](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#cleardb)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L26)*

**Returns:** `Promise`<`void`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`__type`*): `Promise`<`Collection`<`any`, `any`>>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[find](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#find)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `__type` |

**Returns:** `Promise`<`Collection`<`any`, `any`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocument)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:38](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L38)*

**Type parameters:**

#### Document 
**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`Document` \| `undefined`>

___
<a id="getdocumentcount"></a>

###  getDocumentCount

▸ **getDocumentCount**(): `Promise`<`number`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getDocumentCount](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocumentcount)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

**Returns:** `Promise`<`number`>

___
<a id="getfulleventname"></a>

###  getFullEventName

▸ **getFullEventName**(): `string`

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:143](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L143)*

**Returns:** `string`

___
<a id="getidvalue"></a>

### `<Protected>` getIDValue

▸ **getIDValue**(document: *`any`*): [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getIDValue](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getidvalue)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| document | `any` |

**Returns:** [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

___
<a id="getlogs"></a>

### `<Protected>` getLogs

▸ **getLogs**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, startBlock: *`number`*, endBlock: *`number`*): `Promise`<[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]>

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:139](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L139)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| startBlock | `number` |
| endBlock | `number` |

**Returns:** `Promise`<[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]>

___
<a id="parselogarrays"></a>

### `<Private>` parseLogArrays

▸ **parseLogArrays**(logs: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]*): `void`

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[] |

**Returns:** `void`

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="rolluprollback"></a>

###  rollupRollback

▸ **rollupRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollupRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rolluprollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="standardrollback"></a>

###  standardRollback

▸ **standardRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[standardRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#standardrollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, chunkSize: *`number`*, blockStreamDelay: *`number`*, highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/SyncableDB.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncableDB.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| chunkSize | `number` |
| blockStreamDelay | `number` |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(documentID: *[ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)*, document: *[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[upsertDocument](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#upsertdocument)*

*Overrides [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[upsertDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#upsertdocument)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documentID | [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id) |
| document | [BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md) |

**Returns:** `Promise`<`void`>

___

