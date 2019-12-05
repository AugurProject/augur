---
id: api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams
title: ZeroXPlaceTradeParams
sidebar_label: ZeroXPlaceTradeParams
---

[@augurproject/sdk](api-readme.md) > [[augur-sdk/src/api/ZeroX Module]](api-modules-augur-sdk-src-api-zerox-module.md) > [ZeroXPlaceTradeParams](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md)

## Interface

## Hierarchy

↳  [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md)

**↳ ZeroXPlaceTradeParams**

### Properties

* [amount](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#amount)
* [direction](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#direction)
* [doNotCreateOrders](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#donotcreateorders)
* [expirationTime](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#expirationtime)
* [fingerprint](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#fingerprint)
* [kycToken](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#kyctoken)
* [market](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#market)
* [numOutcomes](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#numoutcomes)
* [numTicks](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#numticks)
* [outcome](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#outcome)
* [price](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#price)
* [shares](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#shares)
* [tradeGroupId](api-interfaces-augur-sdk-src-api-zerox-zeroxplacetradeparams.md#tradegroupid)

---

## Properties

<a id="amount"></a>

###  amount

**● amount**: *`BigNumber`*

*Inherited from [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md).[amount](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md#amount)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:34](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L34)*

___
<a id="direction"></a>

###  direction

**● direction**: *`0` \| `1`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[direction](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#direction)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:14](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L14)*

___
<a id="donotcreateorders"></a>

###  doNotCreateOrders

**● doNotCreateOrders**: *`boolean`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[doNotCreateOrders](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#donotcreateorders)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:22](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L22)*

___
<a id="expirationtime"></a>

###  expirationTime

**● expirationTime**: *`BigNumber`*

*Defined in [augur-sdk/src/api/ZeroX.ts:67](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/ZeroX.ts#L67)*

___
<a id="fingerprint"></a>

###  fingerprint

**● fingerprint**: *`string`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[fingerprint](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#fingerprint)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:20](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L20)*

___
<a id="kyctoken"></a>

###  kycToken

**● kycToken**: *`string`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[kycToken](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#kyctoken)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:21](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L21)*

___
<a id="market"></a>

###  market

**● market**: *`string`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[market](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#market)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:15](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L15)*

___
<a id="numoutcomes"></a>

###  numOutcomes

**● numOutcomes**: *`3` \| `4` \| `5` \| `6` \| `7` \| `8`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[numOutcomes](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#numoutcomes)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:17](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L17)*

___
<a id="numticks"></a>

###  numTicks

**● numTicks**: *`BigNumber`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[numTicks](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#numticks)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:16](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L16)*

___
<a id="outcome"></a>

###  outcome

**● outcome**: *`0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[outcome](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#outcome)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:18](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L18)*

___
<a id="price"></a>

###  price

**● price**: *`BigNumber`*

*Inherited from [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md).[price](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md#price)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:35](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L35)*

___
<a id="shares"></a>

###  shares

**● shares**: *`BigNumber`*

*Inherited from [NativePlaceTradeChainParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md).[shares](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradechainparams.md#shares)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:36](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L36)*

___
<a id="tradegroupid"></a>

###  tradeGroupId

**● tradeGroupId**: *`string`*

*Inherited from [NativePlaceTradeParams](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md).[tradeGroupId](api-interfaces-augur-sdk-src-api-onchaintrade-nativeplacetradeparams.md#tradegroupid)*

*Defined in [augur-sdk/src/api/OnChainTrade.ts:19](https://github.com/AugurProject/augur/blob/0787bf1a23/packages/augur-sdk/src/api/OnChainTrade.ts#L19)*

___

