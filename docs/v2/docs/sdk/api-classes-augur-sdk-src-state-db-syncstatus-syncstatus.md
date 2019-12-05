---
id: api-classes-augur-sdk-src-state-db-syncstatus-syncstatus
title: SyncStatus
sidebar_label: SyncStatus
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/SyncStatus Module]](api-modules-augur-sdk-src-state-db-syncstatus-module.md) > [SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)

## Class

## Hierarchy

 [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md)

**↳ SyncStatus**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#constructor)

### Properties

* [dbName](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#dbname)
* [defaultStartSyncBlockNumber](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#defaultstartsyncblocknumber)
* [idFields](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#idfields)
* [networkId](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#networkid)
* [table](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#table)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#cleardb)
* [find](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#getdocumentcount)
* [getHighestSyncBlock](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#gethighestsyncblock)
* [getIDValue](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#getidvalue)
* [getLowestSyncingBlockForAllDBs](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#getlowestsyncingblockforalldbs)
* [setHighestSyncBlock](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#sethighestsyncblock)
* [updateSyncingToFalse](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#updatesyncingtofalse)
* [upsertDocument](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SyncStatus**(networkId: *`number`*, defaultStartSyncBlockNumber: *`number`*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*): [SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)

*Overrides [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[constructor](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#constructor)*

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| defaultStartSyncBlockNumber | `number` |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |

**Returns:** [SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)

___

## Properties

<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

___
<a id="defaultstartsyncblocknumber"></a>

###  defaultStartSyncBlockNumber

**● defaultStartSyncBlockNumber**: *`number`*

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L12)*

___
<a id="idfields"></a>

### `<Protected>` idFields

**● idFields**: *`string`[]*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[idFields](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#idfields)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[networkId](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#networkid)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L14)*

___
<a id="table"></a>

###  table

**● table**: *`Table`<`any`, `any`>*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[table](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#table)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L13)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`any`[]>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[allDocs](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#alldocs)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** `Promise`<`any`[]>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(documents: *`Array`<[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)>*): `Promise`<`void`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#bulkupsertdocuments)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:42](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documents | `Array`<[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)> |

**Returns:** `Promise`<`void`>

___
<a id="cleardb"></a>

###  clearDB

▸ **clearDB**(): `Promise`<`void`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[clearDB](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#cleardb)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L26)*

**Returns:** `Promise`<`void`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`__type`*): `Promise`<`Collection`<`any`, `any`>>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[find](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#find)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `__type` |

**Returns:** `Promise`<`Collection`<`any`, `any`>>

___
<a id="getdocument"></a>

### `<Protected>` getDocument

▸ **getDocument**<`Document`>(id: *`string`*): `Promise`<`Document` \| `undefined`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocument)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:38](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L38)*

**Type parameters:**

#### Document 
**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`Document` \| `undefined`>

___
<a id="getdocumentcount"></a>

###  getDocumentCount

▸ **getDocumentCount**(): `Promise`<`number`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getDocumentCount](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocumentcount)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

**Returns:** `Promise`<`number`>

___
<a id="gethighestsyncblock"></a>

###  getHighestSyncBlock

▸ **getHighestSyncBlock**(dbName: *`string`*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:27](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`number`>

___
<a id="getidvalue"></a>

### `<Protected>` getIDValue

▸ **getIDValue**(document: *`any`*): [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[getIDValue](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getidvalue)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| document | `any` |

**Returns:** [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

___
<a id="getlowestsyncingblockforalldbs"></a>

###  getLowestSyncingBlockForAllDBs

▸ **getLowestSyncingBlockForAllDBs**(): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L32)*

**Returns:** `Promise`<`number`>

___
<a id="sethighestsyncblock"></a>

###  setHighestSyncBlock

▸ **setHighestSyncBlock**(eventName: *`string`*, blockNumber: *`number`*, syncing: *`boolean`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| blockNumber | `number` |
| syncing | `boolean` |

**Returns:** `Promise`<`void`>

___
<a id="updatesyncingtofalse"></a>

###  updateSyncingToFalse

▸ **updateSyncingToFalse**(dbName: *`string`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/SyncStatus.ts:43](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/SyncStatus.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbName | `string` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(documentID: *[ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)*, document: *[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)*): `Promise`<`void`>

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[upsertDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#upsertdocument)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documentID | [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id) |
| document | [BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md) |

**Returns:** `Promise`<`void`>

___

