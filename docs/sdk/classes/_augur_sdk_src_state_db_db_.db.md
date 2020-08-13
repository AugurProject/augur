[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/db/DB"](../modules/_augur_sdk_src_state_db_db_.md) › [DB](_augur_sdk_src_state_db_db_.db.md)

# Class: DB

## Hierarchy

* **DB**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_db_db_.db.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_db_db_.db.md#private-augur)
* [currentOrdersDatabase](_augur_sdk_src_state_db_db_.db.md#private-currentordersdatabase)
* [dbOpened](_augur_sdk_src_state_db_db_.db.md#private-dbopened)
* [dexieDB](_augur_sdk_src_state_db_db_.db.md#readonly-dexiedb)
* [disputeDatabase](_augur_sdk_src_state_db_db_.db.md#private-disputedatabase)
* [enableZeroX](_augur_sdk_src_state_db_db_.db.md#private-enablezerox)
* [genericEventDBDescriptions](_augur_sdk_src_state_db_db_.db.md#readonly-genericeventdbdescriptions)
* [getterCache](_augur_sdk_src_state_db_db_.db.md#gettercache)
* [logFilters](_augur_sdk_src_state_db_db_.db.md#readonly-logfilters)
* [marketDatabase](_augur_sdk_src_state_db_db_.db.md#marketdatabase)
* [networkId](_augur_sdk_src_state_db_db_.db.md#private-networkid)
* [parsedOrderEventDatabase](_augur_sdk_src_state_db_db_.db.md#private-parsedordereventdatabase)
* [syncStatus](_augur_sdk_src_state_db_db_.db.md#syncstatus)
* [syncableDatabases](_augur_sdk_src_state_db_db_.db.md#private-syncabledatabases)
* [uploadBlockNumber](_augur_sdk_src_state_db_db_.db.md#private-uploadblocknumber)
* [warpCheckpoints](_augur_sdk_src_state_db_db_.db.md#warpcheckpoints)
* [zeroXOrders](_augur_sdk_src_state_db_db_.db.md#private-zeroxorders)

### Accessors

* [CancelZeroXOrder](_augur_sdk_src_state_db_db_.db.md#cancelzeroxorder)
* [CompleteSetsPurchased](_augur_sdk_src_state_db_db_.db.md#completesetspurchased)
* [CompleteSetsSold](_augur_sdk_src_state_db_db_.db.md#completesetssold)
* [CurrentOrders](_augur_sdk_src_state_db_db_.db.md#currentorders)
* [Dispute](_augur_sdk_src_state_db_db_.db.md#dispute)
* [DisputeCrowdsourcerCompleted](_augur_sdk_src_state_db_db_.db.md#disputecrowdsourcercompleted)
* [DisputeCrowdsourcerContribution](_augur_sdk_src_state_db_db_.db.md#disputecrowdsourcercontribution)
* [DisputeCrowdsourcerCreated](_augur_sdk_src_state_db_db_.db.md#disputecrowdsourcercreated)
* [DisputeCrowdsourcerRedeemed](_augur_sdk_src_state_db_db_.db.md#disputecrowdsourcerredeemed)
* [DisputeWindowCreated](_augur_sdk_src_state_db_db_.db.md#disputewindowcreated)
* [InitialReportSubmitted](_augur_sdk_src_state_db_db_.db.md#initialreportsubmitted)
* [InitialReporterRedeemed](_augur_sdk_src_state_db_db_.db.md#initialreporterredeemed)
* [InitialReporterTransferred](_augur_sdk_src_state_db_db_.db.md#initialreportertransferred)
* [MarketCreated](_augur_sdk_src_state_db_db_.db.md#marketcreated)
* [MarketFinalized](_augur_sdk_src_state_db_db_.db.md#marketfinalized)
* [MarketMigrated](_augur_sdk_src_state_db_db_.db.md#marketmigrated)
* [MarketOIChanged](_augur_sdk_src_state_db_db_.db.md#marketoichanged)
* [MarketOIChangedRollup](_augur_sdk_src_state_db_db_.db.md#marketoichangedrollup)
* [MarketParticipantsDisavowed](_augur_sdk_src_state_db_db_.db.md#marketparticipantsdisavowed)
* [MarketTransferred](_augur_sdk_src_state_db_db_.db.md#markettransferred)
* [MarketVolumeChanged](_augur_sdk_src_state_db_db_.db.md#marketvolumechanged)
* [MarketVolumeChangedRollup](_augur_sdk_src_state_db_db_.db.md#marketvolumechangedrollup)
* [Markets](_augur_sdk_src_state_db_db_.db.md#markets)
* [OrderEvent](_augur_sdk_src_state_db_db_.db.md#orderevent)
* [ParsedOrderEvent](_augur_sdk_src_state_db_db_.db.md#parsedorderevent)
* [ParticipationTokensRedeemed](_augur_sdk_src_state_db_db_.db.md#participationtokensredeemed)
* [ProfitLossChanged](_augur_sdk_src_state_db_db_.db.md#profitlosschanged)
* [ReportingFeeChanged](_augur_sdk_src_state_db_db_.db.md#reportingfeechanged)
* [ReportingParticipantDisavowed](_augur_sdk_src_state_db_db_.db.md#reportingparticipantdisavowed)
* [ShareTokenBalanceChanged](_augur_sdk_src_state_db_db_.db.md#sharetokenbalancechanged)
* [ShareTokenBalanceChangedRollup](_augur_sdk_src_state_db_db_.db.md#sharetokenbalancechangedrollup)
* [TimestampSet](_augur_sdk_src_state_db_db_.db.md#timestampset)
* [TokenBalanceChanged](_augur_sdk_src_state_db_db_.db.md#tokenbalancechanged)
* [TokenBalanceChangedRollup](_augur_sdk_src_state_db_db_.db.md#tokenbalancechangedrollup)
* [TokensMinted](_augur_sdk_src_state_db_db_.db.md#tokensminted)
* [TokensTransferred](_augur_sdk_src_state_db_db_.db.md#tokenstransferred)
* [TradingProceedsClaimed](_augur_sdk_src_state_db_db_.db.md#tradingproceedsclaimed)
* [TransferBatch](_augur_sdk_src_state_db_db_.db.md#transferbatch)
* [TransferSingle](_augur_sdk_src_state_db_db_.db.md#transfersingle)
* [UniverseCreated](_augur_sdk_src_state_db_db_.db.md#universecreated)
* [UniverseForked](_augur_sdk_src_state_db_db_.db.md#universeforked)
* [ZeroXOrders](_augur_sdk_src_state_db_db_.db.md#zeroxorders)

### Methods

* [addNewBlock](_augur_sdk_src_state_db_db_.db.md#addnewblock)
* [clear](_augur_sdk_src_state_db_db_.db.md#clear)
* [generateSchemas](_augur_sdk_src_state_db_db_.db.md#generateschemas)
* [getSyncStartingBlock](_augur_sdk_src_state_db_db_.db.md#getsyncstartingblock)
* [initializeDB](_augur_sdk_src_state_db_db_.db.md#initializedb)
* [notifySyncableDBAdded](_augur_sdk_src_state_db_db_.db.md#notifysyncabledbadded)
* [prune](_augur_sdk_src_state_db_db_.db.md#prune)
* [registerEventListener](_augur_sdk_src_state_db_db_.db.md#registereventlistener)
* [rollback](_augur_sdk_src_state_db_db_.db.md#rollback)
* [sync](_augur_sdk_src_state_db_db_.db.md#sync)
* [unregisterEventListener](_augur_sdk_src_state_db_db_.db.md#unregistereventlistener)
* [createAndInitializeDB](_augur_sdk_src_state_db_db_.db.md#static-createandinitializedb)

## Constructors

###  constructor

\+ **new DB**(`dexieDB`: Dexie, `logFilters`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md), `networkId`: number, `uploadBlockNumber`: number, `enableZeroX`: boolean): *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:170](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L170)*

**Parameters:**

Name | Type |
------ | ------ |
`dexieDB` | Dexie |
`logFilters` | [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md) |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`networkId` | number |
`uploadBlockNumber` | number |
`enableZeroX` | boolean |

**Returns:** *[DB](_augur_sdk_src_state_db_db_.db.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:175](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L175)*

___

### `Private` currentOrdersDatabase

• **currentOrdersDatabase**: *[ParsedOrderEventDB](_augur_sdk_src_state_db_parsedordereventdb_.parsedordereventdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:76](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L76)*

___

### `Private` dbOpened

• **dbOpened**: *boolean* = false

*Defined in [packages/augur-sdk/src/state/db/DB.ts:83](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L83)*

___

### `Readonly` dexieDB

• **dexieDB**: *Dexie*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:173](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L173)*

___

### `Private` disputeDatabase

• **disputeDatabase**: *[DisputeDatabase](_augur_sdk_src_state_db_disputedb_.disputedatabase.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:75](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L75)*

___

### `Private` enableZeroX

• **enableZeroX**: *boolean*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:178](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L178)*

___

### `Readonly` genericEventDBDescriptions

• **genericEventDBDescriptions**: *GenericEventDBDescription[]* = [
    { EventName: 'CompleteSetsPurchased', indexes: ['timestamp', 'market'] },
    { EventName: 'CompleteSetsSold', indexes: ['timestamp', 'market'] },
    {
      EventName: 'DisputeCrowdsourcerCompleted',
      indexes: ['market', 'timestamp', 'disputeCrowdsourcer'],
    },
    {
      EventName: 'DisputeCrowdsourcerContribution',
      indexes: ['timestamp', 'market', '[universe+reporter]'],
    },
    {
      EventName: 'DisputeCrowdsourcerCreated',
      indexes: ['disputeCrowdsourcer', 'market'],
    },
    {
      EventName: 'DisputeCrowdsourcerRedeemed',
      indexes: ['timestamp', 'reporter', 'market'],
    },
    { EventName: 'DisputeWindowCreated', indexes: ['market'] },
    {
      EventName: 'InitialReporterRedeemed',
      indexes: ['timestamp', 'reporter', 'market'],
    },
    {
      EventName: 'InitialReportSubmitted',
      indexes: ['timestamp', 'reporter', '[universe+reporter]', 'market'],
    },
    { EventName: 'InitialReporterTransferred', indexes: ['market', 'to'] },
    {
      EventName: 'MarketCreated',
      indexes: ['market', 'timestamp', '[universe+timestamp]'],
    },
    { EventName: 'MarketFinalized', indexes: ['market', 'timestamp'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: ['market'] },
    { EventName: 'MarketTransferred', indexes: ['market'] },
    {
      EventName: 'MarketVolumeChanged',
      indexes: ['market'],
      primaryKey: 'market',
    },
    { EventName: 'MarketOIChanged', indexes: ['market'], primaryKey: 'market' },
    {
      EventName: 'OrderEvent',
      indexes: [
        'market',
        'timestamp',
        'orderId',
        '[universe+eventType+timestamp]',
        '[market+eventType]',
        'eventType',
        'orderCreator',
        'orderFiller',
      ],
    },
    { EventName: 'CancelZeroXOrder', indexes: ['[account+market]', 'market'] },
    { EventName: 'ParticipationTokensRedeemed', indexes: ['timestamp'] },
    {
      EventName: 'ProfitLossChanged',
      indexes: ['[universe+account+timestamp]', 'account', 'market'],
    },
    { EventName: 'ReportingParticipantDisavowed', indexes: ['market'] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    {
      EventName: 'TokenBalanceChanged',
      indexes: ['[universe+owner+tokenType]'],
      primaryKey: '[owner+token]',
    },
    { EventName: 'TokensMinted', indexes: [] },
    { EventName: 'TokensTransferred', indexes: [] },
    { EventName: 'ReportingFeeChanged', indexes: ['universe'] }, // TODO: add Rollup
    { EventName: 'TradingProceedsClaimed', indexes: ['timestamp', 'market'] },
    {
      EventName: 'UniverseCreated',
      indexes: ['childUniverse', 'parentUniverse'],
    },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: [] },
    { EventName: 'TransferBatch', indexes: [] },
    {
      EventName: 'ShareTokenBalanceChanged',
      indexes: ['[universe+account]', 'market'],
      primaryKey: '[account+market+outcome]',
    },
  ]

*Defined in [packages/augur-sdk/src/state/db/DB.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L85)*

___

###  getterCache

• **getterCache**: *[GetterCache](_augur_sdk_src_state_db_gettercache_.gettercache.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:80](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L80)*

___

### `Readonly` logFilters

• **logFilters**: *[LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:174](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L174)*

___

###  marketDatabase

• **marketDatabase**: *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:77](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L77)*

___

### `Private` networkId

• **networkId**: *number*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:176](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L176)*

___

### `Private` parsedOrderEventDatabase

• **parsedOrderEventDatabase**: *[ParsedOrderEventDB](_augur_sdk_src_state_db_parsedordereventdb_.parsedordereventdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:78](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L78)*

___

###  syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:81](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L81)*

___

### `Private` syncableDatabases

• **syncableDatabases**: *object*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:74](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L74)*

#### Type declaration:

* \[ **dbName**: *string*\]: [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md)

___

### `Private` uploadBlockNumber

• **uploadBlockNumber**: *number*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:177](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L177)*

___

###  warpCheckpoints

• **warpCheckpoints**: *[WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:82](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L82)*

___

### `Private` zeroXOrders

• **zeroXOrders**: *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:79](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L79)*

## Accessors

###  CancelZeroXOrder

• **get CancelZeroXOrder**(): *Table‹CancelZeroXOrderLog, any›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:644](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L644)*

**Returns:** *Table‹CancelZeroXOrderLog, any›*

___

###  CompleteSetsPurchased

• **get CompleteSetsPurchased**(): *Table‹CompleteSetsPurchasedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:564](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L564)*

**Returns:** *Table‹CompleteSetsPurchasedLog, IndexableType›*

___

###  CompleteSetsSold

• **get CompleteSetsSold**(): *Table‹CompleteSetsSoldLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:569](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L569)*

**Returns:** *Table‹CompleteSetsSoldLog, IndexableType›*

___

###  CurrentOrders

• **get CurrentOrders**(): *Table‹CurrentOrder, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:716](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L716)*

**Returns:** *Table‹CurrentOrder, IndexableType›*

___

###  Dispute

• **get Dispute**(): *Table‹DisputeDoc, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:713](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L713)*

**Returns:** *Table‹DisputeDoc, IndexableType›*

___

###  DisputeCrowdsourcerCompleted

• **get DisputeCrowdsourcerCompleted**(): *Table‹DisputeCrowdsourcerCompletedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:577](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L577)*

**Returns:** *Table‹DisputeCrowdsourcerCompletedLog, IndexableType›*

___

###  DisputeCrowdsourcerContribution

• **get DisputeCrowdsourcerContribution**(): *Table‹DisputeCrowdsourcerContributionLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:572](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L572)*

**Returns:** *Table‹DisputeCrowdsourcerContributionLog, IndexableType›*

___

###  DisputeCrowdsourcerCreated

• **get DisputeCrowdsourcerCreated**(): *Table‹DisputeCrowdsourcerCreatedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:582](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L582)*

**Returns:** *Table‹DisputeCrowdsourcerCreatedLog, IndexableType›*

___

###  DisputeCrowdsourcerRedeemed

• **get DisputeCrowdsourcerRedeemed**(): *Table‹DisputeCrowdsourcerRedeemedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:587](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L587)*

**Returns:** *Table‹DisputeCrowdsourcerRedeemedLog, IndexableType›*

___

###  DisputeWindowCreated

• **get DisputeWindowCreated**(): *Table‹DisputeWindowCreatedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:592](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L592)*

**Returns:** *Table‹DisputeWindowCreatedLog, IndexableType›*

___

###  InitialReportSubmitted

• **get InitialReportSubmitted**(): *Table‹InitialReportSubmittedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:600](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L600)*

**Returns:** *Table‹InitialReportSubmittedLog, IndexableType›*

___

###  InitialReporterRedeemed

• **get InitialReporterRedeemed**(): *Table‹InitialReporterRedeemedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:595](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L595)*

**Returns:** *Table‹InitialReporterRedeemedLog, IndexableType›*

___

###  InitialReporterTransferred

• **get InitialReporterTransferred**(): *Table‹InitialReporterTransferredLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:605](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L605)*

**Returns:** *Table‹InitialReporterTransferredLog, IndexableType›*

___

###  MarketCreated

• **get MarketCreated**(): *Table‹MarketCreatedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:610](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L610)*

**Returns:** *Table‹MarketCreatedLog, IndexableType›*

___

###  MarketFinalized

• **get MarketFinalized**(): *Table‹MarketFinalizedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:613](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L613)*

**Returns:** *Table‹MarketFinalizedLog, IndexableType›*

___

###  MarketMigrated

• **get MarketMigrated**(): *Table‹MarketMigratedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:616](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L616)*

**Returns:** *Table‹MarketMigratedLog, IndexableType›*

___

###  MarketOIChanged

• **get MarketOIChanged**(): *Table‹MarketOIChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:635](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L635)*

**Returns:** *Table‹MarketOIChangedLog, IndexableType›*

___

###  MarketOIChangedRollup

• **get MarketOIChangedRollup**(): *Table‹MarketOIChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:638](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L638)*

**Returns:** *Table‹MarketOIChangedLog, IndexableType›*

___

###  MarketParticipantsDisavowed

• **get MarketParticipantsDisavowed**(): *Table‹MarketParticipantsDisavowedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:619](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L619)*

**Returns:** *Table‹MarketParticipantsDisavowedLog, IndexableType›*

___

###  MarketTransferred

• **get MarketTransferred**(): *Table‹MarketTransferredLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:624](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L624)*

**Returns:** *Table‹MarketTransferredLog, IndexableType›*

___

###  MarketVolumeChanged

• **get MarketVolumeChanged**(): *Table‹MarketVolumeChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:627](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L627)*

**Returns:** *Table‹MarketVolumeChangedLog, IndexableType›*

___

###  MarketVolumeChangedRollup

• **get MarketVolumeChangedRollup**(): *Table‹MarketVolumeChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:630](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L630)*

**Returns:** *Table‹MarketVolumeChangedLog, IndexableType›*

___

###  Markets

• **get Markets**(): *Table‹MarketData, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:707](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L707)*

**Returns:** *Table‹MarketData, IndexableType›*

___

###  OrderEvent

• **get OrderEvent**(): *Table‹OrderEventLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:641](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L641)*

**Returns:** *Table‹OrderEventLog, IndexableType›*

___

###  ParsedOrderEvent

• **get ParsedOrderEvent**(): *Table‹ParsedOrderEventLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:710](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L710)*

**Returns:** *Table‹ParsedOrderEventLog, IndexableType›*

___

###  ParticipationTokensRedeemed

• **get ParticipationTokensRedeemed**(): *Table‹ParticipationTokensRedeemedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:650](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L650)*

**Returns:** *Table‹ParticipationTokensRedeemedLog, IndexableType›*

___

###  ProfitLossChanged

• **get ProfitLossChanged**(): *Table‹ProfitLossChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:655](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L655)*

**Returns:** *Table‹ProfitLossChangedLog, IndexableType›*

___

###  ReportingFeeChanged

• **get ReportingFeeChanged**(): *Table‹ReportingFeeChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:722](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L722)*

**Returns:** *Table‹ReportingFeeChangedLog, IndexableType›*

___

###  ReportingParticipantDisavowed

• **get ReportingParticipantDisavowed**(): *Table‹ReportingParticipantDisavowedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:658](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L658)*

**Returns:** *Table‹ReportingParticipantDisavowedLog, IndexableType›*

___

###  ShareTokenBalanceChanged

• **get ShareTokenBalanceChanged**(): *Table‹ShareTokenBalanceChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:697](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L697)*

**Returns:** *Table‹ShareTokenBalanceChangedLog, IndexableType›*

___

###  ShareTokenBalanceChangedRollup

• **get ShareTokenBalanceChangedRollup**(): *Table‹ShareTokenBalanceChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:702](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L702)*

**Returns:** *Table‹ShareTokenBalanceChangedLog, IndexableType›*

___

###  TimestampSet

• **get TimestampSet**(): *Table‹TimestampSetLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:663](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L663)*

**Returns:** *Table‹TimestampSetLog, IndexableType›*

___

###  TokenBalanceChanged

• **get TokenBalanceChanged**(): *Table‹TokenBalanceChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:666](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L666)*

**Returns:** *Table‹TokenBalanceChangedLog, IndexableType›*

___

###  TokenBalanceChangedRollup

• **get TokenBalanceChangedRollup**(): *Table‹TokenBalanceChangedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:669](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L669)*

**Returns:** *Table‹TokenBalanceChangedLog, IndexableType›*

___

###  TokensMinted

• **get TokensMinted**(): *Table‹TokensMinted, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:674](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L674)*

**Returns:** *Table‹TokensMinted, IndexableType›*

___

###  TokensTransferred

• **get TokensTransferred**(): *Table‹TokensTransferredLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:677](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L677)*

**Returns:** *Table‹TokensTransferredLog, IndexableType›*

___

###  TradingProceedsClaimed

• **get TradingProceedsClaimed**(): *Table‹TradingProceedsClaimedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:680](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L680)*

**Returns:** *Table‹TradingProceedsClaimedLog, IndexableType›*

___

###  TransferBatch

• **get TransferBatch**(): *Table‹TransferBatchLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:694](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L694)*

**Returns:** *Table‹TransferBatchLog, IndexableType›*

___

###  TransferSingle

• **get TransferSingle**(): *Table‹TransferSingleLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:691](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L691)*

**Returns:** *Table‹TransferSingleLog, IndexableType›*

___

###  UniverseCreated

• **get UniverseCreated**(): *Table‹UniverseCreatedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:685](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L685)*

**Returns:** *Table‹UniverseCreatedLog, IndexableType›*

___

###  UniverseForked

• **get UniverseForked**(): *Table‹UniverseForkedLog, IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:688](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L688)*

**Returns:** *Table‹UniverseForkedLog, IndexableType›*

___

###  ZeroXOrders

• **get ZeroXOrders**(): *Table‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), IndexableType›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:719](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L719)*

**Returns:** *Table‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), IndexableType›*

## Methods

###  addNewBlock

▸ **addNewBlock**(`dbName`: string, `blockLogs`: any): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:540](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L540)*

Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.

TODO Define blockLogs interface

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbName` | string | Name of the database to which the block should be added |
`blockLogs` | any | Logs from a new block  |

**Returns:** *Promise‹void›*

___

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:341](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L341)*

**Returns:** *Promise‹void›*

___

###  generateSchemas

▸ **generateSchemas**(): *[Schemas](../interfaces/_augur_sdk_src_state_db_db_.schemas.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:356](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L356)*

**Returns:** *[Schemas](../interfaces/_augur_sdk_src_state_db_db_.schemas.md)*

___

###  getSyncStartingBlock

▸ **getSyncStartingBlock**(): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:419](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L419)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced
block across all event log databases or the upload block number for this network.)

**Returns:** *Promise‹number›*

Promise to the block number at which to begin syncing.

___

###  initializeDB

▸ **initializeDB**(): *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:224](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L224)*

Creates databases to be used for syncing.

**Returns:** *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

___

###  notifySyncableDBAdded

▸ **notifySyncableDBAdded**(`db`: [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:395](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L395)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`db` | [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md) | dbController that utilizes the SyncableDB  |

**Returns:** *void*

___

###  prune

▸ **prune**(`timestamp`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:462](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L462)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |

**Returns:** *Promise‹void›*

___

###  registerEventListener

▸ **registerEventListener**(`eventNames`: string | string[], `callback`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:399](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L399)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`callback` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  rollback

▸ **rollback**(`blockNumber`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:500](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L500)*

Rolls back all blocks from blockNumber onward.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | number | Oldest block number to delete  |

**Returns:** *Promise‹void›*

___

###  sync

▸ **sync**(`highestAvailableBlockNumber?`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:435](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L435)*

Syncs generic events and user-specific events with blockchain and updates MetaDB info.

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber?` | number |

**Returns:** *Promise‹void›*

___

###  unregisterEventListener

▸ **unregisterEventListener**(`eventNames`: string | string[], `callback`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:406](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L406)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`callback` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

### `Static` createAndInitializeDB

▸ **createAndInitializeDB**(`networkId`: number, `uploadBlockNumber`: number, `logFilterAggregator`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md), `enableZeroX`: boolean, `concurrencyLimit`: number): *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:192](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/db/DB.ts#L192)*

Creates and returns a new dbController.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`networkId` | number | - | Network on which to sync events |
`uploadBlockNumber` | number | - | - |
`logFilterAggregator` | [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md) | - | object responsible for routing logs to individual db tables. |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) | - | - |
`enableZeroX` | boolean | false | - |
`concurrencyLimit` | number | DEFAULT_CONCURRENCY | - |

**Returns:** *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

Promise to a DB controller object
