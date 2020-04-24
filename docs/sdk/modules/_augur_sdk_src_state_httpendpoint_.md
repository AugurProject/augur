[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/HTTPEndpoint"](_augur_sdk_src_state_httpendpoint_.md)

# Module: "augur-sdk/src/state/HTTPEndpoint"

## Index

### Functions

* [createApp](_augur_sdk_src_state_httpendpoint_.md#createapp)
* [runHttpServer](_augur_sdk_src_state_httpendpoint_.md#runhttpserver)
* [runHttpsServer](_augur_sdk_src_state_httpendpoint_.md#runhttpsserver)

## Functions

###  createApp

▸ **createApp**(`api`: [API](../classes/_augur_sdk_src_state_getter_api_.api.md)): *express.Application*

*Defined in [packages/augur-sdk/src/state/HTTPEndpoint.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/HTTPEndpoint.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`api` | [API](../classes/_augur_sdk_src_state_getter_api_.api.md) |

**Returns:** *express.Application*

___

###  runHttpServer

▸ **runHttpServer**(`app`: express.Application, `config`: SDKConfiguration): *Server*

*Defined in [packages/augur-sdk/src/state/HTTPEndpoint.ts:47](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/HTTPEndpoint.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`app` | express.Application |
`config` | SDKConfiguration |

**Returns:** *Server*

___

###  runHttpsServer

▸ **runHttpsServer**(`app`: express.Application, `config`: SDKConfiguration): *Server*

*Defined in [packages/augur-sdk/src/state/HTTPEndpoint.ts:54](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/HTTPEndpoint.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`app` | express.Application |
`config` | SDKConfiguration |

**Returns:** *Server*
