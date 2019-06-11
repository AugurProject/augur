---
id: api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface
title: BlockAndLogStreamerInterface
sidebar_label: BlockAndLogStreamerInterface
---

[@augurproject/sdk](api-readme.md) > [[state/db/BlockAndLogStreamerListener Module]](api-modules-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerInterface](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)

## Interface

## Type parameters
#### TBlock :  `Block`
#### TLog :  `BlockStreamLog`
## Hierarchy

**BlockAndLogStreamerInterface**

### Properties

* [addLogFilter](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#addlogfilter)
* [reconcileNewBlock](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#reconcilenewblock)
* [subscribeToOnBlockAdded](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockadded)
* [subscribeToOnBlockRemoved](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockremoved)
* [subscribeToOnLogsAdded](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsadded)
* [subscribeToOnLogsRemoved](api-interfaces-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsremoved)

---

## Properties

<a id="addlogfilter"></a>

###  addLogFilter

**● addLogFilter**: *`function`*

*Defined in [state/db/BlockAndLogStreamerListener.ts:10](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L10)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:9](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L9)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:11](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L11)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:12](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L12)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:13](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L13)*

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

*Defined in [state/db/BlockAndLogStreamerListener.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L14)*

#### Type declaration
▸(onLogsRemoved: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsRemoved | `function` |

**Returns:** `string`

___

