---
id: api-interfaces-augur-sdk-src-ethereum-provider-provider
title: Provider
sidebar_label: Provider
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/ethereum/Provider Module]](api-modules-augur-sdk-src-ethereum-provider-module.md) > [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)

## Interface

## Hierarchy

**Provider**

### Methods

* [encodeContractFunction](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#encodecontractfunction)
* [getBalance](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#getbalance)
* [getBlock](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#getblock)
* [getBlockNumber](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#getblocknumber)
* [getEventTopic](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#geteventtopic)
* [getLogs](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#getlogs)
* [getNetworkId](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#getnetworkid)
* [parseLogValues](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#parselogvalues)
* [sendAsync](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#sendasync)
* [storeAbiData](api-interfaces-augur-sdk-src-ethereum-provider-provider.md#storeabidata)

---

## Methods

<a id="encodecontractfunction"></a>

###  encodeContractFunction

▸ **encodeContractFunction**(contractName: *`string`*, functionName: *`string`*, funcParams: *`any`[]*): `string`

*Defined in [augur-sdk/src/ethereum/Provider.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| functionName | `string` |
| funcParams | `any`[] |

**Returns:** `string`

___
<a id="getbalance"></a>

###  getBalance

▸ **getBalance**(address: *`string`*): `Promise`<`BigNumber`>

*Defined in [augur-sdk/src/ethereum/Provider.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `Promise`<`BigNumber`>

___
<a id="getblock"></a>

###  getBlock

▸ **getBlock**(blockHashOrBlockNumber: *`BlockTag` \| `string`*): `Promise`<`Block`>

*Defined in [augur-sdk/src/ethereum/Provider.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L12)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| blockHashOrBlockNumber | `BlockTag` \| `string` |

**Returns:** `Promise`<`Block`>

___
<a id="getblocknumber"></a>

###  getBlockNumber

▸ **getBlockNumber**(): `Promise`<`number`>

*Defined in [augur-sdk/src/ethereum/Provider.ts:11](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L11)*

**Returns:** `Promise`<`number`>

___
<a id="geteventtopic"></a>

###  getEventTopic

▸ **getEventTopic**(contractName: *`string`*, eventName: *`string`*): `string`

*Defined in [augur-sdk/src/ethereum/Provider.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| eventName | `string` |

**Returns:** `string`

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(filter: *[Filter](api-interfaces-augur-types-types-logs-filter.md)*): `Promise`<[Log](api-interfaces-augur-types-types-logs-log.md)[]>

*Defined in [augur-sdk/src/ethereum/Provider.ts:10](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | [Filter](api-interfaces-augur-types-types-logs-filter.md) |

**Returns:** `Promise`<[Log](api-interfaces-augur-types-types-logs-log.md)[]>

___
<a id="getnetworkid"></a>

###  getNetworkId

▸ **getNetworkId**(): `Promise`<`NetworkId`>

*Defined in [augur-sdk/src/ethereum/Provider.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L9)*

**Returns:** `Promise`<`NetworkId`>

___
<a id="parselogvalues"></a>

###  parseLogValues

▸ **parseLogValues**(contractName: *`string`*, log: *[Log](api-interfaces-augur-types-types-logs-log.md)*): [LogValues](api-interfaces-augur-types-types-logs-logvalues.md)

*Defined in [augur-sdk/src/ethereum/Provider.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| log | [Log](api-interfaces-augur-types-types-logs-log.md) |

**Returns:** [LogValues](api-interfaces-augur-types-types-logs-logvalues.md)

___
<a id="sendasync"></a>

###  sendAsync

▸ **sendAsync**(payload: *`JSONRPCRequestPayload`*): `Promise`<`any`>

*Defined in [augur-sdk/src/ethereum/Provider.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payload | `JSONRPCRequestPayload` |

**Returns:** `Promise`<`any`>

___
<a id="storeabidata"></a>

###  storeAbiData

▸ **storeAbiData**(abi: *`Abi`*, contractName: *`string`*): `void`

*Defined in [augur-sdk/src/ethereum/Provider.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/ethereum/Provider.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abi | `Abi` |
| contractName | `string` |

**Returns:** `void`

___

