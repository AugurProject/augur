---
id: api-classes-state-getter-ping-ping
title: Ping
sidebar_label: Ping
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Ping Module]](api-modules-state-getter-ping-module.md) > [Ping](api-classes-state-getter-ping-ping.md)

## Class

## Hierarchy

**Ping**

### Properties

* [PingParams](api-classes-state-getter-ping-ping.md#pingparams)

### Methods

* [ping](api-classes-state-getter-ping-ping.md#ping)

---

## Properties

<a id="pingparams"></a>

### `<Static>` PingParams

**● PingParams**: *`any`* =  t.type({})

*Defined in [state/getter/Ping.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Ping.ts#L10)*

___

## Methods

<a id="ping"></a>

### `<Static>` ping

▸ **ping**(db: *[DB](api-classes-state-db-db-db.md)*, params: *`t.TypeOf`<`any`>*): `Promise`<[Pong](api-interfaces-state-getter-ping-pong.md)>

*Defined in [state/getter/Ping.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Ping.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-state-db-db-db.md) |
| params | `t.TypeOf`<`any`> |

**Returns:** `Promise`<[Pong](api-interfaces-state-getter-ping-pong.md)>

___

