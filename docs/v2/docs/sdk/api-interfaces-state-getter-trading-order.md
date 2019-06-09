---
id: api-interfaces-state-getter-trading-order
title: Order
sidebar_label: Order
---

[@augurproject/sdk](api-readme.md) > [[state/getter/Trading Module]](api-modules-state-getter-trading-module.md) > [Order](api-interfaces-state-getter-trading-order.md)

## Interface

## Hierarchy

**Order**

### Properties

* [amount](api-interfaces-state-getter-trading-order.md#amount)
* [canceledBlockNumber](api-interfaces-state-getter-trading-order.md#canceledblocknumber)
* [canceledTime](api-interfaces-state-getter-trading-order.md#canceledtime)
* [canceledTransactionHash](api-interfaces-state-getter-trading-order.md#canceledtransactionhash)
* [creationBlockNumber](api-interfaces-state-getter-trading-order.md#creationblocknumber)
* [creationTime](api-interfaces-state-getter-trading-order.md#creationtime)
* [fullPrecisionAmount](api-interfaces-state-getter-trading-order.md#fullprecisionamount)
* [fullPrecisionPrice](api-interfaces-state-getter-trading-order.md#fullprecisionprice)
* [logIndex](api-interfaces-state-getter-trading-order.md#logindex)
* [orderId](api-interfaces-state-getter-trading-order.md#orderid)
* [orderState](api-interfaces-state-getter-trading-order.md#orderstate)
* [originalFullPrecisionAmount](api-interfaces-state-getter-trading-order.md#originalfullprecisionamount)
* [owner](api-interfaces-state-getter-trading-order.md#owner)
* [price](api-interfaces-state-getter-trading-order.md#price)
* [sharesEscrowed](api-interfaces-state-getter-trading-order.md#sharesescrowed)
* [tokensEscrowed](api-interfaces-state-getter-trading-order.md#tokensescrowed)
* [transactionHash](api-interfaces-state-getter-trading-order.md#transactionhash)

---

## Properties

<a id="amount"></a>

###  amount

**● amount**: *`string`*

*Defined in [state/getter/Trading.ts:74](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L74)*

___
<a id="canceledblocknumber"></a>

### `<Optional>` canceledBlockNumber

**● canceledBlockNumber**: *`undefined` \| `string`*

*Defined in [state/getter/Trading.ts:79](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L79)*

___
<a id="canceledtime"></a>

### `<Optional>` canceledTime

**● canceledTime**: *`undefined` \| `string`*

*Defined in [state/getter/Trading.ts:81](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L81)*

___
<a id="canceledtransactionhash"></a>

### `<Optional>` canceledTransactionHash

**● canceledTransactionHash**: *`undefined` \| `string`*

*Defined in [state/getter/Trading.ts:80](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L80)*

___
<a id="creationblocknumber"></a>

###  creationBlockNumber

**● creationBlockNumber**: *`number`*

*Defined in [state/getter/Trading.ts:83](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L83)*

___
<a id="creationtime"></a>

###  creationTime

**● creationTime**: *`number`*

*Defined in [state/getter/Trading.ts:82](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L82)*

___
<a id="fullprecisionamount"></a>

###  fullPrecisionAmount

**● fullPrecisionAmount**: *`string`*

*Defined in [state/getter/Trading.ts:76](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L76)*

___
<a id="fullprecisionprice"></a>

###  fullPrecisionPrice

**● fullPrecisionPrice**: *`string`*

*Defined in [state/getter/Trading.ts:75](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L75)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Defined in [state/getter/Trading.ts:70](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L70)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *`string`*

*Defined in [state/getter/Trading.ts:68](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L68)*

___
<a id="orderstate"></a>

###  orderState

**● orderState**: *[OrderState](api-enums-state-getter-trading-orderstate.md)*

*Defined in [state/getter/Trading.ts:72](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L72)*

___
<a id="originalfullprecisionamount"></a>

###  originalFullPrecisionAmount

**● originalFullPrecisionAmount**: *`string`*

*Defined in [state/getter/Trading.ts:84](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L84)*

___
<a id="owner"></a>

###  owner

**● owner**: *`string`*

*Defined in [state/getter/Trading.ts:71](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L71)*

___
<a id="price"></a>

###  price

**● price**: *`string`*

*Defined in [state/getter/Trading.ts:73](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L73)*

___
<a id="sharesescrowed"></a>

###  sharesEscrowed

**● sharesEscrowed**: *`string`*

*Defined in [state/getter/Trading.ts:78](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L78)*

___
<a id="tokensescrowed"></a>

###  tokensEscrowed

**● tokensEscrowed**: *`string`*

*Defined in [state/getter/Trading.ts:77](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L77)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *`string`*

*Defined in [state/getter/Trading.ts:69](https://github.com/AugurProject/augur/blob/06e47ad207/packages/augur-sdk/src/state/getter/Trading.ts#L69)*

___

