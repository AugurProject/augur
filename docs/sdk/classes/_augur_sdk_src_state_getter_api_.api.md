[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/API"](../modules/_augur_sdk_src_state_getter_api_.md) › [API](_augur_sdk_src_state_getter_api_.api.md)

# Class: API

## Hierarchy

* **API**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_getter_api_.api.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_getter_api_.api.md#augur)
* [db](_augur_sdk_src_state_getter_api_.api.md#db)
* [router](_augur_sdk_src_state_getter_api_.api.md#private-router)

### Methods

* [route](_augur_sdk_src_state_getter_api_.api.md#route)

## Constructors

###  constructor

\+ **new API**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›): *[API](_augur_sdk_src_state_getter_api_.api.md)*

*Defined in [packages/augur-sdk/src/state/getter/API.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/API.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)› |

**Returns:** *[API](_augur_sdk_src_state_getter_api_.api.md)*

## Properties

###  augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/getter/API.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/API.ts#L18)*

___

###  db

• **db**: *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/getter/API.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/API.ts#L19)*

___

### `Private` router

• **router**: *[Router](_augur_sdk_src_state_getter_router_.router.md)*

*Defined in [packages/augur-sdk/src/state/getter/API.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/API.ts#L20)*

## Methods

###  route

▸ **route**(`name`: string, `params`: any): *Promise‹any›*

*Defined in [packages/augur-sdk/src/state/getter/API.ts:28](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/getter/API.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |

**Returns:** *Promise‹any›*
