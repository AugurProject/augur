---
id: api-interfaces-packages-augur-sdk-src-ethereum-provider-provider
title: Provider
sidebar_label: Provider
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/ethereum/Provider Module]](api-modules-packages-augur-sdk-src-ethereum-provider-module.md) > [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)

## Interface

## Hierarchy

**Provider**

### Methods

* [getBalance](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#getbalance)
* [getBlock](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#getblock)
* [getBlockNumber](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#getblocknumber)
* [getEventTopic](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#geteventtopic)
* [getLogs](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#getlogs)
* [getNetworkId](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#getnetworkid)
* [parseLogValues](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#parselogvalues)
* [storeAbiData](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md#storeabidata)

---

## Methods

<a id="getbalance"></a>

###  getBalance

▸ **getBalance**(address: *`string`*): `Promise`<`BigNumber`>

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:15](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getblock"></a>

###  getBlock

▸ **getBlock**(blockHashOrBlockNumber: *`BlockTag` \| `string`*): `Promise`<`Block`>

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:11](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockHashOrBlockNumber | `BlockTag` \| `string` |

**Returns:** `Promise`<`Block`>

___
<a id="getblocknumber"></a>

###  getBlockNumber

▸ **getBlockNumber**(): `Promise`<`number`>

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:10](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L10)*

**Returns:** `Promise`<`number`>

___
<a id="geteventtopic"></a>

###  getEventTopic

▸ **getEventTopic**(contractName: *`string`*, eventName: *`string`*): `string`

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:13](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| eventName | `string` |

**Returns:** `string`

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(filter: *[Filter](api-interfaces-node-modules--augurproject-types-types-logs-filter.md)*): `Promise`<[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)[]>

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:9](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | [Filter](api-interfaces-node-modules--augurproject-types-types-logs-filter.md) |

**Returns:** `Promise`<[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)[]>

___
<a id="getnetworkid"></a>

###  getNetworkId

▸ **getNetworkId**(): `Promise`<`NetworkId`>

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:8](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L8)*

**Returns:** `Promise`<`NetworkId`>

___
<a id="parselogvalues"></a>

###  parseLogValues

▸ **parseLogValues**(contractName: *`string`*, log: *[Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md)*): [LogValues](api-interfaces-node-modules--augurproject-types-types-logs-logvalues.md)

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:14](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| log | [Log](api-interfaces-node-modules--augurproject-types-types-logs-log.md) |

**Returns:** [LogValues](api-interfaces-node-modules--augurproject-types-types-logs-logvalues.md)

___
<a id="storeabidata"></a>

###  storeAbiData

▸ **storeAbiData**(abi: *`Abi`*, contractName: *`string`*): `void`

*Defined in [packages/augur-sdk/src/ethereum/Provider.ts:12](https://github.com/AugurProject/augur/blob/bae2172ca0/packages/augur-sdk/src/ethereum/Provider.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abi | `Abi` |
| contractName | `string` |

**Returns:** `void`

___

