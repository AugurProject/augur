[@augurproject/sdk](../README.md) > ["state/db/SyncStatus"](../modules/_state_db_syncstatus_.md) > [SyncStatus](../classes/_state_db_syncstatus_.syncstatus.md)

# Class: SyncStatus

## Hierarchy

 [AbstractDB](_state_db_abstractdb_.abstractdb.md)

**↳ SyncStatus**

## Index

### Constructors

* [constructor](_state_db_syncstatus_.syncstatus.md#constructor)

### Properties

* [db](_state_db_syncstatus_.syncstatus.md#db)
* [dbName](_state_db_syncstatus_.syncstatus.md#dbname)
* [defaultStartSyncBlockNumber](_state_db_syncstatus_.syncstatus.md#defaultstartsyncblocknumber)
* [networkId](_state_db_syncstatus_.syncstatus.md#networkid)

### Methods

* [allDocs](_state_db_syncstatus_.syncstatus.md#alldocs)
* [bulkUpsertDocuments](_state_db_syncstatus_.syncstatus.md#bulkupsertdocuments)
* [find](_state_db_syncstatus_.syncstatus.md#find)
* [getDocument](_state_db_syncstatus_.syncstatus.md#getdocument)
* [getHighestSyncBlock](_state_db_syncstatus_.syncstatus.md#gethighestsyncblock)
* [getInfo](_state_db_syncstatus_.syncstatus.md#getinfo)
* [setHighestSyncBlock](_state_db_syncstatus_.syncstatus.md#sethighestsyncblock)
* [upsertDocument](_state_db_syncstatus_.syncstatus.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncStatus**(networkId: *`number`*, defaultStartSyncBlockNumber: *`number`*, dbFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*): [SyncStatus](_state_db_syncstatus_.syncstatus.md)

*Overrides [AbstractDB](_state_db_abstractdb_.abstractdb.md).[constructor](_state_db_abstractdb_.abstractdb.md#constructor)*

*Defined in [state/db/SyncStatus.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncStatus.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| defaultStartSyncBlockNumber | `number` |
| dbFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |

**Returns:** [SyncStatus](_state_db_syncstatus_.syncstatus.md)

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
<a id="defaultstartsyncblocknumber"></a>

###  defaultStartSyncBlockNumber

**● defaultStartSyncBlockNumber**: *`number`*

*Defined in [state/db/SyncStatus.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncStatus.ts#L8)*

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
<a id="gethighestsyncblock"></a>

###  getHighestSyncBlock

▸ **getHighestSyncBlock**(dbName: *`string`*): `Promise`<`number`>

*Defined in [state/db/SyncStatus.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncStatus.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`number`>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](_state_db_abstractdb_.abstractdb.md).[getInfo](_state_db_abstractdb_.abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="sethighestsyncblock"></a>

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(dbName: *`string`*, blockNumber: *`number`*): `Promise`<`Response`>

*Defined in [state/db/SyncStatus.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/SyncStatus.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |
| blockNumber | `number` |

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

