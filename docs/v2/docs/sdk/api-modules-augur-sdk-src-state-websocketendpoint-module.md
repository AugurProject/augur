---
id: api-modules-augur-sdk-src-state-websocketendpoint-module
title: augur-sdk/src/state/WebsocketEndpoint Module
sidebar_label: augur-sdk/src/state/WebsocketEndpoint
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/WebsocketEndpoint Module]](api-modules-augur-sdk-src-state-websocketendpoint-module.md)

## Module

### Functions

* [isSafe](api-modules-augur-sdk-src-state-websocketendpoint-module.md#issafe)
* [run](api-modules-augur-sdk-src-state-websocketendpoint-module.md#run)
* [safePing](api-modules-augur-sdk-src-state-websocketendpoint-module.md#safeping)
* [safeSend](api-modules-augur-sdk-src-state-websocketendpoint-module.md#safesend)

---

## Functions

<a id="issafe"></a>

###  isSafe

▸ **isSafe**(websocket: *`WebSocket`*): `boolean`

*Defined in [augur-sdk/src/state/WebsocketEndpoint.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `boolean`

___
<a id="run"></a>

###  run

▸ **run**<`TBigNumber`>(api: *[API](api-classes-augur-sdk-src-state-getter-api-api.md)*, endpointSettings: *[EndpointSettings](api-interfaces-augur-sdk-src-state-getter-types-endpointsettings.md)*, controlEmitter: *`EventEmitter`*): `Promise`<`void`>

*Defined in [augur-sdk/src/state/WebsocketEndpoint.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L37)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](api-classes-augur-sdk-src-state-getter-api-api.md) |
| endpointSettings | [EndpointSettings](api-interfaces-augur-sdk-src-state-getter-types-endpointsettings.md) |
| controlEmitter | `EventEmitter` |

**Returns:** `Promise`<`void`>

___
<a id="safeping"></a>

###  safePing

▸ **safePing**(websocket: *`WebSocket`*): `void`

*Defined in [augur-sdk/src/state/WebsocketEndpoint.ts:31](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L31)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `void`

___
<a id="safesend"></a>

###  safeSend

▸ **safeSend**(websocket: *`WebSocket`*, payload: *`string`*): `void`

*Defined in [augur-sdk/src/state/WebsocketEndpoint.ts:25](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |
| payload | `string` |

**Returns:** `void`

___

