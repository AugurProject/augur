---
id: api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase
title: CurrentOrdersDatabase
sidebar_label: CurrentOrdersDatabase
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/CurrentOrdersDB Module]](api-modules-augur-sdk-src-state-db-currentordersdb-module.md) > [CurrentOrdersDatabase](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md)

## Class

DB to store current order states

## Hierarchy

↳  [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md)

**↳ CurrentOrdersDatabase**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#constructor)

### Properties

* [HANDLE_MERGE_EVENT_LOCK](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#handle_merge_event_lock)
* [augur](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#augur)
* [dbName](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#dbname)
* [idFields](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#idfields)
* [isStandardRollback](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#isstandardrollback)
* [locks](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#locks)
* [networkId](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#networkid)
* [requiresOrder](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#requiresorder)
* [rollbackTable](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#rollbacktable)
* [rollingBack](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#rollingback)
* [stateDB](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#statedb)
* [syncStatus](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#syncstatus)
* [syncing](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#syncing)
* [table](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#table)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#cleardb)
* [clearLocks](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#clearlocks)
* [doSync](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#dosync)
* [find](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#getdocumentcount)
* [getIDValue](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#getidvalue)
* [handleMergeEvent](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#handlemergeevent)
* [lock](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#lock)
* [processDoc](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#processdoc)
* [rollback](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#rollback)
* [rollupRollback](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#rolluprollback)
* [standardRollback](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#standardrollback)
* [sync](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#sync)
* [upsertDocument](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#upsertdocument)
* [waitOnLock](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md#waitonlock)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CurrentOrdersDatabase**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, name: *`string`*, mergeEventNames: *`string`[]*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [CurrentOrdersDatabase](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md)

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[constructor](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#constructor)*

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

**Returns:** [CurrentOrdersDatabase](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md)

___

## Properties

<a id="handle_merge_event_lock"></a>

### `<Protected>` HANDLE_MERGE_EVENT_LOCK

**● HANDLE_MERGE_EVENT_LOCK**: *"handleMergeEvent"* = "handleMergeEvent"

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[HANDLE_MERGE_EVENT_LOCK](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handle_merge_event_lock)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L26)*

___
<a id="augur"></a>

### `<Protected>` augur

**● augur**: *`any`*

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[augur](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#augur)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[locks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#locks)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L25)*

#### Type declaration

[name: `string`]: `boolean`

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[requiresOrder](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#requiresorder)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[stateDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#statedb)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[clearLocks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#clearlocks)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:155](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L155)*

**Returns:** `void`

___
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[doSync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#dosync)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[handleMergeEvent](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[lock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#lock)*

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

*Overrides [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[processDoc](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#processdoc)*

*Defined in [augur-sdk/src/state/db/CurrentOrdersDB.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/CurrentOrdersDB.ts#L9)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[sync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)*

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

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[waitOnLock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#waitonlock)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:145](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L145)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| lock | `string` |
| maxTimeMS | `number` |
| periodMS | `number` |

**Returns:** `Promise`<`void`>

___

