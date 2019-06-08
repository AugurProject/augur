[@augurproject/sdk](../README.md) > ["state/utils/logger/logger"](../modules/_state_utils_logger_logger_.md) > [Logger](../classes/_state_utils_logger_logger_.logger.md)

# Class: Logger

## Hierarchy

**Logger**

## Index

### Properties

* [loggers](_state_utils_logger_logger_.logger.md#loggers)

### Methods

* [addLogger](_state_utils_logger_logger_.logger.md#addlogger)
* [clear](_state_utils_logger_logger_.logger.md#clear)
* [debug](_state_utils_logger_logger_.logger.md#debug)
* [error](_state_utils_logger_logger_.logger.md#error)
* [info](_state_utils_logger_logger_.logger.md#info)
* [warn](_state_utils_logger_logger_.logger.md#warn)

---

## Properties

<a id="loggers"></a>

### `<Private>` loggers

**● loggers**: *`Array`<[LoggerInterface](../interfaces/_state_utils_logger_logger_.loggerinterface.md)>* =  []

*Defined in [state/utils/logger/logger.ts:14](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L14)*

___

## Methods

<a id="addlogger"></a>

###  addLogger

▸ **addLogger**(logger: *[LoggerInterface](../interfaces/_state_utils_logger_logger_.loggerinterface.md)*): `void`

*Defined in [state/utils/logger/logger.ts:16](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logger | [LoggerInterface](../interfaces/_state_utils_logger_logger_.loggerinterface.md) |

**Returns:** `void`

___
<a id="clear"></a>

###  clear

▸ **clear**(): `void`

*Defined in [state/utils/logger/logger.ts:36](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L36)*

**Returns:** `void`

___
<a id="debug"></a>

###  debug

▸ **debug**(...msg: *`Array`<`string`>*): `void`

*Defined in [state/utils/logger/logger.ts:32](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___
<a id="error"></a>

###  error

▸ **error**(...err: *`Array`<`string` \| `Error`>*): `void`

*Defined in [state/utils/logger/logger.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` err | `Array`<`string` \| `Error`> |

**Returns:** `void`

___
<a id="info"></a>

###  info

▸ **info**(...msg: *`Array`<`string`>*): `void`

*Defined in [state/utils/logger/logger.ts:28](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___
<a id="warn"></a>

###  warn

▸ **warn**(...msg: *`Array`<`string`>*): `void`

*Defined in [state/utils/logger/logger.ts:24](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/utils/logger/logger.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___

