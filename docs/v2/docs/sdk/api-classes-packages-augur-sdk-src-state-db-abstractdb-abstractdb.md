---
id: api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb
title: AbstractDB
sidebar_label: AbstractDB
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/AbstractDB Module]](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md) > [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

## Class

## Hierarchy

**AbstractDB**

↳  [SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)

↳  [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

↳  [TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)

↳  [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)

### Properties

* [db](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#dbname)
* [networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)

### Methods

* [allDocs](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#alldocs)
* [bulkUpsertDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertdocuments)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertunordereddocuments)
* [find](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#find)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getdocument)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)
* [getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getpouchrevfromid)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

### `<Protected>` constructor

⊕ **new AbstractDB**(networkId: *`number`*, dbName: *`string`*, dbFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*): [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:26](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbName | `string` |
| dbFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:24](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L24)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:26](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L26)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:25](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L25)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:34](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L34)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Private>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(previousDocs: *[DocumentIDToDoc](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-documentidtodoc.md)*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:74](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L74)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| previousDocs | [DocumentIDToDoc](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-documentidtodoc.md) |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="bulkupsertordereddocuments"></a>

### `<Protected>` bulkUpsertOrderedDocuments

▸ **bulkUpsertOrderedDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:56](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:94](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L94)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getpouchrevfromid"></a>

### `<Protected>` getPouchRevFromId

▸ **getPouchRevFromId**(id: *`string`*): `Promise`<`string` \| `undefined`>

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:102](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`string` \| `undefined`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`UpsertResponse`>

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:49](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`UpsertResponse`>

___

