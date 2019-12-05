---
id: api-classes-augur-sdk-src-state-utils-logger-logger-logger
title: Logger
sidebar_label: Logger
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/utils/logger/logger Module]](api-modules-augur-sdk-src-state-utils-logger-logger-module.md) > [Logger](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md)

## Class

## Hierarchy

**Logger**

### Properties

* [loggers](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#loggers)

### Methods

* [addLogger](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#addlogger)
* [clear](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#clear)
* [debug](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#debug)
* [error](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#error)
* [info](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#info)
* [warn](api-classes-augur-sdk-src-state-utils-logger-logger-logger.md#warn)

---

## Properties

<a id="loggers"></a>

### `<Private>` loggers

**● loggers**: *[LoggerInterface](api-interfaces-augur-sdk-src-state-utils-logger-logger-loggerinterface.md)[]* =  []

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L14)*

___

## Methods

<a id="addlogger"></a>

###  addLogger

▸ **addLogger**(logger: *[LoggerInterface](api-interfaces-augur-sdk-src-state-utils-logger-logger-loggerinterface.md)*): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logger | [LoggerInterface](api-interfaces-augur-sdk-src-state-utils-logger-logger-loggerinterface.md) |

**Returns:** `void`

___
<a id="clear"></a>

###  clear

▸ **clear**(): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:36](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L36)*

**Returns:** `void`

___
<a id="debug"></a>

###  debug

▸ **debug**(...msg: *`string`[]*): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:32](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `string`[] |

**Returns:** `void`

___
<a id="error"></a>

###  error

▸ **error**(...err: *`Array`<`string` \| `Error`>*): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` err | `Array`<`string` \| `Error`> |

**Returns:** `void`

___
<a id="info"></a>

###  info

▸ **info**(...msg: *`string`[]*): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `string`[] |

**Returns:** `void`

___
<a id="warn"></a>

###  warn

▸ **warn**(...msg: *`string`[]*): `void`

*Defined in [augur-sdk/src/state/utils/logger/logger.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/utils/logger/logger.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `string`[] |

**Returns:** `void`

___

