---
id: api-modules-packages-augur-sdk-src-utils-module
title: packages/augur-sdk/src/utils Module
sidebar_label: packages/augur-sdk/src/utils
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/utils Module]](api-modules-packages-augur-sdk-src-utils-module.md)

## Module

### Variables

* [QUINTILLION](api-modules-packages-augur-sdk-src-utils-module.md#quintillion)

### Functions

* [calculatePayoutNumeratorsValue](api-modules-packages-augur-sdk-src-utils-module.md#calculatepayoutnumeratorsvalue)
* [compareObjects](api-modules-packages-augur-sdk-src-utils-module.md#compareobjects)
* [convertDisplayAmountToOnChainAmount](api-modules-packages-augur-sdk-src-utils-module.md#convertdisplayamounttoonchainamount)
* [convertDisplayPriceToOnChainPrice](api-modules-packages-augur-sdk-src-utils-module.md#convertdisplaypricetoonchainprice)
* [convertOnChainAmountToDisplayAmount](api-modules-packages-augur-sdk-src-utils-module.md#convertonchainamounttodisplayamount)
* [convertOnChainPriceToDisplayPrice](api-modules-packages-augur-sdk-src-utils-module.md#convertonchainpricetodisplayprice)
* [convertPayoutNumeratorsToStrings](api-modules-packages-augur-sdk-src-utils-module.md#convertpayoutnumeratorstostrings)
* [logError](api-modules-packages-augur-sdk-src-utils-module.md#logerror)
* [numTicksToTickSize](api-modules-packages-augur-sdk-src-utils-module.md#numtickstoticksize)
* [numTicksToTickSizeWithDisplayPrices](api-modules-packages-augur-sdk-src-utils-module.md#numtickstoticksizewithdisplayprices)

---

## Variables

<a id="quintillion"></a>

### `<Const>` QUINTILLION

**● QUINTILLION**: *`BigNumber`* =  new BigNumber(10).pow(18)

*Defined in [packages/augur-sdk/src/utils.ts:5](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L5)*

___

## Functions

<a id="calculatepayoutnumeratorsvalue"></a>

###  calculatePayoutNumeratorsValue

▸ **calculatePayoutNumeratorsValue**(displayMaxPrice: *`string`*, displayMinPrice: *`string`*, numTicks: *`string`*, marketType: *`string`*, payout: *`string`[]*): `string` \| `null`

*Defined in [packages/augur-sdk/src/utils.ts:94](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L94)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayMaxPrice | `string` |
| displayMinPrice | `string` |
| numTicks | `string` |
| marketType | `string` |
| payout | `string`[] |

**Returns:** `string` \| `null`

___
<a id="compareobjects"></a>

###  compareObjects

▸ **compareObjects**(key: *`string`*, order: *`string`*): `(Anonymous function)`

*Defined in [packages/augur-sdk/src/utils.ts:68](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L68)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| order | `string` |

**Returns:** `(Anonymous function)`

___
<a id="convertdisplayamounttoonchainamount"></a>

###  convertDisplayAmountToOnChainAmount

▸ **convertDisplayAmountToOnChainAmount**(displayAmount: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:33](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L33)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayAmount | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertdisplaypricetoonchainprice"></a>

###  convertDisplayPriceToOnChainPrice

▸ **convertDisplayPriceToOnChainPrice**(displayPrice: *`BigNumber`*, minPrice: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:50](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L50)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayPrice | `BigNumber` |
| minPrice | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertonchainamounttodisplayamount"></a>

###  convertOnChainAmountToDisplayAmount

▸ **convertOnChainAmountToDisplayAmount**(onChainAmount: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:26](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onChainAmount | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertonchainpricetodisplayprice"></a>

###  convertOnChainPriceToDisplayPrice

▸ **convertOnChainPriceToDisplayPrice**(onChainPrice: *`BigNumber`*, minPrice: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:40](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onChainPrice | `BigNumber` |
| minPrice | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertpayoutnumeratorstostrings"></a>

###  convertPayoutNumeratorsToStrings

▸ **convertPayoutNumeratorsToStrings**(payoutNumeratorsBN: *`BigNumber`[]*): `string`[]

*Defined in [packages/augur-sdk/src/utils.ts:58](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L58)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payoutNumeratorsBN | `BigNumber`[] |

**Returns:** `string`[]

___
<a id="logerror"></a>

###  logError

▸ **logError**(err: *`Error` \| `string` \| `object` \| `null`*, result?: *`any`*): `void`

*Defined in [packages/augur-sdk/src/utils.ts:87](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| err | `Error` \| `string` \| `object` \| `null` |
| `Optional` result | `any` |

**Returns:** `void`

___
<a id="numtickstoticksize"></a>

###  numTicksToTickSize

▸ **numTicksToTickSize**(numTicks: *`BigNumber`*, minPrice: *`BigNumber`*, maxPrice: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:7](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L7)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| numTicks | `BigNumber` |
| minPrice | `BigNumber` |
| maxPrice | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="numtickstoticksizewithdisplayprices"></a>

###  numTicksToTickSizeWithDisplayPrices

▸ **numTicksToTickSizeWithDisplayPrices**(numTicks: *`BigNumber`*, minPrice: *`BigNumber`*, maxPrice: *`BigNumber`*): `BigNumber`

*Defined in [packages/augur-sdk/src/utils.ts:18](https://github.com/AugurProject/augur/blob/a689f5d0f9/packages/augur-sdk/src/utils.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| numTicks | `BigNumber` |
| minPrice | `BigNumber` |
| maxPrice | `BigNumber` |

**Returns:** `BigNumber`

___

