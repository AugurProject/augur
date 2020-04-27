[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/LogFilterAggregator"](_augur_sdk_src_state_logs_logfilteraggregator_.md)

# Module: "augur-sdk/src/state/logs/LogFilterAggregator"

## Index

### Classes

* [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md)

### Interfaces

* [ExtendedFilter](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.extendedfilter.md)
* [LogCallbackMetaData](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logcallbackmetadata.md)
* [LogFilterAggregatorDepsInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md)
* [LogFilterAggregatorInterface](../interfaces/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatorinterface.md)

### Type aliases

* [BlockRemovalCallback](_augur_sdk_src_state_logs_logfilteraggregator_.md#blockremovalcallback)
* [EventTopics](_augur_sdk_src_state_logs_logfilteraggregator_.md#eventtopics)
* [GenericLogCallbackType](_augur_sdk_src_state_logs_logfilteraggregator_.md#genericlogcallbacktype)
* [LogCallbackType](_augur_sdk_src_state_logs_logfilteraggregator_.md#logcallbacktype)

## Type aliases

###  BlockRemovalCallback

Ƭ **BlockRemovalCallback**: *function*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L30)*

#### Type declaration:

▸ (`blockNumber`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`blockNumber` | number |

___

###  EventTopics

Ƭ **EventTopics**: *string | string[]*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:4](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L4)*

___

###  GenericLogCallbackType

Ƭ **GenericLogCallbackType**: *function*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:6](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L6)*

#### Type declaration:

▸ (`blockIdentifier`: T, `logs`: P[]): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`blockIdentifier` | T |
`logs` | P[] |

___

###  LogCallbackType

Ƭ **LogCallbackType**: *[GenericLogCallbackType](_augur_sdk_src_state_logs_logfilteraggregator_.md#genericlogcallbacktype)‹number, [ParsedLog](../interfaces/_augur_types_types_logs_.parsedlog.md)›*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L10)*
