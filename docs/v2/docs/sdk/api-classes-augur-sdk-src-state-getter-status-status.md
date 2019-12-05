---
id: api-classes-augur-sdk-src-state-getter-status-status
title: Status
sidebar_label: Status
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/status Module]](api-modules-augur-sdk-src-state-getter-status-module.md) > [Status](api-classes-augur-sdk-src-state-getter-status-status.md)

## Class

## Hierarchy

**Status**

### Properties

* [getSyncDataParams](api-classes-augur-sdk-src-state-getter-status-status.md#getsyncdataparams)

### Methods

* [getSyncData](api-classes-augur-sdk-src-state-getter-status-status.md#getsyncdata)

---

## Properties

<a id="getsyncdataparams"></a>

### `<Static>` getSyncDataParams

**● getSyncDataParams**: *`TypeC`<`object`>* =  t.type({})

*Defined in [augur-sdk/src/state/getter/status.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/status.ts#L14)*

___

## Methods

<a id="getsyncdata"></a>

### `<Static>` getSyncData

▸ **getSyncData**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[SyncData](api-interfaces-augur-sdk-src-state-getter-status-syncdata.md)>

*Defined in [augur-sdk/src/state/getter/status.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/status.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[SyncData](api-interfaces-augur-sdk-src-state-getter-status-syncdata.md)>

___

