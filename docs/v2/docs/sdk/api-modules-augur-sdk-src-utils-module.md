---
id: api-modules-augur-sdk-src-utils-module
title: augur-sdk/src/utils Module
sidebar_label: augur-sdk/src/utils
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/utils Module]](api-modules-augur-sdk-src-utils-module.md)

## Module

### Interfaces

* [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

### Variables

* [QUINTILLION](api-modules-augur-sdk-src-utils-module.md#quintillion)

### Functions

* [calculatePayoutNumeratorsArray](api-modules-augur-sdk-src-utils-module.md#calculatepayoutnumeratorsarray)
* [calculatePayoutNumeratorsValue](api-modules-augur-sdk-src-utils-module.md#calculatepayoutnumeratorsvalue)
* [compareObjects](api-modules-augur-sdk-src-utils-module.md#compareobjects)
* [convertAttoValueToDisplayValue](api-modules-augur-sdk-src-utils-module.md#convertattovaluetodisplayvalue)
* [convertDisplayAmountToOnChainAmount](api-modules-augur-sdk-src-utils-module.md#convertdisplayamounttoonchainamount)
* [convertDisplayPriceToOnChainPrice](api-modules-augur-sdk-src-utils-module.md#convertdisplaypricetoonchainprice)
* [convertDisplayValuetoAttoValue](api-modules-augur-sdk-src-utils-module.md#convertdisplayvaluetoattovalue)
* [convertOnChainAmountToDisplayAmount](api-modules-augur-sdk-src-utils-module.md#convertonchainamounttodisplayamount)
* [convertOnChainPriceToDisplayPrice](api-modules-augur-sdk-src-utils-module.md#convertonchainpricetodisplayprice)
* [convertPayoutNumeratorsToStrings](api-modules-augur-sdk-src-utils-module.md#convertpayoutnumeratorstostrings)
* [countNonZeroes](api-modules-augur-sdk-src-utils-module.md#countnonzeroes)
* [describeCategoricalOutcome](api-modules-augur-sdk-src-utils-module.md#describecategoricaloutcome)
* [describeMarketOutcome](api-modules-augur-sdk-src-utils-module.md#describemarketoutcome)
* [describeScalarOutcome](api-modules-augur-sdk-src-utils-module.md#describescalaroutcome)
* [describeUniverseOutcome](api-modules-augur-sdk-src-utils-module.md#describeuniverseoutcome)
* [describeYesNoOutcome](api-modules-augur-sdk-src-utils-module.md#describeyesnooutcome)
* [getOutcomeValue](api-modules-augur-sdk-src-utils-module.md#getoutcomevalue)
* [isWellFormedCategorical](api-modules-augur-sdk-src-utils-module.md#iswellformedcategorical)
* [isWellFormedScalar](api-modules-augur-sdk-src-utils-module.md#iswellformedscalar)
* [isWellFormedYesNo](api-modules-augur-sdk-src-utils-module.md#iswellformedyesno)
* [logError](api-modules-augur-sdk-src-utils-module.md#logerror)
* [marketNameToType](api-modules-augur-sdk-src-utils-module.md#marketnametotype)
* [marketTypeToName](api-modules-augur-sdk-src-utils-module.md#markettypetoname)
* [numTicksToTickSize](api-modules-augur-sdk-src-utils-module.md#numtickstoticksize)
* [numTicksToTickSizeWithDisplayPrices](api-modules-augur-sdk-src-utils-module.md#numtickstoticksizewithdisplayprices)
* [padHex](api-modules-augur-sdk-src-utils-module.md#padhex)
* [tickSizeToNumTickWithDisplayPrices](api-modules-augur-sdk-src-utils-module.md#ticksizetonumtickwithdisplayprices)

---

## Variables

<a id="quintillion"></a>

### `<Const>` QUINTILLION

**● QUINTILLION**: *`BigNumber`* =  new BigNumber(10).pow(18)

*Defined in [augur-sdk/src/utils.ts:12](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L12)*

___

## Functions

<a id="calculatepayoutnumeratorsarray"></a>

###  calculatePayoutNumeratorsArray

▸ **calculatePayoutNumeratorsArray**(displayMaxPrice: *`string`*, displayMinPrice: *`string`*, numTicks: *`string`*, numOutcomes: *`number`*, marketType: *`string`*, outcome: *`number`*, isInvalid?: *`boolean`*): `BigNumber`[]

*Defined in [augur-sdk/src/utils.ts:247](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L247)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| displayMaxPrice | `string` | - |
| displayMinPrice | `string` | - |
| numTicks | `string` | - |
| numOutcomes | `number` | - |
| marketType | `string` | - |
| outcome | `number` | - |
| `Default value` isInvalid | `boolean` | false |

**Returns:** `BigNumber`[]

___
<a id="calculatepayoutnumeratorsvalue"></a>

###  calculatePayoutNumeratorsValue

▸ **calculatePayoutNumeratorsValue**(displayMaxPrice: *`string`*, displayMinPrice: *`string`*, numTicks: *`string`*, marketType: *`string`*, payout: *`string`[]*): [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

*Defined in [augur-sdk/src/utils.ts:134](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L134)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayMaxPrice | `string` |
| displayMinPrice | `string` |
| numTicks | `string` |
| marketType | `string` |
| payout | `string`[] |

**Returns:** [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

___
<a id="compareobjects"></a>

###  compareObjects

▸ **compareObjects**(key: *`string`*, order: *`string`*): `(Anonymous function)`

*Defined in [augur-sdk/src/utils.ts:99](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| order | `string` |

**Returns:** `(Anonymous function)`

___
<a id="convertattovaluetodisplayvalue"></a>

###  convertAttoValueToDisplayValue

▸ **convertAttoValueToDisplayValue**(displayValue: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:93](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L93)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayValue | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertdisplayamounttoonchainamount"></a>

###  convertDisplayAmountToOnChainAmount

▸ **convertDisplayAmountToOnChainAmount**(displayAmount: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:52](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L52)*

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

*Defined in [augur-sdk/src/utils.ts:69](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L69)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayPrice | `BigNumber` |
| minPrice | `BigNumber` |
| tickSize | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertdisplayvaluetoattovalue"></a>

###  convertDisplayValuetoAttoValue

▸ **convertDisplayValuetoAttoValue**(displayValue: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:87](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L87)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| displayValue | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="convertonchainamounttodisplayamount"></a>

###  convertOnChainAmountToDisplayAmount

▸ **convertOnChainAmountToDisplayAmount**(onChainAmount: *`BigNumber`*, tickSize: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:45](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L45)*

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

*Defined in [augur-sdk/src/utils.ts:59](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L59)*

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

*Defined in [augur-sdk/src/utils.ts:77](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L77)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payoutNumeratorsBN | `BigNumber`[] |

**Returns:** `string`[]

___
<a id="countnonzeroes"></a>

###  countNonZeroes

▸ **countNonZeroes**(numbers: *`string`[]*): `number`

*Defined in [augur-sdk/src/utils.ts:237](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L237)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| numbers | `string`[] |

**Returns:** `number`

___
<a id="describecategoricaloutcome"></a>

###  describeCategoricalOutcome

▸ **describeCategoricalOutcome**(outcome: *`number`*, outcomes: *`string`[]*): `string`

*Defined in [augur-sdk/src/utils.ts:298](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L298)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |
| outcomes | `string`[] |

**Returns:** `string`

___
<a id="describemarketoutcome"></a>

###  describeMarketOutcome

▸ **describeMarketOutcome**(outcome: *`string` \| `number`*, market: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*): `string`

*Defined in [augur-sdk/src/utils.ts:341](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L341)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `string` \| `number` |
| market | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |

**Returns:** `string`

___
<a id="describescalaroutcome"></a>

###  describeScalarOutcome

▸ **describeScalarOutcome**(outcome: *`number`*, prices: *`string`[]*): `string`

*Defined in [augur-sdk/src/utils.ts:307](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L307)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |
| prices | `string`[] |

**Returns:** `string`

___
<a id="describeuniverseoutcome"></a>

###  describeUniverseOutcome

▸ **describeUniverseOutcome**(outcome: *[PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)*, forkingMarket: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*): `string`

*Defined in [augur-sdk/src/utils.ts:316](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L316)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md) |
| forkingMarket | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |

**Returns:** `string`

___
<a id="describeyesnooutcome"></a>

###  describeYesNoOutcome

▸ **describeYesNoOutcome**(outcome: *`number`*): `string`

*Defined in [augur-sdk/src/utils.ts:285](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L285)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| outcome | `number` |

**Returns:** `string`

___
<a id="getoutcomevalue"></a>

###  getOutcomeValue

▸ **getOutcomeValue**(market: *[MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md)*, payoutNumerators: *`string`[]*): [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

*Defined in [augur-sdk/src/utils.ts:186](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L186)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| market | [MarketData](api-interfaces-augur-sdk-src-state-logs-types-marketdata.md) |
| payoutNumerators | `string`[] |

**Returns:** [PayoutNumeratorValue](api-interfaces-augur-sdk-src-utils-payoutnumeratorvalue.md)

___
<a id="iswellformedcategorical"></a>

###  isWellFormedCategorical

▸ **isWellFormedCategorical**(payout: *`string`[]*): `boolean`

*Defined in [augur-sdk/src/utils.ts:209](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L209)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payout | `string`[] |

**Returns:** `boolean`

___
<a id="iswellformedscalar"></a>

###  isWellFormedScalar

▸ **isWellFormedScalar**(payout: *`string`[]*): `boolean`

*Defined in [augur-sdk/src/utils.ts:218](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L218)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payout | `string`[] |

**Returns:** `boolean`

___
<a id="iswellformedyesno"></a>

###  isWellFormedYesNo

▸ **isWellFormedYesNo**(payout: *`string`[]*): `boolean`

*Defined in [augur-sdk/src/utils.ts:200](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L200)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| payout | `string`[] |

**Returns:** `boolean`

___
<a id="logerror"></a>

###  logError

▸ **logError**(err: *`Error` \| `string` \| `object` \| `null`*, result?: *`any`*): `void`

*Defined in [augur-sdk/src/utils.ts:118](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L118)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| err | `Error` \| `string` \| `object` \| `null` |
| `Optional` result | `any` |

**Returns:** `void`

___
<a id="marketnametotype"></a>

###  marketNameToType

▸ **marketNameToType**(marketTypeName: *[MarketTypeName](api-enums-augur-sdk-src-state-logs-types-markettypename.md)*): [MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md)

*Defined in [augur-sdk/src/utils.ts:376](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L376)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketTypeName | [MarketTypeName](api-enums-augur-sdk-src-state-logs-types-markettypename.md) |

**Returns:** [MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md)

___
<a id="markettypetoname"></a>

###  marketTypeToName

▸ **marketTypeToName**(marketType: *[MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md)*): [MarketTypeName](api-enums-augur-sdk-src-state-logs-types-markettypename.md)

*Defined in [augur-sdk/src/utils.ts:363](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L363)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| marketType | [MarketType](api-enums-augur-sdk-src-state-logs-types-markettype.md) |

**Returns:** [MarketTypeName](api-enums-augur-sdk-src-state-logs-types-markettypename.md)

___
<a id="numtickstoticksize"></a>

###  numTicksToTickSize

▸ **numTicksToTickSize**(numTicks: *`BigNumber`*, minPrice: *`BigNumber`*, maxPrice: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L18)*

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

*Defined in [augur-sdk/src/utils.ts:29](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L29)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| numTicks | `BigNumber` |
| minPrice | `BigNumber` |
| maxPrice | `BigNumber` |

**Returns:** `BigNumber`

___
<a id="padhex"></a>

###  padHex

▸ **padHex**(hexString: *`string`*): `string`

*Defined in [augur-sdk/src/utils.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L14)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| hexString | `string` |

**Returns:** `string`

___
<a id="ticksizetonumtickwithdisplayprices"></a>

###  tickSizeToNumTickWithDisplayPrices

▸ **tickSizeToNumTickWithDisplayPrices**(tickSize: *`BigNumber`*, minPrice: *`BigNumber`*, maxPrice: *`BigNumber`*): `BigNumber`

*Defined in [augur-sdk/src/utils.ts:37](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/utils.ts#L37)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| tickSize | `BigNumber` |
| minPrice | `BigNumber` |
| maxPrice | `BigNumber` |

**Returns:** `BigNumber`

___

