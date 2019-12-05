---
id: api-classes-augur-sdk-src-state-getter-ping-ping
title: Ping
sidebar_label: Ping
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/Ping Module]](api-modules-augur-sdk-src-state-getter-ping-module.md) > [Ping](api-classes-augur-sdk-src-state-getter-ping-ping.md)

## Class

## Hierarchy

**Ping**

### Properties

* [PingParams](api-classes-augur-sdk-src-state-getter-ping-ping.md#pingparams)

### Methods

* [ping](api-classes-augur-sdk-src-state-getter-ping-ping.md#ping)

---

## Properties

<a id="pingparams"></a>

### `<Static>` PingParams

**● PingParams**: *`TypeC`<`object`>* =  t.type({})

*Defined in [augur-sdk/src/state/getter/Ping.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Ping.ts#L10)*

___

## Methods

<a id="ping"></a>

### `<Static>` ping

▸ **ping**(db: *[DB](api-classes-augur-sdk-src-state-db-db-db.md)*, params: *`t.TypeOf`<`TypeC`>*): `Promise`<[Pong](api-interfaces-augur-sdk-src-state-getter-ping-pong.md)>

*Defined in [augur-sdk/src/state/getter/Ping.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/Ping.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| db | [DB](api-classes-augur-sdk-src-state-db-db-db.md) |
| params | `t.TypeOf`<`TypeC`> |

**Returns:** `Promise`<[Pong](api-interfaces-augur-sdk-src-state-getter-ping-pong.md)>

___

