[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/getter/Router"](../modules/_augur_sdk_src_state_getter_router_.md) › [Router](_augur_sdk_src_state_getter_router_.router.md)

# Class: Router

## Hierarchy

* **Router**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_getter_router_.router.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_getter_router_.router.md#private-readonly-augur)
* [db](_augur_sdk_src_state_getter_router_.router.md#private-readonly-db)
* [requestQueue](_augur_sdk_src_state_getter_router_.router.md#private-requestqueue)
* [routings](_augur_sdk_src_state_getter_router_.router.md#static-private-routings)

### Methods

* [executeRoute](_augur_sdk_src_state_getter_router_.router.md#executeroute)
* [route](_augur_sdk_src_state_getter_router_.router.md#route)
* [Add](_augur_sdk_src_state_getter_router_.router.md#static-add)

## Constructors

###  constructor

\+ **new Router**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›): *[Router](_augur_sdk_src_state_getter_router_.router.md)*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)› |

**Returns:** *[Router](_augur_sdk_src_state_getter_router_.router.md)*

## Properties

### `Private` `Readonly` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:69](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L69)*

___

### `Private` `Readonly` db

• **db**: *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:70](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L70)*

___

### `Private` requestQueue

• **requestQueue**: *AsyncQueue‹[RequestQueueTask](../interfaces/_augur_sdk_src_state_getter_router_.requestqueuetask.md)›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:71](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L71)*

___

### `Static` `Private` routings

▪ **routings**: *Map‹any, any›* = new Map()

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:67](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L67)*

## Methods

###  executeRoute

▸ **executeRoute**(`name`: string, `params`: any): *Promise‹any›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:96](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |

**Returns:** *Promise‹any›*

___

###  route

▸ **route**(`name`: string, `params`: any): *Promise‹any›*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:85](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`params` | any |

**Returns:** *Promise‹any›*

___

### `Static` Add

▸ **Add**‹**T**, **R**, **TBigNumber**›(`name`: string, `getterFunction`: [GetterFunction](../modules/_augur_sdk_src_state_getter_router_.md#getterfunction)‹T, TBigNumber›, `decodedParams`: t.Validation‹T›): *void*

*Defined in [packages/augur-sdk/src/state/getter/Router.ts:59](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/getter/Router.ts#L59)*

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
