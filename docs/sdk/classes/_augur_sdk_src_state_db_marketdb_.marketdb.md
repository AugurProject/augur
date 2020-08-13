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

* [augur](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-augur)
* [dbName](_augur_sdk_src_state_db_marketdb_.marketdb.md#readonly-dbname)
* [docProcessMap](_augur_sdk_src_state_db_marketdb_.marketdb.md#private-readonly-docprocessmap)
* [idFields](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-idfields)
* [isStandardRollback](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-isstandardrollback)
* [liquiditySpreads](_augur_sdk_src_state_db_marketdb_.marketdb.md#readonly-liquidityspreads)
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
* [bulkAddDocumentsInternal](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkadddocumentsinternal)
* [bulkPutDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkputdocuments)
* [bulkPutDocumentsInternal](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkputdocumentsinternal)
* [bulkUpsertDocuments](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkupsertdocuments)
* [bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-bulkupsertdocumentsinternal)
* [clear](_augur_sdk_src_state_db_marketdb_.marketdb.md#clear)
* [clearDB](_augur_sdk_src_state_db_marketdb_.marketdb.md#cleardb)
* [clearInternal](_augur_sdk_src_state_db_marketdb_.marketdb.md#protected-clearinternal)
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
* [setConcurrency](_augur_sdk_src_state_db_marketdb_.marketdb.md#static-setconcurrency)

## Constructors

###  constructor

\+ **new MarketDB**(`db`: [DB](_augur_sdk_src_state_db_db_.db.md), `networkId`: number, `augur`: [Augur](_augur_sdk_src_augur_.augur.md)): *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[constructor](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#constructor)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:51](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`networkId` | number |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |

**Returns:** *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

## Properties

### `Protected` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[augur](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-augur)*

*Overrides [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[augur](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-augur)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:22](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L22)*

___

### `Readonly` dbName

• **dbName**: *string*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[dbName](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#readonly-dbname)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L33)*

___

### `Private` `Readonly` docProcessMap

• **docProcessMap**: *any*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:51](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L51)*

___

### `Protected` idFields

• **idFields**: *string[]*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[idFields](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-idfields)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L34)*

___

### `Protected` isStandardRollback

• **isStandardRollback**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[isStandardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-isstandardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L20)*

___

### `Readonly` liquiditySpreads

• **liquiditySpreads**: *number[]* = [10, 15, 20, 100]

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:50](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L50)*

___

### `Protected` networkId

• **networkId**: *number*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[networkId](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-networkid)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L32)*

___

### `Protected` requiresOrder

• **requiresOrder**: *boolean* = false

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[requiresOrder](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-requiresorder)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L21)*

___

### `Protected` rollbackTable

• **rollbackTable**: *Table‹any, any›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollbacktable)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L21)*

___

### `Protected` rollingBack

• **rollingBack**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollingBack](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-rollingback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L18)*

___

### `Protected` stateDB

• **stateDB**: *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[stateDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-statedb)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L18)*

___

### `Protected` syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncStatus](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncstatus)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L19)*

___

### `Protected` syncing

• **syncing**: *boolean*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[syncing](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-syncing)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[syncing](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-syncing)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L17)*

___

###  table

