[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/ethereum/Provider"](../modules/_augur_sdk_src_ethereum_provider_.md) › [Provider](_augur_sdk_src_ethereum_provider_.provider.md)

# Interface: Provider

## Hierarchy

* **Provider**

## Index

### Methods

* [disconnect](_augur_sdk_src_ethereum_provider_.provider.md#disconnect)
* [encodeContractFunction](_augur_sdk_src_ethereum_provider_.provider.md#encodecontractfunction)
* [getBalance](_augur_sdk_src_ethereum_provider_.provider.md#getbalance)
* [getBlock](_augur_sdk_src_ethereum_provider_.provider.md#getblock)
* [getBlockNumber](_augur_sdk_src_ethereum_provider_.provider.md#getblocknumber)
* [getEventTopic](_augur_sdk_src_ethereum_provider_.provider.md#geteventtopic)
* [getLogs](_augur_sdk_src_ethereum_provider_.provider.md#getlogs)
* [getNetworkId](_augur_sdk_src_ethereum_provider_.provider.md#getnetworkid)
* [parseLogValues](_augur_sdk_src_ethereum_provider_.provider.md#parselogvalues)
* [sendAsync](_augur_sdk_src_ethereum_provider_.provider.md#sendasync)
* [storeAbiData](_augur_sdk_src_ethereum_provider_.provider.md#storeabidata)

## Methods

###  disconnect

▸ **disconnect**(): *void*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:9](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L9)*

**Returns:** *void*

___

###  encodeContractFunction

▸ **encodeContractFunction**(`contractName`: string, `functionName`: string, `funcParams`: any[]): *string*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`contractName` | string |
`functionName` | string |
`funcParams` | any[] |

**Returns:** *string*

___

###  getBalance

▸ **getBalance**(`address`: string): *Promise‹BigNumber›*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *Promise‹BigNumber›*

___

###  getBlock

▸ **getBlock**(`blockHashOrBlockNumber`: BlockTag | string): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:13](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`blockHashOrBlockNumber` | BlockTag &#124; string |

**Returns:** *Promise‹Block›*

___

###  getBlockNumber

▸ **getBlockNumber**(): *Promise‹number›*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L12)*

**Returns:** *Promise‹number›*

___

###  getEventTopic

▸ **getEventTopic**(`contractName`: string, `eventName`: string): *string*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`contractName` | string |
`eventName` | string |

**Returns:** *string*

___

###  getLogs

▸ **getLogs**(`filter`: [Filter](_augur_types_types_logs_.filter.md)): *Promise‹[Log](_augur_types_types_logs_.log.md)[]›*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:11](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`filter` | [Filter](_augur_types_types_logs_.filter.md) |

**Returns:** *Promise‹[Log](_augur_types_types_logs_.log.md)[]›*

___

###  getNetworkId

▸ **getNetworkId**(): *Promise‹NetworkId›*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:10](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L10)*

**Returns:** *Promise‹NetworkId›*

___

###  parseLogValues

▸ **parseLogValues**(`contractName`: string, `log`: [Log](_augur_types_types_logs_.log.md)): *[LogValues](_augur_types_types_logs_.logvalues.md)*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`contractName` | string |
`log` | [Log](_augur_types_types_logs_.log.md) |

**Returns:** *[LogValues](_augur_types_types_logs_.logvalues.md)*

___

###  sendAsync

▸ **sendAsync**(`payload`: JSONRPCRequestPayload, `callback`: JSONRPCErrorCallback): *void*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`payload` | JSONRPCRequestPayload |
`callback` | JSONRPCErrorCallback |

**Returns:** *void*

___

###  storeAbiData

▸ **storeAbiData**(`abi`: Abi, `contractName`: string): *void*

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/ethereum/Provider.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`abi` | Abi |
`contractName` | string |

**Returns:** *void*
