---
id: api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener
title: IBlockAndLogStreamerListener
sidebar_label: IBlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[state/db/BlockAndLogStreamerListener Module]](api-modules-state-db-blockandlogstreamerlistener-module.md) > [IBlockAndLogStreamerListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

## Interface

## Hierarchy

**IBlockAndLogStreamerListener**

## Implemented by

* [BlockAndLogStreamerListener](api-classes-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Methods

* [listenForBlockRemoved](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforevent)
* [startBlockStreamListener](api-interfaces-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#startblockstreamlistener)

---

## Methods

<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:34](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogRemoved?: *[LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:33](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogRemoved | [LogCallbackType](api-modules-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:35](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L35)*

**Returns:** `void`

___

