[@augurproject/sdk](../README.md) > ["state/db/BlockAndLogStreamerListener"](../modules/_state_db_blockandlogstreamerlistener_.md) > [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)

# Interface: IBlockAndLogStreamerListener

## Hierarchy

**IBlockAndLogStreamerListener**

## Implemented by

* [BlockAndLogStreamerListener](../classes/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

## Index

### Methods

* [listenForBlockRemoved](_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md#listenforblockremoved)
* [listenForEvent](_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md#listenforevent)
* [startBlockStreamListener](_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md#startblockstreamlistener)

---

## Methods

<a id="listenforblockremoved"></a>

###  listenForBlockRemoved

▸ **listenForBlockRemoved**(callback: *`function`*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:34](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L34)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="listenforevent"></a>

###  listenForEvent

▸ **listenForEvent**(eventName: *`string`*, onLogsAdded: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*, onLogRemoved?: *[LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype)*): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:33](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |
| onLogsAdded | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |
| `Optional` onLogRemoved | [LogCallbackType](../modules/_state_db_blockandlogstreamerlistener_.md#logcallbacktype) |

**Returns:** `void`

___
<a id="startblockstreamlistener"></a>

###  startBlockStreamListener

▸ **startBlockStreamListener**(): `void`

*Defined in [state/db/BlockAndLogStreamerListener.ts:35](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L35)*

**Returns:** `void`

___

