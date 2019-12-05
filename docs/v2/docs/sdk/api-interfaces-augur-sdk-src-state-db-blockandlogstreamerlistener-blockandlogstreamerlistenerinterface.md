---
id: api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface
title: BlockAndLogStreamerListenerInterface
sidebar_label: BlockAndLogStreamerListenerInterface
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)

## Interface

## Hierarchy

**BlockAndLogStreamerListenerInterface**

## Implemented by

* [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

### Methods

* [listenForAllEvents](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforallevents)
* [listenForBlockAdded](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforblockadded)
* [listenForBlockRemoved](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforblockremoved)
* [listenForEvent](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforevent)
* [notifyNewBlockAfterLogsProcess](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#notifynewblockafterlogsprocess)
* [startBlockStreamListener](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#startblockstreamlistener)

---

## Methods

<a id="listenforallevents"></a>

###  listenForAllEvents

▸ **listenForAllEvents**(onLogsAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:63](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L63)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="listenforblockadded"></a>

###  listenForBlockAdded

▸ **listenForBlockAdded**(callback: *`function`*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:66](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L66)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:65](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string` \| `string`[]*, onLogsAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogRemoved?: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:58](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L58)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` \| `string`[] |
| onLogsAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogRemoved | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="notifynewblockafterlogsprocess"></a>

###  notifyNewBlockAfterLogsProcess

▸ **notifyNewBlockAfterLogsProcess**(onLogsAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `any`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:64](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L64)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `any`

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L67)*

**Returns:** `void`

___

