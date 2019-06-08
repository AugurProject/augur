[@augurproject/sdk](../README.md) > ["state/WebsocketEndpoint"](../modules/_state_websocketendpoint_.md)

# External module: "state/WebsocketEndpoint"

## Index

### Functions

* [isSafe](_state_websocketendpoint_.md#issafe)
* [run](_state_websocketendpoint_.md#run)
* [safePing](_state_websocketendpoint_.md#safeping)
* [safeSend](_state_websocketendpoint_.md#safesend)

---

## Functions

<a id="issafe"></a>

###  isSafe

▸ **isSafe**(websocket: *`WebSocket`*): `boolean`

*Defined in [state/WebsocketEndpoint.ts:18](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `boolean`

___
<a id="run"></a>

###  run

▸ **run**<`TBigNumber`>(api: *[API](../classes/_state_getter_api_.api.md)*, endpointSettings: *[EndpointSettings](../interfaces/_state_getter_types_.endpointsettings.md)*, controlEmitter: *`EventEmitter`*): `Promise`<`void`>

*Defined in [state/WebsocketEndpoint.ts:37](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L37)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](../classes/_state_getter_api_.api.md) |
| endpointSettings | [EndpointSettings](../interfaces/_state_getter_types_.endpointsettings.md) |
| controlEmitter | `EventEmitter` |

**Returns:** `Promise`<`void`>

___
<a id="safeping"></a>

###  safePing

▸ **safePing**(websocket: *`WebSocket`*): `void`

*Defined in [state/WebsocketEndpoint.ts:32](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `void`

___
<a id="safesend"></a>

###  safeSend

▸ **safeSend**(websocket: *`WebSocket`*, payload: *`string`*): `void`

*Defined in [state/WebsocketEndpoint.ts:27](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |
| payload | `string` |

**Returns:** `void`

___

