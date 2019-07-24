---
id: api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface
title: BlockAndLogStreamerInterface
sidebar_label: BlockAndLogStreamerInterface
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerInterface](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)

## Interface

## Type parameters
#### TBlock :  `Block`
#### TLog :  `BlockStreamLog`
## Hierarchy

**BlockAndLogStreamerInterface**

### Properties

* [addLogFilter](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#addlogfilter)
* [reconcileNewBlock](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#reconcilenewblock)
* [subscribeToOnBlockAdded](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockadded)
* [subscribeToOnBlockRemoved](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockremoved)
* [subscribeToOnLogsAdded](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsadded)
* [subscribeToOnLogsRemoved](api-interfaces-packages-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsremoved)

---

## Properties

<a id="addlogfilter"></a>

###  addLogFilter

**● addLogFilter**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:10](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L10)*

#### Type declaration
▸(filter: *`Filter`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| filter | `Filter` |

**Returns:** `string`

___
<a id="reconcilenewblock"></a>

###  reconcileNewBlock

**● reconcileNewBlock**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:9](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L9)*

#### Type declaration
▸(block: *`TBlock`*): `Promise`<`void`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| block | `TBlock` |

**Returns:** `Promise`<`void`>

___
<a id="subscribetoonblockadded"></a>

###  subscribeToOnBlockAdded

**● subscribeToOnBlockAdded**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:11](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L11)*

#### Type declaration
▸(onBlockAdded: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onBlockAdded | `function` |

**Returns:** `string`

___
<a id="subscribetoonblockremoved"></a>

###  subscribeToOnBlockRemoved

**● subscribeToOnBlockRemoved**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:12](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L12)*

#### Type declaration
▸(onBlockRemoved: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onBlockRemoved | `function` |

**Returns:** `string`

___
<a id="subscribetoonlogsadded"></a>

###  subscribeToOnLogsAdded

**● subscribeToOnLogsAdded**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:13](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L13)*

#### Type declaration
▸(onLogsAdded: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsAdded | `function` |

**Returns:** `string`

___
<a id="subscribetoonlogsremoved"></a>

###  subscribeToOnLogsRemoved

**● subscribeToOnLogsRemoved**: *`function`*

*Defined in [packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:14](https://github.com/AugurProject/augur/blob/b4365d6894/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L14)*

#### Type declaration
▸(onLogsRemoved: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsRemoved | `function` |

**Returns:** `string`

___

