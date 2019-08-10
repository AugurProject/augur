---
id: api-modules-packages-augur-sdk-src-api-gnosis-module
title: packages/augur-sdk/src/api/Gnosis Module
sidebar_label: packages/augur-sdk/src/api/Gnosis
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/api/Gnosis Module]](api-modules-packages-augur-sdk-src-api-gnosis-module.md)

## Module

### Classes

* [Gnosis](api-classes-packages-augur-sdk-src-api-gnosis-gnosis.md)

### Interfaces

* [GetGnosisSafeAddressParams](api-interfaces-packages-augur-sdk-src-api-gnosis-getgnosissafeaddressparams.md)
* [ProxyCreationLog](api-interfaces-packages-augur-sdk-src-api-gnosis-proxycreationlog.md)

### Variables

* [AUGUR_GNOSIS_SAFE_NONCE](api-modules-packages-augur-sdk-src-api-gnosis-module.md#augur_gnosis_safe_nonce)
* [CREATION_GAS_ESTIMATE](api-modules-packages-augur-sdk-src-api-gnosis-module.md#creation_gas_estimate)
* [CREATION_GAS_PRICE](api-modules-packages-augur-sdk-src-api-gnosis-module.md#creation_gas_price)
* [SALT_NONCE](api-modules-packages-augur-sdk-src-api-gnosis-module.md#salt_nonce)

---

## Variables

<a id="augur_gnosis_safe_nonce"></a>

### `<Const>` AUGUR_GNOSIS_SAFE_NONCE

**● AUGUR_GNOSIS_SAFE_NONCE**: *`number`* =  ethUtil.keccak256("AUGUR_GNOSIS_SAFE_NONCE").readUIntLE(0, 6)

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:15](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L15)*

___
<a id="creation_gas_estimate"></a>

### `<Const>` CREATION_GAS_ESTIMATE

**● CREATION_GAS_ESTIMATE**: *`BigNumber`* =  new BigNumber(400000)

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:12](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L12)*

___
<a id="creation_gas_price"></a>

### `<Const>` CREATION_GAS_PRICE

**● CREATION_GAS_PRICE**: *`BigNumber`* =  new BigNumber(10**9)

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:13](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L13)*

___
<a id="salt_nonce"></a>

### `<Const>` SALT_NONCE

**● SALT_NONCE**: *`4242424242`* = 4242424242

*Defined in [packages/augur-sdk/src/api/Gnosis.ts:18](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/api/Gnosis.ts#L18)*

___

