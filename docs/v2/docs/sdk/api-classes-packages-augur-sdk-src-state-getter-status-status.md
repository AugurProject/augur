---
id: api-classes-packages-augur-sdk-src-state-getter-status-status
title: Status
sidebar_label: Status
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/status Module]](api-modules-packages-augur-sdk-src-state-getter-status-module.md) > [Status](api-classes-packages-augur-sdk-src-state-getter-status-status.md)

## Class

## Hierarchy

**Status**

### Properties

* [getSyncDataParams](api-classes-packages-augur-sdk-src-state-getter-status-status.md#getsyncdataparams)

### Methods

* [getSyncData](api-classes-packages-augur-sdk-src-state-getter-status-status.md#getsyncdata)

---

## Properties

<a id="getsyncdataparams"></a>

### `<Static>` getSyncDataParams

**● getSyncDataParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({})

*Defined in [packages/augur-sdk/src/state/getter/status.ts:14](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/getter/status.ts#L14)*

___

## Methods

<a id="getsyncdata"></a>

### `<Static>` getSyncData

▸ **getSyncData**(augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*, db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

*Defined in [packages/augur-sdk/src/state/getter/status.ts:17](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/state/getter/status.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[SyncData](api-interfaces-packages-augur-sdk-src-state-getter-status-syncdata.md)>

___

