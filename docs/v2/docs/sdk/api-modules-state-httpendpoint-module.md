---
id: api-modules-state-httpendpoint-module
title: state/HTTPEndpoint Module
sidebar_label: state/HTTPEndpoint
---

[@augurproject/sdk](api-readme.md) > [[state/HTTPEndpoint Module]](api-modules-state-httpendpoint-module.md)

## Module

### Functions

* [createApp](api-modules-state-httpendpoint-module.md#createapp)
* [run](api-modules-state-httpendpoint-module.md#run)

---

## Functions

<a id="createapp"></a>

###  createApp

▸ **createApp**(api: *[API](api-classes-state-getter-api-api.md)*): `express.Application`

*Defined in [state/HTTPEndpoint.ts:14](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/HTTPEndpoint.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](api-classes-state-getter-api-api.md) |

**Returns:** `express.Application`

___
<a id="run"></a>

###  run

▸ **run**(api: *[API](api-classes-state-getter-api-api.md)*, endpointSettings: *[EndpointSettings](api-interfaces-state-getter-types-endpointsettings.md)*): `Promise`<`any`>

*Defined in [state/HTTPEndpoint.ts:47](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/HTTPEndpoint.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| api | [API](api-classes-state-getter-api-api.md) |
| endpointSettings | [EndpointSettings](api-interfaces-state-getter-types-endpointsettings.md) |

**Returns:** `Promise`<`any`>

___

