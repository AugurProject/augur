[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Router"](../modules/_augur_sdk_src_state_getter_router_.md) › [Router](_augur_sdk_src_state_getter_router_.router.md)

# Class: Router

## Hierarchy

* **Router**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_getter_router_.router.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_getter_router_.router.md#private-augur)
* [db](_augur_sdk_src_state_getter_router_.router.md#private-db)
* [routings](_augur_sdk_src_state_getter_router_.router.md#static-private-routings)

### Methods

* [route](_augur_sdk_src_state_getter_router_.router.md#route)
* [Add](_augur_sdk_src_state_getter_router_.router.md#static-add)

## Constructors

###  constructor

\+ **new Router**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›): *[Router](_augur_sdk_src_state_getter_router_.router.md)*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:44](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)› |

**Returns:** *[Router](_augur_sdk_src_state_getter_router_.router.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:43](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L43)*

___

### `Private` db

• **db**: *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:44](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L44)*

___

### `Static` `Private` routings

▪ **routings**: *Map‹any, any›* = new Map()

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:41](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L41)*

## Methods

###  route

▸ **route**(`name`: string, `params`: any): *Promise‹any›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |

**Returns:** *Promise‹any›*

___

### `Static` Add

▸ **Add**<**T**, **R**, **TBigNumber**>(`name`: string, `getterFunction`: [GetterFunction](../modules/_augur_sdk_src_state_getter_router_.md#getterfunction)‹T, TBigNumber›, `decodedParams`: t.Validation‹T›): *void*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:37](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/Router.ts#L37)*

**Type parameters:**

▪ **T**

▪ **R**

▪ **TBigNumber**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`getterFunction` | [GetterFunction](../modules/_augur_sdk_src_state_getter_router_.md#getterfunction)‹T, TBigNumber› |
`decodedParams` | t.Validation‹T› |

**Returns:** *void*
