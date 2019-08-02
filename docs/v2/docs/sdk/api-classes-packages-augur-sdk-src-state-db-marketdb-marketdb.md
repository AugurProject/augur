---
id: api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb
title: MarketDB
sidebar_label: MarketDB
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/MarketDB Module]](api-modules-packages-augur-sdk-src-state-db-marketdb-module.md) > [MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)

## Class

Market specific derived DB intended for filtering purposes

## Hierarchy

↳  [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

**↳ MarketDB**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#augur)
* [db](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#db)
* [dbName](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#dbname)
* [events](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#events)
* [flexSearchIndex](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#flexsearchindex)
* [liquiditySpreads](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#liquidityspreads)
* [networkId](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#networkid)
* [stateDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#statedb)
* [syncStatus](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#syncstatus)

### Methods

* [allDocs](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#alldocs)
* [bulkUpsertOrderedDocuments](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#bulkupsertordereddocuments)
* [bulkUpsertUnorderedDocuments](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#bulkupsertunordereddocuments)
* [doSync](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#dosync)
* [find](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#find)
* [fullTextSearch](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#fulltextsearch)
* [getDocument](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#getdocument)
* [getInfo](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#getinfo)
* [getOrderbook](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#getorderbook)
* [getOrderbookData](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#getorderbookdata)
* [getPouchRevFromId](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#getpouchrevfromid)
* [handleMergeEvent](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#handlemergeevent)
* [processLog](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#processlog)
* [recalcInvalidFilter](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#recalcinvalidfilter)
* [rollback](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#rollback)
* [sync](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#sync)
* [syncFullTextSearch](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#syncfulltextsearch)
* [syncOrderBooks](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#syncorderbooks)
* [upsertDocument](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md#upsertdocument)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MarketDB**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*): [MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)

*Overrides [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[constructor](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:62](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |

**Returns:** [MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)

___

## Properties

<a id="augur"></a>

### `<Protected>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:59](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L59)*

___
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
<a id="events"></a>

### `<Private>` events

**● events**: *[Subscriptions](api-classes-packages-augur-sdk-src-subscriptions-subscriptions.md)* =  new Subscriptions(augurEmitter)

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:60](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L60)*

___
<a id="flexsearchindex"></a>

### `<Private>``<Optional>` flexSearchIndex

**● flexSearchIndex**: *`Index`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:61](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L61)*

___
<a id="liquidityspreads"></a>

###  liquiditySpreads

**● liquiditySpreads**: *`number`[]* =  [10, 15, 20, 100]

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:62](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L62)*

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[networkId](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:25](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L25)*

___
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[stateDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#statedb)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:19](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L19)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[syncStatus](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#syncstatus)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

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
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Overrides [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[doSync](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#dosync)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:92](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

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
<a id="fulltextsearch"></a>

###  fullTextSearch

▸ **fullTextSearch**(query: *`string` \| `null`*, extendedSearchOptions: *`ExtendedSearchOptions`[] \| `null`*): `Promise`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>[]>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:236](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L236)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` \| `null` |
| extendedSearchOptions | `ExtendedSearchOptions`[] \| `null` |

**Returns:** `Promise`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>[]>

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
<a id="getinfo"></a>

###  getInfo

▸ **getInfo**(): `Promise`<`DatabaseInfo`>

*Inherited from [AbstractDB](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md).[getInfo](api-classes-packages-augur-sdk-src-state-db-abstractdb-abstractdb.md#getinfo)*

*Defined in [packages/augur-sdk/src/state/db/AbstractDB.ts:94](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/AbstractDB.ts#L94)*

**Returns:** `Promise`<`DatabaseInfo`>

___
<a id="getorderbook"></a>

###  getOrderbook

▸ **getOrderbook**(marketData: *[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)*, numOutcomes: *`number`*, estimatedTradeGasCostInAttoDai: *`BigNumber`*): `Promise`<[Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md)>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:177](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L177)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketData | [MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md) |
| numOutcomes | `number` |
| estimatedTradeGasCostInAttoDai | `BigNumber` |

**Returns:** `Promise`<[Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md)>

___
<a id="getorderbookdata"></a>

###  getOrderbookData

▸ **getOrderbookData**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, marketId: *`string`*, marketData: *[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)*, reportingFeeDivisor: *`BigNumber`*, ETHInAttoDAI: *`BigNumber`*): `Promise`<[MarketOrderbookData](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketorderbookdata.md)>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:141](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L141)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| marketId | `string` |
| marketData | [MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md) |
| reportingFeeDivisor | `BigNumber` |
| ETHInAttoDAI | `BigNumber` |

**Returns:** `Promise`<[MarketOrderbookData](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketorderbookdata.md)>

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
<a id="handlemergeevent"></a>

###  handleMergeEvent

▸ **handleMergeEvent**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]*, syncing?: *`boolean`*): `Promise`<`number`>

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[handleMergeEvent](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:116](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L116)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| blocknumber | `number` | - |
| logs | [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[] | - |
| `Default value` syncing | `boolean` | false |

**Returns:** `Promise`<`number`>

___
<a id="processlog"></a>

### `<Protected>` processLog

▸ **processLog**(log: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)*): [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[processLog](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#processlog)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:171](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L171)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md) |

**Returns:** [BaseDocument](api-interfaces-packages-augur-sdk-src-state-db-abstractdb-basedocument.md)

___
<a id="recalcinvalidfilter"></a>

###  recalcInvalidFilter

▸ **recalcInvalidFilter**(orderbook: *[Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md)*, marketData: *[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)*, feeMultiplier: *`BigNumber`*, estimatedTradeGasCostInAttoDai: *`BigNumber`*, estimatedClaimGasCostInAttoDai: *`BigNumber`*): `Promise`<`boolean`>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:211](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L211)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderbook | [Orderbook](api-interfaces-packages-augur-sdk-src-api-liquidity-orderbook.md) |
| marketData | [MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md) |
| feeMultiplier | `BigNumber` |
| estimatedTradeGasCostInAttoDai | `BigNumber` |
| estimatedClaimGasCostInAttoDai | `BigNumber` |

**Returns:** `Promise`<`boolean`>

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[rollback](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#rollback)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:83](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L83)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Inherited from [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md).[sync](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:49](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DerivedDB.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="syncfulltextsearch"></a>

### `<Private>` syncFullTextSearch

▸ **syncFullTextSearch**(): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:247](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L247)*

**Returns:** `Promise`<`void`>

___
<a id="syncorderbooks"></a>

###  syncOrderBooks

▸ **syncOrderBooks**(syncing: *`boolean`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:98](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/MarketDB.ts#L98)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| syncing | `boolean` |

**Returns:** `Promise`<`void`>

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

