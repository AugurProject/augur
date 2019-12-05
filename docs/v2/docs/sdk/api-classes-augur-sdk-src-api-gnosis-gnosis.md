---
id: api-classes-augur-sdk-src-api-gnosis-gnosis
title: Gnosis
sidebar_label: Gnosis
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/Gnosis Module]](api-modules-augur-sdk-src-api-gnosis-module.md) > [Gnosis](api-classes-augur-sdk-src-api-gnosis-gnosis.md)

## Class

## Hierarchy

**Gnosis**

### Constructors

* [constructor](api-classes-augur-sdk-src-api-gnosis-gnosis.md#constructor)

### Properties

* [augur](api-classes-augur-sdk-src-api-gnosis-gnosis.md#augur)
* [dependencies](api-classes-augur-sdk-src-api-gnosis-gnosis.md#dependencies)
* [gnosisRelay](api-classes-augur-sdk-src-api-gnosis-gnosis.md#gnosisrelay)
* [provider](api-classes-augur-sdk-src-api-gnosis-gnosis.md#provider)
* [safesToCheck](api-classes-augur-sdk-src-api-gnosis-gnosis.md#safestocheck)

### Methods

* [buildGnosisSetupData](api-classes-augur-sdk-src-api-gnosis-gnosis.md#buildgnosissetupdata)
* [buildRegistrationData](api-classes-augur-sdk-src-api-gnosis-gnosis.md#buildregistrationdata)
* [calculateGnosisSafeAddress](api-classes-augur-sdk-src-api-gnosis-gnosis.md#calculategnosissafeaddress)
* [createGnosisSafeDirectlyWithETH](api-classes-augur-sdk-src-api-gnosis-gnosis.md#creategnosissafedirectlywitheth)
* [createGnosisSafeViaRelay](api-classes-augur-sdk-src-api-gnosis-gnosis.md#creategnosissafeviarelay)
* [gasStation](api-classes-augur-sdk-src-api-gnosis-gnosis.md#gasstation)
* [getGnosisSafeAddress](api-classes-augur-sdk-src-api-gnosis-gnosis.md#getgnosissafeaddress)
* [getGnosisSafeDeploymentStatusViaRelay](api-classes-augur-sdk-src-api-gnosis-gnosis.md#getgnosissafedeploymentstatusviarelay)
* [getOrCreateGnosisSafe](api-classes-augur-sdk-src-api-gnosis-gnosis.md#getorcreategnosissafe)
* [onNewBlock](api-classes-augur-sdk-src-api-gnosis-gnosis.md#onnewblock)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Gnosis**(provider: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*, gnosisRelay: *`IGnosisRelayAPI`*, augur: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*, dependencies: *`ContractDependenciesGnosis`*): [Gnosis](api-classes-augur-sdk-src-api-gnosis-gnosis.md)

*Defined in [augur-sdk/src/api/Gnosis.ts:46](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L46)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| provider | [Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md) |
| gnosisRelay | `IGnosisRelayAPI` |
| augur | [Augur](api-classes-augur-sdk-src-augur-augur.md) |
| dependencies | `ContractDependenciesGnosis` |

**Returns:** [Gnosis](api-classes-augur-sdk-src-api-gnosis-gnosis.md)

___

## Properties

<a id="augur"></a>

### `<Private>` augur

**● augur**: *[Augur](api-classes-augur-sdk-src-augur-augur.md)*

*Defined in [augur-sdk/src/api/Gnosis.ts:50](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L50)*

___
<a id="dependencies"></a>

### `<Private>` dependencies

**● dependencies**: *`ContractDependenciesGnosis`*

*Defined in [augur-sdk/src/api/Gnosis.ts:51](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L51)*

___
<a id="gnosisrelay"></a>

### `<Private>` gnosisRelay

**● gnosisRelay**: *`IGnosisRelayAPI`*

*Defined in [augur-sdk/src/api/Gnosis.ts:49](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L49)*

___
<a id="provider"></a>

### `<Private>` provider

**● provider**: *[Provider](api-interfaces-augur-sdk-src-ethereum-provider-provider.md)*

*Defined in [augur-sdk/src/api/Gnosis.ts:48](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L48)*

___
<a id="safestocheck"></a>

### `<Private>` safesToCheck

**● safesToCheck**: *[GnosisSafeStatusPayload](api-interfaces-augur-sdk-src-api-gnosis-gnosissafestatuspayload.md)[]* =  []

*Defined in [augur-sdk/src/api/Gnosis.ts:68](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L68)*

___

## Methods

<a id="buildgnosissetupdata"></a>

### `<Private>` buildGnosisSetupData

▸ **buildGnosisSetupData**(account: *`string`*, payment?: *`string`*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/Gnosis.ts:387](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L387)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| account | `string` | - |
| `Default value` payment | `string` | &quot;0&quot; |

**Returns:** `Promise`<`string`>

___
<a id="buildregistrationdata"></a>

### `<Private>` buildRegistrationData

▸ **buildRegistrationData**(): `Promise`<`string`>

*Defined in [augur-sdk/src/api/Gnosis.ts:357](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L357)*

**Returns:** `Promise`<`string`>

___
<a id="calculategnosissafeaddress"></a>

###  calculateGnosisSafeAddress

▸ **calculateGnosisSafeAddress**(params: *[CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md)*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/Gnosis.ts:221](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L221)*

*__desc__*: Calculates the safe address from creation params. Generally used to confirm safe address in local storage is correct and valid.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| params | [CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md) |  \- |

**Returns:** `Promise`<`string`>

___
<a id="creategnosissafedirectlywitheth"></a>

###  createGnosisSafeDirectlyWithETH

▸ **createGnosisSafeDirectlyWithETH**(account: *`string`*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/Gnosis.ts:268](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L268)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| account | `string` |

**Returns:** `Promise`<`string`>

___
<a id="creategnosissafeviarelay"></a>

###  createGnosisSafeViaRelay

▸ **createGnosisSafeViaRelay**(params: *[CreateGnosisSafeViaRelayParams](api-interfaces-augur-sdk-src-api-gnosis-creategnosissafeviarelayparams.md)*): `Promise`<`SafeResponse`>

*Defined in [augur-sdk/src/api/Gnosis.ts:286](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L286)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [CreateGnosisSafeViaRelayParams](api-interfaces-augur-sdk-src-api-gnosis-creategnosissafeviarelayparams.md) |

**Returns:** `Promise`<`SafeResponse`>

___
<a id="gasstation"></a>

###  gasStation

▸ **gasStation**(): `Promise`<`GasStationResponse`>

*Defined in [augur-sdk/src/api/Gnosis.ts:336](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L336)*

**Returns:** `Promise`<`GasStationResponse`>

___
<a id="getgnosissafeaddress"></a>

###  getGnosisSafeAddress

▸ **getGnosisSafeAddress**(account: *`string`*): `Promise`<`string`>

*Defined in [augur-sdk/src/api/Gnosis.ts:264](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L264)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| account | `string` |

**Returns:** `Promise`<`string`>

___
<a id="getgnosissafedeploymentstatusviarelay"></a>

###  getGnosisSafeDeploymentStatusViaRelay

▸ **getGnosisSafeDeploymentStatusViaRelay**(params: *[GnosisSafeDeploymentStatusParams](api-interfaces-augur-sdk-src-api-gnosis-gnosissafedeploymentstatusparams.md)*): `Promise`<`GnosisSafeStateReponse`>

*Defined in [augur-sdk/src/api/Gnosis.ts:340](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L340)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| params | [GnosisSafeDeploymentStatusParams](api-interfaces-augur-sdk-src-api-gnosis-gnosissafedeploymentstatusparams.md) |

**Returns:** `Promise`<`GnosisSafeStateReponse`>

___
<a id="getorcreategnosissafe"></a>

###  getOrCreateGnosisSafe

▸ **getOrCreateGnosisSafe**(params: *[CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md) \| [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)*): `Promise`<[CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md) \| [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)>

*Defined in [augur-sdk/src/api/Gnosis.ts:131](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L131)*

*__desc__*: Start the gnosis workflow. Updates on status will be available via event emitter if relay transaction is appropriate..

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| params | [CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md) \| [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address) |  Address of the wallet to check/create safe for. Object is used to reinitialize polling on new block. |

**Returns:** `Promise`<[CalculateGnosisSafeAddressParams](api-interfaces-augur-sdk-src-api-gnosis-calculategnosissafeaddressparams.md) \| [Address](api-modules-augur-sdk-src-state-logs-types-module.md#address)>
*   returns address if the safe exists, otherwise object of safe creation params.

___
<a id="onnewblock"></a>

### `<Private>` onNewBlock

▸ **onNewBlock**(): `Promise`<`void`>

*Defined in [augur-sdk/src/api/Gnosis.ts:73](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/Gnosis.ts#L73)*

**Returns:** `Promise`<`void`>

___

