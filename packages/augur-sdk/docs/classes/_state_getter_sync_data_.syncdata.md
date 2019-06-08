[@augurproject/sdk](../README.md) > ["state/getter/sync-data"](../modules/_state_getter_sync_data_.md) > [SyncData](../classes/_state_getter_sync_data_.syncdata.md)

# Class: SyncData

## Hierarchy

**SyncData**

## Index

### Properties

* [blocksBehindCurrent](_state_getter_sync_data_.syncdata.md#blocksbehindcurrent)
* [highestAvailableBlockNumber](_state_getter_sync_data_.syncdata.md#highestavailableblocknumber)
* [lastSyncedBlockNumber](_state_getter_sync_data_.syncdata.md#lastsyncedblocknumber)
* [percentBehindCurrent](_state_getter_sync_data_.syncdata.md#percentbehindcurrent)
* [SyncDataParams](_state_getter_sync_data_.syncdata.md#syncdataparams)

### Methods

* [getSyncData](_state_getter_sync_data_.syncdata.md#getsyncdata)

---

## Properties

<a id="blocksbehindcurrent"></a>

###  blocksBehindCurrent

**● blocksBehindCurrent**: *`number`*

*Defined in [state/getter/sync-data.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L10)*

___
<a id="highestavailableblocknumber"></a>

###  highestAvailableBlockNumber

**● highestAvailableBlockNumber**: *`number`*

*Defined in [state/getter/sync-data.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L8)*

___
<a id="lastsyncedblocknumber"></a>

###  lastSyncedBlockNumber

**● lastSyncedBlockNumber**: *`number`*

*Defined in [state/getter/sync-data.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L9)*

___
<a id="percentbehindcurrent"></a>

###  percentBehindCurrent

**● percentBehindCurrent**: *`string`*

*Defined in [state/getter/sync-data.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L11)*

___
<a id="syncdataparams"></a>

### `<Static>` SyncDataParams

**● SyncDataParams**: *`any`* =  t.type({})

*Defined in [state/getter/sync-data.ts:15](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L15)*

___

## Methods

<a id="getsyncdata"></a>

### `<Static>` getSyncData

▸ **getSyncData**(augur: *[Augur](_augur_.augur.md)*, db: *[DB](_state_db_db_.db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[SyncData](_state_getter_sync_data_.syncdata.md)>

*Defined in [state/getter/sync-data.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/sync-data.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | [DB](_state_db_db_.db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[SyncData](_state_getter_sync_data_.syncdata.md)>

___

