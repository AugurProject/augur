[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/LogFilterAggregator"](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md) › [LogFilterAggregator](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)

# Class: LogFilterAggregator

## Hierarchy

* **LogFilterAggregator**

## Implements

* [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)

## Index

### Constructors

* [constructor](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#constructor)

### Properties

* [allLogsCallbackMetaData](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#alllogscallbackmetadata)
* [blockRemovalCallback](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#blockremovalcallback)
* [deps](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#private-deps)
* [logCallbackMetaData](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#logcallbackmetadata)
* [notifyNewBlockAfterLogsProcessMetadata](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#notifynewblockafterlogsprocessmetadata)

### Methods

* [listenForAllEvents](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#listenforallevents)
* [listenForBlockRemoved](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#listenforblockremoved)
* [listenForEvent](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#listenforevent)
* [notifyNewBlockAfterLogsProcess](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#notifynewblockafterlogsprocess)
* [onBlockRemoved](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#onblockremoved)
* [onLogsAdded](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#onlogsadded)
* [unlistenForEvent](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#unlistenforevent)
* [create](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md#static-create)

## Constructors

###  constructor

\+ **new LogFilterAggregator**(`deps`: [LogFilterAggregatorDepsInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md)): *[LogFilterAggregator](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:64](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`deps` | [LogFilterAggregatorDepsInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md) |

**Returns:** *[LogFilterAggregator](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)*

## Properties

###  allLogsCallbackMetaData

• **allLogsCallbackMetaData**: *[LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)[]* = []

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md).[allLogsCallbackMetaData](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#alllogscallbackmetadata)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:61](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L61)*

___

###  blockRemovalCallback

• **blockRemovalCallback**: *[BlockRemovalCallback](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#blockremovalcallback)[]* = []

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:64](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L64)*

___

### `Private` deps

• **deps**: *[LogFilterAggregatorDepsInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:66](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L66)*

___

###  logCallbackMetaData

• **logCallbackMetaData**: *[LogCallbackMetaData](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logcallbackmetadata.md)[]* = []

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md).[logCallbackMetaData](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#logcallbackmetadata)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:63](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L63)*

___

###  notifyNewBlockAfterLogsProcessMetadata

• **notifyNewBlockAfterLogsProcessMetadata**: *[LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)[]* = []

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md).[notifyNewBlockAfterLogsProcessMetadata](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#notifynewblockafterlogsprocessmetadata)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:62](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L62)*

## Methods

###  listenForAllEvents

▸ **listenForAllEvents**(`onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:86](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L86)*

**`description`** Register a callback that will receive the sum total of all registered filters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |   |

**Returns:** *void*

___

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(`onBlockRemoved`: function): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:154](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L154)*

**Parameters:**

▪ **onBlockRemoved**: *function*

▸ (`blockNumber`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *void*

___

###  listenForEvent

▸ **listenForEvent**(`eventNames`: string | string[], `onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:117](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  notifyNewBlockAfterLogsProcess

▸ **notifyNewBlockAfterLogsProcess**(`onBlockAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:78](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`onBlockAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  onBlockRemoved

▸ **onBlockRemoved**(`blockNumber`: number): *Promise‹void›*

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:148](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *Promise‹void›*

___

###  onLogsAdded

▸ **onLogsAdded**(`blockNumber`: number, `logs`: [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]): *Promise‹void›*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:90](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[] |

**Returns:** *Promise‹void›*

___

###  unlistenForEvent

▸ **unlistenForEvent**(`eventNames`: string | string[], `onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Implementation of [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:130](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

### `Static` create

▸ **create**(`getEventTopics`: function, `parseLogs`: function): *[LogFilterAggregator](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)‹›*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:68](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L68)*

**Parameters:**

▪ **getEventTopics**: *function*

▸ (`eventName`: string): *string[]*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

▪ **parseLogs**: *function*

▸ (`logs`: [Log](../interfaces/_augur_types_types_logs_.log.md)[]): *[ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](../interfaces/_augur_types_types_logs_.log.md)[] |

**Returns:** *[LogFilterAggregator](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)‹›*
