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
* [getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#getpouchrevfromid)
* [handleMergeEvent](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)
* [processLog](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#processlog)
* [rollback](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollback)
* [sync](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DerivedDB**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, name: *`string`*, mergeEventNames: *`string`[]*, idFields: *`string`[]*): [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:23](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| name | `string` |
| mergeEventNames | `string`[] |
| idFields | `string`[] |

**Returns:** [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[db](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#db)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:24](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L24)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[dbName](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:26](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L26)*

___
<a id="idfields"></a>

### `<Private>` idFields

**● idFields**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:20](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L20)*

___
<a id="mergeeventnames"></a>

### `<Private>` mergeEventNames

**● mergeEventNames**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:21](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L21)*

___
<a id="name"></a>

### `<Private>` name

**● name**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:22](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L22)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:25](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L25)*

___
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L19)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

___
<a id="updatinghighestsyncblock"></a>

### `<Private>` updatingHighestSyncBlock

**● updatingHighestSyncBlock**: *`boolean`* = false

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:23](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L23)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[allDocs](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:34](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L34)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertordereddocuments"></a>

### `<Protected>` bulkUpsertOrderedDocuments

▸ **bulkUpsertOrderedDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertordereddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:65](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L65)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:56](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:59](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L59)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:98](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L98)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:38](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L38)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:94](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L94)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getpouchrevfromid"></a>

### `<Protected>` getPouchRevFromId

▸ **getPouchRevFromId**(id: *`string`*): `Promise`<`string` \| `undefined`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getpouchrevfromid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:102](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`string` \| `undefined`>

___
<a id="handlemergeevent"></a>

###  handleMergeEvent

▸ **handleMergeEvent**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]*, syncing?: *`boolean`*): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:116](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L116)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| blocknumber | `number` | - |
| logs | [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[] | - |
| `Default value` syncing | `boolean` | false |

**Returns:** `Promise`<`number`>

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)*): [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:171](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L171)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md) |

**Returns:** [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:83](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L83)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:49](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`UpsertResponse`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:49](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`UpsertResponse`>

___

