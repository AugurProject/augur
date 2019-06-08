[@augurproject/sdk](../README.md) > ["utils"](../modules/_utils_.md)

# External module: "utils"

## Index

### Variables

* [QUINTILLION](_utils_.md#quintillion)

### Functions

* [compareObjects](_utils_.md#compareobjects)
* [convertDisplayAmountToOnChainAmount](_utils_.md#convertdisplayamounttoonchainamount)
* [convertDisplayPriceToOnChainPrice](_utils_.md#convertdisplaypricetoonchainprice)
* [convertOnChainAmountToDisplayAmount](_utils_.md#convertonchainamounttodisplayamount)
* [convertOnChainPriceToDisplayPrice](_utils_.md#convertonchainpricetodisplayprice)
* [numTicksToTickSize](_utils_.md#numtickstoticksize)

---

## Variables

<a id="quintillion"></a>

### `<Const>` QUINTILLION

**● QUINTILLION**: *`BigNumber`* =  new BigNumber(10).pow(18)

*Defined in [utils.ts:3](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L3)*

___

## Functions

<a id="compareobjects"></a>

###  compareObjects

▸ **compareObjects**(key: *`string`*, order: *`string`*): `(Anonymous function)`

*Defined in [utils.ts:25](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| order | `string` |

**Returns:** `(Anonymous function)`

___
<a id="convertdisplayamounttoonchainamount"></a>

###  convertDisplayAmountToOnChainAmount

▸ **convertDisplayAmountToOnChainAmount**(displayAmount: *`BigNumber`*, tickSize: *`BigNumber`*): `any`

*Defined in [utils.ts:13](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayAmount | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `any`

___
<a id="convertdisplaypricetoonchainprice"></a>

###  convertDisplayPriceToOnChainPrice

▸ **convertDisplayPriceToOnChainPrice**(displayPrice: *`BigNumber`*, minPrice: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [utils.ts:21](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L21)*

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

*Defined in [utils.ts:9](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onChainAmount | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertonchainpricetodisplayprice"></a>

###  convertOnChainPriceToDisplayPrice

▸ **convertOnChainPriceToDisplayPrice**(onChainPrice: *`BigNumber`*, minPrice: *`BigNumber`*, tickSize: *`BigNumber`*): `any`

*Defined in [utils.ts:17](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| onChainPrice | `BigNumber` |
| minPrice | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `any`

___
<a id="numtickstoticksize"></a>

###  numTicksToTickSize

▸ **numTicksToTickSize**(numTicks: *`BigNumber`*, minPrice: *`BigNumber`*, maxPrice: *`BigNumber`*): `BigNumber`

*Defined in [utils.ts:5](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/utils.ts#L5)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| numTicks | `BigNumber` |
| minPrice | `BigNumber` |
| maxPrice | `BigNumber` |

**Returns:** `BigNumber`

___

