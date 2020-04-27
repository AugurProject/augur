[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/LogFilterAggregator"](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md) › [LogFilterAggregatorInterface](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)

# Interface: LogFilterAggregatorInterface

## Hierarchy

* **LogFilterAggregatorInterface**

## Implemented by

* [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)

## Index

### Properties

* [allLogsCallbackMetaData](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#alllogscallbackmetadata)
* [logCallbackMetaData](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#logcallbackmetadata)
* [notifyNewBlockAfterLogsProcessMetadata](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#notifynewblockafterlogsprocessmetadata)
* [onLogsAdded](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#onlogsadded)

### Methods

* [listenForAllEvents](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#listenforallevents)
* [listenForBlockRemoved](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#listenforblockremoved)
* [listenForEvent](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#listenforevent)
* [notifyNewBlockAfterLogsProcess](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#notifynewblockafterlogsprocess)
* [onBlockRemoved](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#onblockremoved)
* [unlistenForEvent](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md#unlistenforevent)

## Properties

###  allLogsCallbackMetaData

• **allLogsCallbackMetaData**: *[LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)[]*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:33](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L33)*

___

###  logCallbackMetaData

• **logCallbackMetaData**: *[LogCallbackMetaData](_augur_sdk_src_state_logs_logfilteraggregator_.logcallbackmetadata.md)[]*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L35)*

___

###  notifyNewBlockAfterLogsProcessMetadata

• **notifyNewBlockAfterLogsProcessMetadata**: *[LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)[]*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:34](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L34)*

___

###  onLogsAdded

• **onLogsAdded**: *function*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:36](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L36)*

#### Type declaration:

▸ (`blockNumber`: number, `logs`: [Log](_augur_types_types_logs_.log.md)[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |
`logs` | [Log](_augur_types_types_logs_.log.md)[] |

## Methods

###  listenForAllEvents

▸ **listenForAllEvents**(`onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:44](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L44)*

**`description`** Register a callback that will receive the sum total of all registered filters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |   |

**Returns:** *void*

___

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(`onBlockRemoved`: [BlockRemovalCallback](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#blockremovalcallback)): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:57](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`onBlockRemoved` | [BlockRemovalCallback](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#blockremovalcallback) |

**Returns:** *void*

___

###  listenForEvent

▸ **listenForEvent**(`eventNames`: string | string[], `onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:46](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  notifyNewBlockAfterLogsProcess

▸ **notifyNewBlockAfterLogsProcess**(`onBlockAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:38](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`onBlockAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*

___

###  onBlockRemoved

▸ **onBlockRemoved**(`blockNumber`: number): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:56](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

**Returns:** *void*

___

###  unlistenForEvent

▸ **unlistenForEvent**(`eventNames`: string | string[], `onLogsAdded`: [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)): *void*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:51](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`eventNames` | string &#124; string[] |
`onLogsAdded` | [LogCallbackType](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype) |

**Returns:** *void*
