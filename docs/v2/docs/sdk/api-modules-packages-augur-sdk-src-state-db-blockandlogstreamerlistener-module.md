---
id: api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module
title: packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module
sidebar_label: packages/augur-sdk/src/state/db/BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md)

## Module

### Classes

* [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Interfaces

* [BlockAndLogStreamerInterface](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)
* [BlockAndLogStreamerListenerDependencies](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)
* [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

### Type aliases

* [BlockstreamLogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#blockstreamlogcallbacktype)
* [GenericLogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)
* [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

---

## Type aliases

<a id="blockstreamlogcallbacktype"></a>

###  BlockstreamLogCallbackType

**Ƭ BlockstreamLogCallbackType**: *[GenericLogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)<`string`, [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)>*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:29](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L29)*

___
<a id="genericlogcallbacktype"></a>

###  GenericLogCallbackType

**Ƭ GenericLogCallbackType**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:27](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L27)*

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

**Ƭ LogCallbackType**: *[GenericLogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)<`number`, [ParsedLog](api-interfaces-node-modules--augurproject-types-types-logs-parsedlog.md)>*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:30](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L30)*

___

