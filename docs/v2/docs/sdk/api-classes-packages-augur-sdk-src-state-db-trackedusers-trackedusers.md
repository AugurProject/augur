---
id: api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers
title: TrackedUsers
sidebar_label: TrackedUsers
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/TrackedUsers Module]](api-modules-packages-augur-sdk-src-state-db-trackedusers-module.md) > [TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)

## Class

## Hierarchy

 [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

**↳ TrackedUsers**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#constructor)

### Properties

* [db](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#dbname)
* [networkId](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#networkid)

### Methods

* [allDocs](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#alldocs)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#bulkupsertunordereddocuments)
* [find](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#find)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#getdocument)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#getinfo)
* [getUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#getusers)
* [setUserTracked](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#setusertracked)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TrackedUsers**(networkId: *`number`*, dbFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*): [TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/TrackedUsers.ts:5](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/TrackedUsers.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)

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
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

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
<a id="getusers"></a>

###  getUsers

▸ **getUsers**(): `Promise`<`string`[]>

*Defined in [packages/augur-sdk/src/state/db/TrackedUsers.ts:19](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/TrackedUsers.ts#L19)*

**Returns:** `Promise`<`string`[]>

___
<a id="setusertracked"></a>

###  setUserTracked

▸ **setUserTracked**(user: *`string`*): `Promise`<`Response`>

*Defined in [packages/augur-sdk/src/state/db/TrackedUsers.ts:10](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/TrackedUsers.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |

**Returns:** `Promise`<`Response`>

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

