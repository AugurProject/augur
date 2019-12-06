---
id: api-classes-augur-sdk-src-state-db-abstracttable-abstracttable
title: AbstractTable
sidebar_label: AbstractTable
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/AbstractTable Module]](api-modules-augur-sdk-src-state-db-abstracttable-module.md) > [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md)

## Class

## Hierarchy

**AbstractTable**

↳  [SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)

↳  [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md)

↳  [ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#constructor)

### Properties

* [dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)
* [idFields](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#idfields)
* [networkId](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#networkid)
* [table](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#table)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#cleardb)
* [find](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getdocumentcount)
* [getIDValue](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#getidvalue)
* [upsertDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

### `<Protected>` constructor

⊕ **new AbstractTable**(networkId: *`number`*, dbName: *`string`*, db: *`Dexie`*): [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md)

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| networkId | `number` |
| dbName | `string` |
| db | `Dexie` |

**Returns:** [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md)

___

## Properties

<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

___
<a id="idfields"></a>

### `<Protected>` idFields

**● idFields**: *`string`[]*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L14)*

___
<a id="table"></a>

###  table

**● table**: *`Table`<`any`, `any`>*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L13)*

___

## Methods

<a id="alldocs"></a>

###  allDocs

▸ **allDocs**(): `Promise`<`any`[]>

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** `Promise`<`any`[]>

___
<a id="bulkupsertdocuments"></a>

### `<Protected>` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(documents: *`Array`<[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)>*): `Promise`<`void`>

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

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L26)*

**Returns:** `Promise`<`void`>

___
<a id="find"></a>

###  find

▸ **find**(request: *`__type`*): `Promise`<`Collection`<`any`, `any`>>

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

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

**Returns:** `Promise`<`number`>

___
<a id="getidvalue"></a>

### `<Protected>` getIDValue

▸ **getIDValue**(document: *`any`*): [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| document | `any` |

**Returns:** [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(documentID: *[ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)*, document: *[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documentID | [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id) |
| document | [BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md) |

**Returns:** `Promise`<`void`>

___

