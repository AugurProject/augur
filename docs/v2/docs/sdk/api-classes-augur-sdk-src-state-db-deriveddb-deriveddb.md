---
id: api-classes-augur-sdk-src-state-db-deriveddb-deriveddb
title: DerivedDB
sidebar_label: DerivedDB
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/DerivedDB Module]](api-modules-augur-sdk-src-state-db-deriveddb-module.md) > [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md)

## Class

Stores derived data from multiple logs and post-log processing

## Hierarchy

↳  [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md)

**↳ DerivedDB**

↳  [DisputeDatabase](api-classes-augur-sdk-src-state-db-disputedb-disputedatabase.md)

↳  [CurrentOrdersDatabase](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md)

↳  [MarketDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md)

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#constructor)

### Properties

* [HANDLE_MERGE_EVENT_LOCK](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handle_merge_event_lock)
* [augur](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#augur)
* [dbName](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#dbname)
* [idFields](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#idfields)
* [isStandardRollback](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#isstandardrollback)
* [locks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#locks)
* [mergeEventNames](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#mergeeventnames)
* [name](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#name)
* [networkId](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#networkid)
* [requiresOrder](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#requiresorder)
* [rollbackTable](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollbacktable)
* [rollingBack](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollingback)
* [stateDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#statedb)
* [syncStatus](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#syncstatus)
* [syncing](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#syncing)
* [table](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#table)
* [updatingHighestSyncBlock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#updatinghighestsyncblock)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#cleardb)
* [clearLocks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#clearlocks)
* [doSync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#dosync)
* [find](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#getdocumentcount)
* [getIDValue](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#getidvalue)
* [handleMergeEvent](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)
* [lock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#lock)
* [processDoc](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#processdoc)
* [rollback](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollback)
* [rollupRollback](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#rolluprollback)
* [standardRollback](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#standardrollback)
* [sync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)
* [upsertDocument](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#upsertdocument)
* [waitOnLock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#waitonlock)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DerivedDB**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, name: *`string`*, mergeEventNames: *`string`[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md)

*Overrides [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[constructor](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#constructor)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| name | `string` |
| mergeEventNames | `string`[] |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___

## Properties

<a id="handle_merge_event_lock"></a>

### `<Protected>` HANDLE_MERGE_EVENT_LOCK

**● HANDLE_MERGE_EVENT_LOCK**: *"handleMergeEvent"* = "handleMergeEvent"

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L26)*

___
<a id="augur"></a>

### `<Protected>` augur

**● augur**: *`any`*

*Overrides [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[augur](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#augur)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L28)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

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
<a id="locks"></a>

### `<Protected>` locks

**● locks**: *`object`*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L25)*

#### Type declaration

[name: `string`]: `boolean`

___
<a id="mergeeventnames"></a>

### `<Private>` mergeEventNames

**● mergeEventNames**: *`string`[]*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

___
<a id="name"></a>

### `<Private>` name

**● name**: *`string`*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L19)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[networkId](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#networkid)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L14)*

___
<a id="requiresorder"></a>

### `<Protected>` requiresOrder

**● requiresOrder**: *`boolean`* = false

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L21)*

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
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L17)*

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
<a id="updatinghighestsyncblock"></a>

### `<Private>` updatingHighestSyncBlock

**● updatingHighestSyncBlock**: *`boolean`* = false

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L20)*

___

## Methods

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
<a id="clearlocks"></a>

### `<Protected>` clearLocks

▸ **clearLocks**(): `void`

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:155](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L155)*

**Returns:** `void`

___
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

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
<a id="handlemergeevent"></a>

###  handleMergeEvent

▸ **handleMergeEvent**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]*, syncing?: *`boolean`*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:76](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L76)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| blocknumber | `number` | - |
| logs | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[] | - |
| `Default value` syncing | `boolean` | false |

**Returns:** `Promise`<`number`>

___
<a id="lock"></a>

### `<Protected>` lock

▸ **lock**(name: *`string`*): `void`

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:141](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L141)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `void`

___
<a id="processdoc"></a>

### `<Protected>` processDoc

▸ **processDoc**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:137](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L137)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

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

▸ **sync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
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
<a id="waitonlock"></a>

### `<Protected>` waitOnLock

▸ **waitOnLock**(lock: *`string`*, maxTimeMS: *`number`*, periodMS: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:145](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L145)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| lock | `string` |
| maxTimeMS | `number` |
| periodMS | `number` |

**Returns:** `Promise`<`void`>

___

