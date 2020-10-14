[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/state/create-api"](_augur_sdk_src_state_create_api_.md)

# Module: "augur-sdk/src/state/create-api"

## Index

### Functions

* [buildSyncStrategies](_augur_sdk_src_state_create_api_.md#buildsyncstrategies)
* [createClient](_augur_sdk_src_state_create_api_.md#createclient)
* [createServer](_augur_sdk_src_state_create_api_.md#createserver)
* [startServer](_augur_sdk_src_state_create_api_.md#startserver)
* [startServerFromClient](_augur_sdk_src_state_create_api_.md#startserverfromclient)

## Functions

###  buildSyncStrategies

▸ **buildSyncStrategies**(`client`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](../classes/_augur_sdk_src_state_db_db_.db.md)›, `provider`: EthersProvider, `logFilterAggregator`: [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md), `config`: SDKConfiguration): *Promise‹(Anonymous function)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:21](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/create-api.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](../classes/_augur_sdk_src_state_db_db_.db.md)› |
`provider` | EthersProvider |
`logFilterAggregator` | [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md) |
`config` | SDKConfiguration |

**Returns:** *Promise‹(Anonymous function)›*

___

###  createClient

▸ **createClient**(`config`: SDKConfiguration, `connector`: [BaseConnector](../classes/_augur_sdk_src_connector_base_connector_.baseconnector.md), `signer?`: EthersSigner, `provider?`: EthersProvider, `enableFlexSearch`: boolean, `createBrowserMesh?`: function): *Promise‹[Augur](../classes/_augur_sdk_src_augur_.augur.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:98](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/create-api.ts#L98)*

**Parameters:**

▪ **config**: *SDKConfiguration*

▪ **connector**: *[BaseConnector](../classes/_augur_sdk_src_connector_base_connector_.baseconnector.md)*

▪`Optional`  **signer**: *EthersSigner*

▪`Optional`  **provider**: *EthersProvider*

▪`Default value`  **enableFlexSearch**: *boolean*= false

▪`Optional`  **createBrowserMesh**: *function*

▸ (`config`: SDKConfiguration, `web3Provider`: SupportedProvider, `zeroX`: [ZeroX](../classes/_augur_sdk_src_api_zerox_.zerox.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`web3Provider` | SupportedProvider |
`zeroX` | [ZeroX](../classes/_augur_sdk_src_api_zerox_.zerox.md) |

**Returns:** *Promise‹[Augur](../classes/_augur_sdk_src_augur_.augur.md)›*

___

###  createServer

▸ **createServer**(`config`: SDKConfiguration, `client?`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹object›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:157](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/create-api.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`client?` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹object›*

___

###  startServer

▸ **startServer**(`config`: SDKConfiguration): *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:249](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/create-api.ts#L249)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |

**Returns:** *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

___

###  startServerFromClient

▸ **startServerFromClient**(`config`: SDKConfiguration, `client?`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:234](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/state/create-api.ts#L234)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`client?` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*
