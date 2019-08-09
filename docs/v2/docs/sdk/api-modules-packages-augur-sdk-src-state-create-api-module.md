---
id: api-modules-packages-augur-sdk-src-state-create-api-module
title: packages/augur-sdk/src/state/create-api Module
sidebar_label: packages/augur-sdk/src/state/create-api
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/create-api Module]](api-modules-packages-augur-sdk-src-state-create-api-module.md)

## Module

### Variables

* [settings](api-modules-packages-augur-sdk-src-state-create-api-module.md#settings)

### Functions

* [buildAPI](api-modules-packages-augur-sdk-src-state-create-api-module.md#buildapi)
* [buildDeps](api-modules-packages-augur-sdk-src-state-create-api-module.md#builddeps)
* [create](api-modules-packages-augur-sdk-src-state-create-api-module.md#create)

---

## Variables

<a id="settings"></a>

### `<Const>` settings

**● settings**: *`any`* =  require("./settings.json")

*Defined in [packages/augur-sdk/src/state/create-api.ts:15](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/create-api.ts#L15)*

___

## Functions

<a id="buildapi"></a>

###  buildAPI

▸ **buildAPI**(ethNodeUrl: *`string`*, account?: *`string`*, dbArgs?: *`DatabaseConfiguration`*): `Promise`<[API](api-classes-packages-augur-sdk-src-state-getter-api-api.md)>

*Defined in [packages/augur-sdk/src/state/create-api.ts:49](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/create-api.ts#L49)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<[API](api-classes-packages-augur-sdk-src-state-getter-api-api.md)>

___
<a id="builddeps"></a>

###  buildDeps

▸ **buildDeps**(ethNodeUrl: *`string`*, account?: *`string`*, dbArgs?: *`PouchDB.Configuration.DatabaseConfiguration`*): `Promise`<`object`>

*Defined in [packages/augur-sdk/src/state/create-api.ts:17](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/create-api.ts#L17)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` dbArgs | `PouchDB.Configuration.DatabaseConfiguration` |  {} |

**Returns:** `Promise`<`object`>

___
<a id="create"></a>

###  create

▸ **create**(ethNodeUrl: *`string`*, account?: *`string`*, dbArgs?: *`DatabaseConfiguration`*): `Promise`<`object`>

*Defined in [packages/augur-sdk/src/state/create-api.ts:40](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/state/create-api.ts#L40)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<`object`>

___

