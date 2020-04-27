[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/MarketDB"](../modules/_augur_sdk_src_state_db_marketdb_.md) › [MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)

# Class: MarketDB

Market specific derived DB intended for filtering purposes

## Hierarchy

  ↳ [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md)

  ↳ **MarketDB**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_marketdb_.marketdb.md#constructor)

### Properties

* [HANDLE_MERGE_EVENT_LOCK](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-handle_merge_event_lock)
* [augur](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-augur)
* [dbName](_augur_sdk_src_state_db_marketdb_.marketdb.md#dbname)
* [docProcessMap](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-docprocessmap)
* [idFields](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-idfields)
* [isStandardRollback](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-isstandardrollback)
* [liquiditySpreads](_augur_sdk_src_state_db_marketdb_.marketdb.md#liquidityspreads)
* [locks](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-locks)
* [networkId](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-networkid)
* [requiresOrder](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-requiresorder)
* [rollbackTable](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-rollbacktable)
* [rollingBack](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-rollingback)
* [stateDB](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-statedb)
* [syncStatus](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-syncstatus)
* [syncing](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-syncing)
* [table](_augur_sdk_src_state_db_marketdb_.marketdb.md#table)

### Methods

* [allDocs](_augur_sdk_src_state_db_marketdb_.marketdb.md#alldocs)
* [bulkAddDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkadddocuments)
* [bulkPutDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkputdocuments)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkupsertdocuments)
* [clearDB](_augur_sdk_src_state_db_marketdb_.marketdb.md#cleardb)
* [clearLocks](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-clearlocks)
* [delete](_augur_sdk_src_state_db_marketdb_.marketdb.md#delete)
* [doSync](_augur_sdk_src_state_db_marketdb_.marketdb.md#dosync)
* [find](_augur_sdk_src_state_db_marketdb_.marketdb.md#find)
* [getAllWarpSyncMarkets](_augur_sdk_src_state_db_marketdb_.marketdb.md#getallwarpsyncmarkets)
* [getDocument](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-getdocument)
* [getDocumentCount](_augur_sdk_src_state_db_marketdb_.marketdb.md#getdocumentcount)
* [getEvents](_augur_sdk_src_state_db_marketdb_.marketdb.md#getevents)
* [getIDValue](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-getidvalue)
* [getOrderBook](_augur_sdk_src_state_db_marketdb_.marketdb.md#getorderbook)
* [getOrderBookData](_augur_sdk_src_state_db_marketdb_.marketdb.md#getorderbookdata)
* [handleMergeEvent](_augur_sdk_src_state_db_marketdb_.marketdb.md#handlemergeevent)
* [hasRecentlyDepletedLiquidity](_augur_sdk_src_state_db_marketdb_.marketdb.md#hasrecentlydepletedliquidity)
* [lock](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-lock)
* [markMarketLiquidityAsDirty](_augur_sdk_src_state_db_marketdb_.marketdb.md#markmarketliquidityasdirty)
* [onBulkSyncComplete](_augur_sdk_src_state_db_marketdb_.marketdb.md#onbulksynccomplete)
* [processDisputeCrowdsourcerCompleted](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processdisputecrowdsourcercompleted)
* [processDoc](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-processdoc)
* [processInitialReportSubmitted](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processinitialreportsubmitted)
* [processMarketCreated](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketcreated)
* [processMarketFinalized](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketfinalized)
* [processMarketMigrated](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketmigrated)
* [processMarketOIChanged](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketoichanged)
* [processMarketParticipantsDisavowed](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketparticipantsdisavowed)
* [processMarketVolumeChanged](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processmarketvolumechanged)
* [processNewBlock](_augur_sdk_src_state_db_marketdb_.marketdb.md#processnewblock)
* [processTimestamp](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-processtimestamp)
* [processTimestampSet](_augur_sdk_src_state_db_marketdb_.marketdb.md#processtimestampset)
* [prune](_augur_sdk_src_state_db_marketdb_.marketdb.md#prune)
* [recalcInvalidFilter](_augur_sdk_src_state_db_marketdb_.marketdb.md#recalcinvalidfilter)
* [rollback](_augur_sdk_src_state_db_marketdb_.marketdb.md#rollback)
* [rollupRollback](_augur_sdk_src_state_db_marketdb_.marketdb.md#rolluprollback)
* [saveDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-savedocuments)
* [standardRollback](_augur_sdk_src_state_db_marketdb_.marketdb.md#standardrollback)
* [sync](_augur_sdk_src_state_db_marketdb_.marketdb.md#sync)
* [syncFTS](_augur_sdk_src_state_db_marketdb_.marketdb.md#syncfts)
* [syncOrderBooks](_augur_sdk_src_state_db_marketdb_.marketdb.md#syncorderbooks)
* [upsertDocument](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-upsertdocument)
* [waitOnLock](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-waitonlock)

## Constructors

###  constructor

\+ **new MarketDB**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[constructor](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L48)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

## Properties

### `Protected` HANDLE_MERGE_EVENT_LOCK

• **HANDLE_MERGE_EVENT_LOCK**: *"handleMergeEvent"* = "handleMergeEvent"

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[HANDLE_MERGE_EVENT_LOCK](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-handle_merge_event_lock)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L27)*

___

### `Protected` augur

• **augur**: *any*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[augur](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-augur)*

*Overrides [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[augur](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-augur)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:29](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L29)*

___

###  dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L17)*

___

### `Private` docProcessMap

• **docProcessMap**: *any*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L48)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L18)*

___

### `Protected` isStandardRollback

• **isStandardRollback**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[isStandardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-isstandardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:23](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L23)*

___

###  liquiditySpreads

• **liquiditySpreads**: *number[]* = [10, 15, 20, 100]

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:47](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L47)*

___

### `Protected` locks

• **locks**: *object*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[locks](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-locks)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:26](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L26)*

#### Type declaration:

* \[ **name**: *string*\]: boolean

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L16)*

___

### `Protected` requiresOrder

• **requiresOrder**: *boolean* = false

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[requiresOrder](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-requiresorder)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L22)*

___

### `Protected` rollbackTable

• **rollbackTable**: *Table‹any, any›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollbacktable)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L24)*

___

### `Protected` rollingBack

• **rollingBack**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollingBack](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollingback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L21)*

___

### `Protected` stateDB

• **stateDB**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[stateDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-statedb)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

___

### `Protected` syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncStatus](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncstatus)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L22)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncing](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncing)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L20)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L15)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L35)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[bulkPutDocuments](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-bulkputdocuments)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocuments

▸ **bulkUpsertDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L30)*

**Returns:** *Promise‹void›*

___

### `Protected` clearLocks

▸ **clearLocks**(): *void*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[clearLocks](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-clearlocks)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:170](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L170)*

**Returns:** *void*

___

###  delete

▸ **delete**(): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[delete](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#delete)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:49](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L49)*

**Returns:** *Promise‹void›*

___

###  doSync

▸ **doSync**(`highestAvailableBlockNumber`: number): *Promise‹void›*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[doSync](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#dosync)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:101](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber` | number |

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:94](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

###  getAllWarpSyncMarkets

▸ **getAllWarpSyncMarkets**(): *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:248](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L248)*

**Returns:** *Promise‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)[]›*

___

### `Protected` getDocument

▸ **getDocument**<**Document**>(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L52)*

**Type parameters:**

▪ **Document**

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹Document | undefined›*

___

###  getDocumentCount

▸ **getDocumentCount**(): *Promise‹number›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocumentCount](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#getdocumentcount)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:48](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L48)*

**Returns:** *Promise‹number›*

___

###  getEvents

▸ **getEvents**(`highestSyncedBlockNumber`: number, `eventName`: string): *Promise‹[BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[getEvents](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#getevents)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:107](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`highestSyncedBlockNumber` | number |
`eventName` | string |

**Returns:** *Promise‹[BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]›*

___

### `Protected` getIDValue

▸ **getIDValue**(`document`: any): *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getIDValue](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getidvalue)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:98](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

###  getOrderBook

▸ **getOrderBook**(`marketData`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `numOutcomes`: number): *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:255](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L255)*

**Parameters:**

Name | Type |
------ | ------ |
`marketData` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`numOutcomes` | number |

**Returns:** *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

___

###  getOrderBookData

▸ **getOrderBookData**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `marketId`: string, `marketData`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `reportingFeeDivisor`: BigNumber, `ETHInAttoDAI`: BigNumber, `isFirstSync`: Boolean): *Promise‹[MarketOrderBookData](../interfaces/_augur_sdk_src_state_db_marketdb_.marketorderbookdata.md)›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:165](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L165)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`marketId` | string |
`marketData` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`reportingFeeDivisor` | BigNumber |
`ETHInAttoDAI` | BigNumber |
`isFirstSync` | Boolean |

**Returns:** *Promise‹[MarketOrderBookData](../interfaces/_augur_sdk_src_state_db_marketdb_.marketorderbookdata.md)›*

___

###  handleMergeEvent

▸ **handleMergeEvent**(`blocknumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[], `syncing`: boolean): *Promise‹number›*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[handleMergeEvent](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#handlemergeevent)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:112](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L112)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`blocknumber` | number | - |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] | - |
`syncing` | boolean | false |

**Returns:** *Promise‹number›*

___

###  hasRecentlyDepletedLiquidity

▸ **hasRecentlyDepletedLiquidity**(`marketData`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `currentLiquiditySpreads`: any, `currentLastPassingLiquidityCheck`: any): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:508](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L508)*

**Parameters:**

Name | Type |
------ | ------ |
`marketData` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`currentLiquiditySpreads` | any |
`currentLastPassingLiquidityCheck` | any |

**Returns:** *Promise‹boolean›*

___

### `Protected` lock

▸ **lock**(`name`: string): *void*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[lock](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-lock)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:156](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *void*

___

###  markMarketLiquidityAsDirty

▸ **markMarketLiquidityAsDirty**(`marketId`: string): *void*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:161](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L161)*

**Parameters:**

Name | Type |
------ | ------ |
`marketId` | string |

**Returns:** *void*

___

###  onBulkSyncComplete

▸ **onBulkSyncComplete**(): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[onBulkSyncComplete](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#onbulksynccomplete)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:53](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L53)*

**Returns:** *Promise‹void›*

___

### `Private` processDisputeCrowdsourcerCompleted

▸ **processDisputeCrowdsourcerCompleted**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:417](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L417)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Protected` processDoc

▸ **processDoc**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[processDoc](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-processdoc)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:339](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L339)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processInitialReportSubmitted

▸ **processInitialReportSubmitted**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:409](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L409)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketCreated

▸ **processMarketCreated**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:354](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L354)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketFinalized

▸ **processMarketFinalized**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:425](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L425)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketMigrated

▸ **processMarketMigrated**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:449](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L449)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketOIChanged

▸ **processMarketOIChanged**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:439](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L439)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketParticipantsDisavowed

▸ **processMarketParticipantsDisavowed**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:444](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L444)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketVolumeChanged

▸ **processMarketVolumeChanged**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:433](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L433)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

###  processNewBlock

▸ **processNewBlock**(`block`: [NewBlock](../interfaces/_augur_sdk_src_event_handlers_.newblock.md)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:454](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L454)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | [NewBlock](../interfaces/_augur_sdk_src_event_handlers_.newblock.md) |

**Returns:** *Promise‹void›*

___

### `Private` processTimestamp

▸ **processTimestamp**(`timestamp`: [UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp), `blockNumber`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:463](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L463)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | [UnixTimestamp](../modules/_augur_sdk_src_state_logs_types_.md#unixtimestamp) |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  processTimestampSet

▸ **processTimestampSet**(`log`: [TimestampSetLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampsetlog.md)): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:458](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L458)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [TimestampSetLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampsetlog.md) |

**Returns:** *Promise‹void›*

___

###  prune

▸ **prune**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[prune](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#prune)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:111](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  recalcInvalidFilter

▸ **recalcInvalidFilter**(`orderbook`: [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md), `marketData`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `feeMultiplier`: BigNumber, `estimatedTradeGasCostInAttoDai`: BigNumber, `estimatedClaimGasCostInAttoDai`: BigNumber): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:314](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L314)*

**Parameters:**

Name | Type |
------ | ------ |
`orderbook` | [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md) |
`marketData` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`feeMultiplier` | BigNumber |
`estimatedTradeGasCostInAttoDai` | BigNumber |
`estimatedClaimGasCostInAttoDai` | BigNumber |

**Returns:** *Promise‹number›*

___

###  rollback

▸ **rollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:64](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  rollupRollback

▸ **rollupRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollupRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rolluprollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:82](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:81](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  standardRollback

▸ **standardRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[standardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#standardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:76](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/RollbackTable.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  sync

▸ **sync**(`highestAvailableBlockNumber`: number): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[sync](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#sync)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber` | number |

**Returns:** *Promise‹void›*

___

###  syncFTS

▸ **syncFTS**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:93](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L93)*

**Returns:** *Promise‹void›*

___

###  syncOrderBooks

▸ **syncOrderBooks**(`marketIds`: string[], `isFirstSync`: boolean): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:126](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/MarketDB.ts#L126)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`marketIds` | string[] | - |
`isFirstSync` | boolean | false |

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*

___

### `Protected` waitOnLock

▸ **waitOnLock**(`lock`: string, `maxTimeMS`: number, `periodMS`: number): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[waitOnLock](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-waitonlock)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:160](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DerivedDB.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`lock` | string |
`maxTimeMS` | number |
`periodMS` | number |

**Returns:** *Promise‹void›*
