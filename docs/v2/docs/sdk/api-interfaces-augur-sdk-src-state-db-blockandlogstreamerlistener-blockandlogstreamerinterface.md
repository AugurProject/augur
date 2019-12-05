---
id: api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface
title: BlockAndLogStreamerInterface
sidebar_label: BlockAndLogStreamerInterface
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/db/BlockAndLogStreamerListener Module]](api-modules-augur-sdk-src-state-db-blockandlogstreamerlistener-module.md) > [BlockAndLogStreamerInterface](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md)

## Interface

## Type parameters
#### TBlock :  `Block`
#### TLog :  `BlockStreamLog`
## Hierarchy

**BlockAndLogStreamerInterface**

### Properties

* [reconcileNewBlock](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#reconcilenewblock)
* [subscribeToOnBlockAdded](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockadded)
* [subscribeToOnBlockRemoved](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonblockremoved)
* [subscribeToOnLogsAdded](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsadded)
* [subscribeToOnLogsRemoved](api-interfaces-augur-sdk-src-state-db-blockandlogstreamerlistener-blockandlogstreamerinterface.md#subscribetoonlogsremoved)

---

## Properties

<a id="reconcilenewblock"></a>

###  reconcileNewBlock

**● reconcileNewBlock**: *`function`*

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:28](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L28)*

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

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:29](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L29)*

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

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:30](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L30)*

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

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:33](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L33)*

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

*Defined in [augur-sdk/src/state/db/BlockAndLogStreamerListener.ts:36](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/db/BlockAndLogStreamerListener.ts#L36)*

#### Type declaration
▸(onLogsRemoved: *`function`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| onLogsRemoved | `function` |

**Returns:** `string`

___

