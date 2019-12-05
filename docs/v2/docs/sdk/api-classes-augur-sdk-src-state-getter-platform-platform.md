---
id: api-classes-augur-sdk-src-state-getter-platform-platform
title: Platform
sidebar_label: Platform
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Platform Module]](api-modules-augur-sdk-src-state-getter-platform-module.md) > [Platform](api-classes-augur-sdk-src-state-getter-platform-platform.md)

## Class

## Hierarchy

**Platform**

### Properties

* [getPlatformActivityStatsParams](api-classes-augur-sdk-src-state-getter-platform-platform.md#getplatformactivitystatsparams)

### Methods

* [getPlatformActivityStats](api-classes-augur-sdk-src-state-getter-platform-platform.md#getplatformactivitystats)

---

## Properties

<a id="getplatformactivitystatsparams"></a>

### `<Static>` getPlatformActivityStatsParams

**● getPlatformActivityStatsParams**: *`IntersectionC`<[`TypeC`<`object`>, `PartialC`<`object`>]>* =  t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })])

*Defined in [augur-sdk/src/state/getter/Platform.ts:40](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L40)*

___

## Methods

<a id="getplatformactivitystats"></a>

### `<Static>` getPlatformActivityStats

▸ **getPlatformActivityStats**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`IntersectionC`>*): `Promise`<[PlatformActivityStatsResult](api-interfaces-augur-sdk-src-state-getter-platform-platformactivitystatsresult.md)>

*Defined in [augur-sdk/src/state/getter/Platform.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Platform.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`IntersectionC`> |

**Returns:** `Promise`<[PlatformActivityStatsResult](api-interfaces-augur-sdk-src-state-getter-platform-platformactivitystatsresult.md)>

___

