[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/lib/blockstream-adapters/index"](../modules/_augur_sdk_src_lib_blockstream_adapters_index_.md) › [BlockAndLogStreamerDependencies](_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md)

# Interface: BlockAndLogStreamerDependencies ‹**T, B**›

## Type parameters

▪ **T**: *Log*

▪ **B**: *Block*

## Hierarchy

* **BlockAndLogStreamerDependencies**

## Implemented by

* [EthersProviderBlockStreamAdapter](../classes/_augur_sdk_src_lib_blockstream_adapters_ethers_.ethersproviderblockstreamadapter.md)

## Index

### Properties

* [getBlockByHash](_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md#getblockbyhash)
* [getBlockByNumber](_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md#getblockbynumber)
* [getLogs](_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md#getlogs)
* [startPollingForBlocks](_augur_sdk_src_lib_blockstream_adapters_index_.blockandlogstreamerdependencies.md#startpollingforblocks)

## Properties

###  getBlockByHash

• **getBlockByHash**: *[GetBlockByString](../modules/_augur_sdk_src_lib_blockstream_adapters_index_.md#getblockbystring)*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/index.ts:17](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/index.ts#L17)*

___

###  getBlockByNumber

• **getBlockByNumber**: *[GetBlockByString](../modules/_augur_sdk_src_lib_blockstream_adapters_index_.md#getblockbystring)*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/index.ts:16](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/index.ts#L16)*

___

###  getLogs

• **getLogs**: *function*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/index.ts:18](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/index.ts#L18)*

#### Type declaration:

▸ (`filterOptions`: FilterOptions): *Promise‹T[]›*

**Parameters:**

Name | Type |
------ | ------ |
`filterOptions` | FilterOptions |

___

###  startPollingForBlocks

• **startPollingForBlocks**: *function*

*Defined in [packages/augur-sdk/src/lib/blockstream-adapters/index.ts:19](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/lib/blockstream-adapters/index.ts#L19)*

#### Type declaration:

▸ (`reconcileNewBlock`: function): *void*

**Parameters:**

▪ **reconcileNewBlock**: *function*

▸ (`block`: B): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`block` | B |
