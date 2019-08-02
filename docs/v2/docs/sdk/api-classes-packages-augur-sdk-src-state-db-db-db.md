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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:90](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L90)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:60](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L60)*

___
<a id="basicderiveddbs"></a>

###  basicDerivedDBs

**● basicDerivedDBs**: *[DerivedDBConfiguration](api-interfaces-packages-augur-sdk-src-state-db-db-deriveddbconfiguration.md)[]* =  [
    {
      "name": "CurrentOrders",
      "eventNames": ["OrderEvent"],
      "idFields": ["orderId"],
    },
  ]

*Defined in [packages/augur-sdk/src/state/db/DB.ts:64](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L64)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:59](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L59)*

___
<a id="blockstreamdelay"></a>

### `<Private>` blockstreamDelay

**● blockstreamDelay**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:53](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L53)*

___
<a id="deriveddatabases"></a>

### `<Private>` derivedDatabases

**● derivedDatabases**: *`object`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:57](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L57)*

#### Type declaration

[dbName: `string`]: [DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)

___
<a id="genericeventnames"></a>

### `<Private>` genericEventNames

**● genericEventNames**: *`string`[]*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:55](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L55)*

___
<a id="marketdatabase"></a>

### `<Private>` marketDatabase

**● marketDatabase**: *[MarketDB](api-classes-packages-augur-sdk-src-state-db-marketdb-marketdb.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:58](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L58)*

___
<a id="networkid"></a>

### `<Private>` networkId

**● networkId**: *`number`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:52](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L52)*

___
<a id="pouchdbfactory"></a>

###  pouchDBFactory

**● pouchDBFactory**: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:61](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L61)*

___
<a id="syncstatus"></a>

###  syncStatus

**● syncStatus**: *[SyncStatus](api-classes-packages-augur-sdk-src-state-db-syncstatus-syncstatus.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:62](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L62)*

___
<a id="syncabledatabases"></a>

### `<Private>` syncableDatabases

**● syncableDatabases**: *`object`*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:56](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L56)*

#### Type declaration

[dbName: `string`]: [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="trackedusers"></a>

### `<Private>` trackedUsers

**● trackedUsers**: *[TrackedUsers](api-classes-packages-augur-sdk-src-state-db-trackedusers-trackedusers.md)*

*Defined in [packages/augur-sdk/src/state/db/DB.ts:54](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L54)*

___
<a id="userspecificdbs"></a>

###  userSpecificDBs

**● userSpecificDBs**: *[UserSpecificDBConfiguration](api-interfaces-packages-augur-sdk-src-state-db-db-userspecificdbconfiguration.md)[]* =  [
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
      "idFields": ["token"],
    },
  ]

*Defined in [packages/augur-sdk/src/state/db/DB.ts:73](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L73)*

___

## Methods

<a id="addnewblock"></a>

###  addNewBlock

▸ **addNewBlock**(dbName: *`string`*, blockLogs: *`any`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:347](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L347)*

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

▸ **findCompleteSetsPurchasedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:394](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L394)*

Queries the CompleteSetsPurchased DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[CompleteSetsPurchasedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetspurchasedlog.md)[]>

___
<a id="findcompletesetssoldlogs"></a>

###  findCompleteSetsSoldLogs

▸ **findCompleteSetsSoldLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:405](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L405)*

Queries the CompleteSetsSold DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[CompleteSetsSoldLog](api-interfaces-packages-augur-sdk-src-state-logs-types-completesetssoldlog.md)[]>

___
<a id="findcurrentorderlogs"></a>

###  findCurrentOrderLogs

▸ **findCurrentOrderLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:673](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L673)*

Queries the CurrentOrders DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

___
<a id="finddisputecrowdsourcercompletedlogs"></a>

###  findDisputeCrowdsourcerCompletedLogs

▸ **findDisputeCrowdsourcerCompletedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[DisputeCrowdsourcerCompletedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:416](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L416)*

Queries the DisputeCrowdsourcerCompleted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[DisputeCrowdsourcerCompletedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercompletedlog.md)[]>

___
<a id="finddisputecrowdsourcercontributionlogs"></a>

###  findDisputeCrowdsourcerContributionLogs

▸ **findDisputeCrowdsourcerContributionLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:427](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L427)*

Queries the DisputeCrowdsourcerContribution DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[DisputeCrowdsourcerContributionLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercontributionlog.md)[]>

___
<a id="finddisputecrowdsourcercreatedlogs"></a>

###  findDisputeCrowdsourcerCreatedLogs

▸ **findDisputeCrowdsourcerCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[DisputeCrowdsourcerCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:438](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L438)*

Queries the DisputeCrowdsourcerCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[DisputeCrowdsourcerCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcercreatedlog.md)[]>

___
<a id="finddisputecrowdsourcerredeemedlogs"></a>

