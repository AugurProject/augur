---
id: api-classes-packages-augur-sdk-src-state-db-db-db
title: DB
sidebar_label: DB
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/DB Module]](api-modules-packages-augur-sdk-src-state-db-db-module.md) > [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)

## Class

## Hierarchy

**DB**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-db-db.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-state-db-db-db.md#augur)
* [basicDerivedDBs](api-classes-packages-augur-sdk-src-state-db-db-db.md#basicderiveddbs)
* [blockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-db-db.md#blockandlogstreamerlistener)
* [blockstreamDelay](api-classes-packages-augur-sdk-src-state-db-db-db.md#blockstreamdelay)
* [derivedDatabases](api-classes-packages-augur-sdk-src-state-db-db-db.md#deriveddatabases)
* [genericEventNames](api-classes-packages-augur-sdk-src-state-db-db-db.md#genericeventnames)
* [marketDatabase](api-classes-packages-augur-sdk-src-state-db-db-db.md#marketdatabase)
* [networkId](api-classes-packages-augur-sdk-src-state-db-db-db.md#networkid)
* [pouchDBFactory](api-classes-packages-augur-sdk-src-state-db-db-db.md#pouchdbfactory)
* [syncStatus](api-classes-packages-augur-sdk-src-state-db-db-db.md#syncstatus)
* [syncableDatabases](api-classes-packages-augur-sdk-src-state-db-db-db.md#syncabledatabases)
* [trackedUsers](api-classes-packages-augur-sdk-src-state-db-db-db.md#trackedusers)
* [userSpecificDBs](api-classes-packages-augur-sdk-src-state-db-db-db.md#userspecificdbs)

### Methods

* [addNewBlock](api-classes-packages-augur-sdk-src-state-db-db-db.md#addnewblock)
* [findCompleteSetsPurchasedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findcompletesetspurchasedlogs)
* [findCompleteSetsSoldLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findcompletesetssoldlogs)
* [findCurrentOrderLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findcurrentorderlogs)
* [findDisputeCrowdsourcerCompletedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finddisputecrowdsourcercompletedlogs)
* [findDisputeCrowdsourcerContributionLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finddisputecrowdsourcercontributionlogs)
* [findDisputeCrowdsourcerCreatedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finddisputecrowdsourcercreatedlogs)
* [findDisputeCrowdsourcerRedeemedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finddisputecrowdsourcerredeemedlogs)
* [findDisputeWindowCreatedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finddisputewindowcreatedlogs)
* [findInDerivedDB](api-classes-packages-augur-sdk-src-state-db-db-db.md#findinderiveddb)
* [findInSyncableDB](api-classes-packages-augur-sdk-src-state-db-db-db.md#findinsyncabledb)
* [findInitialReportSubmittedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findinitialreportsubmittedlogs)
* [findInitialReporterRedeemedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findinitialreporterredeemedlogs)
* [findMarketCreatedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarketcreatedlogs)
* [findMarketFinalizedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarketfinalizedlogs)
* [findMarketMigratedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarketmigratedlogs)
* [findMarketOIChangedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarketoichangedlogs)
* [findMarketVolumeChangedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarketvolumechangedlogs)
* [findMarkets](api-classes-packages-augur-sdk-src-state-db-db-db.md#findmarkets)
* [findOrderCanceledLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findordercanceledlogs)
* [findOrderCreatedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findordercreatedlogs)
* [findOrderFilledLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findorderfilledlogs)
* [findOrderPriceChangedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findorderpricechangedlogs)
* [findParticipationTokensRedeemedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findparticipationtokensredeemedlogs)
* [findProfitLossChangedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findprofitlosschangedlogs)
* [findTimestampSetLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findtimestampsetlogs)
* [findTokenBalanceChangedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findtokenbalancechangedlogs)
* [findTradingProceedsClaimedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#findtradingproceedsclaimedlogs)
* [findUniverseForkedLogs](api-classes-packages-augur-sdk-src-state-db-db-db.md#finduniverseforkedlogs)
* [fullTextMarketSearch](api-classes-packages-augur-sdk-src-state-db-db-db.md#fulltextmarketsearch)
* [getDatabaseName](api-classes-packages-augur-sdk-src-state-db-db-db.md#getdatabasename)
* [getDerivedDatabase](api-classes-packages-augur-sdk-src-state-db-db-db.md#getderiveddatabase)
* [getSyncStartingBlock](api-classes-packages-augur-sdk-src-state-db-db-db.md#getsyncstartingblock)
* [getSyncableDatabase](api-classes-packages-augur-sdk-src-state-db-db-db.md#getsyncabledatabase)
* [initializeDB](api-classes-packages-augur-sdk-src-state-db-db-db.md#initializedb)
* [notifyDerivedDBAdded](api-classes-packages-augur-sdk-src-state-db-db-db.md#notifyderiveddbadded)
* [notifySyncableDBAdded](api-classes-packages-augur-sdk-src-state-db-db-db.md#notifysyncabledbadded)
* [registerEventListener](api-classes-packages-augur-sdk-src-state-db-db-db.md#registereventlistener)
* [rollback](api-classes-packages-augur-sdk-src-state-db-db-db.md#rollback)
* [sync](api-classes-packages-augur-sdk-src-state-db-db-db.md#sync)
* [createAndInitializeDB](api-classes-packages-augur-sdk-src-state-db-db-db.md#createandinitializedb)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new DB**(pouchDBFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*): [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)

*Defined in [packages/augur-sdk/src/state/db/DB.ts:89](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| pouchDBFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |

**Returns:** [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:59](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L59)*

___
<a id="basicderiveddbs"></a>

###  basicDerivedDBs

**● basicDerivedDBs**: *`Array`<[DerivedDBConfiguration](api-interfaces-packages-augur-sdk-src-state-db-db-deriveddbconfiguration.md)>* =  [
    {
      "name": "CurrentOrders",
      "eventNames": ["OrderEvent"],
      "idFields": ["orderId"]
    },
  ]

*Defined in [packages/augur-sdk/src/state/db/DB.ts:63](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L63)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:58](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L58)*

___
<a id="blockstreamdelay"></a>

### `<Private>` blockstreamDelay

**● blockstreamDelay**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:52](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L52)*

___
<a id="deriveddatabases"></a>

### `<Private>` derivedDatabases

**● derivedDatabases**: *`object`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:56](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L56)*

#### Type declaration

[dbName: `string`]: [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___
<a id="genericeventnames"></a>

### `<Private>` genericEventNames

**● genericEventNames**: *`Array`<`string`>*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:54](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L54)*

___
<a id="marketdatabase"></a>

### `<Private>` marketDatabase

**● marketDatabase**: *[MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:57](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L57)*

___
<a id="networkid"></a>

### `<Private>` networkId

**● networkId**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:51](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L51)*

___
<a id="pouchdbfactory"></a>

###  pouchDBFactory

**● pouchDBFactory**: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:60](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L60)*

___
<a id="syncstatus"></a>

###  syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:61](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L61)*

___
<a id="syncabledatabases"></a>

### `<Private>` syncableDatabases

**● syncableDatabases**: *`object`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:55](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L55)*

#### Type declaration

[dbName: `string`]: [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="trackedusers"></a>

### `<Private>` trackedUsers

**● trackedUsers**: *[TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:53](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L53)*

___
<a id="userspecificdbs"></a>

###  userSpecificDBs

**● userSpecificDBs**: *`Array`<[UserSpecificDBConfiguration](api-interfaces-packages-augur-sdk-src-state-db-db-userspecificdbconfiguration.md)>* =  [
    {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [1, 2],
    },
    {
      "name": "ProfitLossChanged",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [2],
    },
    {
      "name": "TokenBalanceChanged",
      "numAdditionalTopics": 2,
      "userTopicIndicies": [1],
      "idFields": ["token"]
    },
  ]

*Defined in [packages/augur-sdk/src/state/db/DB.ts:72](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L72)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(dbName: *`string`*, blockLogs: *`any`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:344](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L344)*

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

▸ **findCompleteSetsPurchasedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:391](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L391)*

Queries the CompleteSetsPurchased DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)>>

___
<a id="findcompletesetssoldlogs"></a>

###  findCompleteSetsSoldLogs

▸ **findCompleteSetsSoldLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:402](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L402)*

Queries the CompleteSetsSold DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)>>

___
<a id="findcurrentorderlogs"></a>

###  findCurrentOrderLogs

▸ **findCurrentOrderLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:670](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L670)*

Queries the CurrentOrders DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

___
<a id="finddisputecrowdsourcercompletedlogs"></a>

###  findDisputeCrowdsourcerCompletedLogs

▸ **findDisputeCrowdsourcerCompletedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerCompletedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:413](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L413)*

Queries the DisputeCrowdsourcerCompleted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerCompletedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)>>

___
<a id="finddisputecrowdsourcercontributionlogs"></a>

###  findDisputeCrowdsourcerContributionLogs

▸ **findDisputeCrowdsourcerContributionLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:424](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L424)*

Queries the DisputeCrowdsourcerContribution DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)>>

___
<a id="finddisputecrowdsourcercreatedlogs"></a>

###  findDisputeCrowdsourcerCreatedLogs

▸ **findDisputeCrowdsourcerCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:435](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L435)*

Queries the DisputeCrowdsourcerCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)>>

___
<a id="finddisputecrowdsourcerredeemedlogs"></a>

###  findDisputeCrowdsourcerRedeemedLogs

▸ **findDisputeCrowdsourcerRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:446](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L446)*

Queries the DisputeCrowdsourcerRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)>>

___
<a id="finddisputewindowcreatedlogs"></a>

###  findDisputeWindowCreatedLogs

▸ **findDisputeWindowCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[DisputeWindowCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:457](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L457)*

Queries the DisputeWindowCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[DisputeWindowCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md)>>

___
<a id="findinderiveddb"></a>

###  findInDerivedDB

▸ **findInDerivedDB**(dbName: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:381](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L381)*

Queries a DerivedDB.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  Name of the SyncableDB to query |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`FindResponse`<`__type`>>
> > } Promise to a FindResponse

___
<a id="findinsyncabledb"></a>

###  findInSyncableDB

▸ **findInSyncableDB**(dbName: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:370](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L370)*

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

▸ **findInitialReportSubmittedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:479](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L479)*

Queries the InitialReportSubmitted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)>>

___
<a id="findinitialreporterredeemedlogs"></a>

###  findInitialReporterRedeemedLogs

▸ **findInitialReporterRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:468](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L468)*

Queries the InitialReporterRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)>>

___
<a id="findmarketcreatedlogs"></a>

###  findMarketCreatedLogs

▸ **findMarketCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:490](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L490)*

Queries the MarketCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)>>

___
<a id="findmarketfinalizedlogs"></a>

###  findMarketFinalizedLogs

▸ **findMarketFinalizedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:501](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L501)*

Queries the MarketFinalized DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)>>

___
<a id="findmarketmigratedlogs"></a>

###  findMarketMigratedLogs

▸ **findMarketMigratedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketMigratedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketmigratedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:512](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L512)*

Queries the MarketMigrated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketMigratedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketmigratedlog.md)>>

___
<a id="findmarketoichangedlogs"></a>

###  findMarketOIChangedLogs

▸ **findMarketOIChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketOIChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:534](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L534)*

Queries the MarketOIChanged DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketOIChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md)>>

