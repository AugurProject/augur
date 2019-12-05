---
id: api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders
title: ZeroXOrders
sidebar_label: ZeroXOrders
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/ZeroXOrders Module]](api-modules-augur-sdk-src-state-db-zeroxorders-module.md) > [ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)

## Class

Stores 0x orders

## Hierarchy

 [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md)

**↳ ZeroXOrders**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#augur)
* [dbName](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#dbname)
* [idFields](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#idfields)
* [networkId](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#networkid)
* [stateDB](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#statedb)
* [syncStatus](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#syncstatus)
* [table](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#table)
* [tradeTokenAddress](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#tradetokenaddress)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#cleardb)
* [find](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#getdocumentcount)
* [getIDValue](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#getidvalue)
* [handleMeshEvent](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#handlemeshevent)
* [parseAssetData](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#parseassetdata)
* [processOrder](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#processorder)
* [subscribeToMeshEvents](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#subscribetomeshevents)
* [sync](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#sync)
* [upsertDocument](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#upsertdocument)
* [validateOrder](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#validateorder)
* [validateStoredOrder](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#validatestoredorder)
* [create](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ZeroXOrders**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)

*Overrides [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[constructor](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#constructor)*

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:47](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L46)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

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
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L45)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:44](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L44)*

___
<a id="table"></a>

###  table

**● table**: *`Table`<`any`, `any`>*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[table](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#table)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L13)*

___
<a id="tradetokenaddress"></a>

###  tradeTokenAddress

**● tradeTokenAddress**: *`string`*

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:47](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L47)*

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
<a id="handlemeshevent"></a>

###  handleMeshEvent

▸ **handleMeshEvent**(orderEvents: *`OrderEvent`[]*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:72](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderEvents | `OrderEvent`[] |

**Returns:** `Promise`<`void`>

___
<a id="parseassetdata"></a>

###  parseAssetData

▸ **parseAssetData**(assetData: *`string`*): [OrderData](api-interfaces-augur-sdk-src-state-db-zeroxorders-orderdata.md)

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:112](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L112)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| assetData | `string` |

**Returns:** [OrderData](api-interfaces-augur-sdk-src-state-db-zeroxorders-orderdata.md)

___
<a id="processorder"></a>

###  processOrder

▸ **processOrder**(order: *`OrderInfo`*): [StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md)

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:104](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L104)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| order | `OrderInfo` |

**Returns:** [StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md)

___
<a id="subscribetomeshevents"></a>

###  subscribeToMeshEvents

▸ **subscribeToMeshEvents**(): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L68)*

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:80](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L80)*

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
<a id="validateorder"></a>

###  validateOrder

▸ **validateOrder**(order: *`OrderInfo`*): `boolean`

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:92](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| order | `OrderInfo` |

**Returns:** `boolean`

___
<a id="validatestoredorder"></a>

###  validateStoredOrder

▸ **validateStoredOrder**(storedOrder: *[StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md)*): `boolean`

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:99](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| storedOrder | [StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md) |

**Returns:** `boolean`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): `Promise`<[ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)>

*Defined in [augur-sdk/src/state/db/ZeroXOrders.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/ZeroXOrders.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** `Promise`<[ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)>

___

