---
id: api-classes-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstats
title: AccountTimeRangedStats
sidebar_label: AccountTimeRangedStats
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/get-account-time-ranged-stats Module]](api-modules-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-module.md) > [AccountTimeRangedStats](api-classes-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstats.md)

## Class

## Hierarchy

**AccountTimeRangedStats**

### Properties

* [getAccountTimeRangedStatsParams](api-classes-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstats.md#getaccounttimerangedstatsparams)

### Methods

* [getAccountTimeRangedStats](api-classes-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstats.md#getaccounttimerangedstats)

---

## Properties

<a id="getaccounttimerangedstatsparams"></a>

### `<Static>` getAccountTimeRangedStatsParams

**● getAccountTimeRangedStatsParams**: *`IntersectionType`<[`InterfaceType`<`object`, `object`, `object`, `unknown`>, `PartialType`<`object`, `object`, `object`, `unknown`>], `object`, `object`, `unknown`>* =  t.intersection([
    t.type({
      universe: t.string,
      account: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })])

*Defined in [packages/augur-sdk/src/state/getter/get-account-time-ranged-stats.ts:30](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/get-account-time-ranged-stats.ts#L30)*

___

## Methods

<a id="getaccounttimerangedstats"></a>

### `<Static>` getAccountTimeRangedStats

▸ **getAccountTimeRangedStats**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionType`>*): `Promise`<[AccountTimeRangedStatsResult](api-interfaces-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstatsresult.md)>

*Defined in [packages/augur-sdk/src/state/getter/get-account-time-ranged-stats.ts:41](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/getter/get-account-time-ranged-stats.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionType`> |

**Returns:** `Promise`<[AccountTimeRangedStatsResult](api-interfaces-packages-augur-sdk-src-state-getter-get-account-time-ranged-stats-accounttimerangedstatsresult.md)>

___

