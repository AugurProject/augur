[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/Controller"](../modules/_augur_sdk_src_state_controller_.md) › [Controller](_augur_sdk_src_state_controller_.controller.md)

# Class: Controller

## Hierarchy

* **Controller**

## Index

### Constructors

* [constructor](_augur_sdk_src_state_controller_.controller.md#constructor)

### Properties

* [augur](_augur_sdk_src_state_controller_.controller.md#private-augur)
* [db](_augur_sdk_src_state_controller_.controller.md#private-db)
* [events](_augur_sdk_src_state_controller_.controller.md#private-events)
* [logFilterAggregator](_augur_sdk_src_state_controller_.controller.md#private-logfilteraggregator)
* [latestBlock](_augur_sdk_src_state_controller_.controller.md#static-private-latestblock)

### Methods

* [allEvents](_augur_sdk_src_state_controller_.controller.md#private-allevents)
* [getLatestBlock](_augur_sdk_src_state_controller_.controller.md#private-getlatestblock)
* [notifyNewBlockEvent](_augur_sdk_src_state_controller_.controller.md#private-notifynewblockevent)
* [updateMarketsData](_augur_sdk_src_state_controller_.controller.md#private-updatemarketsdata)

## Constructors

###  constructor

\+ **new Controller**(`augur`: [Augur](_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›, `logFilterAggregator`: [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)): *[Controller](_augur_sdk_src_state_controller_.controller.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`augur` | [Augur](_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)› |
`logFilterAggregator` | [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md) |

**Returns:** *[Controller](_augur_sdk_src_state_controller_.controller.md)*

## Properties

### `Private` augur

• **augur**: *[Augur](_augur_sdk_src_augur_.augur.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L20)*

___

### `Private` db

• **db**: *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L21)*

___

### `Private` events

• **events**: *any*

*Defined in [packages/augur-sdk/src/state/Controller.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L17)*

___

### `Private` logFilterAggregator

• **logFilterAggregator**: *[LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L22)*

___

### `Static` `Private` latestBlock

▪ **latestBlock**: *Block*

*Defined in [packages/augur-sdk/src/state/Controller.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L15)*

## Methods

### `Private` allEvents

▸ **allEvents**(`blockNumber`: number, `allLogs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:49](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`allLogs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹void›*

___

### `Private` getLatestBlock

▸ **getLatestBlock**(): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:96](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L96)*

**Returns:** *Promise‹Block›*

___

### `Private` notifyNewBlockEvent

▸ **notifyNewBlockEvent**(`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:66](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹void›*

___

### `Private` updateMarketsData

▸ **updateMarketsData**(`marketIds`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:37](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/Controller.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`marketIds` | string[] |

**Returns:** *Promise‹void›*
