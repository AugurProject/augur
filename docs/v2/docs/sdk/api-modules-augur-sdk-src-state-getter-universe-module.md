---
id: api-modules-augur-sdk-src-state-getter-universe-module
title: augur-sdk/src/state/getter/Universe Module
sidebar_label: augur-sdk/src/state/getter/Universe
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Universe Module]](api-modules-augur-sdk-src-state-getter-universe-module.md)

## Module

### Classes

* [Universe](api-classes-augur-sdk-src-state-getter-universe-universe.md)

### Interfaces

* [MigrationOutcome](api-interfaces-augur-sdk-src-state-getter-universe-migrationoutcome.md)
* [MigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-migrationtotals.md)
* [NonForkingMigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-nonforkingmigrationtotals.md)
* [UniverseDetails](api-interfaces-augur-sdk-src-state-getter-universe-universedetails.md)

### Functions

* [calculateOutcomeFromLogs](api-modules-augur-sdk-src-state-getter-universe-module.md#calculateoutcomefromlogs)
* [getMarket](api-modules-augur-sdk-src-state-getter-universe-module.md#getmarket)
* [getMarketsForUniverse](api-modules-augur-sdk-src-state-getter-universe-module.md#getmarketsforuniverse)
* [getMigrationOutcomes](api-modules-augur-sdk-src-state-getter-universe-module.md#getmigrationoutcomes)
* [getOutcomeNameFromLogs](api-modules-augur-sdk-src-state-getter-universe-module.md#getoutcomenamefromlogs)
* [getRepSupply](api-modules-augur-sdk-src-state-getter-universe-module.md#getrepsupply)
* [getUniverseChildrenCreationLogs](api-modules-augur-sdk-src-state-getter-universe-module.md#getuniversechildrencreationlogs)
* [getUniverseCreationLog](api-modules-augur-sdk-src-state-getter-universe-module.md#getuniversecreationlog)
* [getUniverseDetails](api-modules-augur-sdk-src-state-getter-universe-module.md#getuniversedetails)
* [getUniverseForkedLog](api-modules-augur-sdk-src-state-getter-universe-module.md#getuniverseforkedlog)
* [getUserRep](api-modules-augur-sdk-src-state-getter-universe-module.md#getuserrep)

---

## Functions

<a id="calculateoutcomefromlogs"></a>

###  calculateOutcomeFromLogs

▸ **calculateOutcomeFromLogs**(universeCreationLog: *[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)*, forkingMarketLog: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*): [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

*Defined in [augur-sdk/src/state/getter/Universe.ts:149](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L149)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universeCreationLog | [UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md) |
| forkingMarketLog | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |

**Returns:** [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

___
<a id="getmarket"></a>

###  getMarket

▸ **getMarket**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*): `Promise`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) \| `null`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:209](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L209)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |

**Returns:** `Promise`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) \| `null`>

___
<a id="getmarketsforuniverse"></a>

###  getMarketsForUniverse

▸ **getMarketsForUniverse**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*): `Promise`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[]>

*Defined in [augur-sdk/src/state/getter/Universe.ts:213](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L213)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |

**Returns:** `Promise`<[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)[]>

___
<a id="getmigrationoutcomes"></a>

###  getMigrationOutcomes

▸ **getMigrationOutcomes**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, forkingMarket: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, children: *[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)[]*): `Promise`<[MigrationOutcome](api-interfaces-augur-sdk-src-state-getter-universe-migrationoutcome.md)[]>

*Defined in [augur-sdk/src/state/getter/Universe.ts:163](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L163)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| forkingMarket | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| children | [UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)[] |

**Returns:** `Promise`<[MigrationOutcome](api-interfaces-augur-sdk-src-state-getter-universe-migrationoutcome.md)[]>

___
<a id="getoutcomenamefromlogs"></a>

###  getOutcomeNameFromLogs

▸ **getOutcomeNameFromLogs**(universeCreationLog: *[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)*, forkingMarketLog: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*): `string`

*Defined in [augur-sdk/src/state/getter/Universe.ts:141](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L141)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| universeCreationLog | [UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md) |
| forkingMarketLog | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |

**Returns:** `string`

___
<a id="getrepsupply"></a>

###  getRepSupply

▸ **getRepSupply**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, universe: *`Universe`*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:203](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L203)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| universe | `Universe` |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getuniversechildrencreationlogs"></a>

###  getUniverseChildrenCreationLogs

▸ **getUniverseChildrenCreationLogs**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*): `Promise`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)[]>

*Defined in [augur-sdk/src/state/getter/Universe.ts:237](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L237)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |

**Returns:** `Promise`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md)[]>

___
<a id="getuniversecreationlog"></a>

###  getUniverseCreationLog

▸ **getUniverseCreationLog**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*): `Promise`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md) \| `null`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:217](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L217)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |

**Returns:** `Promise`<[UniverseCreatedLog](api-interfaces-augur-sdk-src-state-logs-types-universecreatedlog.md) \| `null`>

___
<a id="getuniversedetails"></a>

###  getUniverseDetails

▸ **getUniverseDetails**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*, account: *`string`*): `Promise`<[UniverseDetails](api-interfaces-augur-sdk-src-state-getter-universe-universedetails.md)>

*Defined in [augur-sdk/src/state/getter/Universe.ts:104](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L104)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |
| account | `string` |

**Returns:** `Promise`<[UniverseDetails](api-interfaces-augur-sdk-src-state-getter-universe-universedetails.md)>

___
<a id="getuniverseforkedlog"></a>

###  getUniverseForkedLog

▸ **getUniverseForkedLog**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, address: *`string`*): `Promise`<[UniverseForkedLog](api-interfaces-augur-sdk-src-state-logs-types-universeforkedlog.md) \| `null`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:227](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L227)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| address | `string` |

**Returns:** `Promise`<[UniverseForkedLog](api-interfaces-augur-sdk-src-state-logs-types-universeforkedlog.md) \| `null`>

___
<a id="getuserrep"></a>

###  getUserRep

▸ **getUserRep**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, universe: *`Universe`*, account: *`string`*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:189](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L189)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| universe | `Universe` |
| account | `string` |

**Returns:** `Promise`<`BigNumber`>

___

