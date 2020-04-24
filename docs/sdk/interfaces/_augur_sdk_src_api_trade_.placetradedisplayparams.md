[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/Trade"](../modules/_augur_sdk_src_api_trade_.md) › [PlaceTradeDisplayParams](_augur_sdk_src_api_trade_.placetradedisplayparams.md)

# Interface: PlaceTradeDisplayParams

## Hierarchy

  ↳ [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md)

  ↳ **PlaceTradeDisplayParams**

## Index

### Properties

* [direction](_augur_sdk_src_api_trade_.placetradedisplayparams.md#direction)
* [displayAmount](_augur_sdk_src_api_trade_.placetradedisplayparams.md#displayamount)
* [displayMaxPrice](_augur_sdk_src_api_trade_.placetradedisplayparams.md#displaymaxprice)
* [displayMinPrice](_augur_sdk_src_api_trade_.placetradedisplayparams.md#displayminprice)
* [displayPrice](_augur_sdk_src_api_trade_.placetradedisplayparams.md#displayprice)
* [displayShares](_augur_sdk_src_api_trade_.placetradedisplayparams.md#displayshares)
* [doNotCreateOrders](_augur_sdk_src_api_trade_.placetradedisplayparams.md#donotcreateorders)
* [expirationTime](_augur_sdk_src_api_trade_.placetradedisplayparams.md#optional-expirationtime)
* [fingerprint](_augur_sdk_src_api_trade_.placetradedisplayparams.md#fingerprint)
* [market](_augur_sdk_src_api_trade_.placetradedisplayparams.md#market)
* [numOutcomes](_augur_sdk_src_api_trade_.placetradedisplayparams.md#numoutcomes)
* [numTicks](_augur_sdk_src_api_trade_.placetradedisplayparams.md#numticks)
* [outcome](_augur_sdk_src_api_trade_.placetradedisplayparams.md#outcome)
* [takerAddress](_augur_sdk_src_api_trade_.placetradedisplayparams.md#optional-takeraddress)
* [tradeGroupId](_augur_sdk_src_api_trade_.placetradedisplayparams.md#tradegroupid)

## Properties

###  direction

• **direction**: *[TradeDirection](../modules/_augur_sdk_src_state_logs_types_.md#tradedirection)*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[direction](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#direction)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:14](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L14)*

___

###  displayAmount

• **displayAmount**: *BigNumber*

*Inherited from [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md).[displayAmount](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md#displayamount)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:28](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L28)*

___

###  displayMaxPrice

• **displayMaxPrice**: *BigNumber*

*Inherited from [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md).[displayMaxPrice](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md#displaymaxprice)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:27](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L27)*

___

###  displayMinPrice

• **displayMinPrice**: *BigNumber*

*Inherited from [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md).[displayMinPrice](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md#displayminprice)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:26](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L26)*

___

###  displayPrice

• **displayPrice**: *BigNumber*

*Inherited from [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md).[displayPrice](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md#displayprice)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:29](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L29)*

___

###  displayShares

• **displayShares**: *BigNumber*

*Inherited from [NativePlaceTradeDisplayParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md).[displayShares](_augur_sdk_src_api_onchaintrade_.nativeplacetradedisplayparams.md#displayshares)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:30](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L30)*

___

###  doNotCreateOrders

• **doNotCreateOrders**: *boolean*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[doNotCreateOrders](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#donotcreateorders)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:21](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L21)*

___

### `Optional` expirationTime

• **expirationTime**? : *BigNumber*

*Defined in [packages/augur-sdk/src/api/Trade.ts:25](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/Trade.ts#L25)*

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

### `Optional` takerAddress

• **takerAddress**? : *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[takerAddress](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#optional-takeraddress)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:22](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L22)*

___

###  tradeGroupId

• **tradeGroupId**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[tradeGroupId](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#tradegroupid)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:19](https://github.com/AugurProject/augur/blob/69c4be52bf/packages/augur-sdk/src/api/OnChainTrade.ts#L19)*
