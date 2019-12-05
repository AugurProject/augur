---
id: api-classes-augur-sdk-src-state-getter-universe-universe
title: Universe
sidebar_label: Universe
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Universe Module]](api-modules-augur-sdk-src-state-getter-universe-module.md) > [Universe](api-classes-augur-sdk-src-state-getter-universe-universe.md)

## Class

## Hierarchy

**Universe**

### Properties

* [getForkMigrationTotalsParams](api-classes-augur-sdk-src-state-getter-universe-universe.md#getforkmigrationtotalsparams)
* [getUniverseChildrenParams](api-classes-augur-sdk-src-state-getter-universe-universe.md#getuniversechildrenparams)

### Methods

* [getForkMigrationTotals](api-classes-augur-sdk-src-state-getter-universe-universe.md#getforkmigrationtotals)
* [getUniverseChildren](api-classes-augur-sdk-src-state-getter-universe-universe.md#getuniversechildren)

---

## Properties

<a id="getforkmigrationtotalsparams"></a>

### `<Static>` getForkMigrationTotalsParams

**● getForkMigrationTotalsParams**: *`TypeC`<`object`>* =  t.type({
    universe: t.string,
  })

*Defined in [augur-sdk/src/state/getter/Universe.ts:53](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L53)*

___
<a id="getuniversechildrenparams"></a>

### `<Static>` getUniverseChildrenParams

**● getUniverseChildrenParams**: *`TypeC`<`object`>* =  t.type({
    universe: t.string,
    account: t.string,
  })

*Defined in [augur-sdk/src/state/getter/Universe.ts:56](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L56)*

___

## Methods

<a id="getforkmigrationtotals"></a>

### `<Static>` getForkMigrationTotals

▸ **getForkMigrationTotals**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[MigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-migrationtotals.md) \| [NonForkingMigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-nonforkingmigrationtotals.md)>

*Defined in [augur-sdk/src/state/getter/Universe.ts:62](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[MigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-migrationtotals.md) \| [NonForkingMigrationTotals](api-interfaces-augur-sdk-src-state-getter-universe-nonforkingmigrationtotals.md)>

___
<a id="getuniversechildren"></a>

### `<Static>` getUniverseChildren

▸ **getUniverseChildren**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[UniverseDetails](api-interfaces-augur-sdk-src-state-getter-universe-universedetails.md) \| `null`>

*Defined in [augur-sdk/src/state/getter/Universe.ts:85](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Universe.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[UniverseDetails](api-interfaces-augur-sdk-src-state-getter-universe-universedetails.md) \| `null`>

___

