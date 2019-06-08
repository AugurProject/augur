[@augurproject/sdk](../README.md) > ["state/db/TrackedUsers"](../modules/_state_db_trackedusers_.md) > [TrackedUsers](../classes/_state_db_trackedusers_.trackedusers.md)

# Class: TrackedUsers

## Hierarchy

 [AbstractDB](_state_db_abstractdb_.abstractdb.md)

**↳ TrackedUsers**

## Index

### Constructors

* [constructor](_state_db_trackedusers_.trackedusers.md#constructor)

### Properties

* [db](_state_db_trackedusers_.trackedusers.md#db)
* [dbName](_state_db_trackedusers_.trackedusers.md#dbname)
* [networkId](_state_db_trackedusers_.trackedusers.md#networkid)

### Methods

* [allDocs](_state_db_trackedusers_.trackedusers.md#alldocs)
* [bulkUpsertDocuments](_state_db_trackedusers_.trackedusers.md#bulkupsertdocuments)
* [find](_state_db_trackedusers_.trackedusers.md#find)
* [getDocument](_state_db_trackedusers_.trackedusers.md#getdocument)
* [getInfo](_state_db_trackedusers_.trackedusers.md#getinfo)
* [getUsers](_state_db_trackedusers_.trackedusers.md#getusers)
* [setUserTracked](_state_db_trackedusers_.trackedusers.md#setusertracked)
* [upsertDocument](_state_db_trackedusers_.trackedusers.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TrackedUsers**(networkId: *`number`*, dbFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*): [TrackedUsers](_state_db_trackedusers_.trackedusers.md)

*Overrides [AbstractDB](_state_db_abstractdb_.abstractdb.md).[constructor](_state_db_abstractdb_.abstractdb.md#constructor)*

*Defined in [state/db/TrackedUsers.ts:4](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/TrackedUsers.ts#L4)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |

**Returns:** [TrackedUsers](_state_db_trackedusers_.trackedusers.md)

___

## Properties

<a id="db"></a>

### `<Protected>` db

**● db**: *`Database`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[db](_state_db_abstractdb_.abstractdb.md#db)*

*Defined in [state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[dbName](_state_db_abstractdb_.abstractdb.md#dbname)*

*Defined in [state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[networkId](_state_db_abstractdb_.abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[allDocs](_state_db_abstractdb_.abstractdb.md#alldocs)*

*Defined in [state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[bulkUpsertDocuments](_state_db_abstractdb_.abstractdb.md#bulkupsertdocuments)*

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

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[find](_state_db_abstractdb_.abstractdb.md#find)*

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

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getDocument](_state_db_abstractdb_.abstractdb.md#getdocument)*

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

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getInfo](_state_db_abstractdb_.abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getusers"></a>

###  getUsers

▸ **getUsers**(): `Promise`<`Array`<`string`>>

*Defined in [state/db/TrackedUsers.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/TrackedUsers.ts#L13)*

**Returns:** `Promise`<`Array`<`string`>>

___
<a id="setusertracked"></a>

###  setUserTracked

▸ **setUserTracked**(user: *`string`*): `Promise`<`Response`>

*Defined in [state/db/TrackedUsers.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/TrackedUsers.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |

**Returns:** `Promise`<`Response`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[upsertDocument](_state_db_abstractdb_.abstractdb.md#upsertdocument)*

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

