---
id: api-classes-state-getter-router-router
title: Router
sidebar_label: Router
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Router Module]](api-modules-state-getter-router-module.md) > [Router](api-classes-state-getter-router-router.md)

## Class

## Hierarchy

**Router**

### Constructors

* [constructor](api-classes-state-getter-router-router.md#constructor)

### Properties

* [augur](api-classes-state-getter-router-router.md#augur)
* [db](api-classes-state-getter-router-router.md#db)
* [routings](api-classes-state-getter-router-router.md#routings)

### Methods

* [route](api-classes-state-getter-router-router.md#route)
* [Add](api-classes-state-getter-router-router.md#add)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Router**(augur: *[Augur](api-classes-augur-augur.md)*, db: *`Promise`<[DB](api-classes-state-db-db-db.md)>*): [Router](api-classes-state-getter-router-router.md)

*Defined in [state/getter/Router.ts:42](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-augur.md) |
| db | `Promise`<[DB](api-classes-state-db-db-db.md)> |

**Returns:** [Router](api-classes-state-getter-router-router.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-augur.md)*

*Defined in [state/getter/Router.ts:41](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L41)*

___
<a id="db"></a>

### `<Private>` db

**● db**: *`Promise`<[DB](api-classes-state-db-db-db.md)>*

*Defined in [state/getter/Router.ts:42](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L42)*

___
<a id="routings"></a>

### `<Static>``<Private>` routings

**● routings**: *`Map`<`any`, `any`>* =  new Map()

*Defined in [state/getter/Router.ts:39](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L39)*

___

## Methods

<a id="route"></a>

###  route

▸ **route**(name: *`string`*, params: *`any`*): `Promise`<`any`>

*Defined in [state/getter/Router.ts:49](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| params | `any` |

**Returns:** `Promise`<`any`>

___
<a id="add"></a>

### `<Static>` Add

▸ **Add**<`T`,`R`,`TBigNumber`>(name: *`string`*, getterFunction: *[GetterFunction](api-modules-state-getter-router-module.md#getterfunction)<`T`, `TBigNumber`>*, decodedParams: *`t.Validation`<`T`>*): `void`

*Defined in [state/getter/Router.ts:35](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Router.ts#L35)*

**Type parameters:**

#### T 
#### R 
#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| getterFunction | [GetterFunction](api-modules-state-getter-router-module.md#getterfunction)<`T`, `TBigNumber`> |
| decodedParams | `t.Validation`<`T`> |

**Returns:** `void`

___

