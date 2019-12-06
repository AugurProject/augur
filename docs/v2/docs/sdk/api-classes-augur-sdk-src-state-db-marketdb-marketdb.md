---
id: api-classes-augur-sdk-src-state-db-marketdb-marketdb
title: MarketDB
sidebar_label: MarketDB
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/MarketDB Module]](api-modules-augur-sdk-src-state-db-marketdb-module.md) > [MarketDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md)

## Class

Market specific derived DB intended for filtering purposes

## Hierarchy

↳  [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md)

**↳ MarketDB**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#constructor)

### Properties

* [HANDLE_MERGE_EVENT_LOCK](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#handle_merge_event_lock)
* [augur](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#augur)
* [dbName](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#dbname)
* [docProcessMap](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#docprocessmap)
* [events](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#events)
* [idFields](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#idfields)
* [isStandardRollback](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#isstandardrollback)
* [liquiditySpreads](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#liquidityspreads)
* [locks](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#locks)
* [networkId](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#networkid)
* [requiresOrder](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#requiresorder)
* [rollbackTable](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#rollbacktable)
* [rollingBack](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#rollingback)
* [stateDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#statedb)
* [syncStatus](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#syncstatus)
* [syncing](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#syncing)
* [table](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#table)

### Methods

* [allDocs](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#alldocs)
* [bulkUpsertDocuments](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#bulkupsertdocuments)
* [clearDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#cleardb)
* [clearLocks](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#clearlocks)
* [doSync](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#dosync)
* [find](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#find)
* [getDocument](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#getdocument)
* [getDocumentCount](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#getdocumentcount)
* [getIDValue](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#getidvalue)
* [getOrderBook](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#getorderbook)
* [getOrderBookData](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#getorderbookdata)
* [handleMergeEvent](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#handlemergeevent)
* [lock](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#lock)
* [processDisputeCrowdsourcerCompleted](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processdisputecrowdsourcercompleted)
* [processDoc](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processdoc)
* [processInitialReportSubmitted](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processinitialreportsubmitted)
* [processMarketCreated](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketcreated)
* [processMarketFinalized](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketfinalized)
* [processMarketMigrated](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketmigrated)
* [processMarketOIChanged](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketoichanged)
* [processMarketParticipantsDisavowed](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketparticipantsdisavowed)
* [processMarketVolumeChanged](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processmarketvolumechanged)
* [processNewBlock](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processnewblock)
* [processTimestamp](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processtimestamp)
* [processTimestampSet](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#processtimestampset)
* [recalcInvalidFilter](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#recalcinvalidfilter)
* [rollback](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#rollback)
* [rollupRollback](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#rolluprollback)
* [standardRollback](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#standardrollback)
* [sync](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#sync)
* [syncFTS](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#syncfts)
* [syncOrderBooks](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#syncorderbooks)
* [upsertDocument](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#upsertdocument)
* [waitOnLock](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md#waitonlock)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MarketDB**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, networkId: *`number`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [MarketDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md)

*Overrides [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[constructor](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#constructor)*

*Defined in [augur-sdk/src/state/db/MarketDB.ts:41](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| networkId | `number` |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [MarketDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md)

___

## Properties

<a id="handle_merge_event_lock"></a>

### `<Protected>` HANDLE_MERGE_EVENT_LOCK

**● HANDLE_MERGE_EVENT_LOCK**: *"handleMergeEvent"* = "handleMergeEvent"

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[HANDLE_MERGE_EVENT_LOCK](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handle_merge_event_lock)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:26](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L26)*

___
<a id="augur"></a>

### `<Protected>` augur

**● augur**: *`any`*

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[augur](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#augur)*

*Overrides [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[augur](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#augur)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L28)*

___
<a id="dbname"></a>

###  dbName

**● dbName**: *`string`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[dbName](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#dbname)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

___
<a id="docprocessmap"></a>

### `<Private>` docProcessMap

**● docProcessMap**: *`any`*

*Defined in [augur-sdk/src/state/db/MarketDB.ts:41](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L41)*

___
<a id="events"></a>

### `<Private>` events

**● events**: *`any`*

*Defined in [augur-sdk/src/state/db/MarketDB.ts:39](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L39)*

___
<a id="idfields"></a>

### `<Protected>` idFields

**● idFields**: *`string`[]*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[idFields](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#idfields)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___
<a id="isstandardrollback"></a>

### `<Protected>` isStandardRollback

**● isStandardRollback**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[isStandardRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#isstandardrollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L20)*

___
<a id="liquidityspreads"></a>

###  liquiditySpreads

**● liquiditySpreads**: *`number`[]* =  [10, 15, 20, 100]

*Defined in [augur-sdk/src/state/db/MarketDB.ts:40](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L40)*

___
<a id="locks"></a>

### `<Protected>` locks

**● locks**: *`object`*

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[locks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#locks)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L25)*

#### Type declaration

[name: `string`]: `boolean`

___
<a id="networkid"></a>

### `<Protected>` networkId

**● networkId**: *`number`*

*Inherited from [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[networkId](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#networkid)*

*Defined in [augur-sdk/src/state/db/AbstractTable.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/AbstractTable.ts#L14)*

___
<a id="requiresorder"></a>

### `<Protected>` requiresOrder

**● requiresOrder**: *`boolean`* = false

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[requiresOrder](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#requiresorder)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L21)*

___
<a id="rollbacktable"></a>

### `<Protected>` rollbackTable

**● rollbackTable**: *`Table`<`any`, `any`>*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollbacktable)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L21)*

___
<a id="rollingback"></a>

### `<Protected>` rollingBack

**● rollingBack**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollingBack](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollingback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L18)*

___
<a id="statedb"></a>

### `<Protected>` stateDB

**● stateDB**: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[stateDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#statedb)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L17)*

___
<a id="syncstatus"></a>

### `<Protected>` syncStatus

**● syncStatus**: *[SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[syncStatus](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#syncstatus)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L19)*

___
<a id="syncing"></a>

### `<Protected>` syncing

**● syncing**: *`boolean`*

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[syncing](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#syncing)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L17)*

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
<a id="clearlocks"></a>

### `<Protected>` clearLocks

▸ **clearLocks**(): `void`

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[clearLocks](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#clearlocks)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:155](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L155)*

**Returns:** `void`

___
<a id="dosync"></a>

###  doSync

▸ **doSync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Overrides [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[doSync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#dosync)*

*Defined in [augur-sdk/src/state/db/MarketDB.ts:73](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

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
<a id="getorderbook"></a>

###  getOrderBook

▸ **getOrderBook**(marketData: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, numOutcomes: *`number`*, estimatedTradeGasCostInAttoDai: *`BigNumber`*): `Promise`<[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:162](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L162)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketData | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| numOutcomes | `number` |
| estimatedTradeGasCostInAttoDai | `BigNumber` |

**Returns:** `Promise`<[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)>

___
<a id="getorderbookdata"></a>

###  getOrderBookData

▸ **getOrderBookData**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, marketId: *`string`*, marketData: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, reportingFeeDivisor: *`BigNumber`*, ETHInAttoDAI: *`BigNumber`*): `Promise`<[MarketOrderBookData](api-interfaces-augur-sdk-src-state-db-marketdb-marketorderbookdata.md)>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:124](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L124)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| marketId | `string` |
| marketData | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| reportingFeeDivisor | `BigNumber` |
| ETHInAttoDAI | `BigNumber` |

**Returns:** `Promise`<[MarketOrderBookData](api-interfaces-augur-sdk-src-state-db-marketdb-marketorderbookdata.md)>

___
<a id="handlemergeevent"></a>

###  handleMergeEvent

▸ **handleMergeEvent**(blocknumber: *`number`*, logs: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[]*, syncing?: *`boolean`*): `Promise`<`number`>

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[handleMergeEvent](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#handlemergeevent)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:76](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L76)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| blocknumber | `number` | - |
| logs | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)[] | - |
| `Default value` syncing | `boolean` | false |

**Returns:** `Promise`<`number`>

___
<a id="lock"></a>

### `<Protected>` lock

▸ **lock**(name: *`string`*): `void`

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[lock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#lock)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:141](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L141)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `void`

___
<a id="processdisputecrowdsourcercompleted"></a>

### `<Private>` processDisputeCrowdsourcerCompleted

▸ **processDisputeCrowdsourcerCompleted**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:268](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L268)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processdoc"></a>

### `<Protected>` processDoc

▸ **processDoc**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Overrides [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[processDoc](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#processdoc)*

*Defined in [augur-sdk/src/state/db/MarketDB.ts:218](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L218)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processinitialreportsubmitted"></a>

### `<Private>` processInitialReportSubmitted

▸ **processInitialReportSubmitted**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:260](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L260)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketcreated"></a>

### `<Private>` processMarketCreated

▸ **processMarketCreated**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:226](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L226)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketfinalized"></a>

### `<Private>` processMarketFinalized

▸ **processMarketFinalized**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:276](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L276)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketmigrated"></a>

### `<Private>` processMarketMigrated

▸ **processMarketMigrated**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:299](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L299)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketoichanged"></a>

### `<Private>` processMarketOIChanged

▸ **processMarketOIChanged**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:289](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L289)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketparticipantsdisavowed"></a>

### `<Private>` processMarketParticipantsDisavowed

▸ **processMarketParticipantsDisavowed**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:294](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L294)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processmarketvolumechanged"></a>

### `<Private>` processMarketVolumeChanged

▸ **processMarketVolumeChanged**(log: *[ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)*): [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

*Defined in [augur-sdk/src/state/db/MarketDB.ts:284](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L284)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md) |

**Returns:** [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)

___
<a id="processnewblock"></a>

###  processNewBlock

▸ **processNewBlock**(block: *`Block`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:304](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L304)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="processtimestamp"></a>

### `<Private>` processTimestamp

▸ **processTimestamp**(timestamp: *`number`*, blockNumber: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:314](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L314)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| timestamp | `number` |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="processtimestampset"></a>

###  processTimestampSet

▸ **processTimestampSet**(log: *[TimestampSetLog](api-interfaces-augur-sdk-src-state-logs-types-timestampsetlog.md)*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:309](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L309)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| log | [TimestampSetLog](api-interfaces-augur-sdk-src-state-logs-types-timestampsetlog.md) |

**Returns:** `Promise`<`void`>

___
<a id="recalcinvalidfilter"></a>

###  recalcInvalidFilter

▸ **recalcInvalidFilter**(orderbook: *[OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md)*, marketData: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, feeMultiplier: *`BigNumber`*, estimatedTradeGasCostInAttoDai: *`BigNumber`*, estimatedClaimGasCostInAttoDai: *`BigNumber`*): `Promise`<`boolean`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:193](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L193)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orderbook | [OrderBook](api-interfaces-augur-sdk-src-api-liquidity-orderbook.md) |
| marketData | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| feeMultiplier | `BigNumber` |
| estimatedTradeGasCostInAttoDai | `BigNumber` |
| estimatedClaimGasCostInAttoDai | `BigNumber` |

**Returns:** `Promise`<`boolean`>

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="rolluprollback"></a>

###  rollupRollback

▸ **rollupRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[rollupRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#rolluprollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="standardrollback"></a>

###  standardRollback

▸ **standardRollback**(blockNumber: *`number`*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[standardRollback](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#standardrollback)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(highestAvailableBlockNumber: *`number`*): `Promise`<`void`>

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[sync](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#sync)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| highestAvailableBlockNumber | `number` |

**Returns:** `Promise`<`void`>

___
<a id="syncfts"></a>

###  syncFTS

▸ **syncFTS**(): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:83](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L83)*

**Returns:** `Promise`<`void`>

___
<a id="syncorderbooks"></a>

###  syncOrderBooks

▸ **syncOrderBooks**(syncing: *`boolean`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/MarketDB.ts:91](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/MarketDB.ts#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| syncing | `boolean` |

**Returns:** `Promise`<`void`>

___
<a id="upsertdocument"></a>

### `<Protected>` upsertDocument

▸ **upsertDocument**(documentID: *[ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id)*, document: *[BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md)*): `Promise`<`void`>

*Inherited from [RollbackTable](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md).[upsertDocument](api-classes-augur-sdk-src-state-db-rollbacktable-rollbacktable.md#upsertdocument)*

*Overrides [AbstractTable](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md).[upsertDocument](api-classes-augur-sdk-src-state-db-abstracttable-abstracttable.md#upsertdocument)*

*Defined in [augur-sdk/src/state/db/RollbackTable.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/RollbackTable.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| documentID | [ID](api-modules-augur-sdk-src-state-db-abstracttable-module.md#id) |
| document | [BaseDocument](api-interfaces-augur-sdk-src-state-db-abstracttable-basedocument.md) |

**Returns:** `Promise`<`void`>

___
<a id="waitonlock"></a>

### `<Protected>` waitOnLock

▸ **waitOnLock**(lock: *`string`*, maxTimeMS: *`number`*, periodMS: *`number`*): `Promise`<`void`>

*Inherited from [DerivedDB](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md).[waitOnLock](api-classes-augur-sdk-src-state-db-deriveddb-deriveddb.md#waitonlock)*

*Defined in [augur-sdk/src/state/db/DerivedDB.ts:145](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DerivedDB.ts#L145)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| lock | `string` |
| maxTimeMS | `number` |
| periodMS | `number` |

**Returns:** `Promise`<`void`>

___

