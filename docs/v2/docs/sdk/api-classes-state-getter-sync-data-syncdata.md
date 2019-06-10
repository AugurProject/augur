---
id: api-classes-state-getter-sync-data-syncdata
title: SyncData
sidebar_label: SyncData
---

[@augurproject/sdk](api-readme.md) > [[state/getter/sync-data Module]](api-modules-state-getter-sync-data-module.md) > [SyncData](api-classes-state-getter-sync-data-syncdata.md)

## Class

## Hierarchy

**SyncData**

### Properties

* [blocksBehindCurrent](api-classes-state-getter-sync-data-syncdata.md#blocksbehindcurrent)
* [highestAvailableBlockNumber](api-classes-state-getter-sync-data-syncdata.md#highestavailableblocknumber)
* [lastSyncedBlockNumber](api-classes-state-getter-sync-data-syncdata.md#lastsyncedblocknumber)
* [percentBehindCurrent](api-classes-state-getter-sync-data-syncdata.md#percentbehindcurrent)
* [SyncDataParams](api-classes-state-getter-sync-data-syncdata.md#syncdataparams)

### Methods

* [getSyncData](api-classes-state-getter-sync-data-syncdata.md#getsyncdata)

---

## Properties

<a id="blocksbehindcurrent"></a>

###  blocksBehindCurrent

**● blocksBehindCurrent**: *`number`*

*Defined in [state/getter/sync-data.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L10)*

___
<a id="highestavailableblocknumber"></a>

###  highestAvailableBlockNumber

**● highestAvailableBlockNumber**: *`number`*

*Defined in [state/getter/sync-data.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L8)*

___
<a id="lastsyncedblocknumber"></a>

###  lastSyncedBlockNumber

**● lastSyncedBlockNumber**: *`number`*

*Defined in [state/getter/sync-data.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L9)*

___
<a id="percentbehindcurrent"></a>

###  percentBehindCurrent

**● percentBehindCurrent**: *`string`*

*Defined in [state/getter/sync-data.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L11)*

___
<a id="syncdataparams"></a>

### `<Static>` SyncDataParams

**● SyncDataParams**: *`any`* =  t.type({})

*Defined in [state/getter/sync-data.ts:15](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L15)*

___

## Methods

<a id="getsyncdata"></a>

### `<Static>` getSyncData

▸ **getSyncData**(augur: *[Augur](api-classes-augur-augur.md)*, db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[SyncData](api-classes-state-getter-sync-data-syncdata.md)>

*Defined in [state/getter/sync-data.ts:18](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/sync-data.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[SyncData](api-classes-state-getter-sync-data-syncdata.md)>

___

