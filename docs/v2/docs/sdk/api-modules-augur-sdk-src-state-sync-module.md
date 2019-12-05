---
id: api-modules-augur-sdk-src-state-sync-module
title: augur-sdk/src/state/Sync Module
sidebar_label: augur-sdk/src/state/Sync
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/Sync Module]](api-modules-augur-sdk-src-state-sync-module.md)

## Module

### Functions

* [createAPIAndController](api-modules-augur-sdk-src-state-sync-module.md#createapiandcontroller)
* [start](api-modules-augur-sdk-src-state-sync-module.md#start)

---

## Functions

<a id="createapiandcontroller"></a>

###  createAPIAndController

▸ **createAPIAndController**(ethNodeUrl: *`string`*, account?: *`string`*, enableFlexSearch?: *`boolean`*): `Promise`<`object`>

*Defined in [augur-sdk/src/state/Sync.ts:5](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Sync.ts#L5)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` enableFlexSearch | `boolean` | false |

**Returns:** `Promise`<`object`>

___
<a id="start"></a>

###  start

▸ **start**(ethNodeUrl: *`string`*, account?: *`string`*, enableFlexSearch?: *`boolean`*): `Promise`<[API](api-classes-augur-sdk-src-state-getter-api-api.md)>

*Defined in [augur-sdk/src/state/Sync.ts:9](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/Sync.ts#L9)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` enableFlexSearch | `boolean` | false |

**Returns:** `Promise`<[API](api-classes-augur-sdk-src-state-getter-api-api.md)>

___

