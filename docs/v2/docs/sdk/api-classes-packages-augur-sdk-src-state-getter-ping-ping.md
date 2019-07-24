---
id: api-classes-packages-augur-sdk-src-state-getter-ping-ping
title: Ping
sidebar_label: Ping
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/getter/Ping Module]](api-modules-packages-augur-sdk-src-state-getter-ping-module.md) > [Ping](api-classes-packages-augur-sdk-src-state-getter-ping-ping.md)

## Class

## Hierarchy

**Ping**

### Properties

* [PingParams](api-classes-packages-augur-sdk-src-state-getter-ping-ping.md#pingparams)

### Methods

* [ping](api-classes-packages-augur-sdk-src-state-getter-ping-ping.md#ping)

---

## Properties

<a id="pingparams"></a>

### `<Static>` PingParams

**● PingParams**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.type({})

*Defined in [packages/augur-sdk/src/state/getter/Ping.ts:10](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Ping.ts#L10)*

___

## Methods

<a id="ping"></a>

### `<Static>` ping

▸ **ping**(db: *[DB](api-classes-packages-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`InterfaceType`>*): `Promise`<[Pong](api-interfaces-packages-augur-sdk-src-state-getter-ping-pong.md)>

*Defined in [packages/augur-sdk/src/state/getter/Ping.ts:13](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/getter/Ping.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-packages-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`InterfaceType`> |

**Returns:** `Promise`<[Pong](api-interfaces-packages-augur-sdk-src-state-getter-ping-pong.md)>

___

