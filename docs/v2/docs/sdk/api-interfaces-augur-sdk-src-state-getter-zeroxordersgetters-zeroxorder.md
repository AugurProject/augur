---
id: api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder
title: ZeroXOrder
sidebar_label: ZeroXOrder
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/state/getter/ZeroXOrdersGetters Module]](api-modules-augur-sdk-src-state-getter-zeroxordersgetters-module.md) > [ZeroXOrder](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md)

## Interface

## Hierarchy

 [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md)

**↳ ZeroXOrder**

### Properties

* [amount](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#amount)
* [amountFilled](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#amountfilled)
* [canceledBlockNumber](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#canceledblocknumber)
* [canceledTime](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#canceledtime)
* [canceledTransactionHash](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#canceledtransactionhash)
* [creationBlockNumber](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#creationblocknumber)
* [creationTime](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#creationtime)
* [expirationTimeSeconds](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#expirationtimeseconds)
* [fullPrecisionAmount](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#fullprecisionamount)
* [fullPrecisionPrice](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#fullprecisionprice)
* [kycToken](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#kyctoken)
* [logIndex](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#logindex)
* [makerAssetAmount](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#makerassetamount)
* [makerAssetData](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#makerassetdata)
* [orderId](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#orderid)
* [orderState](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#orderstate)
* [originalFullPrecisionAmount](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#originalfullprecisionamount)
* [owner](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#owner)
* [price](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#price)
* [salt](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#salt)
* [sharesEscrowed](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#sharesescrowed)
* [signature](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#signature)
* [takerAssetAmount](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#takerassetamount)
* [takerAssetData](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#takerassetdata)
* [tokensEscrowed](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#tokensescrowed)
* [transactionHash](api-interfaces-augur-sdk-src-state-getter-zeroxordersgetters-zeroxorder.md#transactionhash)

---

## Properties

<a id="amount"></a>

###  amount

**● amount**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[amount](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#amount)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:108](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L108)*

___
<a id="amountfilled"></a>

###  amountFilled

**● amountFilled**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[amountFilled](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#amountfilled)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:109](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L109)*

___
<a id="canceledblocknumber"></a>

### `<Optional>` canceledBlockNumber

**● canceledBlockNumber**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[canceledBlockNumber](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#canceledblocknumber)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:115](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L115)*

___
<a id="canceledtime"></a>

### `<Optional>` canceledTime

**● canceledTime**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[canceledTime](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#canceledtime)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:117](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L117)*

___
<a id="canceledtransactionhash"></a>

### `<Optional>` canceledTransactionHash

**● canceledTransactionHash**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[canceledTransactionHash](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#canceledtransactionhash)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:116](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L116)*

___
<a id="creationblocknumber"></a>

###  creationBlockNumber

**● creationBlockNumber**: *`number`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[creationBlockNumber](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#creationblocknumber)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:119](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L119)*

___
<a id="creationtime"></a>

###  creationTime

**● creationTime**: *`number`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[creationTime](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#creationtime)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:118](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L118)*

___
<a id="expirationtimeseconds"></a>

###  expirationTimeSeconds

**● expirationTimeSeconds**: *`BigNumber`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L18)*

___
<a id="fullprecisionamount"></a>

###  fullPrecisionAmount

**● fullPrecisionAmount**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[fullPrecisionAmount](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#fullprecisionamount)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:111](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L111)*

___
<a id="fullprecisionprice"></a>

###  fullPrecisionPrice

**● fullPrecisionPrice**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[fullPrecisionPrice](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#fullprecisionprice)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:110](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L110)*

___
<a id="kyctoken"></a>

### `<Optional>` kycToken

**● kycToken**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[kycToken](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#kyctoken)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:112](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L112)*

___
<a id="logindex"></a>

###  logIndex

**● logIndex**: *`number`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[logIndex](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#logindex)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:104](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L104)*

___
<a id="makerassetamount"></a>

###  makerAssetAmount

**● makerAssetAmount**: *`BigNumber`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L19)*

___
<a id="makerassetdata"></a>

###  makerAssetData

**● makerAssetData**: *`string`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L22)*

___
<a id="orderid"></a>

###  orderId

**● orderId**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[orderId](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#orderid)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:102](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L102)*

___
<a id="orderstate"></a>

###  orderState

**● orderState**: *[OrderState](api-enums-augur-sdk-src-state-getter-onchaintrading-orderstate.md)*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[orderState](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#orderstate)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:106](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L106)*

___
<a id="originalfullprecisionamount"></a>

###  originalFullPrecisionAmount

**● originalFullPrecisionAmount**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[originalFullPrecisionAmount](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#originalfullprecisionamount)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:120](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L120)*

___
<a id="owner"></a>

###  owner

**● owner**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[owner](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#owner)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:105](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L105)*

___
<a id="price"></a>

###  price

**● price**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[price](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#price)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:107](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L107)*

___
<a id="salt"></a>

###  salt

**● salt**: *`BigNumber`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L21)*

___
<a id="sharesescrowed"></a>

###  sharesEscrowed

**● sharesEscrowed**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[sharesEscrowed](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#sharesescrowed)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:114](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L114)*

___
<a id="signature"></a>

###  signature

**● signature**: *`string`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:24](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L24)*

___
<a id="takerassetamount"></a>

###  takerAssetAmount

**● takerAssetAmount**: *`BigNumber`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L20)*

___
<a id="takerassetdata"></a>

###  takerAssetData

**● takerAssetData**: *`string`*

*Defined in [augur-sdk/src/state/getter/ZeroXOrdersGetters.ts:23](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/ZeroXOrdersGetters.ts#L23)*

___
<a id="tokensescrowed"></a>

###  tokensEscrowed

**● tokensEscrowed**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[tokensEscrowed](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#tokensescrowed)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:113](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L113)*

___
<a id="transactionhash"></a>

###  transactionHash

**● transactionHash**: *`string`*

*Inherited from [Order](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md).[transactionHash](api-interfaces-augur-sdk-src-state-getter-onchaintrading-order.md#transactionhash)*

*Defined in [augur-sdk/src/state/getter/OnChainTrading.ts:103](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/state/getter/OnChainTrading.ts#L103)*

___

