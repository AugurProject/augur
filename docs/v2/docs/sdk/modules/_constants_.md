[@augurproject/sdk](../README.md) > ["constants"](../modules/_constants_.md)

# External module: "constants"

## Index

### Enumerations

* [ACCOUNT_TYPES](../enums/_constants_.account_types.md)
* [ControlMessageType](../enums/_constants_.controlmessagetype.md)
* [SubscriptionEventNames](../enums/_constants_.subscriptioneventnames.md)

### Variables

* [ETHER](_constants_.md#ether)
* [MAX_FILLS_PER_TX](_constants_.md#max_fills_per_tx)
* [MAX_GAS_LIMIT_FOR_TRADE](_constants_.md#max_gas_limit_for_trade)
* [TRADE_GAS_BUFFER](_constants_.md#trade_gas_buffer)

### Functions

* [isSubscriptionEventName](_constants_.md#issubscriptioneventname)

### Object literals

* [PLACE_ORDER_NO_SHARES](_constants_.md#place_order_no_shares)
* [PLACE_ORDER_WITH_SHARES](_constants_.md#place_order_with_shares)
* [WORST_CASE_FILL](_constants_.md#worst_case_fill)

---

## Variables

<a id="ether"></a>

### `<Const>` ETHER

**● ETHER**: *`any`* =  new ethersUtils.BigNumber(10).pow(18)

*Defined in [constants.ts:72](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L72)*

___
<a id="max_fills_per_tx"></a>

### `<Const>` MAX_FILLS_PER_TX

**● MAX_FILLS_PER_TX**: *`BigNumber`* =  new BigNumber("3", 10)

*Defined in [constants.ts:76](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L76)*

___
<a id="max_gas_limit_for_trade"></a>

### `<Const>` MAX_GAS_LIMIT_FOR_TRADE

**● MAX_GAS_LIMIT_FOR_TRADE**: *`BigNumber`* =  new BigNumber("3500000", 10)

*Defined in [constants.ts:78](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L78)*

___
<a id="trade_gas_buffer"></a>

### `<Const>` TRADE_GAS_BUFFER

**● TRADE_GAS_BUFFER**: *`BigNumber`* =  new BigNumber("100000", 10)

*Defined in [constants.ts:74](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L74)*

___

## Functions

<a id="issubscriptioneventname"></a>

###  isSubscriptionEventName

▸ **isSubscriptionEventName**(eventName: *`string`*): `string` \| `null`

*Defined in [constants.ts:43](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| eventName | `string` |

**Returns:** `string` \| `null`

___

## Object literals

<a id="place_order_no_shares"></a>

### `<Const>` PLACE_ORDER_NO_SHARES

**PLACE_ORDER_NO_SHARES**: *`object`*

*Defined in [constants.ts:80](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L80)*

<a id="place_order_no_shares.2"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("547694", 10)

*Defined in [constants.ts:81](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L81)*

___
<a id="place_order_no_shares.3"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("562138", 10)

*Defined in [constants.ts:82](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L82)*

___
<a id="place_order_no_shares.4"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("576582", 10)

*Defined in [constants.ts:83](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L83)*

___
<a id="place_order_no_shares.5"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("591026", 10)

*Defined in [constants.ts:84](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L84)*

___
<a id="place_order_no_shares.6"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("605470", 10)

*Defined in [constants.ts:85](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L85)*

___
<a id="place_order_no_shares.7"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("619914", 10)

*Defined in [constants.ts:86](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L86)*

___
<a id="place_order_no_shares.8"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("634358", 10)

*Defined in [constants.ts:87](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L87)*

___

___
<a id="place_order_with_shares"></a>

### `<Const>` PLACE_ORDER_WITH_SHARES

**PLACE_ORDER_WITH_SHARES**: *`object`*

*Defined in [constants.ts:90](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L90)*

<a id="place_order_with_shares.2-1"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("695034", 10)

*Defined in [constants.ts:91](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L91)*

___
<a id="place_order_with_shares.3-1"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("794664", 10)

*Defined in [constants.ts:92](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L92)*

___
<a id="place_order_with_shares.4-1"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("894294", 10)

*Defined in [constants.ts:93](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L93)*

___
<a id="place_order_with_shares.5-1"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("993924", 10)

*Defined in [constants.ts:94](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L94)*

___
<a id="place_order_with_shares.6-1"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("1093554", 10)

*Defined in [constants.ts:95](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L95)*

___
<a id="place_order_with_shares.7-1"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("1193184", 10)

*Defined in [constants.ts:96](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L96)*

___
<a id="place_order_with_shares.8-1"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("1292814", 10)

*Defined in [constants.ts:97](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L97)*

___

___
<a id="worst_case_fill"></a>

### `<Const>` WORST_CASE_FILL

**WORST_CASE_FILL**: *`object`*

*Defined in [constants.ts:100](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L100)*

<a id="worst_case_fill.2-2"></a>

####  2

**● 2**: *`BigNumber`* =  new BigNumber("933495", 10)

*Defined in [constants.ts:101](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L101)*

___
<a id="worst_case_fill.3-2"></a>

####  3

**● 3**: *`BigNumber`* =  new BigNumber("1172245", 10)

*Defined in [constants.ts:102](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L102)*

___
<a id="worst_case_fill.4-2"></a>

####  4

**● 4**: *`BigNumber`* =  new BigNumber("1410995", 10)

*Defined in [constants.ts:103](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L103)*

___
<a id="worst_case_fill.5-2"></a>

####  5

**● 5**: *`BigNumber`* =  new BigNumber("1649744", 10)

*Defined in [constants.ts:104](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L104)*

___
<a id="worst_case_fill.6-2"></a>

####  6

**● 6**: *`BigNumber`* =  new BigNumber("1888494", 10)

*Defined in [constants.ts:105](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L105)*

___
<a id="worst_case_fill.7-2"></a>

####  7

**● 7**: *`BigNumber`* =  new BigNumber("2127244", 10)

*Defined in [constants.ts:106](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L106)*

___
<a id="worst_case_fill.8-2"></a>

####  8

**● 8**: *`BigNumber`* =  new BigNumber("2365994", 10)

*Defined in [constants.ts:107](https://github.com/AugurProject/augur/blob/1991ef64ef/packages/augur-sdk/src/constants.ts#L107)*

___

___

