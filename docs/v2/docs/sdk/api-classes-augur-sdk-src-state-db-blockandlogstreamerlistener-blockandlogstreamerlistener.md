---
id: api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener
title: BlockAndLogStreamerListener
sidebar_label: BlockAndLogStreamerListener
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

## Class

## Hierarchy

**BlockAndLogStreamerListener**

## Implements

* [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md)

### Constructors

* [constructor](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#constructor)

### Properties

* [allLogsCallbackMetaData](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#alllogscallbackmetadata)
* [blockWindowWidth](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#blockwindowwidth)
* [currentSuspectBlocks](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#currentsuspectblocks)
* [deps](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#deps)
* [logCallbackMetaData](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#logcallbackmetadata)
* [notifyNewBlockAfterLogsProcessMetadata](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#notifynewblockafterlogsprocessmetadata)

### Methods

* [buildFilter](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#buildfilter)
* [filterCallbackByContractAddressAndTopic](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#filtercallbackbycontractaddressandtopic)
* [listenForAllEvents](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforallevents)
* [listenForBlockAdded](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforblockadded)
* [listenForBlockRemoved](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#listenforevent)
* [notifyNewBlockAfterLogsProcess](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#notifynewblockafterlogsprocess)
* [onBlockAdded](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onblockadded)
* [onBlockRemoved](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onblockremoved)
* [onLogsAdded](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onlogsadded)
* [onNewBlock](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#onnewblock)
* [startBlockStreamListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#startblockstreamlistener)
* [create](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BlockAndLogStreamerListener**(deps: *[BlockAndLogStreamerListenerDependencies](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*, blockWindowWidth?: *`number`*): [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:84](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L84)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| deps | [BlockAndLogStreamerListenerDependencies](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md) | - |
| `Default value` blockWindowWidth | `number` | 5 |

**Returns:** [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

## Properties

<a id="alllogscallbackmetadata"></a>

### `<Private>` allLogsCallbackMetaData

**● allLogsCallbackMetaData**: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)[]* =  []

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:82](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L82)*

___
<a id="blockwindowwidth"></a>

### `<Private>` blockWindowWidth

**● blockWindowWidth**: *`number`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:86](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L86)*

___
<a id="currentsuspectblocks"></a>

### `<Private>` currentSuspectBlocks

**● currentSuspectBlocks**: *`Block`[]* =  []

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:84](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L84)*

___
<a id="deps"></a>

### `<Private>` deps

**● deps**: *[BlockAndLogStreamerListenerDependencies](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerdependencies.md)*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:86](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L86)*

___
<a id="logcallbackmetadata"></a>

### `<Private>` logCallbackMetaData

**● logCallbackMetaData**: *[LogCallbackMetaData](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-logcallbackmetadata.md)[]* =  []

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:81](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L81)*

___
<a id="notifynewblockafterlogsprocessmetadata"></a>

### `<Private>` notifyNewBlockAfterLogsProcessMetadata

**● notifyNewBlockAfterLogsProcessMetadata**: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)[]* =  []

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:83](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L83)*

___

## Methods

<a id="buildfilter"></a>

###  buildFilter

▸ **buildFilter**(): [ExtendedFilter](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-extendedfilter.md)

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:172](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L172)*

**Returns:** [ExtendedFilter](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-extendedfilter.md)

___
<a id="filtercallbackbycontractaddressandtopic"></a>

### `<Private>` filterCallbackByContractAddressAndTopic

▸ **filterCallbackByContractAddressAndTopic**(contractAddress: *`string`*, topics: *[EventTopics](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#eventtopics)*, callback: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:117](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L117)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractAddress | `string` |
| topics | [EventTopics](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#eventtopics) |
| callback | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)

___
<a id="listenforallevents"></a>

###  listenForAllEvents

▸ **listenForAllEvents**(onLogsAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Implementation of [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md).[listenForAllEvents](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforallevents)*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:205](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L205)*

*__description__*: Register a callback that will receive the sum total of all registered filters.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| onLogsAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |   |

**Returns:** `void`

___
<a id="listenforblockadded"></a>

###  listenForBlockAdded

▸ **listenForBlockAdded**(callback: *[BlockCallback](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#blockcallback)*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:209](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L209)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | [BlockCallback](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#blockcallback) |

**Returns:** `void`

___
<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:216](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L216)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventNames: *`string` \| `string`[]*, onLogsAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*, onLogsRemoved?: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Implementation of [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md).[listenForEvent](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#listenforevent)*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:133](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L133)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventNames | `string` \| `string`[] |
| onLogsAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |
| `Optional` onLogsRemoved | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="notifynewblockafterlogsprocess"></a>

###  notifyNewBlockAfterLogsProcess

▸ **notifyNewBlockAfterLogsProcess**(onBlockAdded: *[LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype)*): `void`

*Implementation of [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md).[notifyNewBlockAfterLogsProcess](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#notifynewblockafterlogsprocess)*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:197](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L197)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onBlockAdded | [LogCallbackType](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md#logcallbacktype) |

**Returns:** `void`

___
<a id="onblockadded"></a>

###  onBlockAdded

▸ **onBlockAdded**(block: *`Block`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:263](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L263)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="onblockremoved"></a>

###  onBlockRemoved

▸ **onBlockRemoved**(block: *`Block`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:301](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L301)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockHash: *`string`*, logs: *[Log](api-interfaces-augur-types-types-logs-log.md)[]*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:226](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L226)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockHash | `string` |
| logs | [Log](api-interfaces-augur-types-types-logs-log.md)[] |

**Returns:** `Promise`<`void`>

___
<a id="onnewblock"></a>

###  onNewBlock

▸ **onNewBlock**(block: *`Block`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:257](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L257)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Implementation of [BlockAndLogStreamerListenerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md).[startBlockStreamListener](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistenerinterface.md#startblockstreamlistener)*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:253](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L253)*

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(provider: *`EthersProvider`*, getEventTopics: *`function`*, parseLogs: *`function`*, getEventContractAddress: *`function`*): [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:91](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | `EthersProvider` |
| getEventTopics | `function` |
| parseLogs | `function` |
| getEventContractAddress | `function` |

**Returns:** [BlockAndLogStreamerListener](api-classes-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerlistener.md)

___

