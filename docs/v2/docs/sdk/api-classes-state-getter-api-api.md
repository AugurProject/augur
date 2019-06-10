---
id: api-classes-state-getter-api-api
title: API
sidebar_label: API
---

[@augurproject/sdk](api-readme.md) > [[state/getter/API Module]](api-modules-state-getter-api-module.md) > [API](api-classes-state-getter-api-api.md)

## Class

## Hierarchy

**API**

### Constructors

* [constructor](api-classes-state-getter-api-api.md#constructor)

### Properties

* [router](api-classes-state-getter-api-api.md#router)

### Methods

* [route](api-classes-state-getter-api-api.md#route)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new API**(augur: *[Augur](api-classes-augur-augur.md)*, db: *`Promise`<[DB](api-classes-state-db-db-db.md)>*): [API](api-classes-state-getter-api-api.md)

*Defined in [state/getter/API.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/API.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | `Promise`<[DB](api-classes-state-db-db-db.md)> |

**Returns:** [API](api-classes-state-getter-api-api.md)

___

## Properties

<a id="router"></a>

### `<Private>` router

**● router**: *[Router](api-classes-state-getter-router-router.md)*

*Defined in [state/getter/API.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/API.ts#L14)*

___

## Methods

<a id="route"></a>

###  route

▸ **route**(name: *`string`*, params: *`any`*): `Promise`<`any`>

*Defined in [state/getter/API.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/API.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| params | `any` |

**Returns:** `Promise`<`any`>

___

