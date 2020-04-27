[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Platform"](../modules/_augur_sdk_src_state_getter_platform_.md) › [Platform](_augur_sdk_src_state_getter_platform_.platform.md)

# Class: Platform

## Hierarchy

* **Platform**

## Index

### Properties

* [getPlatformActivityStatsParams](_augur_sdk_src_state_getter_platform_.platform.md#static-getplatformactivitystatsparams)

### Methods

* [getPlatformActivityStats](_augur_sdk_src_state_getter_platform_.platform.md#static-getplatformactivitystats)

## Properties

### `Static` getPlatformActivityStatsParams

▪ **getPlatformActivityStatsParams**: *IntersectionC‹[TypeC‹object›, PartialC‹object›]›* = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })])

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:40](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L40)*

## Methods

### `Static` getPlatformActivityStats

▸ **getPlatformActivityStats**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: [DB](_augur_sdk_src_state_db_db_.db.md), `params`: t.TypeOf‹typeof getPlatformActivityStatsParams›): *Promise‹[PlatformActivityStatsResult](../interfaces/_augur_sdk_src_state_getter_platform_.platformactivitystatsresult.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Platform.ts:50](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Platform.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | [DB](_augur_sdk_src_state_db_db_.db.md) |
`params` | t.TypeOf‹typeof getPlatformActivityStatsParams› |

**Returns:** *Promise‹[PlatformActivityStatsResult](../interfaces/_augur_sdk_src_state_getter_platform_.platformactivitystatsresult.md)›*
