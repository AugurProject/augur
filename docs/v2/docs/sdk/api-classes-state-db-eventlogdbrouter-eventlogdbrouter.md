---
id: api-classes-state-db-eventlogdbrouter-eventlogdbrouter
title: EventLogDBRouter
sidebar_label: EventLogDBRouter
---

[@augurproject/sdk](api-readme.md) > [[state/db/EventLogDBRouter Module]](api-modules-state-db-eventlogdbrouter-module.md) > [EventLogDBRouter](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md)

## Class

## Hierarchy

**EventLogDBRouter**

### Constructors

* [constructor](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#constructor)

### Properties

* [logCallbacks](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#logcallbacks)
* [parseLogs](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#parselogs)

### Methods

* [addLogCallback](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#addlogcallback)
* [filterCallbackByTopic](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#filtercallbackbytopic)
* [onLogsAdded](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md#onlogsadded)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EventLogDBRouter**(parseLogs: *`function`*): [EventLogDBRouter](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md)

*Defined in [state/db/EventLogDBRouter.ts:6](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parseLogs | `function` |

**Returns:** [EventLogDBRouter](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md)

___

## Properties

<a id="logcallbacks"></a>

### `<Private>` logCallbacks

**● logCallbacks**: *`Array`<[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)>* =  []

*Defined in [state/db/EventLogDBRouter.ts:6](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L6)*

___
<a id="parselogs"></a>

### `<Private>` parseLogs

**● parseLogs**: *`function`*

*Defined in [state/db/EventLogDBRouter.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L8)*

#### Type declaration
▸(logs: *`Array`<[Log](api-interfaces-state-logs-types-log.md)>*): `Array`<`ParsedLog`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | `Array`<[Log](api-interfaces-state-logs-types-log.md)> |

**Returns:** `Array`<`ParsedLog`>

___

## Methods

<a id="addlogcallback"></a>

###  addLogCallback

▸ **addLogCallback**(topic: *`string`*, callback: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [state/db/EventLogDBRouter.ts:20](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| callback | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="filtercallbackbytopic"></a>

###  filterCallbackByTopic

▸ **filterCallbackByTopic**(topic: *`string`*, callback: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

*Defined in [state/db/EventLogDBRouter.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| callback | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockNumber: *`number`*, extendedLogs: *`Array`<`ExtendedLog`>*): `Promise`<`void`>

*Defined in [state/db/EventLogDBRouter.ts:24](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| extendedLogs | `Array`<`ExtendedLog`> |

**Returns:** `Promise`<`void`>

___

