[@augurproject/sdk](../README.md) > ["state/db/AbstractDB"](../modules/_state_db_abstractdb_.md) > [AbstractDB](../classes/_state_db_abstractdb_.abstractdb.md)

# Class: AbstractDB

## Hierarchy

**AbstractDB**

↳  [SyncStatus](_state_db_syncstatus_.syncstatus.md)

↳  [MetaDB](_state_db_metadb_.metadb.md)

↳  [SyncableDB](_state_db_syncabledb_.syncabledb.md)

↳  [TrackedUsers](_state_db_trackedusers_.trackedusers.md)

## Index

### Constructors

* [constructor](_state_db_abstractdb_.abstractdb.md#constructor)

### Properties

* [db](_state_db_abstractdb_.abstractdb.md#db)
* [dbName](_state_db_abstractdb_.abstractdb.md#dbname)
* [networkId](_state_db_abstractdb_.abstractdb.md#networkid)

### Methods

* [allDocs](_state_db_abstractdb_.abstractdb.md#alldocs)
* [bulkUpsertDocuments](_state_db_abstractdb_.abstractdb.md#bulkupsertdocuments)
* [find](_state_db_abstractdb_.abstractdb.md#find)
* [getDocument](_state_db_abstractdb_.abstractdb.md#getdocument)
* [getInfo](_state_db_abstractdb_.abstractdb.md#getinfo)
* [getPouchRevFromId](_state_db_abstractdb_.abstractdb.md#getpouchrevfromid)
* [upsertDocument](_state_db_abstractdb_.abstractdb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

### `<Protected>` constructor

⊕ **new AbstractDB**(networkId: *`number`*, dbName: *`string`*, dbFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*): [AbstractDB](_state_db_abstractdb_.abstractdb.md)

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbName | `string` |
| dbFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |

**Returns:** [AbstractDB](_state_db_abstractdb_.abstractdb.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Defined in [state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Defined in [state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Defined in [state/db/AbstractDB.ts:55](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L55)*

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

*Defined in [state/db/AbstractDB.ts:84](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Defined in [state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

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

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getpouchrevfromid"></a>

### `<Private>` getPouchRevFromId

▸ **getPouchRevFromId**(id: *`string`*): `Promise`<`string` \| `undefined`>

*Defined in [state/db/AbstractDB.ts:88](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L88)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`string` \| `undefined`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

