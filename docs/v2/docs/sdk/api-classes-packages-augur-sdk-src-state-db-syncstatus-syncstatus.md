---
id: api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus
title: SyncStatus
sidebar_label: SyncStatus
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/SyncStatus Module]](api-modules-packages-augur-sdk-src-state-db-syncstatus-module.md) > [SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)

## Class

## Hierarchy

 [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md)

**↳ SyncStatus**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#constructor)

### Properties

* [db](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#dbname)
* [defaultStartSyncBlockNumber](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#defaultstartsyncblocknumber)
* [networkId](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#networkid)

### Methods

* [allDocs](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#alldocs)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#bulkupsertunordereddocuments)
* [find](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#find)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#getdocument)
* [getHighestSyncBlock](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#gethighestsyncblock)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#getinfo)
* [getLowestSyncingBlockForAllDBs](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#getlowestsyncingblockforalldbs)
* [getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#getpouchrevfromid)
* [setHighestSyncBlock](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#sethighestsyncblock)
* [updateSyncingToFalse](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#updatesyncingtofalse)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncStatus**(networkId: *`number`*, defaultStartSyncBlockNumber: *`number`*, dbFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*): [SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| defaultStartSyncBlockNumber | `number` |
| dbFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)

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
<a id="defaultstartsyncblocknumber"></a>

###  defaultStartSyncBlockNumber

**● defaultStartSyncBlockNumber**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:25](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L25)*

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
<a id="gethighestsyncblock"></a>

###  getHighestSyncBlock

▸ **getHighestSyncBlock**(dbName: *`string`*): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:49](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`number`>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:94](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L94)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getlowestsyncingblockforalldbs"></a>

###  getLowestSyncingBlockForAllDBs

▸ **getLowestSyncingBlockForAllDBs**(): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:58](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L58)*

**Returns:** `Promise`<`number`>

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
<a id="sethighestsyncblock"></a>

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(dbName: *`string`*, blockNumber: *`number`*, syncing: *`boolean`*, rollback?: *`boolean`*): `Promise`<`UpsertResponse`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:31](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L31)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| dbName | `string` | - |
| blockNumber | `number` | - |
| syncing | `boolean` | - |
| `Default value` rollback | `boolean` | false |

**Returns:** `Promise`<`UpsertResponse`>

___
<a id="updatesyncingtofalse"></a>

###  updateSyncingToFalse

▸ **updateSyncingToFalse**(dbName: *`string`*): `Promise`<`UpsertResponse`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:75](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/SyncStatus.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`UpsertResponse`>

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

