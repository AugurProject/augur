---
id: api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener
title: IBlockAndLogStreamerListener
sidebar_label: IBlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [IBlockAndLogStreamerListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md)

## Interface

## Hierarchy

**IBlockAndLogStreamerListener**

## Implemented by

* [BlockAndLogStreamerListener](api-classes-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Methods

* [listenForBlockAdded](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforblockadded)
* [listenForBlockRemoved](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#listenforevent)
* [startBlockStreamListener](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-iblockandlogstreamerlistener.md#startblockstreamlistener)

---

## Methods

<a id="listenforblockadded"></a>

###  listenForBlockAdded

▸ **listenForBlockAdded**(callback: *`function`*): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:35](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:34](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogRemoved?: *[LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:33](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogRemoved | [LogCallbackType](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:36](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L36)*

**Returns:** `void`

___

