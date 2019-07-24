---
id: api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb
title: DerivedDB
sidebar_label: DerivedDB
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/DerivedDB Module]](api-modules-packages-augur-sdk-src-state-db-deriveddb-module.md) > [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

## Class

Stores derived data from multiple logs and post-log processing

## Hierarchy

 [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

**↳ DerivedDB**

↳  [MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#constructor)

### Properties

* [db](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#dbname)
* [idFields](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#idfields)
* [mergeEventNames](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#mergeeventnames)
* [name](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#name)
* [networkId](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#networkid)
* [stateDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#statedb)
* [syncStatus](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#syncstatus)
* [updatingHighestSyncBlock](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#updatinghighestsyncblock)

### Methods

* [allDocs](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#alldocs)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#bulkupsertunordereddocuments)
* [doSync](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#dosync)
* [find](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#find)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#getdocument)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#getinfo)
* [handleMergeEvent](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)
* [processLog](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#processlog)
* [rollback](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollback)
* [sync](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DerivedDB**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, name: *`string`*, mergeEventNames: *`Array`<`string`>*, idFields: *`Array`<`string`>*): [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:23](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| name | `string` |
| mergeEventNames | `Array`<`string`> |
| idFields | `Array`<`string`> |

**Returns:** [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[db](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#db)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[dbName](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="idfields"></a>

### `<Private>` idFields

**● idFields**: *`Array`<`string`>*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:20](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L20)*

___
<a id="mergeeventnames"></a>

### `<Private>` mergeEventNames

**● mergeEventNames**: *`Array`<`string`>*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:21](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L21)*

___
<a id="name"></a>

### `<Private>` name

**● name**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:22](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L22)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:19](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L19)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

___
<a id="updatinghighestsyncblock"></a>

### `<Private>` updatingHighestSyncBlock

**● updatingHighestSyncBlock**: *`boolean`* = false

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:23](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L23)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[allDocs](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertordereddocuments"></a>

### `<Protected>` bulkUpsertOrderedDocuments

▸ **bulkUpsertOrderedDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertordereddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:66](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L66)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:57](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:51](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[find](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:99](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L99)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

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

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:95](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L95)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="handlemergeevent"></a>

###  handleMergeEvent

▸ **handleMergeEvent**(blocknumber: *`number`*, logs: *`Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>*, syncing?: *`boolean`*): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:92](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L92)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| blocknumber | `number` | - |
| logs | `Array`<[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)> | - |
| `Default value` syncing | `boolean` | false |

**Returns:** `Promise`<`number`>

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)*): [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:129](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L129)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md) |

**Returns:** [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:66](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:45](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/DerivedDB.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

