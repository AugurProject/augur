---
id: api-classes-state-db-abstractdb-abstractdb
title: AbstractDB
sidebar_label: AbstractDB
---

[@augurproject/sdk](api-readme.md) > [[state/db/AbstractDB Module]](api-modules-state-db-abstractdb-module.md) > [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

## Class

## Hierarchy

**AbstractDB**

↳  [SyncStatus](api-classes-state-db-syncstatus-syncstatus.md)

↳  [MetaDB](api-classes-state-db-metadb-metadb.md)

↳  [SyncableDB](api-classes-state-db-syncabledb-syncabledb.md)

↳  [TrackedUsers](api-classes-state-db-trackedusers-trackedusers.md)

### Constructors

* [constructor](api-classes-state-db-abstractdb-abstractdb.md#constructor)

### Properties

* [db](api-classes-state-db-abstractdb-abstractdb.md#db)
* [dbName](api-classes-state-db-abstractdb-abstractdb.md#dbname)
* [networkId](api-classes-state-db-abstractdb-abstractdb.md#networkid)

### Methods

* [allDocs](api-classes-state-db-abstractdb-abstractdb.md#alldocs)
* [bulkUpsertDocuments](api-classes-state-db-abstractdb-abstractdb.md#bulkupsertdocuments)
* [find](api-classes-state-db-abstractdb-abstractdb.md#find)
* [getDocument](api-classes-state-db-abstractdb-abstractdb.md#getdocument)
* [getInfo](api-classes-state-db-abstractdb-abstractdb.md#getinfo)
* [getPouchRevFromId](api-classes-state-db-abstractdb-abstractdb.md#getpouchrevfromid)
* [upsertDocument](api-classes-state-db-abstractdb-abstractdb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

### `<Protected>` constructor

⊕ **new AbstractDB**(networkId: *`number`*, dbName: *`string`*, dbFactory: *[PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype)*): [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbName | `string` |
| dbFactory | [PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Defined in [state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Defined in [state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Defined in [state/db/AbstractDB.ts:55](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L55)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| startkey | `string` |
| documents | `Array`<`PouchDB.Core.PutDocument`<`__type`>> |

**Returns:** `Promise`<`boolean`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [state/db/AbstractDB.ts:84](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Defined in [state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

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

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getpouchrevfromid"></a>

### `<Private>` getPouchRevFromId

▸ **getPouchRevFromId**(id: *`string`*): `Promise`<`string` \| `undefined`>

*Defined in [state/db/AbstractDB.ts:88](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`string` \| `undefined`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

