---
id: api-modules-state-db-blockandlogstreamerlistener-module
title: state/db/BlockAndLogStreamerListener Module
sidebar_label: state/db/BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[state/db/BlockAndLogStreamerListener Module]](api-modules-state-db-blockandlogstreamerlistener-module.md)

## Module

### Classes

* [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Interfaces

* [BlockAndLogStreamerInterface](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)
* [BlockAndLogStreamerListenerDependencies](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)
* [IBlockAndLogStreamerListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

### Type aliases

* [BlockstreamLogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#blockstreamlogcallbacktype)
* [GenericLogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)
* [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

---

## Type aliases

<a id="blockstreamlogcallbacktype"></a>

###  BlockstreamLogCallbackType

**Ƭ BlockstreamLogCallbackType**: *[GenericLogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)<`string`, [Log](api-interfaces-state-logs-types-log.md)>*

*Defined in [state/db/BlockAndLogStreamerListener.ts:29](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L29)*

___
<a id="genericlogcallbacktype"></a>

###  GenericLogCallbackType

**Ƭ GenericLogCallbackType**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L27)*

#### Type declaration
▸(blockIdentifier: *`T`*, logs: *`P`[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockIdentifier | `T` |
| logs | `P`[] |

**Returns:** `void`

___
<a id="logcallbacktype"></a>

###  LogCallbackType

**Ƭ LogCallbackType**: *[GenericLogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)<`number`, `ParsedLog`>*

*Defined in [state/db/BlockAndLogStreamerListener.ts:30](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L30)*

___

