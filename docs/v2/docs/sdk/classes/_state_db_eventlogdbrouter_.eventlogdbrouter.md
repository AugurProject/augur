[@augurproject/sdk](../README.md) > ["state/db/EventLogDBRouter"](../modules/_state_db_eventlogdbrouter_.md) > [EventLogDBRouter](../classes/_state_db_eventlogdbrouter_.eventlogdbrouter.md)

# Class: EventLogDBRouter

## Hierarchy

**EventLogDBRouter**

## Index

### Constructors

* [constructor](_state_db_eventlogdbrouter_.eventlogdbrouter.md#constructor)

### Properties

* [logCallbacks](_state_db_eventlogdbrouter_.eventlogdbrouter.md#logcallbacks)
* [parseLogs](_state_db_eventlogdbrouter_.eventlogdbrouter.md#parselogs)

### Methods

* [addLogCallback](_state_db_eventlogdbrouter_.eventlogdbrouter.md#addlogcallback)
* [filterCallbackByTopic](_state_db_eventlogdbrouter_.eventlogdbrouter.md#filtercallbackbytopic)
* [onLogsAdded](_state_db_eventlogdbrouter_.eventlogdbrouter.md#onlogsadded)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EventLogDBRouter**(parseLogs: *`function`*): [EventLogDBRouter](_state_db_eventlogdbrouter_.eventlogdbrouter.md)

*Defined in [state/db/EventLogDBRouter.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L6)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| parseLogs | `function` |

**Returns:** [EventLogDBRouter](_state_db_eventlogdbrouter_.eventlogdbrouter.md)

___

## Properties

<a id="logcallbacks"></a>

### `<Private>` logCallbacks

**● logCallbacks**: *`Array`<[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)>* =  []

*Defined in [state/db/EventLogDBRouter.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L6)*

___
<a id="parselogs"></a>

### `<Private>` parseLogs

**● parseLogs**: *`function`*

*Defined in [state/db/EventLogDBRouter.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L8)*

#### Type declaration
▸(logs: *`Array`<[Log](../interfaces/_state_logs_types_.log.md)>*): `Array`<`ParsedLog`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| logs | `Array`<[Log](../interfaces/_state_logs_types_.log.md)> |

**Returns:** `Array`<`ParsedLog`>

___

## Methods

<a id="addlogcallback"></a>

###  addLogCallback

▸ **addLogCallback**(topic: *`string`*, callback: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*): `void`

*Defined in [state/db/EventLogDBRouter.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| callback | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |

**Returns:** `void`

___
<a id="filtercallbackbytopic"></a>

###  filterCallbackByTopic

▸ **filterCallbackByTopic**(topic: *`string`*, callback: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*): [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)

*Defined in [state/db/EventLogDBRouter.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| topic | `string` |
| callback | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |

**Returns:** [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockNumber: *`number`*, extendedLogs: *`Array`<`ExtendedLog`>*): `Promise`<`void`>

*Defined in [state/db/EventLogDBRouter.ts:24](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/EventLogDBRouter.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockNumber | `number` |
| extendedLogs | `Array`<`ExtendedLog`> |

**Returns:** `Promise`<`void`>

___

