[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/utils"](_augur_sdk_src_utils_.md)

# Module: "augur-sdk/src/utils"

## Index

### Interfaces

* [PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)

### Variables

* [MIN_TRADE_INTERVAL](_augur_sdk_src_utils_.md#const-min_trade_interval)
* [QUINTILLION](_augur_sdk_src_utils_.md#const-quintillion)
* [TRADE_INTERVAL_VALUE](_augur_sdk_src_utils_.md#const-trade_interval_value)

### Functions

* [calculatePayoutNumeratorsArray](_augur_sdk_src_utils_.md#calculatepayoutnumeratorsarray)
* [calculatePayoutNumeratorsValue](_augur_sdk_src_utils_.md#calculatepayoutnumeratorsvalue)
* [compareObjects](_augur_sdk_src_utils_.md#compareobjects)
* [convertAttoValueToDisplayValue](_augur_sdk_src_utils_.md#convertattovaluetodisplayvalue)
* [convertDisplayAmountToOnChainAmount](_augur_sdk_src_utils_.md#convertdisplayamounttoonchainamount)
* [convertDisplayPriceToOnChainPrice](_augur_sdk_src_utils_.md#convertdisplaypricetoonchainprice)
* [convertDisplayValuetoAttoValue](_augur_sdk_src_utils_.md#convertdisplayvaluetoattovalue)
* [convertOnChainAmountToDisplayAmount](_augur_sdk_src_utils_.md#convertonchainamounttodisplayamount)
* [convertOnChainPriceToDisplayPrice](_augur_sdk_src_utils_.md#convertonchainpricetodisplayprice)
* [convertPayoutNumeratorsToStrings](_augur_sdk_src_utils_.md#convertpayoutnumeratorstostrings)
* [countNonZeroes](_augur_sdk_src_utils_.md#countnonzeroes)
* [describeCategoricalOutcome](_augur_sdk_src_utils_.md#describecategoricaloutcome)
* [describeMarketOutcome](_augur_sdk_src_utils_.md#describemarketoutcome)
* [describeScalarOutcome](_augur_sdk_src_utils_.md#describescalaroutcome)
* [describeUniverseOutcome](_augur_sdk_src_utils_.md#describeuniverseoutcome)
* [describeYesNoOutcome](_augur_sdk_src_utils_.md#describeyesnooutcome)
* [getOutcomeValue](_augur_sdk_src_utils_.md#getoutcomevalue)
* [getTradeInterval](_augur_sdk_src_utils_.md#gettradeinterval)
* [isWellFormedCategorical](_augur_sdk_src_utils_.md#iswellformedcategorical)
* [isWellFormedScalar](_augur_sdk_src_utils_.md#iswellformedscalar)
* [isWellFormedYesNo](_augur_sdk_src_utils_.md#iswellformedyesno)
* [logError](_augur_sdk_src_utils_.md#logerror)
* [marketNameToType](_augur_sdk_src_utils_.md#marketnametotype)
* [marketTypeToName](_augur_sdk_src_utils_.md#markettypetoname)
* [numTicksToTickSize](_augur_sdk_src_utils_.md#numtickstoticksize)
* [numTicksToTickSizeWithDisplayPrices](_augur_sdk_src_utils_.md#numtickstoticksizewithdisplayprices)
* [padHex](_augur_sdk_src_utils_.md#padhex)
* [parseZeroXMakerAssetData](_augur_sdk_src_utils_.md#parsezeroxmakerassetdata)
* [tickSizeToNumTickWithDisplayPrices](_augur_sdk_src_utils_.md#ticksizetonumtickwithdisplayprices)

## Variables

### `Const` MIN_TRADE_INTERVAL

• **MIN_TRADE_INTERVAL**: *BigNumber‹›* = new BigNumber(10**14)

*Defined in [packages/augur-sdk/src/utils.ts:390](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L390)*

___

### `Const` QUINTILLION

• **QUINTILLION**: *BigNumber‹›* = new BigNumber(10).pow(18)

*Defined in [packages/augur-sdk/src/utils.ts:12](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L12)*

___

### `Const` TRADE_INTERVAL_VALUE

• **TRADE_INTERVAL_VALUE**: *BigNumber‹›* = new BigNumber(10**19)

*Defined in [packages/augur-sdk/src/utils.ts:389](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L389)*

## Functions

###  calculatePayoutNumeratorsArray

▸ **calculatePayoutNumeratorsArray**(`displayMaxPrice`: string, `displayMinPrice`: string, `numTicks`: string, `numOutcomes`: number, `marketType`: string, `outcome`: number, `isInvalid`: boolean): *BigNumber[]*

*Defined in [packages/augur-sdk/src/utils.ts:247](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L247)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`displayMaxPrice` | string | - |
`displayMinPrice` | string | - |
`numTicks` | string | - |
`numOutcomes` | number | - |
`marketType` | string | - |
`outcome` | number | - |
`isInvalid` | boolean | false |

**Returns:** *BigNumber[]*

___

###  calculatePayoutNumeratorsValue

▸ **calculatePayoutNumeratorsValue**(`displayMaxPrice`: string, `displayMinPrice`: string, `numTicks`: string, `marketType`: string, `payout`: string[]): *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

*Defined in [packages/augur-sdk/src/utils.ts:134](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L134)*

**Parameters:**

Name | Type |
------ | ------ |
`displayMaxPrice` | string |
`displayMinPrice` | string |
`numTicks` | string |
`marketType` | string |
`payout` | string[] |

**Returns:** *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

___

###  compareObjects

▸ **compareObjects**(`key`: string, `order`: string): *(Anonymous function)*

*Defined in [packages/augur-sdk/src/utils.ts:99](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`order` | string |

**Returns:** *(Anonymous function)*

___

###  convertAttoValueToDisplayValue

▸ **convertAttoValueToDisplayValue**(`attoValue`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:93](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L93)*

**Parameters:**

Name | Type |
------ | ------ |
`attoValue` | BigNumber |

**Returns:** *BigNumber*

___

###  convertDisplayAmountToOnChainAmount

▸ **convertDisplayAmountToOnChainAmount**(`displayAmount`: BigNumber, `tickSize`: BigNumber): *BigNumber‹›*

*Defined in [packages/augur-sdk/src/utils.ts:52](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`displayAmount` | BigNumber |
`tickSize` | BigNumber |

**Returns:** *BigNumber‹›*

___

###  convertDisplayPriceToOnChainPrice

▸ **convertDisplayPriceToOnChainPrice**(`displayPrice`: BigNumber, `minPrice`: BigNumber, `tickSize`: BigNumber): *BigNumber‹›*

*Defined in [packages/augur-sdk/src/utils.ts:69](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`displayPrice` | BigNumber |
`minPrice` | BigNumber |
`tickSize` | BigNumber |

**Returns:** *BigNumber‹›*

___

###  convertDisplayValuetoAttoValue

▸ **convertDisplayValuetoAttoValue**(`displayValue`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:87](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`displayValue` | BigNumber |

**Returns:** *BigNumber*

___

###  convertOnChainAmountToDisplayAmount

▸ **convertOnChainAmountToDisplayAmount**(`onChainAmount`: BigNumber, `tickSize`: BigNumber): *BigNumber‹›*

*Defined in [packages/augur-sdk/src/utils.ts:45](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L45)*

**Parameters:**

Name | Type |
------ | ------ |
`onChainAmount` | BigNumber |
`tickSize` | BigNumber |

**Returns:** *BigNumber‹›*

___

###  convertOnChainPriceToDisplayPrice

▸ **convertOnChainPriceToDisplayPrice**(`onChainPrice`: BigNumber, `minPrice`: BigNumber, `tickSize`: BigNumber): *BigNumber‹›*

*Defined in [packages/augur-sdk/src/utils.ts:59](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`onChainPrice` | BigNumber |
`minPrice` | BigNumber |
`tickSize` | BigNumber |

**Returns:** *BigNumber‹›*

___

###  convertPayoutNumeratorsToStrings

▸ **convertPayoutNumeratorsToStrings**(`payoutNumeratorsBN`: BigNumber[]): *string[]*

*Defined in [packages/augur-sdk/src/utils.ts:77](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`payoutNumeratorsBN` | BigNumber[] |

**Returns:** *string[]*

___

###  countNonZeroes

▸ **countNonZeroes**(`numbers`: string[]): *number*

*Defined in [packages/augur-sdk/src/utils.ts:237](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L237)*

**Parameters:**

Name | Type |
------ | ------ |
`numbers` | string[] |

**Returns:** *number*

___

###  describeCategoricalOutcome

▸ **describeCategoricalOutcome**(`outcome`: number, `outcomes`: string[]): *string*

*Defined in [packages/augur-sdk/src/utils.ts:298](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L298)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | number |
`outcomes` | string[] |

**Returns:** *string*

___

###  describeMarketOutcome

▸ **describeMarketOutcome**(`outcome`: string | number, `market`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)): *string*

*Defined in [packages/augur-sdk/src/utils.ts:341](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L341)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | string &#124; number |
`market` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |

**Returns:** *string*

___

###  describeScalarOutcome

▸ **describeScalarOutcome**(`outcome`: number, `prices`: string[]): *string*

*Defined in [packages/augur-sdk/src/utils.ts:307](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L307)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | number |
`prices` | string[] |

**Returns:** *string*

___

###  describeUniverseOutcome

▸ **describeUniverseOutcome**(`outcome`: [PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md), `forkingMarket`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md)): *string*

*Defined in [packages/augur-sdk/src/utils.ts:316](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L316)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | [PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md) |
`forkingMarket` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |

**Returns:** *string*

___

###  describeYesNoOutcome

▸ **describeYesNoOutcome**(`outcome`: number): *string*

*Defined in [packages/augur-sdk/src/utils.ts:285](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L285)*

**Parameters:**

Name | Type |
------ | ------ |
`outcome` | number |

**Returns:** *string*

___

###  getOutcomeValue

▸ **getOutcomeValue**(`market`: [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md), `payoutNumerators`: string[]): *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

*Defined in [packages/augur-sdk/src/utils.ts:186](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L186)*

**Parameters:**

Name | Type |
------ | ------ |
`market` | [MarketData](../interfaces/_augur_sdk_src_state_logs_types_.marketdata.md) |
`payoutNumerators` | string[] |

**Returns:** *[PayoutNumeratorValue](../interfaces/_augur_sdk_src_utils_.payoutnumeratorvalue.md)*

___

###  getTradeInterval

▸ **getTradeInterval**(`minPrice`: BigNumber, `maxPrice`: BigNumber, `numTicks`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:392](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L392)*

**Parameters:**

Name | Type |
------ | ------ |
`minPrice` | BigNumber |
`maxPrice` | BigNumber |
`numTicks` | BigNumber |

**Returns:** *BigNumber*

___

###  isWellFormedCategorical

▸ **isWellFormedCategorical**(`payout`: string[]): *boolean*

*Defined in [packages/augur-sdk/src/utils.ts:209](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L209)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | string[] |

**Returns:** *boolean*

___

###  isWellFormedScalar

▸ **isWellFormedScalar**(`payout`: string[]): *boolean*

*Defined in [packages/augur-sdk/src/utils.ts:218](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L218)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | string[] |

**Returns:** *boolean*

___

###  isWellFormedYesNo

▸ **isWellFormedYesNo**(`payout`: string[]): *boolean*

*Defined in [packages/augur-sdk/src/utils.ts:200](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L200)*

**Parameters:**

Name | Type |
------ | ------ |
`payout` | string[] |

**Returns:** *boolean*

___

###  logError

▸ **logError**(`err`: Error | string | object | null, `result?`: any): *void*

*Defined in [packages/augur-sdk/src/utils.ts:118](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; string &#124; object &#124; null |
`result?` | any |

**Returns:** *void*

___

###  marketNameToType

▸ **marketNameToType**(`marketTypeName`: [MarketTypeName](../enums/_augur_sdk_src_state_logs_types_.markettypename.md)): *[MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)*

*Defined in [packages/augur-sdk/src/utils.ts:376](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L376)*

**Parameters:**

Name | Type |
------ | ------ |
`marketTypeName` | [MarketTypeName](../enums/_augur_sdk_src_state_logs_types_.markettypename.md) |

**Returns:** *[MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)*

___

###  marketTypeToName

▸ **marketTypeToName**(`marketType`: [MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md)): *[MarketTypeName](../enums/_augur_sdk_src_state_logs_types_.markettypename.md)*

*Defined in [packages/augur-sdk/src/utils.ts:363](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L363)*

**Parameters:**

Name | Type |
------ | ------ |
`marketType` | [MarketType](../enums/_augur_sdk_src_state_logs_types_.markettype.md) |

**Returns:** *[MarketTypeName](../enums/_augur_sdk_src_state_logs_types_.markettypename.md)*

___

###  numTicksToTickSize

▸ **numTicksToTickSize**(`numTicks`: BigNumber, `minPrice`: BigNumber, `maxPrice`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`numTicks` | BigNumber |
`minPrice` | BigNumber |
`maxPrice` | BigNumber |

**Returns:** *BigNumber*

___

###  numTicksToTickSizeWithDisplayPrices

▸ **numTicksToTickSizeWithDisplayPrices**(`numTicks`: BigNumber, `minPrice`: BigNumber, `maxPrice`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:29](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`numTicks` | BigNumber |
`minPrice` | BigNumber |
`maxPrice` | BigNumber |

**Returns:** *BigNumber*

___

###  padHex

▸ **padHex**(`hexString`: string): *string*

*Defined in [packages/augur-sdk/src/utils.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`hexString` | string |

**Returns:** *string*

___

###  parseZeroXMakerAssetData

▸ **parseZeroXMakerAssetData**(`makerAssetData`: string): *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

*Defined in [packages/augur-sdk/src/utils.ts:403](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L403)*

**Parameters:**

Name | Type |
------ | ------ |
`makerAssetData` | string |

**Returns:** *[OrderData](../interfaces/_augur_sdk_src_state_db_zeroxorders_.orderdata.md)*

___

###  tickSizeToNumTickWithDisplayPrices

▸ **tickSizeToNumTickWithDisplayPrices**(`tickSize`: BigNumber, `minPrice`: BigNumber, `maxPrice`: BigNumber): *BigNumber*

*Defined in [packages/augur-sdk/src/utils.ts:37](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/utils.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`tickSize` | BigNumber |
`minPrice` | BigNumber |
`maxPrice` | BigNumber |

**Returns:** *BigNumber*
