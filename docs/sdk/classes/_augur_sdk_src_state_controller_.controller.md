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
* [events](_augur_sdk_src_state_controller_.controller.md#private-readonly-events)
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

*Defined in [packages/augur-sdk/src/state/Controller.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L14)*

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

*Defined in [packages/augur-sdk/src/state/Controller.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L17)*

___

### `Private` db

• **db**: *Promise‹[DB](_augur_sdk_src_state_db_db_.db.md)›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L18)*

___

### `Private` `Readonly` events

• **events**: *any*

*Defined in [packages/augur-sdk/src/state/Controller.ts:14](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L14)*

___

### `Private` logFilterAggregator

• **logFilterAggregator**: *[LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/Controller.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L19)*

___

### `Static` `Private` latestBlock

▪ **latestBlock**: *Block*

*Defined in [packages/augur-sdk/src/state/Controller.ts:12](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L12)*

## Methods

### `Private` allEvents

▸ **allEvents**(`blockNumber`: number, `allLogs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:53](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`allLogs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹void›*

___

### `Private` getLatestBlock

▸ **getLatestBlock**(): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:99](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L99)*

**Returns:** *Promise‹Block›*

___

### `Private` notifyNewBlockEvent

▸ **notifyNewBlockEvent**(`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:72](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹void›*

___

### `Private` updateMarketsData

▸ **updateMarketsData**(`marketIds`: string[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/Controller.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/Controller.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`marketIds` | string[] |

**Returns:** *Promise‹void›*