###  findDisputeCrowdsourcerRedeemedLogs

▸ **findDisputeCrowdsourcerRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:449](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L449)*

Queries the DisputeCrowdsourcerRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[DisputeCrowdsourcerRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputecrowdsourcerredeemedlog.md)[]>

___
<a id="finddisputewindowcreatedlogs"></a>

###  findDisputeWindowCreatedLogs

▸ **findDisputeWindowCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[DisputeWindowCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:460](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L460)*

Queries the DisputeWindowCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[DisputeWindowCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-disputewindowcreatedlog.md)[]>

___
<a id="findinderiveddb"></a>

###  findInDerivedDB

▸ **findInDerivedDB**(dbName: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<`FindResponse`<`__type`>>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:384](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L384)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:373](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L373)*

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

▸ **findInitialReportSubmittedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:482](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L482)*

Queries the InitialReportSubmitted DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[InitialReportSubmittedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreportsubmittedlog.md)[]>

___
<a id="findinitialreporterredeemedlogs"></a>

###  findInitialReporterRedeemedLogs

▸ **findInitialReporterRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:471](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L471)*

Queries the InitialReporterRedeemed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[InitialReporterRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-initialreporterredeemedlog.md)[]>

___
<a id="findmarketcreatedlogs"></a>

###  findMarketCreatedLogs

▸ **findMarketCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:493](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L493)*

Queries the MarketCreated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketCreatedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketcreatedlog.md)[]>

___
<a id="findmarketfinalizedlogs"></a>

###  findMarketFinalizedLogs

▸ **findMarketFinalizedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:504](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L504)*

Queries the MarketFinalized DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketFinalizedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketfinalizedlog.md)[]>

___
<a id="findmarketmigratedlogs"></a>

###  findMarketMigratedLogs

▸ **findMarketMigratedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketMigratedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketmigratedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:515](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L515)*

Queries the MarketMigrated DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketMigratedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketmigratedlog.md)[]>

___
<a id="findmarketoichangedlogs"></a>

###  findMarketOIChangedLogs

▸ **findMarketOIChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketOIChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:537](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L537)*

Queries the MarketOIChanged DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketOIChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketoichangedlog.md)[]>

___
<a id="findmarketvolumechangedlogs"></a>

###  findMarketVolumeChangedLogs

▸ **findMarketVolumeChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:526](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L526)*

Queries the MarketVolumeChanged DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketVolumeChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-marketvolumechangedlog.md)[]>

___
<a id="findmarkets"></a>

###  findMarkets

▸ **findMarkets**(request: *`FindRequest`<`__type`>*): `Promise`<[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:686](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L686)*

Queries the Markets DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[MarketData](api-interfaces-packages-augur-sdk-src-state-logs-types-marketdata.md)[]>

___
<a id="findordercanceledlogs"></a>

###  findOrderCanceledLogs

▸ **findOrderCanceledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:548](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L548)*

Queries the OrderEvent DB for Cancel events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

___
<a id="findordercreatedlogs"></a>

###  findOrderCreatedLogs

▸ **findOrderCreatedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:562](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L562)*

Queries the OrderEvent DB for Create events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

___
<a id="findorderfilledlogs"></a>

###  findOrderFilledLogs

▸ **findOrderFilledLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:576](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L576)*

Queries the OrderEvent DB for Fill events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

___
<a id="findorderpricechangedlogs"></a>

###  findOrderPriceChangedLogs

▸ **findOrderPriceChangedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:590](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L590)*

Queries the OrderEvent DB for PriceChanged events

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParsedOrderEventLog](api-interfaces-packages-augur-sdk-src-state-logs-types-parsedordereventlog.md)[]>

___
<a id="findparticipationtokensredeemedlogs"></a>

###  findParticipationTokensRedeemedLogs

▸ **findParticipationTokensRedeemedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:604](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L604)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ParticipationTokensRedeemedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-participationtokensredeemedlog.md)[]>

___
<a id="findprofitlosschangedlogs"></a>

###  findProfitLossChangedLogs

▸ **findProfitLossChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:616](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L616)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[ProfitLossChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-profitlosschangedlog.md)[]>

___
<a id="findtimestampsetlogs"></a>

###  findTimestampSetLogs

▸ **findTimestampSetLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[TimestampSetLog](api-interfaces-packages-augur-sdk-src-state-logs-types-timestampsetlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:627](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L627)*

Queries the TimestampSet DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[TimestampSetLog](api-interfaces-packages-augur-sdk-src-state-logs-types-timestampsetlog.md)[]>

___
<a id="findtokenbalancechangedlogs"></a>

###  findTokenBalanceChangedLogs

