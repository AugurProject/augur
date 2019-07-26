---
id: api-modules-packages-augur-sdk-src-state-websocketendpoint-module
title: packages/augur-sdk/src/state/WebsocketEndpoint Module
sidebar_label: packages/augur-sdk/src/state/WebsocketEndpoint
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/WebsocketEndpoint Module]](api-modules-packages-augur-sdk-src-state-websocketendpoint-module.md)

## Module

### Functions

* [isSafe](api-modules-packages-augur-sdk-src-state-websocketendpoint-module.md#issafe)
* [run](api-modules-packages-augur-sdk-src-state-websocketendpoint-module.md#run)
* [safePing](api-modules-packages-augur-sdk-src-state-websocketendpoint-module.md#safeping)
* [safeSend](api-modules-packages-augur-sdk-src-state-websocketendpoint-module.md#safesend)

---

## Functions

<a id="issafe"></a>

###  isSafe

▸ **isSafe**(websocket: *`WebSocket`*): `boolean`

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:18](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `boolean`

___
<a id="run"></a>

###  run

▸ **run**<`TBigNumber`>(api: *[API](api-classes-packages-augur-sdk-src-state-getter-api-api.md)*, endpointSettings: *[EndpointSettings](api-interfaces-packages-augur-sdk-src-state-getter-types-endpointsettings.md)*, controlEmitter: *`EventEmitter`*): `Promise`<`void`>

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:37](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L37)*

**Type parameters:**

#### TBigNumber 
**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](api-classes-packages-augur-sdk-src-state-getter-api-api.md) |
| endpointSettings | [EndpointSettings](api-interfaces-packages-augur-sdk-src-state-getter-types-endpointsettings.md) |
| controlEmitter | `EventEmitter` |

**Returns:** `Promise`<`void`>

___
<a id="safeping"></a>

###  safePing

▸ **safePing**(websocket: *`WebSocket`*): `void`

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:32](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L32)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |

**Returns:** `void`

___
<a id="safesend"></a>

###  safeSend

▸ **safeSend**(websocket: *`WebSocket`*, payload: *`string`*): `void`

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:27](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L27)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| websocket | `WebSocket` |
| payload | `string` |

**Returns:** `void`

___