• **table**: *Table‹any, any›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[table](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#table)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:31](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L31)*

## Methods

###  allDocs

▸ **allDocs**(): *Promise‹any[]›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[allDocs](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#alldocs)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L85)*

**Returns:** *Promise‹any[]›*

___

### `Protected` bulkAddDocuments

▸ **bulkAddDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:131](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkAddDocumentsInternal

▸ **bulkAddDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkAddDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkadddocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:149](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L149)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocuments

▸ **bulkPutDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:135](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L135)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |
`documentIds?` | any[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkPutDocumentsInternal

▸ **bulkPutDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[], `documentIds?`: any[]): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[bulkPutDocumentsInternal](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#protected-bulkputdocumentsinternal)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkPutDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkputdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L32)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:139](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L139)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

### `Protected` bulkUpsertDocumentsInternal

▸ **bulkUpsertDocumentsInternal**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[bulkUpsertDocumentsInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-bulkupsertdocumentsinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:178](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L178)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  clear

▸ **clear**(): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[clear](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#clear)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clear](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#clear)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L52)*

**Returns:** *Promise‹void›*

___

###  clearDB

▸ **clearDB**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearDB](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#cleardb)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:78](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L78)*

**Returns:** *Promise‹void›*

___

### `Protected` clearInternal

▸ **clearInternal**(): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[clearInternal](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-clearinternal)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:143](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L143)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[delete](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#delete)*

*Overrides [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[delete](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#delete)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:45](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L45)*

**Returns:** *Promise‹void›*

___

###  doSync

▸ **doSync**(`highestAvailableBlockNumber`: number): *Promise‹void›*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[doSync](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#dosync)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:120](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L120)*

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber` | number |

**Returns:** *Promise‹void›*

___

###  find

▸ **find**(`request`: object): *Promise‹Collection‹any, any››*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[find](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#find)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:204](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L204)*

**Parameters:**

Name | Type |
------ | ------ |
`request` | object |

**Returns:** *Promise‹Collection‹any, any››*

___

###  getAllWarpSyncMarkets

▸ **getAllWarpSyncMarkets**(): *Promise‹MarketData[]›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:313](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L313)*

**Returns:** *Promise‹MarketData[]›*

___

### `Protected` getDocument

▸ **getDocument**‹**Document**›(`id`: string): *Promise‹Document | undefined›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[getDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-getdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:115](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L115)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:108](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L108)*

**Returns:** *Promise‹number›*

___

###  getEvents

▸ **getEvents**(`highestSyncedBlockNumber`: number, `eventName`: string): *Promise‹[BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[getEvents](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#getevents)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:117](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L117)*

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

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:208](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L208)*

**Parameters:**

Name | Type |
------ | ------ |
`document` | any |

**Returns:** *[ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id)*

___

###  getOrderBook

▸ **getOrderBook**(`marketData`: MarketData, `numOutcomes`: number): *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:320](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L320)*

**Parameters:**

Name | Type |
------ | ------ |
`marketData` | MarketData |
`numOutcomes` | number |

**Returns:** *Promise‹[OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md)›*

___

###  getOrderBookData

▸ **getOrderBookData**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `marketId`: string, `marketData`: MarketData, `reportingFeeDivisor`: BigNumber, `ETHInAttoDAI`: BigNumber, `gasLevels`: GasStation): *Promise‹[MarketOrderBookData](../interfaces/_augur_sdk_src_state_db_marketdb_.marketorderbookdata.md)›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:193](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`marketId` | string |
`marketData` | MarketData |
`reportingFeeDivisor` | BigNumber |
`ETHInAttoDAI` | BigNumber |
`gasLevels` | GasStation |

**Returns:** *Promise‹[MarketOrderBookData](../interfaces/_augur_sdk_src_state_db_marketdb_.marketorderbookdata.md)›*

___

###  handleMergeEvent

▸ **handleMergeEvent**(`blocknumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[], `syncing`: boolean): *Promise‹number›*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[handleMergeEvent](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#handlemergeevent)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:129](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L129)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`blocknumber` | number | - |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] | - |
`syncing` | boolean | false |

**Returns:** *Promise‹number›*

___

###  hasRecentlyDepletedLiquidity

▸ **hasRecentlyDepletedLiquidity**(`marketData`: MarketData, `currentLiquiditySpreads`: any, `currentLastPassingLiquidityCheck`: any): *Promise‹boolean›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:691](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L691)*

**Parameters:**

Name | Type |
------ | ------ |
`marketData` | MarketData |
`currentLiquiditySpreads` | any |
`currentLastPassingLiquidityCheck` | any |

**Returns:** *Promise‹boolean›*

___

###  markMarketLiquidityAsDirty

▸ **markMarketLiquidityAsDirty**(`marketId`: string): *void*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:189](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`marketId` | string |

**Returns:** *void*

___

###  onBulkSyncComplete

▸ **onBulkSyncComplete**(): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[onBulkSyncComplete](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#onbulksynccomplete)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:56](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L56)*

**Returns:** *Promise‹void›*

___

### `Private` processDisputeCrowdsourcerCompleted

▸ **processDisputeCrowdsourcerCompleted**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:573](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L573)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Protected` processDoc

▸ **processDoc**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Overrides [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[processDoc](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#protected-processdoc)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:455](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L455)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processInitialReportSubmitted

▸ **processInitialReportSubmitted**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:565](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L565)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketCreated

▸ **processMarketCreated**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:467](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L467)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketFinalized

▸ **processMarketFinalized**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:583](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L583)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketMigrated

▸ **processMarketMigrated**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:608](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L608)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketOIChanged

▸ **processMarketOIChanged**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:598](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L598)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketParticipantsDisavowed

▸ **processMarketParticipantsDisavowed**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:603](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L603)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

### `Private` processMarketVolumeChanged

▸ **processMarketVolumeChanged**(`log`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:591](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L591)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md) |

**Returns:** *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)*

___

###  processNewBlock

▸ **processNewBlock**(`block`: NewBlock): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:613](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L613)*

**Parameters:**

Name | Type |
------ | ------ |
`block` | NewBlock |

**Returns:** *Promise‹void›*

___

### `Private` processTimestamp

▸ **processTimestamp**(`timestamp`: [UnixTimestamp](../modules/_augur_sdk_src_state_index_.md#unixtimestamp), `blockNumber`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:625](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L625)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | [UnixTimestamp](../modules/_augur_sdk_src_state_index_.md#unixtimestamp) |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  processTimestampSet

▸ **processTimestampSet**(`log`: TimestampSetLog): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:620](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L620)*

**Parameters:**

Name | Type |
------ | ------ |
`log` | TimestampSetLog |

**Returns:** *Promise‹void›*

___

###  prune

▸ **prune**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[prune](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#prune)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:108](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  recalcInvalidFilter

▸ **recalcInvalidFilter**(`orderbook`: [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md), `marketData`: MarketData, `feeMultiplier`: BigNumber, `estimatedTradeGasCostInAttoDai`: BigNumber, `estimatedClaimGasCostInAttoDai`: BigNumber): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:399](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L399)*

**Parameters:**

Name | Type |
------ | ------ |
`orderbook` | [OrderBook](../interfaces/_augur_sdk_src_api_liquidity_.orderbook.md) |
`marketData` | MarketData |
`feeMultiplier` | BigNumber |
`estimatedTradeGasCostInAttoDai` | BigNumber |
`estimatedClaimGasCostInAttoDai` | BigNumber |

**Returns:** *Promise‹number›*

___

###  rollback

▸ **rollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:61](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  rollupRollback

▸ **rollupRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[rollupRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#rolluprollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:79](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

### `Protected` saveDocuments

▸ **saveDocuments**(`documents`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[]): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[saveDocuments](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-savedocuments)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:191](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`documents` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)[] |

**Returns:** *Promise‹void›*

___

###  standardRollback

▸ **standardRollback**(`blockNumber`: number): *Promise‹void›*

*Inherited from [RollbackTable](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md).[standardRollback](_augur_sdk_src_state_db_rollbacktable_.rollbacktable.md#standardrollback)*

*Defined in [packages/augur-sdk/src/state/db/RollbackTable.ts:73](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/RollbackTable.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  sync

▸ **sync**(`highestAvailableBlockNumber`: number): *Promise‹void›*

*Inherited from [DerivedDB](_augur_sdk_src_state_db_deriveddb_.deriveddb.md).[sync](_augur_sdk_src_state_db_deriveddb_.deriveddb.md#sync)*

*Defined in [packages/augur-sdk/src/state/db/DerivedDB.ts:63](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DerivedDB.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber` | number |

**Returns:** *Promise‹void›*

___

###  syncFTS

▸ **syncFTS**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:112](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L112)*

**Returns:** *Promise‹void›*

___

###  syncOrderBooks

▸ **syncOrderBooks**(`marketIds`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/MarketDB.ts:140](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/MarketDB.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`marketIds` | string[] |

**Returns:** *Promise‹void›*

___

### `Protected` upsertDocument

▸ **upsertDocument**(`documentID`: [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id), `document`: [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md)): *Promise‹void›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[upsertDocument](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#protected-upsertdocument)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:195](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`documentID` | [ID](../modules/_augur_sdk_src_state_db_abstracttable_.md#id) |
`document` | [BaseDocument](../interfaces/_augur_sdk_src_state_db_abstracttable_.basedocument.md) |

**Returns:** *Promise‹void›*

___

### `Static` setConcurrency

▸ **setConcurrency**(`limit`: number): *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*

*Inherited from [AbstractTable](_augur_sdk_src_state_db_abstracttable_.abstracttable.md).[setConcurrency](_augur_sdk_src_state_db_abstracttable_.abstracttable.md#static-setconcurrency)*

*Defined in [packages/augur-sdk/src/state/db/AbstractTable.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/AbstractTable.ts#L37)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`limit` | number | DEFAULT_CONCURRENCY |

**Returns:** *AsyncQueue‹[WriteQueueTask](../interfaces/_augur_sdk_src_state_db_abstracttable_.writequeuetask.md)›*
