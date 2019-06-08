[@augurproject/sdk](../README.md) > ["state/getter/Router"](../modules/_state_getter_router_.md) > [Router](../classes/_state_getter_router_.router.md)

# Class: Router

## Hierarchy

**Router**

## Index

### Constructors

* [constructor](_state_getter_router_.router.md#constructor)

### Properties

* [augur](_state_getter_router_.router.md#augur)
* [db](_state_getter_router_.router.md#db)
* [routings](_state_getter_router_.router.md#routings)

### Methods

* [route](_state_getter_router_.router.md#route)
* [Add](_state_getter_router_.router.md#add)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Router**(augur: *[Augur](_augur_.augur.md)*, db: *`Promise`<[DB](_state_db_db_.db.md)>*): [Router](_state_getter_router_.router.md)

*Defined in [state/getter/Router.ts:42](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L42)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | `Promise`<[DB](_state_db_db_.db.md)> |

**Returns:** [Router](_state_getter_router_.router.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](_augur_.augur.md)*

*Defined in [state/getter/Router.ts:41](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L41)*

___
<a id="db"></a>

### `<Private>` db

**● db**: *`Promise`<[DB](_state_db_db_.db.md)>*

*Defined in [state/getter/Router.ts:42](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L42)*

___
<a id="routings"></a>

### `<Static>``<Private>` routings

**● routings**: *`Map`<`any`, `any`>* =  new Map()

*Defined in [state/getter/Router.ts:39](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L39)*

___

## Methods

<a id="route"></a>

###  route

▸ **route**(name: *`string`*, params: *`any`*): `Promise`<`any`>

*Defined in [state/getter/Router.ts:49](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L49)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| params | `any` |

**Returns:** `Promise`<`any`>

___
<a id="add"></a>

### `<Static>` Add

▸ **Add**<`T`,`R`,`TBigNumber`>(name: *`string`*, getterFunction: *[GetterFunction](../modules/_state_getter_router_.md#getterfunction)<`T`, `TBigNumber`>*, decodedParams: *`t.Validation`<`T`>*): `void`

*Defined in [state/getter/Router.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/getter/Router.ts#L35)*

**Type parameters:**

#### T 
#### R 
#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| getterFunction | [GetterFunction](../modules/_state_getter_router_.md#getterfunction)<`T`, `TBigNumber`> |
| decodedParams | `t.Validation`<`T`> |

**Returns:** `void`

___

