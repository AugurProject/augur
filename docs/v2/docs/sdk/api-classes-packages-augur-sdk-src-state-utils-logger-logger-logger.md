---
id: api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger
title: Logger
sidebar_label: Logger
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/utils/logger/logger Module]](api-modules-packages-augur-sdk-src-state-utils-logger-logger-module.md) > [Logger](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md)

## Class

## Hierarchy

**Logger**

### Properties

* [loggers](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#loggers)

### Methods

* [addLogger](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#addlogger)
* [clear](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#clear)
* [debug](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#debug)
* [error](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#error)
* [info](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#info)
* [warn](api-classes-packages-augur-sdk-src-state-utils-logger-logger-logger.md#warn)

---

## Properties

<a id="loggers"></a>

### `<Private>` loggers

**● loggers**: *`Array`<[LoggerInterface](api-interfaces-packages-augur-sdk-src-state-utils-logger-logger-loggerinterface.md)>* =  []

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:14](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L14)*

___

## Methods

<a id="addlogger"></a>

###  addLogger

▸ **addLogger**(logger: *[LoggerInterface](api-interfaces-packages-augur-sdk-src-state-utils-logger-logger-loggerinterface.md)*): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:16](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| logger | [LoggerInterface](api-interfaces-packages-augur-sdk-src-state-utils-logger-logger-loggerinterface.md) |

**Returns:** `void`

___
<a id="clear"></a>

###  clear

▸ **clear**(): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:36](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L36)*

**Returns:** `void`

___
<a id="debug"></a>

###  debug

▸ **debug**(...msg: *`Array`<`string`>*): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:32](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___
<a id="error"></a>

###  error

▸ **error**(...err: *`Array`<`string` \| `Error`>*): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:20](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L20)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` err | `Array`<`string` \| `Error`> |

**Returns:** `void`

___
<a id="info"></a>

###  info

▸ **info**(...msg: *`Array`<`string`>*): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:28](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L28)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___
<a id="warn"></a>

###  warn

▸ **warn**(...msg: *`Array`<`string`>*): `void`

*Defined in [packages/augur-sdk/src/state/utils/logger/logger.ts:24](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/utils/logger/logger.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` msg | `Array`<`string`> |

**Returns:** `void`

___