___
<a id="findmarketvolumechangedlogs"></a>

###  findMarketVolumeChangedLogs

▸ **findMarketVolumeChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:523](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L523)*

Queries the MarketVolumeChanged DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)>>

___
<a id="findmarkets"></a>

###  findMarkets

▸ **findMarkets**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:683](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L683)*

Queries the Markets DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)>>

___
<a id="findordercanceledlogs"></a>

###  findOrderCanceledLogs

▸ **findOrderCanceledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:545](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L545)*

Queries the OrderEvent DB for Cancel events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

___
<a id="findordercreatedlogs"></a>

###  findOrderCreatedLogs

▸ **findOrderCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:559](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L559)*

Queries the OrderEvent DB for Create events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

___
<a id="findorderfilledlogs"></a>

###  findOrderFilledLogs

▸ **findOrderFilledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:573](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L573)*

Queries the OrderEvent DB for Fill events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

___
<a id="findorderpricechangedlogs"></a>

###  findOrderPriceChangedLogs

▸ **findOrderPriceChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:587](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L587)*

Queries the OrderEvent DB for PriceChanged events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)>>

___
<a id="findparticipationtokensredeemedlogs"></a>

###  findParticipationTokensRedeemedLogs

▸ **findParticipationTokensRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:601](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L601)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)>>

