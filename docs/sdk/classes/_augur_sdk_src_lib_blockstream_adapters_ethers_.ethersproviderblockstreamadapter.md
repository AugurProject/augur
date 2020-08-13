[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/lib/blockstream-adapters/ethers"](../modules/_augur_sdk_src_lib_blockstream_adapters_ethers_.md) › [EthersProviderBlockStreamAdapter](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md)

# Class: EthersProviderBlockStreamAdapter

## Hierarchy

* **EthersProviderBlockStreamAdapter**

## Implements

* [BlockAndLogStreamerDependencies](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md)‹[ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md), Block›

## Index

### Constructors

* [constructor](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#constructor)

### Properties

* [provider](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#private-provider)

### Methods

* [getBlockByHash](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#getblockbyhash)
* [getBlockByHashOrTag](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#getblockbyhashortag)
* [getBlockByNumber](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#getblockbynumber)
* [getLogs](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#getlogs)
* [onNewBlock](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#private-onnewblock)
* [startPollingForBlocks](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md#startpollingforblocks)

## Constructors

###  constructor

\+ **new EthersProviderBlockStreamAdapter**(`provider`: EthersProvider): *[EthersProviderBlockStreamAdapter](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md)*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:8](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | EthersProvider |

**Returns:** *[EthersProviderBlockStreamAdapter](_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md)*

## Properties

### `Private` provider

• **provider**: *EthersProvider*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:9](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L9)*

## Methods

###  getBlockByHash

▸ **getBlockByHash**(`hashOrTag`: string): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:30](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`hashOrTag` | string |

**Returns:** *Promise‹Block›*

___

###  getBlockByHashOrTag

▸ **getBlockByHashOrTag**(`hashOrTag`: string): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`hashOrTag` | string |

**Returns:** *Promise‹Block›*

___

###  getBlockByNumber

▸ **getBlockByNumber**(`hashOrTag`: string): *Promise‹Block›*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:27](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`hashOrTag` | string |

**Returns:** *Promise‹Block›*

___

###  getLogs

▸ **getLogs**(`filterOptions`: FilterOptions): *Promise‹[ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md)[]›*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:43](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`filterOptions` | FilterOptions |

**Returns:** *Promise‹[ExtendedLog](../interfaces/_augur_sdk_src_lib_blockstream_adapters_index_.extendedlog.md)[]›*

___

### `Private` onNewBlock

▸ **onNewBlock**(`reconcileNewBlock`: function): *(Anonymous function)*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:11](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L11)*

**Parameters:**

▪ **reconcileNewBlock**: *function*

▸ (`block`: Block): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *(Anonymous function)*

___

###  startPollingForBlocks

▸ **startPollingForBlocks**(`reconcileNewBlock`: function): *void*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts:20](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/ethers.ts#L20)*

**Parameters:**

▪ **reconcileNewBlock**: *function*

▸ (`block`: Block): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | Block |

**Returns:** *void*
