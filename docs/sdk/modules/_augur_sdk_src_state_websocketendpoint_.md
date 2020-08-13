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

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:166](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L166)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |

**Returns:** *boolean*

___

###  runWsServer

▸ **runWsServer**(`api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md), `app`: express.Application, `config`: SDKConfiguration): *Server*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L16)*

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

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L30)*

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

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:181](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L181)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |

**Returns:** *void*

___

###  safeSend

▸ **safeSend**(`websocket`: WebSocket, `payload`: string): *void*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:175](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L175)*

**Parameters:**

Name | Type |
------ | ------ |
`websocket` | WebSocket |
`payload` | string |

**Returns:** *void*

___

###  setupServer

▸ **setupServer**(`server`: Server, `api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md)): *void*

*Defined in [packages/augur-sdk/src/state/WebsocketEndpoint.ts:45](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/WebsocketEndpoint.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`server` | Server |
`api` | [API](../classes/_augur_sdk_src_state_getter_api_.api.md) |

**Returns:** *void*
