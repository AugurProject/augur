[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/logs/LogFilterAggregator"](../modules/_augur_sdk_src_state_logs_logfilteraggregator_.md) › [LogFilterAggregatorDepsInterface](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md)

# Interface: LogFilterAggregatorDepsInterface

## Hierarchy

* **LogFilterAggregatorDepsInterface**

## Index

### Properties

* [getEventTopics](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md#geteventtopics)
* [parseLogs](_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregatordepsinterface.md#parselogs)

## Properties

###  getEventTopics

• **getEventTopics**: *function*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:26](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L26)*

#### Type declaration:

▸ (`eventName`: string): *string[]*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

___

###  parseLogs

• **parseLogs**: *function*

*Defined in [packages/augur-sdk/src/state/logs/LogFilterAggregator.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/logs/LogFilterAggregator.ts#L27)*

#### Type declaration:

▸ (`logs`: [Log](_augur_types_types_logs_.log.md)[]): *[ParsedLog](_augur_types_types_logs_.parsedlog.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`logs` | [Log](_augur_types_types_logs_.log.md)[] |
