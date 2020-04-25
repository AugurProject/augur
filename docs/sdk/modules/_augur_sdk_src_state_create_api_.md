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

▸ **buildSyncStrategies**(`client`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `db`: Promise‹[DB](../classes/_augur_sdk_src_state_db_db_.db.md)›, `provider`: EthersProvider, `logFilterAggregator`: [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md), `config`: SDKConfiguration): *(Anonymous function)*

*Defined in [packages/augur-sdk/src/state/create-api.ts:24](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/create-api.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`client` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`db` | Promise‹[DB](../classes/_augur_sdk_src_state_db_db_.db.md)› |
`provider` | EthersProvider |
`logFilterAggregator` | [LogFilterAggregator](../classes/_augur_sdk_src_state_logs_logfilteraggregator_.logfilteraggregator.md) |
`config` | SDKConfiguration |

**Returns:** *(Anonymous function)*

___

###  createClient

▸ **createClient**(`config`: SDKConfiguration, `connector`: [BaseConnector](../classes/_augur_sdk_src_connector_base_connector_.baseconnector.md), `account?`: string, `signer?`: EthersSigner, `provider?`: EthersProvider, `enableFlexSearch`: boolean, `createBrowserMesh?`: function): *Promise‹[Augur](../classes/_augur_sdk_src_augur_.augur.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:85](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/create-api.ts#L85)*

**Parameters:**

▪ **config**: *SDKConfiguration*

▪ **connector**: *[BaseConnector](../classes/_augur_sdk_src_connector_base_connector_.baseconnector.md)*

▪`Optional`  **account**: *string*

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

▸ **createServer**(`config`: SDKConfiguration, `client?`: [Augur](../classes/_augur_sdk_src_augur_.augur.md), `account?`: string): *Promise‹object›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:148](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/create-api.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`client?` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |
`account?` | string |

**Returns:** *Promise‹object›*

___

###  startServer

▸ **startServer**(`config`: SDKConfiguration, `account?`: string): *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:227](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/create-api.ts#L227)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`account?` | string |

**Returns:** *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

___

###  startServerFromClient

▸ **startServerFromClient**(`config`: SDKConfiguration, `client?`: [Augur](../classes/_augur_sdk_src_augur_.augur.md)): *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*

*Defined in [packages/augur-sdk/src/state/create-api.ts:212](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/state/create-api.ts#L212)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | SDKConfiguration |
`client?` | [Augur](../classes/_augur_sdk_src_augur_.augur.md) |

**Returns:** *Promise‹[API](../classes/_augur_sdk_src_state_getter_api_.api.md)›*