___
<a id="findprofitlosschangedlogs"></a>

###  findProfitLossChangedLogs

▸ **findProfitLossChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:613](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L613)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)>>

___
<a id="findtimestampsetlogs"></a>

###  findTimestampSetLogs

▸ **findTimestampSetLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TimestampSetLog](api-interfaces-packages-augur-sdk-src-state-logs-types-timestampsetlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:624](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L624)*

Queries the TimestampSet DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TimestampSetLog](api-interfaces-packages-augur-sdk-src-state-logs-types-timestampsetlog.md)>>

___
<a id="findtokenbalancechangedlogs"></a>

###  findTokenBalanceChangedLogs

▸ **findTokenBalanceChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TokenBalanceChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:636](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L636)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TokenBalanceChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md)>>

___
<a id="findtradingproceedsclaimedlogs"></a>

###  findTradingProceedsClaimedLogs

▸ **findTradingProceedsClaimedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:648](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L648)*

Queries the TradingProceedsClaimed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)>>

___
<a id="finduniverseforkedlogs"></a>

###  findUniverseForkedLogs

▸ **findUniverseForkedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<`Array`<[UniverseForkedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-universeforkedlog.md)>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:659](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L659)*

Queries the UniverseForked DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<`Array`<[UniverseForkedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-universeforkedlog.md)>>

