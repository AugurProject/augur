[@augurproject/sdk](../README.md) > ["ethereum/Provider"](../modules/_ethereum_provider_.md) > [Provider](../interfaces/_ethereum_provider_.provider.md)

# Interface: Provider

## Hierarchy

**Provider**

## Index

### Methods

* [getBlockNumber](_ethereum_provider_.provider.md#getblocknumber)
* [getEventTopic](_ethereum_provider_.provider.md#geteventtopic)
* [getLogs](_ethereum_provider_.provider.md#getlogs)
* [getNetworkId](_ethereum_provider_.provider.md#getnetworkid)
* [parseLogValues](_ethereum_provider_.provider.md#parselogvalues)
* [storeAbiData](_ethereum_provider_.provider.md#storeabidata)

---

## Methods

<a id="getblocknumber"></a>

###  getBlockNumber

▸ **getBlockNumber**(): `Promise`<`number`>

*Defined in [ethereum/Provider.ts:8](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L8)*

**Returns:** `Promise`<`number`>

___
<a id="geteventtopic"></a>

###  getEventTopic

▸ **getEventTopic**(contractName: *`string`*, eventName: *`string`*): `string`

*Defined in [ethereum/Provider.ts:10](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L10)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| eventName | `string` |

**Returns:** `string`

___
<a id="getlogs"></a>

###  getLogs

▸ **getLogs**(filter: *`Filter`*): `Promise`<[Log](_state_logs_types_.log.md)[]>

*Defined in [ethereum/Provider.ts:7](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | `Filter` |

**Returns:** `Promise`<[Log](_state_logs_types_.log.md)[]>

___
<a id="getnetworkid"></a>

###  getNetworkId

▸ **getNetworkId**(): `Promise`<`NetworkId`>

*Defined in [ethereum/Provider.ts:6](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L6)*

**Returns:** `Promise`<`NetworkId`>

___
<a id="parselogvalues"></a>

###  parseLogValues

▸ **parseLogValues**(contractName: *`string`*, log: *[Log](_state_logs_types_.log.md)*): `LogValues`

*Defined in [ethereum/Provider.ts:11](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L11)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| contractName | `string` |
| log | [Log](_state_logs_types_.log.md) |

**Returns:** `LogValues`

___
<a id="storeabidata"></a>

###  storeAbiData

▸ **storeAbiData**(abi: *`Abi`*, contractName: *`string`*): `void`

*Defined in [ethereum/Provider.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/ethereum/Provider.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| abi | `Abi` |
| contractName | `string` |

**Returns:** `void`

___

