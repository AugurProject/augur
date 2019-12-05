---
id: api-classes-augur-sdk-src-state-getter-api-api
title: API
sidebar_label: API
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/API Module]](api-modules-augur-sdk-src-state-getter-api-module.md) > [API](api-classes-augur-sdk-src-state-getter-api-api.md)

## Class

## Hierarchy

**API**

### Constructors

* [constructor](api-classes-augur-sdk-src-state-getter-api-api.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-state-getter-api-api.md#augur)
* [db](api-classes-augur-sdk-src-state-getter-api-api.md#db)
* [router](api-classes-augur-sdk-src-state-getter-api-api.md#router)

### Methods

* [route](api-classes-augur-sdk-src-state-getter-api-api.md#route)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new API**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, db: *`Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>*): [API](api-classes-augur-sdk-src-state-getter-api-api.md)

*Defined in [augur-sdk/src/state/getter/API.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/API.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| db | `Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)> |

**Returns:** [API](api-classes-augur-sdk-src-state-getter-api-api.md)

___

## Properties

<a id="augur"></a>

###  augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/state/getter/API.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/API.ts#L18)*

___
<a id="db"></a>

###  db

**● db**: *`Promise`<[DB](api-classes-augur-sdk-src-state-db-db-db.md)>*

*Defined in [augur-sdk/src/state/getter/API.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/API.ts#L19)*

___
<a id="router"></a>

### `<Private>` router

**● router**: *[Router](api-classes-augur-sdk-src-state-getter-router-router.md)*

*Defined in [augur-sdk/src/state/getter/API.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/API.ts#L20)*

___

## Methods

<a id="route"></a>

###  route

▸ **route**(name: *`string`*, params: *`any`*): `Promise`<`any`>

*Defined in [augur-sdk/src/state/getter/API.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/API.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| params | `any` |

**Returns:** `Promise`<`any`>

___

