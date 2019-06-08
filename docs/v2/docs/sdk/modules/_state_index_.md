[@augurproject/sdk](../README.md) > ["state/index"](../modules/_state_index_.md)

# External module: "state/index"

## Index

### Variables

* [settings](_state_index_.md#settings)

### Functions

* [buildAPI](_state_index_.md#buildapi)
* [buildDeps](_state_index_.md#builddeps)
* [create](_state_index_.md#create)

---

## Variables

<a id="settings"></a>

### `<Const>` settings

**● settings**: *`any`* =  require("./settings.json")

*Defined in [state/index.ts:14](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/index.ts#L14)*

___

## Functions

<a id="buildapi"></a>

###  buildAPI

▸ **buildAPI**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*, dbArgs?: *`DatabaseConfiguration`*): `Promise`<[API](../classes/_state_getter_api_.api.md)>

*Defined in [state/index.ts:49](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/index.ts#L49)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `undefined` \| `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<[API](../classes/_state_getter_api_.api.md)>

___
<a id="builddeps"></a>

###  buildDeps

▸ **buildDeps**(ethNodeUrl: *`string`*, account?: *`undefined` \| `string`*, dbArgs?: *`PouchDB.Configuration.DatabaseConfiguration`*): `Promise`<`object`>

*Defined in [state/index.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/index.ts#L17)*

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

*Defined in [state/index.ts:40](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/state/index.ts#L40)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| ethNodeUrl | `string` | - |
| `Optional` account | `undefined` \| `string` | - |
| `Default value` dbArgs | `DatabaseConfiguration` |  {} |

**Returns:** `Promise`<`object`>

___

