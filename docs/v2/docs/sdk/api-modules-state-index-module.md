---
id: api-modules-state-index-module
title: state/index Module
sidebar_label: state/index
---

[@augurproject/sdk](api-readme.md) > [[state/index Module]](api-modules-state-index-module.md)

## Module

### Variables

* [settings](api-modules-state-index-module.md#settings)

### Functions

* [buildAPI](api-modules-state-index-module.md#buildapi)
* [buildDeps](api-modules-state-index-module.md#builddeps)
* [create](api-modules-state-index-module.md#create)

---

## Variables

<a id="settings"></a>

### `<Const>` settings

**● settings**: *`any`* =  require("./settings.json")

*Defined in [state/index.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/index.ts#L14)*

___

## Functions

<a id="buildapi"></a>

###  buildAPI

▸ **buildAPI**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*, dbArgs?: *`DatabaseConfiguration`*): `Promise`<[API](api-classes-state-getter-api-api.md)>

*Defined in [state/index.ts:49](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/index.ts#L49)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `undefined` \| `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<[API](api-classes-state-getter-api-api.md)>

___
<a id="builddeps"></a>

###  buildDeps

▸ **buildDeps**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*, dbArgs?: *`PouchDB.Configuration.DatabaseConfiguration`*): `Promise`<`object`>

*Defined in [state/index.ts:17](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/index.ts#L17)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `undefined` \| `string` | - |
| `Default value` dbArgs | `PouchDB.Configuration.DatabaseConfiguration` |  {} |

**Returns:** `Promise`<`object`>

___
<a id="create"></a>

###  create

▸ **create**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*, dbArgs?: *`DatabaseConfiguration`*): `Promise`<`object`>

*Defined in [state/index.ts:40](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/index.ts#L40)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `undefined` \| `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<`object`>

___

