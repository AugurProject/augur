[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/WebsocketEndpoint"](_augur_sdk_src_state_websocketendpoint_.md)

# Module: "augur-sdk/src/state/WebsocketEndpoint"

## Index

### Functions

* [isSafe](_augur_sdk_src_state_websocketendpoint_.md#issafe)
* [runWsServer](_augur_sdk_src_state_websocketendpoint_.md#runwsserver)
* [runWssServer](_augur_sdk_src_state_websocketendpoint_.md#runwssserver)
* [safePing](_augur_sdk_src_state_websocketendpoint_.md#safeping)
* [safeSend](_augur_sdk_src_state_websocketendpoint_.md#safesend)
* [setupServer](_augur_sdk_src_state_websocketendpoint_.md#setupserver)

## Functions

###  isSafe

▸ **isSafe**(`websocket`: WebSocket): *boolean*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:108](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |

**Returns:** *boolean*

___

###  runWsServer

▸ **runWsServer**(`api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md), `app`: express.Application, `config`: SDKConfiguration): *Server*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`api` | [API](../classes/_augur_sdk_src_state_getter_api_.api.md) |
`app` | express.Application |
`config` | SDKConfiguration |

**Returns:** *Server*

___

###  runWssServer

▸ **runWssServer**(`api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md), `app`: express.Application, `config`: SDKConfiguration): *Server*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`api` | [API](../classes/_augur_sdk_src_state_getter_api_.api.md) |
`app` | express.Application |
`config` | SDKConfiguration |

**Returns:** *Server*

___

###  safePing

▸ **safePing**(`websocket`: WebSocket): *void*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:123](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |

**Returns:** *void*

___

###  safeSend

▸ **safeSend**(`websocket`: WebSocket, `payload`: string): *void*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:117](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |
`payload` | string |

**Returns:** *void*

___

###  setupServer

▸ **setupServer**(`server`: Server, `api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md)): *void*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:38](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`server` | Server |
`api` | [API](../classes/_augur_sdk_src_state_getter_api_.api.md) |

**Returns:** *void*