▸ **findTokenBalanceChangedLogs**(user: *`string`*, request: *`FindRequest`<`__type`>*): `Promise`<[TokenBalanceChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:639](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L639)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| user | `string` |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[TokenBalanceChangedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tokenbalancechangedlog.md)[]>

___
<a id="findtradingproceedsclaimedlogs"></a>

###  findTradingProceedsClaimedLogs

▸ **findTradingProceedsClaimedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:651](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L651)*

Queries the TradingProceedsClaimed DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[TradingProceedsClaimedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-tradingproceedsclaimedlog.md)[]>

___
<a id="finduniverseforkedlogs"></a>

###  findUniverseForkedLogs

▸ **findUniverseForkedLogs**(request: *`FindRequest`<`__type`>*): `Promise`<[UniverseForkedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-universeforkedlog.md)[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:662](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L662)*

Queries the UniverseForked DB

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | `FindRequest`<`__type`> |

**Returns:** `Promise`<[UniverseForkedLog](api-interfaces-packages-augur-sdk-src-state-logs-types-universeforkedlog.md)[]>

___
<a id="fulltextmarketsearch"></a>

###  fullTextMarketSearch

▸ **fullTextMarketSearch**(query: *`string` \| `null`*, extendedSearchOptions: *`ExtendedSearchOptions`[] \| `null`*): `Promise`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>[]>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:250](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L250)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `string` \| `null` |
| extendedSearchOptions | `ExtendedSearchOptions`[] \| `null` |

**Returns:** `Promise`<`SearchResults`<[MarketFields](api-interfaces-packages-augur-sdk-src-state-db-marketdb-marketfields.md)>[]>

___
<a id="getdatabasename"></a>

###  getDatabaseName

▸ **getDatabaseName**(eventName: *`string`*, trackableUserAddress?: *`string`*): `string`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:281](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L281)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:302](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L302)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:261](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L261)*

Gets the block number at which to begin syncing. (That is, the lowest last-synced block across all event log databases or the upload block number for this network.)

**Returns:** `Promise`<`number`>
Promise to the block number at which to begin syncing.

___
<a id="getsyncabledatabase"></a>

###  getSyncableDatabase

▸ **getSyncableDatabase**(dbName: *`string`*): [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

*Defined in [packages/augur-sdk/src/state/db/DB.ts:293](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L293)*

Gets a syncable database based upon the name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dbName | `string` |  The name of the database |

**Returns:** [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md)

___
<a id="initializedb"></a>

###  initializeDB

▸ **initializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`string`[]*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*): `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:131](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L131)*

Creates databases to be used for syncing.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `string`[] |  Array of user addresses for which to sync user-specific events |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md) |  \- |

**Returns:** `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

___
<a id="notifyderiveddbadded"></a>

###  notifyDerivedDBAdded

▸ **notifyDerivedDBAdded**(db: *[DerivedDB](api-classes-packages-augur-sdk-src-state-db-deriveddb-deriveddb.md)*): `void`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:187](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L187)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:178](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L178)*

Called from SyncableDB constructor once SyncableDB is successfully created.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| db | [SyncableDB](api-classes-packages-augur-sdk-src-state-db-syncabledb-syncabledb.md) |  dbController that utilizes the SyncableDB |

**Returns:** `void`

___
<a id="registereventlistener"></a>

###  registerEventListener

▸ **registerEventListener**(eventNames: *`string` \| `string`[]*, callback: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [packages/augur-sdk/src/state/db/DB.ts:191](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L191)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventNames | `string` \| `string`[] |
| callback | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="rollback"></a>

###  rollback

▸ **rollback**(blockNumber: *`number`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:311](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L311)*

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

*Defined in [packages/augur-sdk/src/state/db/DB.ts:202](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L202)*

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

▸ **createAndInitializeDB**(networkId: *`number`*, blockstreamDelay: *`number`*, defaultStartSyncBlockNumber: *`number`*, trackedUsers: *`string`[]*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, pouchDBFactory: *[PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype)*, blockAndLogStreamerListener: *[IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)*): `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>

*Defined in [packages/augur-sdk/src/state/db/DB.ts:110](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/db/DB.ts#L110)*

Creates and returns a new dbController.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| networkId | `number` |  Network on which to sync events |
| blockstreamDelay | `number` |  Number of blocks by which to delay blockstream |
| defaultStartSyncBlockNumber | `number` |  Block number at which to start sycing (if no higher block number has been synced) |
| trackedUsers | `string`[] |  Array of user addresses for which to sync user-specific events |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| pouchDBFactory | [PouchDBFactoryType](api-modules-packages-augur-sdk-src-state-db-abstractdb-module.md#pouchdbfactorytype) |  Factory function generatin PouchDB instance |
| blockAndLogStreamerListener | [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md) |  Stream listener for blocks and logs |

**Returns:** `Promise`<[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)>
Promise to a DB controller object

___

