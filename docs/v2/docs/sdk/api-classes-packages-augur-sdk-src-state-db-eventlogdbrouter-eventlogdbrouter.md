---
id: api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter
title: EventLogDBRouter
sidebar_label: EventLogDBRouter
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/EventLogDBRouter Module]](api-modules-packages-augur-sdk-src-state-db-eventlogdbrouter-module.md) > [EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md)

## Class

## Hierarchy

**EventLogDBRouter**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#constructor)

### Properties

* [logCallbacks](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#logcallbacks)
* [parseLogs](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#parselogs)

### Methods

* [addLogCallback](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#addlogcallback)
* [filterCallbackByTopic](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#filtercallbackbytopic)
* [onLogsAdded](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md#onlogsadded)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EventLogDBRouter**(parseLogs: *`function`*): [EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md)

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:9](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parseLogs | `function` |

**Returns:** [EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md)

___

## Properties

<a id="logcallbacks"></a>

### `<Private>` logCallbacks

**● logCallbacks**: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)[]* =  []

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:9](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L9)*

___
<a id="parselogs"></a>

### `<Private>` parseLogs

**● parseLogs**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:11](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L11)*

#### Type declaration
▸(logs: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)[]*): [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)[] |

**Returns:** [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)[]

___

## Methods

<a id="addlogcallback"></a>

###  addLogCallback

▸ **addLogCallback**(topic: *[EventTopics](api-modules-packages-augur-sdk-src-state-db-eventlogdbrouter-module.md#eventtopics)*, callback: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:24](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | [EventTopics](api-modules-packages-augur-sdk-src-state-db-eventlogdbrouter-module.md#eventtopics) |
| callback | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="filtercallbackbytopic"></a>

###  filterCallbackByTopic

▸ **filterCallbackByTopic**(topics: *[EventTopics](api-modules-packages-augur-sdk-src-state-db-eventlogdbrouter-module.md#eventtopics)*, callback: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:14](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topics | [EventTopics](api-modules-packages-augur-sdk-src-state-db-eventlogdbrouter-module.md#eventtopics) |
| callback | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockNumber: *`number`*, extendedLogs: *`ExtendedLog`[]*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/EventLogDBRouter.ts:28](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| extendedLogs | `ExtendedLog`[] |

**Returns:** `Promise`<`void`>

___

