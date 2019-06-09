---
id: api-classes-state-db-syncstatus-syncstatus
title: SyncStatus
sidebar_label: SyncStatus
---

[@augurproject/sdk](api-readme.md) > [[state/db/SyncStatus Module]](api-modules-state-db-syncstatus-module.md) > [SyncStatus](api-classes-state-db-syncstatus-syncstatus.md)

## Class

## Hierarchy

 [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md)

**↳ SyncStatus**

### Constructors

* [constructor](api-classes-state-db-syncstatus-syncstatus.md#constructor)

### Properties

* [db](api-classes-state-db-syncstatus-syncstatus.md#db)
* [dbName](api-classes-state-db-syncstatus-syncstatus.md#dbname)
* [defaultStartSyncBlockNumber](api-classes-state-db-syncstatus-syncstatus.md#defaultstartsyncblocknumber)
* [networkId](api-classes-state-db-syncstatus-syncstatus.md#networkid)

### Methods

* [allDocs](api-classes-state-db-syncstatus-syncstatus.md#alldocs)
* [bulkUpsertDocuments](api-classes-state-db-syncstatus-syncstatus.md#bulkupsertdocuments)
* [find](api-classes-state-db-syncstatus-syncstatus.md#find)
* [getDocument](api-classes-state-db-syncstatus-syncstatus.md#getdocument)
* [getHighestSyncBlock](api-classes-state-db-syncstatus-syncstatus.md#gethighestsyncblock)
* [getInfo](api-classes-state-db-syncstatus-syncstatus.md#getinfo)
* [setHighestSyncBlock](api-classes-state-db-syncstatus-syncstatus.md#sethighestsyncblock)
* [upsertDocument](api-classes-state-db-syncstatus-syncstatus.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncStatus**(networkId: *`number`*, defaultStartSyncBlockNumber: *`number`*, dbFactory: *[PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype)*): [SyncStatus](api-classes-state-db-syncstatus-syncstatus.md)

*Overrides [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[constructor](api-classes-state-db-abstractdb-abstractdb.md#constructor)*

*Defined in [state/db/SyncStatus.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncStatus.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| defaultStartSyncBlockNumber | `number` |
| dbFactory | [PouchDBFactoryType](api-modules-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [SyncStatus](api-classes-state-db-syncstatus-syncstatus.md)

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
<a id="defaultstartsyncblocknumber"></a>

###  defaultStartSyncBlockNumber

**● defaultStartSyncBlockNumber**: *`number`*

*Defined in [state/db/SyncStatus.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncStatus.ts#L8)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[networkId](api-classes-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [state/db/AbstractDB.ts:22](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L22)*

___

## Methods

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
<a id="gethighestsyncblock"></a>

###  getHighestSyncBlock

▸ **getHighestSyncBlock**(dbName: *`string`*): `Promise`<`number`>

*Defined in [state/db/SyncStatus.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncStatus.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`number`>

___
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [state/db/AbstractDB.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L80)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="sethighestsyncblock"></a>

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(dbName: *`string`*, blockNumber: *`number`*): `Promise`<`Response`>

*Defined in [state/db/SyncStatus.ts:15](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/SyncStatus.ts#L15)*

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

*Inherited from [AbstractDB](api-classes-state-db-abstractdb-abstractdb.md).[upsertDocument](api-classes-state-db-abstractdb-abstractdb.md#upsertdocument)*

*Defined in [state/db/AbstractDB.ts:46](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/AbstractDB.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| document | `object` |

**Returns:** `Promise`<`Response`>

___

