---
id: api-classes-augur-sdk-src-state-db-db-db
title: DB
sidebar_label: DB
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/DB Module]](api-modules-augur-sdk-src-state-db-db-module.md) > [DB](api-classes-augur-sdk-src-state-db-db-db.md)

## Class

## Hierarchy

**DB**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-db-db.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-state-db-db-db.md#augur)
* [blockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-db-db.md#blockandlogstreamerlistener)
* [blockstreamDelay](api-classes-augur-sdk-src-state-db-db-db.md#blockstreamdelay)
* [currentOrdersDatabase](api-classes-augur-sdk-src-state-db-db-db.md#currentordersdatabase)
* [dexieDB](api-classes-augur-sdk-src-state-db-db-db.md#dexiedb)
* [disputeDatabase](api-classes-augur-sdk-src-state-db-db-db.md#disputedatabase)
* [genericEventDBDescriptions](api-classes-augur-sdk-src-state-db-db-db.md#genericeventdbdescriptions)
* [marketDatabase](api-classes-augur-sdk-src-state-db-db-db.md#marketdatabase)
* [networkId](api-classes-augur-sdk-src-state-db-db-db.md#networkid)
* [syncStatus](api-classes-augur-sdk-src-state-db-db-db.md#syncstatus)
* [syncableDatabases](api-classes-augur-sdk-src-state-db-db-db.md#syncabledatabases)
* [zeroXOrders](api-classes-augur-sdk-src-state-db-db-db.md#zeroxorders)

### Accessors

* [CompleteSetsPurchased](api-classes-augur-sdk-src-state-db-db-db.md#completesetspurchased)
* [CompleteSetsSold](api-classes-augur-sdk-src-state-db-db-db.md#completesetssold)
* [CurrentOrders](api-classes-augur-sdk-src-state-db-db-db.md#currentorders)
* [Dispute](api-classes-augur-sdk-src-state-db-db-db.md#dispute)
* [DisputeCrowdsourcerCompleted](api-classes-augur-sdk-src-state-db-db-db.md#disputecrowdsourcercompleted)
* [DisputeCrowdsourcerContribution](api-classes-augur-sdk-src-state-db-db-db.md#disputecrowdsourcercontribution)
* [DisputeCrowdsourcerCreated](api-classes-augur-sdk-src-state-db-db-db.md#disputecrowdsourcercreated)
* [DisputeCrowdsourcerRedeemed](api-classes-augur-sdk-src-state-db-db-db.md#disputecrowdsourcerredeemed)
* [DisputeWindowCreated](api-classes-augur-sdk-src-state-db-db-db.md#disputewindowcreated)
* [InitialReportSubmitted](api-classes-augur-sdk-src-state-db-db-db.md#initialreportsubmitted)
* [InitialReporterRedeemed](api-classes-augur-sdk-src-state-db-db-db.md#initialreporterredeemed)
* [InitialReporterTransferred](api-classes-augur-sdk-src-state-db-db-db.md#initialreportertransferred)
* [MarketCreated](api-classes-augur-sdk-src-state-db-db-db.md#marketcreated)
* [MarketFinalized](api-classes-augur-sdk-src-state-db-db-db.md#marketfinalized)
* [MarketMigrated](api-classes-augur-sdk-src-state-db-db-db.md#marketmigrated)
* [MarketOIChanged](api-classes-augur-sdk-src-state-db-db-db.md#marketoichanged)
* [MarketParticipantsDisavowed](api-classes-augur-sdk-src-state-db-db-db.md#marketparticipantsdisavowed)
* [MarketTransferred](api-classes-augur-sdk-src-state-db-db-db.md#markettransferred)
* [MarketVolumeChanged](api-classes-augur-sdk-src-state-db-db-db.md#marketvolumechanged)
* [Markets](api-classes-augur-sdk-src-state-db-db-db.md#markets)
* [OrderEvent](api-classes-augur-sdk-src-state-db-db-db.md#orderevent)
* [ParticipationTokensRedeemed](api-classes-augur-sdk-src-state-db-db-db.md#participationtokensredeemed)
* [ProfitLossChanged](api-classes-augur-sdk-src-state-db-db-db.md#profitlosschanged)
* [ReportingParticipantDisavowed](api-classes-augur-sdk-src-state-db-db-db.md#reportingparticipantdisavowed)
* [ShareTokenBalanceChanged](api-classes-augur-sdk-src-state-db-db-db.md#sharetokenbalancechanged)
* [TimestampSet](api-classes-augur-sdk-src-state-db-db-db.md#timestampset)
* [TokenBalanceChanged](api-classes-augur-sdk-src-state-db-db-db.md#tokenbalancechanged)
* [TokensMinted](api-classes-augur-sdk-src-state-db-db-db.md#tokensminted)
* [TokensTransferred](api-classes-augur-sdk-src-state-db-db-db.md#tokenstransferred)
* [TradingProceedsClaimed](api-classes-augur-sdk-src-state-db-db-db.md#tradingproceedsclaimed)
* [TransferBatch](api-classes-augur-sdk-src-state-db-db-db.md#transferbatch)
* [TransferSingle](api-classes-augur-sdk-src-state-db-db-db.md#transfersingle)
* [UniverseCreated](api-classes-augur-sdk-src-state-db-db-db.md#universecreated)
* [UniverseForked](api-classes-augur-sdk-src-state-db-db-db.md#universeforked)
* [ZeroXOrders](api-classes-augur-sdk-src-state-db-db-db.md#zeroxorders-1)

### Methods

* [addNewBlock](api-classes-augur-sdk-src-state-db-db-db.md#addnewblock)
* [generateSchemas](api-classes-augur-sdk-src-state-db-db-db.md#generateschemas)
* [getNumRowsFromDB](api-classes-augur-sdk-src-state-db-db-db.md#getnumrowsfromdb)
* [getSyncStartingBlock](api-classes-augur-sdk-src-state-db-db-db.md#getsyncstartingblock)
* [getSyncableDatabase](api-classes-augur-sdk-src-state-db-db-db.md#getsyncabledatabase)
* [initializeDB](api-classes-augur-sdk-src-state-db-db-db.md#initializedb)
* [notifySyncableDBAdded](api-classes-augur-sdk-src-state-db-db-db.md#notifysyncabledbadded)
* [registerEventListener](api-classes-augur-sdk-src-state-db-db-db.md#registereventlistener)
* [rollback](api-classes-augur-sdk-src-state-db-db-db.md#rollback)
* [sync](api-classes-augur-sdk-src-state-db-db-db.md#sync)
* [createAndInitializeDB](api-classes-augur-sdk-src-state-db-db-db.md#createandinitializedb)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DB**(dexieDB: *`Dexie`*): [DB](api-classes-augur-sdk-src-state-db-db-db.md)

*Defined in [augur-sdk/src/state/db/DB.ts:106](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L106)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dexieDB | `Dexie` |

**Returns:** [DB](api-classes-augur-sdk-src-state-db-db-db.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:70](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L70)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:69](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L69)*

___
<a id="blockstreamdelay"></a>

### `<Private>` blockstreamDelay

**● blockstreamDelay**: *`number`*

*Defined in [augur-sdk/src/state/db/DB.ts:62](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L62)*

___
<a id="currentordersdatabase"></a>

### `<Private>` currentOrdersDatabase

**● currentOrdersDatabase**: *[CurrentOrdersDatabase](api-classes-augur-sdk-src-state-db-currentordersdb-currentordersdatabase.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:66](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L66)*

___
<a id="dexiedb"></a>

###  dexieDB

**● dexieDB**: *`Dexie`*

*Defined in [augur-sdk/src/state/db/DB.ts:71](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L71)*

___
<a id="disputedatabase"></a>

### `<Private>` disputeDatabase

**● disputeDatabase**: *[DisputeDatabase](api-classes-augur-sdk-src-state-db-disputedb-disputedatabase.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L65)*

___
<a id="genericeventdbdescriptions"></a>

###  genericEventDBDescriptions

**● genericEventDBDescriptions**: *[GenericEventDBDescription](api-interfaces-augur-sdk-src-state-logs-types-genericeventdbdescription.md)[]* =  [
    { EventName: 'CompleteSetsPurchased', indexes: ['timestamp'] },
    { EventName: 'CompleteSetsSold', indexes: ['timestamp'] },
    { EventName: 'DisputeCrowdsourcerCompleted', indexes: ['market', 'timestamp', 'disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerContribution', indexes: ['timestamp', 'market', '[universe+reporter]'] },
    { EventName: 'DisputeCrowdsourcerCreated', indexes: ['disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'DisputeWindowCreated', indexes: [] },
    { EventName: 'InitialReporterRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'InitialReportSubmitted', indexes: ['timestamp', 'reporter', '[universe+reporter]'] },
    { EventName: 'InitialReporterTransferred', indexes: [] },
    { EventName: 'MarketCreated', indexes: ['market', 'timestamp', '[universe+timestamp]'] },
    { EventName: 'MarketFinalized', indexes: ['market'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: [] },
    { EventName: 'MarketTransferred', indexes: [] },
    { EventName: 'MarketVolumeChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'MarketOIChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'OrderEvent', indexes: ['market', 'timestamp', 'orderId', '[universe+eventType+timestamp]', '[market+eventType]', 'eventType', 'orderCreator', 'orderFiller'] },
    { EventName: 'ParticipationTokensRedeemed', indexes: ['timestamp'] },
    { EventName: 'ProfitLossChanged', indexes: ['[universe+account+timestamp]', 'account'] },
    { EventName: 'ReportingParticipantDisavowed', indexes: [] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    { EventName: 'TokenBalanceChanged', indexes: ['[universe+owner+tokenType]'], primaryKey: '[owner+token]' },
    { EventName: 'TokensMinted', indexes: [] },
    { EventName: 'TokensTransferred', indexes: [] },
    { EventName: 'TradingProceedsClaimed', indexes: ['timestamp'] },
    { EventName: 'UniverseCreated', indexes: ['childUniverse', 'parentUniverse'] },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: []},
    { EventName: 'TransferBatch', indexes: []},
    { EventName: 'ShareTokenBalanceChanged', indexes: ['[universe+account]'], primaryKey: '[account+market+outcome]'},
  ]

*Defined in [augur-sdk/src/state/db/DB.ts:74](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L74)*

___
<a id="marketdatabase"></a>

### `<Private>` marketDatabase

**● marketDatabase**: *[MarketDB](api-classes-augur-sdk-src-state-db-marketdb-marketdb.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L67)*

___
<a id="networkid"></a>

### `<Private>` networkId

**● networkId**: *`number`*

*Defined in [augur-sdk/src/state/db/DB.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L61)*

___
<a id="syncstatus"></a>

###  syncStatus

**● syncStatus**: *[SyncStatus](api-classes-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:72](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L72)*

___
<a id="syncabledatabases"></a>

### `<Private>` syncableDatabases

**● syncableDatabases**: *`object`*

*Defined in [augur-sdk/src/state/db/DB.ts:63](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L63)*

#### Type declaration

[dbName: `string`]: [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="zeroxorders"></a>

### `<Private>` zeroXOrders

**● zeroXOrders**: *[ZeroXOrders](api-classes-augur-sdk-src-state-db-zeroxorders-zeroxorders.md)*

*Defined in [augur-sdk/src/state/db/DB.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L68)*

___

## Accessors

<a id="completesetspurchased"></a>

###  CompleteSetsPurchased

**get CompleteSetsPurchased**(): `Table`<[CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:353](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L353)*

**Returns:** `Table`<[CompleteSetsPurchasedLog](api-interfaces-augur-sdk-src-state-logs-types-completesetspurchasedlog.md), `any`>

___
<a id="completesetssold"></a>

###  CompleteSetsSold

**get CompleteSetsSold**(): `Table`<[CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:354](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L354)*

**Returns:** `Table`<[CompleteSetsSoldLog](api-interfaces-augur-sdk-src-state-logs-types-completesetssoldlog.md), `any`>

___
<a id="currentorders"></a>

###  CurrentOrders

**get CurrentOrders**(): `Table`<[CurrentOrder](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:386](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L386)*

**Returns:** `Table`<[CurrentOrder](api-interfaces-augur-sdk-src-state-logs-types-currentorder.md), `any`>

___
<a id="dispute"></a>

###  Dispute

**get Dispute**(): `Table`<[DisputeDoc](api-interfaces-augur-sdk-src-state-logs-types-disputedoc.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:385](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L385)*

**Returns:** `Table`<[DisputeDoc](api-interfaces-augur-sdk-src-state-logs-types-disputedoc.md), `any`>

___
<a id="disputecrowdsourcercompleted"></a>

###  DisputeCrowdsourcerCompleted

**get DisputeCrowdsourcerCompleted**(): `Table`<[DisputeCrowdsourcerCompletedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:356](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L356)*

**Returns:** `Table`<[DisputeCrowdsourcerCompletedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md), `any`>

___
<a id="disputecrowdsourcercontribution"></a>

###  DisputeCrowdsourcerContribution

**get DisputeCrowdsourcerContribution**(): `Table`<[DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:355](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L355)*

**Returns:** `Table`<[DisputeCrowdsourcerContributionLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md), `any`>

___
<a id="disputecrowdsourcercreated"></a>

###  DisputeCrowdsourcerCreated

**get DisputeCrowdsourcerCreated**(): `Table`<[DisputeCrowdsourcerCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:357](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L357)*

**Returns:** `Table`<[DisputeCrowdsourcerCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md), `any`>

___
<a id="disputecrowdsourcerredeemed"></a>

###  DisputeCrowdsourcerRedeemed

**get DisputeCrowdsourcerRedeemed**(): `Table`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:358](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L358)*

**Returns:** `Table`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md), `any`>

___
<a id="disputewindowcreated"></a>

###  DisputeWindowCreated

**get DisputeWindowCreated**(): `Table`<[DisputeWindowCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:359](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L359)*

**Returns:** `Table`<[DisputeWindowCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md), `any`>

___
<a id="initialreportsubmitted"></a>

###  InitialReportSubmitted

**get InitialReportSubmitted**(): `Table`<[InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:361](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L361)*

**Returns:** `Table`<[InitialReportSubmittedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md), `any`>

___
<a id="initialreporterredeemed"></a>

###  InitialReporterRedeemed

**get InitialReporterRedeemed**(): `Table`<[InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:360](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L360)*

**Returns:** `Table`<[InitialReporterRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md), `any`>

___
<a id="initialreportertransferred"></a>

###  InitialReporterTransferred

**get InitialReporterTransferred**(): `Table`<[InitialReporterTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportertransferredlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:362](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L362)*

**Returns:** `Table`<[InitialReporterTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-initialreportertransferredlog.md), `any`>

___
<a id="marketcreated"></a>

###  MarketCreated

**get MarketCreated**(): `Table`<[MarketCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-marketcreatedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:363](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L363)*

**Returns:** `Table`<[MarketCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-marketcreatedlog.md), `any`>

___
<a id="marketfinalized"></a>

###  MarketFinalized

**get MarketFinalized**(): `Table`<[MarketFinalizedLog](api-interfaces-augur-sdk-src-state-logs-types-marketfinalizedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:364](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L364)*

**Returns:** `Table`<[MarketFinalizedLog](api-interfaces-augur-sdk-src-state-logs-types-marketfinalizedlog.md), `any`>

___
<a id="marketmigrated"></a>

###  MarketMigrated

**get MarketMigrated**(): `Table`<[MarketMigratedLog](api-interfaces-augur-sdk-src-state-logs-types-marketmigratedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:365](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L365)*

**Returns:** `Table`<[MarketMigratedLog](api-interfaces-augur-sdk-src-state-logs-types-marketmigratedlog.md), `any`>

___
<a id="marketoichanged"></a>

###  MarketOIChanged

**get MarketOIChanged**(): `Table`<[MarketOIChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketoichangedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:369](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L369)*

**Returns:** `Table`<[MarketOIChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketoichangedlog.md), `any`>

___
<a id="marketparticipantsdisavowed"></a>

###  MarketParticipantsDisavowed

**get MarketParticipantsDisavowed**(): `Table`<[MarketParticipantsDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-marketparticipantsdisavowedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:366](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L366)*

**Returns:** `Table`<[MarketParticipantsDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-marketparticipantsdisavowedlog.md), `any`>

___
<a id="markettransferred"></a>

###  MarketTransferred

**get MarketTransferred**(): `Table`<[MarketTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-markettransferredlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:367](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L367)*

**Returns:** `Table`<[MarketTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-markettransferredlog.md), `any`>

___
<a id="marketvolumechanged"></a>

###  MarketVolumeChanged

**get MarketVolumeChanged**(): `Table`<[MarketVolumeChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketvolumechangedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:368](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L368)*

**Returns:** `Table`<[MarketVolumeChangedLog](api-interfaces-augur-sdk-src-state-logs-types-marketvolumechangedlog.md), `any`>

___
<a id="markets"></a>

###  Markets

**get Markets**(): `Table`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:384](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L384)*

**Returns:** `Table`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md), `any`>

___
<a id="orderevent"></a>

###  OrderEvent

**get OrderEvent**(): `Table`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:370](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L370)*

**Returns:** `Table`<[ParsedOrderEventLog](api-interfaces-augur-sdk-src-state-logs-types-parsedordereventlog.md), `any`>

___
<a id="participationtokensredeemed"></a>

###  ParticipationTokensRedeemed

**get ParticipationTokensRedeemed**(): `Table`<[ParticipationTokensRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:371](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L371)*

**Returns:** `Table`<[ParticipationTokensRedeemedLog](api-interfaces-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md), `any`>

___
<a id="profitlosschanged"></a>

###  ProfitLossChanged

**get ProfitLossChanged**(): `Table`<[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:372](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L372)*

**Returns:** `Table`<[ProfitLossChangedLog](api-interfaces-augur-sdk-src-state-logs-types-profitlosschangedlog.md), `any`>

___
<a id="reportingparticipantdisavowed"></a>

###  ReportingParticipantDisavowed

**get ReportingParticipantDisavowed**(): `Table`<[ReportingParticipantDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-reportingparticipantdisavowedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:373](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L373)*

**Returns:** `Table`<[ReportingParticipantDisavowedLog](api-interfaces-augur-sdk-src-state-logs-types-reportingparticipantdisavowedlog.md), `any`>

___
<a id="sharetokenbalancechanged"></a>

###  ShareTokenBalanceChanged

**get ShareTokenBalanceChanged**(): `Table`<[ShareTokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-sharetokenbalancechangedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:383](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L383)*

**Returns:** `Table`<[ShareTokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-sharetokenbalancechangedlog.md), `any`>

___
<a id="timestampset"></a>

###  TimestampSet

**get TimestampSet**(): `Table`<[TimestampSetLog](api-interfaces-augur-sdk-src-state-logs-types-timestampsetlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:374](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L374)*

**Returns:** `Table`<[TimestampSetLog](api-interfaces-augur-sdk-src-state-logs-types-timestampsetlog.md), `any`>

___
<a id="tokenbalancechanged"></a>

###  TokenBalanceChanged

**get TokenBalanceChanged**(): `Table`<[TokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:375](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L375)*

**Returns:** `Table`<[TokenBalanceChangedLog](api-interfaces-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md), `any`>

___
<a id="tokensminted"></a>

###  TokensMinted

**get TokensMinted**(): `Table`<[TokensMinted](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:376](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L376)*

**Returns:** `Table`<[TokensMinted](api-interfaces-augur-sdk-src-state-logs-types-tokensminted.md), `any`>

___
<a id="tokenstransferred"></a>

###  TokensTransferred

**get TokensTransferred**(): `Table`<[TokensTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-tokenstransferredlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:377](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L377)*

**Returns:** `Table`<[TokensTransferredLog](api-interfaces-augur-sdk-src-state-logs-types-tokenstransferredlog.md), `any`>

___
<a id="tradingproceedsclaimed"></a>

###  TradingProceedsClaimed

**get TradingProceedsClaimed**(): `Table`<[TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:378](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L378)*

**Returns:** `Table`<[TradingProceedsClaimedLog](api-interfaces-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md), `any`>

___
<a id="transferbatch"></a>

###  TransferBatch

**get TransferBatch**(): `Table`<[TransferBatchLog](api-interfaces-augur-sdk-src-state-logs-types-transferbatchlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:382](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L382)*

**Returns:** `Table`<[TransferBatchLog](api-interfaces-augur-sdk-src-state-logs-types-transferbatchlog.md), `any`>

___
<a id="transfersingle"></a>

###  TransferSingle

**get TransferSingle**(): `Table`<[TransferSingleLog](api-interfaces-augur-sdk-src-state-logs-types-transfersinglelog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:381](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L381)*

**Returns:** `Table`<[TransferSingleLog](api-interfaces-augur-sdk-src-state-logs-types-transfersinglelog.md), `any`>

___
<a id="universecreated"></a>

###  UniverseCreated

**get UniverseCreated**(): `Table`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:379](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L379)*

**Returns:** `Table`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md), `any`>

___
<a id="universeforked"></a>

###  UniverseForked

**get UniverseForked**(): `Table`<[UniverseForkedLog](api-interfaces-augur-sdk-src-state-logs-types-universeforkedlog.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:380](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L380)*

**Returns:** `Table`<[UniverseForkedLog](api-interfaces-augur-sdk-src-state-logs-types-universeforkedlog.md), `any`>

___
<a id="zeroxorders-1"></a>

###  ZeroXOrders

**get ZeroXOrders**(): `Table`<[StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md), `any`>

*Defined in [augur-sdk/src/state/db/DB.ts:387](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L387)*

**Returns:** `Table`<[StoredOrder](api-interfaces-augur-sdk-src-state-db-zeroxorders-storedorder.md), `any`>

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(dbName: *`string`*, blockLogs: *`any`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DB.ts:317](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L317)*

Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.

TODO Define blockLogs interface

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  Name of the database to which the block should be added |
| blockLogs | `any` |  Logs from a new block |

**Returns:** `Promise`<`void`>

___
<a id="generateschemas"></a>

###  generateSchemas

▸ **generateSchemas**(): [Schemas](api-interfaces-augur-sdk-src-state-db-db-schemas.md)

*Defined in [augur-sdk/src/state/db/DB.ts:186](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L186)*

**Returns:** [Schemas](api-interfaces-augur-sdk-src-state-db-db-schemas.md)

___
<a id="getnumrowsfromdb"></a>

###  getNumRowsFromDB

▸ **getNumRowsFromDB**(dbName: *`string`*, request?: *`__type`*): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/DB.ts:341](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L341)*

Queries a DB to get a row count.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  Name of the DB to query |
| `Optional` request | `__type` |

**Returns:** `Promise`<`number`>
Promise to a number of rows

___
<a id="getsyncstartingblock"></a>

###  getSyncStartingBlock

▸ **getSyncStartingBlock**(): `Promise`<`number`>

*Defined in [augur-sdk/src/state/db/DB.ts:269](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L269)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced block across all event log databases or the upload block number for this network.)

**Returns:** `Promise`<`number`>
Promise to the block number at which to begin syncing.

___
<a id="getsyncabledatabase"></a>

###  getSyncableDatabase

▸ **getSyncableDatabase**(dbName: *`string`*): [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

*Defined in [augur-sdk/src/state/db/DB.ts:283](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L283)*

Gets a syncable database based upon the name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  The name of the database |

**Returns:** [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="initializedb"></a>

###  initializeDB

▸ **initializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, blockAndLogStreamerListener: *[BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)*): `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>

*Defined in [augur-sdk/src/state/db/DB.ts:147](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L147)*

Creates databases to be used for syncing.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| blockAndLogStreamerListener | [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md) |  \- |

**Returns:** `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>

___
<a id="notifysyncabledbadded"></a>

###  notifySyncableDBAdded

▸ **notifySyncableDBAdded**(db: *[SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md)*): `void`

*Defined in [augur-sdk/src/state/db/DB.ts:208](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L208)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| db | [SyncableDB](api-classes-augur-sdk-src-state-db-syncabledb-syncabledb.md) |  dbController that utilizes the SyncableDB |

**Returns:** `void`

___
<a id="registereventlistener"></a>

###  registerEventListener

▸ **registerEventListener**(eventNames: *`string` \| `string`[]*, callback: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [augur-sdk/src/state/db/DB.ts:212](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L212)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventNames | `string` \| `string`[] |
| callback | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DB.ts:292](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L292)*

Rolls back all blocks from blockNumber onward.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockNumber | `number` |  Oldest block number to delete |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, chunkSize: *`number`*, blockstreamDelay: *`number`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/DB.ts:223](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L223)*

Syncs generic events and user-specific events with blockchain and updates MetaDB info.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |  Augur object with which to sync |
| chunkSize | `number` |  Number of blocks to retrieve at a time when syncing logs |
| blockstreamDelay | `number` |  Number of blocks by which blockstream is behind the blockchain |

**Returns:** `Promise`<`void`>

___
<a id="createandinitializedb"></a>

### `<Static>` createAndInitializeDB

▸ **createAndInitializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, blockAndLogStreamerListener: *[BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)*): `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>

*Defined in [augur-sdk/src/state/db/DB.ts:126](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/DB.ts#L126)*

Creates and returns a new dbController.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| blockAndLogStreamerListener | [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md) |  Stream listener for blocks and logs |

**Returns:** `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>
Promise to a DB controller object

___

