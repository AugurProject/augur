[@augurproject/sdk](../README.md) > ["state/db/DB"](../modules/_state_db_db_.md) > [DB](../classes/_state_db_db_.db.md)

# Class: DB

## Hierarchy

**DB**

## Index

### Constructors

* [constructor](_state_db_db_.db.md#constructor)

### Properties

* [blockAndLogStreamerListener](_state_db_db_.db.md#blockandlogstreamerlistener)
* [blockstreamDelay](_state_db_db_.db.md#blockstreamdelay)
* [customEvents](_state_db_db_.db.md#customevents)
* [genericEventNames](_state_db_db_.db.md#genericeventnames)
* [metaDatabase](_state_db_db_.db.md#metadatabase)
* [networkId](_state_db_db_.db.md#networkid)
* [pouchDBFactory](_state_db_db_.db.md#pouchdbfactory)
* [syncStatus](_state_db_db_.db.md#syncstatus)
* [syncableDatabases](_state_db_db_.db.md#syncabledatabases)
* [trackedUsers](_state_db_db_.db.md#trackedusers)
* [userSpecificEvents](_state_db_db_.db.md#userspecificevents)

### Methods

* [addNewBlock](_state_db_db_.db.md#addnewblock)
* [findCompleteSetsPurchasedLogs](_state_db_db_.db.md#findcompletesetspurchasedlogs)
* [findCompleteSetsSoldLogs](_state_db_db_.db.md#findcompletesetssoldlogs)
* [findCurrentOrders](_state_db_db_.db.md#findcurrentorders)
* [findDisputeCrowdsourcerCompletedLogs](_state_db_db_.db.md#finddisputecrowdsourcercompletedlogs)
* [findDisputeCrowdsourcerContributionLogs](_state_db_db_.db.md#finddisputecrowdsourcercontributionlogs)
* [findDisputeCrowdsourcerRedeemedLogs](_state_db_db_.db.md#finddisputecrowdsourcerredeemedlogs)
* [findDisputeWindowCreatedLogs](_state_db_db_.db.md#finddisputewindowcreatedlogs)
* [findInMetaDB](_state_db_db_.db.md#findinmetadb)
* [findInSyncableDB](_state_db_db_.db.md#findinsyncabledb)
* [findInitialReportSubmittedLogs](_state_db_db_.db.md#findinitialreportsubmittedlogs)
* [findInitialReporterRedeemedLogs](_state_db_db_.db.md#findinitialreporterredeemedlogs)
* [findMarketCreatedLogs](_state_db_db_.db.md#findmarketcreatedlogs)
* [findMarketFinalizedLogs](_state_db_db_.db.md#findmarketfinalizedlogs)
* [findMarketMigratedLogs](_state_db_db_.db.md#findmarketmigratedlogs)
* [findMarketVolumeChangedLogs](_state_db_db_.db.md#findmarketvolumechangedlogs)
* [findOrderCanceledLogs](_state_db_db_.db.md#findordercanceledlogs)
* [findOrderCreatedLogs](_state_db_db_.db.md#findordercreatedlogs)
* [findOrderFilledLogs](_state_db_db_.db.md#findorderfilledlogs)
* [findOrderPriceChangedLogs](_state_db_db_.db.md#findorderpricechangedlogs)
* [findParticipationTokensRedeemedLogs](_state_db_db_.db.md#findparticipationtokensredeemedlogs)
* [findProfitLossChangedLogs](_state_db_db_.db.md#findprofitlosschangedlogs)
* [findTimestampSetLogs](_state_db_db_.db.md#findtimestampsetlogs)
* [findTokenBalanceChangedLogs](_state_db_db_.db.md#findtokenbalancechangedlogs)
* [findTradingProceedsClaimedLogs](_state_db_db_.db.md#findtradingproceedsclaimedlogs)
* [findUniverseForkedLogs](_state_db_db_.db.md#finduniverseforkedlogs)
* [fullTextSearch](_state_db_db_.db.md#fulltextsearch)
* [getAllSequenceIds](_state_db_db_.db.md#getallsequenceids)
* [getDatabaseName](_state_db_db_.db.md#getdatabasename)
* [getSyncStartingBlock](_state_db_db_.db.md#getsyncstartingblock)
* [getSyncableDatabase](_state_db_db_.db.md#getsyncabledatabase)
* [initializeDB](_state_db_db_.db.md#initializedb)
* [notifySyncableDBAdded](_state_db_db_.db.md#notifysyncabledbadded)
* [registerEventListener](_state_db_db_.db.md#registereventlistener)
* [rollback](_state_db_db_.db.md#rollback)
* [sync](_state_db_db_.db.md#sync)
* [createAndInitializeDB](_state_db_db_.db.md#createandinitializedb)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DB**(pouchDBFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*): [DB](_state_db_db_.db.md)

*Defined in [state/db/DB.ts:45](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L45)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| pouchDBFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |

**Returns:** [DB](_state_db_db_.db.md)

___

## Properties

<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)*

*Defined in [state/db/DB.ts:43](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L43)*

___
<a id="blockstreamdelay"></a>

### `<Private>` blockstreamDelay

**● blockstreamDelay**: *`number`*

*Defined in [state/db/DB.ts:36](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L36)*

___
<a id="customevents"></a>

### `<Private>` customEvents

**● customEvents**: *`Array`<[CustomEvent](../interfaces/_augur_.customevent.md)>*

*Defined in [state/db/DB.ts:39](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L39)*

___
<a id="genericeventnames"></a>

### `<Private>` genericEventNames

**● genericEventNames**: *`Array`<`string`>*

*Defined in [state/db/DB.ts:38](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L38)*

___
<a id="metadatabase"></a>

### `<Private>` metaDatabase

**● metaDatabase**: *[MetaDB](_state_db_metadb_.metadb.md)*

*Defined in [state/db/DB.ts:42](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L42)*

___
<a id="networkid"></a>

### `<Private>` networkId

**● networkId**: *`number`*

*Defined in [state/db/DB.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L35)*

___
<a id="pouchdbfactory"></a>

###  pouchDBFactory

**● pouchDBFactory**: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*

*Defined in [state/db/DB.ts:44](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L44)*

___
<a id="syncstatus"></a>

###  syncStatus

**● syncStatus**: *[SyncStatus](_state_db_syncstatus_.syncstatus.md)*

*Defined in [state/db/DB.ts:45](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L45)*

___
<a id="syncabledatabases"></a>

### `<Private>` syncableDatabases

**● syncableDatabases**: *`object`*

*Defined in [state/db/DB.ts:41](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L41)*

#### Type declaration

[dbName: `string`]: [SyncableDB](_state_db_syncabledb_.syncabledb.md)

___
<a id="trackedusers"></a>

### `<Private>` trackedUsers

**● trackedUsers**: *[TrackedUsers](_state_db_trackedusers_.trackedusers.md)*

*Defined in [state/db/DB.ts:37](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L37)*

___
<a id="userspecificevents"></a>

### `<Private>` userSpecificEvents

**● userSpecificEvents**: *`Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)>*

*Defined in [state/db/DB.ts:40](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L40)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(dbName: *`string`*, blockLogs: *`any`*): `Promise`<`void`>

*Defined in [state/db/DB.ts:321](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L321)*

Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.

TODO Define blockLogs interface

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  Name of the database to which the block should be added |
| blockLogs | `any` |  Logs from a new block |

**Returns:** `Promise`<`void`>

___
<a id="findcompletesetspurchasedlogs"></a>

###  findCompleteSetsPurchasedLogs

▸ **findCompleteSetsPurchasedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md)>>

*Defined in [state/db/DB.ts:370](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L370)*

Queries the CompleteSetsPurchased DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[CompleteSetsPurchasedLog](../interfaces/_state_logs_types_.completesetspurchasedlog.md)>>

___
<a id="findcompletesetssoldlogs"></a>

###  findCompleteSetsSoldLogs

▸ **findCompleteSetsSoldLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)>>

*Defined in [state/db/DB.ts:381](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L381)*

Queries the CompleteSetsSold DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[CompleteSetsSoldLog](../interfaces/_state_logs_types_.completesetssoldlog.md)>>

___
<a id="findcurrentorders"></a>

###  findCurrentOrders

▸ **findCurrentOrders**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

*Defined in [state/db/DB.ts:627](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L627)*

Queries the CurrentOrders DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

___
<a id="finddisputecrowdsourcercompletedlogs"></a>

###  findDisputeCrowdsourcerCompletedLogs

▸ **findDisputeCrowdsourcerCompletedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerCompletedLog](../interfaces/_state_logs_types_.disputecrowdsourcercompletedlog.md)>>

*Defined in [state/db/DB.ts:392](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L392)*

Queries the DisputeCrowdsourcerCompleted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerCompletedLog](../interfaces/_state_logs_types_.disputecrowdsourcercompletedlog.md)>>

___
<a id="finddisputecrowdsourcercontributionlogs"></a>

###  findDisputeCrowdsourcerContributionLogs

▸ **findDisputeCrowdsourcerContributionLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)>>

*Defined in [state/db/DB.ts:403](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L403)*

Queries the DisputeCrowdsourcerContribution DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerContributionLog](../interfaces/_state_logs_types_.disputecrowdsourcercontributionlog.md)>>

___
<a id="finddisputecrowdsourcerredeemedlogs"></a>

###  findDisputeCrowdsourcerRedeemedLogs

▸ **findDisputeCrowdsourcerRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)>>

*Defined in [state/db/DB.ts:414](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L414)*

Queries the DisputeCrowdsourcerRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerRedeemedLog](../interfaces/_state_logs_types_.disputecrowdsourcerredeemedlog.md)>>

___
<a id="finddisputewindowcreatedlogs"></a>

###  findDisputeWindowCreatedLogs

▸ **findDisputeWindowCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeWindowCreatedLog](../interfaces/_state_logs_types_.disputewindowcreatedlog.md)>>

*Defined in [state/db/DB.ts:425](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L425)*

Queries the DisputeWindowCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeWindowCreatedLog](../interfaces/_state_logs_types_.disputewindowcreatedlog.md)>>

___
<a id="findinmetadb"></a>

###  findInMetaDB

▸ **findInMetaDB**(request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [state/db/DB.ts:360](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L360)*

Queries the MetaDB.

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>
> > } Promise to a FindResponse

___
<a id="findinsyncabledb"></a>

###  findInSyncableDB

▸ **findInSyncableDB**(dbName: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [state/db/DB.ts:350](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L350)*

Queries a SyncableDB.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  Name of the SyncableDB to query |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>
> > } Promise to a FindResponse

___
<a id="findinitialreportsubmittedlogs"></a>

###  findInitialReportSubmittedLogs

▸ **findInitialReportSubmittedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)>>

*Defined in [state/db/DB.ts:447](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L447)*

Queries the InitialReportSubmitted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[InitialReportSubmittedLog](../interfaces/_state_logs_types_.initialreportsubmittedlog.md)>>

___
<a id="findinitialreporterredeemedlogs"></a>

###  findInitialReporterRedeemedLogs

▸ **findInitialReporterRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md)>>

*Defined in [state/db/DB.ts:436](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L436)*

Queries the InitialReporterRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[InitialReporterRedeemedLog](../interfaces/_state_logs_types_.initialreporterredeemedlog.md)>>

___
<a id="findmarketcreatedlogs"></a>

###  findMarketCreatedLogs

▸ **findMarketCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)>>

*Defined in [state/db/DB.ts:458](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L458)*

Queries the MarketCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketCreatedLog](../interfaces/_state_logs_types_.marketcreatedlog.md)>>

___
<a id="findmarketfinalizedlogs"></a>

###  findMarketFinalizedLogs

▸ **findMarketFinalizedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketFinalizedLog](../interfaces/_state_logs_types_.marketfinalizedlog.md)>>

*Defined in [state/db/DB.ts:469](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L469)*

Queries the MarketFinalized DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketFinalizedLog](../interfaces/_state_logs_types_.marketfinalizedlog.md)>>

___
<a id="findmarketmigratedlogs"></a>

###  findMarketMigratedLogs

▸ **findMarketMigratedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketMigratedLog](../interfaces/_state_logs_types_.marketmigratedlog.md)>>

*Defined in [state/db/DB.ts:480](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L480)*

Queries the MarketMigrated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketMigratedLog](../interfaces/_state_logs_types_.marketmigratedlog.md)>>

___
<a id="findmarketvolumechangedlogs"></a>

###  findMarketVolumeChangedLogs

▸ **findMarketVolumeChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketVolumeChangedLog](../interfaces/_state_logs_types_.marketvolumechangedlog.md)>>

*Defined in [state/db/DB.ts:491](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L491)*

Queries the MarketVolumeChanged DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketVolumeChangedLog](../interfaces/_state_logs_types_.marketvolumechangedlog.md)>>

___
<a id="findordercanceledlogs"></a>

###  findOrderCanceledLogs

▸ **findOrderCanceledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

*Defined in [state/db/DB.ts:502](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L502)*

Queries the OrderEvent DB for Cancel events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

___
<a id="findordercreatedlogs"></a>

###  findOrderCreatedLogs

▸ **findOrderCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

*Defined in [state/db/DB.ts:516](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L516)*

Queries the OrderEvent DB for Create events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

___
<a id="findorderfilledlogs"></a>

###  findOrderFilledLogs

▸ **findOrderFilledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

*Defined in [state/db/DB.ts:530](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L530)*

Queries the OrderFilled DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

___
<a id="findorderpricechangedlogs"></a>

###  findOrderPriceChangedLogs

▸ **findOrderPriceChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

*Defined in [state/db/DB.ts:544](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L544)*

Queries the OrderFilled DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[OrderEventLog](../interfaces/_state_logs_types_.ordereventlog.md)>>

___
<a id="findparticipationtokensredeemedlogs"></a>

###  findParticipationTokensRedeemedLogs

▸ **findParticipationTokensRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParticipationTokensRedeemedLog](../interfaces/_state_logs_types_.participationtokensredeemedlog.md)>>

*Defined in [state/db/DB.ts:558](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L558)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParticipationTokensRedeemedLog](../interfaces/_state_logs_types_.participationtokensredeemedlog.md)>>

___
<a id="findprofitlosschangedlogs"></a>

###  findProfitLossChangedLogs

▸ **findProfitLossChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)>>

*Defined in [state/db/DB.ts:570](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L570)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ProfitLossChangedLog](../interfaces/_state_logs_types_.profitlosschangedlog.md)>>

___
<a id="findtimestampsetlogs"></a>

###  findTimestampSetLogs

▸ **findTimestampSetLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TimestampSetLog](../interfaces/_state_logs_types_.timestampsetlog.md)>>

*Defined in [state/db/DB.ts:581](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L581)*

Queries the TimestampSet DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TimestampSetLog](../interfaces/_state_logs_types_.timestampsetlog.md)>>

___
<a id="findtokenbalancechangedlogs"></a>

###  findTokenBalanceChangedLogs

▸ **findTokenBalanceChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TokenBalanceChangedLog](../interfaces/_state_logs_types_.tokenbalancechangedlog.md)>>

*Defined in [state/db/DB.ts:593](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L593)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TokenBalanceChangedLog](../interfaces/_state_logs_types_.tokenbalancechangedlog.md)>>

___
<a id="findtradingproceedsclaimedlogs"></a>

###  findTradingProceedsClaimedLogs

▸ **findTradingProceedsClaimedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md)>>

*Defined in [state/db/DB.ts:605](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L605)*

Queries the TradingProceedsClaimed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TradingProceedsClaimedLog](../interfaces/_state_logs_types_.tradingproceedsclaimedlog.md)>>

___
<a id="finduniverseforkedlogs"></a>

###  findUniverseForkedLogs

▸ **findUniverseForkedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[UniverseForkedLog](../interfaces/_state_logs_types_.universeforkedlog.md)>>

*Defined in [state/db/DB.ts:616](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L616)*

Queries the UniverseForked DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[UniverseForkedLog](../interfaces/_state_logs_types_.universeforkedlog.md)>>

___
<a id="fulltextsearch"></a>

###  fullTextSearch

▸ **fullTextSearch**(eventName: *`string`*, query: *`string`*): `Array`<`object`>

*Defined in [state/db/DB.ts:204](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L204)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| query | `string` |

**Returns:** `Array`<`object`>

___
<a id="getallsequenceids"></a>

###  getAllSequenceIds

▸ **getAllSequenceIds**(): `Promise`<[SequenceIds](../interfaces/_state_db_metadb_.sequenceids.md)>

*Defined in [state/db/DB.ts:260](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L260)*

Returns the current update\_seqs from all SyncableDBs/UserSyncableDBs.

TODO Remove this function if derived DBs are not used.

**Returns:** `Promise`<[SequenceIds](../interfaces/_state_db_metadb_.sequenceids.md)>
Promise to a SequenceIds object

___
<a id="getdatabasename"></a>

###  getDatabaseName

▸ **getDatabaseName**(eventName: *`string`*, trackableUserAddress?: *`undefined` \| `string`*): `string`

*Defined in [state/db/DB.ts:237](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L237)*

Creates a name for a SyncableDB/UserSyncableDB based on `eventName` & `trackableUserAddress`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| eventName | `string` |  Event log name |
| `Optional` trackableUserAddress | `undefined` \| `string` |  User address to append to DB name |

**Returns:** `string`

___
<a id="getsyncstartingblock"></a>

###  getSyncStartingBlock

▸ **getSyncStartingBlock**(): `Promise`<`number`>

*Defined in [state/db/DB.ts:217](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L217)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced block across all event log databases or the upload block number for this network.)

TODO If derived DBs are used, the last-synced block in `this.metaDatabase` should also be taken into account here.

**Returns:** `Promise`<`number`>
Promise to the block number at which to begin syncing.

___
<a id="getsyncabledatabase"></a>

###  getSyncableDatabase

▸ **getSyncableDatabase**(dbName: *`string`*): [SyncableDB](_state_db_syncabledb_.syncabledb.md)

*Defined in [state/db/DB.ts:249](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L249)*

Gets a syncable database based upon the name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  The name of the database |

**Returns:** [SyncableDB](_state_db_syncabledb_.syncabledb.md)

___
<a id="initializedb"></a>

###  initializeDB

▸ **initializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`Array`<`string`>*, genericEventNames: *`Array`<`string`>*, customEvents: *`Array`<[CustomEvent](../interfaces/_augur_.customevent.md)>*, userSpecificEvents: *`Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)>*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)*): `Promise`<[DB](_state_db_db_.db.md)>

*Defined in [state/db/DB.ts:82](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L82)*

Creates databases to be used for syncing.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `Array`<`string`> |  Array of user addresses for which to sync user-specific events |
| genericEventNames | `Array`<`string`> |  Array of names for generic event types |
| customEvents | `Array`<[CustomEvent](../interfaces/_augur_.customevent.md)> |
| userSpecificEvents | `Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)> |  Array of user-specific event objects |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md) |  \- |

**Returns:** `Promise`<[DB](_state_db_db_.db.md)>

___
<a id="notifysyncabledbadded"></a>

###  notifySyncableDBAdded

▸ **notifySyncableDBAdded**(db: *[SyncableDB](_state_db_syncabledb_.syncabledb.md)*): `void`

*Defined in [state/db/DB.ts:145](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L145)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| db | [SyncableDB](_state_db_syncabledb_.syncabledb.md) |  dbController that utilizes the SyncableDB |

**Returns:** `void`

___
<a id="registereventlistener"></a>

###  registerEventListener

▸ **registerEventListener**(eventName: *`string`*, callback: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*): `void`

*Defined in [state/db/DB.ts:149](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L149)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| callback | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |

**Returns:** `void`

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [state/db/DB.ts:282](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L282)*

Rolls back all blocks from blockNumber onward.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockNumber | `number` |  Oldest block number to delete |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](_augur_.augur.md)*, chunkSize: *`number`*, blockstreamDelay: *`number`*): `Promise`<`void`>

*Defined in [state/db/DB.ts:160](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L160)*

Syncs generic events and user-specific events with blockchain and updates MetaDB info.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| augur | [Augur](_augur_.augur.md) |  Augur object with which to sync |
| chunkSize | `number` |  Number of blocks to retrieve at a time when syncing logs |
| blockstreamDelay | `number` |  Number of blocks by which blockstream is behind the blockchain |

**Returns:** `Promise`<`void`>

___
<a id="createandinitializedb"></a>

### `<Static>` createAndInitializeDB

▸ **createAndInitializeDB**<`TBigNumber`>(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`Array`<`string`>*, genericEventNames: *`Array`<`string`>*, customEvents: *`Array`<[CustomEvent](../interfaces/_augur_.customevent.md)>*, userSpecificEvents: *`Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)>*, pouchDBFactory: *[PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype)*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)*): `Promise`<[DB](_state_db_db_.db.md)>

*Defined in [state/db/DB.ts:65](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/DB.ts#L65)*

Creates and returns a new dbController.

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `Array`<`string`> |  Array of user addresses for which to sync user-specific events |
| genericEventNames | `Array`<`string`> |  Array of names for generic event types |
| customEvents | `Array`<[CustomEvent](../interfaces/_augur_.customevent.md)> |  Array of custom event objects |
| userSpecificEvents | `Array`<[UserSpecificEvent](../interfaces/_augur_.userspecificevent.md)> |  Array of user-specific event objects |
| pouchDBFactory | [PouchDBFactoryType](../modules/_state_db_abstractdb_.md#pouchdbfactorytype) |  Factory function generatin PouchDB instance |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md) |  Stream listener for blocks and logs |

**Returns:** `Promise`<[DB](_state_db_db_.db.md)>
Promise to a DB controller object

___

