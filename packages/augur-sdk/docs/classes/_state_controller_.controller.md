[@augurproject/sdk](../README.md) > ["state/Controller"](../modules/_state_controller_.md) > [Controller](../classes/_state_controller_.controller.md)

# Class: Controller

## Hierarchy

**Controller**

## Index

### Constructors

* [constructor](_state_controller_.controller.md#constructor)

### Properties

* [augur](_state_controller_.controller.md#augur)
* [blockAndLogStreamerListener](_state_controller_.controller.md#blockandlogstreamerlistener)
* [db](_state_controller_.controller.md#db)

### Methods

* [fullTextSearch](_state_controller_.controller.md#fulltextsearch)
* [run](_state_controller_.controller.md#run)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Controller**(augur: *[Augur](_augur_.augur.md)*, db: *`Promise`<[DB](_state_db_db_.db.md)>*, blockAndLogStreamerListener: *[BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)*): [Controller](_state_controller_.controller.md)

*Defined in [state/Controller.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](_augur_.augur.md) |
| db | `Promise`<[DB](_state_db_db_.db.md)> |
| blockAndLogStreamerListener | [BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md) |

**Returns:** [Controller](_state_controller_.controller.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](_augur_.augur.md)*

*Defined in [state/Controller.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L10)*

___
<a id="blockandlogstreamerlistener"></a>

### `<Private>` blockAndLogStreamerListener

**● blockAndLogStreamerListener**: *[BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)*

*Defined in [state/Controller.ts:12](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L12)*

___
<a id="db"></a>

### `<Private>` db

**● db**: *`Promise`<[DB](_state_db_db_.db.md)>*

*Defined in [state/Controller.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L11)*

___

## Methods

<a id="fulltextsearch"></a>

###  fullTextSearch

▸ **fullTextSearch**(eventName: *`string`*, query: *`string`*): `Promise`<`object`[]>

*Defined in [state/Controller.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| query | `string` |

**Returns:** `Promise`<`object`[]>

___
<a id="run"></a>

###  run

▸ **run**(): `Promise`<`void`>

*Defined in [state/Controller.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/Controller.ts#L21)*

**Returns:** `Promise`<`void`>

___

