[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ZeroX"](../modules/_augur_sdk_src_api_zerox_.md) › [ZeroXPlaceTradeParams](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)

# Interface: ZeroXPlaceTradeParams

## Hierarchy

  ↳ [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)

  ↳ **ZeroXPlaceTradeParams**

## Index

### Properties

* [amount](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#amount)
* [direction](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#direction)
* [doNotCreateOrders](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#donotcreateorders)
* [expirationTime](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#expirationtime)
* [fingerprint](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#fingerprint)
* [market](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#market)
* [numOutcomes](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#numoutcomes)
* [numTicks](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#numticks)
* [outcome](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#outcome)
* [price](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#price)
* [shares](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#shares)
* [takerAddress](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#optional-takeraddress)
* [tradeGroupId](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#tradegroupid)

## Properties

###  amount

• **amount**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[amount](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#amount)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:34](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L34)*

___

###  direction

• **direction**: *[TradeDirection](../modules/_augur_sdk_src_state_logs_types_.md#tradedirection)*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[direction](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#direction)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L14)*

___

###  doNotCreateOrders

• **doNotCreateOrders**: *boolean*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[doNotCreateOrders](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#donotcreateorders)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L21)*

___

###  expirationTime

• **expirationTime**: *BigNumber*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:67](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/ZeroX.ts#L67)*

___

###  fingerprint

• **fingerprint**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[fingerprint](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#fingerprint)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:20](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L20)*

___

###  market

• **market**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[market](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#market)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:15](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L15)*

___

###  numOutcomes

• **numOutcomes**: *[NumOutcomes](../modules/_augur_sdk_src_state_logs_types_.md#numoutcomes)*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[numOutcomes](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#numoutcomes)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:17](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L17)*

___

###  numTicks

• **numTicks**: *BigNumber*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[numTicks](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#numticks)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:16](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L16)*

___

###  outcome

• **outcome**: *[OutcomeNumber](../modules/_augur_sdk_src_state_logs_types_.md#outcomenumber)*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[outcome](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#outcome)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:18](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L18)*

___

###  price

• **price**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[price](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#price)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:35](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L35)*

___

###  shares

• **shares**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[shares](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#shares)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:36](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L36)*

___

### `Optional` takerAddress

• **takerAddress**? : *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[takerAddress](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#optional-takeraddress)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L22)*

___

###  tradeGroupId

• **tradeGroupId**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[tradeGroupId](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#tradegroupid)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L19)*
