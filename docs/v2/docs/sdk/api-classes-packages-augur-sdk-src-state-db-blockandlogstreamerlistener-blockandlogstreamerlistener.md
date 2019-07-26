---
id: api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener
title: BlockAndLogStreamerListener
sidebar_label: BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

## Class

## Hierarchy

**BlockAndLogStreamerListener**

## Implements

* [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#constructor)

### Properties

* [address](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#address)
* [deps](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#deps)

### Methods

* [listenForBlockAdded](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforblockadded)
* [listenForBlockRemoved](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforevent)
* [onLogsAdded](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onlogsadded)
* [onNewBlock](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onnewblock)
* [startBlockStreamListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#startblockstreamlistener)
* [create](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BlockAndLogStreamerListener**(deps: *[BlockAndLogStreamerListenerDependencies](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*): [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:40](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deps | [BlockAndLogStreamerListenerDependencies](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md) |

**Returns:** [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

## Properties

<a id="address"></a>

### `<Private>` address

**● address**: *`string`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:40](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L40)*

___
<a id="deps"></a>

### `<Private>` deps

**● deps**: *[BlockAndLogStreamerListenerDependencies](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:42](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L42)*

___

## Methods

<a id="listenforblockadded"></a>

###  listenForBlockAdded

▸ **listenForBlockAdded**(callback: *`function`*): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:74](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L74)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:81](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L81)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogsRemoved?: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Implementation of [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md).[listenForEvent](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforevent)*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:63](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L63)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogsRemoved | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockHash: *`string`*, extendedLogs: *`ExtendedLog`[]*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:89](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L89)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockHash | `string` |
| extendedLogs | `ExtendedLog`[] |

**Returns:** `Promise`<`void`>

___
<a id="onnewblock"></a>

###  onNewBlock

▸ **onNewBlock**(block: *`Block`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:102](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L102)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Implementation of [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md).[startBlockStreamListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#startblockstreamlistener)*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:98](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L98)*

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(provider: *`EthersProvider`*, eventLogDBRouter: *[EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md)*, address: *`string`*, getEventTopics: *`function`*): [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:47](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | `EthersProvider` |
| eventLogDBRouter | [EventLogDBRouter](api-classes-packages-augur-sdk-src-state-db-eventlogdbrouter-eventlogdbrouter.md) |
| address | `string` |
| getEventTopics | `function` |

**Returns:** [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

