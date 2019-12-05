---
id: api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module
title: augur-sdk/src/state/db/BlockAndLogStreamerListener Module
sidebar_label: augur-sdk/src/state/db/BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md)

## Module

### Classes

* [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Interfaces

* [BlockAndLogStreamerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)
* [BlockAndLogStreamerListenerDependencies](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)
* [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)
* [ExtendedFilter](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-extendedfilter.md)
* [LogCallbackMetaData](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-logcallbackmetadata.md)

### Type aliases

* [BlockCallback](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#blockcallback)
* [EventTopics](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#eventtopics)
* [GenericLogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)
* [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

---

## Type aliases

<a id="blockcallback"></a>

###  BlockCallback

**Ƭ BlockCallback**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:53](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L53)*

#### Type declaration
▸(block: *`Block`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `void`

___
<a id="eventtopics"></a>

###  EventTopics

**Ƭ EventTopics**: *`string` \| `string`[]*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:70](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L70)*

___
<a id="genericlogcallbacktype"></a>

###  GenericLogCallbackType

**Ƭ GenericLogCallbackType**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:51](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L51)*

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

**Ƭ LogCallbackType**: *[GenericLogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#genericlogcallbacktype)<`number`, [ParsedLog](api-interfaces-augur-types-types-logs-parsedlog.md)>*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:55](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L55)*

___

