---
id: api-interfaces-augur-sdk-src-api-zerox-browsermesh
title: BrowserMesh
sidebar_label: BrowserMesh
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/ZeroX Module]](api-modules-augur-sdk-src-api-zerox-module.md) > [BrowserMesh](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md)

## Interface

## Hierarchy

**BrowserMesh**

### Methods

* [addOrdersAsync](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md#addordersasync)
* [onError](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md#onerror)
* [onOrderEvents](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md#onorderevents)
* [startAsync](api-interfaces-augur-sdk-src-api-zerox-browsermesh.md#startasync)

---

## Methods

<a id="addordersasync"></a>

###  addOrdersAsync

▸ **addOrdersAsync**(orders: *`SignedOrder`[]*): `Promise`<`ValidationResults`>

*Defined in [augur-sdk/src/api/ZeroX.ts:59](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| orders | `SignedOrder`[] |

**Returns:** `Promise`<`ValidationResults`>

___
<a id="onerror"></a>

###  onError

▸ **onError**(handler: *`function`*): `void`

*Defined in [augur-sdk/src/api/ZeroX.ts:57](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L57)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| handler | `function` |

**Returns:** `void`

___
<a id="onorderevents"></a>

###  onOrderEvents

▸ **onOrderEvents**(handler: *`function`*): `void`

*Defined in [augur-sdk/src/api/ZeroX.ts:58](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L58)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| handler | `function` |

**Returns:** `void`

___
<a id="startasync"></a>

###  startAsync

▸ **startAsync**(): `Promise`<`void`>

*Defined in [augur-sdk/src/api/ZeroX.ts:56](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L56)*

**Returns:** `Promise`<`void`>

___

