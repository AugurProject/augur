---
id: api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener
title: BlockAndLogStreamerListener
sidebar_label: BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[state/db/BlockAndLogStreamerListener Module]](api-modules-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

## Class

## Hierarchy

**BlockAndLogStreamerListener**

## Implements

* [IBlockAndLogStreamerListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

### Constructors

* [constructor](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#constructor)

### Properties

* [address](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#address)
* [deps](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#deps)

### Methods

* [listenForBlockRemoved](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforevent)
* [onLogsAdded](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onlogsadded)
* [onNewBlock](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onnewblock)
* [startBlockStreamListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#startblockstreamlistener)
* [create](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BlockAndLogStreamerListener**(deps: *[BlockAndLogStreamerListenerDependencies](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*): [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [state/db/BlockAndLogStreamerListener.ts:39](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deps | [BlockAndLogStreamerListenerDependencies](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md) |

**Returns:** [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

## Properties

<a id="address"></a>

### `<Private>` address

**● address**: *`string`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:39](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L39)*

___
<a id="deps"></a>

### `<Private>` deps

**● deps**: *[BlockAndLogStreamerListenerDependencies](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:41](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L41)*

___

## Methods

<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:73](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogsRemoved?: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Implementation of [IBlockAndLogStreamerListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md).[listenForEvent](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforevent)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:62](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogsRemoved | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockHash: *`string`*, extendedLogs: *`ExtendedLog`[]*): `Promise`<`void`>

*Defined in [state/db/BlockAndLogStreamerListener.ts:81](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L81)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:94](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Implementation of [IBlockAndLogStreamerListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md).[startBlockStreamListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#startblockstreamlistener)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:90](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L90)*

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(provider: *`EthersProvider`*, eventLogDBRouter: *[EventLogDBRouter](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md)*, address: *`string`*, getEventTopics: *`function`*): [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [state/db/BlockAndLogStreamerListener.ts:46](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | `EthersProvider` |
| eventLogDBRouter | [EventLogDBRouter](api-classes-state-db-eventlogdbrouter-eventlogdbrouter.md) |
| address | `string` |
| getEventTopics | `function` |

**Returns:** [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

