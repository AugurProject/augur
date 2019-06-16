---
id: api-modules-state-websocketendpoint-module
title: state/WebsocketEndpoint Module
sidebar_label: state/WebsocketEndpoint
---

[@augurproject/sdk](api-readme.md) > [[state/WebsocketEndpoint Module]](api-modules-state-websocketendpoint-module.md)

## Module

### Functions

* [isSafe](api-modules-state-websocketendpoint-module.md#issafe)
* [run](api-modules-state-websocketendpoint-module.md#run)
* [safePing](api-modules-state-websocketendpoint-module.md#safeping)
* [safeSend](api-modules-state-websocketendpoint-module.md#safesend)

---

## Functions

<a id="issafe"></a>

###  isSafe

▸ **isSafe**(websocket: *`WebSocket`*): `boolean`

*Defined in [state/WebsocketEndpoint.ts:18](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `boolean`

___
<a id="run"></a>

###  run

▸ **run**<`TBigNumber`>(api: *[API](api-classes-state-getter-api-api.md)*, endpointSettings: *[EndpointSettings](api-interfaces-state-getter-types-endpointsettings.md)*, controlEmitter: *`EventEmitter`*): `Promise`<`void`>

*Defined in [state/WebsocketEndpoint.ts:37](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L37)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](api-classes-state-getter-api-api.md) |
| endpointSettings | [EndpointSettings](api-interfaces-state-getter-types-endpointsettings.md) |
| controlEmitter | `EventEmitter` |

**Returns:** `Promise`<`void`>

___
<a id="safeping"></a>

###  safePing

▸ **safePing**(websocket: *`WebSocket`*): `void`

*Defined in [state/WebsocketEndpoint.ts:32](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `void`

___
<a id="safesend"></a>

###  safeSend

▸ **safeSend**(websocket: *`WebSocket`*, payload: *`string`*): `void`

*Defined in [state/WebsocketEndpoint.ts:27](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |
| payload | `string` |

**Returns:** `void`

___

