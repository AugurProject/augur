---
id: api-modules-augur-sdk-src-state-create-api-module
title: augur-sdk/src/state/create-api Module
sidebar_label: augur-sdk/src/state/create-api
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/create-api Module]](api-modules-augur-sdk-src-state-create-api-module.md)

## Module

### Variables

* [settings](api-modules-augur-sdk-src-state-create-api-module.md#settings)

### Functions

* [buildAPI](api-modules-augur-sdk-src-state-create-api-module.md#buildapi)
* [buildDeps](api-modules-augur-sdk-src-state-create-api-module.md#builddeps)
* [create](api-modules-augur-sdk-src-state-create-api-module.md#create)

---

## Variables

<a id="settings"></a>

### `<Const>` settings

**● settings**: *`any`* =  require('./settings.json')

*Defined in [augur-sdk/src/state/create-api.ts:13](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/create-api.ts#L13)*

___

## Functions

<a id="buildapi"></a>

###  buildAPI

▸ **buildAPI**(ethNodeUrl: *`string`*, account?: *`string`*, enableFlexSearch?: *`boolean`*): `Promise`<[API](api-classes-augur-sdk-src-state-getter-api-api.md)>

*Defined in [augur-sdk/src/state/create-api.ts:43](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/create-api.ts#L43)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` enableFlexSearch | `boolean` | false |

**Returns:** `Promise`<[API](api-classes-augur-sdk-src-state-getter-api-api.md)>

___
<a id="builddeps"></a>

###  buildDeps

▸ **buildDeps**(ethNodeUrl: *`string`*, account?: *`string`*, enableFlexSearch?: *`boolean`*): `Promise`<`object`>

*Defined in [augur-sdk/src/state/create-api.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/create-api.ts#L15)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` enableFlexSearch | `boolean` | false |

**Returns:** `Promise`<`object`>

___
<a id="create"></a>

###  create

▸ **create**(ethNodeUrl: *`string`*, account?: *`string`*, enableFlexSearch?: *`boolean`*): `Promise`<`object`>

*Defined in [augur-sdk/src/state/create-api.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/create-api.ts#L34)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` enableFlexSearch | `boolean` | false |

**Returns:** `Promise`<`object`>

___

