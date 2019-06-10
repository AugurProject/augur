---
id: api-interfaces-ethereum-provider-provider
title: Provider
sidebar_label: Provider
---

[@augurproject/sdk](api-readme.md) > [[ethereum/Provider Module]](api-modules-ethereum-provider-module.md) > [Provider](api-interfaces-ethereum-provider-provider.md)

## Interface

## Hierarchy

**Provider**

### Methods

* [getBlockNumber](api-interfaces-ethereum-provider-provider.md#getblocknumber)
* [getEventTopic](api-interfaces-ethereum-provider-provider.md#geteventtopic)
* [getLogs](api-interfaces-ethereum-provider-provider.md#getlogs)
* [getNetworkId](api-interfaces-ethereum-provider-provider.md#getnetworkid)
* [parseLogValues](api-interfaces-ethereum-provider-provider.md#parselogvalues)
* [storeAbiData](api-interfaces-ethereum-provider-provider.md#storeabidata)

---

## Methods

<a id="getblocknumber"></a>

###  getBlockNumber

▸ **getBlockNumber**(): `Promise`<`number`>

*Defined in [ethereum/Provider.ts:8](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L8)*

**Returns:** `Promise`<`number`>

___
<a id="geteventtopic"></a>

###  getEventTopic

▸ **getEventTopic**(contractName: *`string`*, eventName: *`string`*): `string`

*Defined in [ethereum/Provider.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| eventName | `string` |

**Returns:** `string`

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(filter: *`Filter`*): `Promise`<[Log](api-interfaces-state-logs-types-log.md)[]>

*Defined in [ethereum/Provider.ts:7](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | `Filter` |

**Returns:** `Promise`<[Log](api-interfaces-state-logs-types-log.md)[]>

___
<a id="getnetworkid"></a>

###  getNetworkId

▸ **getNetworkId**(): `Promise`<`NetworkId`>

*Defined in [ethereum/Provider.ts:6](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L6)*

**Returns:** `Promise`<`NetworkId`>

___
<a id="parselogvalues"></a>

###  parseLogValues

▸ **parseLogValues**(contractName: *`string`*, log: *[Log](api-interfaces-state-logs-types-log.md)*): `LogValues`

*Defined in [ethereum/Provider.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| log | [Log](api-interfaces-state-logs-types-log.md) |

**Returns:** `LogValues`

___
<a id="storeabidata"></a>

###  storeAbiData

▸ **storeAbiData**(abi: *`Abi`*, contractName: *`string`*): `void`

*Defined in [ethereum/Provider.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/ethereum/Provider.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abi | `Abi` |
| contractName | `string` |

**Returns:** `void`

___

