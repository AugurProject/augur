[@augurproject/sdk](../README.md) > ["state/db/BlockAndLogStreamerListener"](../modules/_state_db_blockandlogstreamerlistener_.md)

# External module: "state/db/BlockAndLogStreamerListener"

## Index

### Classes

* [BlockAndLogStreamerListener](../classes/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistener.md)

### Interfaces

* [BlockAndLogStreamerInterface](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerinterface.md)
* [BlockAndLogStreamerListenerDependencies](../interfaces/_state_db_blockandlogstreamerlistener_.blockandlogstreamerlistenerdependencies.md)
* [IBlockAndLogStreamerListener](../interfaces/_state_db_blockandlogstreamerlistener_.iblockandlogstreamerlistener.md)

### Type aliases

* [BlockstreamLogCallbackType](_state_db_blockandlogstreamerlistener_.md#blockstreamlogcallbacktype)
* [GenericLogCallbackType](_state_db_blockandlogstreamerlistener_.md#genericlogcallbacktype)
* [LogCallbackType](_state_db_blockandlogstreamerlistener_.md#logcallbacktype)

---

## Type aliases

<a id="blockstreamlogcallbacktype"></a>

###  BlockstreamLogCallbackType

**Ƭ BlockstreamLogCallbackType**: *[GenericLogCallbackType](_state_db_blockandlogstreamerlistener_.md#genericlogcallbacktype)<`string`, [Log](../interfaces/_state_logs_types_.log.md)>*

*Defined in [state/db/BlockAndLogStreamerListener.ts:29](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L29)*

___
<a id="genericlogcallbacktype"></a>

###  GenericLogCallbackType

**Ƭ GenericLogCallbackType**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L27)*

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

**Ƭ LogCallbackType**: *[GenericLogCallbackType](_state_db_blockandlogstreamerlistener_.md#genericlogcallbacktype)<`number`, `ParsedLog`>*

*Defined in [state/db/BlockAndLogStreamerListener.ts:30](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L30)*

___

