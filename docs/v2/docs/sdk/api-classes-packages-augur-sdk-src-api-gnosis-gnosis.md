---
id: api-classes-packages-augur-sdk-src-api-gnosis-gnosis
title: Gnosis
sidebar_label: Gnosis
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Gnosis Module]](api-modules-packages-augur-sdk-src-api-gnosis-module.md) > [Gnosis](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md)

## Class

## Hierarchy

**Gnosis**

### Constructors

* [constructor](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#constructor)

### Properties

* [augur](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#augur)
* [gnosisRelay](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#gnosisrelay)
* [provider](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#provider)

### Methods

* [createGnosisSafeDirectlyWithETH](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#creategnosissafedirectlywitheth)
* [createGnosisSafeViaRelay](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#creategnosissafeviarelay)
* [getGnosisSafeAddress](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#getgnosissafeaddress)
* [getGnosisSafeDeploymentStatusViaRelay](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md#getgnosissafedeploymentstatusviarelay)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Gnosis**(provider: *[Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)*, gnosisRelay: *`IGnosisRelayAPI`*, augur: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*): [Gnosis](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md)

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:33](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md) |
| gnosisRelay | `IGnosisRelayAPI` |
| augur | [Augur](api-classes-packages-augur-sdk-src-augur-augur.md) |

**Returns:** [Gnosis](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-packages-augur-sdk-src-augur-augur.md)*

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:32](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L32)*

___
<a id="gnosisrelay"></a>

### `<Private>` gnosisRelay

**● gnosisRelay**: *`IGnosisRelayAPI`*

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:33](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L33)*

___
<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](api-interfaces-packages-augur-sdk-src-ethereum-provider-provider.md)*

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:31](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L31)*

___

## Methods

<a id="creategnosissafedirectlywitheth"></a>

###  createGnosisSafeDirectlyWithETH

▸ **createGnosisSafeDirectlyWithETH**(params: *[GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md)*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:59](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L59)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md) |

**Returns:** `Promise`<`string`>

___
<a id="creategnosissafeviarelay"></a>

###  createGnosisSafeViaRelay

▸ **createGnosisSafeViaRelay**(params: *[GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md)*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:71](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md) |

**Returns:** `Promise`<`string`>

___
<a id="getgnosissafeaddress"></a>

###  getGnosisSafeAddress

▸ **getGnosisSafeAddress**(params: *[GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md)*): `Promise`<`string`>

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:43](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md) |

**Returns:** `Promise`<`string`>

___
<a id="getgnosissafedeploymentstatusviarelay"></a>

###  getGnosisSafeDeploymentStatusViaRelay

▸ **getGnosisSafeDeploymentStatusViaRelay**(safeAddress: *`string`*): `Promise`<`boolean`>

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:84](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| safeAddress | `string` |

**Returns:** `Promise`<`boolean`>

___

