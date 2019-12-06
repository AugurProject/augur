---
id: api-classes-augur-sdk-src-api-hotloading-hotloading
title: HotLoading
sidebar_label: HotLoading
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/HotLoading Module]](api-modules-augur-sdk-src-api-hotloading-module.md) > [HotLoading](api-classes-augur-sdk-src-api-hotloading-hotloading.md)

## Class

## Hierarchy

**HotLoading**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-hotloading-hotloading.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-hotloading-hotloading.md#augur)

### Methods

* [getCurrentDisputeWindowData](api-classes-augur-sdk-src-api-hotloading-hotloading.md#getcurrentdisputewindowdata)
* [getMarketDataParams](api-classes-augur-sdk-src-api-hotloading-hotloading.md#getmarketdataparams)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HotLoading**(augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*): [HotLoading](api-classes-augur-sdk-src-api-hotloading-hotloading.md)

*Defined in [augur-sdk/src/api/HotLoading.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/HotLoading.ts#L61)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |

**Returns:** [HotLoading](api-classes-augur-sdk-src-api-hotloading-hotloading.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/HotLoading.ts:61](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/HotLoading.ts#L61)*

___

## Methods

<a id="getcurrentdisputewindowdata"></a>

###  getCurrentDisputeWindowData

▸ **getCurrentDisputeWindowData**(params: *[GetDisputeWindowParams](api-interfaces-augur-sdk-src-api-hotloading-getdisputewindowparams.md)*): `Promise`<[DisputeWindow](api-interfaces-augur-sdk-src-api-hotloading-disputewindow.md)>

*Defined in [augur-sdk/src/api/HotLoading.ts:198](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/HotLoading.ts#L198)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetDisputeWindowParams](api-interfaces-augur-sdk-src-api-hotloading-getdisputewindowparams.md) |

**Returns:** `Promise`<[DisputeWindow](api-interfaces-augur-sdk-src-api-hotloading-disputewindow.md)>

___
<a id="getmarketdataparams"></a>

###  getMarketDataParams

▸ **getMarketDataParams**(params: *[GetMarketDataParams](api-interfaces-augur-sdk-src-api-hotloading-getmarketdataparams.md)*): `Promise`<[HotLoadMarketInfo](api-interfaces-augur-sdk-src-api-hotloading-hotloadmarketinfo.md)>

*Defined in [augur-sdk/src/api/HotLoading.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/HotLoading.ts#L67)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetMarketDataParams](api-interfaces-augur-sdk-src-api-hotloading-getmarketdataparams.md) |

**Returns:** `Promise`<[HotLoadMarketInfo](api-interfaces-augur-sdk-src-api-hotloading-hotloadmarketinfo.md)>

___

