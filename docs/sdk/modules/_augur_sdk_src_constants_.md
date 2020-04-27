[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/constants"](_augur_sdk_src_constants_.md)

# Module: "augur-sdk/src/constants"

## Index

### Enumerations

* [ACCOUNT_TYPES](../enums/_augur_sdk_src_constants_.account_types.md)
* [ControlMessageType](../enums/_augur_sdk_src_constants_.controlmessagetype.md)
* [MarketReportingState](../enums/_augur_sdk_src_constants_.marketreportingstate.md)
* [MarketReportingStateByNum](../enums/_augur_sdk_src_constants_.marketreportingstatebynum.md)
* [OrderEventType](../enums/_augur_sdk_src_constants_.ordereventtype.md)
* [SubscriptionEventName](../enums/_augur_sdk_src_constants_.subscriptioneventname.md)
* [TXEventName](../enums/_augur_sdk_src_constants_.txeventname.md)

### Variables

* [CLAIM_GAS_COST](_augur_sdk_src_constants_.md#const-claim_gas_cost)
* [DEFAULT_GAS_PRICE_IN_GWEI](_augur_sdk_src_constants_.md#const-default_gas_price_in_gwei)
* [ETHER](_augur_sdk_src_constants_.md#const-ether)
* [EULERS_NUMBER](_augur_sdk_src_constants_.md#const-eulers_number)
* [GENESIS](_augur_sdk_src_constants_.md#const-genesis)
* [INIT_REPORTING_FEE_DIVISOR](_augur_sdk_src_constants_.md#const-init_reporting_fee_divisor)
* [INVALID_OUTCOME](_augur_sdk_src_constants_.md#const-invalid_outcome)
* [MALFORMED_OUTCOME](_augur_sdk_src_constants_.md#const-malformed_outcome)
* [MAX_FILLS_PER_TX](_augur_sdk_src_constants_.md#const-max_fills_per_tx)
* [MAX_GAS_LIMIT_FOR_TRADE](_augur_sdk_src_constants_.md#const-max_gas_limit_for_trade)
* [MAX_TRADE_GAS_PERCENTAGE_DIVISOR](_augur_sdk_src_constants_.md#const-max_trade_gas_percentage_divisor)
* [MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI](_augur_sdk_src_constants_.md#const-minimum_invalid_order_value_in_atto_dai)
* [NULL_ADDRESS](_augur_sdk_src_constants_.md#const-null_address)
* [SECONDS_IN_AN_HOUR](_augur_sdk_src_constants_.md#const-seconds_in_an_hour)
* [SECONDS_IN_A_DAY](_augur_sdk_src_constants_.md#const-seconds_in_a_day)
* [SECONDS_IN_A_YEAR](_augur_sdk_src_constants_.md#const-seconds_in_a_year)
* [TRADE_GAS_BUFFER](_augur_sdk_src_constants_.md#const-trade_gas_buffer)
* [orderTypes](_augur_sdk_src_constants_.md#const-ordertypes)

### Functions

* [isSubscriptionEventName](_augur_sdk_src_constants_.md#issubscriptioneventname)

### Object literals

* [ORDER_TYPES](_augur_sdk_src_constants_.md#const-order_types)
* [PLACE_ORDER_NO_SHARES](_augur_sdk_src_constants_.md#const-place_order_no_shares)
* [PLACE_ORDER_WITH_SHARES](_augur_sdk_src_constants_.md#const-place_order_with_shares)
* [WORST_CASE_FILL](_augur_sdk_src_constants_.md#const-worst_case_fill)

## Variables

### `Const` CLAIM_GAS_COST

• **CLAIM_GAS_COST**: *BigNumber‹›* = new BigNumber(794379)

*Defined in [packages/augur-sdk/src/constants.ts:141](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L141)*

___

### `Const` DEFAULT_GAS_PRICE_IN_GWEI

• **DEFAULT_GAS_PRICE_IN_GWEI**: *4* = 4

*Defined in [packages/augur-sdk/src/constants.ts:154](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L154)*

___

### `Const` ETHER

• **ETHER**: *BigNumber‹›* = new ethersUtils.BigNumber(10).pow(18)

*Defined in [packages/augur-sdk/src/constants.ts:103](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L103)*

___

### `Const` EULERS_NUMBER

• **EULERS_NUMBER**: *2.71828182845905* = 2.71828182845905

*Defined in [packages/augur-sdk/src/constants.ts:156](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L156)*

___

### `Const` GENESIS

• **GENESIS**: *"Genesis"* = "Genesis"

*Defined in [packages/augur-sdk/src/constants.ts:166](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L166)*

___

### `Const` INIT_REPORTING_FEE_DIVISOR

• **INIT_REPORTING_FEE_DIVISOR**: *"10000"* = "10000"

*Defined in [packages/augur-sdk/src/constants.ts:168](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L168)*

___

### `Const` INVALID_OUTCOME

• **INVALID_OUTCOME**: *0* = 0

*Defined in [packages/augur-sdk/src/constants.ts:150](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L150)*

___

### `Const` MALFORMED_OUTCOME

• **MALFORMED_OUTCOME**: *"malformed outcome"* = "malformed outcome"

*Defined in [packages/augur-sdk/src/constants.ts:148](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L148)*

___

### `Const` MAX_FILLS_PER_TX

• **MAX_FILLS_PER_TX**: *BigNumber‹›* = new BigNumber("3", 10)

*Defined in [packages/augur-sdk/src/constants.ts:107](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L107)*

___

### `Const` MAX_GAS_LIMIT_FOR_TRADE

• **MAX_GAS_LIMIT_FOR_TRADE**: *BigNumber‹›* = new BigNumber("3500000", 10)

*Defined in [packages/augur-sdk/src/constants.ts:109](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L109)*

___

### `Const` MAX_TRADE_GAS_PERCENTAGE_DIVISOR

• **MAX_TRADE_GAS_PERCENTAGE_DIVISOR**: *100* = 100

*Defined in [packages/augur-sdk/src/constants.ts:152](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L152)*

___

### `Const` MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI

• **MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI**: *BigNumber‹›* = new BigNumber(10).multipliedBy(10**18)

*Defined in [packages/augur-sdk/src/constants.ts:158](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L158)*

___

### `Const` NULL_ADDRESS

• **NULL_ADDRESS**: *"0x0000000000000000000000000000000000000000"* = "0x0000000000000000000000000000000000000000"

*Defined in [packages/augur-sdk/src/constants.ts:5](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L5)*

___

### `Const` SECONDS_IN_AN_HOUR

• **SECONDS_IN_AN_HOUR**: *BigNumber‹›* = new BigNumber(3600, 10)

*Defined in [packages/augur-sdk/src/constants.ts:160](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L160)*

___

### `Const` SECONDS_IN_A_DAY

• **SECONDS_IN_A_DAY**: *BigNumber‹›* = new BigNumber(86400, 10)

*Defined in [packages/augur-sdk/src/constants.ts:162](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L162)*

___

### `Const` SECONDS_IN_A_YEAR

• **SECONDS_IN_A_YEAR**: *BigNumber‹›* = new BigNumber(SECONDS_IN_A_DAY).multipliedBy(365)

*Defined in [packages/augur-sdk/src/constants.ts:164](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L164)*

___

### `Const` TRADE_GAS_BUFFER

• **TRADE_GAS_BUFFER**: *BigNumber‹›* = new BigNumber("600000", 10)

*Defined in [packages/augur-sdk/src/constants.ts:105](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L105)*

___

### `Const` orderTypes

• **orderTypes**: *string[]* = ['0x00', '0x01']

*Defined in [packages/augur-sdk/src/constants.ts:201](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L201)*

## Functions

###  isSubscriptionEventName

▸ **isSubscriptionEventName**(`eventName`: string): *string | null*

*Defined in [packages/augur-sdk/src/constants.ts:74](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`eventName` | string |

**Returns:** *string | null*

## Object literals

### `Const` ORDER_TYPES

### ▪ **ORDER_TYPES**: *object*

*Defined in [packages/augur-sdk/src/constants.ts:143](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L143)*

###  ASK

• **ASK**: *BigNumber‹›* = new BigNumber(1)

*Defined in [packages/augur-sdk/src/constants.ts:145](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L145)*

###  BID

• **BID**: *BigNumber‹›* = new BigNumber(0)

*Defined in [packages/augur-sdk/src/constants.ts:144](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L144)*

___

### `Const` PLACE_ORDER_NO_SHARES

### ▪ **PLACE_ORDER_NO_SHARES**: *object*

*Defined in [packages/augur-sdk/src/constants.ts:111](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L111)*

###  2

• **2**: *BigNumber‹›* = new BigNumber("547694", 10)

*Defined in [packages/augur-sdk/src/constants.ts:112](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L112)*

###  3

• **3**: *BigNumber‹›* = new BigNumber("562138", 10)

*Defined in [packages/augur-sdk/src/constants.ts:113](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L113)*

###  4

• **4**: *BigNumber‹›* = new BigNumber("576582", 10)

*Defined in [packages/augur-sdk/src/constants.ts:114](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L114)*

###  5

• **5**: *BigNumber‹›* = new BigNumber("591026", 10)

*Defined in [packages/augur-sdk/src/constants.ts:115](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L115)*

###  6

• **6**: *BigNumber‹›* = new BigNumber("605470", 10)

*Defined in [packages/augur-sdk/src/constants.ts:116](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L116)*

###  7

• **7**: *BigNumber‹›* = new BigNumber("619914", 10)

*Defined in [packages/augur-sdk/src/constants.ts:117](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L117)*

###  8

• **8**: *BigNumber‹›* = new BigNumber("634358", 10)

*Defined in [packages/augur-sdk/src/constants.ts:118](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L118)*

___

### `Const` PLACE_ORDER_WITH_SHARES

### ▪ **PLACE_ORDER_WITH_SHARES**: *object*

*Defined in [packages/augur-sdk/src/constants.ts:121](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L121)*

###  2

• **2**: *BigNumber‹›* = new BigNumber("695034", 10)

*Defined in [packages/augur-sdk/src/constants.ts:122](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L122)*

###  3

• **3**: *BigNumber‹›* = new BigNumber("794664", 10)

*Defined in [packages/augur-sdk/src/constants.ts:123](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L123)*

###  4

• **4**: *BigNumber‹›* = new BigNumber("894294", 10)

*Defined in [packages/augur-sdk/src/constants.ts:124](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L124)*

###  5

• **5**: *BigNumber‹›* = new BigNumber("993924", 10)

*Defined in [packages/augur-sdk/src/constants.ts:125](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L125)*

###  6

• **6**: *BigNumber‹›* = new BigNumber("1093554", 10)

*Defined in [packages/augur-sdk/src/constants.ts:126](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L126)*

###  7

• **7**: *BigNumber‹›* = new BigNumber("1193184", 10)

*Defined in [packages/augur-sdk/src/constants.ts:127](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L127)*

###  8

• **8**: *BigNumber‹›* = new BigNumber("1292814", 10)

*Defined in [packages/augur-sdk/src/constants.ts:128](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L128)*

___

### `Const` WORST_CASE_FILL

### ▪ **WORST_CASE_FILL**: *object*

*Defined in [packages/augur-sdk/src/constants.ts:131](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L131)*

###  2

• **2**: *BigNumber‹›* = new BigNumber("935219", 10)

*Defined in [packages/augur-sdk/src/constants.ts:132](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L132)*

###  3

• **3**: *BigNumber‹›* = new BigNumber("996763", 10)

*Defined in [packages/augur-sdk/src/constants.ts:133](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L133)*

###  4

• **4**: *BigNumber‹›* = new BigNumber("1058302", 10)

*Defined in [packages/augur-sdk/src/constants.ts:134](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L134)*

###  5

• **5**: *BigNumber‹›* = new BigNumber("1119834", 10)

*Defined in [packages/augur-sdk/src/constants.ts:135](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L135)*

###  6

• **6**: *BigNumber‹›* = new BigNumber("1181369", 10)

*Defined in [packages/augur-sdk/src/constants.ts:136](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L136)*

###  7

• **7**: *BigNumber‹›* = new BigNumber("1242902", 10)

*Defined in [packages/augur-sdk/src/constants.ts:137](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L137)*

###  8

• **8**: *BigNumber‹›* = new BigNumber("1242902", 10)

*Defined in [packages/augur-sdk/src/constants.ts:138](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/constants.ts#L138)*