___
<a id="fulltextmarketsearch"></a>

###  fullTextMarketSearch

▸ **fullTextMarketSearch**(query: *`string`*): `Array`<`object`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:247](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L247)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` |

**Returns:** `Array`<`object`>

___
<a id="getdatabasename"></a>

###  getDatabaseName

▸ **getDatabaseName**(eventName: *`string`*, trackableUserAddress?: *`string`*): `string`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:278](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L278)*

Creates a name for a SyncableDB/UserSyncableDB based on `eventName` & `trackableUserAddress`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| eventName | `string` |  Event log name |
| `Optional` trackableUserAddress | `string` |  User address to append to DB name |

**Returns:** `string`

___
<a id="getderiveddatabase"></a>

###  getDerivedDatabase

▸ **getDerivedDatabase**(dbName: *`string`*): [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

*Defined in [packages/augur-sdk/src/state/db/DB.ts:299](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L299)*

Gets a derived database based upon the name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  The name of the database |

**Returns:** [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___
<a id="getsyncstartingblock"></a>

###  getSyncStartingBlock

▸ **getSyncStartingBlock**(): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:258](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L258)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced block across all event log databases or the upload block number for this network.)

**Returns:** `Promise`<`number`>
Promise to the block number at which to begin syncing.

___
<a id="getsyncabledatabase"></a>

###  getSyncableDatabase

▸ **getSyncableDatabase**(dbName: *`string`*): [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

*Defined in [packages/augur-sdk/src/state/db/DB.ts:290](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L290)*

Gets a syncable database based upon the name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  The name of the database |

**Returns:** [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="initializedb"></a>

###  initializeDB

▸ **initializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`Array`<`string`>*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*): `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:130](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L130)*

Creates databases to be used for syncing.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `Array`<`string`> |  Array of user addresses for which to sync user-specific events |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md) |  \- |

**Returns:** `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

___
<a id="notifyderiveddbadded"></a>

###  notifyDerivedDBAdded

▸ **notifyDerivedDBAdded**(db: *[DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)*): `void`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:186](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L186)*

Called from DerivedDB constructor once DerivedDB is successfully created.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| db | [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md) |  dbController that utilizes the DerivedDB |

**Returns:** `void`

___
<a id="notifysyncabledbadded"></a>

###  notifySyncableDBAdded

▸ **notifySyncableDBAdded**(db: *[SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)*): `void`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:177](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L177)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| db | [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md) |  dbController that utilizes the SyncableDB |

**Returns:** `void`

___
<a id="registereventlistener"></a>

###  registerEventListener

▸ **registerEventListener**(eventName: *`string`*, callback: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:190](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L190)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| callback | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:308](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L308)*

Rolls back all blocks from blockNumber onward.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| blockNumber | `number` |  Oldest block number to delete |

**Returns:** `Promise`<`void`>

___
<a id="sync"></a>

###  sync

▸ **sync**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, chunkSize: *`number`*, blockstreamDelay: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:201](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L201)*

Syncs generic events and user-specific events with blockchain and updates MetaDB info.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |  Augur object with which to sync |
| chunkSize | `number` |  Number of blocks to retrieve at a time when syncing logs |
| blockstreamDelay | `number` |  Number of blocks by which blockstream is behind the blockchain |

**Returns:** `Promise`<`void`>

___
<a id="createandinitializedb"></a>

### `<Static>` createAndInitializeDB

▸ **createAndInitializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`Array`<`string`>*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, pouchDBFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*): `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:109](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/DB.ts#L109)*

Creates and returns a new dbController.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `Array`<`string`> |  Array of user addresses for which to sync user-specific events |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| pouchDBFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |  Factory function generatin PouchDB instance |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md) |  Stream listener for blocks and logs |

**Returns:** `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>
Promise to a DB controller object

___

