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
* [dexieDB](_augur_sdk_src_state_db_db_.db.md#dexiedb)
* [disputeDatabase](_augur_sdk_src_state_db_db_.db.md#private-disputedatabase)
* [enableZeroX](_augur_sdk_src_state_db_db_.db.md#private-enablezerox)
* [genericEventDBDescriptions](_augur_sdk_src_state_db_db_.db.md#genericeventdbdescriptions)
* [logFilters](_augur_sdk_src_state_db_db_.db.md#logfilters)
* [marketDatabase](_augur_sdk_src_state_db_db_.db.md#marketdatabase)
* [networkId](_augur_sdk_src_state_db_db_.db.md#private-networkid)
* [parsedOrderEventDatabase](_augur_sdk_src_state_db_db_.db.md#private-parsedordereventdatabase)
* [syncStatus](_augur_sdk_src_state_db_db_.db.md#syncstatus)
* [syncableDatabases](_augur_sdk_src_state_db_db_.db.md#private-syncabledatabases)
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
* [delete](_augur_sdk_src_state_db_db_.db.md#delete)
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

\+ **new DB**(`dexieDB`: Dexie, `logFilters`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md), `networkId`: number, `enableZeroX`: boolean): *[DB](_augur_sdk_src_state_db_db_.db.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:157](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`dexieDB` | Dexie |
`logFilters` | [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md) |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`networkId` | number |
`enableZeroX` | boolean |

**Returns:** *[DB](_augur_sdk_src_state_db_db_.db.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:162](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L162)*

___

### `Private` currentOrdersDatabase

• **currentOrdersDatabase**: *[CurrentOrdersDatabase](_augur_sdk_src_state_db_currentordersdb_.currentordersdatabase.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:69](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L69)*

___

###  dexieDB

• **dexieDB**: *Dexie*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:160](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L160)*

___

### `Private` disputeDatabase

• **disputeDatabase**: *[DisputeDatabase](_augur_sdk_src_state_db_disputedb_.disputedatabase.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:68](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L68)*

___

### `Private` enableZeroX

• **enableZeroX**: *boolean*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:164](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L164)*

___

###  genericEventDBDescriptions

• **genericEventDBDescriptions**: *[GenericEventDBDescription](../interfaces/_augur_sdk_src_state_logs_types_.genericeventdbdescription.md)[]* = [
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
    { EventName: 'InitialReporterTransferred', indexes: ['market'] },
    {
      EventName: 'MarketCreated',
      indexes: ['market', 'timestamp', '[universe+timestamp]'],
    },
    { EventName: 'MarketFinalized', indexes: ['market', 'timestamp'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: ['market'] },
    { EventName: 'MarketTransferred', indexes: ['market'] },
    { EventName: 'MarketVolumeChanged', indexes: ['market'], primaryKey: 'market' },
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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:76](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L76)*

___

###  logFilters

• **logFilters**: *[LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:161](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L161)*

___

###  marketDatabase

• **marketDatabase**: *[MarketDB](_augur_sdk_src_state_db_marketdb_.marketdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:70](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L70)*

___

### `Private` networkId

• **networkId**: *number*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:163](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L163)*

___

### `Private` parsedOrderEventDatabase

• **parsedOrderEventDatabase**: *[ParsedOrderEventDB](_augur_sdk_src_state_db_parsedordereventdb_.parsedordereventdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:71](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L71)*

___

###  syncStatus

• **syncStatus**: *[SyncStatus](_augur_sdk_src_state_db_syncstatus_.syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:73](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L73)*

___

### `Private` syncableDatabases

• **syncableDatabases**: *object*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:67](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L67)*

#### Type declaration:

* \[ **dbName**: *string*\]: [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md)

___

###  warpCheckpoints

• **warpCheckpoints**: *[WarpSyncCheckpointsDB](_augur_sdk_src_state_db_warpsynccheckpointsdb_.warpsynccheckpointsdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:74](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L74)*

___

### `Private` zeroXOrders

• **zeroXOrders**: *[ZeroXOrders](_augur_sdk_src_state_db_zeroxorders_.zeroxorders.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:72](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L72)*

## Accessors

###  CancelZeroXOrder

• **get CancelZeroXOrder**(): *Table‹[CancelZeroXOrderLog](../interfaces/_augur_sdk_src_state_logs_types_.cancelzeroxorderlog.md), any›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:503](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L503)*

**Returns:** *Table‹[CancelZeroXOrderLog](../interfaces/_augur_sdk_src_state_logs_types_.cancelzeroxorderlog.md), any›*

___

###  CompleteSetsPurchased

• **get CompleteSetsPurchased**(): *Table‹[CompleteSetsPurchasedLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetspurchasedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:483](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L483)*

**Returns:** *Table‹[CompleteSetsPurchasedLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetspurchasedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  CompleteSetsSold

• **get CompleteSetsSold**(): *Table‹[CompleteSetsSoldLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetssoldlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:484](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L484)*

**Returns:** *Table‹[CompleteSetsSoldLog](../interfaces/_augur_sdk_src_state_logs_types_.completesetssoldlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  CurrentOrders

• **get CurrentOrders**(): *Table‹[CurrentOrder](../interfaces/_augur_sdk_src_state_logs_types_.currentorder.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:522](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L522)*

**Returns:** *Table‹[CurrentOrder](../interfaces/_augur_sdk_src_state_logs_types_.currentorder.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  Dispute

• **get Dispute**(): *Table‹[DisputeDoc](../interfaces/_augur_sdk_src_state_logs_types_.disputedoc.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:521](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L521)*

**Returns:** *Table‹[DisputeDoc](../interfaces/_augur_sdk_src_state_logs_types_.disputedoc.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  DisputeCrowdsourcerCompleted

• **get DisputeCrowdsourcerCompleted**(): *Table‹[DisputeCrowdsourcerCompletedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercompletedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:486](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L486)*

**Returns:** *Table‹[DisputeCrowdsourcerCompletedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercompletedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  DisputeCrowdsourcerContribution

• **get DisputeCrowdsourcerContribution**(): *Table‹[DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:485](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L485)*

**Returns:** *Table‹[DisputeCrowdsourcerContributionLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercontributionlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  DisputeCrowdsourcerCreated

• **get DisputeCrowdsourcerCreated**(): *Table‹[DisputeCrowdsourcerCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:487](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L487)*

**Returns:** *Table‹[DisputeCrowdsourcerCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcercreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  DisputeCrowdsourcerRedeemed

• **get DisputeCrowdsourcerRedeemed**(): *Table‹[DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:488](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L488)*

**Returns:** *Table‹[DisputeCrowdsourcerRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputecrowdsourcerredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  DisputeWindowCreated

• **get DisputeWindowCreated**(): *Table‹[DisputeWindowCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputewindowcreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:489](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L489)*

**Returns:** *Table‹[DisputeWindowCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.disputewindowcreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  InitialReportSubmitted

• **get InitialReportSubmitted**(): *Table‹[InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:491](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L491)*

**Returns:** *Table‹[InitialReportSubmittedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportsubmittedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  InitialReporterRedeemed

• **get InitialReporterRedeemed**(): *Table‹[InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:490](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L490)*

**Returns:** *Table‹[InitialReporterRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreporterredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  InitialReporterTransferred

• **get InitialReporterTransferred**(): *Table‹[InitialReporterTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportertransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:492](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L492)*

**Returns:** *Table‹[InitialReporterTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.initialreportertransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketCreated

• **get MarketCreated**(): *Table‹[MarketCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:493](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L493)*

**Returns:** *Table‹[MarketCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketcreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketFinalized

• **get MarketFinalized**(): *Table‹[MarketFinalizedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketfinalizedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:494](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L494)*

**Returns:** *Table‹[MarketFinalizedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketfinalizedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketMigrated

• **get MarketMigrated**(): *Table‹[MarketMigratedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketmigratedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:495](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L495)*

**Returns:** *Table‹[MarketMigratedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketmigratedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketOIChanged

• **get MarketOIChanged**(): *Table‹[MarketOIChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketoichangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:500](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L500)*

**Returns:** *Table‹[MarketOIChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketoichangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketOIChangedRollup

• **get MarketOIChangedRollup**(): *Table‹[MarketOIChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketoichangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:501](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L501)*

**Returns:** *Table‹[MarketOIChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketoichangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketParticipantsDisavowed

• **get MarketParticipantsDisavowed**(): *Table‹[MarketParticipantsDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketparticipantsdisavowedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:496](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L496)*

**Returns:** *Table‹[MarketParticipantsDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketparticipantsdisavowedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketTransferred

• **get MarketTransferred**(): *Table‹[MarketTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.markettransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:497](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L497)*

**Returns:** *Table‹[MarketTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.markettransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketVolumeChanged

• **get MarketVolumeChanged**(): *Table‹[MarketVolumeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketvolumechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:498](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L498)*

**Returns:** *Table‹[MarketVolumeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketvolumechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  MarketVolumeChangedRollup

• **get MarketVolumeChangedRollup**(): *Table‹[MarketVolumeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketvolumechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:499](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L499)*

**Returns:** *Table‹[MarketVolumeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.marketvolumechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  Markets

• **get Markets**(): *Table‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:519](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L519)*

**Returns:** *Table‹[MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  OrderEvent

• **get OrderEvent**(): *Table‹[OrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.ordereventlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:502](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L502)*

**Returns:** *Table‹[OrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.ordereventlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ParsedOrderEvent

• **get ParsedOrderEvent**(): *Table‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:520](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L520)*

**Returns:** *Table‹[ParsedOrderEventLog](../interfaces/_augur_sdk_src_state_logs_types_.parsedordereventlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ParticipationTokensRedeemed

• **get ParticipationTokensRedeemed**(): *Table‹[ParticipationTokensRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.participationtokensredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:504](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L504)*

**Returns:** *Table‹[ParticipationTokensRedeemedLog](../interfaces/_augur_sdk_src_state_logs_types_.participationtokensredeemedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ProfitLossChanged

• **get ProfitLossChanged**(): *Table‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:505](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L505)*

**Returns:** *Table‹[ProfitLossChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.profitlosschangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ReportingFeeChanged

• **get ReportingFeeChanged**(): *Table‹[ReportingFeeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingfeechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:524](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L524)*

**Returns:** *Table‹[ReportingFeeChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingfeechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ReportingParticipantDisavowed

• **get ReportingParticipantDisavowed**(): *Table‹[ReportingParticipantDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingparticipantdisavowedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:506](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L506)*

**Returns:** *Table‹[ReportingParticipantDisavowedLog](../interfaces/_augur_sdk_src_state_logs_types_.reportingparticipantdisavowedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ShareTokenBalanceChanged

• **get ShareTokenBalanceChanged**(): *Table‹[ShareTokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.sharetokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:517](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L517)*

**Returns:** *Table‹[ShareTokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.sharetokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ShareTokenBalanceChangedRollup

• **get ShareTokenBalanceChangedRollup**(): *Table‹[ShareTokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.sharetokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:518](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L518)*

**Returns:** *Table‹[ShareTokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.sharetokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TimestampSet

• **get TimestampSet**(): *Table‹[TimestampSetLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampsetlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:507](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L507)*

**Returns:** *Table‹[TimestampSetLog](../interfaces/_augur_sdk_src_state_logs_types_.timestampsetlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TokenBalanceChanged

• **get TokenBalanceChanged**(): *Table‹[TokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:508](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L508)*

**Returns:** *Table‹[TokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TokenBalanceChangedRollup

• **get TokenBalanceChangedRollup**(): *Table‹[TokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:509](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L509)*

**Returns:** *Table‹[TokenBalanceChangedLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenbalancechangedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TokensMinted

• **get TokensMinted**(): *Table‹[TokensMinted](../interfaces/_augur_sdk_src_state_logs_types_.tokensminted.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:510](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L510)*

**Returns:** *Table‹[TokensMinted](../interfaces/_augur_sdk_src_state_logs_types_.tokensminted.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TokensTransferred

• **get TokensTransferred**(): *Table‹[TokensTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenstransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:511](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L511)*

**Returns:** *Table‹[TokensTransferredLog](../interfaces/_augur_sdk_src_state_logs_types_.tokenstransferredlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TradingProceedsClaimed

• **get TradingProceedsClaimed**(): *Table‹[TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:512](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L512)*

**Returns:** *Table‹[TradingProceedsClaimedLog](../interfaces/_augur_sdk_src_state_logs_types_.tradingproceedsclaimedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TransferBatch

• **get TransferBatch**(): *Table‹[TransferBatchLog](../interfaces/_augur_sdk_src_state_logs_types_.transferbatchlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:516](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L516)*

**Returns:** *Table‹[TransferBatchLog](../interfaces/_augur_sdk_src_state_logs_types_.transferbatchlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  TransferSingle

• **get TransferSingle**(): *Table‹[TransferSingleLog](../interfaces/_augur_sdk_src_state_logs_types_.transfersinglelog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:515](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L515)*

**Returns:** *Table‹[TransferSingleLog](../interfaces/_augur_sdk_src_state_logs_types_.transfersinglelog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  UniverseCreated

• **get UniverseCreated**(): *Table‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:513](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L513)*

**Returns:** *Table‹[UniverseCreatedLog](../interfaces/_augur_sdk_src_state_logs_types_.universecreatedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  UniverseForked

• **get UniverseForked**(): *Table‹[UniverseForkedLog](../interfaces/_augur_sdk_src_state_logs_types_.universeforkedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:514](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L514)*

**Returns:** *Table‹[UniverseForkedLog](../interfaces/_augur_sdk_src_state_logs_types_.universeforkedlog.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

___

###  ZeroXOrders

• **get ZeroXOrders**(): *Table‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:523](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L523)*

**Returns:** *Table‹[StoredOrder](../interfaces/_augur_sdk_src_state_db_zeroxorders_.storedorder.md), string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][] | ReadonlyArray‹string | number | Date | ArrayBuffer | ArrayBufferView | DataView | void[][]››*

## Methods

###  addNewBlock

▸ **addNewBlock**(`dbName`: string, `blockLogs`: any): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:466](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L466)*

Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.

TODO Define blockLogs interface

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbName` | string | Name of the database to which the block should be added |
`blockLogs` | any | Logs from a new block  |

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:277](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L277)*

**Returns:** *Promise‹void›*

___

###  generateSchemas

▸ **generateSchemas**(): *[Schemas](../interfaces/_augur_sdk_src_state_db_db_.schemas.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:305](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L305)*

**Returns:** *[Schemas](../interfaces/_augur_sdk_src_state_db_db_.schemas.md)*

___

###  getSyncStartingBlock

▸ **getSyncStartingBlock**(): *Promise‹number›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:359](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L359)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced
block across all event log databases or the upload block number for this network.)

**Returns:** *Promise‹number›*

Promise to the block number at which to begin syncing.

___

###  initializeDB

▸ **initializeDB**(`uploadBlockNumber`: number): *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:197](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L197)*

Creates databases to be used for syncing.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`uploadBlockNumber` | number | 0 |

**Returns:** *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

___

###  notifySyncableDBAdded

▸ **notifySyncableDBAdded**(`db`: [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:341](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L341)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`db` | [BaseSyncableDB](_augur_sdk_src_state_db_basesyncabledb_.basesyncabledb.md) | dbController that utilizes the SyncableDB  |

**Returns:** *void*

___

###  prune

▸ **prune**(`timestamp`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:400](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L400)*

**Parameters:**

Name | Type |
------ | ------ |
`timestamp` | number |

**Returns:** *Promise‹void›*

___

###  registerEventListener

▸ **registerEventListener**(`eventNames`: string | string[], `callback`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:345](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L345)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`callback` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  rollback

▸ **rollback**(`blockNumber`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:432](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L432)*

Rolls back all blocks from blockNumber onward.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockNumber` | number | Oldest block number to delete  |

**Returns:** *Promise‹void›*

___

###  sync

▸ **sync**(`highestAvailableBlockNumber?`: number): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:372](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L372)*

Syncs generic events and user-specific events with blockchain and updates MetaDB info.

**Parameters:**

Name | Type |
------ | ------ |
`highestAvailableBlockNumber?` | number |

**Returns:** *Promise‹void›*

___

###  unregisterEventListener

▸ **unregisterEventListener**(`eventNames`: string | string[], `callback`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:349](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L349)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`callback` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

### `Static` createAndInitializeDB

▸ **createAndInitializeDB**(`networkId`: number, `logFilterAggregator`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md), `augur`: [Augur](_augur_sdk_src_augur_.augur.md), `enableZeroX`: boolean): *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:178](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/db/DB.ts#L178)*

Creates and returns a new dbController.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`networkId` | number | - | Network on which to sync events |
`logFilterAggregator` | [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md) | - | object responsible for routing logs to individual db tables. |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) | - | - |
`enableZeroX` | boolean | false | - |

**Returns:** *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

Promise to a DB controller object
