[@augurproject/sdk](../README.md) > ["state/db/BlockAndLogStreamerListener"](../modules/_state_db_blockandlogstreamerlistener_.md) > [BlockAndLogStreamerListenerDependencies](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md)

# Interface: BlockAndLogStreamerListenerDependencies

## Hierarchy

**BlockAndLogStreamerListenerDependencies**

## Index

### Properties

* [address](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#address)
* [blockAndLogStreamer](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#blockandlogstreamer)
* [eventLogDBRouter](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#eventlogdbrouter)
* [getBlockByHash](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#getblockbyhash)
* [getEventTopics](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#geteventtopics)
* [listenForNewBlocks](_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md#listenfornewblocks)

---

## Properties

<a id="address"></a>

###  address

**● address**: *`string`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L18)*

___
<a id="blockandlogstreamer"></a>

###  blockAndLogStreamer

**● blockAndLogStreamer**: *[BlockAndLogStreamerInterface](_state_db_blockandlogstreamerlistener_.blockandlogstreamerinterface.md)<`Block`, `ExtendedLog`>*

*Defined in [state/db/BlockAndLogStreamerListener.ts:19](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L19)*

___
<a id="eventlogdbrouter"></a>

###  eventLogDBRouter

**● eventLogDBRouter**: *[EventLogDBRouter](../classes/_state_db_eventlogdbrouter_.eventlogdbrouter.md)*

*Defined in [state/db/BlockAndLogStreamerListener.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L21)*

___
<a id="getblockbyhash"></a>

###  getBlockByHash

**● getBlockByHash**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:20](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L20)*

#### Type declaration
▸(hashOrTag: *`string`*): `Promise`<`Block`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| hashOrTag | `string` |

**Returns:** `Promise`<`Block`>

___
<a id="geteventtopics"></a>

###  getEventTopics

**● getEventTopics**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:22](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L22)*

#### Type declaration
▸(eventName: *`string`*): `Array`<`string`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `Array`<`string`>

___
<a id="listenfornewblocks"></a>

###  listenForNewBlocks

**● listenForNewBlocks**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:24](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L24)*

#### Type declaration
▸(callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___

