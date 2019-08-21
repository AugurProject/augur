---
id: api-modules-packages-augur-sdk-src-constants-module
title: packages/augur-sdk/src/constants Module
sidebar_label: packages/augur-sdk/src/constants
---

[@augurproject/sdk](api-readme.md) > [[packages/augur-sdk/src/constants Module]](api-modules-packages-augur-sdk-src-constants-module.md)

## Module

### Enumerations

* [ACCOUNT_TYPES](api-enums-packages-augur-sdk-src-constants-account-types.md)
* [ControlMessageType](api-enums-packages-augur-sdk-src-constants-controlmessagetype.md)
* [SubscriptionEventName](api-enums-packages-augur-sdk-src-constants-subscriptioneventname.md)
* [TXEventName](api-enums-packages-augur-sdk-src-constants-txeventname.md)

### Variables

* [CLAIM_GAS_COST](api-modules-packages-augur-sdk-src-constants-module.md#claim_gas_cost)
* [DEFAULT_GAS_PRICE_IN_GWEI](api-modules-packages-augur-sdk-src-constants-module.md#default_gas_price_in_gwei)
* [ETHER](api-modules-packages-augur-sdk-src-constants-module.md#ether)
* [EULERS_NUMBER](api-modules-packages-augur-sdk-src-constants-module.md#eulers_number)
* [INVALID_OUTCOME](api-modules-packages-augur-sdk-src-constants-module.md#invalid_outcome)
* [MALFORMED_OUTCOME](api-modules-packages-augur-sdk-src-constants-module.md#malformed_outcome)
* [MAX_FILLS_PER_TX](api-modules-packages-augur-sdk-src-constants-module.md#max_fills_per_tx)
* [MAX_GAS_LIMIT_FOR_TRADE](api-modules-packages-augur-sdk-src-constants-module.md#max_gas_limit_for_trade)
* [MAX_TRADE_GAS_PERCENTAGE_DIVISOR](api-modules-packages-augur-sdk-src-constants-module.md#max_trade_gas_percentage_divisor)
* [MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI](api-modules-packages-augur-sdk-src-constants-module.md#minimum_invalid_order_value_in_atto_dai)
* [NULL_ADDRESS](api-modules-packages-augur-sdk-src-constants-module.md#null_address)
* [SECONDS_IN_YEAR](api-modules-packages-augur-sdk-src-constants-module.md#seconds_in_year)
* [TRADE_GAS_BUFFER](api-modules-packages-augur-sdk-src-constants-module.md#trade_gas_buffer)

### Functions

* [isSubscriptionEventName](api-modules-packages-augur-sdk-src-constants-module.md#issubscriptioneventname)

### Object literals

* [ORDER_TYPES](api-modules-packages-augur-sdk-src-constants-module.md#order_types)
* [PLACE_ORDER_NO_SHARES](api-modules-packages-augur-sdk-src-constants-module.md#place_order_no_shares)
* [PLACE_ORDER_WITH_SHARES](api-modules-packages-augur-sdk-src-constants-module.md#place_order_with_shares)
* [WORST_CASE_FILL](api-modules-packages-augur-sdk-src-constants-module.md#worst_case_fill)

---

## Variables

<a id="claim_gas_cost"></a>

### `<Const>` CLAIM_GAS_COST

**● CLAIM_GAS_COST**: *`BigNumber`* =  new BigNumber(667419)

*Defined in [packages/augur-sdk/src/constants.ts:123](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L123)*

___
<a id="default_gas_price_in_gwei"></a>

### `<Const>` DEFAULT_GAS_PRICE_IN_GWEI

**● DEFAULT_GAS_PRICE_IN_GWEI**: *`4`* = 4

*Defined in [packages/augur-sdk/src/constants.ts:136](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L136)*

___
<a id="ether"></a>

### `<Const>` ETHER

**● ETHER**: *`BigNumber`* =  new ethersUtils.BigNumber(10).pow(18)

*Defined in [packages/augur-sdk/src/constants.ts:85](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L85)*

___
<a id="eulers_number"></a>

### `<Const>` EULERS_NUMBER

**● EULERS_NUMBER**: *`2.71828182845905`* = 2.71828182845905

*Defined in [packages/augur-sdk/src/constants.ts:138](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L138)*

___
<a id="invalid_outcome"></a>

### `<Const>` INVALID_OUTCOME

**● INVALID_OUTCOME**: *`0`* = 0

*Defined in [packages/augur-sdk/src/constants.ts:132](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L132)*

___
<a id="malformed_outcome"></a>

### `<Const>` MALFORMED_OUTCOME

**● MALFORMED_OUTCOME**: *"malformed outcome"* = "malformed outcome"

*Defined in [packages/augur-sdk/src/constants.ts:130](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L130)*

___
<a id="max_fills_per_tx"></a>

### `<Const>` MAX_FILLS_PER_TX

**● MAX_FILLS_PER_TX**: *`BigNumber`* =  new BigNumber("3", 10)

*Defined in [packages/augur-sdk/src/constants.ts:89](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L89)*

___
<a id="max_gas_limit_for_trade"></a>

### `<Const>` MAX_GAS_LIMIT_FOR_TRADE

**● MAX_GAS_LIMIT_FOR_TRADE**: *`BigNumber`* =  new BigNumber("3500000", 10)

*Defined in [packages/augur-sdk/src/constants.ts:91](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L91)*

___
<a id="max_trade_gas_percentage_divisor"></a>

### `<Const>` MAX_TRADE_GAS_PERCENTAGE_DIVISOR

**● MAX_TRADE_GAS_PERCENTAGE_DIVISOR**: *`100`* = 100

*Defined in [packages/augur-sdk/src/constants.ts:134](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L134)*

___
<a id="minimum_invalid_order_value_in_atto_dai"></a>

### `<Const>` MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI

**● MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI**: *`BigNumber`* =  new BigNumber(10).multipliedBy(10**18)

*Defined in [packages/augur-sdk/src/constants.ts:140](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L140)*

___
<a id="null_address"></a>

### `<Const>` NULL_ADDRESS

**● NULL_ADDRESS**: *"0x0000000000000000000000000000000000000000"* = "0x0000000000000000000000000000000000000000"

*Defined in [packages/augur-sdk/src/constants.ts:4](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L4)*

___
<a id="seconds_in_year"></a>

### `<Const>` SECONDS_IN_YEAR

**● SECONDS_IN_YEAR**: *`BigNumber`* =  new BigNumber(60).multipliedBy(60).multipliedBy(24).multipliedBy(365)

*Defined in [packages/augur-sdk/src/constants.ts:142](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L142)*

___
<a id="trade_gas_buffer"></a>

### `<Const>` TRADE_GAS_BUFFER

**● TRADE_GAS_BUFFER**: *`BigNumber`* =  new BigNumber("100000", 10)

*Defined in [packages/augur-sdk/src/constants.ts:87](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L87)*

___

## Functions

<a id="issubscriptioneventname"></a>

###  isSubscriptionEventName

▸ **isSubscriptionEventName**(eventName: *`string`*): `string` \| `null`

*Defined in [packages/augur-sdk/src/constants.ts:56](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L56)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string` \| `null`

___

## Object literals

<a id="order_types"></a>

### `<Const>` ORDER_TYPES

**ORDER_TYPES**: *`object`*

*Defined in [packages/augur-sdk/src/constants.ts:125](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L125)*

<a id="order_types.ask"></a>

####  ASK

**● ASK**: *`BigNumber`* =  new BigNumber(1)

*Defined in [packages/augur-sdk/src/constants.ts:127](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L127)*

___
<a id="order_types.bid"></a>

####  BID

**● BID**: *`BigNumber`* =  new BigNumber(0)

*Defined in [packages/augur-sdk/src/constants.ts:126](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L126)*

___

___
<a id="place_order_no_shares"></a>

### `<Const>` PLACE_ORDER_NO_SHARES

**PLACE_ORDER_NO_SHARES**: *`object`*

*Defined in [packages/augur-sdk/src/constants.ts:93](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L93)*

<a id="place_order_no_shares.2"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("547694", 10)

*Defined in [packages/augur-sdk/src/constants.ts:94](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L94)*

___
<a id="place_order_no_shares.3"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("562138", 10)

*Defined in [packages/augur-sdk/src/constants.ts:95](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L95)*

___
<a id="place_order_no_shares.4"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("576582", 10)

*Defined in [packages/augur-sdk/src/constants.ts:96](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L96)*

___
<a id="place_order_no_shares.5"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("591026", 10)

*Defined in [packages/augur-sdk/src/constants.ts:97](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L97)*

___
<a id="place_order_no_shares.6"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("605470", 10)

*Defined in [packages/augur-sdk/src/constants.ts:98](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L98)*

___
<a id="place_order_no_shares.7"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("619914", 10)

*Defined in [packages/augur-sdk/src/constants.ts:99](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L99)*

___
<a id="place_order_no_shares.8"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("634358", 10)

*Defined in [packages/augur-sdk/src/constants.ts:100](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L100)*

___

___
<a id="place_order_with_shares"></a>

### `<Const>` PLACE_ORDER_WITH_SHARES

**PLACE_ORDER_WITH_SHARES**: *`object`*

*Defined in [packages/augur-sdk/src/constants.ts:103](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L103)*

<a id="place_order_with_shares.2-1"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("695034", 10)

*Defined in [packages/augur-sdk/src/constants.ts:104](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L104)*

___
<a id="place_order_with_shares.3-1"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("794664", 10)

*Defined in [packages/augur-sdk/src/constants.ts:105](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L105)*

___
<a id="place_order_with_shares.4-1"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("894294", 10)

*Defined in [packages/augur-sdk/src/constants.ts:106](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L106)*

___
<a id="place_order_with_shares.5-1"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("993924", 10)

*Defined in [packages/augur-sdk/src/constants.ts:107](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L107)*

___
<a id="place_order_with_shares.6-1"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("1093554", 10)

*Defined in [packages/augur-sdk/src/constants.ts:108](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L108)*

___
<a id="place_order_with_shares.7-1"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("1193184", 10)

*Defined in [packages/augur-sdk/src/constants.ts:109](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L109)*

___
<a id="place_order_with_shares.8-1"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("1292814", 10)

*Defined in [packages/augur-sdk/src/constants.ts:110](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L110)*

___

___
<a id="worst_case_fill"></a>

### `<Const>` WORST_CASE_FILL

**WORST_CASE_FILL**: *`object`*

*Defined in [packages/augur-sdk/src/constants.ts:113](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L113)*

<a id="worst_case_fill.2-2"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("933495", 10)

*Defined in [packages/augur-sdk/src/constants.ts:114](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L114)*

___
<a id="worst_case_fill.3-2"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("1172245", 10)

*Defined in [packages/augur-sdk/src/constants.ts:115](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L115)*

___
<a id="worst_case_fill.4-2"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("1410995", 10)

*Defined in [packages/augur-sdk/src/constants.ts:116](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L116)*

___
<a id="worst_case_fill.5-2"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("1649744", 10)

*Defined in [packages/augur-sdk/src/constants.ts:117](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L117)*

___
<a id="worst_case_fill.6-2"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("1888494", 10)

*Defined in [packages/augur-sdk/src/constants.ts:118](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L118)*

___
<a id="worst_case_fill.7-2"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("2127244", 10)

*Defined in [packages/augur-sdk/src/constants.ts:119](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L119)*

___
<a id="worst_case_fill.8-2"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("2365994", 10)

*Defined in [packages/augur-sdk/src/constants.ts:120](https://github.com/AugurProject/augur/blob/0ea8996003/packages/augur-sdk/src/constants.ts#L120)*

___

___

