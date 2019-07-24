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
* [setHighestSyncBlock](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#sethighestsyncblock)
* [updateSyncingToFalse](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#updatesyncingtofalse)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncStatus**(networkId: *`number`*, defaultStartSyncBlockNumber: *`number`*, dbFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*): [SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)

*Overrides [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:9](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L9)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:21](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L21)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[dbName](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:23](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L23)*

___
<a id="defaultstartsyncblocknumber"></a>

###  defaultStartSyncBlockNumber

**● defaultStartSyncBlockNumber**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:9](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L9)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`AllDocsResponse`<`__type`>>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[allDocs](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:31](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L31)*

**Returns:** `Promise`<`AllDocsResponse`<`__type`>>

___
<a id="bulkupsertordereddocuments"></a>

### `<Protected>` bulkUpsertOrderedDocuments

▸ **bulkUpsertOrderedDocuments**(startkey: *`string`*, documents: *`Array`<`PouchDB.Core.PutDocument`<`__type`>>*): `Promise`<`boolean`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#bulkupsertordereddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:66](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L66)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:57](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L57)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:99](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L99)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:35](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L35)*

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

▸ **getHighestSyncBlock**(dbName?: *`string`*): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:33](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` dbName | `string` |

**Returns:** `Promise`<`number`>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:95](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L95)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getlowestsyncingblockforalldbs"></a>

###  getLowestSyncingBlockForAllDBs

▸ **getLowestSyncingBlockForAllDBs**(): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:42](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L42)*

**Returns:** `Promise`<`number`>

___
<a id="sethighestsyncblock"></a>

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(dbName: *`string`*, blockNumber: *`number`*, syncing: *`boolean`*): `Promise`<`Response`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:28](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |
| blockNumber | `number` |
| syncing | `boolean` |

**Returns:** `Promise`<`Response`>

___
<a id="updatesyncingtofalse"></a>

###  updateSyncingToFalse

▸ **updateSyncingToFalse**(dbName: *`string`*): `Promise`<`Response`>

*Defined in [packages/augur-sdk/src/state/db/SyncStatus.ts:59](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/SyncStatus.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`Response`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(id: *`string`*, document: *`object`*): `Promise`<`Response`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

