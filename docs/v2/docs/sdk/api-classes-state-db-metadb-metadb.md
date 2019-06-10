---
id: api-classes-state-db-metadb-metadb
title: MetaDB
sidebar_label: MetaDB
---

[@augurproject/sdk](api-readme.md) > [[state/db/MetaDB Module]](api-modules-state-db-metadb-module.md) > [MetaDB](api-classes-state-db-metadb-metadb.md)

## Class

Associates block numbers with event DB sequence IDs. Used for doing syncing/rolling back of derived DBs.

TODO Remove this class if derived DBs are not used.

## Hierarchy

 [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

**↳ MetaDB**

### Constructors

* [constructor](api-classes-state-db-metadb-metadb.md#constructor)

### Properties

* [db](api-classes-state-db-metadb-metadb.md#db)
* [dbName](api-classes-state-db-metadb-metadb.md#dbname)
* [networkId](api-classes-state-db-metadb-metadb.md#networkid)
* [syncStatus](api-classes-state-db-metadb-metadb.md#syncstatus)

### Methods

* [addNewBlock](api-classes-state-db-metadb-metadb.md#addnewblock)
* [allDocs](api-classes-state-db-metadb-metadb.md#alldocs)
* [bulkUpsertDocuments](api-classes-state-db-metadb-metadb.md#bulkupsertdocuments)
* [find](api-classes-state-db-metadb-metadb.md#find)
* [getDocument](api-classes-state-db-metadb-metadb.md#getdocument)
* [getInfo](api-classes-state-db-metadb-metadb.md#getinfo)
* [rollback](api-classes-state-db-metadb-metadb.md#rollback)
* [upsertDocument](api-classes-state-db-metadb-metadb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MetaDB**(dbController: *[DB](api-classes-state-db-db-db.md)*, networkId: *`number`*, dbFactory: *[PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype)*): [MetaDB](api-classes-state-db-metadb-metadb.md)

*Overrides [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[constructor](api-classes-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [state/db/MetaDB.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/MetaDB.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbController | [DB](api-classes-state-db-db-db.md) |
| networkId | `number` |
| dbFactory | [PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [MetaDB](api-classes-state-db-metadb-metadb.md)

___

## Properties

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
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[networkId](api-classes-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___
<a id="syncstatus"></a>

### `<Private>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-state-db-syncstatus-syncstatus.md)*

*Defined in [state/db/MetaDB.ts:16](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/MetaDB.ts#L16)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(blockNumber: *`number`*, sequenceIds: *[SequenceIds](api-interfaces-state-db-metadb-sequenceids.md)*): `Promise`<`void`>

*Defined in [state/db/MetaDB.ts:28](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/MetaDB.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| sequenceIds | [SequenceIds](api-interfaces-state-db-metadb-sequenceids.md) |

**Returns:** `Promise`<`void`>

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
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/MetaDB.ts:39](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/MetaDB.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

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

