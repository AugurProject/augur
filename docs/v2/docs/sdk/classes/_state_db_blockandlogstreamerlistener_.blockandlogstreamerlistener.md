[@augurproject/sdk](../README.md) > ["state/db/BlockAndLogStreamerListener"](../modules/_state_db_blockandlogstreamerlistener_.md) > [BlockAndLogStreamerListener](../classes/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

# Class: BlockAndLogStreamerListener

## Hierarchy

**BlockAndLogStreamerListener**

## Implements

* [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)

## Index

### Constructors

* [constructor](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#constructor)

### Properties

* [address](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#address)
* [deps](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#deps)

### Methods

* [listenForBlockRemoved](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#listenforevent)
* [onLogsAdded](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#onlogsadded)
* [onNewBlock](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#onnewblock)
* [startBlockStreamListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#startblockstreamlistener)
* [create](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md#create)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BlockAndLogStreamerListener**(deps: *[BlockAndLogStreamerListenerDependencies](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md)*): [BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

*Defined in [state/db/BlockAndLogStreamerListener.ts:39](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L39)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| deps | [BlockAndLogStreamerListenerDependencies](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md) |

**Returns:** [BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

___

## Properties

<a id="address"></a>

### `<Private>` address

**● address**: *`string`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:39](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L39)*

___
<a id="deps"></a>

### `<Private>` deps

**● deps**: *[BlockAndLogStreamerListenerDependencies](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:41](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L41)*

___

## Methods

<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:73](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L73)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*, onLogsRemoved?: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*): `void`

*Implementation of [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md).[listenForEvent](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md#listenforevent)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:62](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |
| `Optional` onLogsRemoved | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |

**Returns:** `void`

___
<a id="onlogsadded"></a>

###  onLogsAdded

▸ **onLogsAdded**(blockHash: *`string`*, extendedLogs: *`ExtendedLog`[]*): `Promise`<`void`>

*Defined in [state/db/BlockAndLogStreamerListener.ts:81](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L81)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:94](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `Block` |

**Returns:** `Promise`<`void`>

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Implementation of [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md).[startBlockStreamListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md#startblockstreamlistener)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:90](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L90)*

**Returns:** `void`

___
<a id="create"></a>

### `<Static>` create

▸ **create**(provider: *`EthersProvider`*, eventLogDBRouter: *[EventLogDBRouter](_state_db_eventlogdbrouter_.eventlogdbrouter.md)*, address: *`string`*, getEventTopics: *`function`*): [BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

*Defined in [state/db/BlockAndLogStreamerListener.ts:46](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | `EthersProvider` |
| eventLogDBRouter | [EventLogDBRouter](_state_db_eventlogdbrouter_.eventlogdbrouter.md) |
| address | `string` |
| getEventTopics | `function` |

**Returns:** [BlockAndLogStreamerListener](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

___

